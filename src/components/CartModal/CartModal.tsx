"use client";
import React, { useMemo } from "react";
import s from "./CartModal.module.css";
import { useCartStore, selectCartTotal } from "@/store/cart";
import { useScrollLock } from "@/components/hooks/useScrollLock";
import CartHeader from "./CartHeader";
import CartItemsList from "./CartItemsList";
import CartSummary from "./CartSummary";
import CartRecommendations from "./CartRecommendations";

export default function CartModal() {
  const isOpen = useCartStore((st) => st.isOpen);
  const close = useCartStore((st) => st.close);
  const itemsMap = useCartStore((st) => st.items);
  const items = useMemo(() => Object.values(itemsMap), [itemsMap]);
  const total = useCartStore(selectCartTotal);
  const discount = useMemo(
    () =>
      items.reduce((acc, it) => {
        const diff =
          it.originalPrice && it.originalPrice > it.price
            ? it.originalPrice - it.price
            : 0;
        return acc + diff * it.quantity;
      }, 0),
    [items]
  );
  const FREE_SHIPPING_LIMIT = 1999;
  const remainingToFree = Math.max(0, FREE_SHIPPING_LIMIT - total);
  const progressPct = Math.min(
    100,
    Math.round((total / FREE_SHIPPING_LIMIT) * 100)
  );

  useScrollLock(isOpen);
  if (!isOpen) return null;

  const handleCheckout = () => {
    close();
    window.location.href = "/checkout";
  };

  return (
    <div className={s.backdrop} onClick={close}>
      <div className={s.modal} onClick={(e) => e.stopPropagation()}>
        <div className={s.topbarListBlock}>
          <CartHeader onClose={close} />
          <div className={s.bodyTwoCols}>
            <CartItemsList items={items} />
            <CartSummary
              total={total}
              discount={discount}
              remainingToFree={remainingToFree}
              progressPct={progressPct}
              onCheckout={handleCheckout}
              onContinue={close}
            />
          </div>
        </div>

        <CartRecommendations />
      </div>
    </div>
  );
}
