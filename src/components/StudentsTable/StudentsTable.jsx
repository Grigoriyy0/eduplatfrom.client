import React, { useMemo, useState } from "react";
import "./StudentTable.css";


export default function StudentsTable({
                                          students = [],
                                          onRowClick,
                                          rowsPerPage = 10,
                                      }) {
    const [page, setPage] = useState(0);

    const ApiKey = import.meta.env.VITE_API_KEY;

    const paged = useMemo(() => {
        const start = page * rowsPerPage;
        return students.slice(start, start + rowsPerPage);
    }, [students, page, rowsPerPage]);

    const [selectedStudent, setSelectedStudent] = useState(null);
    const [confirmDelete, setConfirmDelete] = useState(false);

    const[notification, setNotification] = useState(null);

    const totalPages = Math.max(1, Math.ceil(students.length / rowsPerPage));
    const canPrev = page > 0;
    const canNext = page < totalPages - 1;


    const handleDeleteConfirm = () => {

        fetch(`${ApiKey}/students/delete/${confirmDelete}`, {
            method: "DELETE",
            headers: {
                Accept: "application/json",
            }
        }).then(r => {
            if (r.ok) {
                setNotification("Студент удалён ✅");
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

        setConfirmDelete(false);
    };

    return (
        <div className="st-card">
            <div className="st-header">
                <h2>Студенты</h2>
            </div>

            <div className="st-table-wrap">
                <table className="st-table">
                    <thead>
                    <tr>
                        <th className="st-col-name">Имя</th>
                        <th>Email</th>
                        <th>Telegram</th>
                        <th className="paid-sub">Оплачено / Абонемент</th>
                        <th className="st-col-price">Цена урока</th>
                        <th className="st-col-actions">Действия</th>
                    </tr>
                    </thead>

                    <tbody>
                    {paged.length === 0 && (
                        <tr>
                            <td colSpan={6} className="st-empty">Список пуст</td>
                        </tr>
                    )}

                    {paged.map(s => {
                        const paid = s.paidLessonsCount ?? 0;
                        const subscribed = s.subscribedLessonsCount ?? 0;
                        const pct = subscribed > 0 ? Math.min(100, Math.round((paid / subscribed) * 100)) : 0;

                        return (
                            <tr key={s.studentId} className="st-row" onClick={() => onRowClick?.(s)}>
                                <td className="st-name-cell">
                                    <div className="st-name-block">
                                        <div className="st-name">{s.firstName} {s.lastName}</div>
                                        <div className="st-subtext">ID: {s.studentId.slice(0, 8)}</div>
                                    </div>
                                </td>

                                <td className="st-muted">{s.email}</td>

                                <td className="st-muted">{s.telegram ?? "-"}</td>



                                <td>
                                    <div className="st-progress">
                                        <div className="st-progress__bar" style={{ width: `${pct}%` }} />
                                    </div>
                                    <div className="st-progress-text">
                                        {paid} / {subscribed}
                                    </div>
                                </td>

                                <td className="st-lesson-price">{(s.lessonPrice ?? 0).toLocaleString("ru-RU")} ₽</td>

                                <td className="st-actions" onClick={e => e.stopPropagation()}>
                                    <button className="st-btn st-btn--ghost" title="Редактировать" onClick={() => setSelectedStudent(s)}>
                                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden>
                                            <path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25z" stroke="currentColor" strokeWidth="1.5" fill="currentColor"/>
                                            <path d="M20.71 7.04a1 1 0 0 0 0-1.41l-2.34-2.34a1 1 0 0 0-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z" fill="currentColor"/>
                                        </svg>
                                    </button>
                                    <button className="st-btn st-btn--ghost st-btn--danger" title="Удалить" onClick={() => setConfirmDelete(s.studentId)}>
                                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden>
                                            <path d="M9 3h6l1 2h4v2H4V5h4l1-2zM6 9h12l-1 11H7L6 9z" fill="currentColor"/>
                                        </svg>
                                    </button>
                                </td>

                                {/* модалка подтверждения */}
                                {confirmDelete && (
                                    <div className="modal-overlay" onClick={() => setConfirmDelete(false)}>
                                        <div className="confirm-modal" onClick={(e) => e.stopPropagation()}>
                                            <h3 className="confirm-modal-title">Вы уверены?</h3>
                                            <p className="confirm-modal-text">Удалить студента {s.firstName} {s.lastName}?</p>
                                            <div className="confirm-modal-actions">
                                                <button
                                                    className="confirm-delete-btn"
                                                    onClick={handleDeleteConfirm}
                                                >
                                                    Да, удалить
                                                </button>
                                                <button
                                                    className="confirm-cancel-btn"
                                                    onClick={() => setConfirmDelete(false)}
                                                >
                                                    Отмена
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </tr>
                        );
                    })}
                    </tbody>
                </table>
            </div>

            <div className="st-footer">
                <div className="st-rows-per-page">
                    По строк на странице:
                    <select
                        value={rowsPerPage}
                        onChange={(e) => {
                            const val = Number(e.target.value);
                            setPage(0);
                            // родитель может контролировать rowsPerPage, но для простоты оставим локально:
                            location.reload(); // убери это, если rowsPerPage будет пропом сверху
                        }}

                        title="Для простоты rowsPerPage фиксирован пропом"
                    >
                        <option value={10}>10</option>
                    </select>
                </div>

                <div className="st-pager">
                    <button className="st-btn" disabled={!canPrev} onClick={() => setPage(p => Math.max(0, p - 1))}>←</button>
                    <span className="st-page-indicator">{page + 1} / {totalPages}</span>
                    <button className="st-btn" disabled={!canNext} onClick={() => setPage(p => Math.min(totalPages - 1, p + 1))}>→</button>
                </div>

            </div>

            {/* Модалка */}
            {selectedStudent && (
                <div className="modal-overlay" onClick={() => setSelectedStudent(null)}>
                    <div className="modal" onClick={(e) => e.stopPropagation()}>
                        <h3 className="lesson-modal-info">Ученик</h3>
                        <p className="lesson-modal-info">Имя <strong className="lesson-modal-info">{selectedStudent.firstName} {selectedStudent.lastName}</strong></p>
                        <p className="lesson-modal-info">Цена урока <strong className="lesson-modal-info">{selectedStudent.lessonPrice}</strong></p>
                        <p className="lesson-modal-info">Почта <strong className="lesson-modal-info">{selectedStudent.email}</strong></p>
                        <p className="lesson-modal-info">Количество уроков в абонементе <strong className="lesson-modal-info">{selectedStudent.subscribedLessonsCount}</strong></p>

                        <div className="modal-actions">
                            <button className="reschedule-btn" onClick={() => openReschedule(selectedLesson)}>Редактировать</button>
                            <button className="complete-btn" onClick={() => handleComplete(selectedLesson)}>Добавить оплату</button>
                        </div>
                        <button className="close-btn" onClick={() => setSelectedStudent(null)}>Закрыть</button>
                    </div>
                </div>
            )}

            {/* Уведомление */}
            {notification && (
                <div className="notification">
                    {notification}
                </div>
            )}


        </div>
    );
}
