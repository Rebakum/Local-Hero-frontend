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
  ProviderApplicationRecord,
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

export async function validateEmailToken(token: string): Promise<AuthUser> {
  const { data } = await axiosInstance.get<ApiEnvelope<{ user: AuthUser }>>(
    '/auth/verify-email',
    { params: { token } },
  );
  return data.data.user;
}

export async function confirmEmailVerification(token: string): Promise<AuthUser> {
  const { data } = await axiosInstance.post<ApiEnvelope<{ user: AuthUser }>>(
    '/auth/verify-email',
    { token },
  );
  return data.data.user;
}

export async function verifyEmail(token: string): Promise<AuthUser> {
  return confirmEmailVerification(token);
}

export async function resendVerificationEmail(email: string): Promise<void> {
  await axiosInstance.post('/auth/resend-verification', { email });
}

export async function getProfile(): Promise<AuthUser> {
  const { data } = await axiosInstance.get<ApiEnvelope<AuthUser>>('/users/me');
  return data.data;
}

export async function forgotPassword(email: string): Promise<void> {
  await axiosInstance.post('/auth/forget-password', { email });
}

export async function resetPassword(token: string, newPassword: string): Promise<void> {
  await axiosInstance.post('/auth/reset-password', { token, newPassword });
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

// ---------- Provider Applications ----------
// The "Become a Provider" flow is backed by the ProviderApplication model
// (POST /provider-applications). Approving an application is what promotes
// the user to serviceProvider and creates their Professional profile.

export async function applyProvider(
  payload: ProviderApplicationPayload,
): Promise<ProviderApplicationRecord> {
  const { data } = await axiosInstance.post<ApiEnvelope<ProviderApplicationRecord>>(
    '/provider-applications',
    payload,
  );
  return data.data;
}

export async function getMyProviderApplication(): Promise<ProviderApplicationRecord | null> {
  const { data } = await axiosInstance.get<ApiEnvelope<ProviderApplicationRecord | null>>(
    '/provider-applications/me',
  );
  return data.data ?? null;
}

export async function getProviderApplications(
  status?: 'PENDING' | 'APPROVED' | 'REJECTED',
): Promise<ProviderApplicationRecord[]> {
  const { data } = await axiosInstance.get<ApiEnvelope<ProviderApplicationRecord[]>>(
    '/provider-applications',
    { params: { status, limit: 100 } },
  );
  return data.data;
}

export async function approveProviderApplication(applicationId: string): Promise<void> {
  await axiosInstance.patch(`/provider-applications/${applicationId}/approve`);
}

export async function rejectProviderApplication(
  applicationId: string,
  rejectionReason: string,
): Promise<void> {
  await axiosInstance.patch(`/provider-applications/${applicationId}/reject`, {
    rejectionReason,
  });
}

export async function getAllUsers(): Promise<AdminUser[]> {
  // The backend paginates (default limit 10); the management screen needs
  // the full list for client-side filtering, so fetch every page.
  const PAGE_SIZE = 100;
  const first = await axiosInstance.get<ApiEnvelope<AdminUser[]>>('/admin/users', {
    params: { page: 1, limit: PAGE_SIZE },
  });
  const all = [...(first.data.data ?? [])];
  const total = first.data.meta?.total ?? all.length;

  const pageCount = Math.ceil(total / PAGE_SIZE);
  for (let page = 2; page <= pageCount; page++) {
    const next = await axiosInstance.get<ApiEnvelope<AdminUser[]>>('/admin/users', {
      params: { page, limit: PAGE_SIZE },
    });
    all.push(...(next.data.data ?? []));
  }

  return all;
}

export async function changeUserRole(userId: string, payload: ChangeRolePayload): Promise<void> {
  await axiosInstance.patch(`/super-admin/users/${userId}/role`, payload);
}

// ---------- Dashboard statistics (ADMIN / SUPER_ADMIN) ----------
// Consolidated real stats for the admin/super-admin dashboard, calculated
// server-side from the database. No client-side fake numbers.
export interface AdminDashboardStats {
  platformRevenuePence: number;
  revenueChange: number;
  activeAdmins: number;
  pendingApprovals: number;
  totalUsers: number;
  weeklyUserGrowth: number;
  systemHealth: number;
  systemStatus: string;
  bookingsToday: number;
  revenueThisWeekPence: number;
  totalBookings: number;
  conversionRate: number;
}

export async function getAdminDashboardStats(): Promise<AdminDashboardStats> {
  const { data } = await axiosInstance.get<ApiEnvelope<AdminDashboardStats>>(
    '/admin/dashboard/stats',
  );
  return data.data;
}

export interface SystemHealth {
  platform: {
    status: 'operational' | 'degraded';
    uptimeSeconds: number;
    memoryMb: number;
  };
  database: {
    status: 'operational' | 'degraded';
    latencyMs: number | null;
  };
  authService: {
    status: 'operational' | 'degraded';
    latencyMs: number | null;
  };
  paymentGateway: {
    status: 'operational' | 'not_configured';
  };
}

export async function getSystemHealth(): Promise<SystemHealth> {
  const { data } = await axiosInstance.get<ApiEnvelope<SystemHealth>>(
    '/super-admin/system/health',
  );
  return data.data;
}
