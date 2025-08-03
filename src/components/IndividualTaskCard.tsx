
import ProgressCircle from './ProgressCircle';
import '../styles/TaskCard.css';

const IndividualTaskCard = ({ task, onShowDetails }) => {
    const formatDate = (dateStr) => {
        const date = new Date(dateStr);
        return date.toLocaleDateString('ru-RU', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
        });
    };

    return (
        <div className="task-card">
            <div className="task-card-header">
                <h3 className="task-title">{task.title}</h3>
                <span className="task-status">{task.status}</span>
            </div>
        
            <div className="task-progress-section">
                <ProgressCircle progress={task.progress} />
            </div>
        
            <div className="task-stat">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#6B7280" strokeWidth="2">
                    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
                    <circle cx="9" cy="7" r="4"/>
                    <path d="M23 21v-2a4 4 0 0 0-3-3.87"/>
                    <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
                </svg>
                <span>{task.curators.map(curator => curator.name).join(', ')}</span>
            </div>
        
            <div className="task-deadline">
                <span>Дедлайн: {formatDate(task.deadline)}</span>
            </div>
        
            <div className="task-actions">
                <button className="details-btn" onClick={() => onShowDetails(task)}>
                Подробнее
                </button>
            </div>
        </div>
    );
};

export default IndividualTaskCard;
