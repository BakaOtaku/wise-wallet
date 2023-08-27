import { Link } from "react-router-dom";
import { makeStyles } from "@mui/styles";

const Navbar = () => {
  const classes = useStyles();

  return (
    <div className={classes.flexContainer}>
      <Link style={{ display: "flex", alignItems: "center" }} to="/">
        <img src="/img/logo_main.png" alt="logo" className={classes.logo} />
        <h1 className={classes.title}>WiseWallet</h1>
      </Link>

      <div className={classes.rightSec}>
        <div className={classes.menuItemContainer}>
          <a
            href="https://arpitsrivastava2012.gitbook.io/wisewallet"
            className="menuItem"
            target="_blank"
            rel="noopener noreferrer"
          >
            Check out docs
          </a>
        </div>
      </div>
    </div>
  );
};

const useStyles = makeStyles(() => ({
  logo: {
    height: 30,
    marginRight: 10,
  },
  title: {
    fontFamily: "Josefin Slab",
    fontSize: 24,
    color: "rgb(25, 56, 51)",
    // color: "#E8F6EF",
    "@media (max-width:599px)": {
      fontSize: "20px",
    },
  },
  nav: {
    margin: "auto",
    position: "relative",
    padding: "0",
    width: "100%",
    height: "70px",
  },
  flexContainer: {
    height: 56,
    marginTop: 16,
    background: "rgb(255, 255, 255)",
    boxShadow: "rgba(7, 39, 35, 0.06) 0px 2px 12px",
    borderRadius: 100,
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "8px 8px 8px 16px",
    boxSizing: "border-box",
    position: "fixed",
    maxWidth: "calc(100% - 60px)",
    width: 1200,
    margin: "0 auto",
    zIndex: 1000,
    transform: "translate(calc(50vw - 50%))",
  },
  rightSec: {
    display: "flex",
    alignItems: "center",
    justifyContent: "end",
    width: "100%",
    "@media (max-width:599px)": {
      justifyContent: "flex-end",
    },
  },
  menuItemContainer: {
    padding: "9px 24px",
    height: 40,
    background: "rgb(151, 252, 228)",
    borderRadius: 60,
    fontSize: 16,
    fontWeight: 400,
    // lineHeight: 22,
    color: "rgb(25, 56, 51)",
    textDecoration: "none",
  },
  menuIcon: {
    display: "none !important",
    height: 38,
    width: 38,
    background: "#B0DAFF",
    // color: "#E8F6EF",
    "@media (max-width:599px)": {
      marginLeft: "20px",
      display: "flex !important",
    },
  },
}));

export default Navbar;
