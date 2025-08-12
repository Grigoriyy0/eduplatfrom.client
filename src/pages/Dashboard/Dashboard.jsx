import StudentCard from "../../components/StudentCard/StudentCard.jsx";
import {useEffect, useState} from "react";
import "./Dashboard.css"
import Sidebar from "../../components/Sidebar/Sidebar.jsx";

function Dashboard() {

    const ApiKey = import.meta.env.VITE_API_KEY;

    const [students, setStudents] = useState([]);

    useEffect(() => {
        fetch(`${ApiKey}/students/all`)
            .then(res => res.json())
            .then(data => setStudents(data));
    }, [])

    console.log(students);



    return (
        <div className="Dashboard">
            <div className="sidebar">
                <Sidebar />
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