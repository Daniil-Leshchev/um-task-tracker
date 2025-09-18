import { useEffect, useState } from 'react';
import { createTask, type CreateTaskIndividualPayload, type CreateTaskGroupPayload } from '../api/tasks';
import ElasticSearch from './ElasticSearch';
import '../styles/FormModal.css';
import { fetchSubjects, fetchDepartments } from '../api/catalogs';
import { fetchAssignmentPolicy, fetchAssignableCurators, type AssignableCurator, type AssignmentPolicy } from '../api/assignment';
import getInitials from "../utils/getInitials";
import getAvatarColor from "../utils/getAvatarColor";

type DeliveryAssignment = {
  assignment_id: number;
  status: 'sent' | 'partially_sent' | 'failed';
  undelivered: string[];
  error: string | null;
};

type DeliverySummary = {
  total: number;
  sent: number;
  partial: number;
  failed: number;
};

type CreateTaskResponse = {
  id_task: string;
  assignments: DeliveryAssignment[];
  summary: DeliverySummary;
  ok: boolean;
  undelivered_all: string[];
  bot_unavailable: boolean;
};

type CuratorGroup = 'senior' | 'personal' | 'standard' | 'specific';

interface TaskData {
  title: string;
  description: string;
  deadline: number;
  reportFormat: string;
  subject: string;
  department: string;
  assignedTo: {
    groups: CuratorGroup[];
    specificCurator: string | null;
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
  const [selectedGroups, setSelectedGroups] = useState<CuratorGroup[]>([]);
  const [selectedCurators, setSelectedCurators] = useState<string[]>([]);

  const [subjectId, setSubjectId] = useState<number | null>(null);
  const [departmentIds, setDepartmentIds] = useState<number[]>([]);
  const [subjectsList, setSubjectsList] = useState<{ id_subject: number; subject: string; }[]>([]);
  const [departmentsList, setDepartmentsList] = useState<{ id_department: number; department: string; }[]>([]);

  const norm = (s: string) => s.trim().toLowerCase().replace(/\s+/g, '');
  const findBy = (pred: (name: string) => boolean) =>
    departmentsList.find(d => pred(norm(d.department)))?.id_department;

  const ogeId = findBy(name => name.includes('огэ'));
  const tenId = findBy(name => name.includes('10кл'));

  const departmentItems: Array<{ id: number; displayText: string; ids?: number[] }> = (() => {
    const base = departmentsList
      .filter(d => norm(d.department) !== 'окк')
      .filter(d => {
        const n = norm(d.department);
        const isOGE = n.includes('огэ');
        const isTen = n.includes('10класс') || n.includes('10кл') || n === '10';
        return !isOGE && !isTen;
      })
      .map(d => ({ id: d.id_department, displayText: d.department }));

    if (ogeId && tenId) {
      return [{ id: ogeId, displayText: 'ОГЭ/10кл', ids: [ogeId, tenId] }, ...base];
    }
    return base;
  })();

  const [assignable, setAssignable] = useState<AssignableCurator[]>([]);
  const [assignableLoading, setAssignableLoading] = useState(false);

  const [policy, setPolicy] = useState<AssignmentPolicy | null>(null);
  const [policyLoading, setPolicyLoading] = useState(false);

  const isOKK = policy?.defaults?.role_id === 8;

  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const [delivery, setDelivery] = useState<CreateTaskResponse | null>(null);


  useEffect(() => {
    if (!isOpen) return;
    let cancelled = false;
    (async () => {
      try {
        setPolicyLoading(true);
        const p = await fetchAssignmentPolicy();
        if (!cancelled) setPolicy(p);
      } catch {
        if (!cancelled) setPolicy(null);
      } finally {
        if (!cancelled) setPolicyLoading(false);
      }
    })();
    return () => { cancelled = true; };
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) return;
    let cancelled = false;
    (async () => {
      try {
        const [subs, deps] = await Promise.all([
          fetchSubjects(),
          fetchDepartments(),
        ]);
        if (!cancelled) {
          setSubjectsList(subs);
          setDepartmentsList(deps);
        }
      } catch {
        if (!cancelled) {
          setSubjectsList([]);
          setDepartmentsList([]);
        }
      }
    })();
    return () => { cancelled = true; };
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen || !policy) return;

    if (isOKK) {
      setSelectedGroups(['specific']);
    } else {
      setSelectedGroups([]);
    }
    if (policy) {
      if (policy.can_pick_subject === false) setSubjectId(policy.defaults?.subject_id ?? null);
      if (policy.can_pick_department === false) {
        const defDept = policy.defaults?.department_id;
        setDepartmentIds(typeof defDept === 'number' ? [defDept] : []);
      }
    }
  }, [isOpen, policy, isOKK]);

  useEffect(() => {
    if (!isOpen || !policy) return;
    if (!selectedGroups.includes('specific')) return;

    const subj =
      isOKK
        ? undefined
        : (policy.can_pick_subject === false
          ? (policy?.defaults?.subject_id ?? undefined)
          : (subjectId ?? undefined));

    let deptIds: number[] = [];
    if (!isOKK) {
      if (policy.can_pick_department === false) {
        const def = policy?.defaults?.department_id;
        if (typeof def === 'number') deptIds = [def];
      } else {
        deptIds = departmentIds;
      }
    }

    const roleIds =
      policy.allowed_recipient_role_ids && policy.allowed_recipient_role_ids.length
        ? policy.allowed_recipient_role_ids
        : undefined;

    let cancelled = false;
    (async () => {
      try {
        setAssignableLoading(true);

        if (deptIds.length === 0) {
          const data = await fetchAssignableCurators({
            subject_id: subj,
            department_id: undefined,
            role_ids: roleIds,
          });
          if (!cancelled) setAssignable(data);
          return;
        }

        const chunks = await Promise.all(
          deptIds.map(did =>
            fetchAssignableCurators({
              subject_id: subj,
              department_id: did,
              role_ids: roleIds,
            })
          )
        );
        const merged = new Map<string, AssignableCurator>();
        for (const arr of chunks) {
          for (const c of arr) merged.set(c.email, c);
        }
        if (!cancelled) setAssignable(Array.from(merged.values()));
      } catch {
        if (!cancelled) setAssignable([]);
      } finally {
        if (!cancelled) setAssignableLoading(false);
      }
    })();

    return () => { cancelled = true; };
  }, [isOpen, policy, selectedGroups, subjectId, departmentIds, isOKK, ogeId, tenId]);


  const ROLE_ID_TO_GROUP: Record<number, CuratorGroup> = {
    1: 'standard',
    2: 'senior',
    3: 'personal',
  };

  const filteredCuratorGroups = (() => {
    if (isOKK) {
      return ([{ id: 'specific', label: 'Конкретный куратор' }] as const);
    }

    const base = [
      { id: 'senior', label: 'Старшие кураторы' },
      { id: 'personal', label: 'Личные кураторы' },
      { id: 'standard', label: 'Стандарт-кураторы' },
    ] as const;

    const allowedSet = new Set(
      (policy?.allowed_recipient_role_ids || [])
        .map((rid) => ROLE_ID_TO_GROUP[rid])
        .filter(Boolean) as CuratorGroup[]
    );

    const result = base.filter((g) =>
      allowedSet.size ? allowedSet.has(g.id as CuratorGroup) : true
    );

    return ([...result, { id: 'specific', label: 'Конкретный куратор' }] as const);
  })();

  if (!isOpen) return null;

  const handleSubmitStep1 = (e: React.FormEvent) => {
    e.preventDefault();
    setStep(2);
  };

  const handleSubmitStep2 = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const base = {
        deadline: new Date(deadline).toISOString(),
        name: title,
        description,
        report: reportFormat,
      };

      let resp: any;

      if (selectedGroups.includes('specific')) {
        const payload: CreateTaskIndividualPayload = {
          ...base,
          emails: selectedCurators,
        };

        setSubmitting(true);
        setSubmitError(null);
        resp = await createTask(payload);
      } else {
        const effectiveSubjectId =
          (policy?.can_pick_subject === false)
            ? (policy?.defaults?.subject_id ?? undefined)
            : (subjectId ?? undefined);

        const effectiveDepartmentIds =
          (policy?.can_pick_department === false)
            ? ((typeof policy?.defaults?.department_id === 'number') ? [policy!.defaults!.department_id!] : [])
            : departmentIds;

        const GROUP_TO_ROLE_ID: Record<CuratorGroup, number | null> = {
          standard: 1,
          senior: 2,
          personal: 3,
          specific: null
        };

        let roleIds = selectedGroups
          .filter(g => g !== 'specific')
          .map(g => GROUP_TO_ROLE_ID[g]!)
          .filter((v): v is number => typeof v === 'number');

        if (policy?.allowed_recipient_role_ids?.length) {
          roleIds = roleIds.filter(rid => policy!.allowed_recipient_role_ids!.includes(rid));
        }

        const payload: CreateTaskGroupPayload = {
          ...base,
          subject_id: effectiveSubjectId,
          department_ids: effectiveDepartmentIds,
          ...(roleIds.length ? { role_ids: roleIds } : {})
        };

        setSubmitting(true);
        setSubmitError(null);
        resp = await createTask(payload);
      }

      const response = resp as unknown as CreateTaskResponse;

      setDelivery(response);

      const departmentLabel =
        (departmentIds.length === 2 && ((departmentIds.includes(ogeId || -1)) && (departmentIds.includes(tenId || -1))))
          ? 'ОГЭ/10кл'
          : (departmentsList.find(d => d.id_department === departmentIds[0])?.department || '');
      const newTask: TaskData = {
        title,
        description,
        deadline: new Date(deadline).getTime(),
        reportFormat,
        subject: subjectsList.find(s => s.id_subject === subjectId)?.subject || '',
        department: departmentLabel,
        assignedTo: {
          groups: selectedGroups,
          specificCurator: selectedGroups.includes('specific')
            ? selectedCurators.join(', ')
            : null
        }
      };

      onCreate(newTask);

      const fullyOk = response && response.ok && !response.bot_unavailable && response.summary.failed === 0 && response.summary.partial === 0;
      if (fullyOk) {
        resetForm();
        onClose();
      }
    } catch (err: any) {
      setSubmitError(err?.response?.data?.detail || 'Не удалось создать задачу');
      setDelivery(null);
    } finally {
      setSubmitting(false);
    }
  };

  const resetForm = () => {
    setTitle('');
    setDescription('');
    setDeadline('');
    setReportFormat('');
    setSubjectId(null);
    setDepartmentIds([]);
    setSelectedGroups([]);
    setDelivery(null);
    setStep(1);
  };

  const handleCuratorSelect = (curatorMail: string) => {
    setDelivery(null);
    setSelectedCurators(prev =>
      prev.includes(curatorMail)
        ? prev.filter(id => id !== curatorMail)
        : [...prev, curatorMail]
    );
  };

  const handleGroupToggle = (groupId: CuratorGroup) => {
    setDelivery(null);
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
      <div className="create-task-modal" onClick={(e) => e.stopPropagation()}>
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
              {(policy?.can_pick_subject ?? true) && (
                <>
                  <h3>Выберите предмет:</h3>
                  <div className="form-group_elastic">
                    <ElasticSearch
                      items={subjectsList.map(s => ({ id: s.id_subject, displayText: s.subject }))}
                      backgroundcolor="white"
                      placeholder={policyLoading ? 'Загрузка...' : 'Поиск предмета...'}
                      onItemClick={(item) => { setDelivery(null); setSubjectId(item.id as number); }}
                    />
                  </div>
                </>
              )}
              {(policy?.can_pick_department ?? true) && (
                <>
                  <h3>Выберите направление:</h3>
                  <div className="form-group_elastic">
                    <ElasticSearch
                      items={departmentItems}
                      backgroundcolor="white"
                      placeholder={policyLoading ? 'Загрузка...' : 'Поиск направления...'}
                      onItemClick={(item) => {
                        setDelivery(null);
                        const ids = (item as any).ids as number[] | undefined;
                        setDepartmentIds(ids ? ids : [item.id as number]);
                      }}
                    />
                  </div>
                </>
              )}

              <div className="curator-selection">
                <h3>Выберите, кому назначить задачу:</h3>

                <div className="curator-options">
                  {filteredCuratorGroups.map(group => (
                    <div key={group.id} className="curator-option">
                      <label>
                        <input
                          type="checkbox"
                          checked={isOKK ? group.id === 'specific' : selectedGroups.includes(group.id)}
                          onChange={() => (isOKK ? null : handleGroupToggle(group.id))}
                          disabled={
                            isOKK ||
                            (group.id !== 'specific' && selectedGroups.includes('specific')) ||
                            (group.id === 'specific' && selectedGroups.length > 0 && !selectedGroups.includes('specific'))
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
                        items={assignable.map((c: AssignableCurator) => ({
                          id: c.email,
                          displayText: `${c.name} (${c.role_name})`,
                          name: c.name,
                          initials: getInitials(c.name),
                          color: getAvatarColor(c.email),
                          role: c.role_name,
                        }))}
                        backgroundcolor="white"
                        placeholder={assignableLoading ? 'Загрузка...' : 'Поиск куратора...'}
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
                              <div style={{ fontSize: '0.8em', color: '#666' }}>{item.role}</div>
                            </div>
                          </div>
                        )}
                        onItemClick={(item) => handleCuratorSelect(item.id as string)}
                      />
                    </div>
                  </div>
                )}
              </div>

              {/* {delivery && (
                <div className="delivery-result" style={{marginTop: '12px', padding: '12px', border: '1px solid #eee', borderRadius: 8, background: '#fafafa'}}>
                  {delivery.bot_unavailable ? (
                    <div style={{color: '#c0392b', fontWeight: 600}}>
                      Бот недоступен. Сообщения не отправлены. Попробуйте позже.
                    </div>
                  ) : (
                    <>
                      {delivery.summary.failed > 0 || delivery.summary.partial > 0 ? (
                        <div style={{marginBottom: 8}}>
                          <div style={{fontWeight: 600}}>Не доставлено ({delivery.undelivered_all.length}):</div>
                          {delivery.undelivered_all.length ? (
                            <ul style={{margin: '6px 0 0 18px'}}>
                              {delivery.undelivered_all.map((name, idx) => (
                                <li key={idx}>{name}</li>
                              ))}
                            </ul>
                          ) : (
                            <div>Список пуст.</div>
                          )}
                        </div>
                      ) : (
                        <div style={{color: '#2e7d32', fontWeight: 600}}>Все сообщения доставлены.</div>
                      )}

                    </>
                  )}
                </div>
              )} */}
              {submitError && <div className="form-error">{submitError}</div>}
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
                  disabled={
                    selectedGroups.length === 0 ||
                    (((policy?.can_pick_subject ?? true) && subjectId === null) ||
                      ((policy?.can_pick_department ?? true) && departmentIds.length === 0)) ||
                    (selectedGroups.includes('specific') && selectedCurators.length === 0) ||
                    submitting
                  }
                >
                  {submitting ? 'Создание...' : 'Создать задачу'}
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