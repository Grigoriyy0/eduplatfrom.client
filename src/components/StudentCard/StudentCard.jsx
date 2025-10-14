import "./StudentCard.css"

function StudentCard (props) {
    return (
        <div className="student-card">
            <h4 className="student-info-title">{props.name}</h4>
            <p className="student-info">Lesson price: {props.lessonPrice}</p>
            <p className="student-info">Time zone: {props.timeZone}</p>
            <p className="student-info">Telegram: {props.telegram}</p>
            <p className="student-info">Remaining paid lessons: {props.paidLessonsCount}</p>
            <p className="student-info">Subscribed lessons count: {props.subscribedLessonsCount}</p>
        </div>
    );
}

export default StudentCard;