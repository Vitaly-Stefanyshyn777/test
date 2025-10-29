"use client";

import React from "react";
import styles from "./PersonalData.module.css";
import { UserIcon } from "@/components/Icons/Icons";

type Props = {
  firstName: string;
  lastName: string;
  onChange: (firstName: string, lastName: string) => void;
};

export default function UsernameSection({
  firstName,
  lastName,
  onChange,
}: Props) {
  return (
    <div className={styles.section}>
      <h3 className={styles.sectionTitle}>Ім&#39;я користувача</h3>

      <div className={styles.inputGroup}>
        <div className={styles.wrapperBlock}>
          <div className={styles.inputContainer}>
            <div className={styles.inputIconWrapper}>
              <UserIcon className={styles.inputIcon} />
            </div>
            <input
              type="text"
              placeholder="Ваше ім'я та прізвище"
              value={`${firstName} ${lastName}`.trim()}
              onChange={(e) => {
                const [first = "", last = ""] = e.target.value.split(" ");
                onChange(first, last);
              }}
              className={styles.input}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
