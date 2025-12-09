import { prisma }  from "../../prisma/prismaClient"

export const saveEventsToDB = async (events: any[]) => {
  for (const ev of events) {
    console.log("Saving event:", ev.id.txDigest);

    await (prisma as any).profileEvent.upsert({
      where: { digest: ev.id.txDigest }, // prevent duplicates
      update: {}, // do nothing if it already exists
      create: {
        digest: ev.id.txDigest,
        type: ev.type,
        sender: ev.sender,
        payload: ev.parsedJson,
        timestamp: Number(ev.timestampMs),
        // userId: optional if you can match sender to a user profile
      },
    });
  }
};
