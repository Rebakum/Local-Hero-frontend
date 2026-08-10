import React from 'react';

interface IconButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  variant?: 'default' | 'primary' | 'ghost';
  size?: 'sm' | 'md';
  className?: string;
  ariaLabel?: string;
  type?: 'button' | 'submit';
}

const VARIANT_CLASSES = {
  default: 'bg-white dark:bg-navy-900 border-navy-200 dark:border-white/10 text-navy-950 dark:text-white',
  primary: 'bg-primary text-white',
  ghost: 'bg-white/10 border-white/15 text-white backdrop-blur',
};

const SIZE_CLASSES = {
  sm: 'w-8 h-8',
  md: 'w-10 h-10',
};

export const IconButton: React.FC<IconButtonProps> = ({
  children,
  onClick,
  variant = 'default',
  size = 'md',
  className = '',
  ariaLabel,
  type = 'button',
}) => (
  <button
    type={type}
    onClick={onClick}
    aria-label={ariaLabel}
    className={`${SIZE_CLASSES[size]} rounded-xl border flex items-center justify-center transition-colors ${VARIANT_CLASSES[variant]} ${className}`}
  >
    {children}
  </button>
);
