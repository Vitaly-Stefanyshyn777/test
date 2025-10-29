'use client';

import VideoThumbnail from '@/components/VideoThumbnail';

export default function VideoThumbnailsPage() {
  // Тестові дані
  const testVideoUrl = 'https://www.api.bfb.projection-learn.website/wp-content/uploads/2025/10/2025-10-20-14-51-06.mp4';
  const testThumbnail = '/images/video-thumbnails/cabinet-instruction.jpg';

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            VideoThumbnail - Клік для відтворення
          </h1>
          <p className="text-xl text-gray-600">
            Компонент для відображення відео з thumbnail та кліком для відтворення
          </p>
        </div>

        <div className="space-y-16">
          {/* Стандартний варіант */}
          <section className="bg-white rounded-lg shadow-lg p-8">
            <h2 className="text-2xl font-semibold text-gray-800 mb-6">
              1. Стандартний VideoThumbnail
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <VideoThumbnail
                thumbnail={testThumbnail}
                videoUrl={testVideoUrl}
                title="Відео інструкція 1"
                className="h-64"
                showTitle={true}
              />
              <VideoThumbnail
                thumbnail={testThumbnail}
                videoUrl={testVideoUrl}
                title="Відео інструкція 2"
                className="h-64"
                showTitle={true}
              />
              <VideoThumbnail
                thumbnail={testThumbnail}
                videoUrl={testVideoUrl}
                title="Відео інструкція 3"
                className="h-64"
                showTitle={true}
              />
            </div>
          </section>

          {/* Без заголовків */}
          <section className="bg-white rounded-lg shadow-lg p-8">
            <h2 className="text-2xl font-semibold text-gray-800 mb-6">
              2. Без заголовків (чистий дизайн)
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <VideoThumbnail
                thumbnail={testThumbnail}
                videoUrl={testVideoUrl}
                className="h-48"
              />
              <VideoThumbnail
                thumbnail={testThumbnail}
                videoUrl={testVideoUrl}
                className="h-48"
              />
              <VideoThumbnail
                thumbnail={testThumbnail}
                videoUrl={testVideoUrl}
                className="h-48"
              />
              <VideoThumbnail
                thumbnail={testThumbnail}
                videoUrl={testVideoUrl}
                className="h-48"
              />
            </div>
          </section>

          {/* Різні розміри */}
          <section className="bg-white rounded-lg shadow-lg p-8">
            <h2 className="text-2xl font-semibold text-gray-800 mb-6">
              3. Різні розміри
            </h2>
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-medium text-gray-700 mb-3">Великий (16:9)</h3>
                <VideoThumbnail
                  thumbnail={testThumbnail}
                  videoUrl={testVideoUrl}
                  title="Велике відео"
                  className="h-96 w-full max-w-4xl mx-auto"
                  showTitle={true}
                />
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-lg font-medium text-gray-700 mb-3">Середнє</h3>
                  <VideoThumbnail
                    thumbnail={testThumbnail}
                    videoUrl={testVideoUrl}
                    title="Середнє відео"
                    className="h-64"
                    showTitle={true}
                  />
                </div>
                
                <div>
                  <h3 className="text-lg font-medium text-gray-700 mb-3">Маленьке</h3>
                  <VideoThumbnail
                    thumbnail={testThumbnail}
                    videoUrl={testVideoUrl}
                    title="Маленьке відео"
                    className="h-32"
                    showTitle={true}
                  />
                </div>
              </div>
            </div>
          </section>

          {/* Кастомні стилі */}
          <section className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg shadow-lg p-8">
            <h2 className="text-2xl font-semibold text-gray-800 mb-6">
              4. З кастомними стилями
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <VideoThumbnail
                thumbnail={testThumbnail}
                videoUrl={testVideoUrl}
                title="Стильне відео 1"
                className="h-80 rounded-2xl shadow-2xl border-4 border-white"
                showTitle={true}
              />
              <VideoThumbnail
                thumbnail={testThumbnail}
                videoUrl={testVideoUrl}
                title="Стильне відео 2"
                className="h-80 rounded-2xl shadow-2xl border-4 border-white"
                showTitle={true}
              />
            </div>
          </section>

          {/* Портфоліо стиль */}
          <section className="bg-white rounded-lg shadow-lg p-8">
            <h2 className="text-2xl font-semibold text-gray-800 mb-6">
              5. Портфоліо стиль (як у вашому проекті)
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3, 4, 5, 6].map((item) => (
                <div key={item} className="group">
                  <VideoThumbnail
                    thumbnail={testThumbnail}
                    videoUrl={testVideoUrl}
                    title={`Портфоліо відео ${item}`}
                    className="h-80 rounded-xl shadow-lg group-hover:shadow-xl transition-shadow duration-300"
                    showTitle={true}
                  />
                  <div className="mt-4 text-center">
                    <h3 className="font-semibold text-gray-800">Проект {item}</h3>
                    <p className="text-sm text-gray-600">Опис проекту</p>
                  </div>
                </div>
              ))}
            </div>
          </section>
        </div>

        {/* Код приклади */}
        <div className="mt-16 bg-gray-900 rounded-lg p-8">
          <h2 className="text-2xl font-semibold text-white mb-6">
            Приклади коду
          </h2>
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-medium text-green-400 mb-2">
                Базове використання:
              </h3>
              <pre className="bg-gray-800 p-4 rounded text-green-300 text-sm overflow-x-auto">
{`<VideoThumbnail
  thumbnail="/path/to/thumbnail.jpg"
  videoUrl="https://example.com/video.mp4"
  title="Назва відео"
  className="h-64"
  showTitle={true}
/>`}
              </pre>
            </div>
            
            <div>
              <h3 className="text-lg font-medium text-green-400 mb-2">
                Без заголовка:
              </h3>
              <pre className="bg-gray-800 p-4 rounded text-green-300 text-sm overflow-x-auto">
{`<VideoThumbnail
  thumbnail="/path/to/thumbnail.jpg"
  videoUrl="https://example.com/video.mp4"
  className="h-48"
/>`}
              </pre>
            </div>
            
            <div>
              <h3 className="text-lg font-medium text-green-400 mb-2">
                Портфоліо стиль:
              </h3>
              <pre className="bg-gray-800 p-4 rounded text-green-300 text-sm overflow-x-auto">
{`<VideoThumbnail
  thumbnail="/path/to/thumbnail.jpg"
  videoUrl="https://example.com/video.mp4"
  title="Проект 1"
  className="h-80 rounded-xl shadow-lg"
  showTitle={true}
/>`}
              </pre>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
