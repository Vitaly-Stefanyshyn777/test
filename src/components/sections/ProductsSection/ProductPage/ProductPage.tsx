"use client";
import React, { useState } from "react";
import { useFavoriteStore, selectIsFavorite } from "@/store/favorites";
import Image from "next/image";
import { useProductQuery } from "@/components/hooks/useProductsQuery";
import { useProductsByCategory } from "@/components/hooks/useFilteredProducts";
import ProductCard from "@/components/sections/ProductsSection/ProductCard/ProductCard";
import SliderNav from "@/components/ui/SliderNav/SliderNavActions";
import {
  FavoriteHeader,
  BasketHeader,
  Smitnik2Icon,
  MinuswIcon,
  PlusIcon,
  CheckMarkIcon,
  CloseButtonIcon,
  СhevronIcon,
  GiftIcon,
} from "@/components/Icons/Icons";
import styles from "./ProductPage.module.css";
import FAQSection from "../../FAQSection/FAQSection";
import { useAuthStore } from "@/store/auth";
import RegisterModal from "@/components/auth/RegisterModal/RegisterModal";

export default function ProductPage({ productId }: { productId: string }) {
  const { data: product, isLoading, isError } = useProductQuery(productId);
  // Товари для спорту (категорія 30)
  const { data: relatedCategoryProducts = [] } = useProductsByCategory("30");

  const [slideIdx, setSlideIdx] = useState(0);
  const itemsPerView = 5;

  const [selectedSize, setSelectedSize] = useState("Big");
  const [quantity, setQuantity] = useState(1);
  const isFavorite = useFavoriteStore(selectIsFavorite(productId));
  const toggleFav = useFavoriteStore((s) => s.toggleFavorite);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  type SectionKey =
    | "description"
    | "delivery"
    | "payment"
    | "return"
    | "characteristics";
  const [expandedSections, setExpandedSections] = useState<
    Record<SectionKey, boolean>
  >({
    description: true, // Завжди відкрита
    delivery: true, // Відкрита за замовчуванням
    payment: true, // Відкрита за замовчуванням
    return: true, // Відкрита за замовчуванням
    characteristics: true,
  });

  const isLoggedIn = useAuthStore((s) => s.isLoggedIn);
  const isControlsDisabled = !isLoggedIn;
  const [isRegisterOpen, setIsRegisterOpen] = useState(false);

  if (isLoading) return <div className={styles.loading}>Завантаження...</div>;
  if (isError || !product)
    return <div className={styles.error}>Товар не знайдено</div>;

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

  // Функція для розрахунку "Хіт" на основі топ 10 продажів
  const isHitProduct = () => {
    if (!product || !relatedCategoryProducts) return false;

    // Отримуємо всі продукти з WooCommerce API
    const wcProducts = (
      relatedCategoryProducts as unknown as Array<Record<string, unknown>>
    ).filter((p) => (p as { total_sales?: unknown }).total_sales !== undefined);

    if (wcProducts.length === 0) return false;

    // Отримуємо всі значення продажів та сортуємо
    const salesValues = wcProducts
      .map((p) =>
        parseInt(
          (
            (p as { total_sales?: unknown }).total_sales as unknown as
              | string
              | number
              | undefined
          )?.toString() || "0"
        )
      )
      .filter((sales) => sales > 0)
      .sort((a, b) => b - a); // Сортуємо від більшого до меншого

    // Беремо топ 10 найбільших продажів
    const top10Sales = salesValues.slice(0, 10);

    // Перевіряємо чи поточний товар в топ 10
    const currentProductSales = parseInt(
      (product as unknown as { total_sales?: unknown }).total_sales
        ? (
            (product as unknown as { total_sales?: unknown })
              .total_sales as unknown as string | number
          ).toString()
        : "0"
    );
    return top10Sales.includes(currentProductSales);
  };

  // Визначаємо чи є продукт новинкою
  const isActuallyNew = isNewProduct(product.dateCreated);

  // Визначаємо чи є продукт хітом
  const isActuallyHit = isHitProduct();

  // Функція для розрахунку знижки
  const calculateDiscount = () => {
    if (!product.regularPrice || !product.price) return 0;
    const regularPrice = parseFloat(product.regularPrice.toString());
    const salePrice = parseFloat(product.price.toString());
    if (regularPrice <= salePrice) return 0;
    return Math.round(((regularPrice - salePrice) / regularPrice) * 100);
  };

  const discountPercentage = calculateDiscount();
  const hasDiscount = discountPercentage > 0;

  const sizes = ["Standart", "Medium", "Big"];

  const toggleSection = (section: SectionKey) => {
    setExpandedSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

  const addToCart = () => {};

  // const toggleFavorite = () => {
  //   setIsFavorite(!isFavorite);
  // };

  const isAvailable =
    typeof product.stockQuantity === "number"
      ? product.stockQuantity > 0
      : true;

  type ProductLike = {
    id: number | string;
    name: string;
    price?: string | number;
    regular_price?: string | number;
    regularPrice?: string | number;
    on_sale?: boolean;
    onSale?: boolean;
    images?: Array<{ src: string }>;
    categories?: Array<{ name: string }>;
    isNew?: boolean;
    isHit?: boolean;
  };

  const mappedRelated = Array.isArray(relatedCategoryProducts)
    ? (relatedCategoryProducts as ProductLike[]).slice(0, 12).map((p) => ({
        id: String(p.id),
        name: p.name,
        price: Number(p.price) || 0,
        originalPrice: Number(p.regular_price || p.regularPrice) || undefined,
        discount:
          p.on_sale || p.onSale
            ? Math.max(
                0,
                Math.round(
                  ((Number(p.regular_price || p.regularPrice) -
                    Number(p.price)) /
                    Number(p.regular_price || p.regularPrice)) *
                    100
                )
              )
            : 0,
        isNew: !!p.isNew,
        isHit: !!p.isHit,
        image: p.images?.[0]?.src || "/placeholder.svg",
        category: p.categories?.[0]?.name,
      }))
    : [];

  const totalSlides = Math.max(
    1,
    Math.ceil(mappedRelated.length / itemsPerView)
  );
  const start = slideIdx * itemsPerView;
  const visible = mappedRelated.slice(start, start + itemsPerView);
  const onPrev = () =>
    setSlideIdx((idx) => (idx - 1 + totalSlides) % totalSlides);
  const onNext = () => setSlideIdx((idx) => (idx + 1) % totalSlides);

  return (
    <div className={styles.productPage}>
      <div className={styles.productContainer}>
        <div className={styles.imageSection}>
          <div className={styles.thumbnails}>
            {product.images.map((image, index) => (
              <button
                key={index}
                className={`${styles.thumbnail} ${
                  selectedImageIndex === index ? styles.active : ""
                }`}
                onClick={() => setSelectedImageIndex(index)}
              >
                <Image
                  src={image.src}
                  alt={image.alt}
                  width={80}
                  height={80}
                  className={styles.thumbnailImage}
                />
              </button>
            ))}
          </div>

          <div className={styles.mainImage}>
            <Image
              src={
                product.images[selectedImageIndex]?.src || "/placeholder.svg"
              }
              alt={product.name}
              width={500}
              height={500}
              className={styles.productImage}
            />
            {/* Маркери на зображенні */}
            <div className={styles.imageBadges}>
              {isActuallyNew && (
                <span
                  className={`${styles.imageBadge} ${styles.newImageBadge}`}
                >
                  Новинка
                </span>
              )}
              {hasDiscount && (
                <span
                  className={`${styles.imageBadge} ${styles.discountImageBadge}`}
                >
                  -{discountPercentage}%
                </span>
              )}
              {isActuallyHit && (
                <span
                  className={`${styles.imageBadge} ${styles.hitImageBadge}`}
                >
                  Хіт
                </span>
              )}
            </div>
          </div>
        </div>

        <div className={styles.productInfo}>
          <div className={styles.productInfoBlock}>
            <div className={styles.categoryTagBlock}>
              <div className={styles.categoryTag}>Борди</div>
              <div className={styles.titleWithBadges}>
                <h1 className={styles.productTitle}>{product.name}</h1>
                <div className={styles.productBadges}>
                  {isActuallyHit && (
                    <span className={`${styles.badge} ${styles.hitBadge}`}>
                      Хіт
                    </span>
                  )}
                </div>
              </div>
              <p className={styles.productText}>
                Комфортний килимок для пілатесу забезпечує зручність під час
                занять пілатесом та м&#39;якою гімнастикою.
              </p>
            </div>

            <div className={styles.productDescriptionBlock}>
              <div className={styles.colorSection}>
                <h3>Колір:</h3>
                <div className={styles.colorOptions}>
                  {product.images.map((img, index) => (
                    <button
                      key={`color-thumb-${index}`}
                      className={`${styles.colorImageOption} ${
                        selectedImageIndex === index ? styles.selected : ""
                      }`}
                      onClick={() => {
                        setSelectedImageIndex(index);
                      }}
                      title={img.alt || `Колір ${index + 1}`}
                    >
                      <Image
                        src={img.src}
                        alt={img.alt || "color option"}
                        width={80}
                        height={80}
                        className={styles.colorImage}
                      />
                    </button>
                  ))}
                </div>
              </div>

              <div className={styles.sizeSection}>
                <h3>Розмір:</h3>
                <div className={styles.sizeOptions}>
                  {sizes.map((size) => (
                    <button
                      key={size}
                      className={`${styles.sizeButton} ${
                        selectedSize === size ? styles.selected : ""
                      }`}
                      onClick={() => setSelectedSize(size)}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className={styles.currenInfoBlock}>
              <div className={styles.priceSection}>
                <div className={styles.currentPrice}>
                  {parseFloat(product.price.toString()).toLocaleString()} ₴
                </div>
                {hasDiscount && product.regularPrice && (
                  <div className={styles.originalPrice}>
                    {parseFloat(
                      product.regularPrice.toString()
                    ).toLocaleString()}{" "}
                    ₴
                  </div>
                )}
              </div>

              <div className={styles.subscriptionOffer}>
                <span className={styles.subscriptionIcon}>
                  <GiftIcon />
                </span>
                <span>
                  Оформіть підписку — отримайте знижки та доступ до ексклюзивних
                  функцій!
                </span>
              </div>

              {!isLoggedIn && (
                <div className={styles.registerCallout}>
                  <div
                    className={styles.registerBlock}
                    onClick={() => setIsRegisterOpen(true)}
                    style={{ cursor: "pointer" }}
                  >
                    <p className={styles.registerText}>
                      Зареєструйтесь, щоб придбати борд
                    </p>
                  </div>

                  <button
                    className={styles.registerBtn}
                    onClick={() => setIsRegisterOpen(true)}
                  >
                    Зареєструватися
                  </button>
                </div>
              )}

              <div className={styles.actionButtons}>
                <div className={`${styles.quantitySection}`}>
                  <div
                    className={`${styles.quantityControls} ${
                      isControlsDisabled ? styles.quantityDisabled : ""
                    }`}
                  >
                    <button
                      onClick={() =>
                        !isControlsDisabled &&
                        setQuantity(Math.max(1, quantity - 1))
                      }
                      disabled={isControlsDisabled}
                    >
                      <MinuswIcon />
                    </button>
                    <input
                      type="number"
                      value={quantity}
                      onChange={(e) =>
                        !isControlsDisabled &&
                        setQuantity(Math.max(1, parseInt(e.target.value) || 1))
                      }
                      min="1"
                      disabled={isControlsDisabled}
                    />
                    <button
                      onClick={() =>
                        !isControlsDisabled && setQuantity(quantity + 1)
                      }
                      disabled={isControlsDisabled}
                    >
                      <PlusIcon />
                    </button>
                  </div>
                </div>
                <button
                  className={`${styles.addToCartBtn} ${
                    isControlsDisabled ? styles.addToCartBtnDisabled : ""
                  }`}
                  onClick={() => {
                    if (isControlsDisabled) return;
                    addToCart();
                  }}
                  disabled={isControlsDisabled}
                >
                  <BasketHeader />
                  Додати в кошик
                </button>
                <button
                  className={`${styles.favoriteBtn} ${
                    isFavorite ? styles.favoriteActive : ""
                  } ${isControlsDisabled ? styles.favoriteBtnDisabled : ""}`}
                  onClick={() => {
                    if (isControlsDisabled) return;
                    toggleFav({
                      id: productId,
                      name: product?.name || "",
                      // price: product?.price || 0,
                      image: product?.image,
                    });
                  }}
                  title="Додати в улюблені"
                  disabled={isControlsDisabled}
                >
                  {isFavorite ? <Smitnik2Icon /> : <FavoriteHeader />}
                </button>
              </div>

              <div className={styles.detailsRow}>
                <div className={styles.availability}>
                  <span className={styles.checkmark}>
                    {isAvailable ? <CheckMarkIcon /> : <CloseButtonIcon />}
                  </span>
                  <span className={styles.detailText}>
                    {isAvailable ? "В наявності" : "Немає в наявності"}
                  </span>
                </div>
                <div className={styles.productCode}>
                  <p className={styles.productText}>Код товару:</p>{" "}
                  {product.sku || "10001"}
                </div>
              </div>
            </div>
          </div>

          <div className={styles.expandableSections}>
            <div className={styles.section}>
              <div className={styles.sectionHeader}>
                <span>Опис товару</span>
              </div>
              <div className={styles.sectionContent}>
                {product.description?.trim() ||
                product.shortDescription?.trim() ? (
                  <div
                    className={styles.sectionContentText}
                    dangerouslySetInnerHTML={{
                      __html:
                        product.description?.trim() ||
                        product.shortDescription?.trim() ||
                        "",
                    }}
                  />
                ) : (
                  <p className={styles.sectionContentText}>
                    Поки що опис відсутній
                  </p>
                )}
              </div>
            </div>

            <div className={styles.section}>
              <button
                className={styles.sectionHeader}
                onClick={() => toggleSection("delivery")}
              >
                <span>Доставка</span>
                <span
                  className={`${styles.chevron} ${
                    expandedSections.delivery ? styles.rotated : ""
                  }`}
                >
                  <СhevronIcon />
                </span>
              </button>
              {expandedSections.delivery && (
                <div className={styles.sectionContent}>
                  <p className={styles.sectionContentText}>
                    Нова Пошта (2-3 дні), самовивіз в Мукачево, міжнародна
                    доставка. Уточнення в Instagram.
                  </p>
                </div>
              )}
            </div>

            <div className={styles.section}>
              <button
                className={styles.sectionHeader}
                onClick={() => toggleSection("payment")}
              >
                <span>Оплата</span>
                <span
                  className={`${styles.chevron} ${
                    expandedSections.payment ? styles.rotated : ""
                  }`}
                >
                  <СhevronIcon />
                </span>
              </button>
              {expandedSections.payment && (
                <div className={styles.sectionContent}>
                  <p className={styles.sectionContentText}>
                    Онлайн карткою (Visa/MasterCard), готівкою при отриманні з
                    можливістю перевірки, Apple Pay/Google Pay.
                  </p>
                </div>
              )}
            </div>

            <div className={styles.section}>
              <button
                className={styles.sectionHeader}
                onClick={() => toggleSection("return")}
              >
                <span>Обмін та повернення</span>
                <span
                  className={`${styles.chevron} ${
                    expandedSections.return ? styles.rotated : ""
                  }`}
                >
                  <СhevronIcon />
                </span>
              </button>
              {expandedSections.return && (
                <div className={styles.sectionContent}>
                  <p className={styles.sectionContentText}>
                    Клієнтоорієнтована політика обміну та повернення.
                    Звертайтесь до менеджера.
                  </p>
                </div>
              )}
            </div>

            <div className={styles.section}>
              <button
                className={styles.sectionHeader}
                onClick={() => toggleSection("characteristics")}
              >
                <span>Характеристики</span>
                <span
                  className={`${styles.chevron} ${
                    expandedSections.characteristics ? styles.rotated : ""
                  }`}
                >
                  <СhevronIcon />
                </span>
              </button>
              {expandedSections.characteristics && (
                <div className={styles.sectionContent}>
                  <div className={styles.sectionContentBlock}>
                    <div className={styles.characteristicsTitle}>
                      Габарити та вага:
                    </div>
                    <div className={styles.characteristics}>
                      <div className={styles.characteristic}>
                        <span>Довжина:</span>
                        <span style={{ textAlign: "center", color: "#0e0e0e" }}>
                          {product.dimensions?.length?.trim()
                            ? `${product.dimensions?.length} см`
                            : "Поки що поле відсутнє"}
                        </span>
                      </div>
                      <div className={styles.characteristic}>
                        <span>Ширина:</span>
                        <span style={{ textAlign: "center", color: "#0e0e0e" }}>
                          {product.dimensions?.width?.trim()
                            ? `${product.dimensions?.width} см`
                            : "Поки що поле відсутнє"}
                        </span>
                      </div>
                      <div className={styles.characteristic}>
                        <span>Висота:</span>
                        <span style={{ textAlign: "center", color: "#0e0e0e" }}>
                          {product.dimensions?.height?.trim()
                            ? `${product.dimensions?.height} см`
                            : "Поки що поле відсутнє"}
                        </span>
                      </div>
                      <div className={styles.characteristic}>
                        <span>Вага:</span>
                        <span style={{ textAlign: "center", color: "#0e0e0e" }}>
                          {product.weight?.trim()
                            ? `${product.weight} кг`
                            : "Поки що поле відсутнє"}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <FAQSection />
      <div className={styles.relatedProducts}>
        <div className={styles.relatedProductsHeader}>
          <p className={styles.relatedProductsSubtitle}>Інвентар</p>
          <h2>З цим товаром купують</h2>
        </div>
        <div className={styles.relatedGrid}>
          {visible.map((item) => (
            <ProductCard
              key={item.id}
              id={item.id}
              name={item.name}
              price={item.price}
              originalPrice={item.originalPrice}
              discount={item.discount}
              isNew={item.isNew}
              isHit={item.isHit}
              image={item.image}
              category={item.category}
            />
          ))}
        </div>
        <SliderNav
          activeIndex={slideIdx}
          dots={totalSlides}
          onPrev={onPrev}
          onNext={onNext}
          onDotClick={(i) => setSlideIdx(i)}
        />
      </div>

      {!isLoggedIn && (
        <RegisterModal
          isOpen={isRegisterOpen}
          onClose={() => setIsRegisterOpen(false)}
        />
      )}
    </div>
  );
}
