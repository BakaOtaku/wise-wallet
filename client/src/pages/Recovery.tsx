import { makeStyles } from "@mui/styles";
import { ToastContainer } from "react-toastify";

import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import RecoveryTable from "@/components/RecoveryTable";

const PasskeysCont = () => {
  const classes = useStyles();

  return (
    <div className={classes.bgCover}>
      <Navbar />
      <div style={{ borderTop: "2px solid #282b4c" }}></div>
      <div className={classes.market}>
        <div style={{ height: 10 }}></div>
        <div className={classes.cont_img}>
          <img
            src="img/logo_main.png"
            alt="main"
            className={classes.logo}
            draggable="false"
          />
        </div>

        <div className={classes.contText}>Forgot your keys? No problem.</div>
        <div className={classes.contText2}>
          Guardians - A set of trusted friends can help you recover your keys.
          <br />
          Threshold - Number of guardians required to recover your keys.
        </div>
        <div style={{ margin: "30px 50px", }}>
          <RecoveryTable />
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
    // whiteSpace: "nowrap",
    fontFamily: "Inter",
    fontWeight: 500,
    fontSize: 28,
    marginTop: 30,
    color: "rgba(25, 56, 51, 1)",
    textAlign: "center",
  },
  contText2: {
    margin: "8px auto",
    // whiteSpace: "nowrap",
    fontFamily: "Inter",
    fontWeight: 500,
    fontSize: 14,
    color: "rgba(25, 56, 51, 0.7)",
    textAlign: "center",
  },
}));

export default PasskeysCont;
