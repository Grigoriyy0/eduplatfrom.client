import Sidebar from "../../components/Sidebar/Sidebar.jsx";
import "./MainPage.css"
import CustomChart from "../../components/Chart/CustomChart.jsx";
import {jwtDecode} from "jwt-decode";
import {useEffect, useState} from "react";

function MainPage() {
    const ApiKey = import.meta.env.VITE_API_KEY;
    const token = localStorage.getItem("accessToken");
    const decodedToken = jwtDecode(token);
    const {name, email, id} = decodedToken;

    const [salaryData, setSalaryData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch(`${ApiKey}/analytics/salary`, {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    }
                });

                if (!response.ok) {
                    throw new Error(`Ошибка загрузки данных: ${response.status}`);
                }

                const data = await response.json();
                setSalaryData(data);

            } catch (err) {
                setError(err.message);
                console.error('Ошибка:', err);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [ApiKey, token]);



    return (
        <div className="main-page">
            <div className="sidebar-wrapper">
                <Sidebar />
            </div>
            <div className="main-content">
                <h1 className="title">Welcome, {name.split(' ')[0]}</h1>

                <div className="main-info">
                    <div className="chart">
                        <p className="chart-title">Expected salary</p>
                        <p className="chart-payload">
                            {salaryData?.expectedSalary ?? 0} HKD
                            {salaryData?.actualSalary ?? 0} HKD
                        </p>
                    </div>

                    <div className="chart">
                        <p className="chart-title">HZMB</p>
                        <p className="chart-payload">
                        </p>
                    </div>

                    <div className="chart">
                        <p className="chart-title">Lessons</p>
                        <p className="chart-payload">

                        </p>
                    </div>

                    <div className="chart">
                        <p className="chart-title">Students count</p>
                        <p className="chart-payload">
                        </p>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default MainPage;