import { useState, useEffect } from "react";
import Header from "../components/Header";
import StatsCards from "../components/StatsCards";
import Tabs from "../components/Tabs";
import Filters from "../components/Filters";
import TaskGrid from "../components/TaskGrid";
import TaskModal from "../components/TaskModal";
import { fetchTasks, type TaskCard, type Scope } from '../api/tasks';
import Loading from "../components/Loading";

const isDone = (t: TaskCard) =>
    t.progress === 100 ||
    ((t.total ?? 0) > 0 && (t.completed ?? 0) >= (t.total ?? 0)) ||
    t.status === 'Завершено';

const isNotStarted = (t: TaskCard) =>
    t.progress === 0 || t.status === 'Не начато';

const computeStats = (items: TaskCard[]) => {
    const total = items.length;
    let done = 0, notStarted = 0, inProgress = 0;

    let onTimeRecipients = 0;
    let completedRecipientsTotal = 0;

    for (const t of items) {
        if (isDone(t)) done++;
        else if (isNotStarted(t)) notStarted++;
        else inProgress++;

        const ot = (t as any).on_time ?? 0;
        const comp = (t as any).completed ?? 0;
        onTimeRecipients += Number(ot) || 0;
        completedRecipientsTotal += Number(comp) || 0;
    }

    const completedPercent = total ? Math.round((done / total) * 100) : 0;
    const onTimePercent = completedRecipientsTotal
        ? Math.round((onTimeRecipients / completedRecipientsTotal) * 100)
        : 0;

    return { total, done, notStarted, inProgress, completedPercent, onTimePercent };
};

type TaskFilters = {
    search?: string;
    status?: string;
    dateFrom?: string | Date | null;
    dateTo?: string | Date | null;
};

const toDate = (value?: string | number | Date | null): Date | null => {
    if (value === undefined || value === null) return null;
    return value instanceof Date ? value : new Date(value);
};

export const formatDateTime = (value: string | number | Date) =>
    new Intl.DateTimeFormat('ru-RU', {
        timeZone: 'Europe/Moscow',
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
    }).format(toDate(value) as Date);

const scopeByTab = (tab: string): Scope => {
    if (tab === 'individualCards') return 'individual';
    if (tab === 'groupCards') return 'group';
    return 'all';
};

export default function TaskTracker() {
    const [activeTab, setActiveTab] = useState("groupCards");
    const [allTasks, setAllTasks] = useState<TaskCard[]>([]);
    const [filteredTasks, setFilteredTasks] = useState<TaskCard[]>([]);
    const [selectedTask, setSelectedTask] = useState<TaskCard | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isFiltersCollapsed, setIsFiltersCollapsed] = useState(false);
    const [lastUpdated, setLastUpdated] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const loadTasks = async (scope?: Scope) => {
        setLoading(true);
        setError(null);
        try {
            const data = await fetchTasks({ scope: scope ?? scopeByTab(activeTab) });
            const withFormattedDeadline = data.map((t) => ({
                ...t,
                created: formatDateTime(t.created),
                deadline: formatDateTime(t.deadline),
            }));
            setAllTasks(withFormattedDeadline);
            setFilteredTasks(withFormattedDeadline);
            updateTimestamp();
        } catch (e) {
            setAllTasks([]);
            setFilteredTasks([]);
            setError('Не удалось загрузить задачи');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadTasks(scopeByTab(activeTab));
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
        loadTasks(scopeByTab(activeTab));
    };

    const handleFilterChange = (filters: TaskFilters) => {
        let filtered: TaskCard[] = allTasks;

        if (filters.search) {
            filtered = filtered.filter((task) =>
                task.title.toLowerCase().includes(filters.search.toLowerCase())
            );
        }

        if (filters.status) {
            filtered = filtered.filter((task) => task.status === filters.status);
        }

        if (filters.dateFrom || filters.dateTo) {
            const from = toDate(filters.dateFrom);
            const to = toDate(filters.dateTo);

            const toEndOfDay = (d: Date | null) =>
                d ? new Date(d.getFullYear(), d.getMonth(), d.getDate(), 23, 59, 59, 999) : null;

            const fromTs = from ? from.getTime() : Number.NEGATIVE_INFINITY;
            const toTs = toEndOfDay(to)?.getTime() ?? Number.POSITIVE_INFINITY;

            filtered = filtered.filter((task) => {
                const created = toDate(task.created);
                if (!created) return false;
                const ts = created.getTime();
                return ts >= fromTs && ts <= toTs;
            });
        }

        setFilteredTasks(filtered);
    };

    const handleShowDetails = (task: TaskCard) => {
        setSelectedTask(task);
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setSelectedTask(null);
    };

    const handleToggleFilters = () => {
        setIsFiltersCollapsed(!isFiltersCollapsed);
    };

    const handleTabChange = (tab: string) => {
        setActiveTab(tab);
        loadTasks(scopeByTab(tab));
    };

    const statsCalc = computeStats(filteredTasks);
    const statsObj = {
        total: statsCalc.total,
        completed: statsCalc.done,
        inProgress: statsCalc.inProgress,
        notStarted: statsCalc.notStarted,
        onTime: statsCalc.onTimePercent,
    };

    if (loading)
        return <Loading />

    return (
        <div className="app">
            <Header onRefresh={handleRefresh} lastUpdated={lastUpdated} />

            <main className="main-content">
                {error && (
                    <div className="content-section">
                        <p style={{ color: '#EF4444', fontSize: 14 }}>{error}</p>
                    </div>
                )}
                <div className="content-section">
                    <StatsCards stats={statsObj} />
                </div>

                <div className="content-section">
                    <Tabs activeTab={activeTab} onTabChange={handleTabChange} />
                </div>

                <div className="content-section">
                    <Filters
                        onFilterChange={handleFilterChange}
                        isCollapsed={isFiltersCollapsed}
                        onToggleCollapse={handleToggleFilters}
                    />
                </div>

                {activeTab === "groupCards" && (
                    <div className="content-section">
                        <TaskGrid tasks={filteredTasks} activeTab="groupCards" onShowDetails={handleShowDetails} />
                    </div>
                )}

                {activeTab === "individualCards" && (
                    <div className="content-section">
                        <TaskGrid tasks={filteredTasks} activeTab="individualCards" onShowDetails={handleShowDetails} />
                    </div>
                )}

                {activeTab === "table" && (
                    <div className="content-section">
                        <div
                            style={{
                                background: "#FFFFFF",
                                borderRadius: "12px",
                                padding: "48px",
                                textAlign: "center",
                                border: "1px solid #E2E8F0",
                            }}
                        >
                            <p style={{ color: "#64748B", fontSize: "16px" }}>
                                Табличное представление будет реализовано позже
                            </p>
                        </div>
                    </div>
                )}
            </main>

            <TaskModal
                task={selectedTask}
                isOpen={isModalOpen}
                onClose={handleCloseModal}
            />
        </div>
    );
}
