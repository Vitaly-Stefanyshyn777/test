"use client";
import React, { useEffect, useState } from "react";
import {
  HeartbeatIcon,
  DumbbellsIcon,
  DiplomaIcon,
} from "@/components/Icons/Icons";
import s from "./Founder.module.css";
import { useInstructorQuery } from "@/components/hooks/useWpQueries";
import {
  InstagramIcon,
  StudentHatIcon,
  HonorsIcon,
  BulbIcon,
} from "@/components/Icons/Icons";

interface Instructor {
  title: string;
  status: string;
  avatar: string;
  experience: string;
  countTraining: string;
  certificates: string;
  linkInstagram: string;
  textInstagram: string;
  aboutMe: string;
  myMission: string;
}

export default function Founder() {
  const [data, setData] = useState<Instructor | null>(null);
  const { data: raw, isLoading, isError } = useInstructorQuery(233);

  useEffect(() => {
    if (!raw) return;
    type RawInstructor = {
      title?: { rendered?: string };
      Status?: string;
      Avatar?: string;
      Experience?: string;
      Count_training?: string;
      Certificates?: string;
      Link_instagram?: string;
      Text_instagram?: string;
      About_me?: string;
      Description?: string;
      My_mission?: string;
    };
    const j = raw as unknown as RawInstructor;
    const mapped: Instructor = {
      title: j?.title?.rendered || "",
      status: j?.Status || "Засновниця BFB",
      avatar: j?.Avatar || "",
      experience: j?.Experience || "",
      countTraining: j?.Count_training || "",
      certificates: j?.Certificates || "",
      linkInstagram: j?.Link_instagram || "",
      textInstagram: j?.Text_instagram || "",
      aboutMe: j?.About_me || j?.Description || "",
      myMission: j?.My_mission || "",
    };
    setData(mapped);
  }, [raw]);

  const achievements = [
    {
      id: 1,
      icon: <HeartbeatIcon />,
      number: data?.experience || "",
      description: "Практичного досвіду у сфері фітнесу та тренерської роботи",
    },
    {
      id: 2,
      icon: <DumbbellsIcon />,
      number: data?.countTraining || "",
      description: "Практичні майстер-класи для професійного розвитку тренерів",
    },
    {
      id: 3,
      icon: <DiplomaIcon />,
      number: data?.certificates || "",
      description:
        "Сертифікувала сотні тренерів по всій Україні та за її межами",
    },
  ];

  return (
    <section className={s.founderSection}>
      <div className={s.founderContainer}>
        {isLoading && (
          <div className={s.missionCard}>
            <div className={s.missionCardContent}>
              <h3 className={s.missionTitle}>Завантаження…</h3>
            </div>
          </div>
        )}
        {isError && (
          <div className={s.missionCard}>
            <div className={s.missionCardContent}>
              <h3 className={s.missionTitle}>Не вдалося завантажити</h3>
            </div>
          </div>
        )}
        <div className={s.founderLeft}>
          <div className={s.founderCard}>
            <div className={s.founderAboutMe}>
              <div className={s.founderAboutMeIcon}>
                <InstagramIcon />
              </div>
              <p className={s.founderAboutMeNickname}>
                {data?.textInstagram || ""}
              </p>
              <div></div>
            </div>
            <div className={s.foundermission}>
              <h4 className={s.founderAboutMeTitle}>Про мене</h4>
              <p className={s.founderAboutMeText}>{data?.aboutMe || ""}</p>
            </div>
          </div>

          <div className={s.founderMission}>
            <div className={s.founderMissionIcons}>
              <div className={s.founderMissionIcon}>
                <StudentHatIcon />
              </div>
              <div className={s.founderMissionIcon}>
                <HonorsIcon />
              </div>
              <div className={s.founderMissionIcon}>
                <BulbIcon />
              </div>
            </div>
            <div className={s.founderMissionContent}>
              <h4 className={s.founderMissionTitle}>Моя місія</h4>
              <p className={s.founderMissionText}>{data?.myMission || ""}</p>
            </div>
          </div>
        </div>
        <div className={s.missionCard}>
          <div className={s.missionCardContent}>
            <h3 className={s.missionTitle}>
              {data?.status || "Засновниця BFB"}{" "}
            </h3>
            <p className={s.missionText}>{data?.title || ""}</p>
          </div>
        </div>

        <div className={s.achievements}>
          {achievements.map((achievement) => (
            <div key={achievement.id} className={s.achievementCard}>
              <div className={s.achievementIcon}>{achievement.icon}</div>
              <div className={s.achievementNumberDescription}>
                <h4 className={s.achievementNumber}>{achievement.number}</h4>
                <p className={s.achievementDescription}>
                  {achievement.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
