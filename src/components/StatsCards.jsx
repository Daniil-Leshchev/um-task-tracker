import "../styles/StatsCards.css";

const StatsCards = ({ stats }) => {
    const cards = [
        {
        title: "Всего задач",
        value: stats.total,
        color: "#f39c12",
        icon: "tasks",
        },
        {
        title: "Завершено",
        value: stats.completed,
        color: "#10B981",
        icon: "completed",
        },
        {
        title: "В процессе",
        value: stats.inProgress,
        color: "#f39c12",
        icon: "progress",
        },
        {
        title: "Не начато",
        value: stats.notStarted,
        color: "#6B7280",
        icon: "not-started",
        },
        {
        title: "Средний прогресс",
        value: `${stats.averageProgress}%`,
        color: "#8B5CF6",
        icon: "chart",
        },
    ];

    const renderIcon = (type) => {
        switch (type) {
        case "tasks":
            return (
            <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
            >
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                <polyline points="14,2 14,8 20,8" />
                <line x1="16" y1="13" x2="8" y2="13" />
                <line x1="16" y1="17" x2="8" y2="17" />
                <polyline points="10,9 9,10 8,9" />
            </svg>
            );
        case "completed":
            return (
            <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
            >
                <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                <polyline points="22,4 12,14.01 9,11.01" />
            </svg>
            );
        case "progress":
            return (
            <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
            >
                <circle cx="12" cy="12" r="10" />
                <polyline points="12,6 12,12 16,14" />
            </svg>
            );
        case "not-started":
            return (
            <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
            >
                <circle cx="12" cy="12" r="10" />
                <line x1="15" y1="9" x2="9" y2="15" />
                <line x1="9" y1="9" x2="15" y2="15" />
            </svg>
            );
        case "chart":
            return (
            <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
            >
                <line x1="18" y1="20" x2="18" y2="10" />
                <line x1="12" y1="20" x2="12" y2="4" />
                <line x1="6" y1="20" x2="6" y2="14" />
            </svg>
            );
        default:
            return null;
        }
    };

    return (
        <div className="stats-cards">
        {cards.map((card, index) => (
            <div
            key={index}
            className="stats-card"
            style={{ "--card-color": card.color }}
            >
            <div className="stats-card-icon">{renderIcon(card.icon)}</div>
            <div className="stats-card-content">
                <h3 className="stats-card-value">{card.value}</h3>
                <p className="stats-card-title">{card.title}</p>
            </div>
            </div>
        ))}
        </div>
    );
};

export default StatsCards;
