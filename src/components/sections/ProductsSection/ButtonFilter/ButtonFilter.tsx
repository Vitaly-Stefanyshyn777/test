"use client";
import React from "react";
import styles from "./ButtonFilter.module.css";

interface ButtonFilterProps {
  children: React.ReactNode;
  onClick: () => void;
  variant?: "primary" | "secondary";
  disabled?: boolean;
}

export default function ButtonFilter({
  children,
  onClick,
  variant = "primary",
  disabled = false,
}: ButtonFilterProps) {
  const handleClick = () => {
    console.log("[ButtonFilter] 🖱️ Клік по кнопці:", children);
    console.log("[ButtonFilter] 🎨 Варіант кнопки:", variant);
    console.log("[ButtonFilter] 🚫 Відключена:", disabled);

    if (!disabled) {
      onClick();
      console.log("[ButtonFilter] ✅ Обробник викликано");
    } else {
      console.log("[ButtonFilter] ⚠️ Кнопка відключена, обробник не викликано");
    }
  };

  return (
    <button
      className={`${styles.button} ${styles[variant]} ${
        disabled ? styles.disabled : ""
      }`}
      onClick={handleClick}
      disabled={disabled}
    >
      {children}
    </button>
  );
}








