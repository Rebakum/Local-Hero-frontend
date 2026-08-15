import React from 'react';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  hover?: boolean;
  padding?: 'sm' | 'md' | 'lg';
}

const PADDING_MAP = {
  sm: 'p-4',
  md: 'p-6',
  lg: 'p-8',
};

export const Card: React.FC<CardProps> = ({
  children,
  className = '',
  hover = false,
  padding = 'md',
}) => (
  <div
    className={`bg-white dark:bg-navy-800 border border-neutral-200 dark:border-white/10 rounded-3xl shadow-lg ${PADDING_MAP[padding]} ${hover ? 'transition-all duration-300 hover:-translate-y-2 hover:border-primary/50 hover:shadow-2xl' : ''} ${className}`}
  >
    {children}
  </div>
);
