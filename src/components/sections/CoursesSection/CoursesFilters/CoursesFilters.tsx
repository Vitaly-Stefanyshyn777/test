"use client";
import React, { useEffect, useMemo, useState } from "react";
import styles from "./CoursesFilters.module.css";
import { WorkoutTypeFilter } from "../filters/WorkoutTypeFilter/WorkoutTypeFilter";
import { TrainingTypeFilter } from "../filters/TrainingTypeFilter/TrainingTypeFilter";
import ButtonFilter from "@/components/ui/ButtonFilter/ButtonFilter";
import { CertificationFilter } from "../filters/TrainerSelectionFilter/TrainerSelectionFilter";
import { fetchCourseCategories, WooCommerceCategory } from "@/lib/bfbApi";

interface FilterState {
  priceMin: number;
  priceMax: number;
  colors: string[];
  sizes: string[];
  certification: string[];
  workoutTypes?: string[];
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

interface CoursesFiltersProps {
  filters: FilterState;
  onFiltersChange: (filters: FilterState) => void;
  onReset: () => void;
  products: Product[];
  searchTerm: string;
  onApplyCategories?: (categoryIds: number[]) => void;
}

const CoursesFilters = ({
  filters,
  onFiltersChange,
  onReset,
  onApplyCategories,
}: CoursesFiltersProps) => {
  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState<WooCommerceCategory[]>([]);
  const [childrenByGroup, setChildrenByGroup] = useState<
    Record<number, WooCommerceCategory[]>
  >({});
  // Окремо: діти категорії Тренування → Оберіть тип тренування (id=61)
  const [trainingPickTypeChildren, setTrainingPickTypeChildren] = useState<
    WooCommerceCategory[]
  >([]);
  // Окремо: діти категорії Тренування → Тип тренування (id=56)
  const [trainingTypeChildren, setTrainingTypeChildren] = useState<
    WooCommerceCategory[]
  >([]);

  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        console.log(
          "[CoursesFilters] 🚀 Завантажую категорії курсів (parent=72)..."
        );
        const cats = await fetchCourseCategories();
        console.log("[CoursesFilters] ✅ Груп (parent=72):", cats.length);
        setCategories(cats);

        // Завантажуємо підкатегорії для кожної групи
        const allChildrenEntries = await Promise.all(
          cats.map(async (g) => {
            const res = await fetch(
              `/api/wc/products/categories?parent=${g.id}&per_page=100`,
              { cache: "no-store" }
            );
            if (!res.ok) {
              console.warn(
                "[CoursesFilters] ⚠️ Не вдалося завантажити підкатегорії для",
                g.id,
                g.name,
                res.status
              );
              return [g.id, [] as WooCommerceCategory[]] as const;
            }
            const children = (await res.json()) as WooCommerceCategory[];
            console.log(
              `[CoursesFilters] 👇 ${g.name} → підкатегорій:`,
              children.length
            );
            return [g.id, children] as const;
          })
        );
        setChildrenByGroup(Object.fromEntries(allChildrenEntries));

        // Підвантажуємо гілку Тренування → Оберіть тип тренування (id=61)
        try {
          const res61 = await fetch(
            `/api/wc/products/categories?parent=61&per_page=100`,
            { cache: "no-store" }
          );
          if (res61.ok) {
            const list61 = (await res61.json()) as WooCommerceCategory[];
            setTrainingPickTypeChildren(list61);
            console.log(
              "[CoursesFilters] ✅ Тренування/Оберіть тип (61) →",
              list61.length
            );
          } else {
            console.warn("[CoursesFilters] ⚠️ Не вдалося завантажити дітей 61");
          }
        } catch {
          console.warn("[CoursesFilters] ⚠️ Помилка завантаження дітей 61");
        }

        // Підвантажуємо гілку Тренування → Тип тренування (id=56)
        try {
          const res56 = await fetch(
            `/api/wc/products/categories?parent=56&per_page=100`,
            { cache: "no-store" }
          );
          if (res56.ok) {
            const list56 = (await res56.json()) as WooCommerceCategory[];
            setTrainingTypeChildren(list56);
            console.log(
              "[CoursesFilters] ✅ Тренування/Тип тренування (56) →",
              list56.length
            );
          } else {
            console.warn("[CoursesFilters] ⚠️ Не вдалося завантажити дітей 56");
          }
        } catch {
          console.warn("[CoursesFilters] ⚠️ Помилка завантаження дітей 56");
        }
      } catch (e) {
        console.error(
          "[CoursesFilters] ❌ Помилка завантаження категорій курсів",
          e
        );
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  // Побудова мапи name -> id для простого зіставлення існуючими компонентами (які працюють зі строками)
  const nameToIdMap = useMemo(() => {
    const map = new Map<string, number>();
    // Мапимо саме підкатегорії як опції
    Object.values(childrenByGroup).forEach((arr) =>
      arr.forEach((c) => map.set(c.name, c.id))
    );
    trainingPickTypeChildren.forEach((c) => map.set(c.name, c.id));
    trainingTypeChildren.forEach((c) => map.set(c.name, c.id));
    return map;
  }, [childrenByGroup, trainingPickTypeChildren, trainingTypeChildren]);

  const handleFilterChange = (
    key: keyof FilterState,
    value: string | string[] | number
  ) => {
    const newFilters = { ...filters, [key]: value };
    onFiltersChange(newFilters);
  };

  const handleApply = () => {
    // Збираємо вибрані назви зі всіх трьох блоків і конвертуємо в ID
    const selectedNames: string[] = [
      ...(filters.sizes || []),
      ...(filters.certification || []),
      ...((filters.workoutTypes as string[]) || []),
    ];
    const categoryIds = selectedNames
      .map((name) => nameToIdMap.get(name))
      .filter((v): v is number => typeof v === "number");

    console.log("[CoursesFilters] 📦 Обрані категорії (names):", selectedNames);
    console.log("[CoursesFilters] 🔢 Обрані категорії (ids):", categoryIds);

    onApplyCategories?.(categoryIds);
  };

  // Нормалізація назв: без двокрапок, пробілів та в нижньому регістрі
  const norm = (s?: string) =>
    (s || "").toLowerCase().trim().replace(/[:]+$/g, "");

  // Підбір груп за назвою з варіантами, або fallback за індексом
  const findGroupId = (titles: string[], fallbackIndex: number) => {
    const normalizedTitles = titles.map(norm);
    const direct = categories.find((g) =>
      normalizedTitles.includes(norm(g.name))
    )?.id;
    return direct ?? categories[fallbackIndex]?.id;
  };

  let groupTypeId = findGroupId(["тип тренування", "тип тренування:"], 1);
  // removed unused groupPickTypeId/groupFormatId to satisfy lint

  // Якщо назви не збіглись, пробуємо визначити групу за вмістом підкатегорій
  const desiredTrainingTypes = new Set([
    "кардіо",
    "танцювальні",
    "mind body",
    "силові",
  ]);
  if (!groupTypeId && Object.keys(childrenByGroup).length > 0) {
    for (const [gidStr, arr] of Object.entries(childrenByGroup)) {
      const hasDesired = arr.some((c) =>
        desiredTrainingTypes.has(norm(c.name))
      );
      if (hasDesired) {
        groupTypeId = Number(gidStr);
        break;
      }
    }
  }

  // Порядок для блоку "Тип тренування"
  const trainingTypeOrder = new Map<string, number>([
    ["Кардіо", 1],
    ["Танцювальні", 2],
    ["Mind body", 3],
    ["Силові", 4],
  ]);

  // Порядок для блоку "Оберіть тип тренування"
  const pickTypeOrder = new Map<string, number>([
    ["З власною вагою", 1],
    ["З додатковим обладнанням", 2],
    ["Тренування в залі", 3],
    ["Тренування вдома", 4],
  ]);

  // Логування для дебагу
  React.useEffect(() => {
    console.log("[CoursesFilters] 🔍 Debug data:", {
      trainingPickTypeChildren,
      trainingPickTypeChildrenLength: trainingPickTypeChildren?.length,
      options: (trainingPickTypeChildren || [])
        .slice()
        .sort(
          (a, b) =>
            (pickTypeOrder.get(a.name) ?? 99) -
            (pickTypeOrder.get(b.name) ?? 99)
        )
        .map((c) => c.name),
      filters: filters.workoutTypes,
    });
  }, [trainingPickTypeChildren, filters.workoutTypes]);

  return (
    <div className={styles.filterContainer}>
      <div className={styles.filterSidebar}>
        <TrainingTypeFilter
          value={filters.sizes}
          onChange={(sizes) => handleFilterChange("sizes", sizes)}
          options={(trainingTypeChildren || [])
            .slice()
            .sort(
              (a, b) =>
                (trainingTypeOrder.get(a.name) ?? 99) -
                (trainingTypeOrder.get(b.name) ?? 99)
            )
            .map((c) => ({ key: c.name, label: c.name }))}
        />

        <CertificationFilter
          value={filters.certification}
          onChange={(vals: string[]) =>
            handleFilterChange("certification", vals)
          }
          options={[]}
        />

        <WorkoutTypeFilter
          value={filters.workoutTypes || []}
          onChange={(vals: string[]) => {
            console.log(
              "[CoursesFilters] 🏋️ WorkoutTypeFilter onChange:",
              vals
            );
            handleFilterChange("workoutTypes", vals);
          }}
          options={(trainingPickTypeChildren || [])
            .slice()
            .sort(
              (a, b) =>
                (pickTypeOrder.get(a.name) ?? 99) -
                (pickTypeOrder.get(b.name) ?? 99)
            )
            .map((c) => c.name)}
        />
      </div>

      <ButtonFilter onApply={handleApply} onReset={onReset} loading={loading} />
    </div>
  );
};

export default CoursesFilters;
