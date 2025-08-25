import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import Header from "../components/Header";
import InfoReportTutor from "../components/InfoReportTutor";
import type { Report } from '../api/tasks';
import { fetchReport } from '../api/tasks';

export default function ReportTutor() {
    const { taskId, curatorId } = useParams();
    const [report, setReport] = useState<Report | null>(null);
    const [lastUpdated, setLastUpdated] = useState("");
    const [loading, setLoading] = useState<boolean>(false);

    useEffect(() => {
        updateTimestamp();
        const task = taskId ?? '';
        const curator = curatorId ? Number(curatorId) : NaN;
        if (!task || Number.isNaN(curator)) return;

        let cancelled = false;
        (async () => {
            try {
                setLoading(true);
                const data = await fetchReport(task, String(curator));
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
    }, [taskId, curatorId]);
    
    const updateTimestamp = () => {
        const now = new Date();
        const timeString = now.toLocaleTimeString("ru-RU", {
            hour: "2-digit",
            minute: "2-digit",
            second: "2-digit",
        });
        setLastUpdated(timeString);
    };

    const handleRefresh = async () => {
        updateTimestamp();
        const task = taskId ?? '';
        const curator = curatorId ? Number(curatorId) : NaN;
        if (!task || Number.isNaN(curator)) return;
        try {
            setLoading(true);
            const data = await fetchReport(task, String(curator));
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
                        Отчет для задачи {taskId} и куратора {curatorId} не найден
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