import { Routes, Route } from 'react-router-dom'
import TaskTracker from './pages/TaskTracker'
import ReportTutor from './pages/ReportTutor';
import "./styles/App.css";

export default function App() {
    return (
        <Routes>
            <Route path="/tasktracker" element={<TaskTracker />} />
            <Route path="/reporttutor" element={<ReportTutor />} />
        </Routes>
    )
}

