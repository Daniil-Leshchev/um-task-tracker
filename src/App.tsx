import { Routes, Route } from 'react-router-dom'
import TaskTracker from './pages/TaskTracker'
import "./styles/App.css";

export default function App() {
    return (
        <Routes>
            <Route path="/tasktracker" element={<TaskTracker />} />
        </Routes>
    )
}

