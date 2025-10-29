"use client";
import React, { useMemo, useState } from "react";
import Image from "next/image";
import { useCasesQuery } from "@/components/hooks/useCoachesQuery";
import styles from "./TrainersShowcase.module.css";
import { InstagramIcon } from "../Icons/Icons";
import SliderNav from "@/components/ui/SliderNav/SliderNavActions";

interface TrainersShowcaseProps {
  title?: string;
  subtitle?: string;
  limit?: number;
  className?: string;
  showPagination?: boolean;
  itemsPerPage?: number;
}

const TrainersShowcase: React.FC<TrainersShowcaseProps> = ({
  title = "Кейси учнів",
  subtitle = "Результати",
  limit = 4,
  className = "",
  showPagination = false,
  itemsPerPage = 4,
}) => {
  const { data: cases = [], isLoading, isError } = useCasesQuery();

  const [page, setPage] = useState(0);

  type CaseItem = {
    id: number | string;
    name: string;
    image: string;
    location?: string;
    specialization?: string;
    superPower?: string;
  };

  const list = useMemo<CaseItem[]>(() => {
    if (!Array.isArray(cases)) return [];
    return cases.map(
      (c: {
        id: number;
        title?: { rendered?: string };
        Avatar?: string;
        Text_instagram?: string;
        Description?: string;
      }) => ({
        id: c.id,
        name: c?.title?.rendered || "",
        image: c?.Avatar || "/placeholder.svg",
        location: c?.Text_instagram || "",
        specialization: c?.Description || "",
        superPower: undefined,
      })
    );
  }, [cases]);
  const totalPages = useMemo(() => {
    const total = list.length;
    const per = Math.max(1, itemsPerPage);
    return Math.max(1, Math.ceil(total / per));
  }, [list.length, itemsPerPage]);

  const pagedItems = useMemo(() => {
    if (!showPagination) return list.slice(0, limit);
    const per = Math.max(1, itemsPerPage);
    const start = page * per;
    return list.slice(start, start + per);
  }, [list, page, itemsPerPage, showPagination, limit]);

  const goPrev = () => setPage((p) => (p - 1 + totalPages) % totalPages);
  const goNext = () => setPage((p) => (p + 1) % totalPages);
  const goTo = (idx: number) => setPage(idx);

  return (
    <section className={`${styles.trainersSection} ${className}`}>
      <div className={styles.container}>
        {(title || subtitle) && (
          <div className={styles.header}>
            {subtitle && <div className={styles.badge}>{subtitle}</div>}
            {title && <h2 className={styles.title}>{title}</h2>}
          </div>
        )}

        {isError && (
          <div className={styles.state}>Не вдалося завантажити тренерів</div>
        )}
        {isLoading && <div className={styles.state}>Завантаження…</div>}

        {!isLoading && !isError && (
          <>
            <div className={styles.trainersGrid}>
              {pagedItems.map((coach) => (
                <article key={coach.id} className={styles.trainerCard}>
                  <div className={styles.imageContainer}>
                    <Image
                      src={coach.image || "/placeholder.svg"}
                      alt={coach.name}
                      width={300}
                      height={400}
                      className={styles.trainerImage}
                    />
                    {coach.location && (
                      <div className={styles.instagramBadge}>
                        <span className={styles.instagramIcon}>
                          <InstagramIcon />
                        </span>
                        <span>{coach.location}</span>
                      </div>
                    )}
                  </div>
                  <div className={styles.trainerInfo}>
                    <h3 className={styles.trainerName}>{coach.name}</h3>
                    <p className={styles.trainerDescription}>
                      {coach.superPower || coach.specialization || "Тренер BFB"}
                    </p>
                  </div>
                </article>
              ))}
            </div>

            {showPagination && totalPages > 1 && (
              <>
                <SliderNav
                  activeIndex={page}
                  dots={totalPages}
                  onPrev={goPrev}
                  onNext={goNext}
                  onDotClick={goTo}
                  buttonBgColor="var(--white)"
                />
              </>
            )}
          </>
        )}
      </div>
    </section>
  );
};

export default TrainersShowcase;
