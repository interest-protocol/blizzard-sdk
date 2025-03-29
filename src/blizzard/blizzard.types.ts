import {
  ObjectRef,
  Transaction,
  TransactionObjectArgument,
  TransactionResult,
} from '@mysten/sui/transactions';
import { NestedResult } from '@polymedia/suitcase-core';

import type { TYPES } from './constants';

interface SharedObjectRef {
  objectId: string;
  mutable: boolean;
  initialSharedVersion: number | string;
}

export type OwnedObject = TransactionObjectArgument | string | ObjectRef;

export type SharedObject = string | SharedObjectRef;

export type U64 = string | bigint | number;

export interface GetMsUntilNextEpochArgs {
  currentEpoch: number;
  epochDurationMs: number;
  firstEpochStartTimestamp: number;
}

export interface MaybeTx {
  tx?: Transaction;
}

export interface PackageValue {
  original: string;
  latest: string;
}

export type Package = Record<
  'WWAL' | 'BLIZZARD' | 'BLIZZARD_HOOKS' | 'WAL' | 'WALRUS' | 'BLIZZARD_UTILS',
  PackageValue & Record<string, string>
>;

export type SharedObjects = Record<
  | 'WWAL_COIN_METADATA'
  | 'BLIZZARD_AV'
  | 'BLIZZARD_ACL'
  | 'WALRUS_STAKING'
  | 'BLIZZARD_ACL',
  ({ mutable }: { mutable: boolean }) => SharedObjectRef
>;

export type OwnedObjects = Record<
  | 'WWAL_UPGRADE_CAP'
  | 'WWAL_SUPER_ADMIN'
  | 'BLIZZARD_UPGRADE_CAP'
  | 'BLIZZARD_SUPER_ADMIN'
  | 'BLIZZARD_PUBLISHER'
  | 'BLIZZARD_STAKE_NFT_PUBLISHER'
  | 'BLIZZARD_STAKE_NFT_DISPLAY'
  | 'HOOKS_UPGRADE_CAP'
  | 'BLIZZARD_UTILS_UPGRADE_CAP'
  | 'BLIZZARD_ADMIN'
  | 'WWAL_ADMIN'
  | 'PWAL_SUPER_ADMIN'
  | 'BREAD_WAL_SUPER_ADMIN'
  | 'NWAL_SUPER_ADMIN',
  string
>;

export interface SignInArgs extends MaybeTx {
  admin: OwnedObject;
}

export interface SdkConstructorArgs {
  fullNodeUrl?: string;
  packages?: Package;
  sharedObjects?: SharedObjects;
  types?: typeof TYPES;
}

// === BLIZZARD LST START ===

export interface NewLSTArgs extends MaybeTx {
  treasuryCap: string | ObjectRef;
  superAdminRecipient: string;
  adminWitness: TransactionResult;
}

export interface MintArgs extends MaybeTx {
  walCoin: OwnedObject;
  nodeId: string;
  blizzardStaking: SharedObject;
}

export interface MintAfterVotesFinishedArgs extends MaybeTx {
  walCoin: OwnedObject;
  nodeId: string;
  blizzardStaking: SharedObject;
}

export interface BurnStakeNftArgs extends MaybeTx {
  nft: OwnedObject;
  blizzardStaking: SharedObject;
}

export interface BurnLstArgs extends MaybeTx {
  lstCoin: OwnedObject;
  withdrawIXs: NestedResult;
  blizzardStaking: SharedObject;
}

export interface AddNodeArgs extends MaybeTx {
  nodeId: string;
  blizzardStaking: SharedObject;
  adminWitness: TransactionResult;
}

export interface RemoveNodeArgs extends MaybeTx {
  nodeId: string;
  blizzardStaking: SharedObject;
  adminWitness: TransactionResult;
}

export interface KeepStakeNftArgs extends MaybeTx {
  nft: TransactionResult;
}

export interface SyncExchangeRateArgs extends MaybeTx {
  blizzardStaking: SharedObject;
}

export interface LastEpochAprArgs {
  nodeId: string;
}

export interface FcfsArgs extends MaybeTx {
  blizzardStaking: SharedObject;
  value: U64;
}

export interface VectorTransferStakedWalArgs extends MaybeTx {
  vector: NestedResult;
  to: string;
}

export interface ToWalAtEpochArgs {
  blizzardStaking: SharedObject;
  epoch: number;
  value: U64;
}

export interface ToLstAtEpochArgs {
  blizzardStaking: SharedObject;
  epoch: number;
  value: U64;
}

export interface ViewFcfsArgs {
  value: U64;
  blizzardStaking: SharedObject;
}

// === BLIZZARD LST END ===

// === ACL Types Start ===

export type BlizzardAclArgs = (SdkConstructorArgs | null | undefined) & {
  acl: SharedObject;
};

export interface NewAdminArgs extends MaybeTx {
  superAdmin: OwnedObject;
  lstType?: string;
}

export interface NewAdminAndTransferArgs extends MaybeTx {
  superAdmin: OwnedObject;
  recipient: string;
  lstType?: string;
}

export interface RevokeAdminArgs extends MaybeTx {
  superAdmin: OwnedObject;
  admin: string;
  lstType?: string;
}

export interface SignInArgs extends MaybeTx {
  admin: OwnedObject;
  lstType?: string;
}

export interface DestroyAdminArgs extends MaybeTx {
  admin: OwnedObject;
  lstType?: string;
}

export interface DestroySuperAdminArgs extends MaybeTx {
  superAdmin: OwnedObject;
  lstType?: string;
}

export interface StartSuperAdminTransferArgs extends MaybeTx {
  superAdmin: OwnedObject;
  recipient: string;
  lstType?: string;
}

export interface FinishSuperAdminTransferArgs extends MaybeTx {
  superAdmin: OwnedObject;
  lstType?: string;
}

export interface IsAdminArgs {
  admin: string;
  lstType?: string;
}

// === ACL Types End ===

// === Update Metadata ===

export interface UpdateMetadataArgs extends MaybeTx {
  value: string;
  adminWitness: TransactionResult;
  blizzardStaking: SharedObject;
}
