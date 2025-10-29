"use client";
import React, { useState, useEffect, useCallback, useMemo } from "react";
import styles from "./TrainingDirectionFilter.module.css";
import { MinuswIcon, PlusIcon } from "@/components/Icons/Icons";
import { fetchTrainersWithLogging } from "@/lib/bfbApi";

interface TrainingDirectionFilterProps {
  value: string;
  onChange: (value: string) => void;
}

export const TrainingDirectionFilter = ({
  value,
  onChange,
}: TrainingDirectionFilterProps) => {
  const [isExpanded, setIsExpanded] = useState(true);
  const [loading, setLoading] = useState(false);
  const [directions, setDirections] = useState<string[]>([]);

  // Статичні напрямки як fallback
  const fallbackDirections = useMemo(
    () => [
      "Зниження напруги",
      "Реабілітаційний підхід",
      "Розвиток координації",
    ],
    []
  );

  const loadDirections = useCallback(async () => {
    try {
      console.log("[TrainingDirectionFilter] 🚀 Завантажую напрямки з API...");
      setLoading(true);

      // Отримуємо тренерів без фільтрів щоб витягти унікальні напрямки
      const trainers = await fetchTrainersWithLogging({});

      // Витягуємо унікальні напрямки з тренерів (може бути в різних полях)
      const uniqueDirections = [
        ...new Set(
          trainers
            .map((trainer) =>
              [
                (trainer.acf as Record<string, unknown>)?.training_direction,
                (trainer.acf as Record<string, unknown>)?.specialization,
                (trainer.acf as Record<string, unknown>)?.focus_area,
              ].filter(Boolean)
            )
            .flat()
            .filter(
              (direction) =>
                direction &&
                typeof direction === "string" &&
                direction.trim() !== ""
            )
        ),
      ] as string[];

      if (uniqueDirections.length > 0) {
        setDirections(uniqueDirections);
      } else {
        setDirections(fallbackDirections);
      }
    } catch (error) {
      console.error(
        "[TrainingDirectionFilter] ❌ Помилка завантаження напрямків:",
        error
      );
      setDirections(fallbackDirections);
    } finally {
      setLoading(false);
    }
  }, [fallbackDirections]);

  useEffect(() => {
    loadDirections();
  }, [loadDirections]);

  const handleDirectionChange = async (selectedDirection: string) => {
    console.log(
      "[TrainingDirectionFilter] 🎯 Обрано напрямок:",
      selectedDirection
    );
    onChange(selectedDirection);
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
        <h3 className={styles.sectionTitle}>Напрям тренувань</h3>
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
            {directions.map((direction) => {
              const isSelected = value === direction;
              return (
                <label
                  key={direction}
                  className={`${styles.radioLabel} ${
                    isSelected ? styles.selected : ""
                  }`}
                  onClick={() => {
                    // Toggle behavior: if already selected, deselect; if not selected, select
                    if (isSelected) {
                      handleDirectionChange(""); // Deselect
                    } else {
                      handleDirectionChange(direction); // Select
                    }
                  }}
                >
                  <input
                    type="radio"
                    name="trainingDirection"
                    value={direction}
                    checked={isSelected}
                    onChange={() => {}} // Controlled by onClick
                    className={styles.radioInput}
                  />
                  <span className={styles.radioText}>{direction}</span>
                </label>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};
