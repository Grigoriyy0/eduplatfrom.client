import Sidebar from "../../components/Sidebar/Sidebar.jsx";
import "./MainPage.css"
import CustomChart from "../../components/Chart/CustomChart.jsx";

function MainPage() {
    return (
        <div className="main-page">
            <div className="sidebar-wrapper">
                <Sidebar />
            </div>
            <div className="main-page-header">
                <h1 className="title">Salary analytics</h1>
            </div>
            <div className="content-wrapper">
                <CustomChart chartName={"Students count"}  chartInfo={10}/>
            </div>
        </div>
    )
}

export default MainPage;