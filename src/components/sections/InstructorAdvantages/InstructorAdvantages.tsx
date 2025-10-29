"use client";
import React, { useRef, useEffect, useState } from "react";
import Image from "next/image";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination } from "swiper/modules";
import type { SwiperRef } from "swiper/react";
import {
  WalkingIcon,
  DollarIcon,
  LockIcon2,
  BarbellIcon,
  MedalIcon,
  CommanderIcon,
  User3Icon,
  Heart2Icon,
} from "@/components/Icons/Icons";
import s from "./InstructorAdvantages.module.css";
import SliderNav from "@/components/ui/SliderNav/SliderNavActions";
import {
  fetchInstructorAdvantages,
  InstructorAdvantagePost,
} from "@/lib/bfbApi";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

export default function InstructorAdvantages() {
  const swiperRef = useRef<SwiperRef>(null);
  const [active, setActive] = React.useState(0);
  const [advantages, setAdvantages] = useState<InstructorAdvantagePost[]>([]);
  const [, setLoading] = useState(false);
  const [, setError] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await fetchInstructorAdvantages();
        console.log("[InstructorAdvantages] response:", data);
        setAdvantages(data);
      } catch {
        setError("Не вдалося завантажити переваги");
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const renderVisual = (type: string) => {
    switch (type) {
      case "inventory":
        return (
          <div className={s.inventoryVisual}>
            <div className={s.inventoryOrbits} />
            <div className={`${s.inventoryIcon} ${s.large}`}>
              <LockIcon2 />
            </div>
            <div className={`${s.inventoryIcon} ${s.smallLeft}`}>
              <WalkingIcon />
            </div>
            <div className={`${s.inventoryIcon} ${s.smallRight}`}>
              <BarbellIcon />
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  const staticAdvantages = [
    {
      id: 1,
      title: "Право проводити тренування під брендом BFB",
      icons: [],
      images: ["/images/image5.png", "/images/image6.png"],
      hasIcons: false,
      hasImages: true,
    },
    {
      id: 2,
      title: "",
      description: undefined,
      hasIcons: false,
      hasImages: false,
    },
    {
      id: 3,
      title: "",
      description:
        "Не поспішаємо до результату. Даємо тілу час адаптуватись і розвиватись",
      hasIcons: false,
      hasImages: false,
    },
    {
      id: 4,
      title: "",
      description:
        "BFB — це не тільки про фізику, а про відчуття. Тіло не «виконує», а «відчуває»",
      hasIcons: false,
      hasImages: false,
    },
    {
      id: 5,
      title: "",
      description:
        "Ми не нав'язуємо темп. Кожен рухається так, як хоче саме сьогодні — без плану, без мети, за відчуттям.",
      hasIcons: false,
      hasImages: false,
    },
    {
      id: 6,
      title: "",
      description:
        "Зупинка — це частина процесу. Ми вчимо чути момент, коли треба не зробити ще, а зробити менше.",
      hasIcons: false,
      hasImages: false,
    },
  ];

  const mappedAdvantages =
    advantages.length > 0
      ? advantages.map((advantage) => ({
          id: advantage.id,
          title:
            advantage.acf?.advantage_title?.trim() ||
            advantage.title?.rendered?.trim() ||
            "",
          description: advantage.acf?.advantage_description?.trim(),
          icons: advantage.acf?.advantage_icons || [],
          images: advantage.acf?.advantage_images || [],
          hasIcons: advantage.acf?.advantage_has_icons || false,
          hasImages: advantage.acf?.advantage_has_images || false,
          visualType: advantage.acf?.advantage_visual_type || "inventory",
        }))
      : staticAdvantages;

  const handlePrev = () => {
    console.log("handlePrev called");
    if (swiperRef.current?.swiper) {
      console.log(
        "Current activeIndex before prev:",
        swiperRef.current.swiper.activeIndex
      );
      swiperRef.current.swiper.slidePrev();
    }
  };

  const handleNext = () => {
    console.log("handleNext called");
    if (swiperRef.current?.swiper) {
      console.log(
        "Current activeIndex before next:",
        swiperRef.current.swiper.activeIndex
      );
      swiperRef.current.swiper.slideNext();
    }
  };

  return (
    <section className={s.advantagesSection}>
      <div className={s.advantagesContainer}>
        <div className={s.advantagesHeader}>
          <span className={s.advantagesSubtitle}>Переваги</span>
          <h2 className={s.advantagesTitle}>Переваги напрямку BFB</h2>
        </div>

        <div className={s.swiperContainer}>
          <Swiper
            ref={swiperRef}
            modules={[Navigation, Pagination]}
            spaceBetween={16}
            slidesPerView={"auto"}
            slidesPerGroup={1}
            onSwiper={(swiper) => {
              console.log(
                "Swiper initialized, activeIndex:",
                swiper.activeIndex
              );
              // Вважаємо що активний слайд = activeIndex + 3
              setActive(swiper.activeIndex);
            }}
            onSlideChange={(swiper) => {
              console.log("Slide changed, activeIndex:", swiper.activeIndex);
              setActive(swiper.activeIndex);
            }}
            breakpoints={{
              768: {
                slidesPerView: "auto",
                spaceBetween: 16,
              },
              1024: {
                slidesPerView: "auto",
                spaceBetween: 16,
              },
            }}
            navigation={{
              prevEl: `.${s.navButtonPrev}`,
              nextEl: `.${s.navButtonNext}`,
            }}
            pagination={{
              clickable: true,
              el: `.${s.pagination}`,
              bulletClass: s.paginationBullet,
              bulletActiveClass: s.paginationBulletActive,
            }}
            className={s.swiper}
          >
            {mappedAdvantages.map((advantage, cardIndex) => (
              <SwiperSlide
                key={advantage.id}
                className={`${s.swiperSlide} ${
                  cardIndex === 2 ? `${s.wideSlide} ${s.inventorySlide}` : ""
                }`}
              >
                <div
                  className={`${s.advantageCardBox} ${
                    cardIndex === 2 ? `${s.advantageCardBoxWide} ${s.noBg}` : ""
                  } ${cardIndex === 0 ? s.advantageCardBoxGap : ""} ${
                    cardIndex === 1 ? s.advantageCardBoxSecond : ""
                  } ${cardIndex === 4 ? s.advantageCardBoxFifth : ""} ${
                    cardIndex === 5 ? s.advantageCardBoxSixth : ""
                  }`}
                >
                  <div className={s.advantageContent}>
                    <h3 className={s.advantageTitle}>{advantage.title}</h3>
                  </div>

                  <div className={s.advantageVisualContainer}>
                    {cardIndex === 1 && (
                      <div className={s.secondBlockWrap}>
                        <div className={s.statusBadge}>
                          <span className={s.badgeIcon}>
                            <div className={s.medalIcon}>
                              <MedalIcon />
                            </div>
                          </span>
                          <span className={s.statusText}>
                            Отримай новий професійний статус
                          </span>
                        </div>
                        <div className={s.arcWrap}>
                          <div className={s.arcWrapImage}>
                            <Image
                              src="/images/Ellipse%2056.png"
                              alt="Decoration"
                              fill
                              className={s.imageFill}
                            />
                          </div>
                        </div>
                        <div className={s.chartBars}>
                          <div className={s.chartBar}></div>
                          <div className={s.chartBar}></div>
                          <div className={s.chartBar}></div>
                          <div className={s.chartBar}></div>
                          <div className={s.chartBar}></div>
                        </div>
                      </div>
                    )}
                    {cardIndex !== 1 && (
                      <div className={s.advantageImagesContainer}>
                        {advantage.hasIcons && advantage.icons && (
                          <div className={s.advantageIcons}>
                            {advantage.icons.map((icon, index) => (
                              <div
                                key={index}
                                className={`${s.advantageIcon} ${
                                  s[
                                    `advantageIcon${
                                      index + 1
                                    }` as keyof typeof s
                                  ]
                                }`}
                              >
                                {icon}
                              </div>
                            ))}
                          </div>
                        )}

                        {advantage.hasImages && advantage.images && (
                          <div className={s.advantageImages}>
                            {advantage.images.map((image, index) => (
                              <div key={index} className={s.advantageImage}>
                                <Image
                                  src={image}
                                  alt={advantage.title}
                                  fill
                                  className={s.imageFill}
                                />
                              </div>
                            ))}
                          </div>
                        )}
                        {cardIndex === 2 && (
                          <div className={s.advInventoryBlock}>
                            <div className={s.advInventoryCard}>
                              <div className={s.advInventoryCardInner}>
                                <div className={s.advInventoryText}>
                                  <div className={s.advInfoBlock}>
                                    <div className={s.advInfoBlockText}>
                                      <h3 className={s.cardTitle}>
                                        Доступ до інвентарю
                                      </h3>
                                      <p className={s.cardText}>
                                        Можливість придбати борд та супутній
                                        інвентар після сертифікації
                                      </p>
                                    </div>
                                  </div>
                                </div>
                                <div className={s.advInventoryVisualWrap}>
                                  {renderVisual("inventory")}
                                </div>
                              </div>
                            </div>
                          </div>
                        )}
                        {cardIndex === 3 && (
                          <div className={s.discountCard}>
                            <div className={s.discountIcon}>
                              <div className={s.dollarIcon}>
                                <DollarIcon />
                              </div>
                            </div>
                            <div className={s.discountContent}>
                              <h3 className={s.discountTitle}>
                                Знижка для 2+ тренерів
                              </h3>
                              <p className={s.discountText}>
                                Можливість корпоративного навчання для 2+
                                тренерів зі знижкою
                              </p>
                            </div>
                          </div>
                        )}
                        {cardIndex === 4 && (
                          <div className={s.audienceCard}>
                            <div className={s.audienceHeader}>
                              <div className={s.badge}>
                                <div className={s.IcoBlock}>
                                  <CommanderIcon />
                                </div>
                                <p className={s.badgeText}>999+</p>
                              </div>
                              <div className={s.badge}>
                                <div className={s.IcoBlock}>
                                  <User3Icon />
                                </div>
                                <p className={s.badgeText}>999+</p>
                              </div>
                              <div className={s.badge}>
                                <div className={s.IcoBlock}>
                                  <Heart2Icon />
                                </div>
                                <p className={s.badgeText}>999+</p>
                              </div>
                            </div>

                            <div className={s.audienceContent}>
                              <h3 className={s.audienceTitle}>
                                Розширення цільової аудиторії
                              </h3>
                              <p className={s.audienceText}>
                                Залучайте більше клієнтів завдяки новому формату
                                тренувань та впізнаваності
                              </p>
                            </div>
                          </div>
                        )}
                        {cardIndex === 5 && (
                          <div className={s.mentorCard}>
                            <h3 className={s.mentorTitle}>
                              Підтримка наставника і спільноти після
                              сертифікації
                            </h3>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
        <SliderNav
          activeIndex={active}
          dots={3}
          onPrev={handlePrev}
          onNext={handleNext}
          onDotClick={(idx) => {
            console.log("Dot clicked, index:", idx);
            // Крапка 0 = слайд 3, крапка 1 = слайд 4, крапка 2 = слайд 5
            swiperRef.current?.swiper.slideTo(idx + 3);
          }}
        />
      </div>
    </section>
  );
}
