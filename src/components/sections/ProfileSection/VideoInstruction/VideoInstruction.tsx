"use client";
import React, { useState, useEffect } from "react";
import styles from "./VideoInstruction.module.css";
// Image removed; not used when auto-playing by default
import { СheckBrderIcon } from "@/components/Icons/Icons";
import VideoPlayer from "./VideoPlayer";
import { fetchThemeVideoUrl } from "@/lib/bfbApi";

const StatusButton: React.FC<{
  watched: boolean;
  onToggle: () => void;
}> = ({ watched, onToggle }) => (
  <div className={styles.statusContainer}>
    <button
      className={`${styles.statusButton} ${
        watched ? styles.statusButtonWatched : ""
      }`}
      onClick={(e) => {
        e.stopPropagation();
        onToggle();
      }}
    >
      <span className={styles.statusIcon}>
        <СheckBrderIcon />
      </span>
      <span className={styles.statusText}>Переглянув(-ла) відео</span>
    </button>
  </div>
);

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
  videoThumbnail = "/images/Frame-13213187831.jpg",
  videoUrl,
  isWatched = false,
}) => {
  const [watched, setWatched] = useState(isWatched);
  const [realVideoUrl, setRealVideoUrl] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isMobile, setIsMobile] = useState(false);

  // Визначення мобільної версії
  useEffect(() => {
    const mql = window.matchMedia("(max-width: 1000px)");
    const update = () => setIsMobile(mql.matches);
    update();
    if (mql.addEventListener) mql.addEventListener("change", update);
    else mql.addListener(update);
    return () => {
      if (mql.removeEventListener) mql.removeEventListener("change", update);
      else mql.removeListener(update);
    };
  }, []);

  // Завантажуємо реальний URL відео з API
  useEffect(() => {
    const loadVideoUrl = async () => {
      try {
        console.log("[VideoInstruction] Loading video URL...");
        setIsLoading(true);
        const url = await fetchThemeVideoUrl();
        console.log("[VideoInstruction] Received video URL:", url);
        if (url) {
          setRealVideoUrl(url);
          console.log("[VideoInstruction] Video URL set successfully");
        } else {
          console.log(
            "[VideoInstruction] No video URL received, using fallback"
          );
          // Використовуємо fallback URL з вашого API (реальне відео)
          const baseUrl =
            process.env.NEXT_PUBLIC_UPSTREAM_BASE ||
            "https://www.api.bfb.in.ua";
          const fallback = `/api/video-proxy?url=${encodeURIComponent(
            baseUrl + "/wp-content/uploads/2025/10/2025-10-20-14-51-06.mp4"
          )}`;
          setRealVideoUrl(fallback);
        }
      } catch (error) {
        console.error(
          "[VideoInstruction] Помилка завантаження відео URL:",
          error
        );
        // Використовуємо fallback URL при помилці (реальне відео з API)
        const baseUrl =
          process.env.NEXT_PUBLIC_UPSTREAM_BASE || "https://www.api.bfb.in.ua";
        const fallback = `/api/video-proxy?url=${encodeURIComponent(
          baseUrl + "/wp-content/uploads/2025/10/2025-10-20-14-51-06.mp4"
        )}`;
        setRealVideoUrl(fallback);
      } finally {
        setIsLoading(false);
      }
    };

    loadVideoUrl();
  }, []);

  const handleWatchVideo = () => {
    console.log(
      "[VideoInstruction] handleWatchVideo called, currentVideoUrl:",
      currentVideoUrl
    );
    // Якщо URL вже готовий, просто переконуємось що плеєр увімкнено
    if (currentVideoUrl && currentVideoUrl !== "#") {
      setWatched(true);
    }
  };

  // Закриваюча кнопка не потрібна при автопрограванні

  // Використовуємо реальний URL якщо він є, інакше fallback
  const currentVideoUrl = realVideoUrl || videoUrl || "#";

  return (
    <div className={styles.videoInstruction}>
      <div className={styles.header}>
        <div className={styles.textContent}>
          <h2 className={styles.title}>{title}</h2>
          <p className={styles.description}>{description}</p>
        </div>

        {/* На десктопі statusButton в header */}
        {!isMobile && (
          <StatusButton
            watched={watched}
            onToggle={() => setWatched(!watched)}
          />
        )}
      </div>

      {/* На мобілці обгортаємо videoContainer та statusButton в один блок */}
      {isMobile ? (
        <div className={styles.videoWithButtonBlock}>
          <div className={styles.videoContainer} onClick={handleWatchVideo}>
            {isLoading || !currentVideoUrl || currentVideoUrl === "#" ? (
              <div className={styles.videoThumbnail}>
                <div className={styles.loadingContainer}>
                  <div className={styles.loadingSpinner}></div>
                  <p className={styles.loadingText}>Завантаження відео...</p>
                </div>
              </div>
            ) : (
              <div className={styles.videoPlayerContainer}>
                <VideoPlayer
                  videoUrl={currentVideoUrl}
                  className={styles.videoPlayer}
                  controls={false}
                  onlyPlayPause={true}
                  autoPlay={false}
                  muted={false}
                  poster={videoThumbnail}
                  overlayPlayButton={false}
                />
              </div>
            )}
          </div>
          <StatusButton
            watched={watched}
            onToggle={() => setWatched(!watched)}
          />
        </div>
      ) : (
        <div className={styles.videoContainer} onClick={handleWatchVideo}>
          {isLoading || !currentVideoUrl || currentVideoUrl === "#" ? (
            <div className={styles.videoThumbnail}>
              <div className={styles.loadingContainer}>
                <div className={styles.loadingSpinner}></div>
                <p className={styles.loadingText}>Завантаження відео...</p>
              </div>
            </div>
          ) : (
            <div className={styles.videoPlayerContainer}>
              <VideoPlayer
                videoUrl={currentVideoUrl}
                className={styles.videoPlayer}
                controls={false}
                onlyPlayPause={true}
                autoPlay={false}
                muted={false}
                poster={videoThumbnail}
                overlayPlayButton={false}
              />
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default VideoInstruction;
