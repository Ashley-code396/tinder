import cron from "node-cron";
import { fetchProfileEvents } from "../services/sui/profileEventsFetcher";
import { saveEventsToDB } from "../services/db/saveEvent";
import { prisma } from "../prisma/prismaClient";



const EVENT_ID = "profileNft";

export const startProfileEventCron = async () => {
  console.log("⏳ Starting Sui Profile Event Cron Job...");

  // Load last cursor from DB
  const lastCursorRecord = await prisma.eventCursor.findUnique({
    where: { id: EVENT_ID },
  });

  let cursor = lastCursorRecord
    ? { txDigest: lastCursorRecord.txDigest, eventSeq: lastCursorRecord.eventSeq }
    : null;

  // Run every 30 seconds
  cron.schedule("*/15 * * * * *", async () => {
    try {
      console.log("🔍 Checking for new profile events...");

      const result = await fetchProfileEvents({
        cursor,
        limit: 50,
      });
      console.log("✅ Fetched profile events:", JSON.stringify(result, null, 2));

      if (result.data.length > 0) {
        console.log(`📥 Found ${result.data.length} new events`);

        await saveEventsToDB(result.data);

        // Update cursor to DB for persistence
        cursor = result.nextCursor;
        if (cursor) {
          await prisma.eventCursor.upsert({
            where: { id: EVENT_ID },
            update: { txDigest: cursor.txDigest, eventSeq: cursor.eventSeq },
            create: { id: EVENT_ID, txDigest: cursor.txDigest, eventSeq: cursor.eventSeq },
          });
        }
      } else {
        console.log("⚪ No new events");
      }
    } catch (error) {
      console.error("❌ Cron job error:", error);
    }
  });
};
