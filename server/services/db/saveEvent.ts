import { prisma }  from "../../prisma/prismaClient"
import { SuiEvent } from "@mysten/sui/client";

export const saveEventsToDB = async (events: SuiEvent[]) => {
  for (const ev of events) {
    console.log("Saving event:", ev.id.txDigest);

    await (prisma as any).profileEvent.upsert({
      where: { digest: ev.id.txDigest }, // prevent duplicates
      update: {}, // do nothing if it already exists
      create: {
        digest: ev.id.txDigest,
        type: ev.type,
        sender: ev.sender ?? null,
        payload: ev.parsedJson,
        timestamp: Number(ev.timestampMs),
        // userId: optional if you can match sender to a user profile
      },
    });
  }
};
