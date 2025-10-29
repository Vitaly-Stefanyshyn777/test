"use client";
import React from "react";
import { useForm } from "react-hook-form";
import s from "./ContactSection.module.css";
import ContactInfo from "../ContactInfo/ContactInfo";
import ContactForm, { ContactFormValues } from "../ContactForm/ContactForm";

const ContactSection: React.FC = () => {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<ContactFormValues>();

  const onSubmit = async (data: ContactFormValues) => {
    try {
      console.log("Form submitted:", data);
      reset();
    } catch (error) {
      console.error("Error submitting form:", error);
    }
  };

  return (
    <section className={s.contactSection}>
      <div className={s.container}>
        <div className={s.innerContainer}>
          <ContactInfo />
          <div className={s.formWrapper}>
            <ContactForm
              register={register}
              errors={errors}
              handleSubmit={handleSubmit}
              onSubmit={onSubmit}
              isSubmitting={isSubmitting}
              isPending={false}
              isError={false}
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default ContactSection;
