"use client";
import React, { useState } from "react";
import styles from "./ChangePassword.module.css";
import SectionDivider from "../SectionDivider/SectionDivider";

import { useForm } from "react-hook-form";
import api from "@/lib/api";
import { useAuthStore } from "@/store/auth";
import PasswordField from "./PasswordField";

const ChangePassword: React.FC = () => {
  const user = useAuthStore((s) => s.user);
  const token = useAuthStore((s) => s.token);

  type FormValues = {
    currentPassword: string;
    newPassword: string;
    confirmPassword: string;
  };
  const { register, handleSubmit, reset } = useForm<FormValues>({
    defaultValues: {
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    },
    mode: "onSubmit",
  });

  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const onSubmit = handleSubmit(async (values) => {
    setError(null);
    setSuccess(null);
    if (!token || !user?.id) {
      setError("Потрібна авторизація для зміни пароля");
      return;
    }

    if (
      !values.currentPassword ||
      !values.newPassword ||
      !values.confirmPassword
    ) {
      setError("Заповніть усі поля");
      return;
    }
    if (values.newPassword !== values.confirmPassword) {
      setError("Паролі не співпадають");
      return;
    }
    if (values.newPassword.length < 8) {
      setError("Новий пароль має містити щонайменше 8 символів");
      return;
    }

    try {
      setSubmitting(true);
      await api.put(
        "/api/proxy",
        { password: values.newPassword },
        {
          params: { path: `/wp-json/wp/v2/users/${user.id}` },
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setSuccess("Пароль успішно змінено");
      reset();
    } catch {
      setError("Не вдалося змінити пароль. Спробуйте ще раз.");
    } finally {
      setSubmitting(false);
    }
  });

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1 className={styles.title}>Зміна пароля</h1>
      </div>

      <SectionDivider />

      <form className={styles.form} onSubmit={onSubmit} noValidate>
        <PasswordField
          placeholder="Поточний пароль"
          inputProps={{
            ...register("currentPassword", { required: true }),
            autoComplete: "current-password",
          }}
        />

        <PasswordField
          placeholder="Введіть новий пароль"
          inputProps={{
            ...register("newPassword", { required: true, minLength: 8 }),
            autoComplete: "new-password",
          }}
        />

        <PasswordField
          placeholder="Підтвердіть новий пароль"
          inputProps={{
            ...register("confirmPassword", { required: true, minLength: 8 }),
            autoComplete: "new-password",
          }}
        />

        {error && <div className={styles.error}>{error}</div>}
        {success && <div className={styles.success}>{success}</div>}

        <button
          className={styles.submitBtn}
          type="submit"
          disabled={submitting}
        >
          {submitting ? "Збереження..." : "Змінити пароль"}
        </button>
      </form>
    </div>
  );
};

export default ChangePassword;
