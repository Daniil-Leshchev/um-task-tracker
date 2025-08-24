import api from "./client";

export type AssignmentPolicy = {
  can_pick_subject: boolean;
  can_pick_department: boolean;
  allowed_recipient_role_ids?: number[];
  defaults: {
    subject_id: number | null;
    department_id: number | null;
    role_id: number | null;
  };
};

export type AssignableCurator = {
  id_tg: number;
  name: string;
  role_id: number;
  role_name: string;
  subject_name: string | null;
  department_name: string | null;
};

export async function fetchAssignmentPolicy() {
  const { data } = await api.get('tasks/assignment-policy/');
  return data as AssignmentPolicy;
}

export type FetchRecipientsParams = {
    subject_id?: number | null;
    department_id?: number | null;
    role_ids?: number[];
    single_id_tg?: number | null;
    id_tg_list?: number[];
};

export async function fetchAssignableCurators(params: FetchRecipientsParams = {}) {
    const qs = new URLSearchParams();

    if (params.subject_id != null) qs.set('subject_id', String(params.subject_id));
    if (params.department_id != null) qs.set('department_id', String(params.department_id));
    if (params.role_ids && params.role_ids.length) qs.set('role_ids', params.role_ids.join(','));
    if (params.single_id_tg != null) qs.set('single_id_tg', String(params.single_id_tg));
    if (params.id_tg_list && params.id_tg_list.length) qs.set('id_tg_list', params.id_tg_list.join(','));

    const url = qs.toString() ? `/tasks/recipients/?${qs.toString()}` : '/tasks/recipients/';
    const { data } = await api.get<AssignableCurator[]>(url);
    return data;
}