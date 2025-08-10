import "../styles/InfoReportTutor.css";

const InfoReportTutor = ({ report }) => {
    if (!report) {
        return <div>Отчет не найден</div>;
    }

    const formatDate = (dateString) => {
        if (!dateString) return "Не указано";
        const date = new Date(dateString);
        return date.toLocaleString("ru-RU");
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
                        <span className="task-status-badge">{report.status}</span>
                    </div>
                    <div className="task-info-item">
                        <span className="task-info-label">Время выполнения:</span>
                        <span className="task-info-value">{formatDate(report.completedAt)}</span>
                    </div>
                    <div className="task-info-item">
                        <span className="task-info-label">Дедлайн:</span>
                        <span className="task-info-value">{formatDate(report.deadline)}</span>
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
                            alt="Визуальная часть отчета"
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