import React, {useEffect, useState} from "react";
import "./Dashboard.css"
import Sidebar from "../../components/Sidebar/Sidebar.jsx";
import StudentsTable from "../../components/StudentsTable/StudentsTable.jsx";
import AddStudentForm from "../../components/AddStudentForm/AddStudentForm.jsx";

function Dashboard() {

    const ApiKey = import.meta.env.VITE_API_KEY;

    const token = localStorage.getItem("accessToken");

    const [students, setStudents] = useState([]);
    const[addStudent, setAddStudent] = useState(false);
    const[notification, setNotification] = useState(null);

    useEffect(() => {
        fetch(`${ApiKey}/students/all`, {
            headers : {
                "Authorization": `Bearer ${token}`
            }
        })
            .then(res => res.json())
            .then(data => setStudents(data));
    }, [])

    console.log(students);

    const handleEdit = (student) => {
        console.log("Edit:", student);
    };

    const handleCloseAddStudentModal = () => {
        setAddStudent(false);
    }

    const handleSetNotification = (val) => {
        setNotification(val);
    }

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
                        <button className="add-student-btn" onClick={() => setAddStudent(true)}>Add student</button>
                    </div>
                </div>
            </div>
            <div className="students">
                    <StudentsTable
                        students={students}
                        onEdit={handleEdit}
                        onDelete={handleDelete}/>
            </div>

            {addStudent && <AddStudentForm onCloseAction={handleCloseAddStudentModal} onNotificationSet={handleSetNotification} />}

            {notification && (
                <div className="notification">
                    {notification}
                </div>
            )}
        </div>
    );
}

export default Dashboard;