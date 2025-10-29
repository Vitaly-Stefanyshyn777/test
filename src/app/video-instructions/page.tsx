'use client';

import VideoInstruction from '@/components/VideoInstruction';

export default function VideoInstructionsPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Приклади використання VideoInstruction
          </h1>
          <p className="text-xl text-gray-600">
            Різні варіанти компонента VideoInstruction для різних потреб
          </p>
        </div>

        <div className="space-y-16">
          {/* Стандартний варіант */}
          <section className="bg-white rounded-lg shadow-lg p-8">
            <h2 className="text-2xl font-semibold text-gray-800 mb-6">
              1. Стандартний варіант
            </h2>
            <VideoInstruction
              title="Стандартне відео"
              description="Звичайний варіант з заголовком, описом та контролами"
              videoClassName="h-96 rounded-lg"
            />
          </section>

          {/* Мінімальний варіант */}
          <section className="bg-white rounded-lg shadow-lg p-8">
            <h2 className="text-2xl font-semibold text-gray-800 mb-6">
              2. Мінімальний варіант
            </h2>
            <VideoInstruction
              showTitle={false}
              showDescription={false}
              videoClassName="h-64 rounded-lg"
            />
          </section>

          {/* Автоплеєр */}
          <section className="bg-white rounded-lg shadow-lg p-8">
            <h2 className="text-2xl font-semibold text-gray-800 mb-6">
              3. Автоплеєр (заглушений)
            </h2>
            <VideoInstruction
              title="Автоматичне відтворення"
              description="Відео автоматично починає відтворення (заглушено для кращого UX)"
              videoClassName="h-80 rounded-lg"
              autoPlay={true}
              muted={true}
              controls={true}
            />
          </section>

          {/* Без контролів */}
          <section className="bg-white rounded-lg shadow-lg p-8">
            <h2 className="text-2xl font-semibold text-gray-800 mb-6">
              4. Без контролів (клік для відтворення)
            </h2>
            <VideoInstruction
              title="Клік для відтворення"
              description="Відео без стандартних контролів - клікніть для відтворення"
              videoClassName="h-80 rounded-lg"
              controls={false}
            />
          </section>

          {/* Компактний варіант */}
          <section className="bg-white rounded-lg shadow-lg p-8">
            <h2 className="text-2xl font-semibold text-gray-800 mb-6">
              5. Компактний варіант
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <VideoInstruction
                title="Невелике відео"
                description="Компактний розмір"
                videoClassName="h-48 rounded-lg"
                showDescription={false}
              />
              <VideoInstruction
                title="Ще одне відео"
                description="Поруч з першим"
                videoClassName="h-48 rounded-lg"
                showDescription={false}
              />
            </div>
          </section>

          {/* З кастомним стилем */}
          <section className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg shadow-lg p-8">
            <h2 className="text-2xl font-semibold text-gray-800 mb-6">
              6. З кастомним стилем
            </h2>
            <VideoInstruction
              title="Стильне відео"
              description="З градієнтним фоном та особливим дизайном"
              className="text-center"
              videoClassName="h-96 rounded-xl shadow-2xl border-4 border-white"
              showTitle={true}
              showDescription={true}
            />
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
{`<VideoInstruction
  title="Заголовок відео"
  description="Опис відео"
  videoClassName="h-96 rounded-lg"
/>`}
              </pre>
            </div>
            
            <div>
              <h3 className="text-lg font-medium text-green-400 mb-2">
                Мінімальний варіант:
              </h3>
              <pre className="bg-gray-800 p-4 rounded text-green-300 text-sm overflow-x-auto">
{`<VideoInstruction
  showTitle={false}
  showDescription={false}
  videoClassName="h-64 rounded-lg"
/>`}
              </pre>
            </div>
            
            <div>
              <h3 className="text-lg font-medium text-green-400 mb-2">
                Автоплеєр:
              </h3>
              <pre className="bg-gray-800 p-4 rounded text-green-300 text-sm overflow-x-auto">
{`<VideoInstruction
  title="Автоплеєр"
  autoPlay={true}
  muted={true}
  videoClassName="h-80 rounded-lg"
/>`}
              </pre>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
