import "./Sidebar.css";
import {useNavigate} from "react-router-dom";

function Sidebar({ onTabClick }) {
    const tabs = [
        { id: 0, title: "Главная", icon: "🏠", path: "/" },
        { id: 1, title: "Студенты", icon: "👨‍🎓", path: "/students" },
        { id: 2, title: "Календарь", icon: "📅", path: "/calendar" },
        { id: 3, title: "Финансы", icon: "💰" },
        { id: 4, title: "Настройки", icon: "⚙️" },
    ];

    const navigate = useNavigate();

    return (
        <div className="sidebar">
            <div className="sidebar-header">
                <h2>EduNEXT Dashboard</h2>
            </div>
            <div className="sidebar-tabs">
                {tabs.map((tab) => (
                    <div
                        key={tab.id}
                        className="sidebar-tab"
                        onClick={() => onTabClick(navigate(tab.path))}
                    >
                        <span className="tab-icon">{tab.icon}</span>
                        <span className="tab-title">{tab.title}</span>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default Sidebar;