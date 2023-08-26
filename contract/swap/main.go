package swap

import (
	"github.com/nspcc-dev/neo-go/pkg/interop"
	"github.com/nspcc-dev/neo-go/pkg/interop/native/gas"
	"github.com/nspcc-dev/neo-go/pkg/interop/native/neo"
	"github.com/nspcc-dev/neo-go/pkg/interop/runtime"
	"github.com/nspcc-dev/neo-go/pkg/interop/storage"
)

var ctx storage.Context

func init() {
	ctx = storage.GetContext()
}

func DepositNeo(amount int) {
	sucess := neo.Transfer(runtime.GetCallingScriptHash(), runtime.GetExecutingScriptHash(), amount, "")
	runtime.Notify("neo", sucess)
}

func DepositGas(amount int) {
	sucess := gas.Transfer(runtime.GetCallingScriptHash(), runtime.GetExecutingScriptHash(), amount, "")
	runtime.Notify("gas", sucess)
}

func OnNEP17Payment(from interop.Hash160, amount int, data any) {
	runtime.Notify("nep17payment", amount)
}

func Swap(input interop.Hash160, to interop.Hash160, amount int) {
	if input.Equals(neo.Hash) {
		outamount := amount / 10
		gas.Transfer(runtime.GetExecutingScriptHash(), to, outamount, nil)
	} else {
		outamount := amount * 10
		neo.Transfer(input, to, outamount, nil)
	}

	runtime.Notify("swap", input, to, amount)
}
