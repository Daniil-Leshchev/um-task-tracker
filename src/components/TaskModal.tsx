import { useState } from 'react';
import { Link } from 'react-router-dom';
import Avatar from './Avatar';
import ProgressCircle from './ProgressCircle';
import ElasticSearch from './ElasticSearch';
import '../styles/TaskModal.css';

const TaskModal = ({ task, isOpen, onClose }) => {
    const [filterType, setFilterType] = useState('all');

    if (!isOpen || !task) return null;

    const formatDateTime = (dateStr) => {
        const date = new Date(dateStr);
        return date.toLocaleString('ru-RU', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const getStatusBadge = (status) => {
        switch (status) {
            case 'completed':
                return { text: 'Выполнено', className: 'status-badge-completed' };
            case 'completed_late':
                return { text: 'Выполнено с опозданием', className: 'status-badge-late' };
            case 'not_completed':
                return { text: 'Не выполнено', className: 'status-badge-not-completed' };
            default:
                return { text: 'Неизвестно', className: 'status-badge-unknown' };
        }
    };

    const allCurators = task.curators;
    const completedCurators = task.curators.filter(curator =>
        curator.status === 'completed'
    );
    const completedLateCurators = task.curators.filter(curator =>
        curator.status === 'completed_late'
    );
    const notCompletedCurators = task.curators.filter(curator =>
        curator.status === 'not_completed'
    );

    const getFilteredCurators = () => {
        switch (filterType) {
            case 'completed':
                return completedCurators;
            case 'not_completed':
                return notCompletedCurators;
            case 'completed_late':
                return completedLateCurators;
            default:
                return task.curators;
        }
    };

    const filteredCurators = getFilteredCurators();

    const isTaskCompleted = (status) => {
        return status === 'completed' || status === 'completed_late';
    };

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                <div className="modal-header">
                    <h2>{task.title}</h2>
                    <button className="modal-close" onClick={onClose}>
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <line x1="18" y1="6" x2="6" y2="18" />
                            <line x1="6" y1="6" x2="18" y2="18" />
                        </svg>
                    </button>
                </div>

                <div className="modal-body">
                    <div className="task-overview">
                        <div className="task-overview-left">
                            <ProgressCircle progress={task.progress} size={120} strokeWidth={12} />
                        </div>

                        <div className="task-overview-right">
                            <div className="task-info-grid">
                                <div className="task-info-item">
                                    <span className="task-info-label">Статус:</span>
                                    <span className="task-status-badge">{task.status}</span>
                                </div>
                                
                                <div className="task-info-item">
                                    <span className="task-info-label">Создано:</span>
                                    <span className="task-info-value">{formatDateTime(task.created)}</span>
                                </div>

                                <div className="task-info-item">
                                    <span className="task-info-label">Выполнено:</span>
                                    <span className="task-info-value">{task.completed} из {task.total}</span>
                                </div>

                                <div className="task-info-item">
                                    <span className="task-info-label">Дедлайн:</span>
                                    <span className="task-info-value">{formatDateTime(task.deadline)}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="task-info-item">
                        <span className="task-info-label">Описание: </span>
                        <span className="task-info-value">{task.description}</span>
                    </div>

                    <div className="task-info-item-last">
                        <span className="task-info-label">Отчет: </span>
                        <span className="task-info-value">{task.report}</span>
                    </div>

                    <div className="curators-section">
                        <h3>Кураторы ({task.curators.length})</h3>

                        <div className="curator-filter-tabs">
                            <button
                                className={`filter-tab ${filterType === 'all' ? 'active' : ''}`}
                                onClick={() => setFilterType('all')}
                            >
                                Все кураторы
                            </button>
                            <button
                                className={`filter-tab ${filterType === 'completed' ? 'active' : ''}`}
                                onClick={() => setFilterType('completed')}
                            >
                                Выполнено ({completedCurators.length})
                            </button>
                            <button
                                className={`filter-tab ${filterType === 'completed_late' ? 'active' : ''}`}
                                onClick={() => setFilterType('completed_late')}
                            >
                                Выполнено с опозданием ({completedLateCurators.length})
                            </button>
                            <button
                                className={`filter-tab ${filterType === 'not_completed' ? 'active' : ''}`}
                                onClick={() => setFilterType('not_completed')}
                            >
                                Не выполнено ({notCompletedCurators.length})
                            </button>
                        </div>

                        {filterType === 'all' ? (
                            <div className="curators-grouped">
                                {allCurators.length > 0 && (
                                    <div className="curator-group">
                                        <div className="curator-group-content">
                                            <ElasticSearch
                                                items={allCurators.map(c => ({
                                                    id: c.id,
                                                    displayText: c.name,
                                                    name: c.name,
                                                    initials: c.initials,
                                                    color: c.color,
                                                    role: c.role,
                                                    status: c.status,
                                                    completedAt: c.completedAt
                                                }))}
                                                backgroundcolor = 'white'
                                                renderItem={(item) => (
                                                    <div key={item.id} className="curator-card">
                                                        <Avatar
                                                            name={item.name}
                                                            initials={item.initials}
                                                            color={item.color}
                                                            size={40}
                                                        />
                                                        <div className="curator-info">
                                                            <div className="curator-name-type">
                                                            <span className="curator-name">{item.name}</span>
                                                            <span className="curator-type">{item.role}</span>
                                                            </div>
                                                            <div className="curator-status-row">
                                                            <span className={`curator-status ${getStatusBadge(item.status).className}`}>
                                                                {getStatusBadge(item.status).text}
                                                            </span>
                                                            {item.completedAt && (
                                                                <span className="curator-completion-date">
                                                                {formatDateTime(item.completedAt)}
                                                                </span>
                                                            )}
                                                            </div>
                                                        </div>
                                                        {isTaskCompleted(item.status) && (
                                                            <Link to={`/reports/${task.id}/${item.id}`}>
                                                                <button className="curator-view-btn">
                                                                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                                                    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                                                                    <circle cx="12" cy="12" r="3" />
                                                                    </svg>
                                                                </button>
                                                            </Link>
                                                        )}
                                                    </div>
                                                )}
                                            />
                                        </div>
                                    </div>
                                )}
                            </div>
                        ) : (
                            <div className="curators-filtered">
                                {filteredCurators.map(curator => (
                                    <div key={curator.id} className="curator-card">
                                        <Avatar
                                            name={curator.name}
                                            initials={curator.initials}
                                            color={curator.color}
                                            size={40}
                                        />
                                        <div className="curator-info">
                                            <div className="curator-name-type">
                                                <span className="curator-name">{curator.name}</span>
                                                <span className="curator-type">{curator.type}</span>
                                            </div>
                                            <div className="curator-status-row">
                                                <span className={`curator-status ${getStatusBadge(curator.status).className}`}>
                                                    {getStatusBadge(curator.status).text}
                                                </span>
                                                {curator.completedAt && (
                                                    <span className="curator-completion-date">
                                                        {formatDateTime(curator.completedAt)}
                                                    </span>
                                                )}
                                            </div>
                                        </div>
                                        {isTaskCompleted(curator.status) && (
                                            <button className="curator-view-btn">
                                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                                    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                                                    <circle cx="12" cy="12" r="3" />
                                                </svg>
                                            </button>
                                        )}
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TaskModal;