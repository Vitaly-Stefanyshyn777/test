"use client";
import React from "react";
import Image from "next/image";
import SliderNav from "@/components/ui/SliderNav/SliderNavActions";
import styles from "./CourseInstructor.module.css";
import {
  DumbbellsIcon,
  HeartbeatIcon,
  SpineIcon,
  InstagramIcon,
} from "@/components/Icons/Icons";
import { useCourseQuery } from "@/components/hooks/useWpQueries";

interface CourseInstructorProps {
  courseId?: number;
}

const CourseInstructor: React.FC<CourseInstructorProps> = ({
  courseId = 169,
}) => {
  const { data: course, isLoading, error } = useCourseQuery(courseId);

  if (isLoading) {
    return (
      <section className={styles.instructor}>
        <div className={styles.container}>
          <div className={styles.loading}>
            Завантаження інформації про інструктора...
          </div>
        </div>
      </section>
    );
  }

  if (error || !course || !course.course_data.Course_coach) {
    return (
      <section className={styles.instructor}>
        <div className={styles.container}>
          <div className={styles.error}>
            Помилка завантаження інформації про інструктора
          </div>
        </div>
      </section>
    );
  }

  const coach = course.course_data.Course_coach;

  // Парсимо спеціалізацію з JSON string
  const specializations = coach.point_specialization
    ? JSON.parse(coach.point_specialization)
    : ["Спеціаліст", "Супервізор", "Персональний тренер", "Майстер спорту"];

  // Парсимо аватар з JSON string
  const avatarUrl = coach.img_link_avatar
    ? JSON.parse(coach.img_link_avatar)[0]
    : "/images/instructor-lika.jpg";

  return (
    <section className={styles.instructor}>
      <div className={styles.container}>
        <h3 className={styles.sliderTitle}>Хто Вас буде супроводжувати</h3>
        <div className={styles.content}>
          <div className={styles.leftColumn}>
            <div className={styles.titleTextBlock}>
              <div className={styles.titleBlock}>
                <h2 className={styles.title}>{coach.title}</h2>
                <p className={styles.description}>
                  {coach.textarea_description ||
                    "Досвідчений тренер з багаторічним стажем роботи. Спеціалізується на функціональному тренуванні та реабілітації."}
                </p>
              </div>

              <div className={styles.tagsBlock}>
                <p className={styles.tagsBlockTitle}>Спеціалізація:</p>

                <div className={styles.tags}>
                  {specializations.map((spec: string, index: number) => (
                    <span key={index} className={styles.tag}>
                      {spec}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            <div className={styles.stats}>
              <div className={styles.statCard}>
                <div className={styles.statIcon}>
                  <HeartbeatIcon />
                </div>
                <div className={styles.statContent}>
                  <span className={styles.statNumber}>
                    {coach.input_text_experience || "12 років"}
                  </span>
                  <span className={styles.statLabel}>Практичного досвіду</span>
                </div>
              </div>
              <div className={styles.statCard}>
                <div className={styles.statIcon}>
                  <DumbbellsIcon />
                </div>
                <div className={styles.statContent}>
                  <span className={styles.statNumber}>
                    {coach.input_text_count_training || "1000+"}
                  </span>
                  <span className={styles.statLabel}>Проведено тренувань</span>
                </div>
              </div>
              <div className={styles.statCard}>
                <div className={styles.statIcon}>
                  <SpineIcon />
                </div>
                <div className={styles.statContent}>
                  <span className={styles.statNumber}>
                    {coach.input_text_history || "70+"}
                  </span>
                  <span className={styles.statLabel}>Історій</span>
                </div>
              </div>
            </div>

            <div className={styles.sliderSection}>
              <SliderNav
                activeIndex={0}
                dots={3}
                onPrev={() => {}}
                onNext={() => {}}
                onDotClick={() => {}}
              />
            </div>
          </div>

          <div className={styles.rightColumn}>
            <div className={styles.imageContainer}>
              <Image
                src={avatarUrl}
                alt={`${coach.title} - інструктор BFB`}
                width={500}
                height={600}
                className={styles.instructorImage}
                style={{ width: "100%", height: "auto", maxHeight: "none" }}
              />

              {/* Instagram картка поверх фото */}
              {coach.input_text_link_instagram &&
                coach.input_text_text_instagram && (
                  <div className={styles.instagramSection}>
                    <div className={styles.instagramCard}>
                      <div className={styles.instagramIcon}>
                        <InstagramIcon />
                      </div>
                      <div className={styles.instagramContent}>
                        <span className={styles.instagramText}>
                          {coach.input_text_text_instagram}
                        </span>
                      </div>
                    </div>
                  </div>
                )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CourseInstructor;
