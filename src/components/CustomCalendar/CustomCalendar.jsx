import React, { useState } from "react";
import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";
import "./CustomCalendar.css";

dayjs.extend(customParseFormat);

const PIXELS_PER_HOUR = 60; // масштаб — 1 час = 60px
const PIXELS_PER_MINUTE = PIXELS_PER_HOUR / 60;

export default function CustomCalendar({ lessons }) {

    const [weekStart, setWeekStart] = useState(dayjs().startOf("week"));
    const [selectedLesson, setSelectedLesson] = useState(null); // выбранный урок
    const [notification, setNotification] = useState(null);
    const [rescheduleMode, setRescheduleMode] = useState(false);
    const [newDate, setNewDate] = useState("");
    const [newStart, setNewStart] = useState("");
    const [newEnd, setNewEnd] = useState("");

    const ApiKey = import.meta.env.VITE_API_KEY;

    const days = Array.from({ length: 7 }, (_, i) => weekStart.add(i, "day"));

    const nextWeek = () => setWeekStart(prev => prev.add(1, "week"));
    const prevWeek = () => setWeekStart(prev => prev.subtract(1, "week"));

    const handleDelete = (lesson) => {
        fetch(`${ApiKey}/lessons/cancel`, {
            method: "DELETE",
            body: JSON.stringify({
                lessonId: lesson.lessonId,
            }),
            headers: {
                "Content-Type": "application/json",
            }
        })
            .then(r => {
                if (r.ok) {
                    setNotification("Урок удалён ✅");
                    // через 1 сек обновим страницу
                    setTimeout(() => {
                        window.location.reload();
                    }, 1000);
                } else {
                    setNotification("Ошибка при удалении ❌");
                }
            })
            .catch(err => {
                console.error(err);
                setNotification("Ошибка при удалении ❌");
            });

        setSelectedLesson(null);
    };

    const openReschedule = (lesson) => {
        // Заполняем новые значения из урока
        setNewDate(dayjs(lesson.date).format("YYYY-MM-DD"));
        setNewStart(dayjs(lesson.startTime, "HH:mm:ss").format("HH:mm:ss"));
        setNewEnd(dayjs(lesson.endTime, "HH:mm:ss").format("HH:mm:ss"));


        setRescheduleMode(true);
    };

    const handleReschedule = () => {
        console.log("Переносим:", selectedLesson.id, {
            newDate,
            newStart,
            newEnd
        });

        fetch(`${ApiKey}/lessons/reschedule`, {
            method: "POST",
            body: JSON.stringify({
                "lessonId" : selectedLesson.lessonId,
                "date" : newDate,
                "startTime" : newStart,
                "endTime" : newEnd,
            }),
            headers: {
                "Content-Type": "application/json",
            }
        }).then(r => r.json())
            .then(json => console.log(json))
            .then(() => {
                setNotification("Урок был перенесен ✅");
                setTimeout(() => {
                    window.location.reload();
                }, 1000);
            });
        setSelectedLesson(null);

        setRescheduleMode(false);
        setSelectedLesson(null);
        setNewDate("");
        setNewStart("");
        setNewEnd("");
    };

    const handleComplete = (lesson) => {
        fetch(`${ApiKey}/lessons/change-status`, {
            method: "POST",
            body: JSON.stringify({
                "lessonId" : lesson.lessonId,
            }),
            headers: {
                "Content-Type": "application/json",
            }
        }).then(r => r.json())
            .then(json => console.log(json))
            .then(() => {
                setNotification("Урок отмечен пройденым ✅");
                    setTimeout(() => {
                        window.location.reload();
                    }, 1000);
            });
         setSelectedLesson(null);
    };


    return (
        <div className="calendar">
            <div className="calendar-header">
                <button onClick={prevWeek} className="change-week-btn">Previous week</button>
                <span className="week-info">
                    {weekStart.format("MMM D")} - {weekStart.add(6, "day").format("MMM D")}
                </span>
                <button onClick={nextWeek} className="change-week-btn">Next week</button>
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
                                        onClick={() => setSelectedLesson(l)}
                                    >
                                        Урок
                                    </div>
                                );
                            })}
                    </div>


                ))}
            </div>

            {/* Модалка */}
            {selectedLesson && (
                <div className="modal-overlay" onClick={() => setSelectedLesson(null)}>
                    <div className="modal" onClick={(e) => e.stopPropagation()}>
                        <h3 className="lesson-modal-info">Урок</h3>
                        <p className="lesson-modal-info">{selectedLesson.date}</p>
                        <p className="lesson-modal-info"> {selectedLesson.startTime} - {selectedLesson.endTime}</p>
                        <p className="lesson-modal-info">Ученик {selectedLesson.studentName}</p>
                        <p className="lesson-modal-info">Урок был? {selectedLesson.isCompleted === true ? "Да" : "Нет"}</p>
                        <div className="modal-actions">
                            <button className="delete-btn" onClick={() => handleDelete(selectedLesson)}>Удалить</button>
                            <button className="reschedule-btn" onClick={() => openReschedule(selectedLesson)}>Перенести</button>
                            <button className="complete-btn" onClick={() => handleComplete(selectedLesson)}>Завершить</button>
                        </div>
                        <button className="close-btn" onClick={() => setSelectedLesson(null)}>Закрыть</button>
                    </div>
                </div>
            )}

            {/* Уведомление */}
            {notification && (
                <div className="notification">
                    {notification}
                </div>
            )}

            {/* Второе модальное окно (перенос) */}
            {selectedLesson && rescheduleMode && (
                <div className="modal-overlay" onClick={() => setRescheduleMode(false)}>
                    <div className="modal" onClick={(e) => e.stopPropagation()}>
                        <h3 className="lesson-modal-info">Перенести урок {selectedLesson.id}</h3>

                        <label className="lesson-modal-info">
                            Дата:
                            <input
                                className="lesson-modal-info"
                                type="date"
                                value={newDate}
                                onChange={e => setNewDate(e.target.value)}
                            />
                        </label>

                        <label className="lesson-modal-info">
                            Время начала:
                            <input
                                className="lesson-modal-info"
                                type="time"
                                step="1"
                                value={newStart}
                                onChange={e => setNewStart(e.target.value)}
                            />
                        </label>

                        <label className="lesson-modal-info">
                            Время конца:
                            <input className="lesson-modal-info"
                                type="time"
                                step="1"
                                value={newEnd}
                                onChange={e => setNewEnd(e.target.value)}
                            />
                        </label>

                        <div className="modal-actions">
                            <button className="reschedule-btn" onClick={handleReschedule}>
                                Сохранить
                            </button>
                            <button className="close-btn" onClick={() => setRescheduleMode(false)}>
                                Отмена
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
