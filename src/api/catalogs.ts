import api from './client';

export interface Role {
    id_role: number;
    role: string;
}

export interface Subject {
    id_subject: number;
    subject: string;
}

export interface Department {
    id_department: number;
    department: string;
}

export interface Status {
    id_status: number;
    status: string;
}

export async function fetchRoles(): Promise<Role[]> {
    const res = await api.get<Role[]>('/catalogs/roles/managers/');
    return res.data;
}

export async function fetchSubjects(): Promise<Subject[]> {
    const res = await api.get<Subject[]>('/catalogs/subjects/');
    return res.data;
}

export async function fetchDepartments(): Promise<Department[]> {
    const res = await api.get<Department[]>('/catalogs/departments/');
    return res.data;
}

export async function fetchStatuses(): Promise<Status[]> {
    const res = await api.get<Status[]>('/catalogs/statuses/');
    return res.data;
}