import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Політика конфіденційності | B.F.B Fitness",
  description: "Політика конфіденційності B.F.B Fitness",
};

export default function PrivacyPage() {
  return (
    <div className="container mx-auto px-4 py-12 max-w-4xl">
      <h1 className="text-4xl font-bold mb-8">Політика конфіденційності</h1>
      
      <div className="prose prose-lg">
        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">1. Збір інформації</h2>
          <p>
            Ми збираємо інформацію, яку ви надаєте нам під час реєстрації, замовлення послуг
            або спілкування з нами. Це може включати ваше ім'я, email, номер телефону та іншу контактну інформацію.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">2. Використання інформації</h2>
          <p>
            Ми використовуємо зібрану інформацію для:
          </p>
          <ul>
            <li>Надання та покращення наших послуг</li>
            <li>Комунікації з вами</li>
            <li>Обробки платежів</li>
            <li>Відправки маркетингових повідомлень (за вашою згодою)</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">3. Захист даних</h2>
          <p>
            Ми вживаємо відповідних заходів безпеки для захисту вашої особистої інформації
            від несанкціонованого доступу, зміни, розкриття або знищення.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">4. Передача даних третім особам</h2>
          <p>
            Ми не продаємо, не обмінюємо та не передаємо вашу особисту інформацію третім особам
            без вашої згоди, за винятком випадків, передбачених законом.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">5. Ваші права</h2>
          <p>
            Ви маєте право на доступ, виправлення або видалення вашої особистої інформації.
            Для цього зв'яжіться з нами.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">6. Зміни політики</h2>
          <p>
            Ми можемо оновлювати цю політику конфіденційності час від часу.
            Будь-які зміни будуть опубліковані на цій сторінці.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">7. Контакти</h2>
          <p>
            Якщо у вас є питання щодо цієї політики конфіденційності, зв'яжіться з нами.
          </p>
        </section>
      </div>
    </div>
  );
}

