import React from "react";
import styles from "./FilterSortPanel.module.css";
import { SortArrowIcon } from "@/components/Icons/Icons";

const FilterSortPanel: React.FC = () => {
  return (
    <div className={styles.filterSortPanel}>
      <div className={styles.filterSortBar}>
        <div className={styles.filterSection}>
          <span className={styles.label}>Фільтр</span>
        </div>
        <div className={styles.sortSection}>
          <div className={styles.sortSection}>
            <div className={styles.sortOptionWrapper}>
              <span className={styles.sortOptionLabel}>Показати по</span>
              <SortArrowIcon className={styles.sortIcon} />
            </div>
            <div className={styles.sortOptionWrapper}>
              <span className={styles.sortOptionLabel}>Сортування</span>
              <SortArrowIcon className={styles.sortIcon} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FilterSortPanel;
