import React, {useState} from "react";

function AddStudentForm({ onCloseAction, onNotificationSet }) {

    const[name, setName] = useState("");
    const[timeZone, setTimeZone] = useState("");
    const[lessonPrice, setLessonPrice] = React.useState(0);
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
                "name": name,
                "telegram": telegram,
                "timeZone": timeZone,
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
                handleSetNotification("Student created ✅");
                // через 1 сек обновим страницу
                setTimeout(() => {
                    window.location.reload();
                }, 1000);
            } else {
                handleSetNotification("Error during creating student ❌");
            }
        })
            .catch(err => {
                console.error(err);
                handleSetNotification("Error during creating student ❌");
            });
    }

    return (
        <div className="modal-overlay" onClick={handleClose}>
            <div className="modal" onClick={(e) => e.stopPropagation()}>
                <h3 className="modal-title">Create student</h3>

                <div className="modal-form">

                    <div className="form-row">
                        <label>Name</label>
                        <input type="text" className="add-stdnt-inpt" onChange={(e) => setName(e.target.value)}/>
                    </div>

                    <div className="form-row">
                        <label>Time zone</label>
                        <input type="text" className="add-stdnt-inpt" onChange={(e) => setTimeZone(e.target.value)}/>
                    </div>


                    <div className="form-row">
                        <label>Lesson price</label>
                        <input type="text" className="add-stdnt-inpt" onChange={(e) => setLessonPrice(parseInt(e.target.value))}/>
                    </div>

                    <div className="form-row">
                        <label>Telegram</label>
                        <input type="text" className="add-stdnt-inpt" onChange={(e) => setTelegram(e.target.value)}/>
                    </div>

                    <div className="form-row">
                        <label>Subscribed lessons count</label>
                        <input type="text" className="add-stdnt-inpt" onChange={(e) => setSubscription(parseInt(e.target.value))}/>
                    </div>

                    <div className="form-row">
                        <label>Paid lessons count</label>
                        <input type="text" className="add-stdnt-inpt" onChange={(e) => setPaidLessons(parseInt(e.target.value))}/>
                    </div>
                </div>

                <div className="modal-actions">
                    <button className="create-btn" onClick={handleAddStudent}>Create</button>
                    <button className="cancel-btn" onClick={handleClose}>Cancel</button>
                </div>
            </div>
        </div>
    )
}

export default AddStudentForm;