
import TaskCard from './TaskCard';
import '../styles/TaskGrid.css';

const TaskGrid = ({ tasks, onShowDetails }) => {
    if (tasks.length === 0) {
        return (
        <div className="task-grid-empty">
            <p>Задачи не найдены</p>
        </div>
        );
    }

    return (
        <div className="task-grid">
        {tasks.map(task => (
            <TaskCard
            key={task.id}
            task={task}
            onShowDetails={onShowDetails}
            />
        ))}
        </div>
    );
};

export default TaskGrid;
