import './TimeSlots.css'
import Sidebar from "../../components/Sidebar/Sidebar.jsx";
import { useTimeSlotsData } from "../../hooks/useTimeSlotsData.js";

function TimeSlots() {
    const ApiKey = import.meta.env.VITE_API_KEY;
    const token = localStorage.getItem("accessToken");
    const { timeSlotsData, loading: timeSlotsLoading, error: timeSlotsError } = useTimeSlotsData(ApiKey, token);

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
        return days[dayNumber] || `День ${dayNumber}`;
    };

    // Функция для форматирования времени (убираем секунды)
    const formatTime = (timeString) => {
        return timeString.slice(0, 5); // Берем только часы и минуты
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
        
    }

    function handleDelete(slot, e) {
        
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
                                                {slot.student.name || 'Студент'}
                                            </div>
                                        ) : (
                                            <div className="available-badge">Available</div>
                                        )}

                                        <div className="slot-actions">
                                            <button
                                                className="action-btn edit-btn"
                                                onClick={(e) => handleEdit(slot, e)}
                                                title="Редактировать"
                                            >
                                                ✏️
                                            </button>
                                            <button
                                                className="action-btn delete-btn"
                                                onClick={(e) => handleDelete(slot, e)}
                                                title="Удалить"
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
                            <h3>Нет доступных слотов времени</h3>
                            <p>Создайте новые слоты для проведения уроков</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

export default TimeSlots;