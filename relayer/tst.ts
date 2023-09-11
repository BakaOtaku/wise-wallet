import {
    NibiruSigningClient,
    newSignerFromMnemonic,
    IncentivizedTestnet,
  } from "@nibiruchain/nibijs";
  import { cosmwasm } from "osmojs";
  const TEST_CHAIN = IncentivizedTestnet(2);
  
  const entrypointContract: string =
    "nibi1wn625s4jcmvk0szpl85rj5azkfc6suyvf75q6vrddscjdphtve8strzuwm";
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
    let callX = JSON.stringify({
      store_swap_order: {
        to: "nibi1uwy6yypgyn089ls42hg8mzlrmtj575ughne06e",
        order_requester: "nibi1uwy6yypgyn089ls42hg8mzlrmtj575ughne06e",
        token_sell: "unibi",
        token_bought: "unusd",
        quantity_order: "10",
        swap_upper_usd: "10",
        swap_lower_usd: "10",
        minimum_result_accepted_usd: "10",
        max_in_sell_usd: "10",
        is_token_out_order: true,
      },
    }) 
    const userOp = {
      Sender: fromAddr,
      Pubkey: "SGVsbG9Xb3JsZA==",
      To: "nibi1mf6ptkssddfmxvhdx0ech0k03ktp6kf9yk59renau2gvht3nq2gqfdzd2w",
      Nonce: "0",
      Calldata: Buffer.from(callX).toString("base64"), // buffer msg from fe
      Signature: "SGVsbG9Xb3JsZA==", // buffer sig from fe
      funds: []
    };
    const handleUserOp = {
      "handle_user_ops": {"UserOps":[userOp]}
    }

    const msg1 = executeContract({
      sender: fromAddr,
      contract: entrypointContract,
      msg: Buffer.from(JSON.stringify(handleUserOp)),
      funds: [
        // {
        //   denom: "unibi",
        //   amount: "1",
        // },
      ],
    });
    console.log(msg1)
    console.log('asfasf')
    // const sig = await signingClient.wasmClient.sign(
    //   fromAddr,
    //   [msg1],
    //   {
    //     gas: "5000000",
    //     amount: [
    //       {
    //         amount: "1",
    //         denom: "uosmo",
    //       },
    //     ],
    //   },
    //   ""
    // );
    // console.log('asfasf')
    // // console.log(sig)
    // // console.log(msg1.value.msg);
  
    // // const userOp = {
    // //   Sender: fromAddr,
    // //   To: "",
    // //   Nonce: 0,
    // //   Calldata: callX, // buffer msg from fe
    // //   Signature: sig.signatures[0], // buffer sig from fe
    // // };
    // const msg2 = {
    //   typeUrl: "/cosmwasm.wasm.v1.MsgExecuteContract",
    //   value: {
    //     sender: fromAddr,
    //     contract: entrypointContract,
    //     msg: msg1.value.msg, // buffer msg from fe
    //     sent_funds: [],
    //   },
    // };
  
    const result = await signingClient.wasmClient.signAndBroadcast(fromAddr, [msg1], "auto");
    console.log(JSON.stringify(result))
  };
  callFinal();