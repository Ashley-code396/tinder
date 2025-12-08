import { EventId } from "@mysten/sui/dist/cjs/client";
import { client } from "./../sui/provider";
import { packageId } from "../../config/network";

export const fetchProfileEvents = async ({
  cursor,
  limit = 50,
}: {
  cursor?: EventId | null;
  limit?: number;
}) => {
  const eventsResult = await client.queryEvents({
    query: {
      MoveEventType: `${packageId}::profileNft::ProfileMinted`,
    },
    cursor, 
    limit,
    order: 'ascending'
  });

  return {
    data: eventsResult.data,       
    nextCursor: eventsResult.nextCursor,
    hasNextPage: eventsResult.hasNextPage,
  };
};
