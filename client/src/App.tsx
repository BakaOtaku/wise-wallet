import React from "react";
import { Switch, Route, BrowserRouter } from "react-router-dom";
import { WalletProvider } from "@rentfuse-labs/neo-wallet-adapter-react";
import {
  getNeoLineWallet,
  getO3Wallet,
  getWalletConnectWallet,
} from "@rentfuse-labs/neo-wallet-adapter-wallets";
import { WalletModalProvider } from "@rentfuse-labs/neo-wallet-adapter-react-ui";

// Default styles that can be overridden by your app
import "@rentfuse-labs/neo-wallet-adapter-react-ui/styles.css";

import Home from "@/pages/Home";
import Intent from "@/pages/Intent";
import Passkeys from "@/pages/Passkeys";

const App = () => {
  // @rentfuse-labs/neo-wallet-adapter-wallets includes all the adapters but supports tree shaking --
  // Only the wallets you configure here will be compiled into your application
  const wallets = React.useMemo(
    () => [
      getNeoLineWallet(),
      getO3Wallet(),
      getWalletConnectWallet({
        options: {
          metadata: {
            name: "Example",
            description: "Example description",
            url: "https://amanraj.dev",
            icons: [
              "https://raw.githubusercontent.com/rentfuse-labs/neonova/main/neonova-icon.png",
            ],
          },
          logger: "debug",
        },
        network: "neo3:testnet",
      }),
    ],
    []
  );

  return (
    <React.Fragment>
      <WalletProvider wallets={wallets} autoConnect={true}>
        <WalletModalProvider>
          <BrowserRouter>
            <Switch>
              <Route exact path="/" component={Home} />
              <Route exact path="/intent" component={Intent} />
              <Route exact path="/passkeys" component={Passkeys} />
            </Switch>
          </BrowserRouter>
        </WalletModalProvider>
      </WalletProvider>
    </React.Fragment>
  );
};

export default App;
