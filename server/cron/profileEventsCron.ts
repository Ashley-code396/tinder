import cron from "node-cron";
import { fetchProfileEvents } from "../services/events/profileEvents";
import { saveEventsToDB } from "../services/db/saveEvents";

// GLOBAL cursor so cron knows where it left off
let cursor: string | null = null;

export const startProfileEventCron = () => {
  console.log("⏳ Starting Sui Profile Event Cron Job...");

  // Run every 30 seconds
  cron.schedule("*/30 * * * * *", async () => {
    try {
      console.log("🔍 Checking for new profile events...");

      const result = await fetchProfileEvents({
        cursor,
        limit: 50,
      });

      if (result.data.length > 0) {
        console.log(`📥 Found ${result.data.length} new events`);

        await saveEventsToDB(result.data);

        // Update cursor to continue from last event
        cursor = result.nextCursor;
      } else {
        console.log("⚪ No new events");
      }

    } catch (error) {
      console.error("❌ Cron job error:", error);
    }
  });
};
