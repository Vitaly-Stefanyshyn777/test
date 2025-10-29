'use client';

import { useState, useEffect } from 'react';
import VideoPlayer from '@/components/VideoPlayer';
import { fetchThemeVideoUrl } from '@/lib/bfbApi';

export default function VideoSection() {
  const [videoUrl, setVideoUrl] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadVideo = async () => {
      try {
        const url = await fetchThemeVideoUrl();
        setVideoUrl(url);
      } catch (error) {
        console.error('Помилка завантаження відео:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadVideo();
  }, []);

  if (isLoading) {
    return (
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <div className="animate-pulse bg-gray-300 h-8 w-64 mx-auto mb-4 rounded"></div>
            <div className="animate-pulse bg-gray-300 h-64 w-full max-w-4xl mx-auto rounded"></div>
          </div>
        </div>
      </section>
    );
  }

  if (!videoUrl) {
    return null;
  }

  return (
    <section className="py-20 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Наше відео
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Подивіться на наше відео, щоб дізнатися більше про наші послуги
          </p>
        </div>
        
        <div className="max-w-4xl mx-auto">
          <VideoPlayer
            videoUrl={videoUrl}
            className="w-full h-96 rounded-lg shadow-lg"
            controls={true}
            autoPlay={false}
            muted={false}
          />
        </div>
      </div>
    </section>
  );
}
