import { Injectable } from '@nestjs/common';
import { CONST, rpc, u } from '@cityofzion/neon-core';
import { chainConfig } from '../config';

@Injectable()
export class GasPriceService {
  neoClient: any;
  txNetworkFee = u.BigInteger.fromNumber(0);
  networkFee = 0;

  constructor() {
    const rpcClient = new rpc.RPCClient(chainConfig.rpcURL);
    this.neoClient = rpcClient;
  }

  /**
   * Network fees pay for the processing and storage of the transaction in the
   * network. There is a cost incurred per byte of the transaction (without the
   * signatures) and also the cost of running the verification of signatures.
   */

  async getGasPrice(): Promise<number> {
    try {
      //   console.log('here');
      //   const feePerByteInvokeResponse = await this.neoClient.invokeFunction(
      //     CONST.NATIVE_CONTRACT_HASH.PolicyContract,
      //     'getFeePerByte',
      //   );
      //   console.log(CONST.NATIVE_CONTRACT_HASH.PolicyContract);
      //   console.log('here 2', feePerByteInvokeResponse);

      //   if (feePerByteInvokeResponse.state !== 'HALT') {
      //     if (this.networkFee === 0) {
      //       throw new Error('Unable to retrieve data to calculate network fee.');
      //     } else {
      //       console.log(
      //         '\u001b[31m  ✗ Unable to get information to calculate network fee.  Using user provided value.\u001b[0m',
      //       );
      //       this.txNetworkFee = u.BigInteger.fromNumber(this.networkFee);
      //     }
      //   }
      //   const feePerByte = u.BigInteger.fromNumber(
      //     feePerByteInvokeResponse.stack[0].value,
      //   );
      //   this.txNetworkFee = u.BigInteger.fromNumber(this.networkFee);
      //   // Account for witness size
      //   const transactionByteSize =
      //     this.txNetworkFee.serialize().length / 2 + 109;
      //   // Hardcoded. Running a witness is always the same cost for the basic account.
      //   const witnessProcessingFee = u.BigInteger.fromNumber(1000390);
      //   const networkFeeEstimate = feePerByte
      //     .mul(transactionByteSize)
      //     .add(witnessProcessingFee);
      //   if (
      //     this.networkFee &&
      //     this.networkFee >= Number(networkFeeEstimate.toString())
      //   ) {
      //     this.txNetworkFee = u.BigInteger.fromNumber(this.networkFee);
      //     console.log(
      //       `  i Node indicates ${networkFeeEstimate.toDecimal(
      //         8,
      //       )} networkFee but using user provided value of ${this.networkFee}`,
      //     );
      //   } else {
      //     this.txNetworkFee = networkFeeEstimate;
      //   }
      //   console.log(
      //     `\u001b[32m  ✓ Network Fee set: ${this.txNetworkFee.toDecimal(
      //       8,
      //     )} \u001b[0m`,
      //   );
      return 0;
    } catch (err) {
      console.log('err', err);
    }
    return 0;
  }
}
