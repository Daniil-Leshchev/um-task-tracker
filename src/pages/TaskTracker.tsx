import { useState, useEffect } from "react";
import Header from "../components/Header";
import StatsCards from "../components/StatsCards";
import Tabs from "../components/Tabs";
import Filters from "../components/Filters";
import TaskGrid from "../components/TaskGrid";
import TaskModal from "../components/TaskModal";
import { tasks, stats } from "../data/tasks";

export default function TaskTracker() {
    const [activeTab, setActiveTab] = useState("groupCards");
    const [filteredTasks, setFilteredTasks] = useState(tasks);
    const [selectedTask, setSelectedTask] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isFiltersCollapsed, setIsFiltersCollapsed] = useState(false);
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

    const handleFilterChange = (filters) => {
        let filtered = tasks;

        if (filters.search) {
            filtered = filtered.filter((task) =>
                task.title.toLowerCase().includes(filters.search.toLowerCase())
            );
        }

        if (filters.status) {
            filtered = filtered.filter((task) => task.status === filters.status);
        }

        if (filters.dateFrom || filters.dateTo) {
        filtered = filtered.filter((task) => {
            const taskDate = new Date(task.deadline);
            const fromDate = filters.dateFrom
            ? new Date(filters.dateFrom)
            : new Date("1900-01-01");
            const toDate = filters.dateTo
            ? new Date(filters.dateTo)
            : new Date("2100-12-31");
            return taskDate >= fromDate && taskDate <= toDate;
        });
        }

        setFilteredTasks(filtered);
    };

    const handleShowDetails = (task) => {
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

    return (
        <div className="app">
        <Header onRefresh={handleRefresh} lastUpdated={lastUpdated} />

        <main className="main-content">
            <div className="content-section">
            <StatsCards stats={stats} />
            </div>

            <div className="content-section">
                <Tabs activeTab={activeTab} onTabChange={setActiveTab} />
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
                <TaskGrid tasks={filteredTasks} activeTab = "groupCards" onShowDetails={handleShowDetails} />
            </div>
            )}

            {activeTab === "individualCards" && (
            <div className="content-section">
                <TaskGrid tasks={filteredTasks} activeTab = "individualCards" onShowDetails={handleShowDetails} />
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
