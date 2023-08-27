import { Injectable } from '@nestjs/common';
import { experimental, sc, tx, CONST, wallet } from '@cityofzion/neon-js';
import { chainConfig } from '../config';
import { SmartContract } from '@cityofzion/neon-js/lib/experimental';

const entryPointAddr = '47e8ed3c15c53cc44965822bc1f46fe332cce4fe';
const config = {
  rpcAddress: 'https://testnet2.neo.coz.io',
  account: new wallet.Account(chainConfig.privateKey),
  networkMagic: CONST.MAGIC_NUMBER.TestNet,
};

@Injectable()
export class RelayerService {
  entryPoint: SmartContract;
  wallet: any;

  constructor() {
    const entryPoint = new experimental.SmartContract(
      entryPointAddr as any,
      config,
    );
    this.entryPoint = entryPoint;

    const walletInstance = new wallet.Account(chainConfig.privateKey);
    this.wallet = walletInstance;
  }

  async relay(signature: string): Promise<{
    txid: string;
  }> {
    try {
      console.log('Relaying transaction...', signature);
      const signers = [
        new tx.Signer({
          account: config.account.scriptHash,
          scopes: tx.WitnessScope.CalledByEntry,
        }),
      ];
      const neworacleAddr = 'c1913f86e176fb82ac1b9efb745a945b3a1e5b90';
      const swapAddr = '01464f6394107d76978d7614b9a7a01d0cc71e34';
      const txHash = await this.entryPoint.invoke(
        'innerHandleOp',
        [
          sc.ContractParam.array(
            sc.ContractParam.hash160(this.wallet.scriptHash),
            sc.ContractParam.hash160(neworacleAddr),
            sc.ContractParam.string('requestencodedirect'),
            sc.ContractParam.integer(0),
            sc.ContractParam.byteArray(''),
            sc.ContractParam.string(
              'https://www.pricemap.amanraj.dev/api/price/some',
            ),
            sc.ContractParam.string('$.price'),
            sc.ContractParam.array(
              sc.ContractParam.hash160(CONST.NATIVE_CONTRACT_HASH.NeoToken),
              sc.ContractParam.hash160(CONST.NATIVE_CONTRACT_HASH.GasToken),
              sc.ContractParam.integer(10),
              sc.ContractParam.hash160(this.wallet.scriptHash),
              sc.ContractParam.hash160(swapAddr),
              sc.ContractParam.integer(100),
              sc.ContractParam.integer(100),
            ),
            sc.ContractParam.byteArray(''),
            sc.ContractParam.hash256(signature.substring(0, 64)),
            sc.ContractParam.publicKey(
              '02028a99826edc0c97d18e22b6932373d908d323aa7f92656a77ec26e8861699ef',
            ),
            sc.ContractParam.integer(0),
            sc.ContractParam.boolean(true),
          ),
        ],
        signers,
      );
      console.log('\n\n--- Transaction hash ---');
      console.log(txHash);

      return {
        txid: txHash,
      };
    } catch (error) {
      console.error(error);
    }
  }

  async getStatus(): Promise<string> {
    // Fetch the gas price and return it
    return 'OK';
  }
}
