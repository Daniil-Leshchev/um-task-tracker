import api from './client';

export type CreateTaskGroupPayload = {
    deadline: string;
    name: string;
    description: string;
    report: string;
    subject_id: number;
    department_ids: number[];
    role_ids: number[];
};

export type CreateTaskIndividualPayload = {
    deadline: string;
    name: string;
    description: string;
    report: string;
    emails: string[];
};

export type CreateTaskPayload = CreateTaskGroupPayload | CreateTaskIndividualPayload;

export type DeliveryAssignmentRow = {
    assignment_id: number;
    status: 'sent' | 'partially_sent' | 'failed';
    undelivered_names: string[];
    error: string | null;
};

export type DeliverySummary = {
    total: number;
    sent: number;
    partial: number;
    failed: number;
};

export type CreateTaskDelivery = {
    ok: boolean;
    bot_unavailable: boolean;
    assignments: DeliveryAssignmentRow[];
    summary: DeliverySummary;
    undelivered_names_all: string[];
};

export type CreateTaskResponse = {
    id_task: string;
    assignment_ids?: number[];
    delivery: CreateTaskDelivery;
};

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
    on_time?: number;
};

export async function fetchTasks(params: FetchTasksParams = {}): Promise<TaskCard[]> {
  const { scope = 'all', subjectId, departmentId, status, query } = params;

  const res = await api.get<TaskCard[]>('/tasks/', {
    params: {
      scope,
      subject_id: subjectId ?? undefined,
      department_id: departmentId ?? undefined,
      status: status ?? undefined,
      q: query ?? undefined,
    },
  });

  return res.data ?? [];
}

export type TaskDetail = {
    email: string;
    name: string;
    role: string;
    status: 'completed' | 'completed_late' | 'not_completed';
    completedAt: string | null;
    reportUrl: string | null;
    reportText: string | null;
};

export async function fetchTaskDetails(taskId: string): Promise<TaskDetail[]> {
    const { data } = await api.get<TaskDetail[]>(`/tasks/${encodeURIComponent(taskId)}/`);
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

export async function fetchReport(taskId: string, email: string): Promise<Report> {
    const { data } = await api.get<Report>(
        `/tasks/reports/${encodeURIComponent(taskId)}/${encodeURIComponent(email)}/`
    );
    return data;
}

export async function createTask(payload: CreateTaskPayload): Promise<CreateTaskResponse> {
    const { data } = await api.post<CreateTaskResponse>('/tasks/', payload);
    return data;
}