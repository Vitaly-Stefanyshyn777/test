"use client";
import React from "react";
import Image from "next/image";
import s from "./Hero.module.css";
import { TimeIcon } from "@/components/Icons/Icons";
import Link from "next/link";

const Hero: React.FC = () => {
  return (
    <section className={s.hero}>
      <div className={s.container}>
        <div className={s.infoBlock}>
          <div className={s.imageContent}>
            <Image
              src="/images/Frame-1321318490.png"
              alt="Як проходить навчання"
              width={500}
              height={600}
              className={s.courseImage}
            />
          </div>
          <div className={s.textContent}>
            <div className={s.badgeContainer}>
              <div className={s.badgeBlock}>
                <span className={s.badge}>
                  <TimeIcon />
                  <p className={s.badgeText}> окупність за 1 місяць</p>
                </span>

                <h2 className={s.title}>
                  Стань новим
                  <br />
                  сертифікованим тренером
                </h2>
              </div>

              <p className={s.description}>
                Авторська навчальна програма для тренерів, які хочуть працювати
                за методикою BFB. Системне навчання, сертифікація, інвентар і
                підтримка після курсу – усе, щоб почати новий напрям без зайвих
                кроків.
              </p>
            </div>
            <div className={s.buttonsContainer}>
              <Link href="/courses/instructor-4-0" className={s.detailsBtn}>
                Обрати курс
              </Link>
              <Link
                href="/courses/instructor-4-0"
                className={s.detailsBtLowern}
              >
                Переглянути тарифи
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
