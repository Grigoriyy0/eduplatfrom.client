import React from "react";

function AddStudentForm({ onCloseAction, onNotificationSet }) {

    const[firstName, setFirstName] = React.useState("");
    const[lastName, setLastName] = React.useState("");
    const[lessonPrice, setLessonPrice] = React.useState(0);
    const[email, setEmail] = React.useState("");
    const[telegram, setTelegram] = React.useState("");
    const[subscription, setSubscription] = React.useState(0);
    const[paidLessons, setPaidLessons] = React.useState(0);

    const ApiKey = import.meta.env.VITE_API_KEY;

    const handleClose = () => {
        onCloseAction();
    };

    const handleSetNotification = (value) => {
        onNotificationSet(value);
    };

    const token = localStorage.getItem("accessToken");

    const handleAddStudent = () => {
        fetch(`${ApiKey}/students/add/`, {
            method: "POST",
            body: JSON.stringify({
                "firstName": firstName,
                "lastName": lastName,
                "email": email,
                "telegram": telegram,
                "paidLessonsCount": paidLessons,
                "subscribedLessonsCount": subscription,
                "lessonPrice": lessonPrice,

            }),
            headers: {
                "Content-Type": "application/json",
                'Authorization': `Bearer ${token}`,
            }
        }).then(r => {
            if (r.ok) {
                handleSetNotification("Студент успешно добавлен ✅");
                // через 1 сек обновим страницу
                setTimeout(() => {
                    window.location.reload();
                }, 1000);
            } else {
                handleSetNotification("Ошибка при создании студента ❌");
            }
        })
            .catch(err => {
                console.error(err);
                handleSetNotification("Ошибка при создании студента ❌");
            });
    }

    return (
        <div className="modal-overlay" onClick={handleClose}>
            <div className="modal" onClick={(e) => e.stopPropagation()}>
                <h3 className="modal-title">Добавить ученика</h3>

                <div className="modal-form">
                    <div className="form-row">
                        <label>Имя</label>
                        <input type="text" className="add-stdnt-inpt" onChange={(e) => setFirstName(e.target.value)} />
                    </div>

                    <div className="form-row">
                        <label>Фамилия</label>
                        <input type="text" className="add-stdnt-inpt" onChange={(e) => setLastName(e.target.value)} />
                    </div>

                    <div className="form-row">
                        <label>Цена урока</label>
                        <input type="text" className="add-stdnt-inpt" onChange={(e) => setLessonPrice(parseInt(e.target.value))}/>
                    </div>

                    <div className="form-row">
                        <label>Почта</label>
                        <input type="text" className="add-stdnt-inpt" onChange={(e) => setEmail(e.target.value)}/>
                    </div>

                    <div className="form-row">
                        <label>Telegram</label>
                        <input type="text" className="add-stdnt-inpt" onChange={(e) => setTelegram(e.target.value)}/>
                    </div>

                    <div className="form-row">
                        <label>Количество уроков в абонементе</label>
                        <input type="text" className="add-stdnt-inpt" onChange={(e) => setSubscription(parseInt(e.target.value))}/>
                    </div>

                    <div className="form-row">
                        <label>Количество оплаченных уроков</label>
                        <input type="text" className="add-stdnt-inpt" onChange={(e) => setPaidLessons(parseInt(e.target.value))}/>
                    </div>
                </div>

                <div className="modal-actions">
                    <button className="create-btn" onClick={handleAddStudent}>Добавить</button>
                    <button className="cancel-btn" onClick={handleClose}>Отмена</button>
                </div>
            </div>
        </div>
    )
}

export default AddStudentForm;