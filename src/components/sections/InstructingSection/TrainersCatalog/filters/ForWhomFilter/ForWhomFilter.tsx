"use client";
import React, { useState, useEffect, useCallback, useMemo } from "react";
import styles from "./ForWhomFilter.module.css";
import { MinuswIcon, PlusIcon } from "@/components/Icons/Icons";
import { fetchTrainersWithLogging } from "@/lib/bfbApi";

interface ForWhomFilterProps {
  value: string;
  onChange: (value: string) => void;
}

export const ForWhomFilter = ({ value, onChange }: ForWhomFilterProps) => {
  const [isExpanded, setIsExpanded] = useState(true);
  const [loading, setLoading] = useState(false);
  const [options, setOptions] = useState<string[]>([]);

  // Статичні опції як fallback
  const fallbackOptions = useMemo(
    () => ["Універсальний", "Жінки", "Клієнти після травм", "Чоловіки"],
    []
  );

  const loadOptions = useCallback(async () => {
    try {
      setLoading(true);

      // Отримуємо тренерів без фільтрів щоб витягти унікальні опції
      const trainers = await fetchTrainersWithLogging({});

      // Витягуємо унікальні опції з тренерів
      const uniqueOptions = [
        ...new Set(
          trainers
            .map((trainer) =>
              [
                (trainer.acf as Record<string, unknown>)?.target_audience,
                (trainer.acf as Record<string, unknown>)?.for_whom,
                (trainer.acf as Record<string, unknown>)?.client_type,
              ].filter(Boolean)
            )
            .flat()
            .filter(
              (option) =>
                option && typeof option === "string" && option.trim() !== ""
            )
        ),
      ] as string[];

      if (uniqueOptions.length > 0) {
        setOptions(uniqueOptions);
      } else {
        setOptions(fallbackOptions);
      }
    } catch (error) {
      console.error("[ForWhomFilter] ❌ Помилка завантаження опцій:", error);
      setOptions(fallbackOptions);
    } finally {
      setLoading(false);
    }
  }, [fallbackOptions]);

  useEffect(() => {
    loadOptions();
  }, [loadOptions]);

  const handleOptionChange = async (selectedOption: string) => {
    onChange(selectedOption);
  };

  const toggleSection = () => {
    setIsExpanded(!isExpanded);
  };

  return (
    <div
      className={`${styles.filterSection} ${
        !isExpanded ? styles.collapsedSection : ""
      }`}
    >
      <div
        className={styles.sectionTitleContainer}
        onClick={toggleSection}
        style={{ cursor: "pointer" }}
      >
        <h3 className={styles.sectionTitle}>Для кого</h3>
        {isExpanded ? <MinuswIcon /> : <PlusIcon />}
      </div>

      <div
        className={`${styles.sectionContent} ${
          isExpanded ? styles.expanded : styles.collapsed
        }`}
      >
        {loading ? (
          <div className={styles.loadingText}>Завантаження...</div>
        ) : (
          <div className={styles.radioGroup}>
            {options.map((option) => {
              const isSelected = value === option;
              return (
                <label
                  key={option}
                  className={`${styles.radioLabel} ${
                    isSelected ? styles.selected : ""
                  }`}
                  onClick={() => {
                    // Toggle behavior: if already selected, deselect; if not selected, select
                    if (isSelected) {
                      handleOptionChange(""); // Deselect
                    } else {
                      handleOptionChange(option); // Select
                    }
                  }}
                >
                  <input
                    type="radio"
                    name="forWhom"
                    value={option}
                    checked={isSelected}
                    onChange={() => {}} // Controlled by onClick
                    className={styles.radioInput}
                  />
                  <span className={styles.radioText}>{option}</span>
                </label>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};
