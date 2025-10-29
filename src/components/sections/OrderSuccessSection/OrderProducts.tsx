"use client";
import React from "react";
import Image from "next/image";
import { useCartStore } from "@/store/cart";
import s from "./OrderSuccessSection.module.css";

interface OrderProductsProps {
  orderNumber: string;
}

export default function OrderProducts({ orderNumber }: OrderProductsProps) {
  const items = useCartStore((st) => st.items);
  const cartItems = Object.values(items);

  return (
    <div className={s.CartItemsBlock}>
      <div className={s.numberOrdereBlock}>
        <h3 className={s.numberOrdereTitle}>Замовлені товари:</h3>
        <p className={s.orderNumber}>{orderNumber}</p>
      </div>

      <div className={s.productsBlock}>
        <div className={s.products}>
          {cartItems.slice(0, 3).map((item) => (
            <div key={item.id} className={s.productImage}>
              {item.image && (
                <Image
                  src={item.image}
                  alt={item.name}
                  fill
                  style={{
                    objectFit: "cover",
                  }}
                />
              )}
              {item.quantity > 1 && (
                <div className={s.quantityBadge}>{item.quantity}</div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
