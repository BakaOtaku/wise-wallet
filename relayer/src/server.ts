import express, { Request, Response } from "express";
import bodyParser from "body-parser";
import cron from "node-cron";
import cors from "cors";

// Updated imports for cosmjs
import { DirectSecp256k1HdWallet } from "@cosmjs/proto-signing";
import { GasPrice } from "@cosmjs/launchpad";
import { coins } from "@cosmjs/launchpad";
import { SigningCosmWasmClient } from "@cosmjs/cosmwasm-stargate";

const app = express();
const PORT = 3000;

const endpoint = "https://rpc-falcron.pion-1.ntrn.tech";
const chainId = "pion-1";
const gasPrice = GasPrice.fromString("0.025untrn");
const fee = {
  amount: coins(5000, "untrn"),
  gas: "100000",
};

app.use(bodyParser.json());
app.use(cors());

const entrypointContract =
  "neutron1gzyj8lgwuyxv4kgwm74hmtpyp9rm4slywj9zc93y4z32gv83taeq4eulld";
const swapContract =
  "neutron1ycvzczy0hz0z69k5tzmxmhdnmuq8dtwlczm0snzlyutnqvq6s9ps07vnys";
const initialUserOp = {
  store_swap_order: {
    to: swapContract,
    order_requester: swapContract,
    token_sell: "untrn",
    token_bought: "unusd",
    quantity_order: "1",
    swap_upper_usd: "1",
    swap_lower_usd: "1",
    minimum_result_accepted_usd: "1",
    max_in_sell_usd: "1",
    is_token_out_order: true,
  },
};
const userOpQueue: any[] = [initialUserOp];
const mnemonic =
  "clinic puzzle climb card piece scale false suspect nasty blossom world subject struggle swim celery destroy impact horn smart soldier village sea midnight drift";
let txHash = "";

app.post("/enqueue", (req: Request, res: Response) => {
  const userOp: any = req.body;

  if (!userOp) {
    return res.status(400).json({ error: "UserOp object is required" });
  } else {
    userOpQueue.push(initialUserOp);
  }

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
    const signer = await DirectSecp256k1HdWallet.fromMnemonic(mnemonic, {
      prefix: "neutron",
    });

    const signingClient = await SigningCosmWasmClient.connectWithSigner(
      endpoint,
      signer
    );
    const [firstAccount] = await signer.getAccounts();
    console.log(firstAccount.address);

    if (userOpQueue.length == 0) {
      return;
    }

    // Rest of the logic remains similar, just make sure to adapt
    // the message format and client methods to cosmjs

    let callX = JSON.stringify(userOpQueue.pop());
    const userOp = {
      Sender: firstAccount.address,
      Pubkey: "SGVsbG9Xb3JsZA==",
      To: swapContract,
      Nonce: "0",
      Calldata: Buffer.from(callX).toString("base64"), // buffer msg from fe
      Signature: "SGVsbG9Xb3JsZA==", // buffer sig from fe
      funds: [],
    };
    const handleUserOp = {
      handle_user_ops: { UserOps: [userOp] },
    };
    console.log(handleUserOp);

    const msg1 = {
      typeUrl: "/cosmwasm.wasm.v1.MsgExecuteContract",
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
      ""
    );
    console.log(result1);

    const orderId = filterOrderId(result1);
    console.log(orderId);

    const msg2 = {
      typeUrl: "/cosmwasm.wasm.v1.MsgExecuteContract",
      value: {
        sender: firstAccount.address,
        contract: swapContract,
        msg: Buffer.from(
          JSON.stringify({ execute_swap_order: { order_id: orderId } })
        ).toString("base64"),
        sent_funds: [],
      },
    };

    const result2 = await signingClient.signAndBroadcast(
      firstAccount.address,
      [msg2],
      {
        amount: [
          {
            denom: "untrn",
            amount: "100000",
          },
        ],
        gas: "100000",
      },
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
    if (event.type === "wasm") {
      for (const attribute of event.attributes) {
        if (attribute.key === "orderId") {
          console.log("Order ID:", attribute.value);
          return attribute.value;
        }
      }
    }
  }
}
