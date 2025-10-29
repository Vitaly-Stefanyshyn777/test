"use client";
import React, { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import styles from "./ProductsCatalog.module.css";
import ProductsFilter from "../ProductsFilter/ProductsFilter";
import { useProducts } from "@/components/hooks/useProducts";
import FilterSortPanel from "@/components/ui/FilterSortPanel/FilterSortPanel";
import ProductsCatalogContainer from "../ProductsCatalogContainer/ProductsCatalogContainer";
// Видалено useProductsQuery імпорт
import {
  useFilteredProducts,
  type ProductFilters,
} from "@/components/hooks/useFilteredProducts";
import { ProductsNewShowcase } from "@/components/ProductsShowcase/ProductsNewShowcase";
import { fetchWcCategories } from "@/lib/bfbApi";

const ProductsCatalog = () => {
  const { filters, updateFilters, resetFilters } = useProducts();
  // Видалено useProductsQuery, використовуємо тільки useFilteredProducts

  const [appliedWcFilters, setAppliedWcFilters] =
    useState<Partial<ProductFilters> | null>({ category: "30" });
  const [catalogTitle, setCatalogTitle] = useState<string>("Товари для спорту");

  // Слухаємо зміну ?category=<slug|id> у URL і застосовуємо фільтр
  const searchParams = useSearchParams();
  useEffect(() => {
    const q = searchParams.get("category");
    if (!q) {
      setCatalogTitle("Товари для спорту");
      return;
    }

    if (/^\d+$/.test(q)) {
      if (q !== appliedWcFilters?.category)
        setAppliedWcFilters({ category: q });
      if (q === "30") {
        setCatalogTitle("Товари для спорту");
      } else {
        // Спроба дістати назву категорії за ID
        (async () => {
          try {
            const cats = (await fetchWcCategories({ include: q })) as Array<{
              id: number;
              name: string;
            }>;
            const byId = (cats || []).find((c) => String(c.id) === q);
            if (byId?.name) setCatalogTitle(byId.name);
          } catch {
            // залишаємо попередній заголовок
          }
        })();
      }
      return;
    }

    (async () => {
      try {
        const cats = (await fetchWcCategories({
          parent: 85,
          per_page: 50,
        })) as Array<{
          id: number;
          name: string;
          slug: string;
        }>;
        const found = (cats || []).find((c) => c.slug === q);
        if (found) {
          if (String(found.id) !== appliedWcFilters?.category) {
            setAppliedWcFilters({ category: String(found.id) });
          }
          setCatalogTitle(found.name || "Товари для спорту");
        } else {
          if (q !== appliedWcFilters?.category)
            setAppliedWcFilters({ category: q });
          setCatalogTitle("Товари для спорту");
        }
      } catch {
        if (q !== appliedWcFilters?.category)
          setAppliedWcFilters({ category: q });
        setCatalogTitle("Товари для спорту");
      }
    })();
  }, [searchParams, appliedWcFilters?.category]);
  const {
    data: wcFilteredProducts = [],
    isLoading,
    isError,
  } = useFilteredProducts(appliedWcFilters ?? {});

  type FilterProduct = {
    id?: string | number;
    name?: string;
    price?: string | number;
    regularPrice?: string | number;
    salePrice?: string | number;
    onSale?: boolean;
    image?: string;
    categories?: Array<{ id: number; name: string; slug: string }>;
    stockStatus?: string;
    dateCreated?: string;
  };
  const wcFilteredProductsForFilter = (
    wcFilteredProducts as FilterProduct[]
  ).map((p) => ({
    id: String(p.id ?? ""),
    name: p.name ?? "",
    price: String(p.price ?? "0"),
    regularPrice: String(p.regularPrice ?? ""),
    salePrice: String(p.salePrice ?? ""),
    onSale: Boolean(p.onSale),
    image: p.image ?? "",
    categories: p.categories ?? [],
    stockStatus: String(p.stockStatus ?? ""),
    dateCreated: p.dateCreated,
  }));

  const searchTerm = "";

  return (
    <div className={styles.productsCatalog}>
      <div className={styles.catalogContentBlock}>
        <ProductsNewShowcase />
        <div className={styles.catalogContentContainer}>
          <FilterSortPanel />
          <div className={styles.catalogContent}>
            <ProductsFilter
              filters={filters}
              onFiltersChange={(newFilters) => updateFilters(newFilters)}
              onReset={() => {
                resetFilters();
                setAppliedWcFilters(null);
              }}
              products={wcFilteredProductsForFilter}
              searchTerm={searchTerm}
              onApply={(params) => {
                setAppliedWcFilters(params as Partial<ProductFilters>);
              }}
            />
            <ProductsCatalogContainer
              block={{
                subtitle: "Наші товари",
                title: catalogTitle,
              }}
              filteredProducts={wcFilteredProducts}
              isNoCertificationFilter={appliedWcFilters?.category === "78"}
              selectedCertificationFilter={
                Array.isArray(appliedWcFilters?.category)
                  ? appliedWcFilters.category[0]
                  : appliedWcFilters?.category
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

export default ProductsCatalog;
