import { useState } from "react";
// @ts-ignore
import Blockies from "react-blockies";

import { makeStyles } from "@mui/styles";
import { useSigningClient } from "@/context/cosmwasm";

const truncateAddress = (address: string) => {
  return address.slice(0, 6) + "..." + address.slice(-4);
};

const ConnectWallet = () => {
  const classes = useStyles();
  const { walletAddress, connectWallet, disconnect } = useSigningClient();
  const [showLogout, setShowLogout] = useState(false);

  const toggleLogoutButton = () => {
    showLogout ? setShowLogout(false) : setShowLogout(true);
  };

  const disconnectWallet = () => {
    disconnect();
    setShowLogout(false);
  };

  return (
    <div className={classes.walletBtnContainer}>
      <button
        className={classes.walletBtn}
        onClick={walletAddress ? toggleLogoutButton : connectWallet}
      >
        <Blockies
          className={`${classes.img} ${walletAddress ? "green" : "red"}`}
          seed={walletAddress ? walletAddress : ""}
        />
        <div style={{ fontFamily: "Roboto", fontWeight: 700 }}>
          {walletAddress ? truncateAddress(walletAddress) : "Connect Wallet"}
        </div>
      </button>
      {showLogout && (
        <div onClick={disconnectWallet} className={classes.logout}>
          Logout
        </div>
      )}
    </div>
  );
};

const useStyles = makeStyles((theme) => ({
  walletBtnContainer: {
    display: "flex",
    position: "relative",
  },
  walletBtn: {
    background: "#282b4c",
    cursor: "pointer",
    border: 0,
    outline: "none",
    borderRadius: 5,
    height: "36px",
    lineHeight: "36px",
    padding: "0 18px 0 8px",
    display: "flex",
    alignItems: "center",
    color: "white",

    "@media (max-width:599px)": {
      padding: 0,
    },

    "&:hover": {
      // backgroundColor: "#B3C99C",
    },

    "& div": {
      "@media (max-width:599px)": {
        margin: 0,
        display: "none",
      },
    },
  },
  img: {
    borderRadius: "12px",
    marginRight: 10,
    height: "24px !important",
    width: "24px !important",

    "&.green": {
      borderColor: "green",
    },

    "&.red": {
      borderColor: "red",
    },

    "@media (max-width:599px)": {
      marginRight: 0,
      height: "36px !important",
      width: "36px !important",
      borderRadius: "20px",
      border: "2px solid",
    },
  },
  logout: {
    position: "absolute",
    zIndex: 100,
    backgroundColor: "#282b4c",
    width: "100%",
    height: "36px",
    lineHeight: "36px",
    padding: "0 18px",
    borderRadius: "18px",
    top: "40px",
    right: "0",
    cursor: "pointer",
    textAlign: "center",
    fontWeight: "600",

    "&:hover": {
      // color: "white",
      backgroundColor: "#B3C99C",
    },

    "@media (max-width:599px)": {
      width: "auto",
    },
  },
}));

export default ConnectWallet;
