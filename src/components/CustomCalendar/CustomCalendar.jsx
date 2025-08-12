import React, { useState } from "react";
import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";
import "./CustomCalendar.css";

dayjs.extend(customParseFormat);

const PIXELS_PER_HOUR = 60; // масштаб — 1 час = 60px
const PIXELS_PER_MINUTE = PIXELS_PER_HOUR / 60;

export default function CustomCalendar({ lessons }) {
    const [weekStart, setWeekStart] = useState(dayjs().startOf("week"));

    const days = Array.from({ length: 7 }, (_, i) => weekStart.add(i, "day"));

    const nextWeek = () => setWeekStart(prev => prev.add(1, "week"));
    const prevWeek = () => setWeekStart(prev => prev.subtract(1, "week"));

    return (
        <div className="calendar">
            <div className="calendar-header">
                <button onClick={prevWeek} className="change-week-btn">Назад</button>
                <span className="week-info">
                    {weekStart.format("MMM D")} - {weekStart.add(6, "day").format("MMM D")}
                </span>
                <button onClick={nextWeek} className="change-week-btn">Вперёд</button>
            </div>

            <div className="calendar-grid">
                {/* Колонка с часами */}
                <div className="time-column">
                    {Array.from({ length: 24 }, (_, i) => (
                        <div
                            key={i}
                            className="time-cell"
                            style={{ height: `${PIXELS_PER_HOUR}px` }}
                        >
                            {`${i}:00`}
                        </div>
                    ))}
                </div>

                {/* Колонки дней */}
                {days.map(day => (
                    <div key={day.format("YYYY-MM-DD")} className="day-column">
                        {Array.from({ length: 24 }, (_, i) => (
                            <div
                                key={i}
                                className="hour-cell"
                                style={{ height: `${PIXELS_PER_HOUR}px` }}
                            ></div>
                        ))}

                        {lessons
                            .filter(l =>
                                dayjs(`${l.date} ${l.startTime}`, "YYYY-MM-DD HH:mm:ss")
                                    .isSame(day, "day")
                            )
                            .map(l => {
                                const start = dayjs(`${l.date} ${l.startTime}`, "YYYY-MM-DD HH:mm:ss");
                                const end = dayjs(`${l.date} ${l.endTime}`, "YYYY-MM-DD HH:mm:ss");

                                const minutesFromTop = start.diff(start.startOf("day"), "minutes");
                                const lessonDuration = end.diff(start, "minutes");

                                return (
                                    <div
                                        key={l.id}
                                        className="lesson"
                                        style={{
                                            top: `${minutesFromTop * PIXELS_PER_MINUTE}px`,
                                            height: `${lessonDuration * PIXELS_PER_MINUTE}px`
                                        }}
                                        onClick={() => console.log("Open LessonCard", l)}
                                    >
                                        Урок
                                    </div>
                                );
                            })}
                    </div>
                ))}
            </div>
        </div>
    );
}
