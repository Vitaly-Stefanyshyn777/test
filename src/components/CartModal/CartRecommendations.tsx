"use client";
import React, { useRef, useState } from "react";
import { useCartStore } from "@/store/cart";
import { useProductsQuery } from "@/components/hooks/useProductsQuery";
import SliderNav from "@/components/ui/SliderNav/SliderNavActions";
import { PlusIcon } from "@/components/Icons/Icons";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import s from "./CartModal.module.css";

export default function CartRecommendations() {
  const { data: products } = useProductsQuery();
  const swiperRef = useRef<{
    slidePrev: () => void;
    slideNext: () => void;
    slideTo: (i: number) => void;
  } | null>(null);
  const [recoPage, setRecoPage] = useState(0);

  return (
    <div className={s.recommendations}>
      <div className={s.recoHeader}>
        <div className={s.recoTitle}>Рекомендовані товари</div>
        <div className={s.recoNav}>
          <SliderNav
            activeIndex={recoPage}
            dots={Math.max(1, Math.ceil((products?.length || 0) / 1))}
            onPrev={() => swiperRef.current?.slidePrev()}
            onNext={() => swiperRef.current?.slideNext()}
            onDotClick={(idx) => swiperRef.current?.slideTo(idx)}
          />
        </div>
      </div>
      <div className={s.recoRow}>
        <Swiper
          onSwiper={(inst) => (swiperRef.current = inst)}
          onSlideChange={(sw) => setRecoPage(sw.activeIndex)}
          slidesPerView={3.1}
          spaceBetween={16}
          className={s.recoSwiper}
        >
          {(products || []).map((p) => (
            <SwiperSlide key={p.id} className={s.recoSlide}>
              <div className={s.recoItem}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={p.image || "/placeholder.svg"}
                  alt={p.name}
                  className={s.recoThumb}
                />
                <div className={s.recoContent}>
                  {/* Блок 1: Текст (бренд, назва, колір) */}
                  <div className={s.recoTextBlock}>
                    <div className={s.recoBrand}>DOMYOS</div>
                    <div className={s.recoName}>{p.name}</div>
                    <div className={s.recoColor}>
                      {p.color || "Колір не вказано"}
                    </div>
                  </div>

                  <div className={s.recoPriceButtonBlock}>
                    <div className={s.recoPriceBlock}>
                      <div className={s.recoPrice}>
                        {Number(p.price || 0).toLocaleString()}
                        <span className={s.recoCurrency}>
                          <p className={s.recoPriceBucks}>₴</p>
                        </span>
                      </div>
                      {p.originalPrice &&
                        Number(p.originalPrice) > Number(p.price || 0) && (
                          <div className={s.recoOldPrice}>
                            {Number(p.originalPrice).toLocaleString()}
                          </div>
                        )}
                    </div>
                    <button
                      className={s.smallPrimary}
                      onClick={() =>
                        useCartStore.getState().addItem({
                          id: String(p.id),
                          name: p.name,
                          price: Number(p.price) || 0,
                          image: p.image,
                          color: p.color,
                          originalPrice: Number(p.originalPrice) || 0,
                        })
                      }
                    >
                      Додати
                      <PlusIcon />
                    </button>
                  </div>
                </div>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </div>
  );
}
