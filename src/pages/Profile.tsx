import { useState, useContext } from 'react';
import Header from "../components/Header";
import '../styles/Profile.css';
import { AuthContext } from '../context/AuthContext';
import Loading from '../components/Loading';
import { Link } from 'react-router-dom';
import { updateUserProfile } from '../api/users'
import capitalize from '../utils/capitalize';


export default function Profile() {
    const auth = useContext(AuthContext)!;
    const user = auth.user;
    const [lastUpdated, setLastUpdated] = useState("");

    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [newPasswordConfirm, setNewPasswordConfirm] = useState('');

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isChangingPassword, setIsChangingPassword] = useState(false);
    const [error, setError] = useState<string>('');

    if (auth.loading || !auth.user) {
        return <Loading />
    }

    const handleChangePassword = () => {
        setError('');

        if (!currentPassword || !newPassword || !newPasswordConfirm) {
            setError('Заполните все поля для смены пароля');
            return;
        }

        if (newPassword.length < 8) {
            setError('Новый пароль должен содержать минимум 8 символов');
            return;
        }

        if (newPassword !== newPasswordConfirm) {
            setError('Новый пароль и подтверждение пароля не совпадают');
            return;
        }

        setIsChangingPassword(true);
        updateUserProfile({
            current_password: currentPassword,
            new_password: newPassword,
            new_password_confirm: newPasswordConfirm,
        })
            .catch((err) => {
                const data = (err as any)?.response?.data;
                if (data) {
                    const messages = Object.values(data).flat().join(' ');
                    setError(messages);
                } else {
                    setError('Не удалось сменить пароль');
                }
            })
            .finally(() => {
                setIsChangingPassword(false);
                setCurrentPassword('');
                setNewPassword('');
                setNewPasswordConfirm('');
            });
    };

    const handleLogoutClick = (e: React.MouseEvent) => {
        e.preventDefault();
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
    };
    const confirmLogout = () => {
        auth.logout();
        setIsModalOpen(false);

    };

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

    return (
        <>
            <Header onRefresh={handleRefresh} lastUpdated={lastUpdated} />
            <div className="profile-page">
                <div className='profile-page_title'>
                    <h1 className="page-title-2">Мой профиль</h1>
                    {user.is_admin && (
                        <Link to="/admin">
                            <button className='admin'>Админ</button>
                        </Link>
                    )}
                </div>
                <div className="userInfo-section">
                    <div className="profile-block">
                        <label>Имя</label>
                        <span>{user.first_name}</span>
                    </div>

                    <div className="profile-block">
                        <label>Фамилия</label>
                        <span>{user.last_name}</span>
                    </div>

                    <div className="profile-block">
                        <label>Email</label>
                        <span>{user.email}</span>
                    </div>

                    <div className="profile-block">
                        <label>Роль</label>
                        <span>{user.role}</span>
                    </div>

                    <div className="profile-block">
                        <label>Предмет</label>
                        <span>{capitalize(user.subject)}</span>
                    </div>

                    <div className="profile-block">
                        <label>Направление</label>
                        <span>{user.department}</span>
                    </div>
                </div>

                <div className="password-section">
                    <div className="password-block">
                        <label>Текущий пароль</label>
                        <input
                            className="password-field"
                            type="password"
                            value={currentPassword}
                            onChange={(e) => setCurrentPassword(e.target.value)}
                            placeholder="Введите текущий пароль"
                        />
                    </div>

                    <div className="password-block">
                        <label>Новый пароль</label>
                        <input
                            className="password-field"
                            type="password"
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                            placeholder="Введите новый пароль"
                        />
                    </div>

                    <div className="password-block">
                        <label>Повторите новый пароль</label>
                        <input
                            className="password-field"
                            type="password"
                            value={newPasswordConfirm}
                            onChange={(e) => setNewPasswordConfirm(e.target.value)}
                            placeholder="Повторите новый пароль"
                        />
                    </div>

                    <button
                        className="save-button"
                        onClick={handleChangePassword}
                        disabled={isChangingPassword}
                    >
                        {isChangingPassword ? 'сохранение...' : 'сохранить'}
                    </button>
                </div>

                {error && (
                    <div className="error-block" style={{ color: 'red', marginTop: '16px' }}>
                        {error}
                    </div>
                )}

                <div className="logout"
                    onClick={handleLogoutClick}
                >
                    <img src="../images/Arrow_Left_SM.svg" alt="Назад" />
                    <span>Выход из сервиса</span>
                </div>
            </div>

            {isModalOpen && (
                <div className="modal-overlay">
                    <div className="modal">
                        <img
                            src="../images/Close_MD.svg"
                            className="modal-close"
                            alt="Закрыть"
                            onClick={closeModal}
                        />
                        <p className="modal-text">Вы уверены, что хотите выйти?</p>
                        <div className="modal-buttons">
                            <button className="modal-ok"
                                onClick={confirmLogout}
                            >
                                ОК
                            </button>
                            <button className="modal-cancel"
                                onClick={closeModal}
                            >
                                Отмена
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}