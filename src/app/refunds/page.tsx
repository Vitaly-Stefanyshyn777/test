import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Політика повернення коштів | B.F.B Fitness",
  description: "Умови повернення коштів B.F.B Fitness",
};

export default function RefundsPage() {
  return (
    <div className="container mx-auto px-4 py-12 max-w-4xl">
      <h1 className="text-4xl font-bold mb-8">Політика повернення коштів</h1>
      
      <div className="prose prose-lg">
        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">1. Загальні умови</h2>
          <p>
            Ми прагнемо забезпечити найвищу якість наших послуг. Якщо ви не задоволені купівлею,
            ви можете звернутися до нас для повернення коштів згідно з цими умовами.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">2. Цифрові продукти</h2>
          <p>
            Повернення коштів за цифрові продукти (онлайн-курси, відео-уроки) можливе протягом
            14 днів з моменту покупки, якщо ви не почали використовувати продукт.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">3. Фізичні товари</h2>
          <p>
            Фізичні товари можна повернути протягом 14 днів з моменту отримання,
            якщо вони не були у використанні та збережена оригінальна упаковка.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">4. Процедура повернення</h2>
          <p>
            Для ініціювання процедури повернення коштів:
          </p>
          <ul>
            <li>Зв'яжіться з нашою службою підтримки</li>
            <li>Надайте номер замовлення та причину повернення</li>
            <li>Дочекайтеся підтвердження від нашої команди</li>
            <li>Для фізичних товарів - відправте товар назад за нашою адресою</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">5. Строки повернення коштів</h2>
          <p>
            Після схвалення запиту на повернення, кошти будуть повернені протягом 5-10 робочих днів
            на той самий спосіб оплати, який використовувався при покупці.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">6. Виключення</h2>
          <p>
            Повернення коштів не можливе для:
          </p>
          <ul>
            <li>Послуг, які вже було надано</li>
            <li>Персональних тренувань, які відбулися</li>
            <li>Цифрових продуктів, які були повністю використані</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">7. Контакти</h2>
          <p>
            З питань повернення коштів звертайтесь до нашої служби підтримки.
          </p>
        </section>
      </div>
    </div>
  );
}

