import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Dashboard from "./pages/Dashboard/Dashboard.jsx";
import Calendar from "./pages/Calendar/CalendarPage.jsx";
import MainPage from "./pages/MainPage/MainPage.jsx";
import "./App.css"
import ProtectedRoute from "./utils/ProtectedRoute.jsx";
import LoginPage from "./pages/Login/LoginPage.jsx";
import TimeSlots from "./pages/TimeSlots/TimeSlots.jsx";

function App() {
    return (
        <>
            <BrowserRouter>
                <Routes>
                    <Route
                        path="/"
                        element={<Navigate to="/home" replace />}
                    />
                    <Route
                        path="/home"
                        element={
                            <ProtectedRoute component={MainPage} />
                        }
                    />
                    <Route
                        path="/students"
                        element={
                            <ProtectedRoute component={Dashboard} />
                        }
                    />
                    <Route
                        path="/calendar"
                        element={
                            <ProtectedRoute component={Calendar} />
                        }
                    />s
                    <Route
                        path="/time-slots"
                        element={
                            <ProtectedRoute component={TimeSlots} />
                        }
                    />
                    <Route path="/signin" element={<LoginPage />} />
                    {/* Добавляем fallback route для несуществующих путей */}
                    <Route
                        path="*"
                        element={<Navigate to="/home" replace />}
                    />
                </Routes>
            </BrowserRouter>
        </>
    )
}

export default App