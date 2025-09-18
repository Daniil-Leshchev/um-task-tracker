import { useState, useEffect, useContext } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import ElasticSearch from '../components/ElasticSearch';
import { AuthContext } from '../context/AuthContext';
import RegistrationLeftPart from '../components/RegistrationLeftPart';
import { fetchRoles, fetchSubjects, fetchDepartments } from '../api/catalogs';
import { isAxiosError } from 'axios';

export default function RegisterSecondPage() {
    const [loading, setLoading] = useState<boolean>(true);
    const [roles, setRoles] = useState<Array<{ id: number; name: string }>>([]);
    const [subjects, setSubjects] = useState<Array<{ id: number; name: string }>>([]);
    const [departments, setDepartments] = useState<Array<{ id: number; name: string }>>([]);
    const [selectedRoleId, setSelectedRoleId] = useState<number | null>(null);
    const [selectedRoleLabel, setSelectedRoleLabel] = useState<string>('');
    const [selectedSubjectId, setSelectedSubjectId] = useState<number | null>(null);
    const [selectedSubjectLabel, setSelectedSubjectLabel] = useState<string>('');
    const [selectedDepartmentId, setSelectedDepartmentId] = useState<number | null>(null);
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

    useEffect(() => {
        if (!location.state) {
            navigate('/register');
        }
    }, [location.state, navigate]);

    useEffect(() => {
        let mounted = true;
        (async () => {
            try {
                setLoading(true);
                const [r, s, d] = await Promise.all([
                    fetchRoles(),
                    fetchSubjects(),
                    fetchDepartments(),
                ]);
                if (!mounted) return;
                setRoles(r.map(it => ({ id: it.id_role, name: it.role })));
                setSubjects(s.map(it => ({ id: it.id_subject, name: it.subject})));
                setDepartments(d.map(it => ({ id: it.id_department, name: it.department })));
            } catch (err) {
                console.error('Failed to load catalogs', err);
                setError('Не удалось загрузить справочники');
            } finally {
                if (mounted) setLoading(false);
            }
        })();
        return () => { mounted = false; };
    }, []);

    const handleRoleSelect = (role: { displayText: string; id?: number }) => {
        setSelectedRoleId(role.id ?? null);
        setSelectedRoleLabel(role.displayText);
        setError('');
    };

    const handleSubjectSelect = (subject: { displayText: string; id?: number }) => {
        setSelectedSubjectId(subject.id ?? null);
        setSelectedSubjectLabel(subject.displayText);
        setSelectedDepartmentId(null);
        setError('');
    };

    const handleDepartmentSelect = (department: { displayText: string; id?: number }) => {
        setSelectedDepartmentId(department.id ?? null);
        setError('');
    };

    const handleContinue = async () => {
        if (!selectedRoleId) {
            setError('Выберите роль');
            return;
        }
        if (!selectedSubjectId) {
            setError('Выберите предмет');
            return;
        }
        if (!selectedDepartmentId) {
            setError('Выберите направление');
            return;
        }

        setIsSubmitting(true);
        try {
            await auth.register({ 
                ...formData, 
                role_id: selectedRoleId,
                subject_id: selectedSubjectId,
                department_id: selectedDepartmentId,
                name: `${formData.first_name} ${formData.last_name}`,
            });
            navigate('/tasktracker');
        } catch (err: unknown) {
            if (isAxiosError(err)) {
                const status = err.response?.status;
                const data: any = err.response?.data;
                if (data?.email) {
                    setError('Пользователь с таким email уже зарегистрирован');
                } else if (status && status >= 500) {
                    setError('Внутренняя ошибка сервера, повторите позже');
                } else {
                    setError(data?.detail || data?.message || err.message || 'Ошибка регистрации');
                }
            } else {
                setError((err as Error)?.message || 'Ошибка регистрации');
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
                            items={roles.map(r => ({ displayText: r.name, id: r.id }))}
                            placeholder="Введите роль..."
                            backgroundcolor="#F8FAFC"
                            onItemClick={handleRoleSelect}
                        />
                        <div style={{marginTop: '10px'}}>
                            <ElasticSearch 
                                items={subjects.map(s => ({ displayText: s.name, id: s.id }))}
                                placeholder="Введите предмет..."
                                backgroundcolor="#F8FAFC"
                                onItemClick={handleSubjectSelect}
                                key={`subject-${selectedRoleLabel || 'any'}`}
                            />
                        </div>
                        <div style={{marginTop: '10px'}}>
                            <ElasticSearch 
                                items={departments.map(d => ({ displayText: d.name, id: d.id }))}
                                placeholder="Введите направление..."
                                backgroundcolor="#F8FAFC"
                                onItemClick={handleDepartmentSelect}
                                key={`department-${selectedRoleId || 'any'}`}
                            />
                        </div>
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