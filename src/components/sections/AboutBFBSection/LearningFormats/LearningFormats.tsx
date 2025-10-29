"use client";
import React, { useEffect, useMemo, useState } from "react";
import s from "./LearningFormats.module.css";
import {
  Check2Icon,
  MicrophoneIcon,
  CheckBorderIcon,
  HeadphonesSupport,
  WeightIcon,
} from "@/components/Icons/Icons";
import { fetchMainCourses, MainCoursePost } from "@/lib/bfbApi";
import TrenersModal from "@/components/auth/TrenersModal";

type Benefit = { text: string };

const offlineAll: Benefit[] = [
  { text: "8 годин практиктики та теорії" },
  { text: "Практика з бордом під наглядом" },
  { text: "Доступ до матеріалів під час курсу" },
  { text: "13 навчально-методичних уроків" },
  { text: "7 тренувань для щоденної роботи з BFB" },
  { text: "8 годин практиктики та теорії" },
];

const offlineBenefitsBottom = [
  { text: "Підтримку від команди та менторів", icon: <HeadphonesSupport /> },
  { text: "Офіційний сертифікат від BFB", icon: <CheckBorderIcon /> },
  { text: "Право тренувати від бренду", icon: <WeightIcon /> },
  {
    text: "Просування напряму через сайт і соцмережі",
    icon: <MicrophoneIcon />,
  },
];

const onlineBenefitsTop: Benefit[] = [
  { text: "Навчання в зручному темпі" },
  { text: "13 теоретичних і практичних уроків" },
  { text: "7 тренувань для роботи" },
  { text: "Zoom-зустрічі з засновницею напряму" },
  { text: "Доступ до всіх матеріалів після курсу" },
  { text: "Спільнота підтримки у Telegram" },
];

const onlineResults = [
  { text: "Підтримку від команди та менторів", icon: <MicrophoneIcon /> },
  { text: "Офіційний сертифікат від BFB", icon: <CheckBorderIcon /> },
  { text: "Право тренувати від бренду", icon: <HeadphonesSupport /> },
  { text: "Просування напряму через сайт і соцмережі", icon: <WeightIcon /> },
];

export default function LearningFormats() {
  const [courses, setCourses] = useState<MainCoursePost[]>([]);
  const [, setLoading] = useState(false);
  const [, setError] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await fetchMainCourses();
        console.log("[MainCourses] response:", data);
        setCourses(data);
      } catch {
        setError("Не вдалося завантажити курси формату");
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const offline = useMemo(() => {
    return courses.find((c) => String(c.acf?.Is_online) !== "1");
  }, [courses]);
  const online = useMemo(() => {
    return courses.find((c) => String(c.acf?.Is_online) === "1");
  }, [courses]);
  const splitIntoTwo = (
    items: Benefit[],
    leftCount = Math.ceil(items.length / 2)
  ) => {
    return [items.slice(0, leftCount), items.slice(leftCount)];
  };

  const [offlineCol1] = splitIntoTwo(offlineAll, 3);
  const [onlineCol1] = splitIntoTwo(onlineBenefitsTop);
  return (
    <section className={s.section}>
      <div className={s.container}>
        <div className={s.header}>
          <span className={s.subtitle}>Формати навчання</span>
          <h2 className={s.title}>Який формат обрати?</h2>
        </div>

        <div className={s.cards}>
          <div className={s.card}>
            <div className={s.cardImage1}>
              <h3 className={s.cardBadge}>ОФЛАЙН КУРС BFB</h3>
            </div>

            <div className={s.cardBody}>
              <div className={s.cardListСontainer}>
                <div className={s.cardListBlock}>
                  <div className={s.cardListTitle}>Про курс:</div>
                  <p className={s.cardListText}>
                    {offline?.acf?.About?.trim()
                      ? offline.acf.About
                      : "Дані є, але пусті (About офлайн)"}
                  </p>
                </div>
                <div className={s.cardListBlock}>
                  <div className={s.list}>
                    <ul className={s.listColumn}>
                      {(
                        offline?.acf?.What_learn ||
                        offlineCol1.map((b) => b.text)
                      )
                        .slice(0, 3)
                        .map((txt, i) => (
                          <li key={`ol1-${i}`} className={s.listItem}>
                            <div className={s.listItemIcon}>
                              <Check2Icon />
                            </div>
                            <p className={s.listItemText}>
                              {typeof txt === "string" ? txt : String(txt)}
                            </p>
                          </li>
                        ))}
                    </ul>
                    <ul className={s.listColumn}>
                      {(
                        offline?.acf?.What_learn ||
                        offlineAll.map((b) => b.text)
                      )
                        .slice(3)
                        .map((txt, i) => (
                          <li key={`ol2-${i}`} className={s.listItem}>
                            <div className={s.listItemIcon}>
                              <Check2Icon />
                            </div>
                            {typeof txt === "string" ? txt : String(txt)}
                          </li>
                        ))}
                    </ul>
                  </div>
                </div>

                <div className={s.cardListBlock}>
                  <div className={s.cardListTitle}>Результат:</div>
                  <ul className={s.pills}>
                    {(offline?.acf?.Course_include &&
                    offline.acf.Course_include.length
                      ? offline.acf.Course_include.map((t) => ({ text: t }))
                      : offlineBenefitsBottom
                    ).map((b, i) => (
                      <li key={i} className={s.pill}>
                        <div className={s.pillIcon}>
                          {(b as { icon?: React.ReactNode }).icon ?? (
                            <CheckBorderIcon />
                          )}
                        </div>
                        {typeof (b as { text?: string | number }).text ===
                        "string"
                          ? (b as { text: string }).text
                          : String((b as { text: string | number }).text)}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <div className={s.cardFooter}>
                <div className={s.priceWrap}>
                  <span className={s.priceFrom}>від</span>
                  <span className={s.price}>
                    {offline?.acf?.Price
                      ? String(offline.acf.Price) + "₴"
                      : "—"}
                  </span>
                  <span className={s.priceOld}>
                    {offline?.acf?.Price_old
                      ? String(offline.acf.Price_old) + "₴"
                      : "—"}
                  </span>
                </div>
                <button
                  className={s.button}
                  onClick={() => setIsModalOpen(true)}
                >
                  Обрати курс
                </button>
              </div>
            </div>
          </div>

          <div className={s.card}>
            <div className={s.cardImage2}>
              <h3 className={s.cardBadge}>ОНЛАЙН КУРС BFB</h3>
            </div>

            <div className={s.cardBody}>
              <div className={s.cardListСontainer}>
                <div className={s.cardListBlock}>
                  <div className={s.cardListTitle}>Про курс:</div>
                  <p className={s.cardListText}>
                    {online?.acf?.About?.trim()
                      ? online.acf.About
                      : "Дані є, але пусті (About онлайн)"}
                  </p>
                </div>
                <div className={s.cardListBlock}>
                  <div className={s.list}>
                    <ul className={s.listColumn}>
                      {(
                        online?.acf?.What_learn || onlineCol1.map((b) => b.text)
                      )
                        .slice(0, 3)
                        .map((txt, i) => (
                          <li key={`on1-${i}`} className={s.listItem}>
                            <div className={s.listItemIcon}>
                              <Check2Icon />
                            </div>
                            <p className={s.listItemText}>
                              {typeof txt === "string" ? txt : String(txt)}
                            </p>
                          </li>
                        ))}
                    </ul>
                    <ul className={s.listColumn}>
                      {(
                        online?.acf?.What_learn ||
                        onlineBenefitsTop.map((b) => b.text)
                      )
                        .slice(3)
                        .map((txt, i) => (
                          <li key={`on2-${i}`} className={s.listItem}>
                            <div className={s.listItemIcon}>
                              <Check2Icon />
                            </div>
                            <p className={s.listItemText}>
                              {typeof txt === "string" ? txt : String(txt)}
                            </p>
                          </li>
                        ))}
                    </ul>
                  </div>
                </div>

                <div className={s.cardListBlock}>
                  <div className={s.cardListTitle}>Результат:</div>
                  <ul className={s.pills}>
                    {(online?.acf?.Course_include &&
                    online.acf.Course_include.length
                      ? online.acf.Course_include.map((t) => ({ text: t }))
                      : onlineResults
                    ).map((b, i) => (
                      <li key={i} className={s.pill}>
                        <div className={s.pillIcon}>
                          {(b as { icon?: React.ReactNode }).icon ?? (
                            <CheckBorderIcon />
                          )}
                        </div>
                        {typeof (b as { text?: string | number }).text ===
                        "string"
                          ? (b as { text: string }).text
                          : String((b as { text: string | number }).text)}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <div className={s.cardFooter}>
                <div className={s.priceWrap}>
                  <span className={s.priceFrom}>від</span>
                  <span className={s.price}>
                    {online?.acf?.Price ? String(online.acf.Price) + "₴" : "—"}
                  </span>
                  <span className={s.priceOld}>
                    {online?.acf?.Price_old
                      ? String(online.acf.Price_old) + "₴"
                      : "—"}
                  </span>
                </div>
                <button
                  className={s.button}
                  onClick={() => setIsModalOpen(true)}
                >
                  Обрати курс
                </button>
              </div>
            </div>
          </div>
        </div>
        {isModalOpen && (
          <TrenersModal
            isOpen={isModalOpen}
            onClose={() => setIsModalOpen(false)}
          />
        )}
      </div>
    </section>
  );
}
