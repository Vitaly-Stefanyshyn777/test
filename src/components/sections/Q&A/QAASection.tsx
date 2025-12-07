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
  const [qaItems, setQaItems] = useState<QAAItem[]>([]);

  // Визначаємо ID категорії на основі типу
  const getCategoryId = () => {
    if (categoryId) return categoryId;

    switch (categoryType) {
      case "main":
        return 69; // Головна
      case "boards":
        return 70; // Борди
      case "course":
        return 90; // Курси
      case "training":
        return 91; // Навчання
      case "coach":
        return 92; // Тренерство
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
        return "Навчання";
      case "coach":
        return "Тренерство";
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
      const mapped: QAAItem[] = (data as FaqItem[]).map((it) => {
        const answer = it.Answer || it.content?.rendered || "";
        const cleanAnswer = answer.replace(/<[^>]*>/g, "");
        
        return {
          id: it.id,
          question: it.Question || it.title?.rendered || "",
          answer: cleanAnswer,
        };
      });
      
      setQaItems(mapped);
    } else {
      // Якщо немає даних - показуємо порожній список
      setQaItems([]);
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
