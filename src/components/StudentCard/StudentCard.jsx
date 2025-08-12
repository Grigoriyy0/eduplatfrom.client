import "./StudentCard.css"

function StudentCard (props) {
    return (
        <div className="student-card">
            <h4 className="student-info-title">{props.firstName} {props.lastName}</h4>
            <p className="student-info">Цена за урок: {props.lessonPrice}</p>
            <p className="student-info">Email: {props.email}</p>
            <p className="student-info">Telegram: {props.telegram}</p>
            <p className="student-info">Количество оставшихся уроков: {props.paidLessonsCount}</p>
            <p className="student-info">Количество уроков в абонементе: {props.subscribedLessonsCount}</p>
        </div>
    );
}

export default StudentCard;