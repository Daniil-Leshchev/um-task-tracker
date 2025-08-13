import { useState } from 'react';
import ElasticSearch from './ElasticSearch';
import '../styles/FormModal.css';
import {subjects, departments} from "../data/dataRegister";
import { users } from "../data/users";

type CuratorGroup = 'senior' | 'personal' | 'standard' | 'specific';
type SpecificCurator = string;

interface TaskData {
  title: string;
  description: string;
  deadline: number;
  reportFormat: string;
  subject: string;
  department: string;
  assignedTo: {
    groups: CuratorGroup[];
    specificCurator: SpecificCurator | null;
  };
}

interface CreateTaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreate: (task: TaskData) => void;
}


const CreateTaskModal = ({ isOpen, onClose, onCreate }: CreateTaskModalProps) => {
  const [step, setStep] = useState(1);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [deadline, setDeadline] = useState('');
  const [reportFormat, setReportFormat] = useState('');
  const [subject, setSubject] = useState('');
  const [department, setDepartment] = useState('');
  const [selectedGroups, setSelectedGroups] = useState<CuratorGroup[]>([]);
  const [specificCurator, setSpecificCurator] = useState('');
  const [selectedCurators, setSelectedCurators] = useState<string[]>([]);

const curators = users.filter(user => 
    user.role.includes('куратор')
  );


  const curatorGroups = [
    { id: 'senior', label: 'Старшие кураторы' },
    { id: 'personal', label: 'Личные кураторы' },
    { id: 'standard', label: 'Стандарт-кураторы' },
    { id: 'specific', label: 'Конкретный куратор' }
  ] as const;;

  if (!isOpen) return null;

  const handleSubmitStep1 = (e) => {
    e.preventDefault();
    setStep(2);
  };

    const handleSubmitStep2 = (e: React.FormEvent) => {
    e.preventDefault();
    const newTask: TaskData = {
        title,
        description,
        deadline: new Date(deadline).getTime(),
        reportFormat,
        subject,
        department,
        assignedTo: {
        groups: selectedGroups,
        specificCurator: selectedGroups.includes('specific') 
            ? selectedCurators.join(', ') 
            : null
        }
    };
    onCreate(newTask);
    resetForm();
    onClose();
    };

  const resetForm = () => {
    setTitle('');
    setDescription('');
    setDeadline('');
    setReportFormat('');
    setSubject('');
    setDepartment('');
    setSelectedGroups([]);
    setSpecificCurator('');
    setStep(1);
  };

  const handleCuratorSelect = (curatorId: string) => {
    setSelectedCurators(prev => 
      prev.includes(curatorId) 
        ? prev.filter(id => id !== curatorId) 
        : [...prev, curatorId]
    );
  };

  const handleGroupToggle = (groupId: CuratorGroup) => {
    if (groupId === 'specific') {
      setSelectedGroups(selectedGroups.includes('specific') ? [] : ['specific']);
    } else {
      if (selectedGroups.includes('specific')) {
        setSelectedGroups([groupId]);
      } else {
        if (selectedGroups.includes(groupId)) {
          setSelectedGroups(selectedGroups.filter(id => id !== groupId));
        } else {
          setSelectedGroups([...selectedGroups, groupId]);
        }
      }
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content create-task-modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>{step === 1 ? 'Создание новой задачи' : 'Назначение задачи'}</h2>
          <button className="modal-close" onClick={onClose}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>

        {step === 1 ? (
          <form onSubmit={handleSubmitStep1} className="task-form">
            <div className="form-group">
              <label htmlFor="title">Название задачи</label>
              <input
                id="title"
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
                placeholder="Введите название задачи"
              />
            </div>

            <div className="form-group">
              <label htmlFor="description">Описание задачи</label>
              <textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Опишите детали задачи"
                required
                rows={3}
              />
            </div>

            <div className="form-group">
              <label htmlFor="deadline">Дедлайн</label>
              <input
                id="deadline"
                type="datetime-local"
                value={deadline}
                onChange={(e) => setDeadline(e.target.value)}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="reportFormat">Формат отчета</label>
              <input
                id="reportFormat"
                type="text"
                value={reportFormat}
                onChange={(e) => setReportFormat(e.target.value)}
                placeholder="Введите требуемый формат отчета"
                required
              />
            </div>

            <div className="form-actions">
              <button type="button" className="cancel-btn" onClick={onClose}>
                Отмена
              </button>
              <button type="submit" className="submit-btn">
                Далее
              </button>
            </div>
          </form>
        ) : (
          <form onSubmit={handleSubmitStep2} className="task-form">
            <div className="subject-selection">
              <h3>Выберите предмет:</h3>
              
              <div className="form-group_elastic">
                <ElasticSearch
                  items={subjects.map(s => ({ displayText: s }))}
                  backgroundcolor="white"
                  placeholder="Поиск предмета..."
                  onItemClick={(item) => setSubject(item.displayText)}
                />
              </div>
              <h3>Выберите направление:</h3>

              <div className="form-group_elastic">
                <ElasticSearch
                  items={departments.map(s => ({ displayText: s }))}
                  backgroundcolor="white"
                  placeholder="Поиск направления..."
                  onItemClick={(item) => setDepartment(item.displayText)}
                />
              </div>

              <div className="curator-selection">
                <h3>Выберите, кому назначить задачу:</h3>
                
                <div className="curator-options">
                  {curatorGroups.map(group => (
                    <div key={group.id} className="curator-option">
                      <label>
                        <input
                          type="checkbox"
                          checked={selectedGroups.includes(group.id)}
                          onChange={() => handleGroupToggle(group.id)}
                          disabled={
                            group.id !== 'specific' && 
                            selectedGroups.includes('specific') ||
                            group.id === 'specific' && 
                            selectedGroups.length > 0 && 
                            !selectedGroups.includes('specific')
                          }
                        />
                        {group.label}
                      </label>
                    </div>
                  ))}
                </div>

                {selectedGroups.includes('specific') && (
                  <div className="specific-curator">
                    <h3>Выберите куратора(ов):</h3>
                    <div>
                      <ElasticSearch
                        items={curators.map(curator => ({
                          id: curator.id.toString(),
                          displayText: `${curator.name} ${curator.surname} (${curator.role})`,
                          name: `${curator.name} ${curator.surname}`,
                          initials: curator.initials,
                          color: curator.color,
                          type: curator.role
                        }))}
                        backgroundcolor="white"
                        placeholder="Поиск куратора..."
                        isMultiSelect={true}
                        selectedItems={selectedCurators}
                        keepListVisible={true}
                        disableInputCapture={true}
                        renderItem={(item) => (
                          <div style={{ 
                            display: 'flex', 
                            alignItems: 'center', 
                            gap: '15px',
                            padding: '8px',
                            borderRadius: '4px'
                          }}>
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
                              <div style={{ fontSize: '0.8em', color: '#666' }}>{item.type}</div>
                            </div>
                          </div>
                        )}
                        onItemClick={(item) => handleCuratorSelect(item.id)}
                      />
                    </div>
                  </div>
                )}
              </div>

              <div className="form-actions">
                <button 
                  type="button" 
                  className="cancel-btn" 
                  onClick={() => setStep(1)}
                >
                  Назад
                </button>
                <button 
                  type="submit" 
                  className="submit-btn"
                  disabled={selectedGroups.length === 0 || !subject || !department || (selectedGroups.includes('specific') && selectedCurators.length === 0)}
                >
                  Создать задачу
                </button>
              </div>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default CreateTaskModal;