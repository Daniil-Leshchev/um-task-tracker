import { useState } from "react";
import "../styles/Filters.css";

const Filters = ({ onFilterChange, isCollapsed, onToggleCollapse }) => {
    const [filters, setFilters] = useState({
        search: "",
        status: "",
        progress: "",
        dateFrom: "",
        dateTo: ""
    });

    const handleFilterChange = (key, value) => {
        const newFilters = { ...filters, [key]: value };
        setFilters(newFilters);
        onFilterChange(newFilters);
    };

    return (
        <div className={`filters ${isCollapsed ? "collapsed" : ""}`}>
        <div className="filters-header">
            <div className="filters-title">
            <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
            >
                <polygon points="22,3 2,3 10,12.46 10,19 14,21 14,12.46 22,3" />
            </svg>
            <span>Фильтр</span>
            </div>
            <button className="collapse-btn" onClick={onToggleCollapse}>
            {isCollapsed ? "Развернуть" : "Свернуть"}
            </button>
        </div>

        {!isCollapsed && (
            <div className="filters-content">
            <div className="filters-row">
                <div className="filter-group">
                <input
                    type="text"
                    placeholder="Введите название задачи..."
                    value={filters.search}
                    onChange={(e) => handleFilterChange("search", e.target.value)}
                    className="search-input"
                />
                </div>
            </div>

            <div className="filters-row">
                <div className="filter-group">
                <label>Статус задачи</label>
                <select
                    value={filters.status}
                    onChange={(e) => handleFilterChange("status", e.target.value)}
                >
                    <option value="">Все статусы</option>
                    <option value="В процессе">В процессе</option>
                    <option value="Завершено">Завершено</option>
                    <option value="Не начато">Не начато</option>
                </select>
                </div>

                <div className="filter-group">
                <label>Дата создания с</label>
                <input
                    type="date"
                    value={filters.dateFrom}
                    onChange={(e) => handleFilterChange("dateFrom", e.target.value)}
                />
                </div>

                <div className="filter-group">
                <label>Дата создания по</label>
                <input
                    type="date"
                    value={filters.dateTo}
                    onChange={(e) => handleFilterChange("dateTo", e.target.value)}
                />
                </div>
            </div>
            </div>
        )}
        </div>
    );
};

export default Filters;
