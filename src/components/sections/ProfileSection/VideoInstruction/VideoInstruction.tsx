"use client";
import React, { useState, useEffect } from "react";
import styles from "./VideoInstruction.module.css";
import Image from "next/image";
import { СheckBrderIcon } from "@/components/Icons/Icons";
import VideoPlayer from "@/components/VideoPlayer";
import { createProxiedVideoUrl, fetchThemeVideoUrl } from "@/lib/bfbApi";

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
  videoThumbnail = "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgZmlsbD0iI2VlZWZmIi8+PC9zdmc+",
  videoUrl,
  isWatched = false,
}) => {
  const [watched, setWatched] = useState(isWatched);
  const [isVideoPlaying, setIsVideoPlaying] = useState(false);
  const [realVideoUrl, setRealVideoUrl] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Завантажуємо реальний URL відео з API
  useEffect(() => {
    const loadVideoUrl = async () => {
      try {
        console.log('[VideoInstruction] Loading video URL...');
        setIsLoading(true);
        const url = await fetchThemeVideoUrl();
        console.log('[VideoInstruction] Received video URL:', url);
        if (url) {
          setRealVideoUrl(url);
          console.log('[VideoInstruction] Video URL set successfully');
        } else {
          console.log('[VideoInstruction] No video URL received, using fallback');
          // Використовуємо fallback URL з вашого API (реальне відео)
          setRealVideoUrl('/api/video-proxy?url=https://www.api.bfb.projection-learn.website/wp-content/uploads/2025/10/2025-10-20-14-51-06.mp4');
        }
      } catch (error) {
        console.error('[VideoInstruction] Помилка завантаження відео URL:', error);
        // Використовуємо fallback URL при помилці (реальне відео з API)
        setRealVideoUrl('/api/video-proxy?url=https://www.api.bfb.projection-learn.website/wp-content/uploads/2025/10/2025-10-20-14-51-06.mp4');
      } finally {
        setIsLoading(false);
      }
    };

    loadVideoUrl();
  }, []);

  const handleWatchVideo = () => {
    console.log('[VideoInstruction] handleWatchVideo called, currentVideoUrl:', currentVideoUrl);
    // не вмикаємо плеєр, якщо URL ще не готовий
    if (!currentVideoUrl || currentVideoUrl === "#") {
      console.log('[VideoInstruction] Video URL not ready, skipping play');
      return;
    }
    console.log('[VideoInstruction] Starting video playback');
    setWatched(true);
    setIsVideoPlaying(true);
  };

  const handleCloseVideo = () => {
    setIsVideoPlaying(false);
  };

  // Використовуємо реальний URL якщо він є, інакше fallback
  const currentVideoUrl = realVideoUrl || videoUrl || "#";

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
        {!isVideoPlaying ? (
          <div className={styles.videoThumbnail}>
            {isLoading ? (
              <div className={styles.loadingContainer}>
                <div className={styles.loadingSpinner}></div>
                <p className={styles.loadingText}>Завантаження відео...</p>
              </div>
            ) : (
              <>
                <Image
                  src={videoThumbnail}
                  alt="Video thumbnail"
                  fill
                  className={styles.thumbnailImage}
                />
                <div className={styles.playButton}>
                  <div className={styles.playIcon}>▶</div>
                </div>
              </>
            )}
          </div>
        ) : (
          <div className={styles.videoPlayerContainer}>
            <button 
              className={styles.closeButton}
              onClick={(e) => {
                e.stopPropagation();
                handleCloseVideo();
              }}
            >
              ✕
            </button>
            <VideoPlayer
              videoUrl={currentVideoUrl}
              className={styles.videoPlayer}
              controls={true}
              autoPlay={true}
              muted={true}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default VideoInstruction;
