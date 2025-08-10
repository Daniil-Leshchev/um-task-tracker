import { useContext } from 'react';
import { Routes, Route, Navigate, Outlet } from 'react-router-dom'
import { AuthContext } from './context/AuthContext';
import TaskTracker from './pages/TaskTracker';
import ReportTutor from './pages/ReportTutor';
import Authorization from './pages/Authorization';
import Register from './pages/Register';
import Loading from './components/Loading';
import NotFound from './components/NotFound';
import ProtectedRoute from './components/ProtectedRoute';
import RegisterSecondPage from './pages/RegisterSecondPage';
import "./styles/App.css";

function RootRedirect() {
    const auth = useContext(AuthContext)!;
    if (auth.loading) {
        return <Loading />;
    }
    return auth.user
        ? <Navigate to="/tasktracker" replace />
        : <Navigate to="/register" replace />;
}

export default function App() {
    return (
        <Routes>
            {/* <Route path="/" element={<RootRedirect />} /> */}
            <Route path="/" element={<Register />} />
            <Route path="/login" element={<Authorization />} />
            <Route path="/register" element={<Register />} />
            <Route path="/registerSecondPage" element={<RegisterSecondPage />} />
            <Route path="/tasktracker" element={<TaskTracker />} />
            <Route path="/reports/:taskId/:curatorId" element={<ReportTutor />} />
            <Route element={<ProtectedRoute> <Outlet/> </ProtectedRoute>}>
                
            </Route>
            <Route path="*" element={<NotFound />} />
            
        </Routes>
    )
}