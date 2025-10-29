import { useQuery } from "@tanstack/react-query";

interface CourseFilters {
  category?: string | string[];
  search?: string;
  min_price?: number;
  max_price?: number;
  on_sale?: boolean;
  featured?: boolean;
}

// Функція для отримання курсів з WooCommerce API
// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const fetchCourses = async (filters: CourseFilters = {}) => {
  // filters поки що не використовується, але може бути додано в майбутньому
  try {
    // Отримуємо курси з WooCommerce API - фільтруємо тільки курси (категорія 72)
    const wcResponse = await fetch(
      "/api/wc/v3/products?category=72&per_page=100"
    );
    if (!wcResponse.ok) {
      throw new Error("Failed to fetch courses from WooCommerce");
    }
    const wcCourses = await wcResponse.json();

    // Показуємо всі курси з WooCommerce (без залежності від WordPress)
    const coursesWithData = wcCourses;

    // Мапимо курси з WooCommerce API
    const mappedCourses = coursesWithData.map(
      (wcCourse: Record<string, unknown>) => {
        return {
          id: (wcCourse.id as string).toString(),
          name: (wcCourse.name as string) || "Курс",
          description: (wcCourse.description as string) || "",
          // Використовуємо ціни з WooCommerce API (в копійках)
          price:
            (wcCourse.sale_price as string) ||
            (wcCourse.regular_price as string) ||
            "5000",
          originalPrice: (wcCourse.regular_price as string) || "7000",
          // Використовуємо зображення з WooCommerce API
          image:
            ((
              (wcCourse.images as Record<string, unknown>[])?.[0] as Record<
                string,
                unknown
              >
            )?.src as string) || "/placeholder.svg",
          courseData: null, // Поки що без course_data
          dateCreated: (wcCourse.date_created as string) || "",
          rating: 5,
          reviewsCount: 235,
          // Додаємо WooCommerce дані для динамічної логіки
          wcProduct: {
            prices: {
              price:
                (wcCourse.sale_price as string) ||
                (wcCourse.regular_price as string),
              regular_price: wcCourse.regular_price as string,
              sale_price: wcCourse.sale_price as string,
            },
            on_sale: (wcCourse.on_sale as boolean) || false,
            total_sales: (wcCourse.total_sales as number) || 0,
            average_rating: (wcCourse.average_rating as string) || "0",
            featured: (wcCourse.featured as boolean) || false,
          },
        };
      }
    );

    console.log("[coursesQueries] 🎯 Мапінг курсів:", mappedCourses.length);
    console.log(
      "[coursesQueries] 📊 WooCommerce курси (категорія 72):",
      wcCourses.length
    );
    console.log("[coursesQueries] 📊 Перший курс:", mappedCourses[0]);
    console.log(
      "[coursesQueries] 💰 WooCommerce дані:",
      mappedCourses[0]?.wcProduct
    );

    return mappedCourses;
  } catch (error) {
    console.error("Error fetching courses:", error);
    throw error;
  }
};

export const coursesQuery = (filters: CourseFilters = {}) => ({
  queryKey: ["courses", filters] as const,
  queryFn: () => fetchCourses(filters),
  staleTime: 5 * 60 * 1000,
  retry: 1,
});

export const useCoursesQuery = (filters: CourseFilters = {}) => {
  return useQuery(coursesQuery(filters));
};

// Функція для отримання конкретного курсу
export const fetchCourse = async (courseId: number) => {
  try {
    // Отримуємо курс з WooCommerce API
    const wcResponse = await fetch(`/api/wc/v3/products/${courseId}`);
    if (!wcResponse.ok) {
      throw new Error("Failed to fetch course from WooCommerce");
    }
    const wcCourse = await wcResponse.json();

    // Мапимо курс з WooCommerce API
    const mappedCourse = {
      id: wcCourse.id.toString(),
      name: wcCourse.name || "Курс",
      description: wcCourse.description || "",
      // Використовуємо ціни з WooCommerce API (в копійках)
      price: wcCourse.sale_price || wcCourse.regular_price || "5000",
      originalPrice: wcCourse.regular_price || "7000",
      // Використовуємо зображення з WooCommerce API
      image: wcCourse.images?.[0]?.src || "/placeholder.svg",
      courseData: null,
      dateCreated: wcCourse.date_created || "",
      rating: 5,
      reviewsCount: 235,
      // Додаємо WooCommerce дані для динамічної логіки
      wcProduct: {
        prices: {
          price: wcCourse.sale_price || wcCourse.regular_price,
          regular_price: wcCourse.regular_price,
          sale_price: wcCourse.sale_price,
        },
        on_sale: wcCourse.on_sale || false,
        total_sales: wcCourse.total_sales || 0,
        average_rating: wcCourse.average_rating || "0",
        featured: wcCourse.featured || false,
      },
    };

    console.log("[coursesQueries] 🎯 Отримано курс:", mappedCourse);
    return mappedCourse;
  } catch (error) {
    console.error("Error fetching course:", error);
    throw error;
  }
};

export const courseQuery = (courseId: number) => ({
  queryKey: ["course", courseId] as const,
  queryFn: () => fetchCourse(courseId),
  staleTime: 5 * 60 * 1000,
  retry: 1,
});

export const useCourseQuery = (courseId: number) => {
  return useQuery(courseQuery(courseId));
};
