import React, { useState } from "react";
import {
  UseFormRegister,
  FieldErrors,
  UseFormHandleSubmit,
} from "react-hook-form";
import {
  EmailIcon,
  EmailDoggieIcon,
  NumberIcon,
  QuestionIcon,
  UserIcon,
} from "@/components/Icons/Icons";
import s from "./ContactForm.module.css";

export interface ContactFormValues {
  name: string;
  phone?: string;
  email?: string;
  nickname?: string; // Telegram/Instagram
  question?: string;
}

interface TrainerFormProps {
  register: UseFormRegister<ContactFormValues>;
  errors: FieldErrors<ContactFormValues>;
  handleSubmit: UseFormHandleSubmit<ContactFormValues>;
  onSubmit: (data: ContactFormValues) => Promise<void> | void;
  isSubmitting: boolean;
  isPending: boolean;
  isError: boolean;
}

export default function ContactForm({
  register,
  errors,
  handleSubmit,
  onSubmit,
  isSubmitting,
  isPending,
  isError,
}: TrainerFormProps) {
  const [submitStatus, setSubmitStatus] = useState<{
    type: "success" | "error" | null;
    message: string;
  }>({ type: null, message: "" });

  const handleFormSubmit = async (data: ContactFormValues) => {
    try {
      setSubmitStatus({ type: null, message: "" });
      await onSubmit(data);
      setSubmitStatus({ type: "success", message: "Заявку надіслано" });
    } catch (error) {
      setSubmitStatus({
        type: "error",
        message: error instanceof Error ? error.message : "Помилка відправки",
      });
    }
  };

  return (
    <form className={s.form} onSubmit={handleSubmit(handleFormSubmit)}>
      <div className={s.row}>
        <div className={s.inputGroup}>
          <div className={s.inputWrapper}>
            <div className={s.inputIcon}>
              <UserIcon />
            </div>
            <div className={s.inputBlock}>
              <input
                className={s.input}
                placeholder="Ваше ім'я та прізвище"
                type="text"
                {...register("name", { required: true })}
              />
            </div>
          </div>
        </div>

        <div className={s.inputGroup}>
          <div className={s.inputWrapper}>
            <div className={s.inputIcon}>
              <NumberIcon />
            </div>
            <div className={s.inputBlock}>
              <input
                className={s.input}
                placeholder="Ваш номер телефону"
                type="tel"
                {...register("phone")}
              />
            </div>
          </div>
        </div>
      </div>

      <div className={s.row}>
        <div className={s.inputGroup}>
          <div className={s.inputWrapper}>
            <div className={s.inputIcon}>
              <EmailDoggieIcon />
            </div>
            <div className={s.inputBlock}>
              <input
                className={s.input}
                placeholder="Нікнейм Telegram/Instagram"
                type="text"
                {...register("nickname", {
                  // allow optional @, letters, numbers, underscore and dot
                  pattern: {
                    value: /^@?[A-Za-z0-9._]+$/, // optional @ at start
                    message: "Некоректний нікнейм",
                  },
                })}
              />
            </div>
          </div>
        </div>

        <div className={s.inputGroup}>
          <div className={s.inputWrapper}>
            <div className={s.inputIcon}>
              <EmailIcon />
            </div>
            <div className={s.inputBlock}>
              <input
                className={s.input}
                placeholder="Вашa пошта"
                type="email"
                {...register("email")}
              />
            </div>
          </div>
        </div>
      </div>

      <div className={s.rowSingle}>
        <div className={s.inputWrapper}>
          <div className={s.inputIconWrapper}>
            <QuestionIcon />
          </div>
          <textarea
            className={`${s.input} ${s.textarea}`}
            placeholder="Ваше питання"
            rows={4}
            {...register("question")}
          />
        </div>
      </div>

      {errors.name && <p className={s.error}>Будь ласка, вкажіть імʼя</p>}
      {errors.nickname && (
        <p className={s.error}>{errors.nickname.message as string}</p>
      )}
      {isError && (
        <p className={s.error}>Помилка відправки заявки. Спробуйте ще раз.</p>
      )}

      {submitStatus.type && (
        <div
          className={`${s.statusMessage} ${
            submitStatus.type === "success" ? s.success : s.error
          }`}
        >
          {submitStatus.message}
        </div>
      )}

      <div className={s.privacyLinkBlock}>
        <button
          className={s.submit}
          type="submit"
          disabled={isSubmitting || isPending}
        >
          {isPending ? "Відправка..." : "Залишити заявку"}
        </button>

        <p className={s.privacyText}>
          Натискаючи на кнопку, ви погоджуєтесь з{" "}
          <a href="/privacy" className={s.privacyLink}>
            Політикою конфіденційності
          </a>
        </p>
      </div>
    </form>
  );
}
