"use client";
import React, { useState } from "react";
import styles from "./TrainingTypeFilter.module.css";
import { MinuswIcon, PlusIcon } from "@/components/Icons/Icons";

interface Option {
  key: string;
  label: string;
}

interface TrainingTypeFilterProps {
  value?: string[];
  onChange: (value: string[]) => void;
  options?: Option[];
}

export const TrainingTypeFilter = ({
  value = [],
  onChange,
  options = [
    { key: "cardio", label: "Кардіо" },
    { key: "dance", label: "Танцювальні" },
    { key: "mindBody", label: "Mind body" },
    { key: "strength", label: "Силові" },
  ],
}: TrainingTypeFilterProps) => {
  const handleToggle = (key: string) => {
    const next = value.includes(key)
      ? value.filter((v) => v !== key)
      : [...value, key];
    onChange(next);
  };

  const [isExpanded, setIsExpanded] = useState(true);

  return (
    <div className={styles.filterSection}>
      <button
        className={styles.sectionTitleContainer}
        onClick={() => setIsExpanded((v) => !v)}
      >
        <h3 className={styles.sectionTitle}>Тип тренування</h3>
        {isExpanded ? <MinuswIcon /> : <PlusIcon />}
      </button>

      {isExpanded && (
        <div className={styles.sectionContent}>
          <div className={styles.checkboxGroup}>
            {options.map((option) => (
              <label key={option.key} className={styles.checkboxLabel}>
                <input
                  type="checkbox"
                  checked={value.includes(option.key)}
                  onChange={() => handleToggle(option.key)}
                  className={styles.checkboxInput}
                />
                <span className={styles.checkboxText}>{option.label}</span>
              </label>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
