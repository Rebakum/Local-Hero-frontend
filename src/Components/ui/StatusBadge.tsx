import React from 'react';
import { Badge } from './shared/Badge';

export type StatusTone = 'success' | 'warning' | 'danger' | 'info' | 'neutral';

export interface StatusBadgeProps {
  status: string;
  label?: string;
  tone?: StatusTone;
  pulse?: boolean;
}

// Generic mapping for the most common backend status values.
const DEFAULT_TONES: Record<string, StatusTone> = {
  // Approval
  APPROVED: 'success',
  PENDING: 'warning',
  REJECTED: 'danger',
  // Bookings / Jobs
  ACCEPTED: 'info',
  IN_PROGRESS: 'info',
  COMPLETED: 'success',
  CANCELLED: 'danger',
  // Payments
  PAID: 'success',
  FAILED: 'danger',
  REFUNDED: 'neutral',
};

const TONE_TO_BADGE_VARIANT: Record<StatusTone, 'success' | 'warning' | 'emergency' | 'primary' | 'neutral'> = {
  success: 'success',
  warning: 'warning',
  danger: 'emergency',
  info: 'primary',
  neutral: 'neutral',
};

const humanize = (status: string) =>
  status
    .toLowerCase()
    .split('_')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status, label, tone, pulse = false }) => (
  <Badge variant={TONE_TO_BADGE_VARIANT[tone ?? DEFAULT_TONES[status] ?? 'neutral']} pulse={pulse}>
    {label ?? humanize(status)}
  </Badge>
);
