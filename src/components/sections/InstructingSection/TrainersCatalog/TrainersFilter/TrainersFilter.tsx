"use client";
import React, { useState } from "react";
import styles from "./TrainersFilter.module.css";
import { CountryFilter } from "../filters/CountryFilter/CountryFilter";
import { CityFilter } from "../filters/CityFilter/CityFilter";
import { TrainingDirectionFilter } from "../filters/TrainingDirectionFilter/TrainingDirectionFilter";
import { ForWhomFilter } from "../filters/ForWhomFilter/ForWhomFilter";
import { WorkFormatFilter } from "../filters/WorkFormatFilter/WorkFormatFilter";
import ButtonFilter from "@/components/ui/ButtonFilter/ButtonFilter";
import { useCoachesQuery } from "@/components/hooks/useCoachesQuery";
import type { CoachUiItem } from "@/lib/coaches";

interface FilterState {
  country: string;
  city: string;
  cities: string[];
  trainingDirection: string;
  forWhom: string;
  workFormat: string;
}

interface TrainersFilterProps {
  filters: FilterState;
  onFiltersChange: (filters: FilterState) => void;
  onReset: () => void;
  onTrainersChange?: (trainers: unknown[]) => void;
  trainers: Array<{ location?: string }>;
  searchTerm: string;
}

const TrainersFilter = ({
  filters,
  onFiltersChange,
  onReset,
  onTrainersChange,
  trainers,
  searchTerm,
}: TrainersFilterProps) => {
  const [loading, setLoading] = useState(false);
  const { data: coaches = [] } = useCoachesQuery();

  const handleFilterChange = (
    key: keyof FilterState,
    value: string | string[]
  ) => {
    const newFilters = { ...filters, [key]: value };
    onFiltersChange(newFilters);
  };

  const handleApplyFilters = async () => {
    try {
      console.log("[TrainersFilter] 🚀 Застосовую всі фільтри:", filters);
      console.log("[TrainersFilter] 📊 Деталі фільтрів:");
      console.log("- Країна:", filters.country);
      console.log("- Місто:", filters.city);
      console.log("- Міста:", filters.cities);
      console.log("- Напрям тренувань:", filters.trainingDirection);
      console.log("- Для кого:", filters.forWhom);
      console.log("- Формат роботи:", filters.workFormat);

      setLoading(true);

      console.log(
        "[TrainersFilter] 🔍 Фільтрую локально дані з useCoachesQuery..."
      );
      console.log(
        "[TrainersFilter] 📊 Всього тренерів для фільтрації:",
        coaches.length
      );

      // Локальна фільтрація даних з useCoachesQuery (UI-модель)
      const filteredTrainers = (coaches as CoachUiItem[]).filter((coach) => {
        const locationStr: string = coach.location || "";

        if (filters.country && !locationStr.includes(filters.country)) {
          return false;
        }
        if (filters.city && !locationStr.includes(filters.city)) {
          return false;
        }
        if (
          filters.cities.length > 0 &&
          !filters.cities.some((c) => (c ? locationStr.includes(c) : false))
        ) {
          return false;
        }

        if (filters.trainingDirection) {
          const direction = coach.specialization || "";
          if (
            !direction
              .toLowerCase()
              .includes(filters.trainingDirection.toLowerCase())
          ) {
            return false;
          }
        }

        if (filters.forWhom) {
          const targetAudience = coach.superPower || "";
          if (
            !targetAudience
              .toLowerCase()
              .includes(filters.forWhom.toLowerCase())
          ) {
            return false;
          }
        }

        if (filters.workFormat) {
          const workFormat = coach.specialization || "";
          if (
            !workFormat.toLowerCase().includes(filters.workFormat.toLowerCase())
          ) {
            return false;
          }
        }

        return true;
      });

      console.log(
        "[TrainersFilter] 🎯 Після фільтрації:",
        filteredTrainers.length,
        "тренерів"
      );

      console.log(
        "[TrainersFilter] 📋 Фінальні тренери:",
        filteredTrainers.map((coach) => ({
          id: coach.id,
          name: coach.name,
          location: coach.location,
        }))
      );

      if (onTrainersChange) {
        console.log(
          "[TrainersFilter] 🔄 Передаю тренерів до батьківського компонента"
        );
        onTrainersChange(filteredTrainers as unknown[]);
      }
    } catch (error) {
      console.error(
        "[TrainersFilter] ❌ Помилка застосування фільтрів:",
        error
      );
    } finally {
      setLoading(false);
      console.log("[TrainersFilter] 🏁 Завершено застосування фільтрів");
    }
  };

  return (
    <div className={styles.filterContainer}>
      <div className={styles.filterSidebar}>
        <CountryFilter
          value={filters.country}
          onChange={(value) => handleFilterChange("country", value)}
        />

        <CityFilter
          value={filters.city}
          selectedCities={filters.cities}
          onCityChange={(value) => handleFilterChange("city", value)}
          onToggleCity={(cities) => handleFilterChange("cities", cities)}
          trainers={trainers}
          searchTerm={searchTerm}
        />

        <TrainingDirectionFilter
          value={filters.trainingDirection}
          onChange={(value) => handleFilterChange("trainingDirection", value)}
        />

        <ForWhomFilter
          value={filters.forWhom}
          onChange={(value) => handleFilterChange("forWhom", value)}
        />

        <WorkFormatFilter
          value={filters.workFormat}
          onChange={(value) => handleFilterChange("workFormat", value)}
        />
      </div>
      <ButtonFilter
        onApply={handleApplyFilters}
        onReset={onReset}
        loading={loading}
      />
    </div>
  );
};

export default TrainersFilter;
