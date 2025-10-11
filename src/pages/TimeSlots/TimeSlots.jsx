import './TimeSlots.css'
import Sidebar from "../../components/Sidebar/Sidebar.jsx";
import { useTimeSlotsData } from "../../hooks/useTimeSlotsData.js";
import React, {useState} from "react";

function TimeSlots() {
    const ApiKey = import.meta.env.VITE_API_KEY;
    const token = localStorage.getItem("accessToken");
    const { timeSlotsData, loading: timeSlotsLoading, error: timeSlotsError } = useTimeSlotsData(ApiKey, token);
    const [notification, setNotification] = useState(null);
    const [deleteModal, setDeleteModal] = useState({ isOpen: false, slot: null });

    // Функция для преобразования дня недели из числа в текст
    const getDayName = (dayNumber) => {
        const days = [
            'Sunday',
            'Monday',
            'Tuesday',
            'Wednesday',
            'Thursday',
            'Friday',
            'Saturday',
            'Sunday',
        ];
        return days[dayNumber] || `Day ${dayNumber}`;
    };

    // Функция для форматирования времени (убираем секунды)
    const formatTime = (timeString) => {
        return timeString.slice(0, 5); // Берем только часы и минуты
    };

    // Открытие модалки удаления
    const openDeleteModal = (slot, e) => {
        e.stopPropagation();
        setDeleteModal({ isOpen: true, slot });
    };

    // Закрытие модалки удаления
    const closeDeleteModal = () => {
        setDeleteModal({ isOpen: false, slot: null });
    };

    // Подтверждение удаления
    const confirmDelete = () => {
        if (deleteModal.slot) {
            handleDelete(deleteModal.slot.id);
            closeDeleteModal();
        }
    };

    if (timeSlotsLoading) {
        return (
            <div className="time-slots-page">
                <div className="sidebar-wrapper">
                    <Sidebar />
                </div>
                <div className="main-content">
                    <div className="loading">Loading time slots...</div>
                </div>
            </div>
        );
    }

    if (timeSlotsError) {
        return (
            <div className="time-slots-page">
                <div className="sidebar-wrapper">
                    <Sidebar />
                </div>
                <div className="main-content">
                    <div className="error">Error: {timeSlotsError}</div>
                </div>
            </div>
        );
    }

    function handleEdit(slot, e) {
        e.stopPropagation();
        // Здесь будет логика редактирования
        console.log('Edit slot:', slot);
    }

    function handleDelete(id) {
        fetch(`${ApiKey}/time-slots/delete/${id}`, {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json",
                'Authorization': `Bearer ${token}`,
            }
        }).then(r => {
            if (r.ok) {
                setNotification("Time slot deleted ✅");
                // через 1 сек обновим страницу
                setTimeout(() => {
                    window.location.reload();
                }, 1000);
            } else {
                setNotification("Error during deleting time slot ❌");
            }
        })
            .catch(err => {
                console.error(err);
                setNotification("Error during deleting time slot ❌");
            });
    }

    return (
        <div className="time-slots-page">
            <div className="sidebar-wrapper">
                <Sidebar />
            </div>

            <div className="main-content">
                <div className="time-slots-container">
                    <h1 className="time-slots-title">Time slots</h1>

                    {timeSlotsData && timeSlotsData.length > 0 ? (
                        <div className="time-slots-grid">
                            {timeSlotsData.map((slot, index) => (
                                <div key={slot.id} className="time-slot-card">
                                    <div className="time-slot-header">
                                        <span className="slot-number">#{index + 1}</span>
                                        <span className="slot-day">{getDayName(slot.day)}</span>
                                    </div>

                                    <div className="time-slot-body">
                                        <div className="time-range">
                                            <span className="time-icon">🕐</span>
                                            {formatTime(slot.startTime)} - {formatTime(slot.endTime)}
                                        </div>
                                        <div className="duration">
                                            Duration: {formatTime(slot.duration)}
                                        </div>
                                    </div>

                                    <div className="time-slot-footer">
                                        {slot.student ? (
                                            <div className="student-info">
                                                <span className="student-icon">👤</span>
                                                {slot.student.name || 'Student'}
                                            </div>
                                        ) : (
                                            <div className="available-badge">Available</div>
                                        )}

                                        <div className="slot-actions">
                                            <button
                                                className="action-btn edit-btn"
                                                onClick={(e) => handleEdit(slot, e)}
                                                title="Edit"
                                            >
                                                ✏️
                                            </button>
                                            <button
                                                className="action-btn delete-btn"
                                                onClick={(e) => openDeleteModal(slot, e)}
                                                title="Delete"
                                            >
                                                🗑️
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="no-slots">
                            <div className="no-slots-icon">📅</div>
                            <h3>No available time slots</h3>
                            <p>Create new time slots for lessons</p>
                        </div>
                    )}
                </div>
            </div>

            {/* Модалка подтверждения удаления */}
            {deleteModal.isOpen && (
                <div className="modal-overlay" onClick={closeDeleteModal}>
                    <div className="confirmation-modal" onClick={(e) => e.stopPropagation()}>
                        <div className="modal-icon">⚠️</div>
                        <h3 className="modal-title">Delete Time Slot</h3>
                        <p className="modal-message">
                            Are you sure you want to delete this time slot?
                        </p>
                        {deleteModal.slot && (
                            <div className="slot-info">
                                <div className="slot-info-day"><strong>Day:</strong> {getDayName(deleteModal.slot.day)}</div>
                                <div className="slot-info-day"><strong>Time:</strong> {formatTime(deleteModal.slot.startTime)} - {formatTime(deleteModal.slot.endTime)}</div>
                            </div>
                        )}
                        <div className="modal-actions">
                            <button
                                className="cancel-btn"
                                onClick={closeDeleteModal}
                            >
                                Cancel
                            </button>
                            <button
                                className="confirm-delete-btn"
                                onClick={confirmDelete}
                            >
                                Delete
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {notification && (
                <div className="notification">
                    {notification}
                </div>
            )}
        </div>
    );
}

export default TimeSlots;