import '../styles/Tabs.css';

const Tabs = ({ activeTab, onTabChange }) => {
    const tabs = [
        { id: 'groupCards', label: 'Групповые задачи' },
        { id: 'tutorCards', label: 'Индивидуальные задачи' },
        { id: 'table', label: 'Таблица' }
    ];

    return (
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
    );
};

export default Tabs;
