"use client";
import React, { useEffect, useState } from "react";
import styles from "./PersonalData.module.css";
import HeaderBlock from "./HeaderBlock";
import ProfilePhotoSection from "./ProfilePhotoSection";
import ContactsSection from "./ContactsSection";
import UsernameSection from "./UsernameSection";
import { adminRequest } from "@/lib/api";
import {
  useUserProfileQuery,
  useUpdateUserProfile,
} from "@/components/hooks/useUserProfileQuery";
import { useAuthStore } from "@/store/auth";

interface PersonalDataForm {
  firstName: string;
  lastName: string;
  phone: string;
  telegram: string;
  email: string;
  instagram: string;
}

const PersonalData: React.FC = () => {
  const user = useAuthStore((s) => s.user);
  const [formData, setFormData] = useState<PersonalDataForm>({
    firstName: "",
    lastName: "",
    phone: "",
    telegram: "",
    email: "",
    instagram: "",
  });

  const [profileImage, setProfileImage] = useState<string | null>(null);

  // TanStack Query: завантаження та оновлення профілю
  const { data: profile } = useUserProfileQuery();
  const updateProfile = useUpdateUserProfile();

  const handleInputChange = (field: keyof PersonalDataForm, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleImageChange = (file: File) => {
    // Якщо ProfilePhotoSection передав завантажений URL — беремо його
    const withUrl = file as File & { url?: string };
    if (withUrl.url) {
      setProfileImage(withUrl.url);
      return;
    }
    // Інакше показуємо превʼю з FileReader
    const reader = new FileReader();
    reader.onload = (e) => {
      setProfileImage(e.target?.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleRemoveImage = () => {
    if (process.env.NODE_ENV !== "production") {
      console.log(
        "[PersonalData] remove avatar → backend (DELETE /api/profile/avatar)"
      );
    }
    fetch("/api/profile/avatar", { method: "DELETE" })
      .then(async (res) => {
        if (!res.ok) throw new Error(await res.text());
        if (process.env.NODE_ENV !== "production") {
          console.log("[PersonalData] remove avatar → success");
        }
        setProfileImage(null);
      })
      .catch((e) => {
        if (process.env.NODE_ENV !== "production") {
          console.error("[PersonalData] remove avatar → failed", e);
        }
      });
  };

  const handleSave = () => {
    const numericOrServerId = (profile as unknown as { id?: number | string })
      ?.id;
    const targetId = String(numericOrServerId ?? user?.id ?? "");
    if (!targetId) return;
    updateProfile.mutate({
      id: targetId,
      body: {
        first_name: formData.firstName,
        last_name: formData.lastName,
        email: formData.email,
        meta: {
          input_text_social_phone: formData.phone,
          input_text_social_telegram: formData.telegram,
          input_text_social_instagram: formData.instagram,
        },
      },
    });
  };

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        if (!profile) return;
        const data = profile as unknown as {
          first_name?: string;
          last_name?: string;
          email?: string;
          user_email?: string;
          social_phone?: string;
          social_telegram?: string;
          social_instagram?: string;
          meta?: Record<string, string>;
          avatar?: string;
          avatar_urls?: Record<string, string>;
          img_link_data_avatar?: string;
        };
        const normalize = (s: string) =>
          String(s || "")
            .replace(/!+$/g, "")
            .trim();
        const firstName = normalize(data?.first_name || "");
        let lastName = normalize(data?.last_name || "");

        if (firstName && lastName && firstName === lastName) {
          lastName = "";
        }
        const email = data?.email || data?.user_email || "";
        const meta = (data?.meta || {}) as Record<string, string>;
        setFormData((prev) => ({
          ...prev,
          firstName,
          lastName,
          email,
          phone:
            meta.input_text_social_phone ||
            meta.phone ||
            data?.social_phone ||
            "",
          telegram:
            meta.input_text_social_telegram ||
            meta.social_telegram ||
            data?.social_telegram ||
            "",
          instagram:
            meta.input_text_social_instagram ||
            meta.social_instagram ||
            data?.social_instagram ||
            "",
        }));

        // Синхронізуємо превʼю аватарки з бекенду
        const firstUploadUrl = Object.values(meta || {}).find(
          (v) => typeof v === "string" && v.includes("/wp-content/uploads/")
        ) as string | undefined;
        // Пріоритет: спочатку стандартне поле avatar, потім мета
        if (process.env.NODE_ENV !== "production") {
          console.log("[PersonalData] profile avatar candidates", {
            avatar: data?.avatar,
            metaAvatar: (data?.meta as { img_link_data_avatar?: string })
              ?.img_link_data_avatar,
            topLevelAvatar: data?.img_link_data_avatar,
            firstUploadUrl,
            avatarUrls: data?.avatar_urls,
          });
        }

        const avatar96 = data?.avatar_urls?.["96"]; //
        const backendAvatar =
          data?.img_link_data_avatar ||
          (meta as { img_link_data_avatar?: string })?.img_link_data_avatar ||
          data?.avatar ||
          firstUploadUrl ||
          avatar96 ||
          null;
        if (process.env.NODE_ENV !== "production") {
          console.log("[PersonalData] resolved backendAvatar", backendAvatar);
        }
        if (backendAvatar) {
          setProfileImage(backendAvatar);
        }
      } catch {}
    })();
    return () => {
      mounted = false;
    };
  }, [profile]);

  return (
    <div className={styles.personalData}>
      <HeaderBlock />

      {/* <SectionDivider /> */}
      <div className={styles.divider}></div>

      <div className={styles.form}>
        {/* Profile Photo Section */}
        <ProfilePhotoSection
          profileImage={profileImage}
          onChange={handleImageChange}
          onRemove={handleRemoveImage}
        />

        {/* <SectionDivider /> */}
        <div className={styles.divider}></div>

        {/* Username Section */}
        <UsernameSection
          firstName={formData.firstName}
          lastName={formData.lastName}
          onChange={(first, last) => {
            handleInputChange("firstName", first);
            handleInputChange("lastName", last);
          }}
        />

        {/* <SectionDivider /> */}
        <div className={styles.divider}></div>

        {/* Contact Details Section */}
        <ContactsSection
          phone={formData.phone}
          telegram={formData.telegram}
          email={formData.email}
          instagram={formData.instagram}
          onChange={(field, value) =>
            handleInputChange(
              field as "phone" | "telegram" | "email" | "instagram",
              value
            )
          }
        />

        {/* Save Button */}
        <div className={styles.saveSection}>
          <button className={styles.saveBtn} onClick={handleSave}>
            Зберегти дані
          </button>
        </div>
      </div>
    </div>
  );
};

export default PersonalData;
