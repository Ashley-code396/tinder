import cron from "node-cron";
import { fetchProfileEvents } from "../services/sui/profileEventsFetcher";
import { saveEventsToDB } from "../services/db/saveEvent";
import { prisma } from "../prisma/prismaClient";
import { fetchAllProfilesFromEvents } from "../services/sui/profileDataFetcher";
import { saveProfilesToDB } from "../services/db/saveProfile";

const EVENT_ID = "profileNft";

export const startProfileEventCron = async () => {
  console.log("Starting Sui Profile Event Cron Job...");

  // Load last cursor from DB
  const lastCursorRecord = await prisma.eventCursor.findUnique({
    where: { id: EVENT_ID },
  });

  let cursor = lastCursorRecord
    ? { txDigest: lastCursorRecord.txDigest, eventSeq: lastCursorRecord.eventSeq }
    : null;

  // Run every 15 seconds
  cron.schedule("*/15 * * * * *", async () => {
    try {
      console.log("Checking for new profile events...");

      const result = await fetchProfileEvents({
        cursor,
        limit: 50,
      });

      if (result.data.length > 0) {
        console.log(`Found ${result.data.length} new events`);

        // Save events
        await saveEventsToDB(result.data);

        // Update cursor
        cursor = result.nextCursor;
        if (cursor) {
          await prisma.eventCursor.upsert({
            where: { id: EVENT_ID },
            update: { txDigest: cursor.txDigest, eventSeq: cursor.eventSeq },
            create: { id: EVENT_ID, txDigest: cursor.txDigest, eventSeq: cursor.eventSeq },
          });
        }

        //Call profile fetching after events are strored
        console.log("Fetching profiles based on newly saved events...");
        const profiles = await fetchAllProfilesFromEvents();

        console.log("Fetched profiles:", profiles.length);

        // Save profiles to DB
        await saveProfilesToDB(profiles);
        console.log(
          "Profiles fetched from on-chain:",
          JSON.stringify(
            profiles,
            (key, value) => (typeof value === "bigint" ? value.toString() : value),
            2
          )
        );


        console.log("Profiles saved to DB:", profiles.length);

      } else {
        console.log("No new events");
      }

    } catch (error) {
      console.error("Cron job error:", error);
    }
  });
};
