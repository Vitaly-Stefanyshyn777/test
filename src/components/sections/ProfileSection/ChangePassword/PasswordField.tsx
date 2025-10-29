"use client";

import React, { useState } from "react";
import styles from "./ChangePassword.module.css";
import { PasswordsIcon, EyeIcon } from "@/components/Icons/Icons";

type Props = {
  placeholder: string;
  inputProps?: React.InputHTMLAttributes<HTMLInputElement>;
};

export default function PasswordField({ placeholder, inputProps }: Props) {
  const [visible, setVisible] = useState(false);
  return (
    <div className={styles.field}>
      <div className={styles.inputWrap}>
        <div className={styles.inputIcon}>
          <PasswordsIcon />
        </div>
        <input
          className={styles.input}
          type={visible ? "text" : "password"}
          placeholder={placeholder}
          {...inputProps}
        />
        <button
          type="button"
          className={styles.eyeBtn}
          aria-label={visible ? "Сховати пароль" : "Показати пароль"}
          onClick={() => setVisible((v) => !v)}
        >
          {visible ? "🙈" : <EyeIcon />}
        </button>
      </div>
    </div>
  );
}
