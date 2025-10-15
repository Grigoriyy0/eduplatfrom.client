import Sidebar from "../../components/Sidebar/Sidebar.jsx";
import "./MainPage.css"
import BarChart from "../../components/BarChart/BarChart.jsx";
import {jwtDecode} from "jwt-decode";
import {useSalaryData} from "../../hooks/useSalaryData.js";
import {useStudentsData} from "../../hooks/useStudentsData.js";
import {useLessonsData} from "../../hooks/useLessonsData.js";

function MainPage() {
    const ApiKey = import.meta.env.VITE_API_KEY;
    const token = localStorage.getItem("accessToken");
    const decodedToken = jwtDecode(token);
    const {name} = decodedToken;

    // Use custom hooks for data fetching
    const { salaryData, loading: salaryLoading, error: salaryError } = useSalaryData(ApiKey, token);
    const { studentsData, loading: studentsLoading, error: studentsError } = useStudentsData(ApiKey, token);
    const { lessonsData, loading: lessonsLoading, error: lessonsError } = useLessonsData(ApiKey, token);



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
                            {salaryLoading ? 'Loading...' : 
                             salaryError ? 'Error loading data' :
                             `${salaryData?.expectedSalary ?? 0} HKD`}
                        </p>

                    </div>

                    <div className="chart">
                        <p className="chart-title">Actual salary</p>
                        <p className="chart-payload">
                        <p className="chart-payload">
                            {salaryLoading ? 'Loading...' : 
                             salaryError ? 'Error loading data' :
                             `${salaryData?.actualSalary ?? 0} HKD`}
                        </p>
                        </p>
                    </div>

                    <div className="chart">
                        <p className="chart-title">Lessons</p>
                        <p className="chart-payload">
                            {lessonsLoading ? 'Loading...' : 
                             lessonsError ? 'Error loading data' :
                             `${lessonsData?.total ?? 0} completed`}
                        </p>
                    </div>

                    <div className="chart">
                        <p className="chart-title">Students count</p>
                        <p className="chart-payload">
                            {studentsLoading ? 'Loading...' : 
                             studentsError ? 'Error loading data' :
                             `${studentsData?.studentsCount ?? 0} students`}
                        </p>
                    </div>
                </div>

                <BarChart 
                    lessonsData={lessonsData?.lessonsDayCount || []}
                    salaryData={salaryData?.daysSalary || []}
                    lessonsLoading={lessonsLoading}
                    salaryLoading={salaryLoading}
                    lessonsError={lessonsError}
                    salaryError={salaryError}
                />
            </div>
        </div>
    )
}

export default MainPage;