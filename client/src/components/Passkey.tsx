import React, { useState } from "react";
import { Button, InputBase } from "@mui/material";
import { makeStyles } from "@mui/styles";

const PasskeyLogic: React.FC = () => {
  const classes = useStyles();
  const [inputValue, setInputValue] = useState("");

  const handleSubmit = () => {
    console.log(inputValue);
  };

  return (
    <div className={classes.root}>

    </div>
  );
};

const useStyles = makeStyles(() => ({
  root: {
    display: "flex",

  },
}));

export default PasskeyLogic;
