"use client";
import React, { useState } from "react";
import styles from "./TrainersCatalog.module.css";
import TrainersHeroSection from "../TrainersHeroSection/TrainersHeroSection";
import TrainersFilter from "../TrainersFilter/TrainersFilter";
import { useTrainers } from "@/components/hooks/useTrainers";
import FilterSortPanel from "@/components/ui/FilterSortPanel/FilterSortPanel";
import TrainersCatalogContainer from "../TrainersCatalogContainer/TrainersCatalogContainer";
import { useCoachesQuery } from "@/components/hooks/useCoachesQuery";

const TrainersCatalog = () => {
  const { filters, updateFilters, resetFilters } = useTrainers();
  const { data: coaches = [], isLoading, isError } = useCoachesQuery();

  const trainers = coaches.map((c) => ({ location: c.location }));
  const searchTerm = "";

  // Динамічно оновлюваний список тренерів після застосування фільтрів
  // undefined означає, що фільтри ще не застосовувались і слід показувати дефолтний список
  const [filteredTrainers, setFilteredTrainers] = useState<
    unknown[] | undefined
  >(undefined);

  return (
    <div className={styles.trainersCatalog}>
      <TrainersHeroSection />

      <div className={styles.catalogContentBlock}>
        <FilterSortPanel />
        <div className={styles.catalogContent}>
          <TrainersFilter
            filters={filters}
            onFiltersChange={(newFilters) => updateFilters(newFilters)}
            onReset={resetFilters}
            onTrainersChange={(items) =>
              setFilteredTrainers(items as unknown[])
            }
            trainers={trainers}
            searchTerm={searchTerm}
          />
          <TrainersCatalogContainer
            block={{
              subtitle: "Наші тренери",
              title: "Каталог тренерів",
            }}
            filteredPosts={filteredTrainers}
          />
          {isError && (
            <div className={styles.error}>Не вдалося завантажити тренерів</div>
          )}
          {isLoading && <div className={styles.loading}>Завантаження…</div>}
        </div>
      </div>
    </div>
  );
};

export default TrainersCatalog;
