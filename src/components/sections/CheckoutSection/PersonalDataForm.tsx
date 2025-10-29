"use client";
import React from "react";
import { FormData } from "./types";
import s from "./CheckoutSection.module.css";

interface PersonalDataFormProps {
  formData: FormData;
  hasDifferentRecipient: boolean;
  setFormData: (data: FormData) => void;
  setHasDifferentRecipient: (value: boolean) => void;
}

export default function PersonalDataForm({
  formData,
  hasDifferentRecipient,
  setFormData,
  setHasDifferentRecipient,
}: PersonalDataFormProps) {
  return (
    <div className={s.titleFormBlock}>
      <h2 className={s.sectionTitle}>Особисті дані</h2>
      <div className={s.grid2}>
        <input
          className={s.input}
          placeholder="Ваше ім'я та прізвище"
          value={formData.firstName}
          onChange={(e) =>
            setFormData({ ...formData, firstName: e.target.value })
          }
        />
        <input
          className={s.input}
          placeholder="Ваше прізвище"
          value={formData.lastName}
          onChange={(e) =>
            setFormData({ ...formData, lastName: e.target.value })
          }
        />
        <input
          className={s.input}
          placeholder="Ваш номер телефону"
          value={formData.phone}
          onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
        />
        <input
          className={s.input}
          placeholder="Ваша пошта"
          value={formData.email}
          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
        />
      </div>
      <div className={s.checkboxBlock}>
        <label className={s.checkbox}>
          <input
            type="checkbox"
            checked={hasDifferentRecipient}
            onChange={(e) => setHasDifferentRecipient(e.target.checked)}
          />
          <span className={s.checkboxText}>Отримувати буде інша людина</span>
        </label>
      </div>
      {hasDifferentRecipient && (
        <div className={s.titleFormBlock}>
          <h2 className={s.sectionTitle}>Дані отримувача</h2>
          <div className={s.grid2}>
            <input
              className={s.input}
              placeholder="Ваше ім'я та прізвище"
              value={formData.recipientFirstName}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  recipientFirstName: e.target.value,
                })
              }
            />
            <input
              className={s.input}
              placeholder="Ваше прізвище"
              value={formData.recipientLastName}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  recipientLastName: e.target.value,
                })
              }
            />
            <input
              className={s.input}
              placeholder="Ваш номер телефону"
              value={formData.recipientPhone}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  recipientPhone: e.target.value,
                })
              }
            />
            <input
              className={s.input}
              placeholder="Ваша пошта"
              value={formData.email}
              onChange={(e) =>
                setFormData({ ...formData, email: e.target.value })
              }
            />
          </div>
        </div>
      )}
    </div>
  );
}
