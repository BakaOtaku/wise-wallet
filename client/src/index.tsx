import * as React from "react";
import * as ReactDOM from "react-dom/client";
import { ThemeProvider } from "@emotion/react";
import { CssBaseline } from "@mui/material";
import "react-toastify/dist/ReactToastify.css";
import { SigningCosmWasmProvider } from "@/context/cosmwasm";
import { Web3Provider } from "./context/Web3Auth";
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
        <Web3Provider>
          <App />
        </Web3Provider>
      </SigningCosmWasmProvider>
    </ThemeProvider>
  </React.StrictMode>
);
