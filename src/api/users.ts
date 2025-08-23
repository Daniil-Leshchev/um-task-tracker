import api from "./client";

export interface UserProfileUpdate {
  current_password?: string;
  new_password?: string;
  new_password_confirm?: string;
}

export interface AdminListUser {
  id_tg: number;
  name: string;
  subject: string;
  department: string;
  role: string;
  is_manager: boolean;
  need_confirmation: boolean;
  mentor_name: string | null;
}

export async function updateUserProfile(
  data: UserProfileUpdate
): Promise<void> {
  await api.patch("/users/me/update/", data);
}

export async function fetchAdminListUsers(): Promise<AdminListUser[]> {
  const { data } = await api.get<AdminListUser[]>('/users/admin-list');
  return data;
}

export async function confirmUser(
  id_tg: number,
  confirm = true
): Promise<AdminListUser> {
  const { data } = await api.patch<AdminListUser>(`/users/${id_tg}/confirm/`, {
    confirm,
  });
  return data;
}

export async function deleteUser(id_tg: number): Promise<void> {
    await api.delete(`/users/${id_tg}/delete/`);
}

export interface MentorShort {
    id_tg: number;
    name: string;
    role_id: number;
    role: string;
    subject: string | null;
    department: string | null;
}

export async function fetchMentorsForAssignment(params: {
    target_id_tg?: number;
}): Promise<MentorShort[]> {
    const { data } = await api.get<MentorShort[]>('/users/mentors-for-assignment/', { params });
    return data;
}

export async function assignMentor(userIdTg: number, mentorIdTg: number) {
    const { data } = await api.patch(`/users/${userIdTg}/assign-mentor/`, {
        mentor_id_tg: mentorIdTg,
    });
    return data as AdminListUser;
}