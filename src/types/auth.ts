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

export interface ForgotPasswordPayload {
  email: string;
}

export interface ResetPasswordPayload {
  token: string;
  newPassword: string;
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
  emailVerified?: boolean;
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
  trade: string;
  companyName: string;
  bio: string;
  hourlyRate: number;
  location: string;
  postcodeArea: string;
  specialties: string[];
  experienceYears: number;
  phone: string;
  avatar?: string | null;
  portfolioImages?: string[];
}

export interface ProviderApplicationRecord {
  id: string;
  userId: string;
  trade: string;
  companyName: string;
  bio: string;
  hourlyRate: number;
  location: string;
  postcodeArea: string;
  specialties: string[];
  experienceYears: number;
  phone: string;
  avatar: string | null;
  portfolioImages: string[];
  status: ApprovalStatus;
  rejectionReason: string | null;
  reviewedBy: string | null;
  reviewedAt: string | null;
  createdAt: string;
  updatedAt: string;
  user?: {
    id: string;
    name: string;
    email: string;
    phone?: string | null;
  };
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