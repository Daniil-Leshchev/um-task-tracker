import api from "./client";

const enc = (email: string) => encodeURIComponent(email);

export interface UserProfileUpdate {
  current_password?: string;
  new_password?: string;
  new_password_confirm?: string;
}

export interface AdminListUser {
  email: string;
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
  await api.patch('/users/me/update/', data);
}

export async function fetchAdminListUsers(): Promise<AdminListUser[]> {
  const { data } = await api.get<AdminListUser[]>('/users/admin-list');
  return data;
}

export async function confirmUser(
  email: string,
  confirm = true
): Promise<AdminListUser> {
  const { data } = await api.patch<AdminListUser>(`/users/${enc(email)}/confirm/`, {
    confirm,
  });
  return data;
}

export async function deleteUser(email: string): Promise<void> {
    await api.delete(`/users/${enc(email)}/delete/`);
}

export interface MentorShort {
    email: string;
    name: string;
    role_id: number;
    role: string;
    subject: string | null;
    department: string | null;
}

export async function fetchMentorsForAssignment(params: {
    target_email?: string;
}): Promise<MentorShort[]> {
    const { data } = await api.get<MentorShort[]>('/users/mentors-for-assignment/', { params });
    return data;
}

export async function assignMentor(userEmail: string, mentorEmail: string) {
    const { data } = await api.patch(`/users/${enc(userEmail)}/assign-mentor/`, {
        mentor_email: mentorEmail,
    });
    return data as AdminListUser;
}