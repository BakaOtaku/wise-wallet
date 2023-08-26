import React, { useState } from "react";
import { Button, InputBase } from "@mui/material";
import { makeStyles } from "@mui/styles";

const Intent: React.FC = () => {
  const classes = useStyles();
  const [inputValue, setInputValue] = useState("");

  const handleSubmit = () => {
    console.log(inputValue);
  };

  return (
    <div className={classes.root}>
      <InputBase
        className={classes.input}
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        placeholder="Swap 1 NEO for best rate available..."
        sx={{ width: "100%", borderRadius: 50, paddingLeft: 2 }}
      />
      <Button
        className={classes.button}
        variant="contained"
        color="primary"
        onClick={handleSubmit}
        sx={{
          border: "none",
          backgroundColor: "rgb(7, 39, 35)",
          color: "white",
          height: 45,
          borderTopRightRadius: 50,
          borderBottomRightRadius: 50,
          boxShadow: "none",
          transition: "background-color 0.3s ease-in-out",
          "&:hover": {},
        }}
      >
        Submit
      </Button>
    </div>
  );
};

const useStyles = makeStyles(() => ({
  root: {
    display: "flex",
    alignItems: "center",
    height: 45,
    border: "1px solid transparent",
    borderRadius: 50,
    background:
      "linear-gradient(90deg, rgba(61,207,188,1) 0%, rgba(31,149,157,1) 35%, rgba(0,212,255,1) 100%)",
    transition: "background 0.3s ease-in-out",
    boxShadow: "rgba(151, 252, 215, 0.2) 0px 0px 30px 5px",
    "&:hover": {
      background:
        "linear-gradient(90deg, rgba(61,207,188,0.8) 0%, rgba(31,149,157,0.8) 35%, rgba(0,212,255,0.8) 100%)",
    },
  },
  input: {
    color: "white",
    transition: "background-color 0.3s ease-in-out",
    "&:hover": {
      backgroundColor: "rgba(255, 255, 255, 0.1)",
    },
  },
  button: {},
}));

export default Intent;
