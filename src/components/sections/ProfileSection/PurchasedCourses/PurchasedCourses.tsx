"use client";
import React, { useEffect, useState } from "react";
import styles from "./PurchasedCourses.module.css";
import CoursesList, { type Course } from "./CoursesList";
import { fetchPurchasedProducts, PurchasedProduct } from "@/lib/bfbApi";
import { useAuthStore } from "@/store/auth";

interface PurchasedCoursesProps {
  title?: string;
  courses?: Course[];
}

const defaultCourses: Course[] = [
  {
    id: "bfb-fundamentals-1",
    title: "Основи тренерства BFB",
    description: "Пройдено: 12 уроків з 20",
    image: "/images/courses/bfb-fundamentals.jpg",
    type: "Online",
    progress: { completed: 12, total: 20 },
    price: 5000,
    currency: "₴",
    watchUrl: "/courses/bfb-fundamentals",
  },
  {
    id: "bfb-fundamentals-2",
    title: "Основи тренерства BFB",
    description: "Пройдено: 12 уроків з 20",
    image: "/images/courses/bfb-fundamentals.jpg",
    type: "Online",
    progress: { completed: 12, total: 20 },
    price: 5000,
    currency: "₴",
    watchUrl: "/courses/bfb-fundamentals",
  },
  {
    id: "bfb-fundamentals-3",
    title: "Основи тренерства BFB",
    description: "Пройдено: 12 уроків з 20",
    image: "/images/courses/bfb-fundamentals.jpg",
    type: "Online",
    progress: { completed: 12, total: 20 },
    price: 5000,
    currency: "₴",
    watchUrl: "/courses/bfb-fundamentals",
  },
  {
    id: "bfb-fundamentals-4",
    title: "Основи тренерства BFB",
    description: "Пройдено: 12 уроків з 20",
    image: "/images/courses/bfb-fundamentals.jpg",
    type: "Online",
    progress: { completed: 12, total: 20 },
    price: 5000,
    currency: "₴",
    watchUrl: "/courses/bfb-fundamentals",
  },
];

const PurchasedCourses: React.FC<PurchasedCoursesProps> = ({
  title = "Придбані курси",
  courses = defaultCourses,
}) => {
  const [purchasedProducts, setPurchasedProducts] = useState<
    PurchasedProduct[]
  >([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const user = useAuthStore((s) => s.user);
  const token = useAuthStore((s) => s.token);

  useEffect(() => {
    (async () => {
      try {
        if (!user?.id || !token) {
          setError("Користувач не авторизований");
          return;
        }

        setIsLoading(true);
        const userId = parseInt(user.id);
        const data = await fetchPurchasedProducts(userId, token || undefined);
        console.log("[PurchasedCourses] response:", data);
        setPurchasedProducts(data);
      } catch (err) {
        console.error("[PurchasedCourses] Error:", err);
        setError("Не вдалося завантажити придбані курси");
      } finally {
        setIsLoading(false);
      }
    })();
  }, [user?.id, token]);

  const handleWatchCourse = (course: Course) => {
    if (course.watchUrl) {
      window.open(course.watchUrl, "_blank");
    }
  };

  if (isLoading) {
    return (
      <div className={styles.purchasedCourses}>
        <h2 className={styles.title}>{title}</h2>
        <div className={styles.divider}></div>
        <div className={styles.loading}>Завантаження...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={styles.purchasedCourses}>
        <h2 className={styles.title}>{title}</h2>
        <div className={styles.divider}></div>
        <div className={styles.error}>{error}</div>
      </div>
    );
  }

  if (purchasedProducts.length === 0) {
    return (
      <div className={styles.purchasedCourses}>
        <h2 className={styles.title}>{title}</h2>
        <div className={styles.divider}></div>
        <div className={styles.empty}>У вас поки немає придбаних курсів</div>
      </div>
    );
  }

  return (
    <div className={styles.purchasedCourses}>
      <h2 className={styles.title}>{title}</h2>
      <div className={styles.divider}></div>
      <CoursesList courses={courses} onWatch={handleWatchCourse} />
    </div>
  );
};

export default PurchasedCourses;
