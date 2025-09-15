import Sidebar from "../../components/Sidebar/Sidebar.jsx";
import React, {useEffect, useState} from "react";
import "react-big-calendar/lib/css/react-big-calendar.css";
import "./Calendar.css"
import moment from "moment";
import CustomCalendar from "../../components/CustomCalendar/CustomCalendar.jsx";

moment.locale("ru");

function CalendarPage() {

    const ApiKey = import.meta.env.VITE_API_KEY;
    const [lessons, setLessons] = useState([]);

    useEffect(() => {
        fetch(`${ApiKey}/lessons/all?criteriaName=month`)
            .then(res => res.json())
            .then(data => setLessons(data));
    }, [])



    return (
        <div className="calendar-page">
            <div className="sidebar-wrapper">
                <Sidebar />
            </div>
            <div className="calendar-wrapper">
                <CustomCalendar lessons={lessons} />
            </div>
        </div>
    );
}

export default CalendarPage;