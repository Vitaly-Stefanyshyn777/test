"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import s from "./Footer.module.css";
import {
  LogoHeader,
  InstagramIcon,
  FacebookIcon,
  TelegramIcon,
  PrivateIcon,
  ApplePayIcon,
  GooglePayIcon,
  MastercardIcon,
  VisardIcon,
  MonoPayIcon,
} from "../../Icons/Icons";

const Footer = () => {
  const pathname = usePathname();

  // Не показуємо футер на сторінках order-success та checkout
  if (pathname === "/order-success" || pathname === "/checkout") {
    return null;
  }

  return (
    <footer className={s.footer}>
      <div className={s.logoContainer}>
        <div className={s.logo}>
          <div className={s.brandLinkContainer}>
            <div className={s.logoIcon}>
              <LogoHeader />
            </div>
            <div className={s.brandNameContainer}>
              <p className={s.brandNameLineOne}>B.F.B</p>
              <p className={s.brandNameLineTwo}>Fitness</p>
            </div>
          </div>
        </div>
        <div className={s.authButtons}>
          <button className={s.loginButton}>Вхід</button>
          <button className={s.registerButton}>Реєстрація</button>
        </div>
      </div>
      <div className={s.footerTop}>
        <div className={s.divider}></div>

        {/* Основний контент футера */}
        <div className={s.footerMain}>
          {/* Контакти */}
          <div className={s.contactsContainer}>
            <div className={s.contactsSection}>
              <h3 className={s.sectionTitle}>КОНТАКТИ:</h3>
              <div className={s.contactInfo}>
                <a
                  href="tel:+380443338598"
                  className={`${s.contactLink} ${s.phoneLink}`}
                >
                  +38 (044) 333 85 98
                </a>
                <a
                  href="mailto:bfb@gmail.com"
                  className={`${s.contactLink} ${s.mailLink}`}
                >
                  bfb@gmail.com
                </a>
              </div>
              <div className={s.socialIcons}>
                <button className={s.iconButton}>
                  <InstagramIcon />
                </button>
                <button className={s.iconButton}>
                  <FacebookIcon />
                </button>
                <button className={s.iconButton}>
                  <TelegramIcon />
                </button>
              </div>
            </div>

            {/* Адреса */}
            <div className={s.addressSection}>
              <h3 className={s.sectionTitle}>АДРЕСА:</h3>
              <address className={s.address}>
                <p className={s.addressText}>
                  м. Мукачево, вул. Леся Курбаса 7
                </p>
                <p className={s.scheduleItem}>Пн-Пт: 09:00 - 22:00</p>
                <p className={s.scheduleItem}>Сб-Нд: 10:00 - 20:00</p>
              </address>
            </div>
          </div>

          {/* Навігація */}
          <div className={s.navigationSections}>
            <div className={s.navSection}>
              <h3 className={s.sectionTitle}>ПРО ПЛАТФОРМУ</h3>
              <ul className={s.navList}>
                <li className={s.navItem}>
                  <Link href="/" className={s.navLink}>
                    Головна
                  </Link>
                </li>
                <li className={s.navItem}>
                  <Link href="/about" className={s.navLink}>
                    Про BFB
                  </Link>
                </li>
                <li className={s.navItem}>
                  <Link href="/coaches" className={s.navLink}>
                    Про Інструкторство
                  </Link>
                </li>
                <li className={s.navItem}>
                  <Link href="/contacts" className={s.navLink}>
                    Контакти
                  </Link>
                </li>
              </ul>
            </div>

            <div className={s.navSection}>
              <h3 className={s.sectionTitle}>ПОСЛУГИ & ТОВАРИ</h3>
              <ul className={s.navList}>
                <li className={s.navItem}>
                  <Link href="/coaches" className={s.navLink}>
                    Каталог тренерів
                  </Link>
                </li>
                <li className={s.navItem}>
                  <Link href="/products" className={s.navLink}>
                    Каталог товарів
                  </Link>
                </li>
                <li className={s.navItem}>
                  <Link href="/online" className={s.navLink}>
                    Онлайн тренування
                  </Link>
                </li>
                <li className={s.navItem}>
                  <Link href="/programs" className={s.navLink}>
                    Навчальні програми
                  </Link>
                </li>
              </ul>
            </div>

            <div className={s.navSection}>
              <h3 className={s.sectionTitle}>ДОКУМЕНТАЦІЯ</h3>
              <ul className={s.navList}>
                <li className={s.navItem}>
                  <Link href="/privacy" className={s.navLink}>
                    Політика конфіденційності
                  </Link>
                </li>
                <li className={s.navItem}>
                  <Link href="/terms" className={s.navLink}>
                    Умови співпраці
                  </Link>
                </li>
                <li className={s.navItem}>
                  <Link href="/refunds" className={s.navLink}>
                    Умови повернення, обміну та оплати
                  </Link>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      <div className={s.divider}></div>

      {/* Нижня частина футера */}
      <div className={s.footerBottom}>
        <div>
          <p className={s.copyright}>©2024 BFB. All Rights Reserved.</p>
        </div>
        <div className={s.paymentMethods}>
          <Link href="/payment/privat24" className={s.paymentMethod}>
            <PrivateIcon />
          </Link>
          <Link href="/payment/applepay" className={s.paymentMethod}>
            <ApplePayIcon />
          </Link>
          <Link href="/payment/googlepay" className={s.paymentMethod}>
            <GooglePayIcon />
          </Link>
          <Link href="/payment/mastercard" className={s.paymentMethod}>
            <MastercardIcon />
          </Link>
          <Link href="/payment/visa" className={s.paymentMethod}>
            <VisardIcon />
          </Link>
          <Link href="/payment/monopay" className={s.paymentMethod}>
            <MonoPayIcon />
          </Link>
        </div>

        <p className={s.credits}>
          Сайт розроблено агентами:{" "}
          <a
            href="https://beforeafter.agency"
            target="_blank"
            rel="noopener noreferrer"
            className={s.creditsLink}
          >
            Before/After
          </a>
        </p>
      </div>
    </footer>
  );
};

export default Footer;
