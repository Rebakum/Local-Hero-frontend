import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import type { UserRole } from '../types/auth';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatGBP(amount: number): string {
  return new Intl.NumberFormat('en-GB', {
    style: 'currency',
    currency: 'GBP',
    maximumFractionDigits: 0,
  }).format(amount);
}

export function isValidUKPostcode(postcode: string): boolean {
  const ukPostcodeRegex = /^([A-Z]{1,2}\d[A-Z\d]? ?\d[A-Z]{2}|GIR ?0AA)$/i;
  return ukPostcodeRegex.test(postcode.trim());
}

export function slugify(text: string): string {
  return text
    .toString()
    .trim()
    .toLowerCase()
    .replace(/\s+/g, '-');
}

export function getTradeDisplayName(trade: { category?: string; name?: string; title?: string; id?: string }): string {
  return trade.category || trade.name || trade.title || trade.id || '';
}

export function getIconComponent(iconName: string, icons: Record<string, React.FC<any>>): React.FC<any> {
  return icons[iconName] || icons.Wrench;
}

export const getRoleDashboardPath = (role?: UserRole | string): string => {
  switch (role) {
    case 'SUPER_ADMIN':
      return '/dashboard/super-admin';
    case 'ADMIN':
      return '/dashboard/admin';
    case 'serviceProvider':
      return '/dashboard/provider';
    case 'user':
    default:
      return '/dashboard/user';
  }
};
