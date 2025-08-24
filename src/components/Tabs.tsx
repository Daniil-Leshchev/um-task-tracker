import '../styles/Tabs.css';
import { useState, useContext } from 'react';
import CreateTaskModal from './FormModal';
import { AuthContext } from '../context/AuthContext';

const Tabs = ({ activeTab, onTabChange }) => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const auth = useContext(AuthContext)!;
    const isConfirmed = !auth.loading && auth.user?.is_confirmed;
    const tabs = [
        { id: 'groupCards', label: 'Групповые задачи' },
        { id: 'individualCards', label: 'Индивидуальные задачи' },
        { id: 'table', label: 'Таблица' }
    ];

    const handleOpenModal = () => {
        if (!isConfirmed) return;
        setIsModalOpen(true);
    };

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
            <button
                className='createTask'
                onClick={handleOpenModal}
                disabled={!isConfirmed}
                title={!isConfirmed ? 'Профиль не подтвержден: подтвердите аккаунт у руководителя' : ''}
            >
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
