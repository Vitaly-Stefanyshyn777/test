"use client";
import React from "react";
import styles from "./CourseHero.module.css";
import {
  СalendarIcon,
  СlockIcon,
  GlobeIcon,
  NotGlobeIcon,
} from "@/components/Icons/Icons";
import { useCourseQuery } from "@/components/hooks/useWpQueries";
import { CourseData } from "@/lib/bfbApi";

interface CourseHeroProps {
  courseId?: number;
}

const CourseHero: React.FC<CourseHeroProps> = ({ courseId = 169 }) => {
  const { data: course, isLoading, error } = useCourseQuery(courseId);

  if (isLoading) {
    return (
      <section className={styles.hero}>
        <div className={styles.courseContentBlock}>
          <div className={styles.loading}>Завантаження...</div>
        </div>
      </section>
    );
  }

  if (error || !course) {
    return (
      <section className={styles.hero}>
        <div className={styles.courseContentBlock}>
          <div className={styles.error}>Помилка завантаження курсу</div>
        </div>
      </section>
    );
  }
  return (
    <section className={styles.hero}>
      <div className={styles.courseContentBlock}>
        <div className={styles.tagsCodeBlock}>
          <div className={styles.tags}>
            <div className={styles.tag}>
              <div className={styles.tagIcon}>
                <СalendarIcon />
              </div>
              <p className={styles.tagText}>
                {course.course_data.Date_start || "Старт 15 вересня"}
              </p>
            </div>
            <div className={styles.tag}>
              <div className={styles.tagIcon}>
                <СlockIcon />
              </div>
              <p className={styles.tagText}>
                {course.course_data.Duration || "3 місяці"}
              </p>
            </div>
            <div className={styles.tag}>
              <div className={styles.tagIcon}>
                <GlobeIcon />
              </div>
              <p className={styles.tagText}>Online</p>
            </div>
            <div className={styles.tag}>
              <NotGlobeIcon />
              <p className={styles.tagText}>Offline</p>
            </div>
          </div>
          <div className={styles.courseCode}>
            <p className={styles.courseCodeText}>Код курсу:</p>
            <p className={styles.courseCodeNumber}>{course.id}</p>
          </div>
        </div>
        <h1 className={styles.title}>
          {course.title.rendered.replace(/____FULL____/g, "")}
        </h1>
        <div className={styles.tagsCodeContainer}>
          <div className={styles.description}>
            <div
              dangerouslySetInnerHTML={{ __html: course.content.rendered }}
            />
          </div>
        </div>
      </div>
      <div className={styles.topicsSection}>
        <h3>ЯКІ ТЕМИ ПОКРИВАЄ КУРС:</h3>
        <div className={styles.topicsGrid}>
          {course.course_data.Course_themes.map((theme, index) => (
            <div key={index} className={styles.topicTag}>
              <p className={styles.topicText}>{theme}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default CourseHero;
