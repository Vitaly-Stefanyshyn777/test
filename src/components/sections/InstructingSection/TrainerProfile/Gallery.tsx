import React from "react";
import Image from "next/image";
import styles from "./TrainerProfile.module.css";
import { TrainerUser } from "./types";
import { getGalleryImages } from "./utils";

export default function Gallery({ trainer }: { trainer: TrainerUser }) {
  const galleryImages = getGalleryImages(trainer?.gallery);
  return (
    <div className={styles.gallery}>
      <h2>Галерея</h2>
      <div className={styles.galleryContent}>
        <div className={styles.mainImage}>
          <Image
            src={
              galleryImages[0] ||
              "https://via.placeholder.com/800x500/f0f0f0/666?text=Галерея"
            }
            alt="Галерея тренера"
            width={800}
            height={500}
            className={styles.galleryImage}
          />
        </div>
        <div className={styles.galleryNavigation}>
          <button className={styles.navButton}>←</button>
          <div className={styles.dots}>
            <span className={`${styles.dot} ${styles.active}`}></span>
            <span className={styles.dot}></span>
            <span className={styles.dot}></span>
          </div>
          <button className={styles.navButton}>→</button>
        </div>
      </div>
    </div>
  );
}
