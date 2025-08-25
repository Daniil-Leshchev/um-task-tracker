import api from './client';

export type Scope = 'all' | 'group' | 'individual';

export type FetchTasksParams = {
    scope?: Scope;
    subjectId?: number | null;
    departmentId?: number | null;
    status?: string | null;
    query?: string | null;
};

export type TaskCard = {
    id: string;
    title: string;
    status: 'Завершено' | 'В процессе' | 'Не начато';
    progress: number;
    completed: number;
    total: number;
    notCompleted: number;
    deadline: string;
    created: string;
    description: string;
    sampleCurators: string[];
};

export async function fetchTasks(params: FetchTasksParams = {}): Promise<TaskCard[]> {
    const {
        scope = 'all',
        subjectId,
        departmentId,
        status,
        query,
    } = params;

    const res = await api.get<TaskCard[]>('/tasks/', {
        params: {
            scope,
            subject_id: subjectId ?? undefined,
            department_id: departmentId ?? undefined,
            status: status ?? undefined,
            q: query ?? undefined,
        },
    });

  const data = res.data ?? [];

  return data;
}

export type TaskDetail = {
    id_tg: number;
    name: string;
    role: string;
    status: 'completed' | 'completed_late' | 'not_completed';
    completedAt: string | null;
    reportUrl: string | null;
    reportText: string | null;
};

export async function fetchTaskDetails(taskId: string): Promise<TaskDetail[]> {
    const { data } = await api.get<TaskDetail[]>(`/tasks/${taskId}/`);
    return data;
}

export type Report = {
    id_report: number;
    curator: string;
    role: string;
    task: string;
    status: 'completed' | 'completed_late' | 'not_completed';
    completedAt: string | null;
    deadline: string;
    reportUrl: string | null;
    reportText: string | null;
};

export async function fetchReport(taskId: string, curatorId: string): Promise<Report> {
    const { data } = await api.get<Report>(`/tasks/reports/${encodeURIComponent(taskId)}/${curatorId}/`);
    return data;
}