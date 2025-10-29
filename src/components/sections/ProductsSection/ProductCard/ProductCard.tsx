"use client";
import React from "react";
import Image from "next/image";
import Link from "next/link";
import styles from "./ProductCard.module.css";
import { FavoriteHeader, BasketIcon, Smitnik2Icon } from "../../../Icons/Icons";
import { useCartStore } from "@/store/cart";
import { useAuthStore } from "@/store/auth";
import { useFavoriteStore } from "@/store/favorites";
import { selectIsFavorite } from "@/store/favorites";

interface ProductCardProps {
  id: string;
  name: string;
  price?: number;
  originalPrice?: number;
  discount?: number;
  isNew?: boolean;
  isHit?: boolean;
  // isFavorite prop removed; we derive from store
  image?: string;
  category?: string;
  categories?: Array<{ id: number; name: string; slug: string }>; // Категорії продукту
  stockStatus?: string;
  dateCreated?: string; // Дата створення продукту
  // WooCommerce v3 API data
  wcProduct?: {
    id: number;
    name: string;
    average_rating: string;
    rating_count: number;
    total_sales: number;
    featured: boolean;
    on_sale: boolean;
    price: string;
    regular_price: string;
    sale_price: string;
    images: Array<{ src: string; alt: string }>;
  };
  // All products for top 10 calculation
  allProducts?: Array<{ total_sales?: number }>;
  isNoCertificationFilter?: boolean; // Чи застосований фільтр "Немає сертифікації"
}

const ProductCard = ({
  id,
  name,
  price = 0,
  originalPrice,
  discount,
  isNew = false,
  isHit = false,
  // remove isFavorite prop, derive below
  image,
  categories,
  dateCreated,
  wcProduct,
  allProducts,
  isNoCertificationFilter = false,
}: ProductCardProps) => {
  // const isLoggedIn = useAuthStore((s) => s.isLoggedIn); // moved below
  const addItem = useCartStore((s) => s.addItem);
  const removeItem = useCartStore((s) => s.removeItem);
  const toggleFav = useFavoriteStore((s) => s.toggleFavorite);
  const cartItems = useCartStore((s) => s.items);
  const isInCart = cartItems[id] && cartItems[id].quantity > 0;
  const favorite = useFavoriteStore(selectIsFavorite(id));

  // Перевіряємо, чи продукт належить до категорії "НЕМАЄ СЕРТИФІКАЦІЇ" (78)
  const isNoCertificationProduct = categories?.some((cat) => cat.id === 78);

  const imageUrl = image || "/placeholder.svg";

  const toggleFavorite = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    toggleFav({ id, name, price, image });
  };

  const handleCartClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (isInCart) {
      removeItem(id);
    } else {
      addItem({ id, name, price: price || 0, image }, 1);
    }
  };

  // Функція для форматування ціни з Store API
  const formatPrice = (price: string) => {
    return (parseFloat(price) / 100).toLocaleString("uk-UA");
  };

  // Функція для розрахунку знижки
  const calculateDiscount = (salePrice: string, regularPrice: string) => {
    if (!salePrice || !regularPrice || salePrice === regularPrice) return 0;
    return Math.round(
      ((parseFloat(regularPrice) - parseFloat(salePrice)) /
        parseFloat(regularPrice)) *
        100
    );
  };

  // Визначаємо ціни та знижку з WooCommerce v3 API або fallback
  const currentPrice = wcProduct?.price || price.toString();
  const regularPrice = wcProduct?.regular_price || originalPrice?.toString();
  const salePrice = wcProduct?.sale_price;
  const isOnSale =
    wcProduct?.on_sale || (originalPrice && originalPrice > price);

  // Перевіряємо чи є знижка
  const hasDiscount =
    isOnSale && salePrice && regularPrice && salePrice !== regularPrice;
  const finalDiscount = hasDiscount
    ? calculateDiscount(salePrice, regularPrice)
    : discount ||
      (isOnSale && originalPrice && price
        ? Math.round(((originalPrice - price) / originalPrice) * 100)
        : 0);

  // Логіка цін з урахуванням авторизації (відповідно до детального алгоритму)
  const isLoggedIn = useAuthStore((state) => state.isLoggedIn);
  const authDiscount = 0.2; // 20% знижка для авторизованих

  // 1. Обираємо базову ціну (пріоритет: salePrice -> currentPrice -> regularPrice)
  const basePrice = salePrice || currentPrice || regularPrice;

  // 2. Розраховуємо відсоток акційної знижки
  const baseDiscount = (() => {
    if (salePrice && regularPrice) {
      return (
        ((parseFloat(regularPrice) - parseFloat(salePrice)) /
          parseFloat(regularPrice)) *
        100
      );
    }
    if (currentPrice && regularPrice && currentPrice < regularPrice) {
      return (
        ((parseFloat(regularPrice) - parseFloat(currentPrice)) /
          parseFloat(regularPrice)) *
        100
      );
    }
    return 0;
  })();

  // 3. Якщо користувач авторизований - від базової ціни віднімаємо ще 20%
  const finalPrice = (() => {
    if (!basePrice) return 0;

    const basePriceNum = parseFloat(basePrice);
    if (isLoggedIn) {
      // Для авторизованих: від basePrice віднімаємо 20%
      return basePriceNum * (1 - authDiscount);
    } else {
      // Для неавторизованих: показуємо basePrice
      return basePriceNum;
    }
  })();

  // 4. Загальна знижка для бейджа (від regular_price до finalPrice)
  const totalDiscount =
    regularPrice && finalPrice
      ? ((parseFloat(regularPrice) - finalPrice) / parseFloat(regularPrice)) *
        100
      : 0;

  // Форматуємо ціни для відображення
  const formattedFinalPrice = finalPrice
    ? formatPrice(finalPrice.toString())
    : "0";
  const formattedRegularPrice = formatPrice(regularPrice || "0");
  const formattedSalePrice = salePrice ? formatPrice(salePrice) : null;

  // Визначаємо, чи показувати знижку
  const showDiscount = totalDiscount > 0;

  // Логіка для підписки (якщо потрібно)
  const subscriptionPrice =
    isLoggedIn && basePrice ? Math.round(parseFloat(basePrice) * 0.8) : null;
  const baseNumeric = salePrice || regularPrice;
  const authFinalDiscount =
    salePrice && regularPrice
      ? Math.round((1 - parseFloat(salePrice) / parseFloat(regularPrice)) * 100)
      : 0;
  const combinedDiscountPercent = isLoggedIn
    ? authFinalDiscount + 20
    : authFinalDiscount;

  // Безпечне форматування ціни (fallback)
  const formatPriceFallback = (priceValue: number) => {
    return priceValue ? priceValue.toLocaleString() : "0";
  };

  // Функція для розрахунку "Новинка" (14 днів)
  const isNewProduct = (dateCreated?: string) => {
    if (!dateCreated) {
      return false;
    }

    const createdDate = new Date(dateCreated);
    const today = new Date();

    // Нормалізуємо дати до початку дня для правильної різниці
    const createdDateNormalized = new Date(
      createdDate.getFullYear(),
      createdDate.getMonth(),
      createdDate.getDate()
    );
    const todayNormalized = new Date(
      today.getFullYear(),
      today.getMonth(),
      today.getDate()
    );

    const daysDiff = Math.floor(
      (todayNormalized.getTime() - createdDateNormalized.getTime()) /
        (1000 * 60 * 60 * 24)
    );

    return daysDiff <= 14;
  };

  // Визначаємо чи є продукт новинкою
  const isActuallyNew = isNewProduct(dateCreated) || isNew;

  if (process.env.NODE_ENV !== "production") {
    try {
      console.group(`🔍 [ProductCard] ДЕТАЛЬНА ДІАГНОСТИКА - ID: ${id}`);

      console.log("=== ВХІДНІ ДАНІ ===");
      console.log("isLoggedIn:", isLoggedIn);
      console.log("regularPrice:", regularPrice);
      console.log("salePrice:", salePrice);
      console.log("currentPrice:", currentPrice);
      console.log("originalPrice:", originalPrice);
      console.log("price:", price);
      console.log("wcProduct:", wcProduct ? "є" : "немає");

      console.log("=== РОЗРАХУНКИ ===");
      console.log("basePrice:", basePrice);
      console.log("baseDiscount:", Math.round(baseDiscount * 100) / 100 + "%");
      console.log("finalPrice:", Math.round(finalPrice * 100) / 100);
      console.log(
        "totalDiscount:",
        Math.round(totalDiscount * 100) / 100 + "%"
      );
      console.log("authDiscount:", Math.round(authDiscount * 100) + "%");

      console.log("=== ПЕРЕВІРКА ЛОГІКИ ===");
      const regularPriceNum = regularPrice ? parseFloat(regularPrice) : 0;
      const salePriceNum = salePrice ? parseFloat(salePrice) : 0;
      const basePriceNum = basePrice ? parseFloat(basePrice) : 0;
      const baseDiscountCalc =
        salePrice && regularPrice
          ? ((parseFloat(regularPrice) - parseFloat(salePrice)) /
              parseFloat(regularPrice)) *
            100
          : 0;
      const totalDiscountCalc =
        regularPrice && finalPrice
          ? ((parseFloat(regularPrice) - finalPrice) /
              parseFloat(regularPrice)) *
            100
          : 0;

      console.log("regularPriceNum:", regularPriceNum);
      console.log("salePriceNum:", salePriceNum);
      console.log("basePriceNum:", basePriceNum);
      console.log("finalPriceNum:", finalPrice);
      console.log(
        "baseDiscountCalc:",
        Math.round(baseDiscountCalc * 100) / 100 + "%"
      );
      console.log(
        "totalDiscountCalc:",
        Math.round(totalDiscountCalc * 100) / 100 + "%"
      );

      console.log("=== ОЧІКУВАНІ РЕЗУЛЬТАТИ ===");
      console.log("Для sale=5000, regular=7000, авторизований:");
      console.log("- basePrice: 5000");
      console.log("- finalPrice: 5000 * 0.8 = 4000");
      console.log("- totalDiscount: (7000-4000)/7000*100 = 42.86%");
      console.log("- expectedBadge: -42.86%");

      console.log("=== ФОРМАТОВАНІ ЦІНИ ===");
      console.log("formattedFinalPrice:", formattedFinalPrice);
      console.log("formattedRegularPrice:", formattedRegularPrice);
      console.log("formattedSalePrice:", formattedSalePrice);

      console.groupEnd();
    } catch (e) {
      console.error("❌ [ProductCard] Помилка логування:", e);
    }
  }

  // Функція для розрахунку "Хіт" на основі топ 10 продажів
  const isHitProduct = (
    wcProduct?: {
      average_rating?: string;
      rating_count?: number;
      total_sales?: number;
      featured?: boolean;
      on_sale?: boolean;
    },
    allProducts?: Array<{ total_sales?: number }>
  ) => {
    if (!wcProduct || !allProducts) return false;

    const totalSales = parseInt(wcProduct.total_sales?.toString() || "0");

    // Якщо немає продажів, не показуємо хіт
    if (totalSales === 0) return false;

    // Отримуємо всі значення продажів та сортуємо
    const salesValues = allProducts
      .map((p) => parseInt(p.total_sales?.toString() || "0"))
      .filter((sales) => sales > 0)
      .sort((a, b) => b - a); // Сортуємо від більшого до меншого

    // Беремо топ 10 найбільших продажів
    const top10Sales = salesValues.slice(0, 10);

    // Перевіряємо чи поточний товар в топ 10
    return top10Sales.includes(totalSales) || isHit; // fallback до пропа
  };

  // Визначаємо чи є продукт хітом
  const isActuallyHit = isHitProduct(wcProduct, allProducts);

  // Перевіряємо чи є продукт в категорії "Немає сертифікату" (ID: 78)
  const hasNoCertification = categories?.some((cat) => cat.id === 78);

  // Визначаємо, чи показувати сіру кнопку
  const shouldShowDisabledButton =
    hasNoCertification || isNoCertificationFilter;

  return (
    <Link
      href={`/products/${id}`}
      className={styles.productCard}
      data-category={hasNoCertification ? "78" : undefined}
    >
      <div className={styles.cardImage}>
        <Image
          src={imageUrl}
          alt={name || "Товар без назви"}
          width={280}
          height={280}
          className={styles.productImage}
        />

        <div className={styles.badges}>
          {isLoggedIn ? (
            // Авторизований: показуємо загальну знижку
            totalDiscount > 0 && (
              <span className={`${styles.badge} ${styles.discountBadge}`}>
                -{Math.round(totalDiscount)}%
              </span>
            )
          ) : (
            // Неавторизований: показуємо акційну знижку + підписку
            <>
              {baseDiscount > 0 && (
                <span className={`${styles.badge} ${styles.discountBadge}`}>
                  -{Math.round(baseDiscount)}%
                </span>
              )}
              <span className={styles.subscriptionBadge}>
                -{Math.round(authDiscount * 100)}% при реєстрації
              </span>
            </>
          )}
          {isActuallyNew && (
            <span className={`${styles.badge} ${styles.newBadge}`}>
              Новинка
            </span>
          )}
          {isActuallyHit && (
            <span className={`${styles.badge} ${styles.hitBadge}`}>Хіт</span>
          )}
        </div>

        {/* Кнопка "Немає сертифікації" для категорії 78 */}
        {/* {hasNoCertification && (
          <div className={styles.noCertificationButton}>НЕМАЄ СЕРТИФІКАЦІЇ</div>
        )} */}

        <button
          className={`${styles.favoriteBtn} ${
            favorite ? styles.favoriteActive : ""
          }`}
          onClick={toggleFavorite}
        >
          {favorite ? <Smitnik2Icon /> : <FavoriteHeader />}
        </button>
      </div>

      <div className={styles.cardContent}>
        <h3 className={styles.productName}>{name || "Товар без назви"}</h3>
        <div className={styles.subscriptionBlock}>
          <div className={styles.subscriptionPrice}>
            {finalDiscount > 0 && (
              <div className={styles.subscriptionDiscount}>
                <span className={styles.subscriptionBadge}>
                  -{finalDiscount}% з підпискою
                </span>
              </div>
            )}

            <div className={styles.pricing}>
              {isLoggedIn ? (
                // Авторизовані: показуємо finalPrice та regularPrice (перекреслена)
                <div className={styles.subscriptionPriceAuth}>
                  <span className={styles.subNewPrice}>
                    {formattedFinalPrice} ₴
                  </span>
                  <span className={styles.subOldPrice}>
                    {formattedRegularPrice} ₴
                  </span>
                </div>
              ) : (
                // Неавторизовані: показуємо basePrice та regularPrice (якщо є знижка)
                <>
                  <span className={styles.currentPrice}>
                    {formattedSalePrice || formattedRegularPrice} ₴
                  </span>
                  {salePrice && (
                    <span className={styles.originalPrice}>
                      {formattedRegularPrice} ₴
                    </span>
                  )}
                  {!hasDiscount && originalPrice && originalPrice > price && (
                    <span className={styles.originalPrice}>
                      {formatPriceFallback(originalPrice)}
                    </span>
                  )}
                </>
              )}
            </div>
            <button
              className={`${styles.cartBtn} ${
                isInCart ? styles.cartBtnActive : ""
              } ${isNoCertificationProduct ? styles.cartBtnNoCert : ""}`}
              onClick={shouldShowDisabledButton ? undefined : handleCartClick}
              disabled={shouldShowDisabledButton}
              title={
                shouldShowDisabledButton ? "Немає сертифікації" : undefined
              }
            >
              {isInCart ? <Smitnik2Icon /> : <BasketIcon />}
            </button>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default ProductCard;
