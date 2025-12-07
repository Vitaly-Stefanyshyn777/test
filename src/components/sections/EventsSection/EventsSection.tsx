"use client";
import React, { useState, useMemo } from "react";
import Image from "next/image";
import s from "./EventsSection.module.css";
import {
  ArrowLeftIcon,
  RightArrowIcon,
  StudentHatIcon,
  User2Icon,
  WalkingIcon,
  WeightIcon,
  CloseButtonIcon,
} from "@/components/Icons/Icons";
import { useEventsQuery } from "@/components/hooks/useWpQueries";
import type { EventPost } from "@/lib/bfbApi";

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

// Масив місяців у називному відмінку (для заголовка календаря)
const monthNames = [
  "Січень",
  "Лютий",
  "Березень",
  "Квітень",
  "Травень",
  "Червень",
  "Липень",
  "Серпень",
  "Вересень",
  "Жовтень",
  "Листопад",
  "Грудень",
];

// Функція для форматування дати українською
const formatDateUkrainian = (dateString: string): string => {
  const date = new Date(dateString);
  const months = [
    "Січня",
    "Лютого",
    "Березня",
    "Квітня",
    "Травня",
    "Червня",
    "Липня",
    "Серпня",
    "Вересня",
    "Жовтня",
    "Листопада",
    "Грудня",
  ];
  return `${date.getDate()} ${months[date.getMonth()]}`;
};

// Функція для форматування діапазону дат
const formatDateRange = (
  schedule: Array<{ hl_input_date_date?: string }>
): string => {
  if (!schedule || schedule.length === 0) return "";

  const dates = schedule
    .map((s) => s.hl_input_date_date)
    .filter(Boolean)
    .sort();

  if (dates.length === 0) return "";
  if (dates.length === 1) {
    const date = new Date(dates[0]!);
    const months = [
      "СІЧНЯ",
      "ЛЮТОГО",
      "БЕРЕЗНЯ",
      "КВІТНЯ",
      "ТРАВНЯ",
      "ЧЕРВНЯ",
      "ЛИПНЯ",
      "СЕРПНЯ",
      "ВЕРЕСНЯ",
      "ЖОВТНЯ",
      "ЛИСТОПАДА",
      "ГРУДНЯ",
    ];
    return `${date.getDate()} ${months[date.getMonth()]} ${date.getFullYear()}`;
  }

  const firstDate = new Date(dates[0]!);
  const lastDate = new Date(dates[dates.length - 1]!);
  const months = [
    "СІЧНЯ",
    "ЛЮТОГО",
    "БЕРЕЗНЯ",
    "КВІТНЯ",
    "ТРАВНЯ",
    "ЧЕРВНЯ",
    "ЛИПНЯ",
    "СЕРПНЯ",
    "ВЕРЕСНЯ",
    "ЖОВТНЯ",
    "ЛИСТОПАДА",
    "ГРУДНЯ",
  ];

  if (firstDate.getMonth() === lastDate.getMonth()) {
    return `${firstDate.getDate()}-${lastDate.getDate()} ${
      months[firstDate.getMonth()]
    } ${firstDate.getFullYear()}`;
  }

  return `${firstDate.getDate()} ${
    months[firstDate.getMonth()]
  }-${lastDate.getDate()} ${
    months[lastDate.getMonth()]
  } ${firstDate.getFullYear()}`;
};

// Функція маппінгу EventPost -> Event
const mapEventPostToEvent = (eventPost: EventPost): Event => {
  const schedule = eventPost.Schedule || [];
  const firstSchedule = schedule[0];

  // Витягуємо дату та час з першого елемента Schedule
  const eventDate = firstSchedule?.hl_input_date_date || eventPost.date || "";
  const eventTime = firstSchedule?.hl_input_time_time || "12:00";

  // Форматуємо дату для списку
  const formattedDate = eventDate ? formatDateUkrainian(eventDate) : "";

  // Форматуємо діапазон дат
  const dateRange = formatDateRange(schedule);

  // Перетворюємо Result у results
  const results = (eventPost.Result || []).map((result) => ({
    icon: result.hl_img_svg_icon || "",
    text: result.hl_input_text_text || "",
  }));

  return {
    id: String(eventPost.id),
    date: formattedDate,
    time: eventTime,
    title: eventPost.Title || eventPost.title?.rendered || "",
    description: eventPost.Description || eventPost.content?.rendered || "",
    image: eventPost.Banner || "/images/image2.png",
    location: eventPost.City || "",
    venue: eventPost.Location || "",
    dateRange,
    results,
  };
};

const EventsSection: React.FC = () => {
  const [isMounted, setIsMounted] = useState(false);
  const [currentDate, setCurrentDate] = useState<Date>(new Date());
  const [isMobile, setIsMobile] = useState(false);

  // Завантажуємо події з API
  const { data: eventsData = [], isLoading, isError } = useEventsQuery();

  React.useEffect(() => {
    setIsMounted(true);
  }, []);

  React.useEffect(() => {
    const mql = window.matchMedia("(max-width: 1000px)");
    const update = () => setIsMobile(mql.matches);
    update();
    if (mql.addEventListener) mql.addEventListener("change", update);
    else mql.addListener(update);
    return () => {
      if (mql.removeEventListener) mql.removeEventListener("change", update);
      else mql.removeListener(update);
    };
  }, []);

  // Трансформуємо дані з API у формат компонента
  const events: Event[] = useMemo(() => {
    if (!eventsData || eventsData.length === 0) return [];
    return eventsData.map(mapEventPostToEvent);
  }, [eventsData]);

  // Створюємо Map для зв'язку дати з подією
  const eventsByDate = useMemo(() => {
    const map = new Map<string, EventPost>();

    if (eventsData && eventsData.length > 0) {
      eventsData.forEach((eventPost) => {
        if (eventPost.Schedule) {
          eventPost.Schedule.forEach((schedule) => {
            if (schedule.hl_input_date_date) {
              const dateKey = schedule.hl_input_date_date; // YYYY-MM-DD
              // Якщо для цієї дати ще немає події, додаємо
              if (!map.has(dateKey)) {
                map.set(dateKey, eventPost);
              }
            }
          });
        }
      });
    }

    return map;
  }, [eventsData]);

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

    // Створюємо Set дат, коли є події (з усіх дат в Schedule)
    const eventDates = new Set<number>();
    if (eventsData && eventsData.length > 0) {
      eventsData.forEach((eventPost) => {
        if (eventPost.Schedule) {
          eventPost.Schedule.forEach((schedule) => {
            if (schedule.hl_input_date_date) {
              const eventDate = new Date(schedule.hl_input_date_date);
              // Перевіряємо чи подія в цьому місяці
              if (
                eventDate.getMonth() === month &&
                eventDate.getFullYear() === year
              ) {
                eventDates.add(eventDate.getDate());
              }
            }
          });
        }
      });
    }

    // Перевіряємо чи є подія на конкретний день
    const hasEventOnDay = (day: number) => {
      return eventDates.has(day);
    };

    for (let day = 1; day <= daysInMonth; day++) {
      const isToday =
        day === currentDay && month === currentMonth && year === currentYear;

      calendarDays.push({
        day,
        isCurrentMonth: true,
        isToday,
        hasEvent: hasEventOnDay(day),
      });
    }

    const remainingDays = 35 - calendarDays.length;
    for (let day = 1; day <= remainingDays; day++) {
      calendarDays.push({
        day,
        isCurrentMonth: false,
        isToday: false,
        hasEvent: false, // В інших місяцях не показуємо події
      });
    }

    return calendarDays;
  };

  const calendarDays = generateCalendar(currentDate);

  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [selectedDay, setSelectedDay] = useState<number | null>(null);

  // Додаємо/видаляємо клас на body, коли модалка відкрита на мобільних
  // Використовуємо useLayoutEffect для синхронного додавання класу перед рендером
  React.useLayoutEffect(() => {
    if (typeof window === "undefined") return;

    const isModalOpen = isMobile && selectedEvent !== null;

    if (isModalOpen) {
      const currentScrollY = window.scrollY;

      document.body.style.overflow = "hidden";
      document.documentElement.style.overflow = "hidden";
      document.body.style.position = "fixed";
      document.body.style.width = "100%";
      document.body.style.top = `-${currentScrollY}px`;
      document.body.classList.add("events-modal-open");

      document.body.setAttribute("data-scroll-y", currentScrollY.toString());
    } else {
      const savedScrollY = document.body.getAttribute("data-scroll-y");
      document.body.style.overflow = "unset";
      document.documentElement.style.overflow = "unset";
      document.body.style.position = "unset";
      document.body.style.width = "unset";
      document.body.style.top = "unset";
      document.body.classList.remove("events-modal-open");
      document.body.removeAttribute("data-scroll-y");

      if (savedScrollY) {
        requestAnimationFrame(() => {
          window.scrollTo(0, parseInt(savedScrollY));
        });
      }
    }

    return () => {
      // Відновлюємо позицію прокрутки з data-атрибута при cleanup
      const savedScrollY = document.body.getAttribute("data-scroll-y");
      document.body.style.overflow = "unset";
      document.documentElement.style.overflow = "unset";
      document.body.style.position = "unset";
      document.body.style.width = "unset";
      document.body.style.top = "unset";
      document.body.classList.remove("events-modal-open");
      document.body.removeAttribute("data-scroll-y");

      if (savedScrollY) {
        requestAnimationFrame(() => {
          window.scrollTo(0, parseInt(savedScrollY));
        });
      }
    };
  }, [isMobile, selectedEvent]);

  // Скидаємо selectedEvent при переході на мобільну версію
  React.useEffect(() => {
    if (isMobile && selectedEvent !== null) {
      setSelectedEvent(null);
    }
  }, [isMobile]);

  // Встановлюємо обрану подію при завантаженні даних (тільки для десктопу)
  React.useEffect(() => {
    if (events.length > 0 && !selectedEvent && !isMobile) {
      setSelectedEvent(events[0]);

      // Знаходимо перший день першої події для підсвітки в календарі
      const firstEventPost = eventsData[0];
      const firstScheduleDate =
        firstEventPost?.Schedule?.[0]?.hl_input_date_date;
      if (firstScheduleDate) {
        const eventDay = new Date(firstScheduleDate).getDate();
        setSelectedDay(eventDay);
      }
    }
  }, [events, selectedEvent, eventsData, isMobile]);

  // Функція для обробки кліку на день календаря
  const handleDayClick = (
    day: number,
    isCurrentMonth: boolean,
    hasEvent: boolean
  ) => {
    if (!isCurrentMonth || !hasEvent) return;

    // Формуємо дату в форматі YYYY-MM-DD
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const dateKey = `${year}-${String(month + 1).padStart(2, "0")}-${String(
      day
    ).padStart(2, "0")}`;

    // Шукаємо подію для цієї дати
    const eventPost = eventsByDate.get(dateKey);
    if (eventPost) {
      const event = mapEventPostToEvent(eventPost);
      setSelectedEvent(event);
      setSelectedDay(day); // Встановлюємо вибраний день
    }
  };

  const weekDays = ["ПН", "ВТ", "СР", "ЧТ", "ПТ", "СБ", "НД"];

  const goToPreviousMonth = () => {
    if (!currentDate) return;
    setCurrentDate(
      new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1)
    );
    setSelectedDay(null);
  };

  const goToNextMonth = () => {
    if (!currentDate) return;
    setCurrentDate(
      new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1)
    );
    setSelectedDay(null);
  };

  if (!isMounted) return null;

  if (isLoading) {
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
          <div style={{ padding: "60px 20px", textAlign: "center" }}>
            Завантаження подій...
          </div>
        </div>
      </section>
    );
  }

  if (isError) {
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
          <div style={{ padding: "60px 20px", textAlign: "center" }}>
            Помилка завантаження подій. Спробуйте пізніше.
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="events" className={s.section}>
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
                      <span className={s.monthName}>
                        {monthNames[currentDate.getMonth()]}
                      </span>
                      <span className={s.monthYear}>
                        {currentDate.getFullYear()}
                      </span>
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
                          } ${
                            selectedDay === day.day && day.isCurrentMonth
                              ? s.selectedEventDay
                              : ""
                          }`}
                          tabIndex={-1}
                          onMouseDown={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            handleDayClick(
                              day.day,
                              day.isCurrentMonth,
                              day.hasEvent
                            );
                          }}
                          onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                          }}
                          style={
                            day.hasEvent && day.isCurrentMonth
                              ? { cursor: "pointer" }
                              : undefined
                          }
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
                  {events.length === 0 ? (
                    <div style={{ padding: "20px", textAlign: "center" }}>
                      Подій поки що немає
                    </div>
                  ) : (
                    events.map((event, index) => {
                      const eventPost = eventsData.find(
                        (e) => String(e.id) === event.id
                      );
                      const firstScheduleDate =
                        eventPost?.Schedule?.[0]?.hl_input_date_date;
                      const eventDay = firstScheduleDate
                        ? new Date(firstScheduleDate).getDate()
                        : null;

                      return (
                        <div
                          key={event.id}
                          className={`${s.eventItem} ${
                            selectedEvent?.id === event.id ? s.activeEvent : ""
                          }`}
                          onClick={() => {
                            if (!isMobile) {
                              setSelectedEvent(event);
                              if (eventDay) setSelectedDay(eventDay);
                            }
                          }}
                        >
                          <div className={s.eventDate}>
                            <span className={s.eventDay}>{event.date}</span>
                            <span className={s.eventTime}>{event.time}</span>
                          </div>
                          <div className={s.eventDivider}></div>
                          {isMobile ? (
                            <div className={s.eventInfoWrapper}>
                              <div className={s.eventInfo}>
                                <h4 className={s.eventTitle}>{event.title}</h4>
                              </div>
                              <button
                                className={s.eventDetailsButton}
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setSelectedEvent(event);
                                  if (eventDay) setSelectedDay(eventDay);
                                }}
                              >
                                Детальніше
                              </button>
                            </div>
                          ) : (
                            <div className={s.eventInfo}>
                              <h4 className={s.eventTitle}>{event.title}</h4>
                              {event.description && (
                                <p className={s.eventDescription}>
                                  {event.description}
                                </p>
                              )}
                            </div>
                          )}
                        </div>
                      );
                    })
                  )}
                </div>
              </div>
            </div>
          </div>

          {!isMobile && (
            <div className={s.rightColumn}>
              {selectedEvent ? (
                <div className={s.eventCardBlock}>
                  <div className={s.eventCard}>
                    <div className={s.eventCardImage}>
                      <Image
                        src={selectedEvent.image}
                        alt={selectedEvent.title}
                        fill
                        className={s.cardImage}
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          target.src = "/images/image2.png";
                        }}
                      />
                    </div>
                    <div className={s.eventCardImageWrap}>
                      <div className={s.eventCardContent}>
                        <div className={s.eventCardMeta}>
                          {selectedEvent.dateRange && (
                            <div className={s.cardMetaItem}>
                              <p className={s.cardMetaItemText}>
                                {selectedEvent.dateRange}
                              </p>
                            </div>
                          )}
                          {selectedEvent.location && (
                            <div className={s.cardMetaItem}>
                              <p className={s.cardMetaItemText}>
                                {selectedEvent.location.toUpperCase()}
                              </p>
                            </div>
                          )}
                          {selectedEvent.venue && (
                            <div className={s.cardMetaItem}>
                              <p className={s.cardMetaItemText}>
                                {selectedEvent.venue.toUpperCase()}
                              </p>
                            </div>
                          )}
                        </div>

                        <div className={s.eventCardInfo}>
                          <h3 className={s.eventCardTitle}>
                            {selectedEvent.title}
                          </h3>
                          {selectedEvent.description && (
                            <p className={s.eventCardDescription}>
                              {selectedEvent.description}
                            </p>
                          )}
                        </div>

                        {selectedEvent.results &&
                          selectedEvent.results.length > 0 && (
                            <div className={s.eventCardResults}>
                              <h4 className={s.resultsTitle}>Результат:</h4>
                              <div className={s.resultsGrid}>
                                {selectedEvent.results.map((result, index) => (
                                  <div key={index} className={s.resultItem}>
                                    <span
                                      className={s.resultIcon}
                                      dangerouslySetInnerHTML={{
                                        __html: result.icon || "",
                                      }}
                                    />
                                    <span className={s.resultText}>
                                      {result.text}
                                    </span>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}
                      </div>

                      <button className={s.eventCardButton}>Записатись</button>
                    </div>
                  </div>
                </div>
              ) : (
                <div style={{ padding: "60px 20px", textAlign: "center" }}>
                  Оберіть подію зі списку
                </div>
              )}
            </div>
          )}

          {isMobile && selectedEvent && (
            <div
              className={s.modalOverlay}
              onClick={() => setSelectedEvent(null)}
            >
              <div
                className={s.modalContent}
                onClick={(e) => e.stopPropagation()}
              >
                <button
                  className={s.modalCloseButton}
                  onClick={() => setSelectedEvent(null)}
                >
                  <CloseButtonIcon />
                </button>
                <div className={s.eventCardBlock}>
                  <div className={s.eventCard}>
                    <div className={s.eventCardImage}>
                      <Image
                        src={selectedEvent.image}
                        alt={selectedEvent.title}
                        fill
                        className={s.cardImage}
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          target.src = "/images/image2.png";
                        }}
                      />
                    </div>
                    <div className={s.eventCardImageWrap}>
                      <div className={s.eventCardContent}>
                        <div className={s.eventCardMeta}>
                          {selectedEvent.dateRange && (
                            <div className={s.cardMetaItem}>
                              <p className={s.cardMetaItemText}>
                                {selectedEvent.dateRange}
                              </p>
                            </div>
                          )}
                          {selectedEvent.location && (
                            <div className={s.cardMetaItem}>
                              <p className={s.cardMetaItemText}>
                                {selectedEvent.location.toUpperCase()}
                              </p>
                            </div>
                          )}
                          {selectedEvent.venue && (
                            <div className={s.cardMetaItem}>
                              <p className={s.cardMetaItemText}>
                                {selectedEvent.venue.toUpperCase()}
                              </p>
                            </div>
                          )}
                        </div>

                        <div className={s.eventCardInfo}>
                          <h3 className={s.eventCardTitle}>
                            {selectedEvent.title}
                          </h3>
                          {selectedEvent.description && (
                            <p className={s.eventCardDescription}>
                              {selectedEvent.description}
                            </p>
                          )}
                        </div>

                        {selectedEvent.results &&
                          selectedEvent.results.length > 0 && (
                            <div className={s.eventCardResults}>
                              <h4 className={s.resultsTitle}>Результат:</h4>
                              <div className={s.resultsGrid}>
                                {selectedEvent.results.map((result, index) => (
                                  <div key={index} className={s.resultItem}>
                                    <span
                                      className={s.resultIcon}
                                      dangerouslySetInnerHTML={{
                                        __html: result.icon || "",
                                      }}
                                    />
                                    <span className={s.resultText}>
                                      {result.text}
                                    </span>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}
                      </div>

                      <button className={s.eventCardButton}>Записатись</button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default EventsSection;
