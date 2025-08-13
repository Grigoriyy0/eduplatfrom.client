import StudentCard from "../../components/StudentCard/StudentCard.jsx";
import {useEffect, useState} from "react";
import "./Dashboard.css"
import Sidebar from "../../components/Sidebar/Sidebar.jsx";
import StudentsTable from "../../components/StudentsTable/StudentsTable.jsx";

function Dashboard() {

    const ApiKey = import.meta.env.VITE_API_KEY;

    const [students, setStudents] = useState([]);

    useEffect(() => {
        fetch(`${ApiKey}/students/all`)
            .then(res => res.json())
            .then(data => setStudents(data));
    }, [])

    console.log(students);

    const handleEdit = (student) => {
        console.log("Edit:", student);
    };

    const handleDelete = (id) => {
        console.log("Delete student with ID:", id);
    };

    return (
        <div className="Dashboard">
            <div className="sidebar">
                <Sidebar />
            </div>
            <div className="header">
                <div className="header-wrapper-title">
                    <h1>Students</h1>
                    <div className="btn-container">
                        <button className="add-student-btn">Add student</button>
                    </div>
                </div>
            </div>
            <div className="students">
                    <StudentsTable
                        students={students}
                        onEdit={handleEdit}
                        onDelete={handleDelete}/>
            </div>
        </div>
    );
}

export default Dashboard;