"use client";
import React, { useState } from "react";
import styles from "./VideoInstruction.module.css";
import Image from "next/image";
import { СheckBrderIcon } from "@/components/Icons/Icons";

interface VideoInstructionProps {
  title?: string;
  description?: string;
  videoThumbnail?: string;
  videoUrl?: string;
  isWatched?: boolean;
}

const VideoInstruction: React.FC<VideoInstructionProps> = ({
  title = "Як заповнювати онлайн-кабінет",
  description = "Перегляньте коротке відеоінструкцію, щоб дізнатися, як правильно заповнити свій онлайн-кабінет.",
  videoThumbnail = "/images/video-thumbnails/cabinet-instruction.jpg",
  videoUrl = "#",
  isWatched = false,
}) => {
  const [watched, setWatched] = useState(isWatched);

  const handleWatchVideo = () => {
    setWatched(true);
    // Тут можна додати логіку відкриття відео
    if (videoUrl !== "#") {
      window.open(videoUrl, "_blank");
    }
  };

  return (
    <div className={styles.videoInstruction}>
      <div className={styles.header}>
        <div className={styles.textContent}>
          <h2 className={styles.title}>{title}</h2>
          <p className={styles.description}>{description}</p>
        </div>

        <div className={styles.statusContainer}>
          <button
            className={`${styles.statusButton} ${
              watched ? styles.watched : styles.notWatched
            }`}
            onClick={() => setWatched(!watched)}
          >
            <span className={styles.statusIcon}>
              {watched ? <СheckBrderIcon /> : <СheckBrderIcon />}
            </span>
            <span className={styles.statusText}>
              {watched ? "Переглянув(-ла) відео" : "Переглянув(-ла) відео "}
            </span>
          </button>
        </div>
      </div>

      <div className={styles.videoContainer} onClick={handleWatchVideo}>
        <div className={styles.videoThumbnail}>
          <Image
            src={videoThumbnail}
            alt="Video thumbnail"
            fill
            className={styles.thumbnailImage}
          />
          <div className={styles.playButton}>
            <div className={styles.playIcon}>▶</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VideoInstruction;
