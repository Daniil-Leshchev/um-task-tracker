import '../styles/Tabs.css';
import { useState } from 'react';
import CreateTaskModal from './FormModal';

const Tabs = ({ activeTab, onTabChange }) => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const tabs = [
        { id: 'groupCards', label: 'Групповые задачи' },
        { id: 'individualCards', label: 'Индивидуальные задачи' },
        { id: 'table', label: 'Таблица' }
    ];

    const handleCreateTask = (newTask) => {
        console.log('Новая задача:', newTask);
    };

    return (
        <div className='tabsAndCreateTask'>
            <div className="tabs">
            {tabs.map(tab => (
                <button
                key={tab.id}
                className={`tab ${activeTab === tab.id ? 'active' : ''}`}
                onClick={() => onTabChange(tab.id)}
                >
                {tab.label}
                </button>
            ))}
            </div>
            <button className='createTask' onClick={() => setIsModalOpen(true)}>
                Создать задачу
            </button>
            
            <CreateTaskModal 
                isOpen={isModalOpen} 
                onClose={() => setIsModalOpen(false)} 
                onCreate={handleCreateTask}
            />
        </div>
    );
};

export default Tabs;
