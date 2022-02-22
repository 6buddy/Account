import React, { useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";
import { Box } from "@material-ui/core";
import { useLocation } from "react-router";

const useStyles = makeStyles((theme) => ({
  root: {
    "& > *": {
      margin: theme.spacing(1),
      width: "25ch",
    },
  },
}));
const sendPassword = (password, passwordConfirmation, paramId) => {
  console.log(password);
  console.log(passwordConfirmation);
  console.log(paramId);
};

export default function About() {
  const location = useLocation();

  const classes = useStyles();
  const [password, setPassword] = useState("");
  const [passwordConfirmation, setPasswordConfirmation] = useState("");
  console.log(location.search);
  const paramId = location.search.split("=")[1];
  if (!paramId) return null;
  return (
    <Box>
      <h1> Crée votre mot de passe</h1>
      <Box display={"flex"} flexDirection={"column"}>
        <form className={classes.root} noValidate autoComplete="off">
          <TextField
            id="password"
            label="Mot de passe"
            variant="outlined"
            value={password}
            onChange={(e) => {
              setPassword(e.target.value);
            }}
          />
          <TextField
            id="password-confirmation"
            label="Confirmation"
            variant="outlined"
            value={passwordConfirmation}
            onChange={(e) => {
              setPasswordConfirmation(e.target.value);
            }}
          />
          <Button
            mt={2}
            variant="outlined"
            onClick={() => {
              sendPassword(password, passwordConfirmation, paramId);
            }}
          >
            Valider
          </Button>
        </form>
      </Box>
    </Box>
  );
}
