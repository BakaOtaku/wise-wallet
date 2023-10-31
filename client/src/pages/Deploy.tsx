import { useState } from "react";
import { makeStyles } from "@mui/styles";
import { ToastContainer } from "react-toastify";

import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
// import Passkeys from "@/components/Passkey";

const PasskeysCont = () => {
  const classes = useStyles();

  return (
    <div className={classes.bgCover}>
      <Navbar />
      <div style={{ borderTop: "2px solid #282b4c" }}></div>
      <div className={classes.market}>
        <div style={{ height: 20 }}></div>
        <div className={classes.cont_img}>
          <img
            src="img/logo_main.png"
            alt="main"
            className={classes.logo}
            draggable="false"
          />
        </div>

        <div className={classes.contText}>
          Wise Wallet - Bringing best UX to Cosmos.
        </div>
        <div className={classes.contText2}>
          With Wise wallets, you can build powerful and easy-to-use Web3
          <br />
          applications that are only possible with account abstraction (AA).
        </div>
        <div style={{ width: "100%", margin: "auto" }}>
          <button
            onClick={() => {}}
            className={classes.btn}
            style={{
              margin: "auto",
              marginTop: "5%",
            }}
          >
            Deploy your wallet →
          </button>
        </div>
      </div>
      <Footer color="rgb(7, 39, 35)" />
      <ToastContainer position="bottom-left" newestOnTop theme="dark" />
    </div>
  );
};

const useStyles = makeStyles(() => ({
  bgCover: {
    fontFamily: "'Roboto', sans-serif",
    fontWeight: 500,
    backgroundColor: "#f6fefd",
    background: "url(/img/background.svg) center 71px / auto no-repeat",
  },
  market: {
    maxWidth: 1000,
    minHeight: "80vh",
    margin: "10px auto",
  },
  cont_img: {
    margin: "20px auto -20px",
    maxWidth: 100,
  },
  logo: {
    width: "100%",
  },
  contTitle: {
    fontFamily: "Josefin Slab",
    fontSize: 50,
    letterSpacing: "-0.01em",
    color: "rgb(25, 56, 51)",
    textAlign: "center",

    "@media (max-width:659px)": {
      fontSize: 30,
    },
  },
  contText: {
    margin: "8px auto",
    whiteSpace: "nowrap",
    fontFamily: "Inter",
    fontWeight: 500,
    fontSize: 28,
    marginTop: 20,
    color: "rgba(25, 56, 51, 0.9)",
    textAlign: "center",
  },
  contText2: {
    margin: "15px auto",
    // whiteSpace: "nowrap",
    fontFamily: "Inter",
    fontWeight: 500,
    fontSize: 15,
    color: "rgba(25, 56, 51, 0.7)",
    textAlign: "center",
  },
  btn: {
    margin: "20px 0 20px 40%",
    background: "rgb(40,43,76, 0.9)",
    cursor: "pointer",
    border: 0,
    outline: "none",
    borderRadius: 5,
    height: "36px",
    fontSize: 18,
    lineHeight: "36px",
    padding: "0 18px 0 18px",
    borderBottom: "1px solid #000",
    display: "flex",
    alignItems: "center",
    color: "white",

    "@media (max-width:599px)": {
      padding: 0,
    },

    "&:hover": {
      backgroundColor: "rgb(40,43,76, 0.8)",
    },

    "& div": {
      "@media (max-width:599px)": {
        margin: 0,
        display: "none",
      },
    },
  },
}));

export default PasskeysCont;
