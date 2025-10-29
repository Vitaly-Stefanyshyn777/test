"use client";
import React, { useMemo, useState } from "react";
import s from "./FavoritesModal.module.css";
import { useFavoriteStore } from "@/store/favorites";
import { useCartStore } from "@/store/cart";
import ProductCard from "@/components/sections/ProductsSection/ProductCard/ProductCard";
import SliderNav from "@/components/ui/SliderNav/SliderNavActions";
import { CloseButtonIcon } from "@/components/Icons/Icons";
import { useScrollLock } from "@/components/hooks/useScrollLock";

export default function FavoritesModal() {
  const isOpen = useFavoriteStore((st) => st.isOpen);
  const close = useFavoriteStore((st) => st.close);
  const remove = useFavoriteStore((st) => st.remove);
  const itemsMap = useFavoriteStore((st) => st.items);
  const items = useMemo(() => Object.values(itemsMap), [itemsMap]);
  const addToCart = useCartStore((st) => st.addItem);

  const [page, setPage] = useState(0);

  const pageSize = 4;
  const pageCount = Math.ceil(items.length / pageSize) || 1;
  const pageItems = items.slice(page * pageSize, page * pageSize + pageSize);

  useScrollLock(isOpen);

  if (!isOpen) return null;

  return (
    <div className={s.backdrop} onClick={close}>
      <div className={s.modal} onClick={(e) => e.stopPropagation()}>
        <div className={s.topbarListBlock}>
          <div className={s.topbar}>
            <span className={s.topbarTitle}>Обране</span>
            <button className={s.close} onClick={close} aria-label="Закрити">
              <CloseButtonIcon />
            </button>
          </div>
          <div className={s.list}>
            {items.length === 0 ? (
              <div className={s.empty}>Список порожній</div>
            ) : (
              pageItems.map((it) => (
                <ProductCard
                  key={it.id}
                  id={it.id}
                  name={it.name}
                  price={it.price || 0}
                  originalPrice={it.originalPrice}
                  discount={it.discount}
                  isNew={it.isNew}
                  isHit={it.isHit}
                  image={it.image}
                />
              ))
            )}
          </div>
        </div>

        <div className={s.actionsRow}>
          <div className={s.buttonsWrap}>
            <button
              className={s.secondary}
              onClick={() => {
                pageItems.forEach((it) => {
                  if (typeof it.price === "number") {
                    addToCart(
                      {
                        id: it.id,
                        name: it.name,
                        price: it.price,
                        image: it.image,
                      },
                      1
                    );
                  }
                });
              }}
            >
              Додати усе в кошик
            </button>
            <button
              className={s.remove}
              onClick={() => pageItems.forEach((it) => remove(it.id))}
            >
              Видалити все
            </button>
          </div>
          <div className={s.navWrap}>
            <SliderNav
              activeIndex={page}
              dots={pageCount}
              onPrev={() => setPage((p) => Math.max(0, p - 1))}
              onNext={() => setPage((p) => Math.min(pageCount - 1, p + 1))}
              onDotClick={(idx) => setPage(idx)}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
