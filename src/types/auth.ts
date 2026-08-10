export type UserRole = 'user' | 'serviceProvider' | 'ADMIN' | 'SUPER_ADMIN';
export type ApprovalStatus = 'PENDING' | 'APPROVED' | 'REJECTED';

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterCredentials {
  name: string;
  email: string;
  password: string;
  phone?: string;
  role?: UserRole;
}

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar?: string;
  phone?: string;
  isApproved?: boolean;
  approvalStatus?: ApprovalStatus;
  createdAt?: string;
}

export interface AuthResponse {
  success: boolean;
  statusCode?: number;
  message?: string;
  data?: {
    accessToken?: string;
    refreshToken?: string;
    user?: AuthUser;
  };
  user?: AuthUser;
}

export interface UpdateProfilePayload {
  name?: string;
  phone?: string;
  avatar?: string;
}

export interface DeleteAccountPayload {
  password: string;
}

export interface PendingUser {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  phone?: string;
  approvalStatus: ApprovalStatus;
  createdAt: string;
}

export interface ProviderApplicationPayload {
  serviceCategory: string;
  experienceYears: number;
  serviceDetails: string;
  phone: string;
}

export interface AdminUser {
  id: string;
  name: string;
  email: string;
  phone?: string;
  role: UserRole;
  approvalStatus?: ApprovalStatus;
  isApproved?: boolean;
  createdAt: string;
}

export interface ChangeRolePayload {
  role: UserRole;
}

export type ServiceCategory =
  | 'Electrician'
  | 'Plumber'
  | 'Cleaner'
  | 'Painter'
  | 'Gardener'
  | 'Carpenter'
  | 'Locksmith'
  | 'Roofer'
  | 'Handyman'
  | 'Other';

export const SERVICE_CATEGORIES: ServiceCategory[] = [
  'Electrician',
  'Plumber',
  'Cleaner',
  'Painter',
  'Gardener',
  'Carpenter',
  'Locksmith',
  'Roofer',
  'Handyman',
  'Other',
];