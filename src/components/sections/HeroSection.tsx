import React from "react";
import Link from "next/link";
import s from "./HeroSection.module.css";
import { ArrowLeftIcon, ArrowRightIcon, TimePayIcon } from "../Icons/Icons";

const HeroSection = () => {
  return (
    <section className={s.hero} data-hero-section>
      <div className={s.heroContainer}>
        <div className={s.heroContent}>
          <div className={s.heroContentBlock}>
            <div className={s.roiBanner}>
              <div className={s.roiIcon}>
                <div className={s.roiIcon}>
                  <TimePayIcon />
                </div>
              </div>
              <span className={s.roiText}>ОКУПНІСТЬ ЗА 1 МІСЯЦЬ</span>
            </div>

            <h1 className={s.heroTitle}>
              СТАНЬ НОВИМ СЕРТИФІКОВАНИМ ТРЕНЕРОМ BFB
            </h1>

            <p className={s.heroDescription}>
              Відкрий для себе нові горизонти у фітнесі та стань провідником у
              світ <br /> балансу, сили та інновацій
            </p>
          </div>

          <div className={s.heroActions}>
            <Link href="/course" className={s.heroButtonPrimary}>
              Про курс
            </Link>
            <Link href="/instructors" className={s.heroButtonSecondary}>
              Знайти інструктора
            </Link>
          </div>
        </div>
      </div>
      <div className={s.heroNavigation}>
        <button className={s.navArrow} aria-label="Попередній слайд">
          <ArrowLeftIcon />
        </button>
        <div className={s.navDots}>
          <span className={`${s.navDot} ${s.navDotActive}`}></span>
          <span className={s.navDot}></span>
          <span className={s.navDot}></span>
          <span className={s.navDot}></span>
        </div>
        <button className={s.navArrow} aria-label="Наступний слайд">
          <ArrowRightIcon />
        </button>
      </div>
    </section>
  );
};

export default HeroSection;
