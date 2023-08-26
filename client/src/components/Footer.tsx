import { GitHub, Twitter } from "@mui/icons-material";
import { makeStyles } from "@mui/styles";

const Footer = ({ color }: any) => {
  const classes = useStyles();

  return (
    <footer
      className={classes.footer}
      style={{
        backgroundColor: color,
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          padding: "0px 20px",
          maxWidth: 1280,
          margin: "auto",
        }}
      >
        <div
          style={{
            margin: "auto",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <img src="/img/logo-white.png" alt="logo" className={classes.logo} />
          <p className={classes.text}>Wise Wallet</p>
        </div>
        {/* <div className={classes.smIconsContainer}>
          <a
            href="https://twitter.com/"
            target="_blank"
            rel="noreferrer"
          >
            <div className={classes.smIcon}>
              <Twitter style={{ fontSize: "26px" }} />
            </div>
          </a>
          <a
            href="https://github.com/"
            target="_blank"
            rel="noreferrer"
          >
            <div className={classes.smIcon}>
              <GitHub style={{ fontSize: "26px" }} />
            </div>
          </a>
        </div> */}
      </div>
    </footer>
  );
};

const useStyles = makeStyles((theme) => ({
  ...theme,
  footer: {
    position: "relative",
    borderTop: "2px solid #9DB2BF",
    display: "block",
    padding: "25px 0 50px 0",
  },
  logo: {
    height: "40px",
    margin: "auto",
    // marginRight: "10px",
  },
  text: {
    color: "rgba(255, 255, 255, 0.8)",
    fontSize: "16px",
    fontWeight: "600",
    // maxWidth: "360px",
    marginBottom: 0,
    // marginTop: "20px",
  },
  smIcon: {
    width: "40px",
    height: "40px",
    borderRadius: "6px",
    backgroundColor: "#576CBC",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    color: "#ffffff",
    transition: "0.1s ease",
    "&:first-child": {
      marginRight: "20px",
    },

    "&:hover": {
      backgroundColor: "white",
      color: "#8247E5",

      "& svg": {
        fill: "black",
      },
    },

    "& svg": {
      fill: "#fff",
      width: "30px",
    },

    "@media (max-width:599px)": {
      marginTop: "30px",
    },
  },
  smIconsContainer: {
    display: "flex",
    height: "100%",
    alignItems: "flex-end",
    justifyContent: "flex-end",
    "@media (max-width:599px)": {
      justifyContent: "flex-start",
    },
  },
}));

export default Footer;
