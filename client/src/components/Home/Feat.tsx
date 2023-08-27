import { makeStyles } from "@mui/styles";

const Why = () => {
  const classes = useStyles();

  return (
    <section className={classes.details}>
      <div className={classes.featTop}></div>
      <div className={classes.featCont}>
        <div className={classes.feat}>
          <div className={classes.featTitle}>
            Modules infrastructure that makes Neo ecosystem more powerful.
          </div>

          <div className={classes.listCont}>
            <div className={classes.listItem}>
              <div className={classes.list}>
                <img src="/svg/powerful.svg" alt="" />
                <div>
                  <div className="property-title">Modules.</div>
                  <div className="property-text">
                    The modular infrastructure makes the Neo ecosystem more
                    powerful.
                  </div>
                </div>
              </div>
              <div className={classes.list2}>
                <div className="list2Item">
                  <img src="/svg/zero.svg" alt="" />
                  <div>
                    <div className="property-title">Limit hooks.</div>
                    <div className="property-text">
                      Sign a trigger limit for tokens like USDC, and when you
                      price deop down to the trigger limit signed, the order
                      will be executed.
                    </div>
                  </div>
                </div>
                <div className="list2Item">
                  <img src="/svg/leverage.svg" alt="" />
                  <div>
                    <div className="property-title">Passkeys.</div>
                    <div className="property-text" style={{ marginBottom: 25 }}>
                      Use webauthn to sign transactions. The neo and passkeys
                      uses secp256r1 curve, it makes the UX revolutionary.
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className={classes.listItem}>
              <div className={classes.list} style={{ border: "none" }}>
                <img src="/svg/fast.svg" alt="" />
                <div>
                  <div className="property-title">Intents.</div>
                  <div className="property-text">
                    Intents are partial transactions. Useful when you lack the
                    information to construct a complete transaction.
                  </div>
                </div>
              </div>
              <div className={classes.list2} style={{ border: "none" }}>
                <div className="list2Item">
                  <img src="/svg/transparent.svg" alt="" />
                  <div>
                    <div className="property-title">Solvers.</div>
                    <div className="property-text">
                      Solvers are the modules that solve the intents. They are
                      the ones that construct the complete transaction.
                    </div>
                  </div>
                </div>
                <div className="list2Item">
                  <img src="/svg/seamless.svg" alt="" />
                  <div>
                    <div className="property-title">Marketplace.</div>
                    <div className="property-text">
                      The marketplace is a place where you can find solvers that
                      solve intents.
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

const useStyles = makeStyles(() => ({
  details: {
    background: "rgb(7, 39, 35)",
    position: "relative",
    "@media (max-width:959px)": {
      // padding: "0 10px",
      // paddingBottom: "20px",
    },
  },
  featCont: {
    margin: "0px auto",
    width: 1200,
    maxWidth: "calc(100% - 60px)",
  },
  feat: {
    display: "flex",
    flexDirection: "column",
    padding: "48px 0px",
    margin: "0px auto",
    position: "relative",
  },
  featTop: {
    position: "absolute",
    top: "-8px",
    left: 0,
    right: 0,
    height: 78,
    background: "rgb(7, 39, 35)",
    zIndex: 900,
  },
  featTitle: {
    fontFamily: "Inter",
    fontStyle: "normal",
    fontWeight: 300,
    fontSize: 28,
    color: "rgb(255, 255, 255)",
    margin: "30px auto",
    textAlign: "center",
  },
  listCont: {
    margin: 0,
    padding: 0,
  },
  listItem: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    width: 1200,
    maxWidth: "100%",
    margin: "0px auto",
  },
  list: {
    display: "grid",
    gridTemplateColumns: "auto 1fr",
    borderRight: "1px solid rgb(35, 82, 76)",
    borderBottom: "1px solid rgb(35, 82, 76)",

    // img
    "& img": {
      width: 144,
      height: 144,
      transition: "all 0.2s ease-in-out 0s",

      // hover
      "&:hover": {
        transform: "scale(1.2)",
      },
    },

    "& div": {
      margin: "20px 0px",

      "&.property-title": {
        fontFamily: "Josefin Slab",
        fontSize: 30,
        color: "rgb(219, 251, 246)",
      },

      "&.property-text": {
        fontFamily: "Inter",
        fontSize: 18,
        color: "rgba(255, 255, 255, 0.8)",
      },
    },
  },
  list2: {
    display: "grid",
    // gridTemplateColumns: "1fr 1fr",
    gridTemplateRows: "1fr 1fr",
    borderBottom: "1px solid rgb(35, 82, 76)",

    // img
    "& img": {
      width: 144,
      height: 144,
      transition: "all 0.2s ease-in-out 0s",

      // hover
      "&:hover": {
        transform: "scale(1.2)",
      },
    },

    "& .list2Item": {
      display: "grid",
      gap: 18,
      gridTemplateColumns: "auto 1fr",

      "& .property-title": {
        fontFamily: "Josefin Slab",
        fontSize: 30,
        justifyContent: "center",
        color: "rgb(219, 251, 246)",
        marginTop: 20,
      },

      "& .property-text": {
        fontFamily: "Inter",
        fontSize: 18,
        color: "rgba(255, 255, 255, 0.8)",
      },
    },
  },
}));

export default Why;
