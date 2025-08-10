import { useState, useEffect, useContext } from 'react';
import { data, useLocation, useNavigate } from 'react-router-dom';
import ElasticSearch from '../components/ElasticSearch';
// import { type Direction, fetchDirections } from '../api/directions';
import { AuthContext } from '../context/AuthContext';
import RegistrationLeftPart from '../components/RegistrationLeftPart';
import { roles, subjects, departments} from '../data/dataRegister';
import '../styles/Register.css';

export default function RegisterSecondPage() {
    // const [directions, setDirections] = useState<Direction[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [selectedRole, setSelectedRole] = useState<string>('');
    const [selectedSubject, setSelectedSubject] = useState<string>('');
    const [selectedDepartment, setSelectedDepartment] = useState<string>('');
    const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
    const [error, setError] = useState<string>('');


    const location = useLocation();
    const navigate = useNavigate();
    const auth = useContext(AuthContext)!;
    const formData = location.state as {
        last_name: string;
        first_name: string;
        email: string;
        password: string;
        passwordConfirm: string;
    };

    // useEffect(() => {
    //     if (!location.state) {
    //         navigate('/register');
    //     }
    // }, [location.state, navigate]);

    // useEffect(() => {
    //     setLoading(true);
    //     fetchDirections()
    //         .then(setDirections)
    //         .finally(() => setLoading(false));
    // }, []);

    const handleRoleSelect = (role: { displayText: string }) => {
        setSelectedRole(role.displayText);
        setSelectedSubject('');
        setSelectedDepartment('');
        setError('');
    };

    const handleSubjectSelect = (subject: { displayText: string }) => {
        setSelectedSubject(subject.displayText);
        setSelectedDepartment('');
        setError('');
    };

    const handleDepartmentSelect = (department: { displayText: string }) => {
        setSelectedDepartment(department.displayText);
        setError('');
    };

    const handleContinue = async () => {
        if (!selectedRole) {
            setError('Выберите роль');
            return;
        }

        if (selectedRole !== "Асессор ОКК" && !selectedSubject) {
            setError('Выберите предмет');
            return;
        }

        if (selectedRole !== "Руководитель предмета" && selectedRole !== "Менеджер чата") {
            if (!selectedDepartment) {
                setError('Выберите направление');
                return;
            }
        } 

        setIsSubmitting(true);
        try {
            await auth.register({ 
                ...formData, 
                role: selectedRole,
                subject: ["Руководитель предмета", "Менеджер чата"].includes(selectedRole) ? selectedSubject : null,
                department: selectedRole !== "Асессор ОКК" && !["Руководитель предмета", "Менеджер чата"].includes(selectedRole) ? selectedDepartment : null
            });
            navigate('/tasktracker');
        } catch (err: any) {
            if (err.response?.data?.email) {
                setError('Пользователь с таким email уже зарегистрирован');
            } 
            else if (err.response.status >= 500) {
                setError('Внутренняя ошибка сервера, повторите позже');
            }
            else {
                setError(err.message || 'Ошибка регистрации');
            }
        } finally {
            setIsSubmitting(false);
        }
    };
    
    return (
        <>
            <div className="wrapper">
                <RegistrationLeftPart />
                <div className="choosingRole_container">
                    <h2>Выберите вашу роль</h2>
                    <div className="role-container">
                            <ElasticSearch 
                            items={roles.map(r => ({
                                displayText: r
                            }))}
                            placeholder="Введите роль..."
                            backgroundcolor="#F8FAFC"
                            onItemClick={handleRoleSelect}
                        />
                        {selectedRole && selectedRole !== "Асессор ОКК" && (
                            <div style={{marginTop: '10px'}}>
                                <ElasticSearch 
                                    items={subjects.map(s => ({ displayText: s }))}
                                    placeholder="Введите предмет..."
                                    backgroundcolor="#F8FAFC"
                                    onItemClick={handleSubjectSelect}
                                    key={`subject-${selectedRole}`}
                                />
                            </div>
                        )}
                        {selectedSubject && selectedRole !== "Руководитель предмета" && selectedRole !== "Менеджер чата" && (
                            <div style={{marginTop: '10px'}}>
                                <ElasticSearch 
                                    items={departments.map(s => ({ displayText: s }))}
                                    placeholder="Введите направление..."
                                    backgroundcolor="#F8FAFC"
                                    onItemClick={handleSubjectSelect}
                                    key={`department-${selectedRole}`}
                                />
                            </div>
                        )}
                    </div>
                        {error && <div className="choosingRole-error-message">{error}</div>}

                        <button
                        type="button"
                        className="choosingRole_container_continue"
                        onClick={handleContinue}
                        disabled={isSubmitting}
                    >
                        {isSubmitting ? 'Загрузка...' : 'Продолжить'}
                    </button>
                </div>
            </div>
        </>
    );
}