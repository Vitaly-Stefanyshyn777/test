"use client";

import React from "react";
import styles from "./TrainerProfile.module.css";
import ExperienceForm from "./ExperienceForm";

export default function WorkExperienceSection() {
  return (
    <div className={styles.section}>
      <h3 className={styles.sectionTitle}>Досвід роботи</h3>

      <div className={styles.workExperienceForm}>
        <ExperienceForm />
        <div className={styles.textareaContainer}>
          <textarea
            placeholder="Опис"
            className={styles.textareaLower}
            rows={4}
          />
        </div>
      </div>
    </div>
  );
}
