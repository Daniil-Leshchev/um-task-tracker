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
    created: string | null;
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