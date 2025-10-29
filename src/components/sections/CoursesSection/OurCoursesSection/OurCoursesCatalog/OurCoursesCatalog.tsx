"use client";
import React, { useMemo, useState } from "react";
import styles from "./OurCoursesCatalog.module.css";
import FilterSortPanel from "@/components/ui/FilterSortPanel/FilterSortPanel";
import ProductsCatalogContainer from "../../ProductsCatalogContainer/CourseCatalogContainer";
import { useProducts } from "@/components/hooks/useProducts";
import { useProductsQuery } from "@/components/hooks/useProductsQuery";
import OurCoursesFilter from "../filters/OurCoursesFilter/OurCoursesFilter";
import { useFilteredProducts } from "@/components/hooks/useFilteredProducts";

const OurCoursesCatalog = () => {
  const { filters, updateFilters, resetFilters } = useProducts();
  const { data: products = [], isLoading, isError } = useProductsQuery();
  const [selectedCategoryIds, setSelectedCategoryIds] = useState<number[]>([]);
  const filtersForQuery = useMemo(
    () => ({ category: selectedCategoryIds.map((id) => String(id)) }),
    [selectedCategoryIds]
  );
  const { data: filteredProducts = [] } = useFilteredProducts(filtersForQuery);

  const searchTerm = "";

  return (
    <div className={styles.productsCatalog}>
      <div className={styles.catalogContentBlock}>
        <div className={styles.catalogContentContainer}>
          <FilterSortPanel />
          <div className={styles.catalogContent}>
            <OurCoursesFilter
              filters={filters}
              onFiltersChange={(newFilters) => updateFilters(newFilters)}
              onReset={() => {
                resetFilters();
                setSelectedCategoryIds([]);
              }}
              products={products}
              searchTerm={searchTerm}
              onApplyCategories={(ids) => {
                setSelectedCategoryIds(ids);
              }}
            />

            <ProductsCatalogContainer
              block={{ subtitle: "Наші товари", title: "Каталог товарів" }}
              filteredProducts={
                selectedCategoryIds.length > 0 ? filteredProducts : products
              }
            />

            {isError && (
              <div className={styles.error}>Не вдалося завантажити товари</div>
            )}
            {isLoading && <div className={styles.loading}>Завантаження…</div>}
          </div>
        </div>
      </div>
    </div>
  );
};

export default OurCoursesCatalog;
