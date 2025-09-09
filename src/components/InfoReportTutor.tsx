import "../styles/InfoReportTutor.css";
import { formatDateTime } from "../pages/TaskTracker";

const InfoReportTutor = ({ report }) => {
    if (!report) {
        return <div>Отчет не найден</div>;
    }

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

    const directUrl = `https://images1-focus-opensocial.googleusercontent.com/gadgets/proxy?container=focus&refresh=2592000&url=${encodeURIComponent(report.reportUrl)}`;

    return (
        <div className="main-container">
            <div>
                <h2>{report.curator}</h2>
                <div className="task-info"> 
                    <div className="task-info-item">
                        <span className="task-info-label">Задача:</span>
                        <span className="task-info-value">{report.task}</span>
                    </div>
                    <div className="task-info-item">
                        <span className="task-info-label">Статус:</span>
                        <span className="task-status-badge">{getStatusBadge(report.status).text}</span>
                    </div>
                    <div className="task-info-item">
                        <span className="task-info-label">Время выполнения:</span>
                        <span className="task-info-value">{formatDateTime(report.completedAt)}</span>
                    </div>
                    <div className="task-info-item">
                        <span className="task-info-label">Дедлайн:</span>
                        <span className="task-info-value">{formatDateTime(report.deadline)}</span>
                    </div>
                </div>
            </div>
            <div>
                <h2>Отчет куратора:</h2>
                    {report.reportUrl || report.reportText ? (
                    <div className="report-info">
                        {report.reportUrl && (
                        <img 
                            className="report-info-image"
                            src="../images/picture.jpg" 
                            alt="Картинка отчета"
                        />
                        )}
                        {report.reportText && (
                        <div className="report-info-text">
                            {report.reportText}
                        </div>
                        )}
                    </div>
                    ) : (
                    <div>Отчет отсутствует</div>
                    )}
            </div>
        </div>
    );
};

export default InfoReportTutor;