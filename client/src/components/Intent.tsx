import React, { useState } from "react";
import { Button, InputBase } from "@mui/material";
import { makeStyles } from "@mui/styles";
import { useWallet } from "@rentfuse-labs/neo-wallet-adapter-react";
import ResultModal from "./UI/ResultModal";
import { showErrorMessage } from "@/util";
import { u, sc } from "@cityofzion/neon-js";

const Intent: React.FC = () => {
  const classes = useStyles();
  const { address } = useWallet();

  const [inputValue, setInputValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [triggerModal, setTriggerModal] = useState(false);
  const [txState, setTxState] = useState<object>({});
  const [txHash, setTxHash] = useState("");

  const handleSubmit = async () => {
    setTriggerModal(true);
    setIsLoading(true);
    setTxHash("");
    setTxState({});
    try {
      // call to solver to resolve the string with the tx data
      const data = await fetch(
        "https://proxy.cors.sh/https://solver.34.131.5.205.nip.io/api",
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
      const limitContract = "01464f6394107d76978d7614b9a7a01d0cc71e34";
      if (address) {
        const ops = sc.ContractParam.array(
          sc.ContractParam.hash160(address),
          sc.ContractParam.hash160(limitContract),
          sc.ContractParam.string(`${"transfer" ? "trigger" : "swap"}`),
          // callData
          sc.ContractParam.array(
            sc.ContractParam.integer(1),
            sc.ContractParam.any("")
          ),
          sc.ContractParam.boolean(false) // gasMode (sponsored)
        );
        const uerOpHash = u.hash256(JSON.stringify(ops));
        console.log(uerOpHash);
        const neo = new (window as any).NEOLineN3.Init();
        const sig = await neo.signMessage({
          message: uerOpHash,
        });
        const message = sig.salt + uerOpHash;
        const parameterHexString = Buffer.from(message).toString("hex");
        const lengthHex = u.num2VarInt(parameterHexString.length / 2);
        const concatenatedString = lengthHex + parameterHexString;
        const messageHex = "010001f0" + concatenatedString + "0000"; // little endian hex

        // send signed tx to bundler node and wait for tx hash
        let data = await fetch("http://localhost:3000/relay", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            jsonrpc: "2.0",
            method: "sendrawtransaction",
            signature: messageHex,
            id: 1,
          }),
        });
        console.log(data);
        const res = await data.json();
        console.log(res.txid);
        setTxHash(res.txid);
      } else {
        showErrorMessage("Please connect your wallet");
        setIsLoading(false);
      }
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
        placeholder="Swap 1 NEO for best rate available..."
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
