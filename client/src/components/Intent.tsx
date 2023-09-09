import React, { useState } from "react";
import { Button, InputBase } from "@mui/material";
import { makeStyles } from "@mui/styles";
import { cosmwasm } from "osmojs";
import ResultModal from "./UI/ResultModal";
import { showErrorMessage } from "@/util";
import { useSigningClient } from "@/context/cosmwasm";

const contractAddr =
  "nibi1ec5wenydt8pe2ntjfxv6ny97jtc7t4fqnuyl8as3xepjc4udfyfs699j7a";
const swapAddr =
  "nibi1ec5wenydt8pe2ntjfxv6ny97jtc7t4fqnuyl8as3xepjc4udfyfs699j7a";

const Intent: React.FC = () => {
  const classes = useStyles();
  const { signingClient, walletAddress } = useSigningClient();

  const [inputValue, setInputValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [triggerModal, setTriggerModal] = useState(false);
  const [txState, setTxState] = useState<any>({});
  const [txHash, setTxHash] = useState("");

  const handleSubmit = async () => {
    if (!walletAddress) {
      showErrorMessage("Please connect your wallet");
      return;
    }
    setTriggerModal(true);
    setIsLoading(true);
    setTxHash("");
    setTxState({});
    try {
      // call to solver to resolve the string with the tx data
      const data = await fetch(
        "http://localhost:8080/api",
        {
          method: "POST",
          headers: {
            "x-cors-api-key": "temp_4dfed681089bbb1b9b8ce29f45145eab",
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            inputStr: inputValue,
          }),
        }
      );
      console.log(data);
      const res = await data.json();
      console.log(res);
      let parsedArray: any[] = [];
      try {
        const contentString = res.data.detail.text;
        parsedArray = JSON.parse(contentString);
      } catch (error) {
        const contentString = res.data.detail.choices[0].message.content;
        parsedArray = JSON.parse(contentString);
      }
      console.log(parsedArray);
      // 1. trigger = [type, quantity, time, token_amount, token_in, token_out]
      // 2. swap = [type, trigger_amount, token_in, token_out]
      if (parsedArray[0] === "trigger") {
        setTxState({
          type: parsedArray[0],
          quantity: parsedArray[1],
          time: parsedArray[2],
          token_amount: parsedArray[3],
          token_in: parsedArray[4],
          token_out: parsedArray[5],
        });
      } else {
        setTxState({
          type: parsedArray[0],
          trigger_amount: parsedArray[1],
          token_in: parsedArray[2],
          token_out: parsedArray[3],
        });
      }
      setIsLoading(false);
    } catch (error: any) {
      console.log(error);
      setIsLoading(false);
      showErrorMessage(error.message);
    }
  };

  const signAndSendBundler = async () => {
    try {
      setIsLoading(true);
      setTxHash("");
      setTxState({});
      if (!signingClient) {
        showErrorMessage("Please connect your wallet");
        return;
      }

      const { executeContract } = cosmwasm.wasm.v1.MessageComposer.withTypeUrl;
      const msg = executeContract({
        sender: walletAddress,
        contract: contractAddr,
        msg: Buffer.from(
          JSON.stringify({
            limit: {
              token_in: txState?.token_in,
              token_out: txState?.token_out,
              quantity: txState?.quantity,
              time: txState?.time,
            },
          })
        ),
        funds: [
          {
            denom: "unibi",
            amount: "0",
          },
        ],
      });

      const tx = await signingClient.sign(
        walletAddress,
        [msg],
        {
          gas: "5000000",
          amount: [
            {
              amount: "0",
              denom: "uosmo",
            },
          ],
        },
        ""
      );
      console.log(tx);
      // let sigHex = Buffer.from(tx?.signatures[0]).toString("hex");
      const userOp = {
        Sender: walletAddress,
        To: swapAddr,
        Nonce: 0,
        Calldata: msg.value.msg,
        Signature: tx.signatures[0],
      }

      console.log(userOp);

      setTxHash("abc");
    } catch (error: any) {
      console.log(error);
      setIsLoading(false);
      showErrorMessage(error.message);
    }
  };

  return (
    <div className={classes.root}>
      <ResultModal
        triggerModal={triggerModal}
        isLoading={isLoading}
        txHash={txHash}
        txState={txState}
        setTriggerModal={setTriggerModal}
        signAndSendBundler={signAndSendBundler}
      />
      <InputBase
        className={classes.input}
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        placeholder="Swap for best rate available..."
        sx={{ width: "100%", borderRadius: 50, paddingLeft: 2 }}
      />
      <Button
        className={classes.button}
        variant="contained"
        color="primary"
        disabled={isLoading}
        onClick={handleSubmit}
        sx={{
          border: "none",
          backgroundColor: "rgb(7, 39, 35)",
          color: "white",
          height: 45,
          borderTopRightRadius: 50,
          borderBottomRightRadius: 50,
          boxShadow: "none",
          transition: "background-color 0.3s ease-in-out",
          "&:disabled": {
            backgroundColor: "rgba(255, 255, 255, 0.1)",
            color: "rgba(255, 255, 255, 0.5)",
          },
        }}
      >
        Submit
      </Button>
    </div>
  );
};

const useStyles = makeStyles(() => ({
  root: {
    display: "flex",
    alignItems: "center",
    height: 45,
    border: "1px solid transparent",
    borderRadius: 50,
    background:
      "linear-gradient(90deg, rgba(61,207,188,1) 0%, rgba(31,149,157,1) 35%, rgba(0,212,255,1) 100%)",
    transition: "background 0.3s ease-in-out",
    boxShadow: "rgba(151, 252, 215, 0.2) 0px 0px 30px 5px",
    "&:hover": {
      background:
        "linear-gradient(90deg, rgba(61,207,188,0.8) 0%, rgba(31,149,157,0.8) 35%, rgba(0,212,255,0.8) 100%)",
    },
  },
  input: {
    color: "white",
    transition: "background-color 0.3s ease-in-out",
    "&:hover": {
      backgroundColor: "rgba(255, 255, 255, 0.1)",
    },
  },
  button: {},
}));

export default Intent;
