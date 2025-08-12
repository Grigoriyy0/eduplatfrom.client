import { BrowserRouter, Routes, Route } from "react-router-dom";
import Dashboard from "./pages/Dashboard/Dashboard.jsx";
import Calendar from "./pages/Calendar/CalendarPage.jsx";
import "./App.css"
import MainPage from "./pages/MainPage/MainPage.jsx";

function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<MainPage />} />
          <Route path="/students" element={<Dashboard/>}/>
          <Route path="/calendar" element={<Calendar />}/>
        </Routes>
      </BrowserRouter>
    </>
  )
}

export default App
