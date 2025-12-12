import { BACKEND_URL } from "../constants";

export const handleSyncProfile = async (
  ownerAddress: string,
  setUserId: (id: string) => void
) => {
  const res = await fetch(`${BACKEND_URL}/api/profile/sync-profile`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ ownerAddress }),
  });

  const data = await res.json();
  if (data.userId) setUserId(data.userId);
};
