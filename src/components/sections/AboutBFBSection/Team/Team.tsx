"use client";
import React, { useEffect, useMemo, useRef, useState } from "react";
import Image from "next/image";
import {
  WalkingIcon,
  StudentHatIcon,
  User2Icon,
  Weight3Icon,
  InstagramIcon,
} from "@/components/Icons/Icons";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination } from "swiper/modules";
import type { SwiperRef } from "swiper/react";
import s from "./Team.module.css";
import SliderNav from "@/components/ui/SliderNav/SliderNavActions";

import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

interface TeamMemberUi {
  id: number | string;
  name: string;
  role: string;
  image: string;
  instagram: string;
  achievements: { icon: React.ReactNode; text: string }[];
}

interface InstructorApi {
  id?: number;
  title?: { rendered?: string };
  Status?: string;
  Avatar?: string;
  Text_instagram?: string;
  Point_1?: string;
  Point_2?: string;
  Experience?: string;
}

export default function Team() {
  const swiperRef = useRef<SwiperRef>(null);
  const [active, setActive] = useState(0);
  const [members, setMembers] = useState<TeamMemberUi[] | null>(null);

  const baseMembers: TeamMemberUi[] = useMemo(
    () => [
      {
        id: 1,
        name: "Ліка Фітденс",
        role: "Засновниця BFB",
        image: "/images/Rectangle5898.png",
        instagram: "@lika_fitdance",
        achievements: [
          {
            icon: <WalkingIcon className={s.achievementIconSvg} />,
            text: "Засновниця BFB",
          },
          {
            icon: <StudentHatIcon className={s.achievementIconSvg} />,
            text: "Ідеологиня платформи та напрямку",
          },
          {
            icon: <User2Icon className={s.achievementIconSvg} />,
            text: "Об'єднує людей навколо фітнесу",
          },
          {
            icon: <Weight3Icon className={s.achievementIconSvg} />,
            text: "12 років практичного досвіду",
          },
        ],
      },
    ],
    []
  );

  useEffect(() => {
    const controller = new AbortController();
    (async () => {
      try {
        const res = await fetch(
          "https://www.api.bfb.projection-learn.website/wp-json/wp/v2/instructors",
          { signal: controller.signal, cache: "no-store" }
        );
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const data = (await res.json()) as InstructorApi[];
        const mapped: TeamMemberUi[] = (Array.isArray(data) ? data : []).map(
          (i) => {
            const name: string = i?.title?.rendered || "";
            const role: string = i?.Status || "";
            const image: string = i?.Avatar || "/images/Rectangle5898.png";
            const instagram: string = i?.Text_instagram || "";
            const achievements: TeamMemberUi["achievements"] = [];
            if (i?.Point_1)
              achievements.push({
                icon: <StudentHatIcon className={s.achievementIconSvg} />,
                text: i.Point_1,
              });
            if (i?.Point_2)
              achievements.push({
                icon: <User2Icon className={s.achievementIconSvg} />,
                text: i.Point_2,
              });
            if (i?.Experience)
              achievements.push({
                icon: <Weight3Icon className={s.achievementIconSvg} />,
                text: `Досвід: ${i.Experience}`,
              });
            if (achievements.length === 0 && role)
              achievements.push({
                icon: <WalkingIcon className={s.achievementIconSvg} />,
                text: role,
              });
            return {
              id: i?.id ?? name,
              name,
              role,
              image,
              instagram,
              achievements,
            };
          }
        );
        setMembers(mapped.length > 0 ? mapped : baseMembers);
      } catch {
        setMembers(baseMembers);
      }
    })();
    return () => controller.abort();
  }, [baseMembers]);

  const teamMembers = members ?? baseMembers;

  const handlePrev = () => swiperRef.current?.swiper.slidePrev();
  const handleNext = () => swiperRef.current?.swiper.slideNext();

  return (
    <section className={s.teamSection}>
      <div className={s.teamContainer}>
        <div className={s.teamHeader}>
          <span className={s.teamSubtitle}>Наша команда</span>
          <h2 className={s.teamTitle}>Люди, які створюють BFB</h2>
        </div>

        <div className={s.swiperContainer}>
          <Swiper
            ref={swiperRef}
            modules={[Navigation, Pagination]}
            spaceBetween={16}
            slidesPerView={1}
            slidesPerGroup={1}
            breakpoints={{
              640: { slidesPerView: 2, spaceBetween: 16 },
              1024: { slidesPerView: 3, spaceBetween: 20 },
              1280: { slidesPerView: 4, spaceBetween: 24 },
            }}
            onSlideChange={(swiper) => setActive(swiper.activeIndex)}
            className={s.swiper}
          >
            {teamMembers.map((member) => (
              <SwiperSlide key={member.id} className={s.swiperSlide}>
                <div className={s.teamCard}>
                  <div className={s.teamCardImage}>
                    <Image
                      src={member.image}
                      alt={member.name}
                      fill
                      style={{ objectFit: "cover" }}
                    />
                    <div className={s.instagramHandle}>
                      <InstagramIcon />
                      <p className={s.instagramHandleText}>
                        {member.instagram}
                      </p>
                    </div>
                  </div>

                  <div className={s.teamCardContent}>
                    <div className={s.teamCardContentHeader}>
                      <div className={s.teamCardRole}>{member.role}</div>
                      <h3 className={s.teamCardName}>{member.name}</h3>
                    </div>

                    <div className={s.achievementsList}>
                      {member.achievements.map((achievement, index) => (
                        <div key={index} className={s.achievementItem}>
                          <div className={s.achievementIcon}>
                            {achievement.icon}
                          </div>
                          <span className={s.achievementText}>
                            {achievement.text}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>

        {teamMembers.length > 4 && (
          <SliderNav
            activeIndex={active}
            dots={teamMembers.length}
            onPrev={handlePrev}
            onNext={handleNext}
            onDotClick={(idx) => swiperRef.current?.swiper.slideTo(idx)}
          />
        )}
      </div>
    </section>
  );
}
