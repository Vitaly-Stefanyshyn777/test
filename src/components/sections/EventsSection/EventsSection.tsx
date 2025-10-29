"use client";
import React, { useState } from "react";
import Image from "next/image";
import s from "./EventsSection.module.css";
import {
  User2Icon,
  StudentHatIcon,
  WeightIcon,
  WalkingIcon,
  RightArrowIcon,
  ArrowLeftIcon,
} from "@/components/Icons/Icons";

interface Event {
  id: string;
  date: string;
  time: string;
  title: string;
  description: string;
  image: string;
  location: string;
  venue: string;
  dateRange: string;
  results: {
    icon: string;
    text: string;
  }[];
}

const EventsSection: React.FC = () => {
  const [currentDate, setCurrentDate] = useState(new Date());

  const generateCalendar = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const today = new Date();
    const currentDay = today.getDate();
    const currentMonth = today.getMonth();
    const currentYear = today.getFullYear();

    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const startDay = firstDay.getDay();
    const daysInMonth = lastDay.getDate();

    const calendarDays = [];

    for (let day = 1; day <= daysInMonth; day++) {
      const isToday =
        day === currentDay && month === currentMonth && year === currentYear;

      calendarDays.push({
        day,
        isCurrentMonth: true,
        isToday,
        hasEvent: Math.random() > 0.7,
      });
    }

    const remainingDays = 35 - calendarDays.length;
    for (let day = 1; day <= remainingDays; day++) {
      calendarDays.push({
        day,
        isCurrentMonth: false,
        isToday: false,
        hasEvent: Math.random() > 0.7,
      });
    }

    return calendarDays;
  };

  const events: Event[] = [
    {
      id: "1",
      date: "26 травня",
      time: "12:30",
      title: "BFB Intensive Weekend",
      description: "",
      image: "/images/event1.jpg",
      location: "КИЇВ, ОБОЛОНЬ",
      venue: "СТУДІЯ MOVESPACE",
      dateRange: "11-12 ТРАВНЯ 2025",
      results: [
        { icon: "👥", text: "Нові знайомства" },
        { icon: "🎓", text: "Практичні знання" },
        { icon: "⚙️", text: "Робота з інвентарем" },
        { icon: "🏄", text: "Техніка на борді або Навички в русі" },
      ],
    },
    {
      id: "2",
      date: "28 травня",
      time: "14:00",
      title: "BFB Advanced Training",
      description:
        "Просунутий курс для досвідчених тренерів. Поглиблене вивчення методики та нові техніки тренувань. Розширені можливості та професійні секрети.",
      image: "/images/event2.jpg",
      location: "КИЇВ, ОБОЛОНЬ",
      venue: "СТУДІЯ MOVESPACE",
      dateRange: "28 ТРАВНЯ 2025",
      results: [
        { icon: "👥", text: "Нові знайомства" },
        { icon: "🎓", text: "Практичні знання" },
        { icon: "⚙️", text: "Робота з інвентарем" },
        { icon: "🏄", text: "Техніка на борді" },
      ],
    },
    {
      id: "3",
      date: "30 травня",
      time: "10:00",
      title: "BFB Beginner Workshop",
      description:
        "Вступний воркшоп для новачків. Ознайомлення з базовими принципами та першими кроками в BFB. Ідеально для початківців.",
      image: "/images/event3.jpg",
      location: "КИЇВ, ОБОЛОНЬ",
      venue: "СТУДІЯ MOVESPACE",
      dateRange: "30 ТРАВНЯ 2025",
      results: [
        { icon: "👥", text: "Нові знайомства" },
        { icon: "🎓", text: "Практичні знання" },
        { icon: "⚙️", text: "Робота з інвентарем" },
        { icon: "🏄", text: "Техніка на борді" },
      ],
    },
    {
      id: "4",
      date: "2 червня",
      time: "16:30",
      title: "BFB Master Class",
      description:
        "Майстер-клас від експертів. Розкриття секретів професійного тренування та досягнення максимальних результатів. Ексклюзивні техніки.",
      image: "/images/event4.jpg",
      location: "КИЇВ, ОБОЛОНЬ",
      venue: "СТУДІЯ MOVESPACE",
      dateRange: "2 ЧЕРВНЯ 2025",
      results: [
        { icon: "👥", text: "Нові знайомства" },
        { icon: "🎓", text: "Практичні знання" },
        { icon: "⚙️", text: "Робота з інвентарем" },
        { icon: "🏄", text: "Техніка на борді" },
      ],
    },
    {
      id: "5",
      date: "5 червня",
      time: "18:00",
      title: "BFB Team Building",
      description:
        "Командний воркшоп для корпоративних клієнтів. Розвиток команди через спільні тренування та досягнення цілей. Корпоративні програми.",
      image: "/images/event5.jpg",
      location: "КИЇВ, ОБОЛОНЬ",
      venue: "СТУДІЯ MOVESPACE",
      dateRange: "5 ЧЕРВНЯ 2025",
      results: [
        { icon: "👥", text: "Нові знайомства" },
        { icon: "🎓", text: "Практичні знання" },
        { icon: "⚙️", text: "Робота з інвентарем" },
        { icon: "🏄", text: "Техніка на борді" },
      ],
    },
  ];

  const [selectedEvent, setSelectedEvent] = useState<Event | null>(
    events[0] || null
  );

  const calendarDays = generateCalendar(currentDate);

  const weekDays = ["ПН", "ВТ", "СР", "ЧТ", "ПТ", "СБ", "НД"];

  const goToPreviousMonth = () => {
    setCurrentDate(
      new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1)
    );
  };

  const goToNextMonth = () => {
    setCurrentDate(
      new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1)
    );
  };

  return (
    <section className={s.section}>
      <div className={s.container}>
        <div className={s.header}>
          <div className={s.headerLine}></div>
          <div className={s.TitleTextBlock}>
            <p className={s.headerText}>Календар подій</p>
            <h2 className={s.title}>
              Живі події, реальні люди, фітнес, який надихає
            </h2>
          </div>
        </div>

        <div className={s.content}>
          <div className={s.leftColumn}>
            <div className={s.leftColumnWrapper}>
              <div className={s.calendarBlock}>
                <div className={s.calendar}>
                  <div className={s.calendarHeader}>
                    <h3 className={s.monthTitle}>
                      {currentDate.toLocaleDateString("uk-UA", {
                        month: "long",
                        year: "numeric",
                      })}
                    </h3>
                    <div className={s.monthNavigation}>
                      <button
                        className={s.navButton}
                        onClick={goToPreviousMonth}
                      >
                        <div className={s.navButtonIcon}>
                          <ArrowLeftIcon />
                        </div>
                      </button>
                      <button className={s.navButton} onClick={goToNextMonth}>
                        <div className={s.navButtonIcon}>
                          <RightArrowIcon />
                        </div>
                      </button>
                    </div>
                  </div>

                  <div className={s.calendarContent}>
                    <div className={s.weekDays}>
                      {weekDays.map((day) => (
                        <div key={day} className={s.weekDay}>
                          {day}
                        </div>
                      ))}
                    </div>

                    <div className={s.calendarGrid}>
                      {calendarDays.map((day, index) => (
                        <div
                          key={index}
                          className={`${s.calendarDay} ${
                            !day.isCurrentMonth ? s.otherMonth : ""
                          } ${day.isToday ? s.selected : ""} ${
                            day.hasEvent ? s.hasEvent : ""
                          }`}
                        >
                          {day.day}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
              <h3 className={s.eventsTitle}>Календар подій</h3>
              <div className={s.eventsListBlock}>
                <div className={s.eventsList}>
                  {events.map((event, index) => (
                    <div
                      key={event.id}
                      className={`${s.eventItem} ${
                        selectedEvent?.id === event.id ? s.activeEvent : ""
                      }`}
                      onClick={() => setSelectedEvent(event)}
                    >
                      <div className={s.eventDate}>
                        <span className={s.eventDay}>{event.date}</span>
                        <span className={s.eventTime}>{event.time}</span>
                      </div>
                      <div className={s.eventDivider}></div>
                      <div className={s.eventInfo}>
                        <h4 className={s.eventTitle}>{event.title}</h4>
                        {event.description && (
                          <p className={s.eventDescription}>
                            {event.description}
                          </p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className={s.rightColumn}>
            <div className={s.eventCardBlock}>
              <div className={s.eventCard}>
                <div className={s.eventCardImage}>
                  <Image
                    src="/images/image2.png"
                    alt="BFB Intensive Weekend"
                    fill
                    className={s.cardImage}
                  />
                </div>
                <div className={s.eventCardImageWrap}>
                  <div className={s.eventCardContent}>
                    <div className={s.eventCardMeta}>
                      <div className={s.cardMetaItem}>
                        <p className={s.cardMetaItemText}>11-12 ТРАВНЯ 2025</p>
                      </div>
                      <div className={s.cardMetaItem}>
                        <p className={s.cardMetaItemText}>КИЇВ, ОБОЛОНЬ</p>
                      </div>
                      <div className={s.cardMetaItem}>
                        <p className={s.cardMetaItemText}>СТУДІЯ MOVESPACE</p>
                      </div>
                    </div>

                    <div className={s.eventCardInfo}>
                      <h3 className={s.eventCardTitle}>
                        BFB Intensive Weekend
                      </h3>
                      <p className={s.eventCardDescription}>
                        Живий воркшоп для тренерів і тих, хто хоче ближче
                        познайомитись із методикою. 2 дні практики, техніка
                        борду, реальні тренування з Лікою Фітденс,
                        ком&apos;юніті і 100% перезавантаження. Ідеально як
                        перше занурення в BFB.
                      </p>
                    </div>

                    <div className={s.eventCardResults}>
                      <h4 className={s.resultsTitle}>Результат:</h4>
                      <div className={s.resultsGrid}>
                        <div className={s.resultItem}>
                          <span className={s.resultIcon}>
                            <User2Icon />
                          </span>
                          <span className={s.resultText}>Нові знайомства</span>
                        </div>
                        <div className={s.resultItem}>
                          <span className={s.resultIcon}>
                            <StudentHatIcon />
                          </span>
                          <span className={s.resultText}>Практичні знання</span>
                        </div>
                        <div className={s.resultItem}>
                          <span className={s.resultIcon}>
                            <WeightIcon />
                          </span>
                          <span className={s.resultText}>
                            Робота з інвентарем
                          </span>
                        </div>
                        <div className={s.resultItem}>
                          <span className={s.resultIcon}>
                            <WalkingIcon />
                          </span>
                          <span className={s.resultText}>
                            Техніка на борді або Навички в русі
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <button className={s.eventCardButton}>Записатись</button>
                </div>
                {/*  */}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default EventsSection;
