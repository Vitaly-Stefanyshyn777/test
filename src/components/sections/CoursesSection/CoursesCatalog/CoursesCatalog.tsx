"use client";
import React, { useMemo, useState } from "react";
import styles from "./CoursesCatalog.module.css";
import ProductsFilter from "../CoursesFilters/CoursesFilters";
import { useProducts } from "@/components/hooks/useProducts";
import FilterSortPanel from "@/components/ui/FilterSortPanel/FilterSortPanel";
import ProductsCatalogContainer from "../ProductsCatalogContainer/CourseCatalogContainer";
import { useCoursesQuery } from "@/lib/coursesQueries";
import { useFilteredCourses } from "@/lib/useFilteredCourses";
import FAQSection from "../../FAQSection/FAQSection";

type CoursesUIFilters = {
  priceMin: number;
  priceMax: number;
  colors: string[];
  sizes: string[];
  certification: string[];
  category: string;
  search: string;
};

const CoursesCatalog = () => {
  const { filters, updateFilters, resetFilters } = useProducts();
  const { data: courses = [], isLoading, isError } = useCoursesQuery();
  const [selectedCategoryIds, setSelectedCategoryIds] = useState<number[]>([]);
  const filtersForQuery = useMemo(
    () => ({ category: selectedCategoryIds.map((id) => String(id)) }),
    [selectedCategoryIds]
  );
  const { data: filteredCourses = [] } = useFilteredCourses(filtersForQuery);

  const searchTerm = "";

  return (
    <div className={styles.productsCatalog}>
      <div className={styles.catalogContentBlock}>
        <div className={styles.catalogContentContainer}>
          <FilterSortPanel />
          <div className={styles.catalogContent}>
            {(() => {
              const uiFilters: CoursesUIFilters = {
                priceMin: filters.priceMin,
                priceMax: filters.priceMax,
                colors: filters.colors,
                sizes: filters.sizes,
                certification: filters.certification
                  ? [filters.certification]
                  : [],
                category: filters.category,
                search: filters.search,
              };

              const handleUiFiltersChange = (
                newFilters: Partial<CoursesUIFilters>
              ) => {
                const nextCertificationArray =
                  newFilters.certification ?? uiFilters.certification;
                const nextCertification = Array.isArray(nextCertificationArray)
                  ? nextCertificationArray[0] ?? ""
                  : "";

                updateFilters({
                  priceMin: newFilters.priceMin,
                  priceMax: newFilters.priceMax,
                  colors: newFilters.colors,
                  sizes: newFilters.sizes,
                  certification: nextCertification,
                  category: newFilters.category,
                  search: newFilters.search,
                });
              };

              return (
                <ProductsFilter
                  filters={uiFilters}
                  onFiltersChange={handleUiFiltersChange}
                  onReset={() => {
                    resetFilters();
                    setSelectedCategoryIds([]);
                  }}
                  products={courses}
                  searchTerm={searchTerm}
                  onApplyCategories={(categoryIds) => {
                    console.log(
                      "[CoursesCatalog] 🔎 Обрані категорії (ids):",
                      categoryIds
                    );
                    setSelectedCategoryIds(categoryIds);
                  }}
                />
              );
            })()}
            <ProductsCatalogContainer
              block={{
                subtitle: "Наші товари",
                title: "Каталог товарів",
              }}
              filteredProducts={
                selectedCategoryIds.length > 0 ? filteredCourses : courses
              }
            />

            {isError && (
              <div className={styles.error}>Не вдалося завантажити товари</div>
            )}
            {isLoading && <div className={styles.loading}>Завантаження…</div>}
          </div>
        </div>
        <FAQSection />
      </div>
    </div>
  );
};

export default CoursesCatalog;
