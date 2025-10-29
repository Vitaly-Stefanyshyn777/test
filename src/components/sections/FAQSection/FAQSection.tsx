"use client";
import React, { useState, useEffect } from "react";
import Image from "next/image";
import { СhevronIcon } from "../../Icons/Icons";
import styles from "./FAQSection.module.css";
import { fetchFAQByCategoryWithLogging, FaqItem } from "@/lib/bfbApi";
import { useQuery } from "@tanstack/react-query";

// Fallback data for when API fails
const fallbackFAQData = [
  {
    id: 1,
    question: "Чи можу я купити борд, якщо ще не проходив(-ла) навчання?",
    answer:
      "Так, ви можете придбати борд незалежно від проходження навчання. Однак ми рекомендуємо спочатку пройти базовий курс для безпечного та ефективного використання обладнання.",
  },
  {
    id: 2,
    question: "Які умови доставки?",
    answer:
      "Ми пропонуємо безкоштовну доставку по Україні для замовлень від 1500 грн. Доставка здійснюється протягом 1-3 робочих днів. Для міжнародних замовлень умови уточнюються індивідуально.",
  },
  {
    id: 3,
    question: "Чи підходить борд для домашнього використання?",
    answer:
      "Абсолютно! BFB борди спеціально розроблені для домашнього використання. Вони компактні, безпечні та не потребують додаткового обладнання. В комплекті йде детальна інструкція з вправами.",
  },
  {
    id: 4,
    question: "З якого віку можна займатися на борді?",
    answer:
      "Борди підходять для осіб від 16 років. Для дітей молодшого віку рекомендуємо занятся під наглядом дорослих або інструктора. Максимальна вага користувача - 120 кг.",
  },
  {
    id: 5,
    question: "Чи витримує борд велику вагу?",
    answer:
      "Так, наші борди витримують навантаження до 120 кг. Вони виготовлені з високоякісних матеріалів та пройшли всі необхідні тести на міцність та безпеку.",
  },
];

const FAQSection = () => {
  const [expandedItems, setExpandedItems] = useState<number[]>([]);
  const [faqData, setFaqData] = useState<FaqItem[]>([]);
  const [isUsingFallback, setIsUsingFallback] = useState(false);

  const { data, isLoading, isError } = useQuery({
    queryKey: ["faq"],
    queryFn: () => fetchFAQByCategoryWithLogging(),
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });

  useEffect(() => {
    if (!data) return;
    if (Array.isArray(data) && data.length > 0) {
      setFaqData(data);
      setIsUsingFallback(false);
    } else {
      setFaqData(
        fallbackFAQData.map((item) => ({
          id: item.id,
          title: { rendered: item.question },
          content: { rendered: item.answer },
        }))
      );
      setIsUsingFallback(true);
    }
  }, [data]);

  const toggleItem = (id: number) => {
    console.log("[FAQSection] 🔄 Перемикаю FAQ елемент:", id);
    setExpandedItems((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  return (
    <section className={styles.faqSection}>
      <div className={styles.container}>
        <div className={styles.contentBlock}>
          <div className={styles.contentTextBlock}>
            <p className={styles.subtitle}>Відповіді від Ліки</p>
            <h2 className={styles.title}>Часті питання та відповіді</h2>
            {isUsingFallback && (
              <div className={styles.fallbackIndicator}>
                <p>📋 Використовуються базові питання</p>
              </div>
            )}
          </div>

          <div className={styles.content}>
            <div className={styles.leftColumn}>
              <div className={styles.titleContainer}></div>
              <div className={styles.imageContainer}>
                <Image
                  src="/images/Frame 1321318485.png"
                  alt="Дівчина на балансборді"
                  width={562}
                  height={465}
                  className={styles.heroImage}
                  onLoad={() =>
                    console.log(
                      "[FAQSection] 🖼️ Зображення завантажено успішно"
                    )
                  }
                  onError={(e) => {
                    console.error(
                      "[FAQSection] ❌ Помилка завантаження зображення:",
                      e
                    );
                    console.log(
                      "[FAQSection] 🔄 Спробую альтернативне зображення"
                    );
                  }}
                  priority={false}
                />
              </div>
            </div>

            <div className={styles.rightColumn}>
              <div className={styles.faqList}>
                {isLoading && (
                  <div className={styles.loading}>
                    <p>Завантаження FAQ...</p>
                  </div>
                )}

                {isError && (
                  <div className={styles.error}>
                    <p>Не вдалося завантажити FAQ</p>
                  </div>
                )}

                {!isLoading && faqData.length === 0 && !isError && (
                  <div className={styles.empty}>
                    <p>FAQ не знайдено</p>
                  </div>
                )}

                {faqData.map((item) => (
                  <div
                    key={item.id}
                    className={`${styles.faqItem} ${
                      expandedItems.includes(item.id) ? styles.expanded : ""
                    }`}
                  >
                    <button
                      className={styles.faqButton}
                      onClick={() => toggleItem(item.id)}
                      aria-expanded={expandedItems.includes(item.id)}
                    >
                      <span className={styles.question}>
                        {item.title?.rendered || "Питання"}
                      </span>
                      <span
                        className={`${styles.chevron} ${
                          expandedItems.includes(item.id) ? styles.rotated : ""
                        }`}
                      >
                        <СhevronIcon />
                      </span>
                    </button>

                    <div
                      className={`${styles.answerContainer} ${
                        expandedItems.includes(item.id) ? styles.open : ""
                      }`}
                    >
                      <div
                        className={styles.answer}
                        dangerouslySetInnerHTML={{
                          __html: item.content?.rendered || "Відповідь",
                        }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FAQSection;
