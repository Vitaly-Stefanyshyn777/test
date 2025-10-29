'use client';

import { useState } from 'react';
import Image from 'next/image';
import VideoPlayer from '@/components/VideoPlayer';
import { createProxiedVideoUrl } from '@/lib/bfbApi';

interface VideoThumbnailProps {
  thumbnail: string;
  videoUrl: string;
  title?: string;
  className?: string;
  thumbnailClassName?: string;
  videoClassName?: string;
  showTitle?: boolean;
  autoPlay?: boolean;
  controls?: boolean;
  muted?: boolean;
}

export default function VideoThumbnail({
  thumbnail,
  videoUrl,
  title,
  className = '',
  thumbnailClassName = '',
  videoClassName = '',
  showTitle = false,
  autoPlay = true,
  controls = true,
  muted = false,
}: VideoThumbnailProps) {
  const [isVideoPlaying, setIsVideoPlaying] = useState(false);

  const handlePlayVideo = () => {
    setIsVideoPlaying(true);
  };

  const handleCloseVideo = () => {
    setIsVideoPlaying(false);
  };

  // Створюємо проксований URL якщо потрібно
  const proxiedVideoUrl = videoUrl.startsWith('http') 
    ? createProxiedVideoUrl(videoUrl) 
    : videoUrl;

  return (
    <div className={`video-thumbnail-container ${className}`}>
      {!isVideoPlaying ? (
        <div 
          className={`video-thumbnail ${thumbnailClassName}`}
          onClick={handlePlayVideo}
          style={{
            position: 'relative',
            width: '100%',
            height: '100%',
            cursor: 'pointer',
            borderRadius: '12px',
            overflow: 'hidden',
            transition: 'transform 0.2s ease',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'scale(1.02)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'scale(1)';
          }}
        >
          <Image
            src={thumbnail}
            alt={title || 'Video thumbnail'}
            fill
            style={{
              objectFit: 'cover',
              filter: 'blur(2px)',
            }}
          />
          <div
            style={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              width: '80px',
              height: '80px',
              backgroundColor: 'rgba(255, 255, 255, 0.95)',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 4px 16px rgba(0, 0, 0, 0.2)',
              transition: 'all 0.2s ease',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translate(-50%, -50%) scale(1.1)';
              e.currentTarget.style.backgroundColor = '#ffffff';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translate(-50%, -50%) scale(1)';
              e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.95)';
            }}
          >
            <div style={{ fontSize: '24px', color: '#1a1a1a', marginLeft: '4px' }}>
              ▶
            </div>
          </div>
          {showTitle && title && (
            <div
              style={{
                position: 'absolute',
                bottom: '16px',
                left: '16px',
                right: '16px',
                color: 'white',
                fontSize: '18px',
                fontWeight: '600',
                textShadow: '0 2px 4px rgba(0, 0, 0, 0.7)',
              }}
            >
              {title}
            </div>
          )}
        </div>
      ) : (
        <div
          className={`video-player-container ${videoClassName}`}
          style={{
            position: 'relative',
            width: '100%',
            height: '100%',
            backgroundColor: '#000',
            borderRadius: '12px',
            overflow: 'hidden',
          }}
        >
          <button
            onClick={handleCloseVideo}
            style={{
              position: 'absolute',
              top: '16px',
              right: '16px',
              zIndex: 10,
              width: '40px',
              height: '40px',
              backgroundColor: 'rgba(0, 0, 0, 0.7)',
              color: 'white',
              border: 'none',
              borderRadius: '50%',
              fontSize: '18px',
              fontWeight: 'bold',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              transition: 'background-color 0.2s ease',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = 'rgba(0, 0, 0, 0.9)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = 'rgba(0, 0, 0, 0.7)';
            }}
          >
            ✕
          </button>
          <VideoPlayer
            videoUrl={proxiedVideoUrl}
            className="w-full h-full"
            controls={controls}
            autoPlay={autoPlay}
            muted={muted}
          />
        </div>
      )}
    </div>
  );
}
