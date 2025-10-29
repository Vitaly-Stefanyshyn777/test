"use client";

import React, { useEffect, useMemo, useState } from "react";
import styles from "./TrainerProfile.module.css";
import { CloudUploadIcon } from "@/components/Icons/Icons";

type Props = { onChange?: (files: File[]) => void };
import { uploadCoachMedia } from "@/lib/bfbApi";
import { useAuthStore } from "@/store/auth";

export default function CertificatesSection({ onChange }: Props) {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [files, setFiles] = useState<File[]>([]);
  const previews = useMemo(
    () => files.map((f) => URL.createObjectURL(f)),
    [files]
  );
  const token = useAuthStore((s) => s.token);

  // Зберігаємо лише прев’ю, щоб після перезавантаження показати користувачу останній стан
  useEffect(() => {
    try {
      const saved = localStorage.getItem("trainer_certificates_preview");
      if (saved) {
        const parsed = JSON.parse(saved) as string[];
        if (Array.isArray(parsed)) {
          // Ми не можемо відновити File[] без бекенду; показ прев’ю зробимо лише для поточної сесії
        }
      }
    } catch {}
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem(
        "trainer_certificates_preview",
        JSON.stringify(previews)
      );
    } catch {}
  }, [previews]);

  const handleFileUpload = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const inputEl = event.currentTarget;
    const selected = inputEl.files;
    if (!selected || selected.length === 0) return;

    try {
      setUploading(true);
      setError(null);

      // Миттєвий аплоад у кастомний ендпоїнт для сертифікатів
      if (token) {
        try {
          const resp = await uploadCoachMedia({
            token,
            fieldType: "img_link_data_certificate_",
            files: Array.from(selected),
          });
          if (!resp?.success) {
            throw new Error("uploadCoachMedia failed");
          }
        } catch (e) {
          // навіть якщо бекенд впаде, локальне прев'ю залишимо
          console.error("Certificates upload error:", e);
        }
      }

      const next = [...files, ...Array.from(selected)];
      setFiles(next);
      onChange?.(next);

      if (inputEl) inputEl.value = "";
    } catch (e) {
      setError("Не вдалося додати файл");
      console.error("Select file error:", e);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className={styles.section}>
      <h3 className={styles.sectionTitle}>Сертифікати:</h3>

      <div className={styles.certificatesContainer}>
        <div className={styles.certificatePlaceholders}>
          {previews.length > 0
            ? previews.map((url, i) => (
                <div className={styles.certificatePlaceholder} key={i}>
                  <div className={styles.certificateContent}>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={url}
                      alt={`Certificate ${i + 1}`}
                      style={{
                        width: "100%",
                        height: "100%",
                        objectFit: "cover",
                        borderRadius: 8,
                      }}
                    />
                  </div>
                </div>
              ))
            : [1, 2, 3].map((i) => (
                <div className={styles.certificatePlaceholder} key={i}>
                  <div className={styles.certificateContent}>
                    <div className={styles.certificateHeader}>CERTIFICATE</div>
                    <div className={styles.certificateBody}>
                      <div className={styles.certificateTitle}>Mind&Body</div>
                      <div className={styles.certificateSubtitle}>
                        Instructor Balance Functional Board
                      </div>
                      <div className={styles.certificateName}>
                        Ryzhenkova Svitlana
                      </div>
                    </div>
                    <div className={styles.certificateLogos}>
                      <div className={styles.certificateLogo}>●</div>
                      <div className={styles.certificateLogo}>●</div>
                    </div>
                  </div>
                </div>
              ))}
        </div>

        <div className={styles.uploadArea}>
          <label
            className={styles.uploadLabel}
            style={{ opacity: uploading ? 0.6 : 1 }}
          >
            <input
              type="file"
              accept="image/*"
              multiple
              className={styles.fileInput}
              onChange={handleFileUpload}
              disabled={uploading}
            />
            <div className={styles.uploadIcon}>
              <CloudUploadIcon />
            </div>
            <p className={styles.uploadText}>
              <span className={styles.uploadLink}>
                {uploading ? "Завантаження..." : "Загрузіть"}
              </span>{" "}
              або перетащіть сюди файл
            </p>
            <p className={styles.uploadFormats}>.pdf .doc .jpg .png до 5 МБ</p>
          </label>
          {error ? <div className={styles.errorMessage}>{error}</div> : null}
        </div>
      </div>
    </div>
  );
}
