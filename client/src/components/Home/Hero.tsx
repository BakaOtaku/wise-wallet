import { Container, Grid } from "@mui/material";
import { makeStyles } from "@mui/styles";
import { Link } from "react-router-dom";

const Main = () => {
  const classes = useStyles();

  return (
    <section className={classes.details}>
      <div className={classes.container}>
        <div style={{ height: 90 }}></div>
        <div className={classes.cont_img}>
          <img
            src="img/logo_main.png"
            alt="main"
            className={classes.logo}
            draggable="false"
          />
        </div>

        <div className={classes.contTitle}>
          Account Abstraction on{"  "}
          <span style={{ fontStyle: "italic" }}>Steroids</span>
        </div>

        <div className={classes.contText}>
          Wise Wallet is a modular wallet that
          <br />
          helps you make any process seamless.
        </div>

        <div className={classes.trade}>
          <div className={classes.tradeCont}>
            <div className={classes.btnCont}>
              <Link to="/intent" className={classes.btn}>
                Live Demo
              </Link>
            </div>
            <div className={classes.tradeImg}></div>
          </div>
        </div>
      </div>
    </section>
  );
};

const useStyles = makeStyles((theme) => ({
  details: {
    background:
      "url(/backgrounds/background-circles.svg) center 71px / auto no-repeat",
    height: 800,
  },
  container: {
    margin: "0px auto",
    width: 1200,
    maxWidth: "calc(100% - 60px)",
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
    color: "rgba(25, 56, 51, 0.8)",
    textAlign: "center",
  },
  tradeCont: {
    margin: 0,
    padding: 0,
  },
  trade: {
    position: "relative",
    maxWidth: 996,
    height: 400,
    margin: "0px auto",
    background: "rgb(2, 35, 30)",
    borderRadius: "12px 12px 0px 0px",
    padding: "13px 28px 0px",
    boxSizing: "border-box",
    boxShadow: "rgba(151, 252, 215, 0.56) 0px 0px 30px 5px",
  },
  btnCont: {
    position: "absolute",
    top: -28,
    width: "calc(100% - 56px)",
    display: "flex",
    justifyContent: "center",
  },
  btn: {
    padding: "9px 40px",
    boxSizing: "border-box",
    // height: 56,
    background: "rgb(151, 252, 228)",
    borderRadius: 60,
    fontSize: 20,
    fontWeight: 400,
    // lineHeight: 38,
    color: "rgb(25, 56, 51)",
    textDecoration: "none",
  },
  tradeImg: {
    width: "100%",
    height: "450px",
    background: "url(/img/demo.png) 0% 0% / cover no-repeat",
  },
}));

export default Main;
