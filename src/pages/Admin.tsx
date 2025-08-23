import Header from "../components/Header";
import "../styles/Admin.css";
import ElasticSearch from "../components/ElasticSearch";
import { fetchAdminListUsers, confirmUser, deleteUser, fetchMentorsForAssignment, assignMentor, MentorShort } from "../api/users";
import { useState, useContext, useEffect } from 'react';
import { AuthContext } from "../context/AuthContext";
import { Navigate } from "react-router-dom";
import type { AdminListUser as User } from "../api/users";
import capitalize from "../utils/capitalize";
import getInitials from "../utils/getInitials";
import getAvatarColor from "../utils/getAvatarColor";

interface AdminListUserItem {
    id: number;
    displayText: string;
    name: string;
    initials: string;
    color: string;
    role: string;
    isManager: boolean;
    subject: string;
    department: string;
    needConfirmation: boolean;
    mentorName: string | null;
}

export default function Admin() {
    const auth = useContext(AuthContext)!;
    const user = auth.user;
    const [lastUpdated, setLastUpdated] = useState("");
    const [selectedUser, setselectedUser] = useState<AdminListUserItem | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isUserConfirmed, setIsUserConfirmed] = useState(false);
    const [selectedMentor, setSelectedMentor] = useState<User | null>(null);
    const [isDeleting, setIsDeleting] = useState(false);
    const [adminUsers, setAdminListUsers] = useState<User[]>([]);
    const [mentorsForSelected, setMentorsForSelected] = useState<MentorShort[]>([]);
    const [loadingMentors, setLoadingMentors] = useState(false);

    const refreshUsers = async () => {
        const data = await fetchAdminListUsers();
        setAdminListUsers(data);
    };

    useEffect(() => {
        refreshUsers();
    }, []);


    const items: AdminListUserItem[] = adminUsers.map(u => ({
        id: u.id_tg,
        displayText: `${u.name} (${u.role})`,
        name: u.name,
        initials: getInitials(u.name),
        color: getAvatarColor(u.id_tg),
        role: u.role,
        isManager: u.is_manager,
        subject: u.subject,
        department: u.department,
        needConfirmation: u.need_confirmation,
        mentorName: u.mentor_name,
    }));

    if (!auth.loading && !user.is_admin) {
        return <Navigate to="/tasktracker" replace />;
    }

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

    const handleEditClick = async (user: AdminListUserItem) => {
        setIsUserConfirmed(false);
        setselectedUser(user);
        setIsModalOpen(true);

        setLoadingMentors(true);
        try {
            const mentors = await fetchMentorsForAssignment({ target_id_tg: user.id });
            setMentorsForSelected(mentors);
        } finally {
            setLoadingMentors(false);
        }
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setSelectedMentor(null);
        setIsUserConfirmed(false);
    };

    const handleDeleteUser = async () => {
        if (!selectedUser) return;
        try {
            setIsDeleting(true);
            await deleteUser(selectedUser.id);
            setAdminListUsers(prev => prev.filter(u => u.id_tg !== selectedUser.id));
            closeModal();
        } catch (err) {
        } finally {
            setIsDeleting(false);
        }
        closeModal()
    }

    const handleConfirm = async () => {
        if (!selectedUser) return;

        if (!selectedUser.needConfirmation) {
            closeModal();
            return;
        }
        try {
            setIsUserConfirmed(true);
            await confirmUser(selectedUser.id);
            await refreshUsers();
        } catch (e) {
        } finally {
            setIsUserConfirmed(false);
            closeModal();
        }
    };

    const handleMentorSelect = async (mentor: MentorShort) => {
        if (!selectedUser) return;
        try {
            await assignMentor((selectedUser as AdminListUserItem).id, mentor.id_tg);
            await refreshUsers();
            setSelectedMentor(mentor as any);
            closeModal();
        } catch (e) {
        }
    };

    return (
        <>
            <Header onRefresh={handleRefresh} lastUpdated={lastUpdated} />
            <div className="wrapper">
                <h1>Все пользователи</h1>
                <div className="elastic-container">
                    <ElasticSearch
                        items={items}
                        backgroundcolor="inherit"
                        placeholder="Поиск куратора..."
                        keepListVisible={true}
                        disableInputCapture={true}
                        renderItem={(item: AdminListUserItem) => (
                            <div style={{
                                display: 'flex',
                                alignItems: 'center',
                                padding: '8px',
                                borderRadius: '4px',
                                paddingRight: '30px'
                            }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '15px', marginRight: 'auto' }}>
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
                                        <div style={{ fontSize: '0.8em', color: '#666' }}>{capitalize(item.subject || '')}, {item.role}, {item.department || ''}</div>
                                    </div>
                                </div>
                                {!item.needConfirmation && item.mentorName && (
                                    <span style={{
                                        fontSize: '0.7em',
                                        fontWeight: 'bold',
                                        marginRight: '20px'
                                    }}>
                                        Наставник: {item.mentorName}
                                    </span>
                                )}
                                {item.needConfirmation && (
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
                                        style={{ backgroundColor: isUserConfirmed ? '#4abc50ff' : '#15bf7ef7', }}
                                    >
                                        Да
                                    </button>
                                    <button
                                        className="cancel-button"
                                        onClick={handleDeleteUser}
                                        disabled={isUserConfirmed}
                                        style={{ cursor: (isUserConfirmed || isDeleting) ? 'not-allowed' : 'pointer' }}
                                    >
                                        Нет
                                    </button>
                                </div>
                            </div>
                            {!selectedUser.isManager && (
                                <div className="modal-section">
                                    <p className="mentor-select">Определите наставника для куратора:</p>
                                    <ElasticSearch
                                        items={mentorsForSelected.map(m => ({
                                            id: m.id_tg,
                                            displayText: m.name,
                                            name: m.name,
                                            role: m.role,
                                            initials: getInitials(m.name),
                                            color: getAvatarColor(m.id_tg),
                                            subject: m.subject ?? '',
                                        }))}
                                        backgroundcolor="white"
                                        placeholder="Введите имя наставника..."
                                        keepListVisible={true}
                                        onItemClick={(item) => {
                                            const m = mentorsForSelected.find(mm => mm.id_tg === item.id);
                                            if (m) handleMentorSelect(m);
                                        }}
                                        renderItem={(item) => (
                                            <div style={{
                                                display: 'flex',
                                                alignItems: 'center',
                                                padding: '8px',
                                                borderRadius: '4px',
                                                justifyContent: 'space-between',
                                                paddingRight: '30px'
                                            }}>
                                                <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
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
                                                        <div style={{ fontSize: '0.8em', color: '#666' }}>{capitalize(item.subject || '')}, {item.role}</div>
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