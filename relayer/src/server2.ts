import express, { Request, Response } from "express";
import bodyParser from "body-parser";
import cron from "node-cron";
import cors from "cors";

// Updated imports for cosmjs
import { DirectSecp256k1HdWallet } from "@cosmjs/proto-signing";
import { GasPrice, LcdClient } from "@cosmjs/launchpad";
import { coins } from "@cosmjs/launchpad";
import { SigningCosmWasmClient } from "@cosmjs/cosmwasm-stargate";

const app = express();
const PORT = 3000;

const endpoint = "https://rpc-nova.comdex.one:443";
const chainId = "comdex-novanet";
const gasPrice = GasPrice.fromString("0.025ucmdx");
const fee = {
  amount: coins(5000, "ucmdx"),
  gas: "1000000",
};

app.use(bodyParser.json());
app.use(cors());

const userOpQueue: any[] = [
  {
    store_swap_order: {
      to: "comdex1tnfwzm9xucghaxg9fsuwkk8skhwmkx5njr3ndyahtrvtu4e824sqlaryf3",
      order_requester: "comdex1tnfwzm9xucghaxg9fsuwkk8skhwmkx5njr3ndyahtrvtu4e824sqlaryf3",
      token_sell: "unibi",
      token_bought: "unusd",
      quantity_order: "10",
      swap_upper_usd: "10",
      swap_lower_usd: "10",
      minimum_result_accepted_usd: "10",
      max_in_sell_usd: "10",
      is_token_out_order: true,
    },
  },
];
const entrypointContract = "comdex1dr9ztzlwpeqmq5h9c4fapdzftgk5x44nx63t0fhn9fv3v9kjcw3qclf2qk";
const mnemonic =
  "now canyon universe hair wagon engine loop shop seat hurry spend bamboo";
let txHash = "";

app.post("/enqueue", (req: Request, res: Response) => {
  const userOp: any = req.body;

  if (!userOp) {
    return res.status(400).json({ error: "UserOp object is required" });
  }

  userOpQueue.push(userOp);
  res.json({ status: "UserOp added to queue" });
});

app.get("/txHash", (req: Request, res: Response) => {
  res.json({ txHash: txHash });
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});

cron.schedule("*/5 * * * * *", async () => {
  console.log("Running the cron job...");
  try {
    const signer = await DirectSecp256k1HdWallet.fromMnemonic(mnemonic,{prefix: 'comdex'});

    const signingClient = await SigningCosmWasmClient.connectWithSigner(endpoint, signer);
    const [firstAccount] = await signer.getAccounts();
    console.log(firstAccount.address)

    if (userOpQueue.length == 0) {
      return;
    }

    // Rest of the logic remains similar, just make sure to adapt
    // the message format and client methods to cosmjs

    let callX = JSON.stringify(userOpQueue.pop());
    const userOp = {
      Sender: firstAccount.address,
      Pubkey: "SGVsbG9Xb3JsZA==",
      To: "nibi1mf6ptkssddfmxvhdx0ech0k03ktp6kf9yk59renau2gvht3nq2gqfdzd2w",
      Nonce: "0",
      Calldata: Buffer.from(callX).toString("base64"), // buffer msg from fe
      Signature: "SGVsbG9Xb3JsZA==", // buffer sig from fe
      funds: [],
    };
    const handleUserOp = {
      handle_user_ops: { UserOps: [userOp] },
    };

    const msg1 = {
      typeUrl: "wasm/MsgExecuteContract",
      value: {
        sender: firstAccount.address,
        contract: entrypointContract,
        msg: Buffer.from(JSON.stringify(handleUserOp)).toString("base64"),
        sent_funds: [],
      },
    };

    const result1 = await signingClient.signAndBroadcast(
      firstAccount.address,
      [msg1],
      fee,
      "",
    );

    const orderId = filterOrderId(result1);

    const msg2 = {
      typeUrl: "wasm/MsgExecuteContract",
      value: {
        sender: firstAccount.address,
        contract: entrypointContract, // adjust as per your requirement
        msg: Buffer.from(
          JSON.stringify({ execute_swap_order: { order_id: orderId } })
        ).toString("base64"),
        sent_funds: [],
      },
    };

    const result2 = await signingClient.signAndBroadcast(
      firstAccount.address,
      [msg2],
      fee,
      ""
    );

    txHash = result2.transactionHash;
    console.log(txHash);
  } catch (err) {
    console.log(err);
  }
});

function filterOrderId(data: any) {
  for (const event of data.events) {
    if (event.type === 'wasm') {
      for (const attribute of event.attributes) {
        if (attribute.key === 'orderId') {
          console.log('Order ID:', attribute.value);
          return attribute.value;
        }
      }
    }
  }
}
