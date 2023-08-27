package limit

import (
	"github.com/nspcc-dev/neo-go/pkg/interop"
	"github.com/nspcc-dev/neo-go/pkg/interop/contract"
	"github.com/nspcc-dev/neo-go/pkg/interop/native/oracle"
	"github.com/nspcc-dev/neo-go/pkg/interop/native/std"
	"github.com/nspcc-dev/neo-go/pkg/interop/runtime"
	"github.com/nspcc-dev/neo-go/pkg/interop/storage"
	//"github.com/nspcc-dev/neo-go/pkg/interop/storage"
)

var url string

type Tx struct {
	TokenIn    interop.Hash160
	TokenOut   interop.Hash160
	amount     int
	To         interop.Hash160
	dex        interop.Hash160
	UpperBound int
	LowerBound int
}

type OtherTx struct {
	Url        string
	Price      string
	TokenIn    interop.Hash160
	TokenOut   interop.Hash160
	Amount     int
	To         interop.Hash160
	Dex        interop.Hash160
	UpperBound int
	LowerBound int
}

var ctx storage.Context

func init() {
	ctx = storage.GetContext()
}

func RequestContract(tx []byte) {
	// deserialize
	requestdetail := std.Deserialize(tx).(OtherTx)
	runtime.Notify("pricefor", requestdetail.Url, requestdetail.Url)

	newtx := Tx{
		TokenIn:    requestdetail.TokenIn,
		TokenOut:   requestdetail.TokenOut,
		amount:     requestdetail.Amount,
		To:         requestdetail.To,
		dex:        requestdetail.Dex,
		UpperBound: requestdetail.UpperBound,
		LowerBound: requestdetail.LowerBound,
	}

	storage.Put(ctx, "test", std.Serialize(newtx))
	filter := "$.price"
	oracle.Request(url, []byte(filter), "oracleCallback", "", oracle.MinimumResponseGas*4)
}

func Requestencodedirect(url string, tx Tx) {
	runtime.Notify("pricefor", url, url)
	storage.Put(ctx, "test", std.Serialize(tx))
	filter := "$.price"
	oracle.Request(url, []byte(filter), "oracleCallback", "", oracle.MinimumResponseGas*4)
}

func OnNEP17Payment(from interop.Hash160, amount int, data any) {
	runtime.Notify("nep17payment", amount)
}

func Return() any {
	return storage.Get(ctx, "test")
}

func Return2() any {
	return storage.Get(ctx, "test2")
}

func other(key string) any {
	return storage.Get(ctx, key)
}

func OracleCallback(url string, data any, code int, res []byte) {
	runtime.Notify("oraclecallback", code, res)
	price := string(res)
	newprice := res[1 : len(price)-1]
	finalprice := std.Atoi10(string(newprice))

	storage.Put(ctx, "test2", finalprice)

	tx := std.Deserialize(storage.Get(ctx, "test").([]byte)).(Tx)
	callingHash := runtime.GetCallingScriptHash()
	if !callingHash.Equals(oracle.Hash) {
		panic("not called from oracle contract")
	}

	if code != oracle.Success {
		panic("request failed for " + url + " with code " + std.Itoa(code, 10))
	}

	if finalprice <= tx.LowerBound {
		contract.Call(tx.TokenIn, "transfer", contract.All, runtime.GetExecutingScriptHash(), tx.dex, tx.amount)
		contract.Call(tx.dex, "swap", contract.All, tx.TokenIn, tx.To, tx.amount)
	} else if finalprice >= tx.UpperBound {
		contract.Call(tx.TokenOut, "transfer", contract.All, runtime.GetExecutingScriptHash(), tx.dex, tx.amount)
		contract.Call(tx.dex, "swap", contract.All, tx.TokenOut, tx.To, tx.amount)
	}
}
