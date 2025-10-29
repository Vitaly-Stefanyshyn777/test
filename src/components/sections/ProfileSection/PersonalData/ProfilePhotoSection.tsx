"use client";

import React, { useState } from "react";
import Image from "next/image";
import styles from "./PersonalData.module.css";
import { UserIcon, PlusIcon } from "@/components/Icons/Icons";
import { uploadMedia, MediaUploadData } from "@/lib/bfbApi";
import { useAuthStore } from "@/store/auth";

type Props = {
  profileImage: string | null;
  onChange: (file: File) => void;
  onRemove: () => void;
};

export default function ProfilePhotoSection({
  profileImage,
  onChange,
  onRemove,
}: Props) {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const token = useAuthStore((s) => s.token);

  const handleImageChange = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (!file || !token) return;

    try {
      setUploading(true);
      setError(null);

      const uploadData: MediaUploadData = {
        file,
        fieldType: "img_link_data_avatar",
        token,
      };

      const result = await uploadMedia(uploadData);

      if (result.success && result.url) {
        // Create a File object with the uploaded URL for the parent component
        const uploadedFile = new File([file], file.name, { type: file.type });
        Object.defineProperty(uploadedFile, "url", { value: result.url });
        onChange(uploadedFile);
      }
    } catch (e) {
      setError("Не вдалося завантажити фото");
      console.error("Upload error:", e);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className={styles.section}>
      <div className={styles.profilePhotoSection}>
        <div className={styles.profilePhotoBlock}>
          <div className={styles.profilePhoto}>
            {profileImage ? (
              <Image
                src={profileImage}
                alt="Profile"
                width={120}
                height={120}
                className={styles.profileImage}
                style={{ objectFit: "cover" }}
              />
            ) : (
              <div className={styles.placeholderPhoto}>
                <UserIcon className={styles.placeholderIcon} />
              </div>
            )}
          </div>
          <div className={styles.sectionHeader}>
            <h3 className={styles.sectionTitle}>Фото профілю</h3>
            <span className={styles.fileInfo}>PNG, JPEG до 15 МБ</span>
          </div>
        </div>

        <div className={styles.photoActions}>
          <label
            className={styles.changePhotoBtn}
            style={{ opacity: uploading ? 0.6 : 1 }}
          >
            <input
              type="file"
              accept="image/png,image/jpeg"
              onChange={handleImageChange}
              className={styles.fileInput}
              disabled={uploading}
            />
            <span className={styles.btnIcon}>
              <PlusIcon />
            </span>
            {uploading ? "Завантаження..." : "Змінити фото"}
          </label>
          <button
            className={styles.removePhotoBtn}
            onClick={onRemove}
            disabled={uploading}
          >
            Видалити фото
          </button>
          {error && <div className={styles.errorMessage}>{error}</div>}
        </div>
      </div>
    </div>
  );
}
