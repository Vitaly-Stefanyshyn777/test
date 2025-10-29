"use client";
import React, { useEffect, useState } from "react";
import { СhevronIcon } from "../../Icons/Icons";
import styles from "./QAASection.module.css";
import { useQuery } from "@tanstack/react-query";
import { fetchFAQByCategoryWithLogging, type FaqItem } from "@/lib/bfbApi";

interface QAAItem {
  id: number;
  question: string;
  answer: string;
}

const staticFaqData: QAAItem[] = [
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

interface QAASectionProps {
  categoryId?: number;
  categoryName?: string;
  // Майбутні категорії
  categoryType?: "main" | "boards" | "course" | "training" | "coach";
}

const QAASection: React.FC<QAASectionProps> = ({
  categoryId,
  categoryName,
  categoryType,
}) => {
  const [expandedItems, setExpandedItems] = useState<number[]>([]);
  const [qaItems, setQaItems] = useState<QAAItem[]>(staticFaqData);

  // Визначаємо ID категорії на основі типу
  const getCategoryId = () => {
    if (categoryId) return categoryId;

    switch (categoryType) {
      case "main":
        return 69;
      case "boards":
        return 70;
      case "course":
        return 71; // Майбутня категорія
      case "training":
        return 72; // Майбутня категорія
      case "coach":
        return 73; // Майбутня категорія
      default:
        return undefined;
    }
  };

  const effectiveCategoryId = getCategoryId();

  // Визначаємо назву категорії
  const getCategoryName = () => {
    if (categoryName) return categoryName;

    switch (categoryType) {
      case "main":
        return "Головна";
      case "boards":
        return "Борди";
      case "course":
        return "Курси";
      case "training":
        return "Тренування";
      case "coach":
        return "Тренери";
      default:
        return undefined;
    }
  };

  const effectiveCategoryName = getCategoryName();

  const { data } = useQuery({
    queryKey: ["qaa", effectiveCategoryId, categoryType],
    queryFn: () => fetchFAQByCategoryWithLogging(effectiveCategoryId),
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });

  useEffect(() => {
    if (!data) return;
    if (Array.isArray(data) && data.length > 0) {
      const mapped: QAAItem[] = (data as FaqItem[]).map((it) => ({
        id: it.id,
        question: it.title?.rendered || "",
        answer: (it.content?.rendered || "").replace(/<[^>]*>/g, ""),
      }));
      setQaItems(mapped);
    } else {
      setQaItems(staticFaqData);
    }
  }, [data]);

  const toggleItem = (id: number) => {
    setExpandedItems((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  return (
    <section className={styles.faqSection}>
      <div className={styles.container}>
        <div className={styles.contentBlock}>
          <div className={styles.contentTextBlock}>
            <h2 className={styles.title}>
              {effectiveCategoryName
                ? `Часті питання: ${effectiveCategoryName}`
                : "Часті питання та відповіді"}
            </h2>
          </div>

          <div className={styles.content}>
            <div className={styles.rightColumn}>
              <div className={styles.faqList}>
                {qaItems.map((item) => (
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
                      <span className={styles.question}>{item.question}</span>
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
                      <div className={styles.answer}>{item.answer}</div>
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

export default QAASection;
