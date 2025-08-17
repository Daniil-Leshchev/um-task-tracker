import Header from "../components/Header";
import "../styles/Admin.css";
import ElasticSearch from "../components/ElasticSearch";
import { users } from "../data/users";
import { useState } from 'react';

interface User {
    id: number;
    name: string;
    surname: string;
    role: string;
    initials: string;
    color: string;
    subject?: string;
    confirm?: string;
    nameMentor?: string | null;
}

export default function Admin() {
    const [lastUpdated, setLastUpdated] = useState("");
    const [selectedUser, setselectedUser] = useState<User | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isUserConfirmed, setIsUserConfirmed] = useState(false);
    const [selectedMentor, setSelectedMentor] = useState<User | null>(null);

    const mentors = users.filter(user => user.role.toLowerCase().includes("наставник"));
 
    const updateTimestamp = () => {
        const now = new Date();
        const timeString = now.toLocaleTimeString("ru-RU", {
            hour: "2-digit",
            minute: "2-digit",
            second: "2-digit",
        });
        setLastUpdated(timeString);
    };

    const handleRefresh = () => {
        updateTimestamp();
    };

    const handleEditClick = (user) => {
        setselectedUser(user);
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setSelectedMentor(null);
    };

    const deleteUser = () => {
        // Сюда нужна логика удаления из БД
        closeModal()
    }

    const handleConfirm = () => {
        // Сюда нужна логика подтверждения юзера в БД
        setIsUserConfirmed(true)
        if (selectedMentor || (selectedUser?.role && (selectedUser.role.toLowerCase().includes('наставник') || !selectedUser.role.toLowerCase().includes('куратор')))) {
            setSelectedMentor(null);
            setIsUserConfirmed(false);
            closeModal();
        }
    };

    const handleMentorSelect = (mentor: User) => {
        setSelectedMentor(mentor);
        if (isUserConfirmed) {
            setIsUserConfirmed(false)
            closeModal()
        }
    };

    return (
        <>
            <Header onRefresh={handleRefresh} lastUpdated={lastUpdated} />
            <div className="wrapper">
                <h1>Все пользователи</h1>
                <div className="elastic-container">
                    <ElasticSearch
                        items={users.map(user => ({
                            id: user.id.toString(),
                            displayText: `${user.name} ${user.surname} (${user.role})`,
                            name: `${user.name} ${user.surname}`,
                            initials: user.initials,
                            color: user.color,
                            role: user.role,
                            subject: user.subject,
                            department: user.department,
                            confirm: user.confirm,
                            nameMentor: user.nameMentor
                        }))}
                        backgroundcolor="inherit"
                        placeholder="Поиск куратора..."
                        keepListVisible={true}
                        disableInputCapture={true}
                        renderItem={(item) => (
                            <div style={{ 
                                display: 'flex', 
                                alignItems: 'center', 
                                padding: '8px',
                                borderRadius: '4px',
                                paddingRight: '30px'
                            }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '15px', marginRight: 'auto'}}>
                                    <div 
                                        style={{
                                            width: '42px',
                                            height: '42px',
                                            borderRadius: '50%',
                                            backgroundColor: item.color,
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            color: 'white',
                                        }}
                                    >
                                        {item.initials}
                                    </div>
                                    <div style={{ flex: 1 }}>
                                        <div>{item.name}</div>
                                        <div style={{ fontSize: '0.8em', color: '#666' }}>{item.subject}, {item.role}, {item.department}</div>
                                    </div>
                                </div>
                                {item.confirm === "True" && item.nameMentor !== null && (
                                    <span style={{
                                        fontSize: '0.7em',
                                        fontWeight: 'bold',
                                        marginRight: '20px'
                                    }}>
                                        Наставник: {item.nameMentor}
                                    </span>
                                )}
                                {item.confirm === "False" && (
                                    <span style={{
                                        color: '#ff6b6b',
                                        fontSize: '0.7em',
                                        fontWeight: 'bold',
                                        marginRight: '20px'
                                    }}>
                                        Требуется подтверждение
                                    </span>
                                )}
                                <button 
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        handleEditClick(item);
                                    }}
                                    style={{
                                        padding: '5px 10px',
                                        backgroundColor: '#f0f0f0',
                                        border: 'none',
                                        borderRadius: '4px',
                                        cursor: 'pointer'
                                    }}
                                >
                                    Изменить
                                </button>
                            </div>
                        )}
                    />
                </div>
            </div>

            {isModalOpen && selectedUser && (
                <div className="modal-overlay" onClick={closeModal}>
                    <div className="modal-content-admin" onClick={(e) => e.stopPropagation()}>
                        <div className="modal-header-admin">
                            <h2>Изменение пользователя</h2>
                            <button className="modal-close" onClick={closeModal}>
                                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                    <line x1="18" y1="6" x2="6" y2="18" />
                                    <line x1="6" y1="6" x2="18" y2="18" />
                                </svg>
                            </button>
                        </div>

                        <div className="modal-body">
                            <div className="modal-section">
                                <p className="confirmation-text">Вы хотите оставить профиль «{selectedUser.name}»?</p>
                                
                                <div className="action-buttons">
                                    <button 
                                        className="confirm-button"
                                        onClick={handleConfirm}
                                        style={{backgroundColor: isUserConfirmed ? '#4abc50ff' : '#15bf7ef7',}}
                                    >
                                        Да
                                    </button>
                                    <button 
                                        className="cancel-button"
                                        onClick={deleteUser}
                                        disabled={isUserConfirmed}
                                        style={{cursor: isUserConfirmed ? 'not-allowed' : 'pointer'}}
                                    >
                                        Нет
                                    </button>
                                </div>
                            </div>
                            {selectedUser.role && (selectedUser.role.toLowerCase().includes('куратор')) && (!selectedUser.role.toLowerCase().includes('наставник')) && (
                                <div className="modal-section">
                                    <p className="mentor-select">Определите наставника для куратора:</p>
                                    <ElasticSearch
                                        items={mentors.map(mentor => ({
                                            id: mentor.id.toString(),
                                            displayText: `${mentor.name} ${mentor.surname}`,
                                            name: `${mentor.name} ${mentor.surname}`,
                                            role: mentor.role,
                                            initials: mentor.initials,
                                            color: mentor.color,
                                            subject: mentor.subject
                                        }))}
                                        backgroundcolor="white"
                                        placeholder="Введите имя наставника..."
                                        onItemClick={(item) => handleMentorSelect(mentors.find(m => m.id.toString() === item.id)!)}
                                        renderItem={(item) => (
                                            <div style={{ 
                                                display: 'flex', 
                                                alignItems: 'center', 
                                                padding: '8px',
                                                borderRadius: '4px',
                                                justifyContent: 'space-between',
                                                paddingRight: '30px'
                                            }}>
                                                <div style={{ display: 'flex', alignItems: 'center', gap: '15px'}}>
                                                    <div 
                                                        style={{
                                                            width: '42px',
                                                            height: '42px',
                                                            borderRadius: '50%',
                                                            backgroundColor: item.color,
                                                            display: 'flex',
                                                            alignItems: 'center',
                                                            justifyContent: 'center',
                                                            color: 'white',
                                                        }}
                                                    >
                                                        {item.initials}
                                                    </div>
                                                    <div style={{ flex: 1 }}>
                                                        <div>{item.name}</div>
                                                        <div style={{ fontSize: '0.8em', color: '#666' }}>{item.subject}, {item.role}</div>
                                                    </div>
                                                </div>
                                            </div>
                                        )}
                                    />
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}