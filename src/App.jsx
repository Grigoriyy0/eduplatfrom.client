import { BrowserRouter, Routes, Route } from "react-router-dom";
import Dashboard from "./pages/Dashboard/Dashboard.jsx";
import Calendar from "./pages/Calendar/CalendarPage.jsx";
import MainPage from "./pages/MainPage/MainPage.jsx";
import "./App.css"
import ProtectedRoute from "./utils/ProtectedRoute.jsx";
import LoginPage from "./pages/Login/LoginPage.jsx";

function App() {

  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<ProtectedRoute component={<MainPage />} />} />
          <Route path="/students" element={<Dashboard/>}/>
          <Route path="/calendar" element={<Calendar />}/>
          <Route path="/signin" element={<LoginPage />}/>
        </Routes>
      </BrowserRouter>
    </>
  )
}

export default App
