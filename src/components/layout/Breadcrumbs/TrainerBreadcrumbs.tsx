"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import styles from "./Breadcrumbs.module.css";

interface TrainerBreadcrumbsProps {
  trainerName?: string;
}

const TrainerBreadcrumbs: React.FC<TrainerBreadcrumbsProps> = ({
  trainerName,
}) => {
  const pathname = usePathname();

  const isTrainerPage =
    pathname.includes("/trainers/") && pathname.split("/").length > 2;

  if (!isTrainerPage) {
    return null;
  }

  return (
    <nav className={styles.breadcrumbs} aria-label="Хлібні крихти">
      <div className={styles.breadcrumbsContainer}>
        <ol className={styles.breadcrumbList}>
          <li className={styles.breadcrumbItem}>
            <Link href="/" className={styles.breadcrumbLink}>
              Головна
            </Link>
            <span className={styles.separator}>•</span>
          </li>
          <li className={styles.breadcrumbItem}>
            <Link href="/trainers" className={styles.breadcrumbLink}>
              Знайди тренера
            </Link>
            <span className={styles.separator}>•</span>
          </li>
          <li className={styles.breadcrumbItem}>
            <span className={`${styles.breadcrumbText} ${styles.active}`}>
              {trainerName || "Профіль тренера"}
            </span>
          </li>
        </ol>
      </div>
    </nav>
  );
};

export default TrainerBreadcrumbs;
