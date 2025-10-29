"use client";
import React, { useMemo, useState, useRef, useEffect } from "react";
import Link from "next/link";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination } from "swiper/modules";
import type { SwiperRef } from "swiper/react";
import { useCoursesQuery } from "@/lib/coursesQueries";
import CourseCard from "../CourseCard/CourseCard";
import SliderNav from "@/components/ui/SliderNav/SliderNavActions";
import s from "./CoursesShowcase.module.css";

import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

const CoursesShowcase: React.FC = () => {
  const { data: courses = [], isLoading, isError } = useCoursesQuery();
  const swiperRef = useRef<SwiperRef>(null);
  const [activeIndex, setActiveIndex] = useState(0);

  const list = useMemo(
    () => (Array.isArray(courses) ? courses : []),
    [courses]
  );

  const displayedCourses = list;

  useEffect(() => {
    console.log("Component mounted, swiperRef:", swiperRef.current);
    if (swiperRef.current?.swiper) {
      console.log("Swiper instance found:", swiperRef.current.swiper);
    }
  }, [displayedCourses]);

  const handlePrev = () => {
    console.log("handlePrev called", swiperRef.current);
    if (swiperRef.current?.swiper) {
      console.log("Swiper found, calling slidePrev");
      swiperRef.current.swiper.slidePrev();
    } else {
      console.log("Swiper not found, trying direct DOM access");

      const swiperEl = document.querySelector(`.${s.swiper}`) as HTMLElement & {
        swiper?: {
          slidePrev: () => void;
          slideNext: () => void;
          slideTo: (index: number) => void;
        };
      };
      if (swiperEl && swiperEl.swiper) {
        console.log("Found swiper via DOM");
        swiperEl.swiper.slidePrev();
      } else {
        console.log("No swiper found in DOM either");
      }
    }
  };

  const handleNext = () => {
    console.log("handleNext called", swiperRef.current);
    if (swiperRef.current?.swiper) {
      const swiper = swiperRef.current.swiper;
      console.log("Swiper found, calling slideNext");
      console.log("Current active index:", swiper.activeIndex);
      console.log("Total slides:", swiper.slides.length);
      console.log("Can slide next:", swiper.allowSlideNext);
      console.log("Is end:", swiper.isEnd);
      console.log("Is beginning:", swiper.isBeginning);

      swiper.slideNext();
    } else {
      console.log("Swiper not found, trying direct DOM access");

      const swiperEl = document.querySelector(`.${s.swiper}`) as HTMLElement & {
        swiper?: {
          slidePrev: () => void;
          slideNext: () => void;
          slideTo: (index: number) => void;
        };
      };
      if (swiperEl && swiperEl.swiper) {
        console.log("Found swiper via DOM");
        swiperEl.swiper.slideNext();
      } else {
        console.log("No swiper found in DOM either");
      }
    }
  };

  const handleDotClick = (index: number) => {
    console.log("handleDotClick called", index, swiperRef.current);
    if (swiperRef.current?.swiper) {
      console.log("Swiper found, calling slideTo", index);

      swiperRef.current.swiper.slideToLoop(index);
    } else {
      console.log("Swiper not found, trying direct DOM access");

      const swiperEl = document.querySelector(`.${s.swiper}`) as HTMLElement & {
        swiper?: {
          slidePrev: () => void;
          slideNext: () => void;
          slideTo: (index: number) => void;
          slideToLoop: (index: number) => void;
        };
      };
      if (swiperEl && swiperEl.swiper) {
        console.log("Found swiper via DOM");
        swiperEl.swiper.slideToLoop(index);
      } else {
        console.log("No swiper found in DOM either");
      }
    }
  };

  if (isLoading) {
    return (
      <section className={s.section}>
        <div className={s.container}>
          <div className={s.header}>
            <div className={s.headerLeft}>
              <p className={s.eyebrow}>Початок навчання</p>
              <h2 className={s.title}>Почни свій шлях з BFB тут</h2>
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
              <p className={s.eyebrow}>Початок навчання</p>
              <h2 className={s.title}>Почни свій шлях з BFB тут</h2>
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
              console.log("Slide changed to:", sw.activeIndex);
              const realIndex = sw.realIndex;
              console.log("Real index:", realIndex);
              setActiveIndex(realIndex);
            }}
            onSwiper={(swiper) => {
              console.log("Swiper initialized:", swiper);
              console.log("Total slides:", swiper.slides.length);
              console.log("Can slide next:", swiper.allowSlideNext);
              console.log("Can slide prev:", swiper.allowSlidePrev);
            }}
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
            {displayedCourses.map((course) => (
              <SwiperSlide key={course.id} className={s.slide}>
                <CourseCard
                  id={course.id}
                  name={course.name}
                  description={course.description}
                  price={
                    typeof course.price === "string"
                      ? parseInt(course.price)
                      : course.price || 5000
                  }
                  originalPrice={
                    typeof course.originalPrice === "string"
                      ? parseInt(course.originalPrice)
                      : course.originalPrice || 7000
                  }
                  isNew={true}
                  isHit={true}
                  isFavorite={false}
                  image={course.image}
                  rating={5}
                  reviewsCount={235}
                  requirements="Для проходження потрібен борд"
                  subscriptionDiscount={20}
                  courseData={course.courseData}
                />
              </SwiperSlide>
            ))}
          </Swiper>
        </div>

        <div className={s.footer}>
          <Link href="/courses" className={s.allCoursesBtn}>
            До усіх курсів
          </Link>
        </div>
      </div>
    </section>
  );
};

export default CoursesShowcase;
