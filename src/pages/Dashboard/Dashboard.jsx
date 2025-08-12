import StudentCard from "../../components/StudentCard/StudentCard.jsx";
import {useEffect, useState} from "react";
import "./Dashboard.css"
import Sidebar from "../../components/Sidebar/Sidebar.jsx";
import { Routes, Route, Link, useNavigate } from 'react-router-dom';
import Calendar from "../Calendar/Calendar.jsx";

function Dashboard() {


    const ApiKey = import.meta.env.VITE_API_KEY;

    const [students, setStudents] = useState([]);

    useEffect(() => {
        fetch(`${ApiKey}/students/all`)
            .then(res => res.json())
            .then(data => setStudents(data));
    }, [])

    console.log(students);

    const navigate = useNavigate();

    const handleTabClick = (path) => {
        navigate(path);
    };

    return (
        <div className="Dashboard">
            <div className="sidebar">
                <Sidebar onTabClick={handleTabClick} />

                <Routes>
                    <Route path="/calendar" element={<Calendar />} />
                    <Route path="/home" element={<Dashboard />} />
                </Routes>

            </div>
            <div className="students">
                {students.map((student) => (
                    <StudentCard {...student} key={student.studentId} />
                ))}
            </div>
        </div>
    );
}

export default Dashboard;