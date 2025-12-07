export const saveEventsToDB = async (events: any[]) => {
  for (const ev of events) {
    // Save each event to your Neon/PostgreSQL DB

    // Example using Prisma or SQL
    console.log("Saving event:", ev.id.txDigest);

    // await prisma.profileEvents.create({
    //   data: {
    //     digest: ev.id.txDigest,
    //     type: ev.type,
    //     sender: ev.sender,
    //     payload: ev.parsedJson,
    //     timestamp: Number(ev.timestampMs),
    //   }
    // });
  }
};
