import { Button, CircularProgress, Modal, Snackbar } from "@mui/material";
import { Close } from "@mui/icons-material";
import { makeStyles } from "@mui/styles";
import { useState } from "react";
import { showSuccessMessage } from "@/util";

type IModalProps = {
  triggerModal: boolean;
  isLoading: boolean;
  txHash: string;
  txState: any;
  setTriggerModal: (value: boolean) => void;
  signAndSendBundler: () => void;
};

const ResultModal = ({
  triggerModal,
  setTriggerModal,
  isLoading,
  txHash,
  txState,
  signAndSendBundler,
}: IModalProps) => {
  const [open, setOpen] = useState(false);
  const classes = useStyles();

  const closeModal = () => {
    setTriggerModal(false);
  };

  return (
    <Modal
      open={triggerModal}
      aria-labelledby="simple-modal-title"
      aria-describedby="simple-modal-description"
      className={classes.modalContainer}
    >
      <div className={classes.modal}>
        <div className={classes.closeModal} onClick={closeModal}>
          <Close style={{ fontSize: "16px" }} />
        </div>
        <div className={classes.graphicSection}>
          <div className="iconContainer">
            {/* <img src="/backgrounds/thumbs-up.png" alt="thumb icon" /> */}
            {/* <HexagonGraphic color="#1DBA2D" /> */}
            {isLoading && !txHash && (
              <CircularProgress
                sx={{
                  marginLeft: "45%",
                  marginTop: "20%",
                }}
                size={40}
              />
            )}
            {txHash && (
              <div style={{ marginTop: "20%", marginLeft: "10%" }}>
                ✅ Transaction sent successfully!
                <br />
                Verify on CLI
                {/* copy tx hash */}
                <div
                  style={{ wordBreak: "break-all", cursor: "pointer" }}
                  onClick={() => {
                    showSuccessMessage("Copied to clipboard");
                  }}
                >
                  F25E9CE6DA7BB6C3172B60FF0195E75A36BDB4828F0647E20B255F35964CC177
                </div>
              </div>
            )}
            {!isLoading && !txHash && (
              <code>
                <pre>
                  {JSON.stringify(
                    {
                      type: txState?.type,
                      quantityToSwap: txState?.quantity,
                      timeStampLimit: txState?.time,
                      tokenAmount: txState?.token_amount,
                      tokenIn: txState?.token_in,
                      tokenOut: txState?.token_out,
                    },
                    null,
                    4
                  )}
                </pre>
              </code>
            )}
          </div>
        </div>
        <div className={classes.textSection}>
          <div className={classes.btnCont}>
            <button
              onClick={() => signAndSendBundler()}
              className={classes.btn}
            >
              Sign and Send Tx
            </button>
          </div>
        </div>
      </div>
    </Modal>
  );
};

const useStyles = makeStyles(() => ({
  purple: {
    color: "#7533E2",
  },
  modalContainer: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    position: "relative",
    padding: "0 20px",
  },
  modal: {
    padding: "20px",
    backgroundColor: "#fff",
    borderRadius: "16px",
    width: "500px",
    color: "#000",
    outline: "none",
    boxShadow: "0px 4px 4px rgba(0, 0, 0, 0.25)",
    display: "flex",
    flexDirection: "column",
    position: "relative",
  },
  graphicSection: {
    position: "relative",
    height: "250px",
    backgroundColor: "#E3DEFF",
    borderRadius: "8px",
    marginTop: "40px",

    "& .iconContainer": {
      // position: "absolute",
      // top: "-40px",
      height: 40,
      margin: "20px",
      textoverflow: "ellipsis",
    },

    "& svg": {
      display: "block",
      margin: "auto",
    },

    "& img": {
      position: "absolute",
      margin: "auto",
      left: 0,
      right: 0,
      display: "block",
      width: 150,
    },
  },
  textSection: {
    marginTop: "26px",

    "& p": {
      textAlign: "center",
      color: "#6E798F",
      fontWeight: "600",

      "& span": {
        fontWeight: "600",
        display: "block",
        wordBreak: "break-all",

        "& a": {
          color: "inherit",
        },
      },
    },
    "& .credit": {
      display: "flex",
      flexDirection: "column",
      fontSize: "12px",
      marginTop: "40px",
      padding: "0 20px",

      "& span": {
        fontWeight: "normal",

        "&:first-child": {
          marginBottom: "10px",
          fontSize: "14px",
        },
      },
    },
  },
  closeModal: {
    height: "30px",
    width: "30px",
    backgroundColor: "#FFDEDE",
    borderRadius: "15px",
    position: "absolute",
    top: "17px",
    right: "25px",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    cursor: "pointer",

    "&:hover": {
      backgroundColor: "#ffc1c1",
    },
  },
  btnCont: {
    // position: "absolute",
    // top: -28,
    // width: "calc(100% - 56px)",
    display: "flex",
    justifyContent: "center",
  },
  btn: {
    padding: "9px 40px",
    boxSizing: "border-box",
    background: "rgb(151, 252, 228)",
    borderRadius: 60,
    fontSize: 20,
    fontWeight: 400,
    cursor: "pointer",
    color: "rgb(25, 56, 51)",
    textDecoration: "none",
  },
  tradeImg: {
    width: "100%",
    height: "450px",
    background: "url(/img/trade.png) 0% 0% / cover no-repeat",
  },
  link: {
    color: "#7533E2",
    textDecoration: "underline",
  },
}));

export default ResultModal;
