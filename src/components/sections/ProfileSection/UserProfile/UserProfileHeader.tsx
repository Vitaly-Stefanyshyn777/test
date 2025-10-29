"use client";

import React from "react";
import Image from "next/image";
import styles from "./UserProfile.module.css";

type Props = { displayName: string; email: string; avatar: string };

export default function UserProfileHeader({
  displayName,
  email,
  avatar,
}: Props) {
  return (
    <div className={styles.userProfile}>
      <div className={styles.avatarContainer}>
        <Image
          src={avatar}
          alt={`${displayName} avatar`}
          width={80}
          height={80}
          className={styles.avatar}
          style={{ objectFit: "cover" }}
        />
      </div>

      <div className={styles.userInfo}>
        <h2 className={styles.greeting}>Вітаємо, {displayName}!</h2>
        <div className={styles.emailContainer}>
          <span className={styles.email}>{email}</span>
        </div>
      </div>
    </div>
  );
}
