"use client";
import React from "react";
import { ChevronBorderIcon } from "@/components/Icons/Icons";
import s from "./OrderSuccessSection.module.css";

export default function OrderHeader() {
  return (
    <div className={s.headerBlock}>
      <div className={s.iconContainer}>
        <ChevronBorderIcon className={s.icon} />
      </div>
      <div className={s.thanBlock}>
        <h1 className={s.thankYou}>Дякуємо, що з нами!</h1>
        <h2 className={s.successTitle}>
          Ваше замовлення <br /> успішно прийнято
        </h2>
      </div>
    </div>
  );
}

