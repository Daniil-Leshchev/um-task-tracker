import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import Header from "../components/Header";
import InfoReportTutor from "../components/InfoReportTutor";
import { tasks } from "../data/tasks";

type Report = {
    id: number;
    curator: string;
    task: string;
    status: string;
    completedAt: string;
    deadline: string;
    reportUrl: string | null;
    reportText: string | null;
};

export default function ReportTutor() {
    const { taskId, curatorId } = useParams();
    const [report, setReport] = useState<Report | null>(null);
    const [lastUpdated, setLastUpdated] = useState("");

    useEffect(() => {
        updateTimestamp();
        const foundTask = tasks.find(t => t.id === parseInt(taskId as string));
        if (foundTask) {
            const foundCurator = foundTask.curators.find(c => c.id === parseInt(curatorId as string));
            if (foundCurator) {
                const reportData: Report = {
                    id: foundCurator.id,
                    curator: foundCurator.name,
                    task: foundTask.title,
                    status: foundCurator.status,
                    completedAt: foundCurator.completedAt || '',
                    deadline: foundTask.deadline,
                    reportUrl: foundCurator.reportUrl,
                    reportText: foundCurator.reportText
                };
                setReport(reportData);
            }
        }
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

    const handleRefresh = () => {
        updateTimestamp();
        // Повторяем поиск при обновлении
        const foundTask = tasks.find(t => t.id === parseInt(taskId as string));
        if (foundTask) {
            const foundCurator = foundTask.curators.find(c => c.id === parseInt(curatorId as string));
            if (foundCurator) {
                const reportData: Report = {
                    id: foundCurator.id,
                    curator: foundCurator.name,
                    task: foundTask.title,
                    status: foundCurator.status,
                    completedAt: foundCurator.completedAt || '',
                    deadline: foundTask.deadline,
                    reportUrl: foundCurator.reportUrl,
                    reportText: foundCurator.reportText
                };
                setReport(reportData);
            }
        }
    };

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