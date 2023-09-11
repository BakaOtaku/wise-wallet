import {
    NibiruSigningClient,
    newSignerFromMnemonic,
    IncentivizedTestnet,
  } from "@nibiruchain/nibijs";
  import { cosmwasm } from "osmojs";
  const TEST_CHAIN = IncentivizedTestnet(2);
  
  const entrypointContract: string =
    "nibi1436kxs0w2es6xlqpp9rd35e3d0cjnw4sv8j3a7483sgks29jqwgsn6ytm8";
  const mnemonic =
    "";
  
  const callFinal = async () => {
    const signer = await newSignerFromMnemonic(mnemonic!);
    const signingClient = await NibiruSigningClient.connectWithSigner(
      TEST_CHAIN.endptTm,
      signer
    );
    const [{ address: fromAddr }] = await signer.getAccounts();
    console.log(fromAddr);
  
    // fe signing
    // const { executeContract } = cosmwasm.wasm.v1.MessageComposer.withTypeUrl;
    const { executeContract } = cosmwasm.wasm.v1.MessageComposer.withTypeUrl;

    const msg1 = executeContract({
      sender: fromAddr,
      contract: "nibi1ec5wenydt8pe2ntjfxv6ny97jtc7t4fqnuyl8as3xepjc4udfyfs699j7a",
      msg: Buffer.from(
        JSON.stringify({
          store_swap_order: {
            to: "nibi1uwy6yypgyn089ls42hg8mzlrmtj575ughne06e",
            order_requester: "nibi1uwy6yypgyn089ls42hg8mzlrmtj575ughne06e",
            token_sell: "unibi",
            token_bought: "unibi",
            quantity_order: "1",
            swap_upper_usd: "1",
            swap_lower_usd: "1",
            minimum_result_accepted_usd: "1",
            max_in_sell_usd: "1",
            is_token_out_order: true,
          },
        }) 
      ),
      funds: [
        {
          denom: "unibi",
          amount: "1",
        },
      ],
    });
    console.log(msg1)
    console.log('asfasf')
    const sig = await signingClient.wasmClient.sign(
      fromAddr,
      [msg1],
      {
        gas: "5000000",
        amount: [
          {
            amount: "1",
            denom: "uosmo",
          },
        ],
      },
      ""
    );
    console.log('asfasf')
    // console.log(sig)
    // console.log(msg1.value.msg);
  
    const userOp = {
      Sender: fromAddr,
      To: "",
      Nonce: 0,
      Calldata: msg1.value.msg, // buffer msg from fe
      Signature: sig.signatures[0], // buffer sig from fe
    };
    const msg2 = {
      typeUrl: "/cosmwasm.wasm.v1.MsgExecuteContract",
      value: {
        sender: fromAddr,
        contract: entrypointContract,
        msg: msg1.value.msg, // buffer msg from fe
        sent_funds: [],
      },
    };
  
    const result = await signingClient.wasmClient.signAndBroadcast(fromAddr, [msg2], "auto");
    console.log(result)
  };
  callFinal();