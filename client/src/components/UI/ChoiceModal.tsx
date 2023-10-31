import { Modal } from "@mui/material";
import { Close } from "@mui/icons-material";
import { makeStyles } from "@mui/styles";
import WalletIcon from "@mui/icons-material/Wallet";
import GoogleIcon from "@mui/icons-material/Google";

import { useWeb3Context } from "@/context/Web3Auth";
import { useSigningClient } from "@/context/cosmwasm";
import { useEffect } from "react";

type IModalProps = {
  triggerModal: boolean;
  addr: string;
  setTriggerModal: (value: boolean) => void;
  setAddr: (value: string) => void;
};

const ChoiceModal = ({
  triggerModal,
  addr,
  setTriggerModal,
  setAddr,
}: IModalProps) => {
  const { connectWeb3, address } = useWeb3Context();
  const { connectWallet, walletAddress } = useSigningClient();
  const classes = useStyles();

  const closeModal = () => {
    setTriggerModal(false);
  };

  useEffect(() => {
    if (address || walletAddress) {
      setTriggerModal(false);
      setAddr(address || walletAddress);
    }
  }, [address, walletAddress]);

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
            {/* <HexagonGraphic color="#1DBA2D" /> */}

            <div className={classes.textSection}>
              <div className={classes.btnCont}>
                <button onClick={() => connectWallet()} className={classes.btn}>
                  <WalletIcon />
                  Keplr Wallet
                </button>
              </div>
            </div>

            <div className={classes.textSection}>
              <div className={classes.btnCont}>
                <button onClick={() => connectWeb3()} className={classes.btn}>
                  <GoogleIcon sx={{ marginRight: 25 }} />
                  Social Login
                </button>
              </div>
            </div>
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
    width: "350px",
    color: "#000",
    outline: "none",
    boxShadow: "0px 4px 4px rgba(0, 0, 0, 0.25)",
    display: "flex",
    flexDirection: "column",
    position: "relative",
  },
  graphicSection: {
    position: "relative",
    height: "200px",
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
    display: "flex",
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

export default ChoiceModal;
