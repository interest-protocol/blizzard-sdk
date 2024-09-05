import { bcs } from '@mysten/sui/bcs';
import { getFullnodeUrl, SuiClient } from '@mysten/sui/client';
import { Transaction, TransactionArgument } from '@mysten/sui/transactions';
import {
  isValidSuiAddress,
  isValidSuiObjectId,
  SUI_CLOCK_OBJECT_ID,
} from '@mysten/sui/utils';
import { devInspectAndGetResults } from '@polymedia/suitcase-core';
import invariant from 'tiny-invariant';

import { PACKAGES, SHARED_OBJECTS } from './constants';
import {
  DCA,
  DCAConstructorArgs,
  DestroyArgs,
  IsActiveArgs,
  Network,
  NewArgs,
  StopArgs,
  SwapWhitelistEndArgs,
  SwapWhitelistStartArgs,
} from './dca.types';
import { parseDCAObject } from './utils';
export class DcaSDK {
  #client: SuiClient;
  #packages: (typeof PACKAGES)[Network];
  #sharedObjects: (typeof SHARED_OBJECTS)[Network];

  MAX_U64 = 18446744073709551615n;
  defaultFee = 500000n;

  constructor(args: DCAConstructorArgs | undefined | null = null) {
    const defaultData = {
      network: 'testnet',
      fullNodeUrl: getFullnodeUrl('testnet'),
      packages: PACKAGES['testnet'],
      sharedObjects: SHARED_OBJECTS['testnet'],
    };

    const data = args ? args : defaultData;

    this.#client = new SuiClient({
      url: data.fullNodeUrl || defaultData.fullNodeUrl,
    });
    this.#packages = data.packages || defaultData.packages;
    this.#sharedObjects = data.sharedObjects || defaultData.sharedObjects;
  }

  async get(objectId: string): Promise<DCA> {
    invariant(isValidSuiObjectId(objectId), 'Invalid DCA id');

    const obj = await this.#client.getObject({
      id: objectId,
      options: { showContent: true, showType: true },
    });

    console.log(obj);

    return parseDCAObject(obj);
  }

  newAndShare({
    tx = new Transaction(),
    coinInType,
    coinOutType,
    witnessType,
    coinIn,
    timeScale,
    every,
    numberOfOrders,
    max = this.MAX_U64,
    min = 0n,
    fee,
    delegatee,
  }: NewArgs): Transaction {
    invariant(isValidSuiAddress(delegatee), 'Invalid delegatee address');
    invariant(numberOfOrders > 0, 'Number of orders must be greater than 0');

    const dca = tx.moveCall({
      target: `${this.#packages.DCA}::dca::new`,
      typeArguments: [coinInType, coinOutType, witnessType],
      arguments: [
        tx.object(this.#sharedObjects.SETTINGS),
        tx.object(this.#sharedObjects.TRADE_POLICY),
        tx.object(SUI_CLOCK_OBJECT_ID),
        tx.object(coinIn),
        tx.pure.u64(every),
        tx.pure.u64(numberOfOrders),
        tx.pure.u8(timeScale),
        tx.pure.u64(min),
        tx.pure.u64(max),
        tx.pure.u64(fee ? BigInt(fee * 1e7) : this.defaultFee),
        tx.pure.address(delegatee),
      ],
    });

    tx.moveCall({
      target: `${this.#packages.DCA}::dca::share`,
      typeArguments: [coinInType, coinOutType],
      arguments: [tx.object(dca)],
    });

    return tx;
  }

  async isActive({
    dca,
    coinInType,
    coinOutType,
  }: IsActiveArgs): Promise<boolean> {
    invariant(isValidSuiObjectId(dca), 'Invalid DCA id');

    const tx = new Transaction();

    tx.moveCall({
      target: `${this.#packages.DCA}::dca::active`,
      typeArguments: [coinInType, coinOutType],
      arguments: [tx.object(dca)],
    });

    const result = await devInspectAndGetResults(
      this.#client as any,
      tx as any
    );

    const values = result[result.length - 1].returnValues;

    invariant(values && values.length, 'Failed to get values');

    return values.map((elem) => {
      const [x] = elem;
      return bcs.Bool.parse(new Uint8Array(x));
    })[0];
  }

  stop({ dca, coinInType, coinOutType }: StopArgs): Transaction {
    invariant(isValidSuiObjectId(dca), 'Invalid DCA id');

    const tx = new Transaction();

    tx.moveCall({
      target: `${this.#packages.DCA}::dca::stop`,
      typeArguments: [coinInType, coinOutType],
      arguments: [tx.object(dca)],
    });

    return tx;
  }

  destroy({ dca, coinInType, coinOutType }: DestroyArgs): Transaction {
    invariant(isValidSuiObjectId(dca), 'Invalid DCA id');

    const tx = new Transaction();

    tx.moveCall({
      target: `${this.#packages.DCA}::dca::destroy`,
      typeArguments: [coinInType, coinOutType],
      arguments: [tx.object(dca)],
    });

    return tx;
  }

  stopAndDestroy({ dca, coinInType, coinOutType }: DestroyArgs): Transaction {
    invariant(isValidSuiObjectId(dca), 'Invalid DCA id');

    const tx = new Transaction();

    tx.moveCall({
      target: `${this.#packages.DCA}::dca::stop`,
      typeArguments: [coinInType, coinOutType],
      arguments: [tx.object(dca)],
    });

    tx.moveCall({
      target: `${this.#packages.DCA}::dca::destroy`,
      typeArguments: [coinInType, coinOutType],
      arguments: [tx.object(dca)],
    });

    return tx;
  }

  swapWhitelistStart({
    dca,
    coinInType,
    coinOutType,
    tx = new Transaction(),
  }: SwapWhitelistStartArgs) {
    invariant(isValidSuiObjectId(dca), 'Invalid DCA id');

    const [request, coinIn] = tx.moveCall({
      target: `${this.#packages.DCA}::dca::request`,
      typeArguments: [coinInType, coinOutType],
      arguments: [tx.object(dca)],
    });

    return {
      coinIn,
      request,
      tx,
    };
  }

  swapWhitelistEnd({
    dca,
    coinInType,
    coinOutType,
    tx = new Transaction(),
    request,
    coinOut,
  }: SwapWhitelistEndArgs) {
    invariant(isValidSuiObjectId(dca), 'Invalid DCA id');

    tx.moveCall({
      target: `${this.#packages.ADAPTERS}::whitelist_adapter::swap`,
      typeArguments: [coinOutType],
      arguments: [
        tx.object(this.#sharedObjects.WHITELIST),
        request as TransactionArgument,
        coinOut,
      ],
    });

    tx.moveCall({
      target: `${this.#packages.DCA}::dca::confirm`,
      typeArguments: [coinInType, coinOutType],
      arguments: [
        tx.object(dca),
        tx.object(SUI_CLOCK_OBJECT_ID),
        request as TransactionArgument,
      ],
    });

    return tx;
  }
}
