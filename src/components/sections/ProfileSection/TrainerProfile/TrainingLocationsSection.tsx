"use client";

import React from "react";
import styles from "./TrainerProfile.module.css";
import { PlusIcon } from "@/components/Icons/Icons";
import LocationCard from "./LocationCard";
import type { TrainingLocation } from "./types";
// removed unused imports

type Props = { onAddClick?: () => void; locations?: TrainingLocation[] };

export default function TrainingLocationsSection({
  onAddClick,
  locations = [],
}: Props) {
  return (
    <div className={styles.section}>
      <h3 className={styles.sectionTitle}>Місця проведення тренувань:</h3>

      <div className={styles.locationsContainer}>
        {locations.map((loc, idx) => (
          <LocationCard
            key={`${loc.title}-${idx}`}
            title={loc.title}
            phone={loc.phone}
            email={loc.email}
            schedule_five={loc.schedule_five}
            schedule_two={loc.schedule_two}
            address={loc.address}
            onEdit={() =>
              window.dispatchEvent(
                new CustomEvent("trainerLocationEdit", {
                  detail: { index: idx },
                })
              )
            }
            onDelete={() =>
              window.dispatchEvent(
                new CustomEvent("trainerLocationDelete", {
                  detail: { index: idx },
                })
              )
            }
          />
        ))}

        <div className={styles.addGymBtn}>
          <button className={styles.addGymButton} onClick={onAddClick}>
            <span className={styles.addGymIcon}>
              <PlusIcon />
            </span>
          </button>
          <span className={styles.addGymLabel}>Додати зал</span>
        </div>
      </div>
    </div>
  );
}
