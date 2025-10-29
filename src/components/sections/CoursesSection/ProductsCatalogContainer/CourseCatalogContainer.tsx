"use client";
import React, { useState, useRef, useEffect, useMemo } from "react";
import styles from "./CourseCatalogContainer.module.css";
import SliderNav from "@/components/ui/SliderNav/SliderNavActions";
import type SwiperType from "swiper";
import ProductsGrid from "../CoursesGrid/CoursesGrid";
import { useProductsQuery } from "@/components/hooks/useProductsQuery";

interface Props {
  block: {
    subtitle: string;
    title: string;
  };
  filteredProducts: unknown[];
}

const CourseCatalogContainer = ({ filteredProducts }: Props) => {
  const { data: products = [], isLoading, isError } = useProductsQuery();

  console.log("[CourseCatalogContainer] 📊 Стан компонента:", {
    productsCount: products.length,
    filteredProductsCount: filteredProducts?.length || 0,
    isLoading,
    isError,
  });

  const [sortBy] = useState("name");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(12);

  // Використовуємо відфільтровані товари, якщо вони передані
  type ProductLike = {
    id: string | number;
    name: string;
    price: string;
    regularPrice?: string;
    salePrice?: string;
    onSale?: boolean;
    images?: Array<{ src: string }>;
    categories?: unknown;
    stockStatus?: string;
  };
  const sourceProducts: ProductLike[] =
    filteredProducts && filteredProducts.length > 0
      ? (filteredProducts as ProductLike[])
      : (products as ProductLike[]);

  const sortedProducts = useMemo(() => {
    const copy = [...sourceProducts];
    if (sortBy === "name") copy.sort((a, b) => a.name.localeCompare(b.name));
    if (sortBy === "price")
      copy.sort((a, b) => parseFloat(a.price) - parseFloat(b.price));
    return copy;
  }, [sourceProducts, sortBy]);

  const totalPages = Math.max(
    1,
    Math.ceil(sortedProducts.length / itemsPerPage)
  );
  const start = (currentPage - 1) * itemsPerPage;
  const pageData = sortedProducts.slice(start, start + itemsPerPage);

  const productsForGrid = pageData.map((product) => ({
    id: String(product.id),
    name: product.name,
    price: String(product.price ?? "0"),
    regularPrice: String(product.regularPrice ?? ""),
    salePrice: String(product.salePrice ?? ""),
    onSale: Boolean(product.onSale),
    image: product.images?.[0]?.src || "",
    categories:
      (product.categories as Array<{
        id: number;
        name: string;
        slug: string;
      }>) || [],
    stockStatus: String(product.stockStatus ?? ""),
  }));

  console.log("[CourseCatalogContainer] 🎯 Продукти для сітки:", {
    productsForGridCount: productsForGrid.length,
    firstProduct: productsForGrid[0]
      ? {
          id: productsForGrid[0].id,
          name: productsForGrid[0].name,
          price: productsForGrid[0].price,
          image: productsForGrid[0].image,
        }
      : "Немає продуктів",
  });

  const [activeIndex, setActiveIndex] = useState(0);
  const swiperRef = useRef<SwiperType | null>(null);

  useEffect(() => {
    setActiveIndex(0);
    swiperRef.current?.slideTo(0);
  }, [filteredProducts]);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  return (
    <div className={styles.catalogContainer}>
      <div className={styles.mainContent}>
        {isError && (
          <div className={styles.error}>Не вдалося завантажити товари</div>
        )}
        {isLoading && <div className={styles.loading}>Завантаження…</div>}
        {!isLoading && !isError && <ProductsGrid />}
        {sortedProducts.length > 12 && (
          <SliderNav
            activeIndex={activeIndex}
            dots={Math.ceil(sortedProducts.length / itemsPerPage)}
            onPrev={() => swiperRef.current?.slidePrev()}
            onNext={() => swiperRef.current?.slideNext()}
            onDotClick={(i) => swiperRef.current?.slideTo(i)}
          />
        )}

        {totalPages > 1 && (
          <div className={styles.pagination}>
            <button
              className={styles.paginationBtn}
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
            >
              ←
            </button>

            <div className={styles.paginationDots}>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                (page) => (
                  <button
                    key={page}
                    className={`${styles.paginationDot} ${
                      page === currentPage ? styles.activeDot : ""
                    }`}
                    onClick={() => handlePageChange(page)}
                  />
                )
              )}
            </div>

            <button
              className={styles.paginationBtn}
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
            >
              →
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default CourseCatalogContainer;
