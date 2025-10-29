"use client";
import React, { useState, useEffect, useCallback, useMemo } from "react";
import styles from "./CountryFilter.module.css";
import { MinuswIcon, PlusIcon } from "@/components/Icons/Icons";
import { fetchTrainersWithLogging } from "@/lib/bfbApi";

interface CountryFilterProps {
  value: string;
  onChange: (value: string) => void;
}

export const CountryFilter = ({ value, onChange }: CountryFilterProps) => {
  const [isExpanded, setIsExpanded] = useState(true);
  const [loading, setLoading] = useState(false);
  const [countries, setCountries] = useState<string[]>([]);

  // Статичні країни як fallback
  const fallbackCountries = useMemo(
    () => ["Україна", "Польща", "Німеччина", "Чехія", "Словаччина"],
    []
  );

  const loadCountries = useCallback(async () => {
    try {
      setLoading(true);

      // Отримуємо тренерів без фільтрів щоб витягти унікальні країни
      const trainers = await fetchTrainersWithLogging({});

      // Витягуємо унікальні країни з тренерів
      const uniqueCountries = [
        ...new Set(
          trainers
            .map((trainer) => trainer.acf?.location_country)
            .filter((country) => country && country.trim() !== "")
        ),
      ] as string[];

      if (uniqueCountries.length > 0) {
        setCountries(uniqueCountries);
      } else {
        setCountries(fallbackCountries);
      }
    } catch (error) {
      console.error("[CountryFilter] ❌ Помилка завантаження країн:", error);
      setCountries(fallbackCountries);
    } finally {
      setLoading(false);
    }
  }, [fallbackCountries]);

  useEffect(() => {
    loadCountries();
  }, [loadCountries]);

  const handleCountryChange = (selectedCountry: string) => {
    console.log(
      "[CountryFilter] 🌍 Обрано країну (локально):",
      selectedCountry
    );
    onChange(selectedCountry);
  };

  const toggleSection = () => {
    setIsExpanded(!isExpanded);
  };

  return (
    <div
      className={`${styles.filterSection} ${
        !isExpanded ? styles.collapsed : ""
      }`}
    >
      <div className={styles.sectionTitleContainer} onClick={toggleSection}>
        <h3 className={styles.sectionTitle}>Країна</h3>
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
            {countries.map((country) => {
              const isSelected = value === country;
              return (
                <label
                  key={country}
                  className={`${styles.radioLabel} ${
                    isSelected ? styles.selected : ""
                  }`}
                  onClick={() => {
                    // Toggle behavior: if already selected, deselect; if not selected, select
                    if (isSelected) {
                      handleCountryChange(""); // Deselect
                    } else {
                      handleCountryChange(country); // Select
                    }
                  }}
                >
                  <input
                    type="radio"
                    name="country"
                    value={country}
                    checked={isSelected}
                    onChange={() => {}} // Controlled by onClick
                    className={styles.radioInput}
                  />
                  <span className={styles.radioText}>{country}</span>
                </label>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};
