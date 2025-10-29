"use client";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import s from "./ContactsSection.module.css";
import ContactInfo from "./ContactInfo/ContactInfo";
import ContactForm, { ContactFormValues } from "./ContactForm/ContactForm";
import { ThemeSettingsPost } from "@/lib/bfbApi";
import { useThemeSettingsQuery } from "@/components/hooks/useWpQueries";
import { useContactQuestion } from "@/lib/useMutation";

const ContactsSection: React.FC = () => {
  const [themeSettings, setThemeSettings] = useState<ThemeSettingsPost[]>([]);
  const { data, isLoading, isError } = useThemeSettingsQuery();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<ContactFormValues>();

  const contactMutation = useContactQuestion();

  useEffect(() => {
    if (data && Array.isArray(data)) setThemeSettings(data);
  }, [data]);

  const onSubmit = async (data: ContactFormValues) => {
    const payload: {
      name: string;
      email?: string;
      phone?: string;
      nickname?: string;
      question?: string;
    } = { name: data.name };
    if (data.email) payload.email = data.email;
    if (data.phone) payload.phone = data.phone;
    if (data.nickname) payload.nickname = data.nickname;
    if (data.question) payload.question = data.question;

    contactMutation.mutate(payload, {
      onSuccess: (resp) => {
        console.log("[Contacts] POST success:", resp);
        reset();
      },
      onError: (err) => {
        console.error("[Contacts] POST error:", err);
      },
    });
  };

  return (
    <section className={s.contactSection}>
      <div className={s.header}>
        <p className={s.subtitle}>Зв&amp;apos;яжись з нами</p>
        <h2 className={s.title}>
          {themeSettings[0]?.acf?.input_text_phone?.trim() ||
            (isLoading
              ? "Завантаження…"
              : isError
              ? "Дані не прийшли"
              : "Маєте питання щодо BFB?")}
        </h2>
      </div>
      <div className={s.container}>
        <div className={s.formWrapper}>
          <ContactForm
            register={register}
            errors={errors}
            handleSubmit={handleSubmit}
            onSubmit={onSubmit}
            isSubmitting={isSubmitting || contactMutation.isPending}
            isPending={contactMutation.isPending}
            isError={!!contactMutation.isError}
          />
        </div>
        <div className={s.innerContainer}>
          <ContactInfo />
        </div>
      </div>
    </section>
  );
};

export default ContactsSection;
