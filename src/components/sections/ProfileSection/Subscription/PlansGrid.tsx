"use client";

import React, { useEffect, useState } from "react";
import styles from "./Subscription.module.css";
import { Сheck2Icon, СheckIcon } from "@/components/Icons/Icons";
import { fetchTariffs, Tariff } from "@/lib/bfbApi";

export default function PlansGrid() {
  const [tariffs, setTariffs] = useState<Tariff[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      try {
        setIsLoading(true);
        const data = await fetchTariffs();
        setTariffs(data);
      } catch (err) {
        console.error("[PlansGrid] Error:", err);
        setError("Не вдалося завантажити тарифи");
      } finally {
        setIsLoading(false);
      }
    })();
  }, []);

  if (isLoading) {
    return (
      <div className={styles.availablePlans}>
        <h2 className={styles.sectionTitle}>Доступні тарифи</h2>
        <div className={styles.loading}>Завантаження...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={styles.availablePlans}>
        <h2 className={styles.sectionTitle}>Доступні тарифи</h2>
        <div className={styles.error}>{error}</div>
      </div>
    );
  }

  return (
    <>
      <div className={styles.availablePlans}>
        <h2 className={styles.sectionTitle}>Доступні тарифи</h2>
        <div className={styles.plansGridContainer}>
          <div className={styles.plansContainer}>
            <div className={styles.plansGrid}>
              {tariffs.slice(0, 2).map((tariff, index) => {
                const isPopular = index === 1; // Оптимальний тариф (другий в списку)
                const totalPrice =
                  parseInt(tariff.Price) * parseInt(tariff.Time);

                return (
                  <div
                    key={tariff.id}
                    className={`${styles.planCard} ${
                      isPopular ? styles.popularPlan : ""
                    }`}
                  >
                    {isPopular && (
                      <>
                        <div className={styles.popularBadgeBlock}></div>
                        <div className={styles.popularBadge}>
                          <Сheck2Icon />
                          86% клієнтів обирають
                        </div>
                      </>
                    )}
                    <div className={styles.planPrice}>
                      <h3 className={styles.planName}>
                        {tariff.title.rendered}
                      </h3>
                      <div className={styles.planPriceBlock}>
                        <p className={styles.price}>{tariff.Price}$/місяць</p>
                        <p className={styles.discount}>-30%</p>
                      </div>
                      <span className={styles.period}>
                        {tariff.Time} місяців - {totalPrice} $
                      </span>
                    </div>
                    <div className={styles.planFeatures}>
                      {tariff.Points.map((point, pointIndex) => (
                        <div key={pointIndex} className={styles.feature}>
                          <div className={styles.checkIconBlock}>
                            <СheckIcon />
                          </div>
                          <span>{point.Текст}</span>
                        </div>
                      ))}
                    </div>
                    <button className={styles.selectBtn}>Обрати тариф</button>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Третій тариф за межами блоку availablePlans */}
      {tariffs.length > 2 && (
        <div className={styles.singlePlan}>
          <div className={styles.plansContainer}>
            {tariffs.slice(2, 3).map((tariff) => {
              const totalPrice = parseInt(tariff.Price) * parseInt(tariff.Time);

              return (
                <div key={tariff.id} className={styles.planCard}>
                  <div className={styles.planPrice}>
                    <h3 className={styles.planName}>{tariff.title.rendered}</h3>
                    <div className={styles.planPriceBlock}>
                      <p className={styles.price}>{tariff.Price}$/місяць</p>
                      <p className={styles.discount}>-30%</p>
                    </div>
                    <span className={styles.period}>
                      {tariff.Time} місяців - {totalPrice} $
                    </span>
                  </div>
                  <div className={styles.planFeatures}>
                    {tariff.Points.map((point, pointIndex) => (
                      <div key={pointIndex} className={styles.feature}>
                        <div className={styles.checkIconBlock}>
                          <СheckIcon />
                        </div>
                        <span>{point.Текст}</span>
                      </div>
                    ))}
                  </div>
                  <button className={styles.selectBtn}>Обрати тариф</button>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </>
  );
}
