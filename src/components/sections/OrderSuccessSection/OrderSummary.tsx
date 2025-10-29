"use client";
import React from "react";
import Link from "next/link";
import s from "./OrderSuccessSection.module.css";

interface OrderSummaryProps {
  safeTotal: number;
  deliveryCost: number;
  finalTotal: number;
}

export default function OrderSummary({
  safeTotal,
  deliveryCost,
  finalTotal,
}: OrderSummaryProps) {
  return (
    <>
      <div className={s.divider}></div>

      <div className={s.costSummary}>
        <div className={s.costRow}>
          <span className={s.costLabel}>Сума замовлення:</span>
          <span className={s.costValue}>{safeTotal.toLocaleString()} ₴</span>
        </div>
        <div className={s.costRow}>
          <span className={s.costLabel}>Вартість доставки:</span>
          <span className={s.costValue}>
            {deliveryCost === 0 ? "Безкоштовно" : `${deliveryCost} ₴`}
          </span>
        </div>
        <div className={s.costRow}>
          <span className={s.costLabelPrice}>До оплати:</span>
          <span className={s.costValuePrice}>
            {finalTotal.toLocaleString()} ₴
          </span>
        </div>
      </div>

      <Link href="/" className={s.returnButton}>
        Повернутися на головну
      </Link>
    </>
  );
}

