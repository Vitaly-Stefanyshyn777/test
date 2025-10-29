"use client";
import React, { useEffect, useState } from "react";
import styles from "./PersonalData.module.css";
import HeaderBlock from "./HeaderBlock";
import ProfilePhotoSection from "./ProfilePhotoSection";
import ContactsSection from "./ContactsSection";
import UsernameSection from "./UsernameSection";
import { adminRequest } from "@/lib/api";
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

  const handleInputChange = (field: keyof PersonalDataForm, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleImageChange = (file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      setProfileImage(e.target?.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleRemoveImage = () => {
    setProfileImage(null);
  };

  const handleSave = () => {
    (async () => {
      if (!user?.id) {
        return;
      }
      try {
        await adminRequest({
          method: "PUT",
          url: "/api/proxy",
          params: {
            path: `/wp-json/wp/v2/users/${encodeURIComponent(String(user.id))}`,
          },
          data: {
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
      } catch {
      } finally {
        // Saving completed
      }
    })();
  };

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        if (!user?.id) return;
        const { data } = await adminRequest({
          method: "GET",
          url: "/api/proxy",
          params: {
            path: `/wp-json/wp/v2/users/${encodeURIComponent(
              String(user.id)
            )}?context=edit`,
          },
        });
        if (!mounted) return;
        const normalize = (s: string) =>
          String(s || "")
            .replace(/!+$/g, "")
            .trim();
        const firstName = normalize((data?.first_name as string) || "");
        let lastName = normalize((data?.last_name as string) || "");

        if (firstName && lastName && firstName === lastName) {
          lastName = "";
        }
        const email =
          (data?.email as string) || (data?.user_email as string) || "";
        const meta = (data?.meta as Record<string, string>) || {};
        setFormData((prev) => ({
          ...prev,
          firstName,
          lastName,
          email,
          phone:
            meta.input_text_social_phone ||
            meta.phone ||
            (data as unknown as { social_phone?: string })?.social_phone ||
            "",
          telegram:
            meta.input_text_social_telegram ||
            meta.social_telegram ||
            (data as unknown as { social_telegram?: string })
              ?.social_telegram ||
            "",
          instagram:
            meta.input_text_social_instagram ||
            meta.social_instagram ||
            (data as unknown as { social_instagram?: string })
              ?.social_instagram ||
            "",
        }));
      } catch {}
    })();
    return () => {
      mounted = false;
    };
  }, [user?.id]);

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
