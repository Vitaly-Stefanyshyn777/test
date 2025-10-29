"use client";
import React from "react";
import Image from "next/image";
import s from "./BoardSection.module.css";
import { LegconIcon, ShieldIcon } from "@/components/Icons/Icons";

const BoardSection: React.FC = () => {
  return (
    <section className={s.section}>
      <div className={s.container}>
        <div className={s.titleTextBlock}>
          <p className={s.eyebrow}>Тренування нового покоління</p>
          <h2 className={s.title}>Борд для курсу</h2>
        </div>

        <div className={s.grid}>
          <div className={`${s.card} ${s.card1}`}>
            <div className={s.imageWrap}>
              <Image
                src="/image.png"
                alt="BFB training"
                fill
                className={s.image}
                sizes="344px"
                priority
              />
            </div>
          </div>

          <div className={`${s.card} ${s.card2}`}>
            <p className={s.cardDesc2}>
              Для кращого зчеплення з поверхнею під час інтенсивних вправ.
            </p>
            <div className={s.asset}>
              <Image
                src="/image1.png"
                alt="Антиковзке покриття"
                fill
                className={s.assetImg}
                sizes="360px"
              />
            </div>
          </div>

          <div className={`${s.card} ${s.card3}`}>
            <div className={s.icon} aria-hidden>
              <span>
                <LegconIcon />
              </span>
            </div>
            <div className={s.cardTitleBlock}>
              <h3 className={s.cardTitle}>Захист суглобів під час руху</h3>
              <p className={s.cardDesc}>
                Анатомічно правильна форма вигину, яка забечує комфорт колінам
                та суглобам, але водночас зберігає балансуючу функцію.
              </p>
            </div>
          </div>

          <div className={`${s.card} ${s.card4}`}>
            <p className={s.cardDesc4}>
              Розширює кількість вправ та варіацій навантажень для більш
              ефективного тренування.
            </p>
            <div className={s.asset}>
              <Image
                src="/Frame1321318327.png"
                alt="Еспандер у комплекті"
                fill
                className={s.assetImg}
                sizes="344px"
              />
            </div>
          </div>

          <div className={`${s.card} ${s.card5}`}>
            <div className={s.icon} aria-hidden>
              <span>
                <ShieldIcon />
              </span>
            </div>
            <div className={s.cardTitleBlock}>
              <h3 className={s.cardTitle}>Матеріали та якість виробу</h3>
              <p className={s.cardDesc}>
                Ми використовуємо якісну сировину, що витримує навантаження, не
                деформується і довго служить навіть при щоденному використанні.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default BoardSection;
