import express, { Request, Response } from 'express';
import bodyParser from 'body-parser';
import cron from 'node-cron';
import cors from 'cors';
import { Coin, IncentivizedTestent, NibiruSigningClient, newCoin, newCoins, newSignerFromMnemonic } from "@nibiruchain/nibijs"
import { Msg, TxMessage } from "@nibiruchain/nibijs/dist/msg"
import {  } from "@nibiruchain/nibijs"
import { EncodeObject } from "@cosmjs/proto-signing";

const app = express();
const PORT = 3000;

// Middleware to parse JSON body
app.use(bodyParser.json());

// Enable CORS for all routes
app.use(cors());

interface UserOp {
    operation?: string;
    userId?: string;
    [key: string]: any; // You can make this more specific depending on the expected properties of UserOp
}

// Our queue to store UserOp objects
const userOpQueue: UserOp[] = [];

// POST endpoint to add a UserOp to the queue
app.post('/enqueue', (req: Request, res: Response) => {
    const userOp: UserOp = req.body;

    if (!userOp) {
        return res.status(400).json({ error: 'UserOp object is required' });
    }

    userOpQueue.push(userOp);
    res.json({ status: 'UserOp added to queue' });
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});

// Cron job that runs every 5 seconds
// Cron job that runs every 5 seconds
cron.schedule('*/5 * * * * *', async () => {
    console.log('Running the cron job...');

    const TEST_CHAIN = IncentivizedTestent(1);
    const signer = await newSignerFromMnemonic('');
    await signer.getAccounts();
    const signingClient = await NibiruSigningClient.connectWithSigner(
        TEST_CHAIN.endptTm,
        signer,
    );

    const [{ address: fromAddr }] = await signer.getAccounts();
    const tokens: Coin[] = newCoins(5, "unibi");
    const toAddr: string = "..."; // bech32 address of the receiving party

    const incrementMsgs = []; // Array to store the EncodeObject from userOpQueue

    while (userOpQueue.length > 0) {
        const userOp: any = userOpQueue.shift();  // Removes the first element from the array
        console.log(userOp);

        // Assuming userOp can be transformed into an EncodeObject, we add to incrementMsgs
        // You might need to modify the below transformation based on your actual data structure.
        incrementMsgs.push({
            typeUrl: "wasm/MsgExecuteContract",
            value: {
                sender: userOp.sender || 'myAddress',
                contract: userOp.contract || 'contractAddress',
                msg: Buffer.from(JSON.stringify(userOp.msg || { "Increment": {} })).toString("base64"),
                sent_funds: userOp.sent_funds || [],
            }
        });
    }

    if (incrementMsgs.length > 0) {
        const fee = {
            amount: [{ amount: '5000', denom: 'ucosm' }],  // Define appropriate fees
            gas: '200000',  // Define appropriate gas limit
        };

        // Assuming 'signAndBroadcast' accepts multiple messages
        signingClient.wasmClient.signAndBroadcast('', incrementMsgs, fee);
        console.log(`Sent ${incrementMsgs.length} messages to the blockchain.`);
    } else {
        console.log('No messages to send.');
    }

    // const txResp = await signingClient.sendTokens(fromAddr, toAddr, tokens, "auto");
});