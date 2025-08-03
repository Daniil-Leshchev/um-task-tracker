import "../styles/InfoReportTutor.css";

const InfoReportTutor = ({ task=null, report=null }) => {
    return (
        <div className="main-container">
            <div>
                <h2>Никита Шардаков</h2>
                <div className="task-info"> 
                    <div className="task-info-item">
                        <span className="task-info-label">Задача:</span>
                        <span className="task-info-value">Выложить пост и сторис</span>
                    </div>
                    <div className="task-info-item">
                        <span className="task-info-label">Статус:</span>
                        <span className="task-status-badge">Выполнено</span>
                    </div>
                    <div className="task-info-item">
                        <span className="task-info-label">Время выполнения:</span>
                        <span className="task-info-value">12.09.2024, 15:34</span>
                    </div>
                    <div className="task-info-item">
                        <span className="task-info-label">Дедлайн:</span>
                        <span className="task-info-value">12.09.2024, 19:00</span>
                    </div>
                </div>
            </div>
            <div>
                <h2>Отчет куратора:</h2>
                <img 
                    className="report-info"
                    src="#" 
                    alt="Что-то пошло не так, картинка не прогрузилась("
                />
            </div>
        </div>
    );
};

export default InfoReportTutor;