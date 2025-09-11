import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import Header from "../components/Header";
import InfoReportTutor from "../components/InfoReportTutor";
import type { Report } from '../api/tasks';
import { fetchReport } from '../api/tasks';
import { formatDateTime } from "./TaskTracker";

export default function ReportTutor() {
    const { taskId, email } = useParams();
    const [report, setReport] = useState<Report | null>(null);
    const [lastUpdated, setLastUpdated] = useState("");
    const [loading, setLoading] = useState<boolean>(false);

    useEffect(() => {
        updateTimestamp();
        const task = taskId ?? '';
        const mail = email ? decodeURIComponent(email) : '';
        if (!task || !mail) return;

        let cancelled = false;
        (async () => {
            try {
                setLoading(true);
                const data = await fetchReport(task, mail);
                if (!cancelled) setReport(data);
            } catch (e) {
                if (!cancelled) setReport(null);
            } finally {
                if (!cancelled) setLoading(false);
            }
        })();

        return () => {
            cancelled = true;
        };
    }, [taskId, email]);
    
    const updateTimestamp = () => {
        const now = new Date();
        const timeString = formatDateTime(now);
        setLastUpdated(timeString);
    };

    const handleRefresh = async () => {
        updateTimestamp();
        const task = taskId ?? '';
        const mail = email ? decodeURIComponent(email) : '';
        if (!task || !mail) return;
        try {
            setLoading(true);
            const data = await fetchReport(task, mail);
            setReport(data);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="app">
                <Header onRefresh={handleRefresh} lastUpdated={lastUpdated} />
                <main className="main-content">
                    <div className="not-found">Загрузка отчета…</div>
                </main>
            </div>
        );
    }

    if (!report) {
        return (
            <div className="app">
                <Header onRefresh={handleRefresh} lastUpdated={lastUpdated} />
                <main className="main-content">
                    <div className="not-found">
                        Отчет для задачи {taskId} и куратора {email} не найден
                    </div>
                </main>
            </div>
        );
    }

    return (
        <div className="app">
            <Header onRefresh={handleRefresh} lastUpdated={lastUpdated} />
            <main className="main-content">
                <InfoReportTutor report={report}/>
            </main>
        </div>
    );
}