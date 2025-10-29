"use client";
import React, { useState, useEffect } from "react";
import styles from "./TrainerProfile.module.css";
// import SectionDivider from "../SectionDivider/SectionDivider";
import PersonalDataSection from "./PersonalDataSection";
import SuperpowerSection from "./SuperpowerSection";
import TagsSection from "./TagsSection";
import type { TrainerProfileForm, TrainingLocation } from "./types";
import { useUpdateTrainerProfile } from "@/lib/useMutation";
import { useAuthStore } from "@/store/auth";
import WorkExperienceSection from "./WorkExperienceSection";
import TrainingLocationsSection from "./TrainingLocationsSection";
import TrainingLocationModal from "./TrainingLocationModal";
import CertificatesSection from "./CertificatesSection";
import { uploadMedia } from "@/lib/bfbApi";

const TrainerProfile: React.FC = () => {
  const [formData, setFormData] = useState<TrainerProfileForm>({
    position: "",
    experience: "",
    location: "",
    desiredBoards: "",
    superpower: "",
    favoriteExercises: [
      "Ведення груп і персональних занять",
      "Ведення груп і персональних занять",
      "Ведення груп і персональних занять",
    ],
    specializations: [
      "Розвиток усіх груп м'язів",
      "Розвиток усіх груп м'язів",
      "Розвиток усіх груп м'язів",
    ],
    trainingLocations: [],
  });

  const [newFavoriteExercise, setNewFavoriteExercise] = useState("");
  const [newSpecialization, setNewSpecialization] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const { mutateAsync: updateProfile, isPending } = useUpdateTrainerProfile();
  const [certificateFiles, setCertificateFiles] = useState<File[]>([]);
  const userId = useAuthStore((s) => s.user?.id);

  const handleInputChange = (
    field: keyof TrainerProfileForm,
    value: string | number
  ) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleAddFavoriteExercise = () => {
    if (newFavoriteExercise.trim()) {
      setFormData((prev) => ({
        ...prev,
        favoriteExercises: [
          ...prev.favoriteExercises,
          newFavoriteExercise.trim(),
        ],
      }));
      setNewFavoriteExercise("");
    }
  };

  const handleRemoveFavoriteExercise = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      favoriteExercises: prev.favoriteExercises.filter((_, i) => i !== index),
    }));
  };

  const handleAddSpecialization = () => {
    if (newSpecialization.trim()) {
      setFormData((prev) => ({
        ...prev,
        specializations: [...prev.specializations, newSpecialization.trim()],
      }));
      setNewSpecialization("");
    }
  };

  const handleRemoveSpecialization = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      specializations: prev.specializations.filter((_, i) => i !== index),
    }));
  };

  const handleSave = async () => {
    const token =
      typeof window !== "undefined"
        ? localStorage.getItem("wp_jwt_override") ||
          localStorage.getItem("wp_jwt") ||
          undefined
        : undefined;
    if (process.env.NODE_ENV !== "production") {
      console.group("[TrainerProfile] ▶ Збереження профілю");
      console.log("token exists:", !!token);
      console.log("certificateFiles count:", certificateFiles.length);
      console.log("formData snapshot:", JSON.parse(JSON.stringify(formData)));
    }

    const meta: Record<string, unknown> = {};
    if (formData.position) meta.input_text_position = formData.position;
    if (formData.experience) meta.input_text_experience = formData.experience;
    if (formData.location) meta.input_text_locations_city = formData.location;
    if (formData.desiredBoards) meta.input_text_boards = formData.desiredBoards;
    if (formData.superpower) meta.textarea_super_power = formData.superpower;
    if (formData.favoriteExercises && formData.favoriteExercises.length)
      meta.point_data_favourite_exercise = formData.favoriteExercises;
    if (formData.specializations && formData.specializations.length)
      meta.point_data_my_specialty = formData.specializations;
    if (formData.trainingLocations && formData.trainingLocations.length) {
      meta.hl_data_my_wlocation = formData.trainingLocations.map((l) => ({
        hl_input_text_title: l.title,
        hl_input_text_email: l.email || "",
        hl_input_text_phone: l.phone || "",
        hl_input_text_telegram: l.telegram || "",
        hl_input_text_instagram: l.instagram || "",
        hl_input_text_facebook: l.facebook || "",
        hl_input_text_schedule_five: l.schedule_five || "",
        hl_input_text_schedule_two: l.schedule_two || "",
        hl_input_text_address: l.address || "",
      }));

      // Also map social contacts to top-level social fields expected by backend
      const firstLoc = formData.trainingLocations[0];
      if (firstLoc?.phone) meta.input_text_social_phone = firstLoc.phone;
      if (firstLoc?.telegram)
        meta.input_text_social_telegram = firstLoc.telegram;
      if (firstLoc?.instagram)
        meta.input_text_social_instagram = firstLoc.instagram;
    }

    // Якщо є сертифікати — завантажимо їх у медіа і додамо URL у meta
    if (certificateFiles.length && token) {
      if (process.env.NODE_ENV !== "production") {
        console.log("[TrainerProfile] ⬆ Завантажую сертифікати у медіа…");
      }
      const urls: string[] = [];
      for (const file of certificateFiles) {
        try {
          const res = await uploadMedia({
            file,
            fieldType: "img_link_data_certificate",
            token,
          });
          if (process.env.NODE_ENV !== "production") {
            console.log("[TrainerProfile] media upload result:", res);
          }
          if (res.success && res.url) urls.push(res.url);
        } catch (e) {
          if (process.env.NODE_ENV !== "production") {
            console.error("[TrainerProfile] media upload error:", e);
          }
        }
      }
      if (urls.length) {
        // Основний ключ (якщо бекенд дозволяє)
        meta.certificate = urls;
        // Додаткові можливі ключі
        (meta as Record<string, unknown>)["img_link_data_certificate"] = urls;
        (meta as Record<string, unknown>)["img_link_certificate"] = urls;

        // ВАРІАНТ масиву (як point_data_*)
        (meta as Record<string, unknown>)["point_data_certificate"] = urls;
        // ВАРІАНТ репітера (як hl_data_*)
        (meta as Record<string, unknown>)["hl_data_gallery"] = urls.map(
          (u) => ({
            hl_img_link_photo: [u],
          })
        );

        if (process.env.NODE_ENV !== "production") {
          console.log("[TrainerProfile] ↳ point_data_certificate:", urls);
          console.log(
            "[TrainerProfile] ↳ hl_data_gallery:",
            (meta as Record<string, unknown>)["hl_data_gallery"]
          );
        }
      }
      if (process.env.NODE_ENV !== "production") {
        console.log("[TrainerProfile] ✅ URLs сертифікатів:", urls);
      }
    }

    const payload: { id?: string | number; meta: Record<string, unknown> } = {
      meta,
    };
    if (userId) payload.id = userId;
    if (process.env.NODE_ENV !== "production") {
      console.log(
        "[TrainerProfile] Submitting payload (stringified):",
        JSON.stringify(payload, null, 2)
      );
      console.log(
        "[TrainerProfile] trainingLocations count:",
        formData.trainingLocations?.length || 0
      );
    }
    try {
      const resp = await updateProfile({ payload, token });
      if (process.env.NODE_ENV !== "production") {
        console.log("[TrainerProfile] ✅ updateProfile response:", resp);
      }
    } catch (e) {
      if (process.env.NODE_ENV !== "production") {
        console.error("[TrainerProfile] ❌ updateProfile error:", e);
      }
    } finally {
      if (process.env.NODE_ENV !== "production") {
        console.groupEnd();
      }
    }
  };

  const handleModalSave = (location: TrainingLocation) => {
    setFormData((prev) => {
      const current = [...(prev.trainingLocations || [])];
      if (
        editingIndex !== null &&
        editingIndex >= 0 &&
        editingIndex < current.length
      ) {
        current[editingIndex] = location;
      } else {
        current.push(location);
      }
      return { ...prev, trainingLocations: current };
    });
    setEditingIndex(null);
    closeModal();
  };

  const openModal = () => {
    const scrollY = window.scrollY;
    document.body.style.position = "fixed";
    document.body.style.top = `-${scrollY}px`;
    document.body.style.width = "100%";
    document.body.style.overflow = "hidden";
    document.body.classList.add("modalOpen");
    setIsModalOpen(true);
  };

  const closeModal = () => {
    const scrollY = document.body.style.top;
    document.body.style.position = "";
    document.body.style.top = "";
    document.body.style.width = "";
    document.body.style.overflow = "";
    document.body.classList.remove("modalOpen");
    window.scrollTo(0, parseInt(scrollY || "0") * -1);
    setIsModalOpen(false);
  };

  // Listen to edit/delete events from TrainingLocationsSection
  useEffect(() => {
    const handleEdit = (e: Event) => {
      const idx = (e as CustomEvent).detail?.index as number;
      const loc = formData.trainingLocations?.[idx];
      if (!loc) return;
      setEditingIndex(idx);
      openModal();
    };
    const handleDelete = (e: Event) => {
      const idx = (e as CustomEvent).detail?.index as number;
      setFormData((prev) => ({
        ...prev,
        trainingLocations: (prev.trainingLocations || []).filter(
          (_, i) => i !== idx
        ),
      }));
    };
    window.addEventListener("trainerLocationEdit", handleEdit as EventListener);
    window.addEventListener(
      "trainerLocationDelete",
      handleDelete as EventListener
    );
    return () => {
      window.removeEventListener(
        "trainerLocationEdit",
        handleEdit as EventListener
      );
      window.removeEventListener(
        "trainerLocationDelete",
        handleDelete as EventListener
      );
    };
  }, [formData.trainingLocations]);

  useEffect(() => {
    return () => {
      document.body.style.position = "";
      document.body.style.top = "";
      document.body.style.width = "";
      document.body.style.overflow = "";
      document.body.classList.remove("modalOpen");
    };
  }, []);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape" && isModalOpen) {
        closeModal();
      }
    };

    if (isModalOpen) {
      document.addEventListener("keydown", handleKeyDown);
    }

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isModalOpen]);

  return (
    <div className={styles.trainerProfile}>
      <div className={styles.header}>
        <h2 className={styles.title}>Профіль тренера</h2>
      </div>

      {/* <SectionDivider /> */}
      <div className={styles.divider}></div>

      <div className={styles.form}>
        <PersonalDataSection
          formData={formData}
          onChange={(field, value) => handleInputChange(field, value)}
        />
        {/* <SectionDivider /> */}
        <div className={styles.divider}></div>
        <SuperpowerSection
          value={formData.superpower}
          onChange={(value) => handleInputChange("superpower", value)}
        />
        {/* <SectionDivider /> */}
        <div className={styles.divider}></div>
        <TagsSection
          title="Моя улюблена вправа:"
          placeholder="Улюблена вправа"
          values={formData.favoriteExercises}
          newValue={newFavoriteExercise}
          onNewValueChange={setNewFavoriteExercise}
          onAdd={handleAddFavoriteExercise}
          onRemove={handleRemoveFavoriteExercise}
        />
        {/* <SectionDivider /> */}
        <div className={styles.divider}></div>
        <TagsSection
          title="Спеціалізація:"
          placeholder="Спеціалізація"
          values={formData.specializations}
          newValue={newSpecialization}
          onNewValueChange={setNewSpecialization}
          onAdd={handleAddSpecialization}
          onRemove={handleRemoveSpecialization}
        />
        {/* <SectionDivider /> */}
        <div className={styles.divider}></div>
        <WorkExperienceSection />
        {/* <SectionDivider /> */}
        <div className={styles.divider}></div>
        <TrainingLocationsSection
          onAddClick={openModal}
          locations={formData.trainingLocations || []}
        />
        {/* <SectionDivider /> */}
        <div className={styles.divider}></div>
        <CertificatesSection onChange={setCertificateFiles} />
        {/* Bottom Action Buttons */}
        <div className={styles.bottomActions}>
          <button
            className={styles.saveBtn}
            onClick={handleSave}
            disabled={isPending}
          >
            Зберегти дані
          </button>
          <button className={styles.clearBtn}>Стерти всю інформацію</button>
        </div>
      </div>

      <TrainingLocationModal
        isOpen={isModalOpen}
        onClose={closeModal}
        onSave={handleModalSave}
        initialLocation={
          editingIndex !== null && formData.trainingLocations
            ? formData.trainingLocations[editingIndex] || null
            : null
        }
      />
    </div>
  );
};

export default TrainerProfile;
