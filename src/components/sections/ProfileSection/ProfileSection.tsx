"use client";
import React from "react";
import styles from "./ProfileSection.module.css";
import UserProfile from "./UserProfile/UserProfile";
import NavigationMenu from "./NavigationMenu/NavigationMenu";
import VideoInstruction from "./VideoInstruction/VideoInstruction";
import CommunityChats from "./CommunityChats/CommunityChats";
import PurchasedCourses from "./PurchasedCourses/PurchasedCourses";
import ContactSupport from "./ContactSupport/ContactSupport";
import SectionDivider from "./SectionDivider/SectionDivider";

interface ProfileSectionProps {
  children?: React.ReactNode;
}

const ProfileSection: React.FC<ProfileSectionProps> = ({ children }) => {
  return (
    <div className={styles.portfolioSection}>
      <div className={styles.container}>
        <div className={styles.sidebar}>
          <UserProfile />
          <NavigationMenu />
        </div>

        <div className={styles.mainContent}>
          {children || (
            <>
              <VideoInstruction />
              <SectionDivider />
              <CommunityChats />
              <SectionDivider />
              <PurchasedCourses />
              <SectionDivider />
              <ContactSupport />
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProfileSection;
