"use client";

import React from "react";
import styles from "./ContactSupport.module.css";

export default function MapBlock({ onClick }: { onClick: () => void }) {
  return (
    <div className={styles.mapContainer} onClick={onClick}>
      <div className={styles.mapPlaceholder}>
        <div className={styles.mapPin}>📍</div>
        <div className={styles.mapLabels}>
          <span className={styles.mapLabel}>• Луц</span>
          <span className={styles.mapLabel}>НО</span>
        </div>
      </div>
    </div>
  );
}
