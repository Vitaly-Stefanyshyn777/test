"use client";
import React from "react";
import { useUserProfile } from "./useUserProfile";
import UserProfileHeader from "./UserProfileHeader";

interface UserProfileProps {
  name?: string;
  email?: string;
  avatar?: string;
  notificationsCount?: number;
}

const UserProfile: React.FC<UserProfileProps> = ({
  avatar = "/images/avatar1.png",
}) => {
  const { isHydrated, isReady, displayName, email } = useUserProfile();
  if (!isHydrated || !isReady) return null;
  return (
    <UserProfileHeader
      displayName={displayName}
      email={email}
      avatar={avatar}
    />
  );
};

export default UserProfile;
