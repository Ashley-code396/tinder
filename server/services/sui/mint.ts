// server/services/sui/mint.ts
import { Transaction } from "@mysten/sui/transactions";
import { TESTNET_PACKAGE_ID } from "../../../client/app/constants";
import { ProfileMintParams } from "../../../client/app/profile/types";

export const buildProfileMintTx = (params: ProfileMintParams, gasBudget = 1000000): Transaction => {
   const tx = new Transaction();

    tx.moveCall({
        target: `${TESTNET_PACKAGE_ID}::profileNft::mint_profile_nft`,
        arguments: [
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
    
    tx.setGasBudget(gasBudget);


    return tx;
};

export const buildCreateWhitelistEntryTx = (packageId: string, gasBudget = 1000000): { tx: Transaction; whitelistId: string } => {
    const tx = new Transaction();
    const [cap, whitelist] = tx.moveCall({
        target: `${packageId}::seal::create_whitelist_entry`,
        arguments: []
    });
    tx.setGasBudget(gasBudget);
    return { tx, whitelistId: (whitelist as unknown) as string };
};
