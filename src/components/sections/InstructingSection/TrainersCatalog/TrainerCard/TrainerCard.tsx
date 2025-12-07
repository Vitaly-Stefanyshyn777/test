"use client";
import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import styles from "./TrainerCard.module.css";
import { normalizeImageUrl } from "@/lib/imageUtils";

interface TrainerCardProps {
  id: string;
  firstName: string;
  lastName: string;
  locations?: string;
  position?: string;
  avatar?: Array<{
    url: string;
    filename: string;
  }>;
  gallery?: Array<{
    url: string;
    filename: string;
  }>;
}

const TrainerCard = ({
  id,
  firstName,
  lastName,
  locations,
  position,
  avatar,
  gallery,
}: TrainerCardProps) => {
  const name = `${firstName} ${lastName}`;

  const rawImageUrl = avatar?.[0]?.url || gallery?.[0]?.url;
  const normalizedImageUrl = rawImageUrl 
    ? normalizeImageUrl(rawImageUrl) 
    : "https://via.placeholder.com/280x280/f0f0f0/666?text=Тренер";
  
  const initialImageUrl = normalizedImageUrl !== "/placeholder.svg" 
    ? normalizedImageUrl 
    : "https://via.placeholder.com/280x280/f0f0f0/666?text=Тренер";

  const [imageUrl, setImageUrl] = useState(initialImageUrl);
  const placeholderUrl = "https://via.placeholder.com/280x280/f0f0f0/666?text=Тренер";

  return (
    <Link href={`/trainers/${id}`} className={styles.trainerCard}>
      <div className={styles.cardImage}>
        <Image
          src={imageUrl}
          alt={name}
          width={280}
          height={280}
          unoptimized={imageUrl.startsWith("https://via.placeholder.com")}
          onError={() => {
            // Якщо зображення не завантажилось, встановлюємо placeholder
            if (imageUrl !== placeholderUrl) {
              setImageUrl(placeholderUrl);
            }
          }}
          className={styles.trainerImage}
        />
      </div>
      <div className={styles.cardContent}>
        <div className={styles.location}>{locations || "Місто не вказано"}</div>
        <h3 className={styles.trainerName}>{name}</h3>
        <p className={styles.specialization}>{position || "Фітнес тренер"}</p>
      </div>
    </Link>
  );
};

export default TrainerCard;
