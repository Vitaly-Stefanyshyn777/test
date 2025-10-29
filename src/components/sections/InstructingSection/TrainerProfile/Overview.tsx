import React, { useState } from "react";
import Image from "next/image";
import styles from "./TrainerProfile.module.css";
import { TrainerUser } from "./types";
import { getAvatarUrl, getSpecialties } from "./utils";
import {
  DumbbellsIcon,
  LocationIcon,
  FacebookIcon,
  InstagramIcon,
  TelegramIcon,
  WhatsappIcon,
  WeightIcon,
} from "@/components/Icons/Icons";
import SliderNav from "@/components/ui/SliderNav/SliderNavActions";

export default function Overview({ trainer }: { trainer: TrainerUser }) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const avatar = getAvatarUrl(trainer?.avatar);
  const specialties = getSpecialties(trainer);

  let galleryImages: string[] = [];
  if (trainer?.gallery) {
    if (typeof trainer.gallery === "string") {
      galleryImages = [trainer.gallery];
    } else if (Array.isArray(trainer.gallery)) {
      galleryImages = trainer.gallery.filter(
        (x): x is string => typeof x === "string"
      );
    }
  }

  const locationText = Array.isArray(trainer?.locations)
    ? (trainer?.locations as string[]).join(", ")
    : trainer?.locations ?? "";

  const nextImage = () => {
    if (galleryImages.length > 0) {
      setCurrentImageIndex((prev) => (prev + 1) % galleryImages.length);
    }
  };

  const prevImage = () => {
    if (galleryImages.length > 0) {
      setCurrentImageIndex(
        (prev) => (prev - 1 + galleryImages.length) % galleryImages.length
      );
    }
  };

  const goToImage = (index: number) => {
    setCurrentImageIndex(index);
  };

  return (
    <div className={styles.overview}>
      <div className={styles.profileInfo}>
        <div className={styles.superPowerContainer}>
          <div className={styles.profileImage}>
            <Image
              src={
                avatar ||
                "https://via.placeholder.com/300x300/f0f0f0/666?text=Тренер"
              }
              alt={trainer.name || "Тренер"}
              width={300}
              height={300}
              className={styles.avatar}
            />
          </div>

          <div className={styles.superPowerBlock}>
            <div className={styles.superPower}>
              <h3>Моя суперсила:</h3>
              <p>{trainer.super_power || "Не вказано"}</p>
            </div>
            <div className={styles.favoriteExercise}>
              <h3>Улюблена вправа:</h3>
              <div className={styles.exerciseItem}>
                <span className={styles.exerciseIcon}>
                  <WeightIcon />
                </span>
                <span className={styles.exerciseText}>
                  {trainer.favourite_exercise || "Не вказано"}
                </span>
              </div>
            </div>
          </div>

          <div className={styles.ContactsContainer}>
            <p className={styles.ContactsText}>Контакти:</p>
            <div className={styles.IconsContainer}>
              <div className={styles.IconsBlock}>
                <InstagramIcon />
              </div>
              <div className={styles.IconsBlock}>
                <FacebookIcon />
              </div>
              <div className={styles.IconsBlock}>
                <TelegramIcon />
              </div>
              <div className={styles.IconsBlock}>
                <WhatsappIcon />
              </div>
            </div>
            <button className={styles.contactButton}>
              Зв&apos;язатися з тренером
            </button>
          </div>
        </div>

        <div className={styles.headerContainer}>
          <div className={styles.headerBlock}>
            <div className={styles.header}>
              <h1 className={styles.title}>Тренер, Реабілітолог</h1>
              <h2 className={styles.name}>{trainer.name}</h2>
            </div>

            <div className={styles.info}>
              <div className={styles.infoItem}>
                <span className={styles.infoIcon}>
                  <LocationIcon />
                </span>
                <span className={styles.infoText}>
                  {locationText || "Місто не вказано"}
                </span>
              </div>
              <div className={styles.infoItem}>
                <span className={styles.infoIcon}>
                  <DumbbellsIcon />
                </span>
                <span className={styles.infoText}>
                  Досвід: {trainer.experience || "Не вказано"}
                </span>
              </div>
            </div>
          </div>

          <div className={styles.specializationsContainer}>
            <div className={styles.specializations}>
              <h3>Спеціалізації:</h3>
              <div className={styles.tags}>
                {specialties.length > 0 ? (
                  specialties.map((spec: string, index: number) => (
                    <span key={index} className={styles.tag}>
                      {spec}
                    </span>
                  ))
                ) : (
                  <span className={styles.tag}>Не вказано</span>
                )}
              </div>
            </div>
          </div>

          <div className={styles.workExperienceContainer}>
            <h3 className={styles.workExperienceTitle}>Досвід роботи:</h3>
            <div className={styles.experienceEntry}>
              <div className={styles.experienceEntryBlock}>
                <div className={styles.workExperienceBlock}>
                  <div className={styles.workExperience}>
                    {trainer.my_experience &&
                    trainer.my_experience.length > 0 ? (
                      trainer.my_experience.map((exp, index) => (
                        <div key={index} className={styles.experienceItem}>
                          <div className={styles.experienceHeaderContainer}>
                            <div className={styles.experienceHeader}>
                              <span className={styles.company}>
                                {exp.hl_input_text_gym}
                              </span>
                              <span className={styles.period}>
                                {exp.hl_input_date_date_start} -{" "}
                                {exp.hl_input_date_date_end}
                              </span>
                            </div>
                            <p className={styles.experienceDescription}>
                              {exp.hl_textarea_ex_description}
                            </p>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className={styles.experienceItem}>
                        <div className={styles.experienceHeader}>
                          <span className={styles.company}>—</span>
                          <span className={styles.period}>—</span>
                        </div>
                        <p>Інформація відсутня</p>
                      </div>
                    )}
                  </div>
                </div>
                <button className={styles.showMore} id="favorite-exercise">
                  Показати ще
                </button>
              </div>
            </div>
          </div>

          <div id="gallery" className={styles.gallerySection}>
            <h3 className={styles.galleryTitle}>Галерея</h3>
            {galleryImages.length > 0 ? (
              <div className={styles.galleryContainer}>
                <div className={styles.galleryImageWrapper}>
                  <Image
                    src={galleryImages[currentImageIndex]}
                    alt={`Фото тренера ${currentImageIndex + 1}`}
                    width={600}
                    height={400}
                    className={styles.galleryImage}
                  />
                </div>
              </div>
            ) : (
              <div className={styles.galleryContainer}>
                <div className={styles.galleryImageWrapper}>
                  <p
                    style={{
                      textAlign: "center",
                      padding: "20px",
                      color: "#666",
                    }}
                  >
                    Галерея порожня
                  </p>
                </div>
              </div>
            )}
            <SliderNav
              activeIndex={currentImageIndex}
              dots={galleryImages.length}
              onPrev={prevImage}
              onNext={nextImage}
              onDotClick={goToImage}
              buttonBgColor="var(--bg-color)"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
