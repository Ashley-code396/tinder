import { Transaction } from "@mysten/sui/transactions";
import { TESTNET_PACKAGE_ID, REGISTRY_OBJECT_ID } from "../constants";

export interface ProfileMintParams {
  firstName: string;
  email: string;
  birthday: {
    month: number;
    day: number;
    year: number;
  };
  gender: string;
  showGender: boolean;
  interestedIn: string;
  relationshipIntent: string[];
  interests: string[];
}

export interface ProfileMintTxParams extends ProfileMintParams {
  gasBudget?: number;
}

export const buildProfileMintTx = (params: ProfileMintTxParams): Transaction => {
  const tx = new Transaction();

  tx.moveCall({
    target: `${TESTNET_PACKAGE_ID}::profileNft::mint_profile_nft`,
    arguments: [
      tx.object(REGISTRY_OBJECT_ID),
      tx.pure.string(params.firstName),
      tx.pure.string(params.email),
      tx.pure.u64(BigInt(params.birthday.month)),
      tx.pure.u64(BigInt(params.birthday.day)),
      tx.pure.u64(BigInt(params.birthday.year)),
      tx.pure.string(params.gender),
      tx.pure.bool(params.showGender),
      tx.pure.string(params.interestedIn),
      tx.pure.vector('string', params.relationshipIntent),
      tx.pure.vector('string', params.interests),
    ],
  });

  if (params.gasBudget) {
    tx.setGasBudget(params.gasBudget);
  }

  return tx;
};

export const buildCreateWhitelistEntryTx = (packageId: string, gasBudget?: number) => {
  const tx = new Transaction();

  const [cap, whitelist] = tx.moveCall({
    target: `${packageId}::seal::create_whitelist_entry`,
    arguments: []
  });

  if (gasBudget) tx.setGasBudget(gasBudget);

  return { tx, whitelistId: whitelist };
};


export const validateMintParams = (params: ProfileMintParams): boolean => {
  const currentYear = new Date().getFullYear();
  return (
    params.firstName.trim().length > 0 &&
    params.email.trim().length > 0 &&
    params.gender.length > 0 &&
    params.interestedIn.length > 0 &&
    params.birthday.month >= 1 &&
    params.birthday.month <= 12 &&
    params.birthday.day >= 1 &&
    params.birthday.day <= 31 &&
    params.birthday.year >= 1900 &&
    params.birthday.year <= currentYear
  );
};