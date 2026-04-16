import React, { useEffect, useMemo, useState } from "react";
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

    // Edit form state
    const [editName, setEditName] = useState("");
    const [editLessonPrice, setEditLessonPrice] = useState(0);
    const [editTimeZone, setEditTimeZone] = useState("");
    const [editTelegram, setEditTelegram] = useState("");
    const [editSubscription, setEditSubscription] = useState(0);
    const [editPaidLessons, setEditPaidLessons] = useState(0);

    // Modal switches
    const [isEditOpen, setIsEditOpen] = useState(false);
    const [isPaymentOpen, setIsPaymentOpen] = useState(false);
    const [isTimeSlotOpen, setIsTimeSlotOpen] = useState(false);
    const [paymentAmount, setPaymentAmount] = useState(0);

    // Time slot form state
    const [timeSlotDay, setTimeSlotDay] = useState("");
    const [timeSlotStart, setTimeSlotStart] = useState("09:00:00");
    const [timeSlotEnd, setTimeSlotEnd] = useState("10:00:00");

    const totalPages = Math.max(1, Math.ceil(students.length / rowsPerPage));
    const canPrev = page > 0;
    const canNext = page < totalPages - 1;

    const token = localStorage.getItem("accessToken");

    const handleDeleteConfirm = () => {

        fetch(`${ApiKey}/students/${confirmDelete}`, {
            method: "DELETE",
            headers: {
                Accept: "application/json",
                'Authorization': `Bearer ${token}`,
            }
        }).then(r => {
            if (r.ok) {
                setNotification("Student deleted ✅");
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

    useEffect(() => {
        if (selectedStudent) {
            setEditName(selectedStudent.name ?? "");
            setEditTimeZone(selectedStudent.timeZone ?? "");
            setEditLessonPrice(selectedStudent.lessonPrice ?? 0);
            setEditTelegram(selectedStudent.telegram ?? "");
            setEditSubscription(selectedStudent.subscribedLessonsCount ?? 0);
            setEditPaidLessons(selectedStudent.paidLessonsCount ?? 0);
        }
    }, [selectedStudent]);

    const handleUpdateStudent = () => {
        if (!selectedStudent) return;
        fetch(`${ApiKey}/students`, {
            method: "PUT",
            body: JSON.stringify({
                studentId: selectedStudent.studentId,
                name: editName,
                telegram: editTelegram,
                timeZone: editTimeZone,
                paidLessonsCount: editPaidLessons,
                subscribedLessonsCount: editSubscription,
                lessonPrice: editLessonPrice,
            }),
            headers: {
                "Content-Type": "application/json",
                'Authorization': `Bearer ${token}`,
            }
        }).then(r => {
            if (r.ok) {
                setNotification("Student information successfully updated ✅");
                setTimeout(() => {
                    window.location.reload();
                }, 1000);
            } else {
                setNotification("Error during updating student ❌");
            }
        }).catch(err => {
            console.error(err);
            setNotification("Error during updating student ❌");
        });
    };

    const handleAddPayment = () => {
        if (!selectedStudent) return;
        fetch(`${ApiKey}/students/payment`, {
            method: "POST",
            body: JSON.stringify({
                studentId: selectedStudent.studentId,
                amount: paymentAmount,
            }),
            headers: {
                "Content-Type": "application/json",
                'Authorization': `Bearer ${token}`,
            }
        }).then(r => {
            if (r.ok) {
                setNotification("Payment added ✅");
                setTimeout(() => {
                    window.location.reload();
                }, 1000);
            } else {
                setNotification("Error during adding payment ❌");
            }
        }).catch(err => {
            console.error(err);
            setNotification("Error during adding payment ❌");
        });
    };

    const handleAddTimeSlot = () => {
        if (!selectedStudent) return;

        if (!timeSlotDay) {
            setNotification("Choose day of the week ❌");
            return;
        }

        const weekdays = [
            "Monday",
            "Tuesday",
            "Wednesday",
            "Thursday",
            "Friday",
            "Saturday",
            "Sunday",
        ];

        const dayNumber = weekdays.indexOf(timeSlotDay) + 1; // Пн=1 ... Вс=7

        const timePattern = /^\d{2}:\d{2}:\d{2}$/;
        if (!timePattern.test(timeSlotStart) || !timePattern.test(timeSlotEnd)) {
            setNotification("Неверный формат времени. Используйте hh:mm:ss ❌");
            return;
        }

        if (timeSlotStart >= timeSlotEnd) {
            setNotification("Время начала должно быть раньше времени конца ❌");
            return;
        }

        fetch(`${ApiKey}/time-slots`, {
            method: "POST",
            body: JSON.stringify({
                studentId: selectedStudent.studentId,
                day: dayNumber,
                startTime: timeSlotStart,
                endTime: timeSlotEnd,
            }),
            headers: {
                "Content-Type": "application/json",
                'Authorization': `Bearer ${token}`,
            }
        }).then(r => {
            if (r.ok) {
                setNotification("Time-slot created ✅");
                setTimeout(() => {
                    window.location.reload();
                }, 1000);
            } else {
                setNotification("Error during adding time-slot ❌");
            }
        }).catch(err => {
            console.error(err);
            setNotification("Error during adding time-slot ❌");
        });
    };

    return (
        <div className="st-card">
            <div className="st-header">
                <h2>Students</h2>
            </div>

            <div className="st-table-wrap">
                <table className="st-table">
                    <thead>
                    <tr>
                        <th className="st-col-name">Name</th>
                        <th>Time zone</th>
                        <th>Telegram</th>
                        <th className="paid-sub">Paid / Subscribed</th>
                        <th className="st-col-price">Lesson price</th>
                        <th className="st-col-actions">Actions</th>
                    </tr>
                    </thead>

                    <tbody>
                    {paged.length === 0 && (
                        <tr>
                            <td colSpan={6} className="st-empty">List is empty</td>
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
                                        <div className="st-name">{s.name}</div>
                                        <div className="st-subtext">ID: {s.studentId.slice(0, 8)}</div>
                                    </div>
                                </td>

                                <td className="st-muted">{s.timeZone}</td>

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
                                            <h3 className="confirm-modal-title">Are you sure?</h3>
                                            <p className="confirm-modal-text">Delete student {s.firstName} {s.lastName}?</p>
                                            <div className="confirm-modal-actions">
                                                <button
                                                    className="confirm-delete-btn"
                                                    onClick={handleDeleteConfirm}
                                                >
                                                    Yes, delete
                                                </button>
                                                <button
                                                    className="confirm-cancel-btn"
                                                    onClick={() => setConfirmDelete(false)}
                                                >
                                                    Cancel
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
                    Rows per page:
                    <select
                        value={rowsPerPage}
                        onChange={(e) => {
                            Number(e.target.value);
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
            {/* Info modal (original) */}
            {selectedStudent && !isEditOpen && !isPaymentOpen && (
                <div className="modal-overlay" onClick={() => setSelectedStudent(null)}>
                    <div className="modal" onClick={(e) => e.stopPropagation()}>
                        <h3 className="lesson-modal-info">Student</h3>
                        <p className="lesson-modal-info">Name <strong className="lesson-modal-info">{selectedStudent.name}</strong></p>
                        <p className="lesson-modal-info">Time zone <strong className="lesson-modal-info">{selectedStudent.timeZone}</strong></p>
                        <p className="lesson-modal-info">Lesson price <strong className="lesson-modal-info">{selectedStudent.lessonPrice}</strong></p>
                        <p className="lesson-modal-info">Subscribed lessons count <strong className="lesson-modal-info">{selectedStudent.subscribedLessonsCount}</strong></p>

                        <div className="modal-actions">
                            <button className="reschedule-btn" onClick={() => { setIsEditOpen(true); }}>
                                Edit
                            </button>
                            <button className="complete-btn" onClick={() => { setIsPaymentOpen(true); }}>
                                Add payment
                            </button>
                            <button className="add-time-slot-btn" onClick={() => { setIsTimeSlotOpen(true); }}>
                                Add time slot
                            </button>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'center', marginTop: '12px', backgroundColor: '#ffffff' }}>
                            <button className="close-btn" onClick={() => setSelectedStudent(null)}>Close</button>
                        </div>
                    </div>
                </div>
            )}

            {/* Edit modal */}
            {selectedStudent && isEditOpen && (
                <div className="modal-overlay" onClick={() => { setIsEditOpen(false); setSelectedStudent(null); }}>
                    <div className="modal" onClick={(e) => e.stopPropagation()}>
                        <h3 className="modal-title">Edit student</h3>

                        <div className="modal-form">
                            <div className="form-row">
                                <label>Name</label>
                                <input type="text" className="add-stdnt-inpt" value={editName} onChange={(e) => setEditName(e.target.value)} />
                            </div>

                            <div className="form-row">
                                <label>Lesson price</label>
                                <input type="text" className="add-stdnt-inpt" value={editLessonPrice} onChange={(e) => setEditLessonPrice(parseInt(e.target.value) || 0)} />
                            </div>

                            <div className="form-row">
                                <label>Time zone</label>
                                <input type="text" className="add-stdnt-inpt" value={editTimeZone} onChange={(e) => setEditTimeZone(e.target.value)} />
                            </div>

                            <div className="form-row">
                                <label>Telegram</label>
                                <input type="text" className="add-stdnt-inpt" value={editTelegram} onChange={(e) => setEditTelegram(e.target.value)} />
                            </div>

                            <div className="form-row">
                                <label>Subscribed lessons count</label>
                                <input type="text" className="add-stdnt-inpt" value={editSubscription} onChange={(e) => setEditSubscription(parseInt(e.target.value) || 0)} />
                            </div>

                            <div className="form-row">
                                <label>Paid lessons count</label>
                                <input type="text" className="add-stdnt-inpt" value={editPaidLessons} onChange={(e) => setEditPaidLessons(parseInt(e.target.value) || 0)} />
                            </div>
                        </div>

                        <div className="modal-actions">
                            <button className="create-btn" onClick={handleUpdateStudent}>Save</button>
                            <button className="cancel-btn" onClick={() => { setIsEditOpen(false); setSelectedStudent(null); }}>Cancel</button>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'center', marginTop: '12px', backgroundColor: '#ffffff' }}>
                            <button className="close-btn" onClick={() => { setIsEditOpen(false); setSelectedStudent(null); }}>Close</button>
                        </div>
                    </div>
                </div>
            )}

            {/* Payment modal */}
            {selectedStudent && isPaymentOpen && (
                <div className="modal-overlay" onClick={() => { setIsPaymentOpen(false); setSelectedStudent(null); }}>
                    <div className="modal" onClick={(e) => e.stopPropagation()}>
                        <h3 className="modal-title">Add payment</h3>

                        <div className="modal-form">
                            <div className="form-row">
                                <label>Paid lessons amount</label>
                                <input type="text" className="add-stdnt-inpt" value={paymentAmount} onChange={(e) => setPaymentAmount(parseInt(e.target.value) || 0)} />
                            </div>
                        </div>

                        <div className="modal-actions">
                            <button className="create-btn" onClick={handleAddPayment}>Add</button>
                            <button className="cancel-btn" onClick={() => { setIsPaymentOpen(false); setSelectedStudent(null); }}>Cancel</button>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'center', marginTop: '12px', backgroundColor: '#ffffff' }}>
                            <button className="close-btn" onClick={() => { setIsPaymentOpen(false); setSelectedStudent(null); }}>Close</button>
                        </div>
                    </div>
                </div>
            )}

            {/* Time slot modal */}
            {selectedStudent && isTimeSlotOpen && (
                <div className="modal-overlay" onClick={() => { setIsTimeSlotOpen(false); setSelectedStudent(null); }}>
                    <div className="modal" onClick={(e) => e.stopPropagation()}>
                        <h3 className="modal-title">Add time-slot</h3>

                        <div className="modal-form">
                            <div className="form-row">
                                <label>Week day</label>
                                <select
                                    className={`add-stdnt-inpt ${!timeSlotDay ? 'select--placeholder' : 'select--value'}`}
                                    value={timeSlotDay}
                                    onChange={(e) => setTimeSlotDay(e.target.value)}
                                >
                                    <option value="" disabled hidden>Выберите день недели</option>
                                    <option>Monday</option>
                                    <option>Tuesday</option>
                                    <option>Wednesday</option>
                                    <option>Thursday</option>
                                    <option>Friday</option>
                                    <option>Saturday</option>
                                    <option>Sunday</option>
                                </select>
                            </div>
                            <div className="form-row">
                                <label>Start time (hh:mm:ss)</label>
                                <input type="text" className="add-stdnt-inpt" value={timeSlotStart} onChange={(e) => setTimeSlotStart(e.target.value)} />
                            </div>
                            <div className="form-row">
                                <label>End time (hh:mm:ss)</label>
                                <input type="text" className="add-stdnt-inpt" value={timeSlotEnd} onChange={(e) => setTimeSlotEnd(e.target.value)} />
                            </div>
                        </div>

                        <div className="modal-actions">
                            <button className="create-btn" onClick={handleAddTimeSlot}>Add</button>
                            <button className="cancel-btn" onClick={() => { setIsTimeSlotOpen(false); setSelectedStudent(null); }}>Cancel</button>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'center', marginTop: '12px', backgroundColor: '#ffffff' }}>
                            <button className="close-btn" onClick={() => { setIsTimeSlotOpen(false); setSelectedStudent(null); }}>Create</button>
                        </div>
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
