"use client";
import React, { useState } from "react";
import styles from "./ColorFilter.module.css";
import { MinuswIcon, PlusIcon } from "@/components/Icons/Icons";
import {
  useProductAttributesQuery,
  useAttributeTermsQuery,
} from "@/components/hooks/useWpQueries";

interface ColorFilterProps {
  selectedColors: string[];
  onChange: (colors: string[]) => void;
  products: Product[];
}

interface Product {
  id: string;
  name: string;
  price: string;
  regularPrice: string;
  salePrice: string;
  onSale: boolean;
  image: string;
  categories: Array<{
    id: number;
    name: string;
    slug: string;
  }>;
  stockStatus: string;
}

type Term = { id: number; name: string; slug: string; count?: number };

export const ColorFilter = ({ selectedColors, onChange }: ColorFilterProps) => {
  const [isExpanded, setIsExpanded] = useState(true);
  const { data: attrs = [], isLoading, isError } = useProductAttributesQuery();
  const colorAttr = (attrs || []).find((a) => {
    const slug = (a.slug || "").toLowerCase();
    const name = (a.name || "").toLowerCase();
    return (
      slug === "pa_color" ||
      slug.endsWith("_color") ||
      slug === "color" ||
      name === "color"
    );
  });
  const colorAttrId = colorAttr?.id ?? 0;
  const { data: termsData = [] } = useAttributeTermsQuery(
    colorAttrId,
    !!colorAttrId
  );
  // Обчислюємо terms на льоту без useEffect
  const terms = (termsData || []) as Term[];

  const handleColorToggle = (idOrSlug: string) => {
    // Toggle behavior: if already selected, remove it; if not selected, add it
    if (selectedColors.includes(idOrSlug)) {
      // Second click: remove from selection
      onChange(selectedColors.filter((c) => c !== idOrSlug));
    } else {
      // First click: add to selection
      onChange([...selectedColors, idOrSlug]);
    }
  };

  const toggleSection = () => {
    setIsExpanded(!isExpanded);
  };

  return (
    <div
      className={`${styles.filterSection} ${
        !isExpanded ? styles.collapsedSection : ""
      }`}
    >
      <div className={styles.sectionTitleContainer} onClick={toggleSection}>
        <h3 className={styles.sectionTitle}>Оберіть колір</h3>
        {isExpanded ? <MinuswIcon /> : <PlusIcon />}
      </div>
      <div
        className={`${styles.sectionContent} ${
          isExpanded ? styles.expanded : styles.collapsed
        }`}
      >
        {isLoading && <div className={styles.loading}>Завантаження…</div>}
        {isError && <div className={styles.error}>Помилка завантаження</div>}
        {!isLoading && !isError && (
          <div className={styles.colorList}>
            {terms.map((term) => {
              const slug = (term.slug || "").toLowerCase();
              const name = (term.name || "").toLowerCase();
              const colorHexByKey: Record<string, string> = {
                beige: "#F5F5DC",
                green: "#4CAF50",
                white: "#FFFFFF",
                red: "#F44336",
                blue: "#2196F3",
                black: "#000000",
                grey: "#9E9E9E",
                gray: "#9E9E9E",
                brown: "#795548",
                pink: "#E91E63",
                purple: "#9C27B0",
                yellow: "#FFEB3B",
                orange: "#FF9800",
              };
              const key = slug || name;
              const swatchColor = colorHexByKey[key] || "#EEEEEE";
              const isWhite = key === "white" || swatchColor === "#FFFFFF";

              const count: number | undefined = term.count;

              return (
                <div key={term.id} className={styles.colorItem}>
                  <div
                    className={`${styles.colorSwatch} ${
                      selectedColors.includes(String(term.id))
                        ? styles.selected
                        : ""
                    } ${isWhite ? styles.whiteColor : ""}`}
                    style={{ backgroundColor: swatchColor }}
                    onClick={() => handleColorToggle(String(term.id))}
                    aria-label={`Обрати колір ${term.name}`}
                    role="button"
                  />
                  <span className={styles.colorName}>{term.name}</span>
                  {typeof count === "number" && (
                    <span className={styles.colorCount}>{count}</span>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};
