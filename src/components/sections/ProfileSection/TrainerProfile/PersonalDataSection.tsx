"use client";

import React from "react";
import styles from "./TrainerProfile.module.css";
import {
  Weight2Icon,
  ExamTaskIcon,
  LocationIcon,
  WalkingIcon,
  ChevronDownIcon,
} from "@/components/Icons/Icons";
import type { TrainerProfileForm } from "./types";

type Props = {
  formData: TrainerProfileForm;
  onChange: (field: keyof TrainerProfileForm, value: string) => void;
};

const experienceOptions = ["1", "2", "3", "5"];
const boardsOptions = ["1", "2", "3", "5"];

export default function PersonalDataSection({ formData, onChange }: Props) {
  return (
    <div className={styles.section}>
      <h3 className={styles.sectionTitle}>Особисті дані</h3>

      <div className={styles.inputGroup}>
        <div className={styles.inputContainer}>
          <div className={styles.inputIconWrapper}>
            <Weight2Icon className={styles.inputIcon} />
          </div>
          <input
            type="text"
            placeholder="Посада"
            value={formData.position}
            onChange={(e) => onChange("position", e.target.value)}
            className={styles.input}
          />
        </div>

        <div className={styles.inputContainer}>
          <div className={styles.inputIconWrapper}>
            <ExamTaskIcon className={styles.inputIcon} />
          </div>
          <select
            value={formData.experience}
            onChange={(e) => onChange("experience", e.target.value)}
            className={styles.select}
          >
            <option value="">Досвід (років)</option>
            {experienceOptions.map((o) => (
              <option key={o} value={o}>
                {o === "5" ? "5+ років" : `${o} ${o === "1" ? "рік" : "роки"}`}
              </option>
            ))}
          </select>
          <div className={styles.chevronWrapper}>
            <ChevronDownIcon className={styles.chevronIconTop} />
            <ChevronDownIcon className={styles.chevronIconBottom} />
          </div>
        </div>

        <div className={styles.inputContainer}>
          <div className={styles.inputIconWrapper}>
            <LocationIcon className={styles.inputIcon} />
          </div>
          <input
            type="text"
            placeholder="Локація"
            value={formData.location}
            onChange={(e) => onChange("location", e.target.value)}
            className={styles.input}
          />
        </div>

        <div className={styles.inputContainer}>
          <div className={styles.inputIconWrapper}>
            <WalkingIcon className={styles.inputIcon} />
          </div>
          <select
            value={formData.desiredBoards}
            onChange={(e) => onChange("desiredBoards", e.target.value)}
            className={styles.select}
          >
            <option value="">Бажана кількість бордів</option>
            {boardsOptions.map((o) => (
              <option key={o} value={o}>
                {o === "5"
                  ? "5+ бордів"
                  : `${o} ${o === "1" ? "борд" : "борди"}`}
              </option>
            ))}
          </select>
          <div className={styles.chevronWrapper}>
            <ChevronDownIcon className={styles.chevronIconTop} />
            <ChevronDownIcon className={styles.chevronIconBottom} />
          </div>
        </div>
      </div>
    </div>
  );
}
