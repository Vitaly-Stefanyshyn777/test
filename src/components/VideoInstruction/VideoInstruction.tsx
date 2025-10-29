'use client';

import { useState, useEffect } from 'react';
import VideoPlayer from '@/components/VideoPlayer';
import { fetchThemeVideoUrl } from '@/lib/bfbApi';

interface VideoInstructionProps {
  title?: string;
  description?: string;
  className?: string;
  videoClassName?: string;
  showTitle?: boolean;
  showDescription?: boolean;
  autoPlay?: boolean;
  controls?: boolean;
  muted?: boolean;
  loop?: boolean;
  poster?: string;
}

export default function VideoInstruction({
  title = "Відео інструкція",
  description = "Подивіться наше відео для детальної інформації",
  className = '',
  videoClassName = '',
  showTitle = true,
  showDescription = true,
  autoPlay = false,
  controls = true,
  muted = false,
  loop = false,
  poster
}: VideoInstructionProps) {
  const [videoUrl, setVideoUrl] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadVideo = async () => {
      try {
        setIsLoading(true);
        setError(null);
        
        const url = await fetchThemeVideoUrl();
        if (url) {
          setVideoUrl(url);
        } else {
          setError('Відео не знайдено');
        }
      } catch (err) {
        console.error('Помилка завантаження відео:', err);
        setError('Не вдалося завантажити відео');
      } finally {
        setIsLoading(false);
      }
    };

    loadVideo();
  }, []);

  if (isLoading) {
    return (
      <div className={`video-instruction-loading ${className}`}>
        <div className="animate-pulse">
          {showTitle && (
            <div className="h-8 bg-gray-300 rounded mb-4 w-3/4"></div>
          )}
          {showDescription && (
            <div className="h-4 bg-gray-300 rounded mb-6 w-full"></div>
          )}
          <div className={`bg-gray-300 rounded ${videoClassName}`} style={{ aspectRatio: '16/9' }}></div>
        </div>
      </div>
    );
  }

  if (error || !videoUrl) {
    return (
      <div className={`video-instruction-error ${className}`}>
        {showTitle && (
          <h2 className="text-2xl font-bold text-gray-900 mb-4">{title}</h2>
        )}
        {showDescription && (
          <p className="text-gray-600 mb-6">{description}</p>
        )}
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
          <div className="text-red-500 text-4xl mb-2">⚠️</div>
          <p className="text-red-600 font-medium">{error || 'Відео недоступне'}</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`video-instruction ${className}`}>
      {showTitle && (
        <h2 className="text-2xl font-bold text-gray-900 mb-4">
          {title}
        </h2>
      )}
      
      {showDescription && (
        <p className="text-gray-600 mb-6">
          {description}
        </p>
      )}
      
      <VideoPlayer
        videoUrl={videoUrl}
        className={`w-full ${videoClassName}`}
        controls={controls}
        autoPlay={autoPlay}
        muted={muted}
        loop={loop}
        poster={poster}
      />
    </div>
  );
}
