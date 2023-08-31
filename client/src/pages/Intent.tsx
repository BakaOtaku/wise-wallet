import { useState } from "react";
import { makeStyles } from "@mui/styles";
import { ToastContainer } from "react-toastify";

import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Intent from "@/components/Intent";

const IntentCont = () => {
  const classes = useStyles();
  const [input, setInput] = useState("");

  return (
    <div className={classes.bgCover}>
      <Navbar />
      <div style={{ borderTop: "2px solid #282b4c" }}></div>
      <div className={classes.market}>
        <div style={{ height: 50 }}></div>
        <div className={classes.cont_img}>
          <img
            src="img/logo_main.png"
            alt="main"
            className={classes.logo}
            draggable="false"
          />
        </div>

        <div className={classes.contText}>
          Construct a complete transaction for
          <br />
          Wise Smart contract wallet.
        </div>
        <div style={{ width: "55%", margin: "auto", marginTop: "10%" }}>
          <Intent />
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
    background:
      "url(/img/background.svg) center 71px / auto no-repeat",
  },
  market: {
    maxWidth: 1000,
    minHeight: "75vh",
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
    margin: "12px auto 71px",
    whiteSpace: "nowrap",
    fontFamily: "Inter",
    fontWeight: 500,
    fontSize: 18,
    marginTop: 20,
    color: "rgba(25, 56, 51, 0.8)",
    textAlign: "center",
  },
}));

export default IntentCont;
