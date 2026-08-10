import axiosInstance from '../lib/axiosInstance';
import type {
  LoginCredentials,
  RegisterCredentials,
  AuthResponse,
  AuthUser,
  UpdateProfilePayload,
  DeleteAccountPayload,
  PendingUser,
  ProviderApplicationPayload,
  AdminUser,
  ChangeRolePayload,
} from '../types/auth';

// The backend's sendResponse() always wraps payloads as:
//   { success, statusCode, message, data: <payload>, meta? }
// where <payload> is the resource itself (an object or an array) —
// never re-wrapped in a further { user: ... } / { users: [...] } layer.
interface ApiEnvelope<T> {
  success: boolean;
  statusCode: number;
  message: string;
  data: T;
  meta?: { page: number; limit: number; total: number };
}

export async function loginUser(credentials: LoginCredentials): Promise<AuthResponse> {
  const { data } = await axiosInstance.post<AuthResponse>('/auth/login', credentials);
  return data;
}

export async function registerUser(credentials: RegisterCredentials): Promise<AuthResponse> {
  const { data } = await axiosInstance.post<AuthResponse>('/auth/register', credentials);
  return data;
}

export async function getProfile(): Promise<AuthUser> {
  const { data } = await axiosInstance.get<ApiEnvelope<AuthUser>>('/users/me');
  return data.data;
}

export async function logoutUser(): Promise<void> {
  // Refresh token is read server-side from the httpOnly cookie —
  // nothing to send in the body.
  await axiosInstance.post('/auth/logout');
}

export async function updateProfile(payload: UpdateProfilePayload): Promise<AuthUser> {
  const { data } = await axiosInstance.patch<ApiEnvelope<AuthUser>>('/users/me', payload);
  return data.data;
}

export async function deleteAccount(payload: DeleteAccountPayload): Promise<void> {
  await axiosInstance.delete('/users/me', { data: payload });
}

export async function getPendingProviders(): Promise<PendingUser[]> {
  const { data } = await axiosInstance.get<ApiEnvelope<PendingUser[]>>(
    '/admin/users?role=serviceProvider&approvalStatus=PENDING',
  );
  return data.data;
}

export async function approveUser(userId: string): Promise<void> {
  await axiosInstance.patch(`/admin/users/${userId}/approve`);
}

export async function rejectUser(userId: string): Promise<void> {
  await axiosInstance.patch(`/admin/users/${userId}/reject`);
}

export async function getPendingAdmins(): Promise<PendingUser[]> {
  const { data } = await axiosInstance.get<ApiEnvelope<PendingUser[]>>(
    '/super-admin/users?role=ADMIN&approvalStatus=PENDING',
  );
  return data.data;
}

export async function approveAdmin(userId: string): Promise<void> {
  await axiosInstance.patch(`/super-admin/users/${userId}/approve`);
}

export async function rejectAdmin(userId: string): Promise<void> {
  await axiosInstance.patch(`/super-admin/users/${userId}/reject`);
}

export async function applyProvider(
  payload: ProviderApplicationPayload,
): Promise<{ success: boolean; message?: string }> {
  const { data } = await axiosInstance.post<{ success: boolean; message?: string }>(
    '/users/apply-provider',
    payload,
  );
  return data;
}

export async function getAllUsers(): Promise<AdminUser[]> {
  const { data } = await axiosInstance.get<ApiEnvelope<AdminUser[]>>('/admin/users');
  return data.data;
}

export async function changeUserRole(userId: string, payload: ChangeRolePayload): Promise<void> {
  await axiosInstance.patch(`/super-admin/users/${userId}/role`, payload);
}
