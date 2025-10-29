"use client";
import React, { useState } from "react";
import styles from "./TrainingProgramsFilter.module.css";
import { MinuswIcon, PlusIcon } from "@/components/Icons/Icons";

interface TrainingProgramsFilterProps {
  value: string[];
  onChange: (value: string[]) => void;
  options?: string[];
}

const TrainingProgramsFilter: React.FC<TrainingProgramsFilterProps> = ({
  value,
  onChange,
  options = [
    "Kids classes",
    "BFB для вагітних",
    "Базовий рівень інструктора групових програм",
    "Воркшопи з інвентарем",
  ],
}) => {
  const [isExpanded, setIsExpanded] = useState(true);

  const toggle = (opt: string) => {
    const next = value.includes(opt)
      ? value.filter((v) => v !== opt)
      : [...value, opt];
    onChange(next);
  };

  return (
    <div className={styles.filterSection}>
      <button
        className={styles.sectionTitleContainer}
        onClick={() => setIsExpanded((v) => !v)}
      >
        <h3 className={styles.sectionTitle}>Прокачай свої тренування:</h3>
        <span className={styles.icon} aria-hidden>
          {isExpanded ? <MinuswIcon /> : <PlusIcon />}
        </span>
      </button>
      {isExpanded && (
        <div className={styles.checkboxGroup}>
          {options.map((opt) => (
            <label key={opt} className={styles.checkboxLabel}>
              <input
                type="checkbox"
                checked={value.includes(opt)}
                onChange={() => toggle(opt)}
                className={styles.checkboxInput}
              />
              <span className={styles.checkboxText}>{opt}</span>
            </label>
          ))}
        </div>
      )}
    </div>
  );
};

export default TrainingProgramsFilter;
