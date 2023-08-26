package neoapac

import (
	"github.com/nspcc-dev/neo-go/pkg/interop"
	"github.com/nspcc-dev/neo-go/pkg/interop/contract"
	"github.com/nspcc-dev/neo-go/pkg/interop/native/crypto"
	"github.com/nspcc-dev/neo-go/pkg/interop/native/gas"
	"github.com/nspcc-dev/neo-go/pkg/interop/runtime"
	"github.com/nspcc-dev/neo-go/pkg/interop/storage"
)

type PostOpMode int

const (
	OP_SUCCEDED PostOpMode = iota
	OP_REVERTED
	POST_OP_REVERTED
)

var ctx storage.Context

type ErrorCodes int

const (
	GAS_LIMIT_EXCEEDED ErrorCodes = iota + 1
)

type (
	DepositInfo struct {
		deposit         int
		staked          bool
		stake           int
		unstakeDelaySec int
		withdrawTime    int
	}

	StakeInfo struct {
		Stake           int
		UnstakeDelaySec int
	}
)

type (
	UserOperation struct {
		Sender   interop.Hash160
		To       interop.Hash160
		Method   string
		Nonce    int
		InitCode []byte
		CallData []byte
		// gas stuff
		PaymasterAndData []byte
		Signature        interop.Signature
		Pubkey           interop.PublicKey
		CallGasLimit     int
		Sponsored        bool
	}

	UserOpsPerAggregator struct {
		Userops []UserOperation
		// replace with some interface
		Aggregator interop.Hash160
		// replace with bytes maybe
		Signature interop.Signature
	}

	ReturnInfo struct {
		preOpGas         int
		prefund          int
		sigFailed        bool
		validAfter       int
		validUntil       int
		paymasterContext []byte
	}

	AggregatorStakeInfo struct {
		Aggregator interop.Hash160
		Stake      StakeInfo
	}

	MemoryUserOp struct {
		Sender               interop.Hash160
		Nonce                int
		CallGasLimit         int
		VerificationGasLimit int
		PreVerificationGas   int
		Paymaster            interop.Hash160
		MaxFeePerGas         int
		MaxPriorityFeePerGas int
	}

	UserOpInfo struct {
		MUserOp       MemoryUserOp
		UserOpHash    []byte
		Prefund       int
		ContextOffset int
		PreOpGas      int
	}
)

func intToBytes(n int) []byte {
	bytes := make([]byte, 4) // 4 bytes for 32-bit int

	// Convert to BigEndian byte order
	bytes[0] = byte((n >> 24) & 0xFF)
	bytes[1] = byte((n >> 16) & 0xFF)
	bytes[2] = byte((n >> 8) & 0xFF)
	bytes[3] = byte(n & 0xFF)

	return bytes
}

func (u UserOperation) Hash() []byte {
	var hash []byte
	chainId := runtime.GetNetwork()
	hash = append(hash, u.Sender...)
	hash = append(hash, u.Method...)
	hash = append(hash, u.InitCode...)
	hash = append(hash, u.CallData...)
	hash = append(hash, intToBytes(u.CallGasLimit)...)
	hash = append(hash, intToBytes(chainId)...)
	hash = append(hash, intToBytes(u.Nonce)...)

	return hash
}

func init() {
	ctx = storage.GetContext()
}

func Sponsor(to interop.Hash160, depositAmount int) {
	amount := storage.Get(ctx, to).(int)

	gas.Transfer(runtime.GetEntryScriptHash(), runtime.GetExecutingScriptHash(), depositAmount, "")
	storage.Put(storage.GetContext(), to, amount+depositAmount)
}

func GetUserOpHash(opInfo UserOperation) []byte {
	return crypto.Sha256(opInfo.Hash())
}

func validateSponsorAmount(to interop.Hash160, gas int) bool {
	amount := storage.Get(ctx, to).(int)

	return amount >= gas
}

func OnNEP17Payment(from interop.Hash160, amount int, data any) {
	runtime.Notify("nep17payment", amount)
}

func deductGasUsed(to interop.Hash160, gasUsed int) {
	amount := storage.Get(ctx, to).(int)

	if validateSponsorAmount(to, gasUsed) {
		panic("sponsor gas is less")
	}

	storage.Put(ctx, to, amount-gasUsed)
	runtime.Log("sponsor validated")
}

func validateAndTransfer(from, to interop.Hash160, gasUsed int) {
	deductGasUsed(from, gasUsed)

	// transfer to beneficiary
	gas.Transfer(runtime.GetExecutingScriptHash(), to, gasUsed, "")
}

func HandleOps(ops []UserOperation, beneficiary interop.Hash160) {
	// write the erc4337 logic for this function
	for _, op := range ops {
		gasleft := runtime.GasLeft()
		err := InnerHandleOp(op)
		if err != 0 {
			panic("error from inner handle op")
		}
		spent := gasleft - runtime.GasLeft()
		if op.Sponsored {
			validateAndTransfer(op.Sender, beneficiary, spent)
		} else {
			//TODO: non sponsored tx not possible for now
		}
	}
}

//func GetHash(message string) []byte {
//
//	return crypto.Sha256([]byte(message))
//}

func GetCheckSignature(message []byte, pubKey interop.PublicKey, sig interop.Signature) bool {
	return crypto.VerifyWithECDsa(message, pubKey, sig, crypto.Secp256r1)
}

func InnerHandleOp(opInfo UserOperation) ErrorCodes {
	if runtime.GasLeft() < opInfo.CallGasLimit+5000 {
		return GAS_LIMIT_EXCEEDED
	}
	runtime.GetCallingScriptHash()
	runtime.Notify("SomeInteger", opInfo.Sender, opInfo.Method, opInfo.InitCode, opInfo.CallData, opInfo.CallGasLimit, opInfo.Nonce)
	if !crypto.VerifyWithECDsa(GetUserOpHash(opInfo), opInfo.Pubkey, opInfo.Signature, crypto.Secp256r1) {
		panic("AA50 invalid signature")
	}

	contract.Call(opInfo.To, opInfo.Method, contract.All, opInfo.CallData)

	return 0
}

func handlePostOp(index int, mode PostOpMode, opInfo UserOpInfo, context []byte, actualGasCost int) {
	mUserOp := opInfo.MUserOp
	paymaster := mUserOp.Paymaster
	var _ interop.Hash160
	if len(paymaster) == 0 {
		_ = mUserOp.Sender
	} else {
		_ = paymaster
		if len(context) > 0 {
			if mode != POST_OP_REVERTED {
				contract.Call(paymaster, "postOp", contract.All, mode, context, actualGasCost)
			} else {
				reason := contract.Call(paymaster, "postOp", contract.All, mode, context, actualGasCost)
				panic("AA50 postOp reverted " + reason.(string))
			}
		}
	}

	// deposit logic not here
	success := mode == OP_SUCCEDED
	runtime.Notify("handle post op", opInfo.UserOpHash, mUserOp.Sender, mUserOp.Paymaster, mUserOp.Nonce, success)
}

func HandleAggregatedOps(opsPerAggregator []UserOpsPerAggregator, beneficiary interop.Hash160) {
	for _, opa := range opsPerAggregator {
		op := opa.Userops
		aggregator := opa.Aggregator
		if aggregator.Equals(interop.Hash160([]byte{1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1})) {
			panic("AA96 invalid signature")
		}

		if !aggregator.Equals(interop.Hash160([]byte{0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0})) {
			contract.Call(aggregator, "ValidateSignatures", contract.All, op, opa.Signature)
		}

		// do prepayment loops and  other stuff
		for _, opa := range opsPerAggregator {
			for _, _ = range opa.Userops {
				//innerHandleOp(op)
			}
		}
	}
}
