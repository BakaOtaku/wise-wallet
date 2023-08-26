export type Objectype = Record<string, unknown>;
export type ChainInfoType = {
  name: string;
  rpcURL: string;
  chainId?: number;
  privateKey: string;
  tokenScriptHash: string;
};
