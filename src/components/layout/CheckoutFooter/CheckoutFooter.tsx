"use client";

import Link from "next/link";
import s from "./CheckoutFooter.module.css";

export default function CheckoutFooter() {
  return (
    <footer className={s.footer}>
      <div className={s.footerContent}>
        <div className={s.block1}>
          <div className={s.contactsBlock}>
            <h3 className={s.columnTitle}>Контакти:</h3>
            <div className={s.contactNumberBlock}>
              <p className={s.contactNumber}>+38 (99) 999 99 99</p>
              <p className={s.contactEmail}>bfb@gmail.com</p>
            </div>
          </div>

          <div className={s.documentationBlock}>
            <h3 className={s.columnTitle}>Документація</h3>
            <div className={s.contactNumberBlock}>
              <ul className={s.list}>
                <li>
                  <Link href="/privacy">Політика конфіденційності</Link>
                </li>
                <li>
                  <Link href="/terms">Умови співпраці</Link>
                </li>
                <li>
                  <Link href="/return">Умови повернення, обміну та оплати</Link>
                </li>
              </ul>
            </div>
          </div>
        </div>

        <div className={s.block2}>
          <h3 className={s.columnTitle}>Режим роботи:</h3>
          <div className={s.contactNumberBlock}>
            <p className={s.schedule}>
              понеділок - п&apos;ятниця: 09:00 - 22:00,
            </p>
            <p className={s.schedule}>субота - неділя: 10:00 - 20:00</p>
          </div>
        </div>
      </div>
    </footer>
  );
}
