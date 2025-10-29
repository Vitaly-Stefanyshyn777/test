"use client";
import Image from "next/image";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import styles from "./ProductsShowcase.module.css";
import type { Product } from "@/lib/products";
import { PlusIcon } from "../Icons/Icons";
import { fetchWcCategories } from "@/lib/bfbApi";

interface ProductsShowcaseProps {
  title: string;
  products?: Product[];
  moreHref?: string;
  showNewBadge?: boolean;
}

export function ProductsShowcase({
  title,
  moreHref = "#",
}: ProductsShowcaseProps) {
  type InventoryCategory = {
    id: number;
    name: string;
    slug: string;
    image?: { src?: string };
  };

  const [categories, setCategories] = useState<InventoryCategory[]>([]);
  const [hasNewInCategory, setHasNewInCategory] = useState<
    Record<number, boolean>
  >({});
  // Лише список категорій для навігації; вибір і фільтрація відбудуться на сторінці каталогу

  useEffect(() => {
    (async () => {
      try {
        const cats = (await fetchWcCategories({
          parent: 85, // Інвентар
          per_page: 50,
        })) as InventoryCategory[];
        // Показуємо рівно стільки, скільки реально існує дочірніх категорій
        setCategories((cats || []).filter(Boolean));
      } catch {
        setCategories([]);
      }
    })();
  }, []);

  // Визначаємо, чи є у категорії нові товари (дата створення за останні 14 днів)
  useEffect(() => {
    if (!categories.length) return;
    const controller = new AbortController();
    (async () => {
      try {
        const checks = await Promise.all(
          categories.map(async (cat) => {
            try {
              const res = await fetch(
                `/api/wc/v3/products?category=${cat.id}&per_page=1&orderby=date&order=desc`,
                { signal: controller.signal }
              );
              if (!res.ok) return [cat.id, false] as const;
              const data = (await res.json()) as Array<{
                date_created?: string;
              }>;
              const latest = Array.isArray(data) && data[0]?.date_created;
              if (!latest) return [cat.id, false] as const;
              const created = new Date(latest);
              const today = new Date();
              const msInDay = 1000 * 60 * 60 * 24;
              const days = Math.floor(
                (today.getTime() - created.getTime()) / msInDay
              );
              return [cat.id, days <= 14] as const;
            } catch {
              return [cat.id, false] as const;
            }
          })
        );
        const map: Record<number, boolean> = {};
        for (const [id, isNew] of checks) map[id] = isNew;
        setHasNewInCategory(map);
      } catch {}
    })();
    return () => controller.abort();
  }, [categories]);

  // прибрано локальне завантаження продуктів

  const searchParams = useSearchParams();
  const categoryParam = searchParams.get("category");
  const displayedTitle = (() => {
    const map: Record<string, string> = {
      "inventory-boards": "Борди",
      "inventory-accessories": "Аксесуари",
      "30": "Товари для спорту",
    };
    if (!categoryParam) return title;
    return map[categoryParam] || title;
  })();

  return (
    <section className={styles.wrapper}>
      <div className={styles.header}>
        <h2 className={styles.title}>{displayedTitle}</h2>
      </div>

      <div className={styles.scroller}>
        {categories.map((cat) => (
          <Link
            key={cat.id}
            href={`/products?category=${cat.slug}`}
            className={styles.card}
          >
            <div className={styles.thumb}>
              {hasNewInCategory[cat.id] && (
                <span className={styles.badge}>Новинка</span>
              )}
              <Image
                src={cat.image?.src || "/placeholder.svg"}
                alt={cat.name}
                fill
                sizes="(max-width: 600px) 50vw, 320px"
              />
            </div>
            <div className={styles.caption}>
              <span className={styles.name}>{cat.name}</span>
              <span className={styles.price}></span>
            </div>
          </Link>
        ))}
        <Link
          href={moreHref}
          className={`${styles.card} ${styles.moreCard}`}
          aria-label="Більше товарів"
        >
          <div className={styles.moreInner}>
            <span className={styles.plus}>
              <PlusIcon />
            </span>
            <span className={styles.moreText}>Більше</span>
          </div>
        </Link>
      </div>
    </section>
  );
}
