import { EventId, SuiEvent, SuiEventFilter } from "@mysten/sui/client";
import { client } from "./../sui/provider";
import { packageId } from "../../config/network";

export const fetchProfileEvents = async ({
  cursor,
  limit = 50,
}: {
  cursor?: EventId | null;
  limit?: number;
}) => {

  const filter: SuiEventFilter = {
        MoveEventType: `${packageId}::profileNft::ProfileNFTMinted`,
    };
  const eventsResult = await client.queryEvents({
    query: filter,
    cursor, 
    limit,
    order: 'ascending'
  });

  return {
    data: eventsResult.data as SuiEvent[],       
    nextCursor: eventsResult.nextCursor,
    hasNextPage: eventsResult.hasNextPage,
  };
};
