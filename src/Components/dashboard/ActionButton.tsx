import React from 'react';
import { Loader2, LucideIcon } from 'lucide-react';

export interface ActionButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'approve' | 'reject' | 'primary' | 'ghost';
  size?: 'sm' | 'md';
  isLoading?: boolean;
  icon?: LucideIcon;
  children: React.ReactNode;
}

const variantStyles: Record<string, string> = {
  approve: 'bg-emerald-500 text-white hover:bg-emerald-600 focus:ring-emerald-500/20 disabled:bg-emerald-300',
  reject: 'bg-red-50 text-red-600 hover:bg-red-100 dark:bg-red-500/10 dark:text-red-400 dark:hover:bg-red-500/20 focus:ring-red-500/20',
  primary: 'bg-primary text-white hover:bg-primary/90 focus:ring-primary/20 disabled:opacity-50',
  ghost: 'bg-transparent text-navy-600 dark:text-navy-300 hover:bg-navy-50 dark:hover:bg-white/5',
};

const sizeStyles: Record<string, string> = {
  sm: 'px-3 py-1.5 text-xs rounded-lg gap-1.5',
  md: 'px-4 py-2 text-sm rounded-xl gap-2',
};

export const ActionButton: React.FC<ActionButtonProps> = ({
  variant = 'primary',
  size = 'sm',
  isLoading = false,
  icon: Icon,
  disabled,
  children,
  className = '',
  ...props
}) => {
  return (
    <button
      disabled={disabled || isLoading}
      className={`inline-flex items-center justify-center font-bold transition-all duration-150 focus:outline-none focus:ring-2 disabled:cursor-not-allowed ${variantStyles[variant]} ${sizeStyles[size]} ${className}`}
      {...props}
    >
      {isLoading ? (
        <Loader2 className="w-3.5 h-3.5 animate-spin" />
      ) : Icon ? (
        <Icon className="w-3.5 h-3.5" />
      ) : null}
      <span>{children}</span>
    </button>
  );
};

export default ActionButton;
