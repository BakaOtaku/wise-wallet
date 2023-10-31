import { CircularProgress, InputBase, Modal } from "@mui/material";
import { Close } from "@mui/icons-material";
import { makeStyles } from "@mui/styles";

type IModalProps = {
  triggerModal: boolean;
  inputValue: any;
  loading: boolean;
  txHash: string;
  setTriggerModal: (value: boolean) => void;
  setInputValue: (value: any) => void;
  setGuardians: () => void;
  setIsLoading: (value: boolean) => void;
};

const InputGuardians = ({
  triggerModal,
  setTriggerModal,
  inputValue,
  setInputValue,
  setGuardians,
  loading,
  txHash,
  setIsLoading,
}: IModalProps) => {
  const classes = useStyles();

  const closeModal = () => {
    setTriggerModal(false);
    setIsLoading(false);
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
          {!loading && !txHash && (
            <div className="iconContainer">
              Add array of guardians...
              <div style={{ marginTop: 20 }}>
                <InputBase
                  className={classes.input}
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  placeholder="[neutron12345...,  neutron23456...]"
                  sx={{ width: "100%", borderRadius: 50, paddingLeft: 2 }}
                />
              </div>
            </div>
          )}
          {loading && !txHash && (
            <CircularProgress
              sx={{
                marginLeft: "45%",
                marginTop: "10%",
              }}
              size={40}
            />
          )}
          {txHash && (
            <div style={{ marginTop: "10%", marginLeft: "10%" }}>
              🔏 Guardians added successfully!
              <br />
              <a
                style={{ wordBreak: "break-all", cursor: "pointer" }}
                target="_blank"
                rel="noopener noreferrer"
                href={`https://explorer.rs-testnet.polypore.xyz/pion-1/tx/${txHash}`}
              >
                <code
                  style={{
                    marginLeft: "10px",
                    color: "blue",
                    fontSize: "14px",
                  }}
                >
                  Explorer: {txHash}
                </code>
              </a>
            </div>
          )}
        </div>
        <div className={classes.textSection}>
          <div className={classes.btnCont}>
            <button onClick={setGuardians} className={classes.btn}>
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
    height: "150px",
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
  input: {
    color: "white",
    backgroundColor: "rgba(255, 255, 255, 0.9)",
    transition: "background-color 0.3s ease-in-out",
    "&:hover": {
      backgroundColor: "rgba(255, 255, 255, 0.6)",
    },
  },
}));

export default InputGuardians;
