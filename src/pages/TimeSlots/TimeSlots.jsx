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
    const [editModal, setEditModal] = useState({ isOpen: false, slot: null });

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

    // Открытие модалки редактирования
    const openEditModal = (slot, e) => {
        e.stopPropagation();
        setEditModal({
            isOpen: true,
            slot: {
                ...slot,
                // Преобразуем время в формат для input type="time"
                startTime: formatTime(slot.startTime),
                endTime: formatTime(slot.endTime)
            }
        });
    };

    // Закрытие модалки редактирования
    const closeEditModal = () => {
        setEditModal({ isOpen: false, slot: null });
    };

    // Обработчик изменения полей в модалке редактирования
    const handleEditChange = (field, value) => {
        setEditModal(prev => ({
            ...prev,
            slot: {
                ...prev.slot,
                [field]: value
            }
        }));
    };

    // Сохранение изменений
    const saveChanges = () => {
        if (editModal.slot) {
            handleEdit(editModal.slot);
            closeEditModal();
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

    function handleEdit(updatedSlot) {
        // Добавляем секунды к времени для корректного формата API
        const slotData = {
            ...updatedSlot,
            timeSlotId : updatedSlot.id,
            startTime: updatedSlot.startTime,
            endTime: updatedSlot.endTime,
            day: updatedSlot.day,
        };

        fetch(`${ApiKey}/time-slots/update/`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                'Authorization': `Bearer ${token}`,
            },
            body: JSON.stringify(slotData)
        }).then(r => {
            if (r.ok) {
                setNotification("Time slot updated ✅");
                setTimeout(() => {
                    window.location.reload();
                }, 1000);
            } else {
                setNotification("Error during updating time slot ❌");
            }
        })
            .catch(err => {
                console.error(err);
                setNotification("Error during updating time slot ❌");
            });
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
                                                onClick={(e) => openEditModal(slot, e)}
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
                                <div><strong>Day:</strong> {getDayName(deleteModal.slot.day)}</div>
                                <div><strong>Time:</strong> {formatTime(deleteModal.slot.startTime)} - {formatTime(deleteModal.slot.endTime)}</div>
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

            {/* Модалка редактирования */}
            {editModal.isOpen && editModal.slot && (
                <div className="modal-overlay" onClick={closeEditModal}>
                    <div className="edit-modal" onClick={(e) => e.stopPropagation()}>
                        <div className="modal-icon">✏️</div>
                        <h3 className="modal-title">Edit Time Slot</h3>

                        <div className="form-group">
                            <label className="form-label">Day of Week</label>
                            <select
                                className="form-select"
                                value={editModal.slot.day}
                                onChange={(e) => handleEditChange('day', parseInt(e.target.value))}
                            >
                                <option value={7}>Sunday</option>
                                <option value={1}>Monday</option>
                                <option value={2}>Tuesday</option>
                                <option value={3}>Wednesday</option>
                                <option value={4}>Thursday</option>
                                <option value={5}>Friday</option>
                                <option value={6}>Saturday</option>
                            </select>
                        </div>

                        <div className="form-group">
                            <label className="form-label">Start Time</label>
                            <input
                                type="time"
                                className="form-input"
                                value={editModal.slot.startTime}
                                onChange={(e) => handleEditChange('startTime', e.target.value)}
                                step="1"
                            />
                        </div>

                        <div className="form-group">
                            <label className="form-label">End Time</label>
                            <input
                                type="time"
                                className="form-input"
                                value={editModal.slot.endTime}
                                onChange={(e) => handleEditChange('endTime', e.target.value)}
                                step="1"
                            />
                        </div>

                        <div className="current-info">
                            <h4>Current Information:</h4>
                            <div><strong>Day:</strong> {getDayName(editModal.slot.day)}</div>
                            <div><strong>Time:</strong> {formatTime(editModal.slot.startTime)} - {formatTime(editModal.slot.endTime)}</div>
                            <div><strong>Duration:</strong> {formatTime(editModal.slot.duration)}</div>
                        </div>

                        <div className="modal-actions">
                            <button
                                className="cancel-btn"
                                onClick={closeEditModal}
                            >
                                Cancel
                            </button>
                            <button
                                className="confirm-edit-btn"
                                onClick={saveChanges}
                            >
                                Save Changes
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