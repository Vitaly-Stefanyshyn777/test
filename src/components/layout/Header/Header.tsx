"use client";

import { useEffect, useState, useCallback, useMemo } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuthStore } from "@/store/auth";
import s from "./Header.module.css";
import {
  BasketHeader,
  BurgerMenu,
  FacebookIcon,
  CloseButtonIcon,
  FavoriteHeader,
  InstagramIcon,
  LogoHeader,
  NumberHeader,
  TelegramIcon,
  UserHeader,
  WhatsappIcon,
} from "../../Icons/Icons";
import RegisterModal from "@/components/auth/RegisterModal/RegisterModal";
import LoginModal from "@/components/auth/LoginModal/LoginModal";
import { useCartStore } from "@/store/cart";
import { useFavoriteStore } from "@/store/favorites";
import CartModal from "../../CartModal/CartModal";
import FavoritesModal from "../../FavoritesModal/FavoritesModal";
import { mainNavigation, burgerMenuNavigation } from "@/lib/navigation";

export default function Header() {
  const [headerClass, setHeaderClass] = useState("");
  const [, setIsScrolled] = useState(false);
  const pathname = usePathname();
  const [isRegisterOpen, setIsRegisterOpen] = useState(false);
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { isLoggedIn } = useAuthStore();
  const isHydrated = useAuthStore((s) => s.isHydrated);
  const openCart = useCartStore((s) => s.open);
  const openFav = useFavoriteStore((s) => s.open);

  // Використовуємо useMemo для кешування результатів
  const cartItemsMap = useCartStore((s) => s.items);
  const favoriteItemsMap = useFavoriteStore((s) => s.items);

  const cartItems = useMemo(() => Object.values(cartItemsMap), [cartItemsMap]);
  const favoriteItems = useMemo(
    () => Object.values(favoriteItemsMap),
    [favoriteItemsMap]
  );

  const cartCount = useMemo(
    () => cartItems.reduce((sum, item) => sum + item.quantity, 0),
    [cartItems]
  );
  const favoriteCount = useMemo(() => favoriteItems.length, [favoriteItems]);

  const getHeaderColorByPath = useCallback(() => {
    if (pathname.startsWith("/trainers/")) return s.headerTrainerProfile;
    if (pathname === "/trainers") return s.headerTrainers;
    if (pathname === "/courses") return s.headerTrainerProfile;
    if (pathname.startsWith("/courses/")) return s.headerTrainerProfile;
    if (pathname === "/courses-landing") return s.headerTrainerProfile;
    if (pathname === "/photo-session") return s.headerTrainerProfile;
    if (pathname === "/about-bfb") return s.headerTrainerProfile;
    if (pathname === "/course") return s.headerTrainerProfile;
    if (pathname.startsWith("/profile")) return s.headerTrainerProfile;
    if (pathname === "/shop") return s.headerShop;
    if (pathname === "/instructing") return s.headerInstructing;
    // Treat both catalog and product detail routes as product header style
    if (pathname.startsWith("/products")) return s.headerProduct;
    return "";
  }, [pathname]);

  useEffect(() => {
    setHeaderClass(getHeaderColorByPath());
  }, [pathname, getHeaderColorByPath]);

  useEffect(() => {
    const handleScroll = () => {
      const baseClass = getHeaderColorByPath();
      const heroSection = document.querySelector("[data-hero-section]");

      if (heroSection) {
        const heroBottom = heroSection.getBoundingClientRect().bottom;
        if (heroBottom < 0) {
          // Вийшли з хіро секції
          setHeaderClass(`${baseClass} ${s.headerScrolled}`);
        } else {
          // Ще в хіро секції
          setHeaderClass(baseClass);
        }
      } else {
        // Якщо хіро секції немає, використовуємо стару логіку
        if (window.scrollY > 100) {
          setHeaderClass(`${baseClass} ${s.headerScrolled}`);
        } else {
          setHeaderClass(baseClass);
        }
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [pathname, getHeaderColorByPath]);

  const handleUserIconClick = () => {
    if (isLoggedIn) {
      window.location.href = "/profile";
    } else {
      setIsLoginOpen(true);
    }
  };

  const handleLoginSuccess = async () => {
    setIsLoginOpen(false);
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  // Блокуємо скролінг коли меню відкрите
  useEffect(() => {
    if (isMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }

    // Очищуємо стилі при розмонтуванні компонента
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isMenuOpen]);

  // Обробник скролу для зміни кольору хедера
  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY;
      setIsScrolled(scrollTop > 50); // Змінюємо колір після 50px скролу
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Не показуємо хедер на сторінках order-success та checkout
  if (pathname === "/order-success" || pathname === "/checkout") {
    return null;
  }

  return (
    <header className={`${s.header} ${headerClass}`}>
      <div className={s.headerTrainerProfileBlock}>
        <div className={s.left}>
          <button className={s.burger} onClick={toggleMenu}>
            <BurgerMenu />
          </button>
          <nav className={s.nav}>
            {mainNavigation.slice(2).map((item) => (
              <Link key={item.href} href={item.href}>
                {item.label}
              </Link>
            ))}
          </nav>
        </div>

        <div className={s.logo}>
          <div className={s.LogoIcon}>
            <LogoHeader />
          </div>
          <Link href="/">B.F.B Fitness</Link>
        </div>

        <div className={s.right}>
          <div className={s.phone}>
            <NumberHeader />
            <div className={s.contacts}>
              <p className={s.contactText}>Ми на зв&apos;язку:</p>
              <div className={s.phoneWrapper}>
                <a href="tel:+380443338598" className={s.phoneLink}>
                  +38 (044) 333 85 98
                </a>
              </div>
            </div>
          </div>

          <div className={s.headerActions}>
            <div className={s.icons}>
              <button className={s.iconBtn} onClick={openFav}>
                <FavoriteHeader />
                {favoriteCount > 0 && (
                  <span className={s.badge}>{favoriteCount}</span>
                )}
              </button>
              <button className={s.iconBtn} onClick={openCart}>
                <BasketHeader />
                {cartCount > 0 && <span className={s.badge}>{cartCount}</span>}
              </button>
              <button
                className={s.iconBtn}
                onClick={handleUserIconClick}
                title={
                  isHydrated
                    ? isLoggedIn
                      ? "Особистий кабінет"
                      : "Увійти"
                    : "Профіль"
                }
                suppressHydrationWarning
              >
                <UserHeader />
              </button>
            </div>

            <div className={s.authButtons}>
              {isHydrated && !isLoggedIn && (
                <button
                  className={s.register}
                  onClick={() => setIsRegisterOpen(true)}
                >
                  Реєстрація
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      <RegisterModal
        isOpen={isRegisterOpen}
        onClose={() => setIsRegisterOpen(false)}
      />
      <LoginModal
        isOpen={isLoginOpen}
        onClose={() => setIsLoginOpen(false)}
        onSubmit={handleLoginSuccess}
      />
      <CartModal />
      <FavoritesModal />

      {/* Desktop Menu */}
      {isMenuOpen && (
        <div className={s.menuOverlay} onClick={toggleMenu}>
          <div className={s.menuContainer} onClick={(e) => e.stopPropagation()}>
            <div className={s.menuContent}>
              <div className={s.menuHeader}>
                <h5 className={s.menuTitle}>Меню</h5>
                <button className={s.menuClose} onClick={toggleMenu}>
                  <CloseButtonIcon />
                </button>
              </div>

              <div className={s.menuSection}>
                <p className={s.sectionTitle}>B.F.B Напрямок:</p>

                <div className={s.menuItemBlock}>
                  {burgerMenuNavigation.main.map((item) => (
                    <Link
                      key={item.href}
                      href={item.href}
                      className={s.menuLink}
                      onClick={closeMenu}
                    >
                      {item.label}
                    </Link>
                  ))}
                </div>
              </div>

              <div className={s.menuSection}>
                <p className={s.sectionTitle}>Додатково</p>
                <div className={s.menuItemBlock}>
                  {burgerMenuNavigation.additional.map((item) => (
                    <Link
                      key={item.href}
                      href={item.href}
                      className={s.menuLink}
                      onClick={closeMenu}
                    >
                      {item.label}
                    </Link>
                  ))}
                </div>
              </div>
            </div>

            <div className={s.contactInfoContainer}>
              <div className={s.contactGrid}>
                <div className={s.contactRow}>
                  <div className={s.contactItem}>
                    <h5 className={s.contactLabel}>Телефон</h5>
                    <p className={s.contactValue}>+38 (044) 333 85 98</p>
                  </div>
                  <div className={s.contactItem}>
                    <h5 className={s.contactLabel}>Час роботи у вихідні:</h5>
                    <p className={s.contactValue}>10:00 - 20:00</p>
                  </div>
                </div>

                <div className={s.contactRow}>
                  <div className={s.contactItem}>
                    <h5 className={s.contactLabel}>Email:</h5>
                    <p className={s.contactValue}>bfb@gmail.com</p>
                  </div>
                  <div className={s.contactItem}>
                    <h5 className={s.contactLabel}>Час роботи у будні:</h5>
                    <p className={s.contactValue}>10:00 - 20:00</p>
                  </div>
                </div>
              </div>

              <div className={s.addressSection}>
                <h5 className={s.contactLabel}>Адреса головного залу:</h5>
                <p className={s.contactValue}>
                  м. Київ, Хрещатик, будинок 23/A
                </p>
              </div>

              <div className={s.socialSection}>
                <div className={s.socialIcon}>
                  <InstagramIcon />
                </div>
                <div className={s.socialIcon}>
                  <FacebookIcon />
                </div>
                <div className={s.socialIcon}>
                  <TelegramIcon />
                </div>
                <div className={s.socialIcon}>
                  <WhatsappIcon />
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
