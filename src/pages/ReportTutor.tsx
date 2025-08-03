import { useState, useEffect } from "react";
import Header from "../components/Header";
import InfoReportTutor from "../components/InfoReportTutor";
import { tasks } from "../data/tasks";

export default function ReportTutor() {
    const [filteredTasks, setFilteredTasks] = useState(tasks);
    const [lastUpdated, setLastUpdated] = useState("");

    useEffect(() => {
            updateTimestamp();
    }, []);
    
    const updateTimestamp = () => {
            const now = new Date();
            const timeString = now.toLocaleTimeString("ru-RU", {
                hour: "2-digit",
                minute: "2-digit",
                second: "2-digit",
            });
            setLastUpdated(timeString);
    };

    const handleRefresh = () => {
        updateTimestamp();
        setFilteredTasks([...tasks]);
    };

    return (
        <div className="app">
        <Header onRefresh={handleRefresh} lastUpdated={lastUpdated} />
        <main className="main-content">
            <InfoReportTutor/>
        </main>
        </div>
    )
}