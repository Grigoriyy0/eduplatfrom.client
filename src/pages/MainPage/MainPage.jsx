import Sidebar from "../../components/Sidebar/Sidebar.jsx";
import "./MainPage.css"
import CustomChart from "../../components/Chart/CustomChart.jsx";
import {jwtDecode} from "jwt-decode";

function MainPage() {

    const token = localStorage.getItem("accessToken");

    const decodedToken = jwtDecode(token);

    const {name, email, id} = decodedToken;

    return (
        <div className="main-page">
            <div className="sidebar-wrapper">
                <Sidebar />
            </div>
            <div className="main-content">
                <h1 className="title">Welcome, {name.split(' ')[0]}</h1>

            </div>

        </div>
    )
}

export default MainPage;