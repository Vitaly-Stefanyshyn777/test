"use client";
import React, { useMemo, useState, useRef, useEffect } from "react";
import Link from "next/link";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination } from "swiper/modules";
import type { SwiperRef } from "swiper/react";
import { useProductsByCategory } from "@/components/hooks/useFilteredProducts";
import ProductCard from "../ProductCard/ProductCard";
import SliderNav from "@/components/ui/SliderNav/SliderNavActions";
import s from "./ProductsShowcase.module.css";
import { fetchWcCategories } from "@/lib/bfbApi";

import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

const ProductsShowcase: React.FC = () => {
  const [inventoryCategories, setInventoryCategories] = useState<
    Array<{ id: number; name: string; slug: string; image?: { src?: string } }>
  >([]);
  useEffect(() => {
    (async () => {
      try {
        const cats = (await fetchWcCategories({
          parent: 85,
          per_page: 50,
        })) as Array<{
          id: number;
          name: string;
          slug: string;
          image?: { src?: string };
        }>;
        const allowedSlugs = new Set([
          "inventory-boards",
          "inventory-accessories",
        ]);
        const filtered = (cats || [])
          .filter(Boolean)
          .filter((c) => allowedSlugs.has(c.slug));
        setInventoryCategories(filtered);
      } catch {
        setInventoryCategories([]);
      }
    })();
  }, []);
  // Отримуємо продукти категорії 30 ("Товари для спорту") напряму через WC v3
  const {
    data: courses = [],
    isLoading,
    isError,
  } = useProductsByCategory("30");
  const swiperRef = useRef<SwiperRef>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [fallbackProducts, setFallbackProducts] = useState<
    Array<{
      id: number | string;
      name: string;
      price?: number | string;
      regularPrice?: number | string;
      image?: string;
      categories?: Array<{ id: number; name: string; slug: string }>;
      dateCreated?: string;
    }>
  >([]);

  const list = useMemo(
    () => (Array.isArray(courses) ? courses : []),
    [courses]
  );
  // Дані вже відфільтровані на етапі запиту; можна напряму відображати
  const displayedCourses = list.length > 0 ? list : fallbackProducts;

  type ShowcaseItem = {
    id: number | string;
    name: string;
    price?: number | string;
    regularPrice?: number | string;
    image?: string;
    categories?: Array<{ id: number; name: string; slug: string }>;
    dateCreated?: string;
  };

  const normalizedShowcase: ShowcaseItem[] = useMemo(() => {
    return (displayedCourses as Array<Record<string, unknown>>).map((p) => ({
      id: (p as { id: number | string }).id,
      name: (p as { name: string }).name,
      price: (p as { price?: number | string }).price,
      regularPrice:
        (p as { regularPrice?: number | string }).regularPrice ??
        (p as { regular_price?: number | string }).regular_price,
      image:
        (p as { image?: string }).image ??
        ((p as { images?: Array<{ src?: string }> }).images?.[0]?.src ||
          undefined),
      categories: (
        p as {
          categories?: Array<{ id: number; name: string; slug: string }>;
        }
      ).categories,
      dateCreated:
        (p as { dateCreated?: string }).dateCreated ??
        (p as { date_created?: string }).date_created,
    }));
  }, [displayedCourses]);

  // Fallback: якщо з якоїсь причини масив порожній, робимо прямий запит до роута WC v3
  useEffect(() => {
    if (list.length > 0) return;
    const fetchFallback = async () => {
      try {
        const res = await fetch("/api/wc/v3/products?category=30&per_page=20");
        if (!res.ok) return;
        const data = await res.json();
        // нормалізуємо під ProductCard очікування
        const normalized = (Array.isArray(data) ? data : []).map((p) => ({
          id: p.id,
          name: p.name,
          price: p.price,
          regularPrice: p.regular_price,
          image: p.images?.[0]?.src,
          categories: p.categories || [],
          dateCreated: p.date_created,
        }));
        setFallbackProducts(normalized);
      } catch {}
    };
    fetchFallback();
  }, [list.length]);

  // Логи отриманих товарів
  // minimal debug only if needed

  useEffect(() => {
    // debug removed
  }, [displayedCourses.length]); // Залежить тільки від довжини масиву

  const handlePrev = () => {
    if (swiperRef.current?.swiper) {
      swiperRef.current.swiper.slidePrev();
    } else {
      const swiperEl = document.querySelector(`.${s.swiper}`) as HTMLElement & {
        swiper?: {
          slidePrev: () => void;
          slideNext: () => void;
          slideTo: (index: number) => void;
        };
      };
      if (swiperEl && swiperEl.swiper) swiperEl.swiper.slidePrev();
    }
  };

  const handleNext = () => {
    if (swiperRef.current?.swiper) {
      swiperRef.current.swiper.slideNext();
    } else {
      const swiperEl = document.querySelector(`.${s.swiper}`) as HTMLElement & {
        swiper?: {
          slidePrev: () => void;
          slideNext: () => void;
          slideTo: (index: number) => void;
        };
      };
      if (swiperEl && swiperEl.swiper) swiperEl.swiper.slideNext();
    }
  };

  const handleDotClick = (index: number) => {
    if (swiperRef.current?.swiper) {
      swiperRef.current.swiper.slideToLoop(index);
    } else {
      const swiperEl = document.querySelector(`.${s.swiper}`) as HTMLElement & {
        swiper?: {
          slidePrev: () => void;
          slideNext: () => void;
          slideTo: (index: number) => void;
          slideToLoop: (index: number) => void;
        };
      };
      if (swiperEl && swiperEl.swiper) swiperEl.swiper.slideToLoop(index);
    }
  };

  if (isLoading) {
    return (
      <section className={s.section}>
        <div className={s.container}>
          <div className={s.header}>
            <div className={s.headerLeft}>
              <p className={s.eyebrow}>Інвентар</p>
              <h2 className={s.title}>Товари для спорту </h2>
            </div>
          </div>
          <div className={s.loading}>Завантаження курсів...</div>
        </div>
      </section>
    );
  }

  if (isError) {
    return (
      <section className={s.section}>
        <div className={s.container}>
          <div className={s.header}>
            <div className={s.headerLeft}>
              <p className={s.eyebrow}>Інвентар навчання</p>
              <h2 className={s.title}>Товари для спорту </h2>
            </div>
          </div>
          <div className={s.error}>Не вдалося завантажити курси</div>
        </div>
      </section>
    );
  }

  return (
    <section className={s.section}>
      <div className={s.container}>
        <div className={s.header}>
          <div className={s.headerLeft}>
            <p className={s.eyebrow}>Початок навчання</p>
            <h2 className={s.title}>Почни свій шлях з BFB тут</h2>
          </div>
          <div className={s.headerRight}>
            <SliderNav
              activeIndex={activeIndex}
              dots={displayedCourses.length}
              onPrev={handlePrev}
              onNext={handleNext}
              onDotClick={handleDotClick}
            />
          </div>
        </div>

        <div className={s.coursesSlider}>
          <Swiper
            ref={swiperRef}
            modules={[Navigation, Pagination]}
            spaceBetween={16}
            slidesPerView={5}
            slidesPerGroup={1}
            loop={true}
            allowSlideNext={true}
            allowSlidePrev={true}
            onSlideChange={(sw) => {
              const realIndex = sw.realIndex;
              setActiveIndex(realIndex);
            }}
            onSwiper={() => {}}
            breakpoints={{
              768: {
                slidesPerView: 3,
                spaceBetween: 16,
              },
              1024: {
                slidesPerView: 5,
                spaceBetween: 16,
              },
            }}
            className={s.swiper}
          >
            {normalizedShowcase.map((product) => (
              <SwiperSlide key={String(product.id)} className={s.slide}>
                <ProductCard
                  id={String(product.id)}
                  name={product.name}
                  price={
                    typeof product.price === "string"
                      ? parseFloat(product.price)
                      : product.price || 0
                  }
                  originalPrice={
                    typeof product.regularPrice === "string"
                      ? parseFloat(product.regularPrice)
                      : product.regularPrice || undefined
                  }
                  image={product.image}
                  categories={product.categories}
                  dateCreated={product.dateCreated}
                />
              </SwiperSlide>
            ))}
          </Swiper>
        </div>

        <div className={s.footer}>
          <Link href="/courses" className={s.allCoursesBtn}>
            До усіх товарів
          </Link>
        </div>
      </div>
    </section>
  );
};

export default ProductsShowcase;
