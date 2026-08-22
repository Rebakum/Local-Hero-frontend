import React from 'react';

interface EmptyStateProps {
  title: string;
  description?: string;
  action?: React.ReactNode;
  icon?: React.ReactNode;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  title,
  description,
  action,
  icon,
}) => (
  <div className="py-14 text-center">
    {icon && <div className="mb-4">{icon}</div>}
    <p className="text-sm font-semibold text-navy-800 dark:text-navy-300">{title}</p>
    {description && (
      <p className="mt-1 text-xs text-navy-800 dark:text-navy-300">{description}</p>
    )}
    {action && <div className="mt-5">{action}</div>}
  </div>
);
