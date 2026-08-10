import { User, Shield, Wrench, type LucideIcon } from 'lucide-react';
import type { UserRole } from '../../../types/auth';

export interface RoleConfig {
  label: string;
  shortLabel: string;
  icon: LucideIcon;
  /** Colored pill classes used for the role badge in dropdowns. */
  badgeClass: string;
  /** Colored dot shown on the avatar as a status indicator. */
  dotClass: string;
  /** Ring color around the avatar, per role. */
  ringClass: string;
  /** Role-scoped dashboard route. */
  dashboardPath: string;
  /** Whether "My Bookings" should be shown for this role. */
  showBookings: boolean;
}

const ROLE_CONFIG: Record<UserRole, RoleConfig> = {
  SUPER_ADMIN: {
    label: 'Super Admin',
    shortLabel: 'Super Admin',
    icon: Shield,
    badgeClass: 'bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-500/20',
    dotClass: 'bg-purple-500',
    ringClass: 'ring-purple-500/40',
    dashboardPath: '/dashboard/admin',
    showBookings: false,
  },
  ADMIN: {
    label: 'Admin',
    shortLabel: 'Admin',
    icon: Shield,
    badgeClass: 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20',
    dotClass: 'bg-amber-500',
    ringClass: 'ring-amber-500/40',
    dashboardPath: '/dashboard/admin',
    showBookings: false,
  },
  serviceProvider: {
    label: 'Service Provider',
    shortLabel: 'Provider',
    icon: Wrench,
    badgeClass: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20',
    dotClass: 'bg-emerald-500',
    ringClass: 'ring-emerald-500/40',
    dashboardPath: '/dashboard/provider',
    showBookings: true,
  },
  user: {
    label: 'User',
    shortLabel: 'User',
    icon: User,
    badgeClass: 'bg-primary/10 text-primary border-primary/20',
    dotClass: 'bg-primary',
    ringClass: 'ring-primary/40',
    dashboardPath: '/dashboard/user',
    showBookings: true,
  },
};

/**
 * Resolves a role config for any auth payload, normalising legacy
 * spellings like `SERVICE_PROVIDER` / `USER` (uppercase variants).
 */
export function getRoleConfig(role?: UserRole | string): RoleConfig {
  const normalized = (role ?? 'user').toLowerCase();
  if (normalized === 'super_admin' || normalized === 'superadmin') return ROLE_CONFIG.SUPER_ADMIN;
  if (normalized === 'admin') return ROLE_CONFIG.ADMIN;
  if (normalized === 'serviceprovider' || normalized === 'service_provider') {
    return ROLE_CONFIG.serviceProvider;
  }
  return ROLE_CONFIG.user;
}

export function getInitials(name?: string): string {
  if (!name) return 'U';
  return name
    .split(' ')
    .map((part) => part[0])
    .filter(Boolean)
    .join('')
    .toUpperCase()
    .slice(0, 2);
}
