"use client";
import React from "react";
import styles from "./CoursesGrid.module.css";
import CourseCard from "../CourseCard/CourseCard";
import { useCoursesQuery } from "@/lib/coursesQueries";

const CoursesGrid = () => {
  const { data: courses = [], isLoading, isError } = useCoursesQuery();

  console.log("[CoursesGrid] 🎯 Отримано курсів:", courses.length);
  console.log(
    "[CoursesGrid] 📊 Перший курс:",
    courses[0]
      ? {
          id: courses[0].id,
          name: courses[0].name,
          price: courses[0].price,
          image: courses[0].image,
          courseData: courses[0].courseData,
        }
      : "Немає курсів"
  );

  if (isLoading) {
    return <div className={styles.loading}>Завантаження курсів...</div>;
  }

  if (isError) {
    return <div className={styles.error}>Помилка завантаження курсів</div>;
  }

  return (
    <div className={styles.productsGridContainer}>
      <div className={styles.productsGrid}>
        {courses.map(
          (course: {
            id: string;
            name: string;
            image?: string;
            price?: number;
            courseData?: { excerpt?: { rendered: string } } | undefined;
          }) => {
            return (
              <CourseCard
                key={course.id}
                id={course.id}
                name={course.name}
                image={course.image}
                price={course.price}
                courseData={course.courseData}
              />
            );
          }
        )}
      </div>
    </div>
  );
};

export default CoursesGrid;
