import React from "react";
import styles from "./ButtonFilter.module.css";

interface FilterActionsProps {
  onApply: () => void;
  onReset: () => void;
  loading?: boolean;
}

export const ButtonFilter = ({
  onApply,
  onReset,
  loading = false,
}: FilterActionsProps) => {
  return (
    <div className={styles.filterActions}>
      <button className={styles.applyBtn} onClick={onApply} disabled={loading}>
        {loading ? "Завантаження..." : "Застосувати фільтри"}
      </button>
      <button className={styles.resetBtn} onClick={onReset} disabled={loading}>
        Скинути всі налаштування
      </button>
    </div>
  );
};

export default ButtonFilter;
