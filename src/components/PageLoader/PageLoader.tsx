"use client";
import React, { useEffect, useState } from "react";
import s from "./PageLoader.module.css";

const PageLoader = () => {
  const [progress, setProgress] = useState(0);
  const [isVisible, setIsVisible] = useState(true);
  const [isVideoReady, setIsVideoReady] = useState(false);
  const [hasVideoError, setHasVideoError] = useState(false);

  useEffect(() => {
    // 🔧 Fallback: автоматично ховаємо через 5 секунд, якщо event не прийшов
    const fallbackTimeout = setTimeout(() => {
      console.warn("⚠️ [PageLoader] Fallback timeout: hiding loader after 5s");
      setProgress(100);
      setIsVisible(false);
    }, 5000);

    // Симуляція візуального прогресу, доки відео не готове
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (isVideoReady) {
          // Якщо вже прийшла подія з відео – більше не крутимо інтервал
          clearInterval(interval);
          return prev;
        }

        // Обмежуємо прогрес, щоб не доходив до 100%, поки відео не готове
        const maxBeforeVideoReady = 92;
        if (prev >= maxBeforeVideoReady) return prev;

        // Швидше на початку, повільніше наприкінці
        const increment = prev < 50 ? 10 : prev < 80 ? 5 : 2;
        return Math.min(prev + increment, maxBeforeVideoReady);
      });
    }, 50);

    // Подія, коли завантажився відеоплеєр у HeroSection
    const handleHeroVideoReady = () => {
      console.log("✅ [PageLoader] Event 'hero-video-ready' received");
      clearTimeout(fallbackTimeout); // Скасовуємо fallback
      setIsVideoReady(true);
      setProgress(100);
      setTimeout(() => {
        setIsVisible(false);
      }, 300);
    };

    // Подія, коли відео не змогло завантажитися (помилка)
    const handleHeroVideoError = () => {
      console.warn("⚠️ [PageLoader] Event 'hero-video-error' received");
      clearTimeout(fallbackTimeout); // Скасовуємо fallback
      setHasVideoError(true);
      // Даємо кілька секунд, щоб відобразити помилку відео, потім ховаємо лоадер
      setTimeout(() => {
        setProgress(100);
        setIsVisible(false);
      }, 1000); // Зменшено до 1 секунди
    };

    window.addEventListener("hero-video-ready", handleHeroVideoReady);
    window.addEventListener("hero-video-error", handleHeroVideoError);

    return () => {
      clearTimeout(fallbackTimeout);
      clearInterval(interval);
      window.removeEventListener("hero-video-ready", handleHeroVideoReady);
      window.removeEventListener("hero-video-error", handleHeroVideoError);
    };
  }, [isVideoReady, hasVideoError]);

  if (!isVisible) return null;

  return (
    <div className={s.loader}>
      <div className={s.progressBar}>
        <div
          className={s.progressFill}
          style={{ width: `${progress}%` }}
        />
      </div>
    </div>
  );
};

export default PageLoader;

