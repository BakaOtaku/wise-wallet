import { useState } from "react";
import { makeStyles } from "@mui/styles";
import { Tab, Tabs } from "@mui/material";
import { cosmwasm } from "osmojs";
import { TabPanel, TabContext } from "@mui/lab";
import InputGuardians from "./UI/InputGuardians";
import ResetOwner from "./UI/ResetOwner";
import { useSigningClient } from "@/context/cosmwasm";
import { showErrorMessage } from "@/util";

const RecoveryTable = () => {
  const classes = useStyles();
  const { signingClient, walletAddress } = useSigningClient();
  const [tabs, setTabs] = useState("0");
  const [triggerModal, setTriggerModal] = useState(false);
  const [triggerModal1, setTriggerModal1] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoading1, setIsLoading1] = useState(false);
  const [txHash, setTxHash] = useState("");
  const [txHash1, setTxHash1] = useState("");
  const [inputValue, setInputValue] = useState("");
  const [scwAddr, setScwAddr] = useState("");
  const [inputValue1, setInputValue1] = useState("");
  const [guardiansArr, setGuardiansArr] = useState([] as any[]);

  const setGuardians = async () => {
    setIsLoading(true);
    if (!walletAddress) {
      showErrorMessage("Please connect your wallet");
      setIsLoading(false);
      return;
    }

    const epc =
      "neutron12agh3tla7urwr634s469kgupm9eemteetwj8ay39njyjljekxs6sh3a2ud";
    try {
      const { executeContract } = cosmwasm.wasm.v1.MessageComposer.withTypeUrl;
      const calldata = {
        set_recovery_helpers: {
          helpers: [
            "neutron1m2x0ettnmahn967wckqsz7yyx572y39tf0tgnm",
            "neutron15a2yrkccrx9pntq8tlr6twr9xp2r2tnjjsns9j",
          ],
        },
      };
      const base64CallData = Buffer.from(JSON.stringify(calldata)).toString(
        "base64"
      );
      const msg0 = executeContract({
        sender: walletAddress,
        contract: epc,
        msg: Buffer.from(
          JSON.stringify({
            handle_user_ops: {
              UserOps: [
                {
                  Sender: "neutron1m2x0ettnmahn967wckqsz7yyx572y39tf0tgnm",
                  To: "neutron1hek7vf822yd4g8hhd73g8h4eynxhew0sgafapwy5su284yhj5myqzjwq46",
                  Nonce: "0",
                  Calldata: base64CallData,
                  funds: [],
                  Pubkey: "",
                },
              ],
            },
          })
        ),
        funds: [
          {
            amount: "10",
            denom: "untrn",
          },
        ],
      });
      console.log(msg0);
      const trx = await signingClient?.signAndBroadcast(walletAddress, [msg0], {
        gas: "5000000",
        amount: [
          {
            amount: "10",
            denom: "untrn",
          },
        ],
      });
      console.log(trx);
      setTxHash(trx?.transactionHash || "");
      setGuardiansArr([inputValue.split(",")[0], inputValue.split(",")[1]]);
      setIsLoading(false);
    } catch (err: any) {
      console.log(err);
      showErrorMessage(err.message);
      setIsLoading(false);
    }
  };

  const resetOwner = async () => {
    setIsLoading1(true);
    if (!walletAddress) {
      showErrorMessage("Please connect your wallet");
      setIsLoading1(false);
      return;
    }

    const epc =
      "neutron12agh3tla7urwr634s469kgupm9eemteetwj8ay39njyjljekxs6sh3a2ud";
    try {
      const { executeContract } = cosmwasm.wasm.v1.MessageComposer.withTypeUrl;
      const calldata = {
        change_owner: { new_owner: inputValue1 },
      };
      const base64CallData = Buffer.from(JSON.stringify(calldata)).toString(
        "base64"
      );
      const msg0 = executeContract({
        sender: walletAddress,
        contract: epc,
        msg: Buffer.from(
          JSON.stringify({
            handle_user_ops: {
              UserOps: [
                {
                  Sender: "neutron1m2x0ettnmahn967wckqsz7yyx572y39tf0tgnm",
                  To: "neutron1hek7vf822yd4g8hhd73g8h4eynxhew0sgafapwy5su284yhj5myqzjwq46",
                  Nonce: "0",
                  Calldata: base64CallData,
                  funds: [],
                  Pubkey: "",
                },
              ],
            },
          })
        ),
        funds: [
          {
            amount: "10",
            denom: "untrn",
          },
        ],
      });
      const trx = await signingClient?.signAndBroadcast(walletAddress, [msg0], {
        gas: "5000000",
        amount: [
          {
            amount: "10",
            denom: "untrn",
          },
        ],
      });
      console.log(trx);
      setTxHash1(trx?.transactionHash || "");
      setIsLoading1(false);
    } catch (err: any) {
      console.log(err);
      showErrorMessage(err.message);
      setIsLoading1(false);
    }
  };

  return (
    <div className={classes.details}>
      <InputGuardians
        triggerModal={triggerModal}
        inputValue={inputValue}
        setTriggerModal={setTriggerModal}
        setInputValue={setInputValue}
        setGuardians={setGuardians}
        loading={isLoading}
        txHash={txHash}
        setIsLoading={setIsLoading}
      />
      <ResetOwner
        triggerModal={triggerModal1}
        inputValue={inputValue1}
        setTriggerModal={setTriggerModal1}
        setInputValue={setInputValue1}
        setScwAddr={setScwAddr}
        scwAddr={scwAddr}
        resetOwner={resetOwner}
        loading={isLoading1}
        txHash={txHash1}
        setIsLoading={setIsLoading1}
      />
      <div className={classes.tabs}>
        <TabContext value={tabs}>
          <Tabs
            value={tabs}
            onChange={(e, newValue) => setTabs(newValue)}
            indicatorColor="primary"
            textColor="primary"
            // variant="fullWidth"
          >
            <Tab label="Who protects me" value="0" />
            <Tab label="Who I protect" value="1" />
          </Tabs>

          <TabPanel
            value="0"
            sx={{
              padding: 0,
            }}
          >
            <div className={classes.tabPanel}>
              <div className={classes.table}>
                <div className={classes.tableValue}>Wallet Address</div>
                <div className={classes.tableValue} style={{ paddingLeft: 30 }}>
                  Status
                </div>
              </div>
              {guardiansArr.map((guardian, ind) => (
                <div className={classes.table} key={ind}>
                  <div className={classes.tableValue}>{guardian}</div>
                  <div className={classes.tableValue}>Active</div>
                </div>
              ))}

              <button
                onClick={() => {
                  setTriggerModal(true);
                  console.log("Add Guardians");
                }}
                className={classes.btn}
              >
                Add Guardians +
              </button>
            </div>
          </TabPanel>
          <TabPanel
            value="1"
            sx={{
              padding: "0",
            }}
          >
            <div className={classes.tabPanel}>
              <div className={classes.table}>
                <div className={classes.tableValue}>
                  Reset the owner of the Smart Accounts
                </div>
              </div>
              <button
                onClick={() => {
                  setTriggerModal1(true);
                }}
                className={classes.btn}
                style={{
                  margin: "30px auto",
                }}
              >
                Reset Owner +
              </button>
            </div>
          </TabPanel>
        </TabContext>
      </div>
    </div>
  );
};

const useStyles = makeStyles((theme) => ({
  details: {
    width: "100%",
    "@media (max-width:959px)": {
      paddingBottom: "20px",
    },
    "@media (max-width: 768px)": {
      width: "100%",
    },
  },
  title: {
    // marginTop: 20,
    fontSize: 20,
    fontWeight: 400,
    color: "#fff",
  },
  subTitle: {
    fontSize: 13,
    color: "#fff",
    fontWeight: 400,
    opacity: 0.9,
  },
  text: {
    fontSize: 12,
    fontWeight: 400,
    lineHeight: "1.2em",
    // marginTop: 10,
    textAlign: "left",
    color: "#DDE6ED",
    opacity: 0.7,
  },
  networkDetails: {
    margin: "auto",
  },
  tabs: {
    marginTop: 20,
    backgroundColor: "rgb(7, 39, 35, 0.9)",

    "& .MuiTabs-indicator": {},
    "& .MuiTab-root": {
      minWidth: "unset",
      textTransform: "capitalize",
      fontSize: 14,
      fontWeight: 400,
      color: "#fff",
      opacity: 0.7,
      "&.Mui-selected": {
        color: "#fff",
        opacity: 1,
      },
    },
  },
  tabPanel: {
    minHeight: "30vh",
    padding: "0",
    margin: 0,
    backgroundColor: "rgb(7, 39, 35, 0.5)",
    color: "rgba(255, 255, 255, 0.9)",
  },
  table: {
    padding: "10px",
    fontWeight: 400,
    display: "grid",
    gridTemplateColumns: "repeat(2, 1fr)",
    gridGap: "10px",
    borderTop: "1px solid rgba(255, 255, 255, 0.1)",
    borderBottom: "1px solid rgba(255, 255, 255, 0.1)",
    "@media (max-width: 768px)": {
      display: "none",
    },
  },
  tableValue: {
    padding: "0 20px",
    fontWeight: 400,
  },
  loading: {
    margin: "auto",
    color: "#E84142",
  },
  btn: {
    margin: "30px 0 20px 40%",
    background: "rgb(87,108,188, 0.6)",
    cursor: "pointer",
    border: 0,
    outline: "none",
    borderRadius: 5,
    height: "36px",
    lineHeight: "36px",
    padding: "0 18px 0 18px",
    borderBottom: "1px solid rgba(255, 255, 255, 0.1)",
    display: "flex",
    alignItems: "center",
    color: "white",

    "@media (max-width:599px)": {
      padding: 0,
    },

    "&:hover": {
      backgroundColor: "rgb(87,108,188, 0.4)",
    },

    "& div": {
      "@media (max-width:599px)": {
        margin: 0,
        display: "none",
      },
    },
  },
}));

export default RecoveryTable;
