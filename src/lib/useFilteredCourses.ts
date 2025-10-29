import { useQuery } from "@tanstack/react-query";
import { fetchCourses } from "./coursesQueries";

interface Course {
  id: string;
  name: string;
  description: string;
  price: string;
  originalPrice?: string;
  image?: string;
  dateCreated?: string;
  rating?: number;
  reviewsCount?: number;
  wcProduct?: {
    prices?: {
      price?: string;
      regular_price?: string;
      sale_price?: string;
    };
    on_sale?: boolean;
    total_sales?: number;
    average_rating?: string;
    featured?: boolean;
  };
  courseData?: unknown;
}

export interface CourseFilters {
  category?: string | string[];
  min_price?: number;
  max_price?: number;
  on_sale?: boolean;
  featured?: boolean;
  search?: string;
}

export function useFilteredCourses(filters: CourseFilters = {}) {
  const stableKey = JSON.stringify(filters);
  const queryKey = ["filteredCourses", stableKey];

  console.log("🔍 [useFilteredCourses] Викликано з фільтрами:", {
    filters,
    stableKey,
    queryKey,
  });

  return useQuery({
    queryKey,
    queryFn: async () => {
      try {
        const courses = (await fetchCourses(filters)) as Course[];

        // Застосовуємо фільтри на клієнті
        let filteredCourses: Course[] = courses;

        if (
          filters.min_price !== undefined &&
          filters.max_price !== undefined
        ) {
          filteredCourses = filteredCourses.filter(
            (course: { price: string }) => {
              const price = parseFloat(course.price);
              return (
                price >= (filters.min_price as number) &&
                price <= (filters.max_price as number)
              );
            }
          );
        }

        if (filters.search) {
          const searchTerm = filters.search.toLowerCase();
          filteredCourses = filteredCourses.filter(
            (course: Course) =>
              course.name.toLowerCase().includes(searchTerm) ||
              course.description.toLowerCase().includes(searchTerm)
          );
        }

        if (filters.on_sale !== undefined) {
          filteredCourses = filteredCourses.filter((course: Course) => {
            return course.wcProduct?.on_sale === filters.on_sale;
          });
        }

        if (filters.featured !== undefined) {
          filteredCourses = filteredCourses.filter((course: Course) => {
            return course.wcProduct?.featured === filters.featured;
          });
        }

        console.log("✅ [useFilteredCourses] Результат фільтрації:", {
          totalCourses: courses.length,
          filteredCourses: filteredCourses.length,
          filters: filters,
        });

        return filteredCourses;
      } catch (error) {
        console.error("[useFilteredCourses] ❌ Помилка запиту:", error);
        throw error;
      }
    },
    enabled: true,
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });
}
