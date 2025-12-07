"use client";
import React, { useState } from "react";
import styles from "./CertificationFilter.module.css";
import { MinuswIcon, PlusIcon } from "@/components/Icons/Icons";
import { useWcCategoriesQuery } from "@/components/hooks/useWpQueries";

interface CertificationFilterProps {
  value: string;
  onChange: (value: string) => void;
}

export const CertificationFilter = ({
  value,
  onChange,
}: CertificationFilterProps) => {
  const [isExpanded, setIsExpanded] = useState(true);
  const { data: cats = [], isLoading, isError } = useWcCategoriesQuery(77);

  // Обчислюємо опції на льоту без useEffect
  // Додаємо категорії 78 та 79 в кінець списку
  const fetchedOptions = (cats || [])
    .filter((c) => c.id === 79 || c.id === 78)
    .sort((a, b) => {
      // Сортуємо: спочатку "Є сертифікат" (79), потім "Немає сертифікату" (78)
      if (a.id === 79 && b.id === 78) return -1;
      if (a.id === 78 && b.id === 79) return 1;
      return 0;
    });

  const fallbackOptions = [
    { id: 79, name: "Є сертифікат", slug: "with-cert", parent: 77 },
    { id: 78, name: "Немає сертифікату", slug: "without-cert", parent: 77 },
  ];

  const options = fetchedOptions.length > 0 ? fetchedOptions : fallbackOptions;

  const toggleSection = () => {
    setIsExpanded(!isExpanded);
  };

  return (
    <div
      className={`${styles.filterSection} ${
        !isExpanded ? styles.collapsedSection : ""
      }`}
    >
      <div className={styles.sectionTitleContainer} onClick={toggleSection}>
        <h3 className={styles.sectionTitle}>Сертифікація:</h3>
        {isExpanded ? <MinuswIcon /> : <PlusIcon />}
      </div>
      <div
        className={`${styles.sectionContent} ${
          isExpanded ? styles.expanded : styles.collapsed
        }`}
      >
        {isLoading && fetchedOptions.length === 0 && (
          <div className={styles.loading}>Завантаження…</div>
        )}
        {isError && fetchedOptions.length === 0 && (
          <div className={styles.error}>Помилка завантаження</div>
        )}
        {options.length > 0 && (
          <div className={styles.radioGroup}>
            {options.map((opt) => {
              const isSelected = value === String(opt.id);
              const inputId = `certification-${opt.id}`;
              return (
                <label
                  key={opt.id}
                  htmlFor={inputId}
                  className={`${styles.radioItem} ${
                    isSelected ? styles.selected : ""
                  }`}
                >
                  <input
                    type="checkbox"
                    id={inputId}
                    name="certification"
                    value={String(opt.id)}
                    checked={isSelected}
                    onChange={() => {
                      if (isSelected) {
                        onChange(""); // скасувати вибір
                      } else {
                        onChange(String(opt.id)); // встановити
                      }
                    }}
                    className={styles.radioInput}
                  />
                  <span className={styles.radioCircle} aria-hidden="true" />
                  <span className={styles.radioLabel}>{opt.name}</span>
                </label>
              );
            })}
          </div>
        )}
        {!isLoading && !isError && options.length === 0 && (
          <div className={styles.noOptions}>Немає доступних опцій</div>
        )}
      </div>
    </div>
  );
};
