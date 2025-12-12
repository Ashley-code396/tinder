import { BACKEND_URL } from "../constants";

export const handleSyncProfile = async (
  ownerAddress: string,
  setUserId: (id: string) => void
) => {
  console.log("[handleSyncProfile] called with ownerAddress:", ownerAddress);

  try {
    const res = await fetch(`${BACKEND_URL}/api/profile/sync-profile`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ownerAddress }),
    });

    console.log("[handleSyncProfile] HTTP status:", res.status);

    const data = await res.json();
    console.log("[handleSyncProfile] response data:", data);

    if (data.userId) {
      console.log("[handleSyncProfile] setting userId:", data.userId);
      setUserId(data.userId);
    } else {
      console.warn("[handleSyncProfile] No userId returned from backend");
    }
  } catch (err) {
    console.error("[handleSyncProfile] fetch error:", err);
  }
};
