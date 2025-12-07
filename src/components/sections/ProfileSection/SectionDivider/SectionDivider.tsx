import React from "react";
import styles from "./SectionDivider.module.css";

const SectionDivider: React.FC = () => {
  return (
    <div className={styles.divider}>
      <div className={styles.line} />
    </div>
  );
};

export default SectionDivider;

