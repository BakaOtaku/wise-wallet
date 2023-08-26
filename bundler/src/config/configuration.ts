import { ChainInfoType } from './config.interface';
import { CONST } from '@cityofzion/neon-js';

export const configuration = async () => {};

/*
 * Config to create a NEO3 wallet from a private key.
 */
export const chainConfig: ChainInfoType = {
  name: 'neo2',
  chainId: CONST.MAGIC_NUMBER.TestNet,
  rpcURL: 'https://testnet2.neo.coz.io',
  privateKey: 'L2kfWPG14Mqei8FBPiZ5sZMe5XE8hdg2QejuunM5eAoZqUZ812Hf',
  tokenScriptHash: CONST.NATIVE_CONTRACT_HASH.NeoToken,
};

/**
 * Helper function to transform GAS integers into 8 decimal format.
 */
export function transformGasDecimal(num: string) {
  if (num.length <= 8) {
    return '0.' + num.padStart(8, '0');
  }
  const decimalPoint = num.length - 8;
  return (
    num.substring(0, decimalPoint) +
    '.' +
    num.substring(decimalPoint, num.length)
  );
}
