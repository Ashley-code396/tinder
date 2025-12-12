"use client";

import { useEffect } from "react";
import { useUser } from "../context/userContext";
import { handleSyncProfile } from "../utils/handleSyncProfile";

interface ProfileSyncProps {
  ownerAddress: string;
}

const ProfileSync = ({ ownerAddress }: ProfileSyncProps) => {
  const { userId, setUserId } = useUser();

  useEffect(() => {
    if (!userId) handleSyncProfile(ownerAddress, setUserId);
  }, [ownerAddress, userId, setUserId]);

  return null; // does not render anything
};

export default ProfileSync;
