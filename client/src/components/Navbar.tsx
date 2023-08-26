import { useState, useRef } from "react";
import { NavLink } from "react-router-dom";
import { AppBar, Container } from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import { makeStyles } from "@mui/styles";
import { WalletMultiButton } from "@rentfuse-labs/neo-wallet-adapter-react-ui";

const Navbar = () => {
  const classes = useStyles();

  // to toggle the menu
  const [openMenu, setOpenMenu] = useState(false);
  const menuItemContainerRef = useRef<any>(null);
  const toggleMenu = (state: any) => {
    state
      ? menuItemContainerRef.current.classList.add("open")
      : menuItemContainerRef.current.classList.remove("open");
    setOpenMenu(state);
  };

  return (
    <AppBar position="static" classes={{ root: classes.nav }}>
      <Container className={classes.container}>
        <div className={classes.flexContainer}>
          <NavLink style={{ display: "flex", alignItems: "center" }} to="/">
            <img
              src="/img/logo-white.png"
              alt="logo"
              className={classes.logo}
            />
            <h1 className={classes.title}>WiseWallet</h1>
          </NavLink>

          <div className={classes.rightSec}>
            <div
              className={classes.menuItemContainer}
              ref={menuItemContainerRef}
            >
              <NavLink
                to="/intent"
                className={(isActive) => `menuItem ${isActive ? "active" : ""}`}
              >
                Intents
              </NavLink>

              <NavLink
                to="/passkeys"
                className={(isActive) => `menuItem ${isActive ? "active" : ""}`}
              >
                Passkeys
              </NavLink>

              <NavLink
                to="/docs"
                className={(isActive) => `menuItem ${isActive ? "active" : ""}`}
              >
                Docs
              </NavLink>
            </div>

            <WalletMultiButton
              style={{
                border: "none",
                fontSize: 14,
                padding: "0px 15px",
                height: 40,
                backgroundColor: "#234c4d",
              }}
            />

            <MenuIcon
              className={classes.menuIcon}
              onClick={() => {
                openMenu ? toggleMenu(false) : toggleMenu(true);
              }}
            />
          </div>
        </div>
      </Container>
    </AppBar>
  );
};

const useStyles = makeStyles(() => ({
  container: {
    margin: "auto",
    padding: "0",
    "@media (max-width:1120px)": {
      padding: "0 20px",
    },
    "@media (max-width:599px)": {
      padding: "0 15px",
    },
  },
  logo: {
    height: 40,
    marginRight: 10,
  },
  title: {
    fontFamily: "Josefin Slab",
    fontSize: 24,
    fontWeight: 700,
    width: "max-content",
    color: "#234c4d",
    "@media (max-width:599px)": {
      fontSize: "20px",
    },
  },
  nav: {
    height: "70px",
    padding: "0 30px",
    position: "relative",
  },
  flexContainer: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
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
    display: "flex",
    zIndex: 10,
    "@media (max-width:599px)": {
      display: "flex",
      flexDirection: "column",
      position: "absolute",
      backgroundColor: "rgb(255,254,246, 0.4)",
      width: "100%",
      top: "70px",
      left: 0,
      padding: 0,
      height: 0,
      overflow: "hidden",
      transition: "all 0.5s ease",
    },
    "&.open": {
      padding: "20px 0",
      height: "auto",
      transition: "all 0.5s ease",
    },
    "& .menuItem": {
      marginRight: "30px",
      fontSize: 18,
      textDecoration: "none",
      lineHeight: "36px",
      fontFamily: "Asul",
      fontWeight: 700,
      color: "#234c4d",
      "&:hover": {
        // textDecoration: "underline",
      },
      "@media (max-width:599px)": {
        margin: 0,
        color: "#234c4d",
        textAlign: "center",
        lineHeight: "50px",
      },
    },
    "& .active": {
      color: "#234c4d",
      textDecoration: "overline",
    },
  },
  menuIcon: {
    display: "none !important",
    height: 38,
    width: 38,
    background: "#B0DAFF",
    color: "#234c4d",
    "@media (max-width:599px)": {
      marginLeft: "20px",
      display: "flex !important",
    },
  },
}));

export default Navbar;
