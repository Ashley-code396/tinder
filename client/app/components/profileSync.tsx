"use client";

import { useEffect } from "react";
import { useUser } from "../context/userContext";
import { handleSyncProfile } from "../utils/handleSyncProfile";
import { useCurrentAccount } from "@mysten/dapp-kit";

const ProfileSync = () => {
  const { userId, setUserId } = useUser();
  const account = useCurrentAccount();

  useEffect(() => {
    if (!account) {
      console.log("[ProfileSync] No wallet connected yet");
      return;
    }

    console.log("[ProfileSync] useEffect run, userId:", userId, "account:", account.address);

    if (!userId) {
      handleSyncProfile(account.address, setUserId);
    }
  }, [account, userId, setUserId]);

  return null;
};

export default ProfileSync;
