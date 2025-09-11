import StudentCard from "../../components/StudentCard/StudentCard.jsx";
import React, {useEffect, useState} from "react";
import "./Dashboard.css"
import Sidebar from "../../components/Sidebar/Sidebar.jsx";
import StudentsTable from "../../components/StudentsTable/StudentsTable.jsx";

function Dashboard() {

    const ApiKey = import.meta.env.VITE_API_KEY;

    const [students, setStudents] = useState([]);
    const[addStudent, setAddStudent] = useState(false);

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

            {addStudent && (
                <div className="modal-overlay" onClick={() => setAddStudent(null)}>
                    <div className="modal" onClick={(e) => e.stopPropagation()}>
                        <h3 className="modal-title">Добавить ученика</h3>

                        <div className="modal-form">
                            <div className="form-row">
                                <label>Имя</label>
                                <input type="text" className="add-stdnt-inpt"/>
                            </div>

                            <div className="form-row">
                                <label>Фамилия</label>
                                <input type="text" className="add-stdnt-inpt"/>
                            </div>

                            <div className="form-row">
                                <label>Цена урока</label>
                                <input type="text" className="add-stdnt-inpt"/>
                            </div>

                            <div className="form-row">
                                <label>Почта</label>
                                <input type="text" className="add-stdnt-inpt"/>
                            </div>

                            <div className="form-row">
                                <label>Количество уроков в абонементе</label>
                                <input type="text" className="add-stdnt-inpt"/>
                            </div>

                            <div className="form-row">
                                <label>Количество оплаченных уроков</label>
                                <input type="text" className="add-stdnt-inpt"/>
                            </div>
                        </div>

                        <div className="modal-actions">
                            <button className="create-btn" onClick={null}>Добавить</button>
                            <button className="cancel-btn" onClick={() => setAddStudent(false)}>Отмена</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default Dashboard;