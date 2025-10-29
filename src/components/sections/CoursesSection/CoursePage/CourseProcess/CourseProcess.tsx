"use client";
import React from "react";
import s from "./CourseProcess.module.css";
import {
  VideoLessonIcon,
  MentorshipIcon,
  OnlineSessionIcon,
  ExtraMaterialsIcon,
  ExamTaskIcon,
  CertificateIcon2,
} from "@/components/Icons/Icons";

const items = [
  {
    title: "Відеоуроки",
    text: "Доступ до навчальних відео у будь-який час та з будь-якого пристрою",
    icon: <VideoLessonIcon />,
    number: "01",
  },
  {
    title: "Кураторський супровід",
    text: "Зворотний зв’язок від менторів та відповіді на запитання",
    icon: <MentorshipIcon />,
    number: "02",
  },
  {
    title: "Онлайн-сесія з засновником",
    text: "Живі зустрічі з викладачем для розбору тем та спілкування з групою.",
    icon: <OnlineSessionIcon />,
    number: "03",
  },
  {
    title: "Додаткові матеріали",
    text: "Доступ до готових тренувань та музика для старту",
    icon: <ExtraMaterialsIcon />,
    number: "04",
  },
  {
    title: "Екзаменаційне завдання",
    text: "Виконання завдання для підтвердження знань з курсу",
    icon: <ExamTaskIcon />,
    number: "05",
  },
  {
    title: "Сертифікація",
    text: "Підсумкова перевірка знань та вручення сертифікату",
    icon: <CertificateIcon2 />,
    number: "06",
  },
];

const CourseProcess: React.FC = () => {
  return (
    <section className={s.section}>
      <div className={s.container}>
        <div className={s.titleTextBlock}>
          <h2 className={s.title}>Ваш шлях до тренерства</h2>
        </div>

        <div className={s.row}>
          {items.map((it, idx) => (
            <div key={idx} className={s.item}>
              <div className={s.itemContent}>
                <div className={s.icon}>
                  {it.icon}
                  <p className={s.number}>{it.number}</p>
                </div>

                <div className={s.itemIconBlock}>
                  <h3 className={s.itemTitle}>{it.title}</h3>
                  <p className={s.itemText}>{it.text}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default CourseProcess;
