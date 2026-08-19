import React from 'react';

interface BadgeProps {
  children: React.ReactNode;
  variant?: 'primary' | 'emergency' | 'success' | 'warning' | 'neutral';
  className?: string;
  pulse?: boolean;
}

const VARIANT_CLASSES = {
  primary: 'bg-sky-500/10 text-sky-700 dark:text-sky-300 border-sky-500/20',
  emergency: 'bg-red-500/10 text-red-600 dark:text-red-400 border-red-500/20',
  success: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20',
  warning: 'bg-amber-500/10 text-amber-700 dark:text-amber-400 border-amber-500/20',
  neutral: 'bg-navy-100 text-navy-600 dark:bg-white/10 dark:text-navy-300',
};

export const Badge: React.FC<BadgeProps> = ({
  children,
  variant = 'primary',
  className = '',
  pulse = false,
}) => (
  <span
    className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-semibold ${VARIANT_CLASSES[variant]} ${pulse ? 'animate-pulse' : ''} ${className}`}
  >
    {children}
  </span>
);
