import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Умови використання | B.F.B Fitness",
  description: "Умови використання платформи B.F.B Fitness",
};

export default function TermsPage() {
  return (
    <div className="container mx-auto px-4 py-12 max-w-4xl">
      <h1 className="text-4xl font-bold mb-8">Умови використання</h1>
      
      <div className="prose prose-lg">
        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">1. Загальні положення</h2>
          <p>
            Використовуючи платформу B.F.B Fitness, ви погоджуєтесь з цими умовами використання.
            Будь ласка, уважно прочитайте їх перед використанням наших послуг.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">2. Використання послуг</h2>
          <p>
            Ви зобов'язуєтесь використовувати наші послуги тільки в законних цілях та відповідно
            до цих умов використання.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">3. Обмеження відповідальності</h2>
          <p>
            B.F.B Fitness не несе відповідальності за будь-які прямі або непрямі збитки,
            що виникли внаслідок використання наших послуг.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">4. Зміни умов</h2>
          <p>
            Ми залишаємо за собою право вносити зміни до цих умов використання в будь-який час.
            Продовжуючи користуватися нашими послугами після внесення змін, ви погоджуєтесь з новими умовами.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">5. Контакти</h2>
          <p>
            Якщо у вас є питання щодо цих умов використання, будь ласка, зв'яжіться з нами.
          </p>
        </section>
      </div>
    </div>
  );
}

