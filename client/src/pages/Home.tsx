import { makeStyles } from "@mui/styles";

import HomeNav from "@/components/Home/HomeNav";
import MainCont from "@/components/Home/Hero";
import FeatCont from "@/components/Home/Feat";
import Team from "@/components/Home/Team";
import Footer from "@/components/Footer";

const Index = () => {
  const classes = useStyles();

  return (
    <div className={classes.bgCover}>
      <HomeNav />
      <MainCont />
      <FeatCont />
      <Team />
      <Footer color="rgb(7, 39, 35)" />
    </div>
  );
};

const useStyles = makeStyles(() => ({
  bgCover: {
    fontFamily: "'Roboto', sans-serif",
    fontWeight: 500,
    margin: "auto",
    backgroundColor: "#f6fefd",
    // background: "url('/backgrounds/background-circles.svg') no-repeat center center fixed",
  },
}));

export default Index;
