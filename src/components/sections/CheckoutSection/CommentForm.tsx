"use client";
import React from "react";
import { FormData } from "./types";
import s from "./CheckoutSection.module.css";

interface CommentFormProps {
  formData: FormData;
  setFormData: (data: FormData) => void;
}

export default function CommentForm({
  formData,
  setFormData,
}: CommentFormProps) {
  return (
    <div className={s.commentBlock}>
      <h2 className={s.sectionTitle}>Коментар до замовлення</h2>
      <textarea
        className={s.textarea}
        placeholder="Залишити коментар до замовлення"
        value={formData.comment}
        onChange={(e) => setFormData({ ...formData, comment: e.target.value })}
      />
    </div>
  );
}
