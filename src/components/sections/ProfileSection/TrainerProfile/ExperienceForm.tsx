"use client";

import React, { useState } from "react";
import { Check4Icon } from "@/components/Icons/Icons";
import styles from "./TrainerProfile.module.css";

export default function ExperienceForm() {
  const [startMonth, setStartMonth] = useState("");
  const [startYear, setStartYear] = useState("");
  const [endMonth, setEndMonth] = useState("");
  const [endYear, setEndYear] = useState("");

  const [isStartMonthOpen, setIsStartMonthOpen] = useState(false);
  const [isStartYearOpen, setIsStartYearOpen] = useState(false);
  const [isEndMonthOpen, setIsEndMonthOpen] = useState(false);
  const [isEndYearOpen, setIsEndYearOpen] = useState(false);

  const closeOthers = (except: string) => {
    if (except !== "startMonth") setIsStartMonthOpen(false);
    if (except !== "startYear") setIsStartYearOpen(false);
    if (except !== "endMonth") setIsEndMonthOpen(false);
    if (except !== "endYear") setIsEndYearOpen(false);
  };

  const months = [
    { value: "01", label: "Січень" },
    { value: "02", label: "Лютий" },
    { value: "03", label: "Березень" },
    { value: "04", label: "Квітень" },
    { value: "05", label: "Травень" },
    { value: "06", label: "Червень" },
    { value: "07", label: "Липень" },
    { value: "08", label: "Серпень" },
    { value: "09", label: "Вересень" },
    { value: "10", label: "Жовтень" },
    { value: "11", label: "Листопад" },
    { value: "12", label: "Грудень" },
  ];

  const years = Array.from({ length: 30 }).map((_, idx) => {
    const y = 2024 - idx;
    return { value: String(y), label: String(y) };
  });

  return (
    <div className={styles.dateRow}>
      <div className={styles.dateGroup}>
        <label className={styles.dateLabel}>Назва залу</label>
        <input type="text" placeholder="Назва залу" className={styles.input} />
      </div>
      <div className={styles.dateGroup}>
        <label className={styles.dateLabel}>Дата початку</label>
        <div className={styles.dateInputs}>
          <div className={styles.dateSelectContainer}>
            <div
              className={styles.inputWithIcons}
              onClick={() => {
                closeOthers("startMonth");
                setIsStartMonthOpen(!isStartMonthOpen);
              }}
            >
              <span className={styles.inputText}>
                {startMonth
                  ? months.find((m) => m.value === startMonth)?.label
                  : "Місяць"}
              </span>
              <span
                className={`${styles.iconRight} ${
                  isStartMonthOpen ? styles.rotated : ""
                }`}
              >
                <Check4Icon />
              </span>
            </div>
            {isStartMonthOpen && (
              <div
                className={`${styles.dropdownList} ${
                  months.length > 3 ? styles.scrollable : ""
                }`}
              >
                {months.map((m) => (
                  <div
                    key={m.value}
                    className={styles.dropdownItem}
                    onClick={() => {
                      setStartMonth(m.value);
                      setIsStartMonthOpen(false);
                    }}
                  >
                    <span className={styles.dropdownText}>{m.label}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
          <div className={styles.dateSelectContainer}>
            <div
              className={styles.inputWithIcons}
              onClick={() => {
                closeOthers("startYear");
                setIsStartYearOpen(!isStartYearOpen);
              }}
            >
              <span className={styles.inputText}>{startYear || "Рік"}</span>
              <span
                className={`${styles.iconRight} ${
                  isStartYearOpen ? styles.rotated : ""
                }`}
              >
                <Check4Icon />
              </span>
            </div>
            {isStartYearOpen && (
              <div
                className={`${styles.dropdownList} ${
                  years.length > 3 ? styles.scrollable : ""
                }`}
              >
                {years.map((y) => (
                  <div
                    key={y.value}
                    className={styles.dropdownItem}
                    onClick={() => {
                      setStartYear(y.value);
                      setIsStartYearOpen(false);
                    }}
                  >
                    <span className={styles.dropdownText}>{y.label}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      <div className={styles.dateGroup}>
        <label className={styles.dateLabel}>Дата завершення</label>
        <div className={styles.dateInputs}>
          <div className={styles.dateSelectContainer}>
            <div
              className={styles.inputWithIcons}
              onClick={() => {
                closeOthers("endMonth");
                setIsEndMonthOpen(!isEndMonthOpen);
              }}
            >
              <span className={styles.inputText}>
                {endMonth
                  ? months.find((m) => m.value === endMonth)?.label
                  : "Місяць"}
              </span>
              <span
                className={`${styles.iconRight} ${
                  isEndMonthOpen ? styles.rotated : ""
                }`}
              >
                <Check4Icon />
              </span>
            </div>
            {isEndMonthOpen && (
              <div
                className={`${styles.dropdownList} ${
                  months.length > 3 ? styles.scrollable : ""
                }`}
              >
                {months.map((m) => (
                  <div
                    key={m.value}
                    className={styles.dropdownItem}
                    onClick={() => {
                      setEndMonth(m.value);
                      setIsEndMonthOpen(false);
                    }}
                  >
                    <span className={styles.dropdownText}>{m.label}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
          <div className={styles.dateSelectContainer}>
            <div
              className={styles.inputWithIcons}
              onClick={() => {
                closeOthers("endYear");
                setIsEndYearOpen(!isEndYearOpen);
              }}
            >
              <span className={styles.inputText}>{endYear || "Рік"}</span>
              <span
                className={`${styles.iconRight} ${
                  isEndYearOpen ? styles.rotated : ""
                }`}
              >
                <Check4Icon />
              </span>
            </div>
            {isEndYearOpen && (
              <div
                className={`${styles.dropdownList} ${
                  years.length > 3 ? styles.scrollable : ""
                }`}
              >
                {years.map((y) => (
                  <div
                    key={y.value}
                    className={styles.dropdownItem}
                    onClick={() => {
                      setEndYear(y.value);
                      setIsEndYearOpen(false);
                    }}
                  >
                    <span className={styles.dropdownText}>{y.label}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
