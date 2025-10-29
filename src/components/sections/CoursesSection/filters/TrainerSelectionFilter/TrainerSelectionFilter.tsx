"use client";
import React, { useState } from "react";
import styles from "./TrainerSelectionFilter.module.css";
import { MinuswIcon, PlusIcon } from "@/components/Icons/Icons";

interface TrainerSelectionFilterProps {
  value: string[];
  onChange: (value: string[]) => void;
  options?: string[];
}

export const CertificationFilter = ({
  value,
  onChange,
  options = [],
}: TrainerSelectionFilterProps) => {
  const cities = options;
  const [isExpanded, setIsExpanded] = useState(true);

  const toggle = (city: string) => {
    const next = value.includes(city)
      ? value.filter((c) => c !== city)
      : [...value, city];
    onChange(next);
  };

  return (
    <div className={styles.filterSection}>
      <button
        className={styles.sectionTitleContainer}
        onClick={() => setIsExpanded((v) => !v)}
      >
        <h3 className={styles.sectionTitle}>Оберіть Тренера:</h3>
        {isExpanded ? <MinuswIcon /> : <PlusIcon />}
      </button>

      {isExpanded && (
        <div className={styles.sectionContent}>
          {cities.length === 0 ? (
            <div className={styles.checkboxGroup}>
              <span className={styles.checkboxText}>Дані скоро з’являться</span>
            </div>
          ) : (
            <div className={styles.checkboxGroup}>
              {cities.map((city) => (
                <label key={city} className={styles.checkboxLabel}>
                  <input
                    type="checkbox"
                    checked={value.includes(city)}
                    onChange={() => toggle(city)}
                    className={styles.checkboxInput}
                  />
                  <span className={styles.checkboxText}>{city}</span>
                </label>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
