import React, { useCallback, useContext, useEffect, useState } from "react";
import { Web3Auth } from "@web3auth/modal";
import { OpenloginAdapter } from "@web3auth/openlogin-adapter";
import { Secp256k1Wallet } from "@cosmjs/launchpad";
import { NibiruSigningClient } from "@nibiruchain/nibijs";

interface web3ContextType {
  connectWeb3: () => Promise<void>;
  disconnect: () => Promise<void>;
  signerClient: any;
  loading: boolean;
  chainId: string;
  web3auth: any;
  address: string;
}

export const Web3Context = React.createContext<web3ContextType>({
  connectWeb3: () => Promise.resolve(),
  disconnect: () => Promise.resolve(),
  loading: false,
  signerClient: null,
  web3auth: null,
  chainId: "",
  address: "",
});

export const useWeb3Context = () => useContext(Web3Context);

type StateType = {
  signerClient?: any;
  address?: string;
  chainId?: string;
  web3auth?: any;
};

const initialState: StateType = {
  signerClient: null,
  address: "",
  chainId: "cosmoshub-testnet",
  web3auth: null,
};

export const Web3Provider = ({ children }: any) => {
  const [web3State, setWeb3State] = useState<StateType>(initialState);
  const { signerClient, address, chainId, web3auth } = web3State;
  const [loading, setLoading] = useState(true);

  const connectWeb3 = useCallback(async () => {
    try {
      setLoading(true);
      const web3auth = new Web3Auth({
        clientId:
          "BNLONw56H0mc9QTva3Av20wHEI17mg8toioLsMZLsEEl7QqXweCux_7iuleqAb1BdD-TSuZEoOhnNdk4c84zSYg",
        web3AuthNetwork: "cyan",
        chainConfig: {
          chainNamespace: "other",
          rpcTarget: "https://rpc.sentry-02.theta-testnet.polypore.xyz",
          displayName: "Cosmos",
          blockExplorer: "https://nibiru.explorers.guru",
          ticker: "ATOM",
          tickerName: "Cosmos",
          chainId: "cosmoshub-testnet",
        },
      });

      const openloginAdapter = new OpenloginAdapter({
        adapterSettings: {
          uxMode: "popup",
        },
      });
      web3auth.configureAdapter(openloginAdapter);

      await web3auth.initModal();

      const web3authProvider = await web3auth.connect();

      const pkey = await web3authProvider?.request({
        method: "private_key",
      });
      console.log({ pkey });

      const privateKeyUint8Array = new Uint8Array(
        Buffer.from(pkey as string, "hex")
      );
      const signer1 = await Secp256k1Wallet.fromKey(
        privateKeyUint8Array,
        "nibi"
      );
      console.log(signer1);
      const signingClient = await NibiruSigningClient.connectWithSigner(
        "https://rpc-falcron.pion-1.ntrn.tech",
        signer1
      );

      const [{ address }] = await signer1.getAccounts();
      console.log({ signingClient, address, web3auth });

      setWeb3State({
        signerClient: signingClient,
        address: address,
        chainId: "pion-1",
        web3auth: web3auth,
      });
      setLoading(false);
    } catch (error) {
      console.log({ web3ModalError: error });
    }
    setLoading(false);
  }, []);

  const disconnect = useCallback(async () => {
    console.log({ web3auth });
    if (web3auth) {
      await web3auth.clearCache();
      setWeb3State(initialState);
    }
  }, [web3auth]);

  useEffect(() => {}, [chainId, connectWeb3]);

  useEffect(() => {}, [signerClient, disconnect]);

  return (
    <Web3Context.Provider
      value={{
        connectWeb3,
        disconnect,
        loading,
        web3auth,
        signerClient: signerClient || null,
        chainId: chainId || "",
        address: address || "",
      }}
    >
      {children}
    </Web3Context.Provider>
  );
};
