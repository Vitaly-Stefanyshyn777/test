"use client";

import React, { useEffect, useState } from "react";
import styles from "./TrainerProfile.module.css";
import {
  CloseButtonIcon,
  NumberIcon,
  TelegramIcon,
  EmailIcon,
  InstagramIcon,
  FacebookIcon,
  CloudUploadIcon,
  DumpUploadIcon,
} from "@/components/Icons/Icons";

type Props = {
  isOpen: boolean;
  onClose: () => void;
  onSave: (location: {
    title: string;
    email?: string;
    phone?: string;
    telegram?: string;
    instagram?: string;
    facebook?: string;
    schedule_five?: string;
    schedule_two?: string;
    address?: string;
  }) => void;
  initialLocation?: {
    title: string;
    email?: string;
    phone?: string;
    telegram?: string;
    instagram?: string;
    facebook?: string;
    schedule_five?: string;
    schedule_two?: string;
    address?: string;
  } | null;
};

import { uploadCoachMedia } from "@/lib/bfbApi";
import { useAuthStore } from "@/store/auth";
import { useUpdateTrainerProfile } from "@/lib/useMutation";

export default function TrainingLocationModal({
  isOpen,
  onClose,
  onSave,
  initialLocation = null,
}: Props) {
  const token = useAuthStore((s) => s.token);
  const { mutateAsync: updateProfile } = useUpdateTrainerProfile();
  const [uploadingGym, setUploadingGym] = useState(false);
  const [gymPhotos, setGymPhotos] = useState<string[]>([]);
  const [title, setTitle] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [instagram, setInstagram] = useState("");
  const [telegram, setTelegram] = useState("");
  const [facebook, setFacebook] = useState("");
  const [weekendStart, setWeekendStart] = useState("");
  const [weekendEnd, setWeekendEnd] = useState("");
  const [weekdayStart, setWeekdayStart] = useState("");
  const [weekdayEnd, setWeekdayEnd] = useState("");
  const [address, setAddress] = useState("");

  useEffect(() => {
    if (!initialLocation) return;
    setTitle(initialLocation.title || "");
    setEmail(initialLocation.email || "");
    setPhone(initialLocation.phone || "");
    setTelegram(initialLocation.telegram || "");
    setInstagram(initialLocation.instagram || "");
    setFacebook(initialLocation.facebook || "");
    if (initialLocation.schedule_two?.includes("–")) {
      const [s, e] = initialLocation.schedule_two.split("–");
      setWeekendStart(s || "");
      setWeekendEnd(e || "");
    }
    if (initialLocation.schedule_five?.includes("–")) {
      const [s, e] = initialLocation.schedule_five.split("–");
      setWeekdayStart(s || "");
      setWeekdayEnd(e || "");
    }
    setAddress(initialLocation.address || "");
  }, [initialLocation]);

  if (!isOpen) return null;
  return (
    <div className={styles.modalOverlay} onClick={onClose}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <div className={styles.modalHeader}>
          <h3 className={styles.modalTitle}>Місця проведення тренувань:</h3>
          <button className={styles.closeButton} onClick={onClose}>
            <CloseButtonIcon />
          </button>
        </div>

        <div className={styles.modalContent}>
          <div className={styles.contactBlock}>
            <div className={styles.contactSection}>
              <h4 className={styles.sectionLabel}>
                Контактна інформація залу:
              </h4>

              <div className={styles.inputGroupBlock}>
                <div className={styles.inputGroup}>
                  <div className={styles.inputContainer}>
                    <div className={styles.inputIconWrapper}>
                      <NumberIcon className={styles.inputIcon} />
                    </div>
                    <input
                      type="text"
                      placeholder="Назва/титул залу"
                      className={styles.input}
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                    />
                  </div>
                </div>

                <div className={styles.inputGroup}>
                  <div className={styles.inputContainer}>
                    <div className={styles.inputIconWrapper}>
                      <NumberIcon className={styles.inputIcon} />
                    </div>
                    <input
                      type="text"
                      placeholder="Номер телефону"
                      className={styles.input}
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                    />
                  </div>
                </div>

                <div className={styles.inputGroup}>
                  <div className={styles.inputContainer}>
                    <div className={styles.inputIconWrapper}>
                      <TelegramIcon className={styles.inputIcon} />
                    </div>
                    <input
                      type="text"
                      placeholder="Нікнейм Telegram (необов'язково)"
                      className={styles.input}
                      value={telegram}
                      onChange={(e) => setTelegram(e.target.value)}
                    />
                  </div>
                </div>

                <div className={styles.inputGroup}>
                  <div className={styles.inputContainer}>
                    <div className={styles.inputIconWrapper}>
                      <EmailIcon className={styles.inputIcon} />
                    </div>
                    <input
                      type="email"
                      placeholder="Пошта (необов'язково)"
                      className={styles.input}
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                    />
                  </div>
                </div>

                <div className={styles.inputGroup}>
                  <div className={styles.inputContainer}>
                    <div className={styles.inputIconWrapper}>
                      <InstagramIcon className={styles.inputIcon} />
                    </div>
                    <input
                      type="text"
                      placeholder="Нікнейм Instagram (необов'язково)"
                      className={styles.input}
                      value={instagram}
                      onChange={(e) => setInstagram(e.target.value)}
                    />
                  </div>
                </div>

                <div className={styles.inputGroup}>
                  <div className={styles.inputContainer}>
                    <div className={styles.inputIconWrapper}>
                      <FacebookIcon className={styles.inputIcon} />
                    </div>
                    <input
                      type="text"
                      placeholder="Facebook (необов'язково)"
                      className={styles.input}
                      value={facebook}
                      onChange={(e) => setFacebook(e.target.value)}
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className={styles.workingHoursSection}>
              <h4 className={styles.sectionLabel}>Час роботи у вихідні:</h4>
              <div className={styles.timeInputs}>
                <input
                  type="text"
                  placeholder="З якої години"
                  className={styles.timeInput}
                  value={weekendStart}
                  onChange={(e) => setWeekendStart(e.target.value)}
                />
                <span className={styles.timeSeparator}>:</span>
                <input
                  type="text"
                  placeholder="До якої години"
                  className={styles.timeInput}
                  value={weekendEnd}
                  onChange={(e) => setWeekendEnd(e.target.value)}
                />
              </div>
            </div>
            <div className={styles.workingHoursSection}>
              <h4 className={styles.sectionLabel}>Час роботи у будні:</h4>
              <div className={styles.timeInputs}>
                <input
                  type="text"
                  placeholder="З якої години"
                  className={styles.timeInput}
                  value={weekdayStart}
                  onChange={(e) => setWeekdayStart(e.target.value)}
                />
                <span className={styles.timeSeparator}>:</span>
                <input
                  type="text"
                  placeholder="До якої години"
                  className={styles.timeInput}
                  value={weekdayEnd}
                  onChange={(e) => setWeekdayEnd(e.target.value)}
                />
              </div>
            </div>
          </div>

          <div className={styles.photosSection}>
            <h4 className={styles.sectionLabel}>Фото залу:</h4>
            <div className={styles.photoThumbnails}>
              {gymPhotos.map((url, idx) => (
                <div className={styles.photoThumbnail} key={idx}>
                  <div className={styles.photoPlaceholder}>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={url}
                      alt="Фото залу"
                      style={{
                        width: "100%",
                        height: "100%",
                        objectFit: "cover",
                        borderRadius: 8,
                      }}
                    />
                  </div>
                  <button
                    className={styles.deletePhotoBtn}
                    onClick={() => {
                      const next = gymPhotos.filter((_, i) => i !== idx);
                      setGymPhotos(next);
                      // спроба зберегти зміну
                      if (token) {
                        updateProfile({
                          payload: { meta: { gallery_gym: next } },
                          token,
                        }).catch(() => {});
                      }
                    }}
                  >
                    <DumpUploadIcon className={styles.deleteIcon} />
                  </button>
                </div>
              ))}
            </div>
            <label
              className={styles.uploadArea}
              style={{ opacity: uploadingGym ? 0.6 : 1 }}
            >
              <input
                type="file"
                accept="image/*"
                multiple
                style={{ display: "none" }}
                onChange={async (e) => {
                  const files = e.target.files;
                  if (!files || files.length === 0 || !token) return;
                  try {
                    setUploadingGym(true);
                    const resp = await uploadCoachMedia({
                      token,
                      fieldType: "img_link_data_gallery_",
                      files: Array.from(files),
                    });
                    let returnedUrls: string[] = [];
                    if (Array.isArray(resp?.files)) {
                      returnedUrls = resp.files
                        .map(
                          (f: {
                            id: string | number;
                            url: string;
                            filename?: string;
                          }) => f?.url
                        )
                        .filter(Boolean);
                    }
                    if (!returnedUrls.length && resp?.current_field_value) {
                      try {
                        returnedUrls = JSON.parse(resp.current_field_value);
                      } catch {}
                    }
                    if (returnedUrls.length > 0) {
                      setGymPhotos(returnedUrls);
                    } else {
                      const next = [
                        ...gymPhotos,
                        ...Array.from(files).map(() => ""),
                      ];
                      setGymPhotos(next);
                    }
                    // allow re-select same files later
                    e.currentTarget.value = "";
                  } finally {
                    setUploadingGym(false);
                  }
                }}
              />
              <div className={styles.uploadIcon}>
                <CloudUploadIcon />
              </div>
              <p className={styles.uploadText}>
                <span className={styles.uploadLink}>
                  {uploadingGym ? "Завантаження..." : "Загрузіть"}
                </span>{" "}
                або перетащіть сюди файл
              </p>
              <p className={styles.uploadFormats}>.jpg .png до 5 МБ</p>
            </label>
          </div>
        </div>

        <div className={styles.modalFooter}>
          <button
            className={styles.modalSaveBtn}
            onClick={() => {
              const schedule_two =
                weekendStart && weekendEnd
                  ? `${weekendStart}–${weekendEnd}`
                  : "";
              const schedule_five =
                weekdayStart && weekdayEnd
                  ? `${weekdayStart}–${weekdayEnd}`
                  : "";
              onSave({
                title,
                email,
                phone,
                telegram,
                instagram,
                facebook,
                schedule_five,
                schedule_two,
                address,
              });
            }}
          >
            Зберегти дані залу
          </button>
        </div>
      </div>
    </div>
  );
}
