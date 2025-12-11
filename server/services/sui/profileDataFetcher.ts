import { prisma } from "../../prisma/prismaClient";
import { client } from "../sui/provider"

import { SuiObjectResponse } from "@mysten/sui/dist/cjs/client";

type ProfileMintPayload = {
    creator: string;
    first_name: string;
    profile_nft_id: string;
};

export const getProfileObjectIdsFromEvents = async (): Promise<string[]> => {
    const events = await prisma.profileEvent.findMany({
        where: { type: { contains: "ProfileNFTMinted" } },
    });

    return events
        .map(ev => {
            const payload = ev.payload as ProfileMintPayload;
            return payload?.profile_nft_id;
        })
        .filter(Boolean);
};


export const fetchProfileData = async (objectId: string) => {
    try {
        const profileObject = await client.getObject({
            id: objectId,
            options: {
                showContent: true,       // includes the object's fields (needed for your DB)
                showType: true,          // includes the Move type of the object
                showOwner: true,         // includes the owner address
                showPreviousTransaction: true, // optional: includes the tx digest that created/updated object
                showDisplay: true,       // optional: human-readable metadata, if any
            },
        });
        return profileObject;
    } catch (error) {
        console.error(`Failed to fetch profile for objectId ${objectId}:`, error);
        return null;
    }
};


export const fetchAllProfilesFromEvents = async () => {
    const objectIds = await getProfileObjectIdsFromEvents();

    if (objectIds.length === 0) {
        console.log("No new profile NFT object IDs found.");
        return [];
    }

    console.log(`Fetching data for ${objectIds.length} profiles...`);

    // Fetch all profiles in parallel
    const profiles = await Promise.all(
        objectIds.map(id => fetchProfileData(id))
    );

    // Filter out any null results
    const validProfiles = profiles.filter(p => p !== null);

    console.log(`Successfully fetched ${validProfiles.length} profiles.`);

    return validProfiles;
};
