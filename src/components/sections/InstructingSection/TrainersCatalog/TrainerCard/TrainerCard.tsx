"use client";
import React from "react";
import Image from "next/image";
import Link from "next/link";
import styles from "./TrainerCard.module.css";

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

  const imageUrl =
    avatar?.[0]?.url ||
    gallery?.[0]?.url ||
    "https://via.placeholder.com/280x280/f0f0f0/666?text=Тренер";

  return (
    <Link href={`/trainers/${id}`} className={styles.trainerCard}>
      <div className={styles.cardImage}>
        <Image
          src={imageUrl}
          alt={name}
          width={280}
          height={280}
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
