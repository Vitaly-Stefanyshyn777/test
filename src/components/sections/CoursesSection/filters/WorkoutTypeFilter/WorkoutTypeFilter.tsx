"use client";
import React, { useState } from "react";

import styles from "./WorkoutTypeFilter.module.css";

import { MinuswIcon, PlusIcon } from "@/components/Icons/Icons";

interface WorkoutTypeFilterProps {
  value: string[];
  onChange: (value: string[]) => void;
  options?: string[];
}

export const WorkoutTypeFilter = ({
  value,
  onChange,
  options = [
    "З додатковим обладнанням",
    "З власною вагою",
    "Тренування в залі",
    "Тренування вдома",
  ],
}: WorkoutTypeFilterProps) => {
  const cities = options;
  const [isExpanded, setIsExpanded] = useState(true);
  const norm = (s: string) => s.toLowerCase().trim();
  const isSelected = (city: string) =>
    value.some((v) => norm(v) === norm(city));
  const toggle = (city: string) => {
    console.log("[WorkoutTypeFilter] 🔄 Toggle:", {
      city,
      currentValue: value,
    });
    const next = isSelected(city)
      ? value.filter((c) => norm(c) !== norm(city))
      : [...value, city];
    console.log("[WorkoutTypeFilter] ➡️ New value:", next);
    onChange(next);
  };

  // Логування для дебагу
  React.useEffect(() => {
    console.log("[WorkoutTypeFilter] 🔍 Props:", {
      value,
      options,
      cities,
      isExpanded,
    });
  }, [value, options, cities, isExpanded]);

  return (
    <div className={styles.filterSection}>
      <button
        className={styles.sectionTitleContainer}
        onClick={() => setIsExpanded((v) => !v)}
      >
        <h3 className={styles.sectionTitle}>Оберіть тип тренування:</h3>
        {isExpanded ? <MinuswIcon /> : <PlusIcon />}
      </button>

      {isExpanded && (
        <div className={styles.sectionContent}>
          <div className={styles.checkboxGroup}>
            {cities.map((city) => (
              <label key={city} className={styles.checkboxLabel}>
                <input
                  type="checkbox"
                  checked={isSelected(city)}
                  onChange={() => toggle(city)}
                  className={styles.checkboxInput}
                />
                <span className={styles.checkboxText}>{city}</span>
              </label>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
