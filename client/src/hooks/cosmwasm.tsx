import { useState } from "react";
import { connectKeplr } from "@/services/keplr";
import { SigningCosmWasmClient } from "@cosmjs/cosmwasm-stargate";

export interface ISigningCosmWasmClientContext {
  walletAddress: string;
  signingClient: SigningCosmWasmClient | null;
  loading: boolean;
  error: any;
  connectWallet: any;
  disconnect: Function;
}

const PUBLIC_RPC_ENDPOINT = "https://rpc-falcron.pion-1.ntrn.tech";
const PUBLIC_CHAIN_ID = "pion-1";
// const GAS_PRICE = "0.001";

export const useSigningCosmWasmClient = (): ISigningCosmWasmClientContext => {
  const [walletAddress, setWalletAddress] = useState("");
  const [signingClient, setSigningClient] =
    useState<SigningCosmWasmClient | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const connectWallet = async () => {
    setLoading(true);

    try {
      await connectKeplr();
      console.log("keplr connected");

      // enable website to access kepler
      await (window as any).keplr.enable(PUBLIC_CHAIN_ID);

      // get offline signer for signing txs
      const offlineSigner = await (window as any).getOfflineSigner(
        PUBLIC_CHAIN_ID
      );

      // make client
      const client = await SigningCosmWasmClient.connectWithSigner(
        PUBLIC_RPC_ENDPOINT,
        offlineSigner
      );
      console.log("client", client);
      setSigningClient(client);

      // get user address
      const [{ address }] = await offlineSigner.getAccounts();
      console.log("address", address);
      setWalletAddress(address);

      setLoading(false);
    } catch (error: any) {
      console.error(error);
      setError(error);
    }
  };

  const disconnect = () => {
    if (signingClient) {
      signingClient.disconnect();
    }
    setWalletAddress("");
    setSigningClient(null);
    setLoading(false);
  };

  return {
    walletAddress,
    signingClient,
    loading,
    error,
    connectWallet,
    disconnect,
  };
};
