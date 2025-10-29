'use client';

import { useState, useEffect } from 'react';
import VideoPlayer from '@/components/VideoPlayer';
import { fetchThemeVideoUrl, createProxiedVideoUrl } from '@/lib/bfbApi';

export default function TestVideoPage() {
  const [videoUrl, setVideoUrl] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [customUrl, setCustomUrl] = useState('');

  // Тестовий URL з вашого прикладу (проксований)
  const testVideoUrl = createProxiedVideoUrl('https://www.api.bfb.projection-learn.website/wp-content/uploads/2025/10/2025-10-20-14-51-06.mp4');

  useEffect(() => {
    const loadVideoUrl = async () => {
      try {
        setIsLoading(true);
        setError(null);
        
        // Спочатку пробуємо отримати URL з API
        const apiUrl = await fetchThemeVideoUrl();
        if (apiUrl) {
          setVideoUrl(apiUrl);
        } else {
          // Якщо API не повернув URL, використовуємо тестовий
          setVideoUrl(testVideoUrl);
        }
      } catch (err) {
        console.error('Помилка завантаження відео URL:', err);
        setError('Не вдалося завантажити URL відео з API');
        // Використовуємо тестовий URL як fallback
        setVideoUrl(testVideoUrl);
      } finally {
        setIsLoading(false);
      }
    };

    loadVideoUrl();
  }, []);

  const handleCustomUrlSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (customUrl.trim()) {
      // Якщо URL починається з http/https, створюємо проксований URL
      if (customUrl.startsWith('http')) {
        setVideoUrl(createProxiedVideoUrl(customUrl.trim()));
      } else {
        // Якщо це вже проксований URL, використовуємо як є
        setVideoUrl(customUrl.trim());
      }
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Завантаження тестової сторінки...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4">
        <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-6">
            Тестова сторінка відеоплеєра
          </h1>
          
          {error && (
            <div className="bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-3 rounded mb-6">
              <p className="font-medium">Увага:</p>
              <p>{error}</p>
              <p className="text-sm mt-1">Використовується тестовий URL</p>
            </div>
          )}

          <div className="mb-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">
              Поточний URL відео:
            </h2>
            <div className="bg-gray-100 p-3 rounded border">
              <code className="text-sm break-all">{videoUrl}</code>
            </div>
          </div>

          <form onSubmit={handleCustomUrlSubmit} className="mb-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">
              Тестування з власним URL:
            </h2>
            <div className="flex gap-4">
              <input
                type="url"
                value={customUrl}
                onChange={(e) => setCustomUrl(e.target.value)}
                placeholder="Введіть URL відео для тестування"
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <button
                type="submit"
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
              >
                Завантажити
              </button>
            </div>
          </form>
        </div>

        {videoUrl && (
          <div className="space-y-8">
            {/* Основний відеоплеєр */}
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h2 className="text-2xl font-semibold text-gray-800 mb-4">
                Основний відеоплеєр (з контролами)
              </h2>
              <VideoPlayer
                videoUrl={videoUrl}
                className="w-full h-96"
                controls={true}
                autoPlay={false}
                muted={false}
              />
            </div>

            {/* Відеоплеєр без контролів */}
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h2 className="text-2xl font-semibold text-gray-800 mb-4">
                Відеоплеєр без контролів (клік для відтворення)
              </h2>
              <VideoPlayer
                videoUrl={videoUrl}
                className="w-full h-96"
                controls={false}
                autoPlay={false}
                muted={false}
              />
            </div>

            {/* Автоплеєр (заглушений) */}
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h2 className="text-2xl font-semibold text-gray-800 mb-4">
                Автоплеєр (заглушений)
              </h2>
              <VideoPlayer
                videoUrl={videoUrl}
                className="w-full h-96"
                controls={true}
                autoPlay={true}
                muted={true}
              />
            </div>

            {/* Мініатюрний плеєр */}
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h2 className="text-2xl font-semibold text-gray-800 mb-4">
                Мініатюрний плеєр
              </h2>
              <VideoPlayer
                videoUrl={videoUrl}
                className="w-80 h-48"
                controls={true}
                autoPlay={false}
                muted={false}
              />
            </div>
          </div>
        )}

        <div className="mt-8 bg-blue-50 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-blue-900 mb-3">
            Інформація про тестування:
          </h3>
          <ul className="text-blue-800 space-y-2">
            <li>• Перший плеєр має стандартні контроли браузера</li>
            <li>• Другий плеєр керується кліком (без контролів)</li>
            <li>• Третій плеєр автоматично відтворюється (заглушений)</li>
            <li>• Четвертий плеєр демонструє різні розміри</li>
            <li>• Всі плеєри мають обробку помилок та індикатори завантаження</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
