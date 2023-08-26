import { Injectable } from '@nestjs/common';
import { CONST, rpc, sc, wallet, tx, u } from '@cityofzion/neon-js';
import { chainConfig } from '../config';

const entryPointContract = '15c242e922f02edbbaec071a62ada259642eca17';
const limitContract = '2205277ae32b05fc41f0cf049e01bc7449908bdc';

@Injectable()
export class RelayerService {
  neoClient: any;
  wallet: any;
  txNetworkFee = u.BigInteger.fromNumber(0);
  networkFee = 0;

  constructor() {
    const rpcClient = new rpc.RPCClient(chainConfig.rpcURL);
    this.neoClient = rpcClient;

    const walletInstance = new wallet.Account(chainConfig.privateKey);
    this.wallet = walletInstance;
  }

  async relay(): Promise<number> {
    try {
      const script = sc.createScript({
        scriptHash: entryPointContract,
        operation: 'handleOps',
        args: [
          sc.ContractParam.array(
            sc.ContractParam.hash160(this.wallet.address),
            sc.ContractParam.hash160(limitContract),
            sc.ContractParam.string('request'),
            sc.ContractParam.integer(0), // nonce
            sc.ContractParam.byteArray('0x'), // initCode
            sc.ContractParam.byteArray(''), // callData
            sc.ContractParam.byteArray(''), // paymasterData
            sc.ContractParam.byteArray(''), // sginature
            sc.ContractParam.publicKey(
              '0297ddeeeba60055b5772b12d53fef80cd08406174ca88b88aa88967ad49150941',
            ), // publicKey
            sc.ContractParam.integer(1000), // gasLimit
            sc.ContractParam.boolean(false), // gasMode (sponsored)
          ),
          sc.ContractParam.hash160(this.wallet.address),
        ],
      });
      console.log(script);
      // We retrieve the current block height as we need to
      const currentHeight = await this.neoClient.getBlockCount();
      await this.checkBalance();
      const rawTx = new tx.Transaction({
        signers: [
          {
            account: this.wallet.scriptHash,
            scopes: tx.WitnessScope.CalledByEntry,
          },
        ],
        validUntilBlock: currentHeight + 1000,
        script: script,
      });

      const signedTransaction = rawTx.sign(
        this.wallet,
        CONST.MAGIC_NUMBER.TestNet,
      );
      console.log('\n\n--- Signed transaction ---');

      console.log(rawTx.toJson());
      const result = await this.neoClient.sendRawTransaction(
        u.HexString.fromHex(signedTransaction.serialize(true)),
      );

      console.log('\n\n--- Transaction hash ---');
      console.log(result);

      return result;
    } catch (error) {
      console.error(error);
    }
  }

  async checkBalance() {
    let balanceResponse;
    try {
      balanceResponse = await this.neoClient.execute(
        new rpc.Query({
          method: 'getnep17balances',
          params: [this.wallet.address],
        }),
      );
    } catch (e) {
      console.log(e);
      console.log(
        '\u001b[31m  ✗ Unable to get balances as plugin was not available. \u001b[0m',
      );
      return;
    }
    // Check for token funds
    const balances = balanceResponse.balance.filter((bal) =>
      bal.assethash.includes(CONST.NATIVE_CONTRACT_HASH.NeoToken),
    );
    console.log(balanceResponse);
    const balanceAmount =
      balances.length === 0 ? 0 : parseInt(balances[0].amount);
    if (balanceAmount < 1) {
      throw new Error(`Insufficient funds! Found ${balanceAmount}`);
    } else {
      console.log('\u001b[32m  ✓ Token funds found \u001b[0m');
    }
  }

  async getStatus(): Promise<string> {
    // Fetch the gas price and return it
    return 'OK';
  }
}
