import * as React from "react";
import * as ReactDOM from "react-dom/client";
import { ThemeProvider } from "@emotion/react";
import { CssBaseline } from "@mui/material";
import "react-toastify/dist/ReactToastify.css";

import { SigningCosmWasmProvider } from "@/context/cosmwasm";
import theme from "./theme";
import App from "./App";

const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement
);

root.render(
  <React.StrictMode>
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <SigningCosmWasmProvider>
        <App />
      </SigningCosmWasmProvider>
    </ThemeProvider>
  </React.StrictMode>
);
