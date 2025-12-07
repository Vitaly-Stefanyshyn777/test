"use client";

import React from "react";
import styles from "./PersonalData.module.css";

import {
  NumberIcon,
  TelegramIcon,
  EmailIcon,
  InstagramIcon,
} from "@/components/Icons/Icons";

type Props = {
  phone: string;
  telegram: string;
  email: string;
  instagram: string;
  onChange: (
    field: "phone" | "telegram" | "email" | "instagram",
    value: string
  ) => void;
};

export default function ContactsSection({
  phone,
  telegram,
  email,
  instagram,
  onChange,
}: Props) {
  return (
    <div className={styles.section}>
      <h3 className={styles.sectionTitle}>Контактні дані</h3>
      <div className={styles.inputGroup}>
        <div className={styles.wrapperBlock}>
          <div className={styles.inputContainer}>
            <div className={styles.inputIconWrapper}>
              <NumberIcon className={styles.inputIcon} />
            </div>
            <input
              type="tel"
              placeholder="Ваш номер телефону"
              value={phone}
              onChange={(e) => onChange("phone", e.target.value)}
              className={styles.input}
            />
          </div>
          <div className={styles.inputContainer}>
            <div className={styles.inputIconWrapper}>
              <TelegramIcon className={styles.inputIcon} />
            </div>
            <input
              type="text"
              placeholder="Нікнейм Telegram"
              value={telegram}
              onChange={(e) => onChange("telegram", e.target.value)}
              className={styles.input}
            />
          </div>
        </div>

        <div className={styles.wrapperBlock}>
          <div className={styles.inputContainer}>
            <div className={styles.inputIconWrapper}>
              <EmailIcon className={styles.inputIcon} />
            </div>
            <input
              type="email"
              placeholder="Ваша пошта"
              value={email}
              onChange={(e) => onChange("email", e.target.value)}
              className={styles.input}
            />
          </div>
          <div className={styles.inputContainer}>
            <div className={styles.inputIconWrapper}>
              <InstagramIcon className={styles.inputIcon} />
            </div>
            <input
              type="text"
              placeholder="Нікнейм Instagram"
              value={instagram}
              onChange={(e) => onChange("instagram", e.target.value)}
              className={styles.input}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
