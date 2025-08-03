
import GroupedTaskCard from './GroupedTaskCard';
import IndividualTaskCard from './IndividualTaskCard';
import '../styles/TaskGrid.css';

const TaskGrid = ({ tasks, activeTab, onShowDetails }) => {
    if (tasks.length === 0) {
        return (
        <div className="task-grid-empty">
            <p>Задачи не найдены</p>
        </div>
        );
    }

    if (activeTab === "groupCards") {
        return (
        <div className="task-grid">
            {tasks.map(task => (
                <GroupedTaskCard
                key={task.id}
                task={task}
                onShowDetails={onShowDetails}
                />
            ))}
        </div>
        );
    }

    return (
        <div className="task-grid">
        {tasks.map(task => (
            <IndividualTaskCard
            key={task.id}
            task={task}
            onShowDetails={onShowDetails}
            />
        ))}
        </div>
    );
};

export default TaskGrid;
