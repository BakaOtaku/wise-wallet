import { Container, Grid } from "@mui/material";
import { makeStyles } from "@mui/styles";

const Team = () => {
  const classes = useStyles();

  return (
    <section className={classes.details}>
      <Container className={classes.container}>
        <Grid container spacing={3}>
          <Grid item xs={12} sm={6}>
            <h1 className={classes.title}>Team</h1>
            <div className={classes.text}>
              We are a team of three engineers working togerther for past 3
              years. With a collective background on different technologies, our
              journey has guided us through numerous successful projects.
            </div>
          </Grid>

          <Grid item xs={12} sm={6}>
            <div className={classes.graphicContainer}>
              <div className={classes.team}>
                <img
                  src="https://avatars.githubusercontent.com/u/42795731?v=4"
                  alt="graphic"
                  draggable="false"
                  className={classes.teamImg}
                />
                <div className={classes.name}>Arpit Srivastava</div>
                <div className={classes.subname}>SDE @CertiK</div>
              </div>
              <div className={classes.team}>
                <img
                  src="https://avatars.githubusercontent.com/u/47004499?v=4"
                  alt="graphic"
                  draggable="false"
                  className={classes.teamImg}
                />
                <div className={classes.name}>Aniket Dixit</div>
                <div className={classes.subname}>SDE @Tendermint</div>
              </div>
              <div className={classes.team}>
                <img
                  src="https://avatars.githubusercontent.com/u/42104907?v=4"
                  alt="graphic"
                  draggable="false"
                  className={classes.teamImg}
                />
                <div className={classes.name}>Aman Raj</div>
                <div className={classes.subname}>SDE @Biconomy</div>
              </div>
            </div>
          </Grid>
        </Grid>

        <div className={classes.btnCont}>
          <button
            className={classes.btn}
            onClick={() =>
              window.open("https://github.com/BakaOtaku", "_blank")
            }
          >
            {/* <GitHub style={{ fontSize: "26px" }} /> */}
            bakaotaku
          </button>
        </div>
      </Container>
    </section>
  );
};

const useStyles = makeStyles(() => ({
  details: {
    padding: "60px 10px",
    position: "relative",
    maxWidth: 1100,
    margin: "0 auto",
    "@media (max-width:959px)": {
      padding: "0 10px",
      paddingBottom: "60px",
    },
  },
  container: {
    maxWidth: 1080,
    margin: "0 auto",
    padding: 40,
    backgroundColor: "#fff",
    borderRadius: 25,
    border: "1.5px solid #6599dc",
    "@media (max-width:959px)": {
      paddingBottom: 100,
    },
  },
  title: {
    margin: "10px 0",
    fontSize: 35,
    fontFamily: "Josefin Slab",
    color: "rgb(25, 56, 51)",
  },
  text: {
    fontSize: 17,
    fontWeight: "400",
    color: "rgba(25, 56, 51, 0.8)",
    fontFamily: "Inter",
    margin: "30px 8px",
  },
  graphicContainer: {
    minHeight: 320,
    height: "100%",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 20,

    "@media (max-width:959px)": {
      flexDirection: "column",
    },
  },
  team: {
    textAlign: "center",
  },
  teamImg: {
    width: 120,
  },
  name: {
    fontSize: 14,
  },
  subname: {
    marginTop: 10,
    fontSize: 12,
  },
  graphic: {
    width: 130,
    "@media (max-width:959px)": {
      float: "none",
    },
    "@media (max-width:599px)": {
      display: "block",
      margin: "auto",
    },
    "@media (max-width:340px)": {
      display: "block",
      margin: "auto",
    },
  },
  btnCont: {
    clipPath: "polygon(0 0, 100% 0, 100% 80%, 0 80%)",
    backgroundColor: "#A6C4EB",
    borderRadius: 24,
    maxWidth: 450,
    width: "80%",
    height: 100,
    display: "flex",
    position: "absolute",
    bottom: "-10px",
    left: "50%",
    transform: "translate(-50%, -50%)",
    justifyContent: "center",
  },
  btn: {
    padding: "0px 10px",
    margin: "auto",
    marginBottom: 15,
    boxSizing: "border-box",
    height: 40,
    background: "rgb(151, 252, 228)",
    borderRadius: 5,
    fontSize: 20,
    fontWeight: 400,
    // lineHeight: 38,
    fontFamily: "Josefin Slab",
    color: "rgb(25, 56, 51)",
    textDecoration: "none",
    border: "none",
    boxShadow: "none",
    cursor: "pointer",
  },
}));

export default Team;
