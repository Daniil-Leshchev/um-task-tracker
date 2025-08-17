import { useState, useContext, useEffect } from 'react';
import Header from "../components/Header";
import '../styles/Profile.css';
import { AuthContext } from '../context/AuthContext';
import Loading from '../components/Loading';
import { Link } from 'react-router-dom';

export default function Profile() {
    // const auth = useContext(AuthContext)!;
    const [lastUpdated, setLastUpdated] = useState("");

    const [firstName, setFirstName] = useState<string>('');
    const [lastName, setLastName] = useState<string>('');
    const [email, setEmail] = useState<string>('');

    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [newPasswordConfirm, setNewPasswordConfirm] = useState('');

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isSavingProfile, setIsSavingProfile] = useState(false);
    const [isChangingPassword, setIsChangingPassword] = useState(false);
    const [error, setError] = useState<string>('');

    // const handleSaveProfile = () => {
    //   setError('');
    //   setIsSavingProfile(true);
    //   updateUserProfile({
    //     first_name: firstName,
    //     last_name: lastName,
    //     patronymic: patronymic,
    //     academic_group: academicGroup || '',
    //     email: email,
    //   })
    //     .catch(err => {
    //       const data = err.response?.data;
    //       if (data) {
    //         const messages = Object.values(data).flat().join(' ');
    //         setError(messages);
    //       } else {
    //         setError('Не удалось обновить профиль');
    //       }
    //     })
    //     .finally(() => {
    //       setIsSavingProfile(false);
    //     });
    // };

    // const handleChangePassword = () => {
    //   setError('');
    //   if (newPassword !== newPasswordConfirm) {
    //     setError('Новый пароль и подтверждение пароля не совпадают');
    //     return;
    //   }
    //   setIsChangingPassword(true);
    //   updateUserProfile({
    //     current_password: currentPassword,
    //     new_password: newPassword,
    //     new_password_confirm: newPasswordConfirm,
    //   })
    //     .catch(err => {
    //       const data = err.response?.data;
    //       if (data) {
    //         const messages = Object.values(data).flat().join(' ');
    //         setError(messages);
    //       } else {
    //         setError('Не удалось сменить пароль');
    //       }
    //     })
    //     .finally(() => {
    //       setIsChangingPassword(false);
    //       setCurrentPassword('');
    //       setNewPassword('');
    //       setNewPasswordConfirm('');
    //     });
    // };

    // const handleLogoutClick = (e: React.MouseEvent) => {
    //     e.preventDefault();
    //     setIsModalOpen(true);
    // };

    // const closeModal = () => {
    //     setIsModalOpen(false);
    // };
    // const confirmLogout = () => {
    //     auth.logout();
    //     setIsModalOpen(false);

    // };

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
                <Link to="/admin">
                    <button className='admin'>
                        Админ
                    </button>
                </Link>
            </div>
            <div className="userInfo-section">
                <div className="profile-block">
                    <label>Имя</label>
                    <span>Анна</span>
                </div>
                
                <div className="profile-block">
                    <label>Фамилия</label>
                    <span>Петрова</span>
                </div>

                <div className="profile-block">
                    <label>Email</label>
                    <span>anuta@mail.ru</span>
                </div>

                <div className="profile-block">
                    <label>Роль</label>
                    <span>Личный куратор</span>
                </div>

                <div className="profile-block">
                    <label>Предмет</label>
                    <span>Математика</span>
                </div>

                <div className="profile-block">
                    <label>Направление</label>
                    <span>ЕГЭ</span>
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
                //   onClick={handleChangePassword}
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
            // onClick={handleLogoutClick}
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
                        // onClick={closeModal}
                    />
                    <p className="modal-text">Вы уверены, что хотите выйти?</p>
                    <div className="modal-buttons">
                        <button className="modal-ok" 
                        // onClick={confirmLogout}
                        >
                        ОК
                        </button>
                        <button className="modal-cancel" 
                        // onClick={closeModal}
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