"use client";

import React from "react";
import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import styles from "./Breadcrumbs.module.css";

interface BreadcrumbItem {
  label: string;
  href?: string;
  isActive?: boolean;
}

const Breadcrumbs: React.FC = () => {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const generateBreadcrumbs = (): BreadcrumbItem[] => {
    const segments = pathname.split("/").filter(Boolean);
    const breadcrumbs: BreadcrumbItem[] = [];

    breadcrumbs.push({ label: "Головна", href: "/" });

    let currentPath = "";

    segments.forEach((segment, index) => {
      currentPath += `/${segment}`;

      let label = segment;

      if (segment === "trainers") {
        label = "Знайди тренера";
      } else if (segment === "courses-landing") {
        label = "Інструкторство";
      } else if (segment === "courses") {
        label = "Онлайн тренування";
      } else if (currentPath.match(/^\/courses\/[\w-]+$/)) {
        label = "Основи тренерства BFB";
      } else if (segment === "course") {
        label = "Основи тренерства BFB";
      } else if (segment === "our-courses") {
        label = "Навчання B.F.B";
      } else if (segment === "inventory" || segment === "products") {
        label = "Інвентар";
      } else if (segment === "workshops") {
        label = "Воркшопи";
      } else if (segment === "about") {
        label = "Про нас";
      } else if (segment === "about-bfb") {
        label = "Про B.F.B";
      } else if (segment === "contact" || segment === "contacts") {
        label = "Контакти";
      }
      const isActive = index === segments.length - 1;

      breadcrumbs.push({
        label,
        href: isActive ? undefined : currentPath,
        isActive,
      });
    });

    return breadcrumbs;
  };

  const breadcrumbs = generateBreadcrumbs();

  // Додаємо дочірню категорію Інвентар у /products?category=...
  if (pathname === "/products") {
    const categorySlug = searchParams.get("category");
    if (categorySlug) {
      const map: Record<string, string> = {
        "inventory-boards": "Борди",
        "inventory-accessories": "Аксесуари",
      };
      const label = map[categorySlug];
      if (label) {
        // Робимо /products неактивним посиланням та додаємо активну категорію
        if (breadcrumbs.length > 0) {
          const last = breadcrumbs[breadcrumbs.length - 1];
          last.isActive = false;
          last.href = "/products";
        }
        breadcrumbs.push({ label, isActive: true });
      }
    }
  }

  if (
    pathname === "/" ||
    pathname === "/order-success" ||
    pathname === "/checkout" ||
    pathname.startsWith("/profile") ||
    (pathname.includes("/trainers/") && pathname !== "/trainers")
  ) {
    return null;
  }

  const isTrainersList = pathname === "/trainers";
  const isOurCourses = pathname === "/our-courses";
  const isCoursesLanding = pathname === "/courses-landing";
  const isAboutBfb = pathname === "/about-bfb";
  const isContacts = pathname === "/contacts" || pathname === "/contact";

  return (
    <nav
      className={`${styles.breadcrumbs} ${
        isTrainersList ? styles.onTrainers : ""
      } ${isOurCourses ? styles.onOurCourses : ""} ${
        isCoursesLanding ? styles.onCoursesLanding : ""
      } ${isContacts ? styles.onContacts : ""} ${
        isAboutBfb ? styles.onAboutBfb : ""
      }`}
      aria-label="Хлібні крихти"
    >
      <div className={styles.breadcrumbsContainer}>
        <ol className={styles.breadcrumbList}>
          {breadcrumbs.map((item, index) => (
            <li key={index} className={styles.breadcrumbItem}>
              {item.href && !item.isActive ? (
                <Link href={item.href} className={styles.breadcrumbLink}>
                  {item.label}
                </Link>
              ) : (
                <span
                  className={`${styles.breadcrumbText} ${
                    item.isActive ? styles.active : ""
                  }`}
                >
                  {item.label}
                </span>
              )}

              {index < breadcrumbs.length - 1 && (
                <span className={styles.separator}>•</span>
              )}
            </li>
          ))}
        </ol>
      </div>
    </nav>
  );
};

export default Breadcrumbs;
