import { makeStyles } from "@mui/styles";

const ErrorBox = ({ message }: any) => {
  const classes = useStyles();
  return (
    <div>
      <p className={classes.formError}>
        <b>Error:</b>
        <br />
        {message}
      </p>
    </div>
  );
};

const useStyles = makeStyles((theme) => ({
  formError: {
    fontSize: "15px",
    maxWidth: "400px",
    color: "#ce1212",
    backgroundColor: "#FFDEDE",
    padding: "20px",
    marginTop: "26px",
    borderRadius: "6px",
  },
}));

export default ErrorBox;
