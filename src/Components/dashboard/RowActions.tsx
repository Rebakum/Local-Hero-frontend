import React from 'react';
import { Loader2, Pencil, Trash2, Eye } from 'lucide-react';

export type RowActionTone = 'default' | 'danger' | 'info' | 'success' | 'warning';

export interface RowAction {
  key?: string;
  icon: React.ReactNode;
  label: string;
  onClick: () => void;
  tone?: RowActionTone;
  loading?: boolean;
  disabled?: boolean;
  hidden?: boolean;
}

interface RowActionsProps {
  actions: RowAction[];
  className?: string;
}

const toneStyles: Record<RowActionTone, string> = {
  default:
    'border-neutral-200 dark:border-white/10 text-navy-800 dark:text-navy-300 hover:border-primary/40 hover:bg-primary/10 hover:text-primary',
  danger:
    'border-neutral-200 dark:border-white/10 text-navy-800 dark:text-navy-300 hover:border-red-400/40 hover:bg-red-50 dark:hover:bg-red-500/10 hover:text-red-500',
  info: 'border-neutral-200 dark:border-white/10 text-navy-800 dark:text-navy-300 hover:border-sky-400/40 hover:bg-sky-50 dark:hover:bg-sky-500/10 hover:text-sky-500',
  success:
    'border-neutral-200 dark:border-white/10 text-navy-800 dark:text-navy-300 hover:border-emerald-400/40 hover:bg-emerald-50 dark:hover:bg-emerald-500/10 hover:text-emerald-500',
  warning:
    'border-neutral-200 dark:border-white/10 text-navy-800 dark:text-navy-300 hover:border-amber-400/40 hover:bg-amber-50 dark:hover:bg-amber-500/10 hover:text-amber-500',
};

/**
 * Consistent set of round icon buttons for the end of a table row or modal.
 * Replaces the copy-pasted Edit / Delete / View markup across the dashboard.
 */
export const RowActions: React.FC<RowActionsProps> = ({ actions, className = '' }) => {
  const visible = actions.filter((action) => !action.hidden);
  if (visible.length === 0) return null;

  return (
    <div className={`flex items-center justify-end gap-1.5 ${className}`}>
      {visible.map((action, i) => (
        <button
          key={action.key ?? `${action.label}-${i}`}
          type="button"
          onClick={action.onClick}
          disabled={action.disabled || action.loading}
          title={action.label}
          aria-label={action.label}
          className={`flex h-8 w-8 items-center justify-center rounded-full border transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed ${toneStyles[action.tone ?? 'default']}`}
        >
          {action.loading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : action.icon}
        </button>
      ))}
    </div>
  );
};

/** Convenience factory for an Edit action. */
export const editAction = (onClick: () => void, key?: string): RowAction => ({
  key,
  icon: <Pencil className="w-3.5 h-3.5" />,
  label: 'Edit',
  onClick,
});

/** Convenience factory for a Delete action. */
export const deleteAction = (
  onClick: () => void,
  key?: string,
  opts: { loading?: boolean; disabled?: boolean; hidden?: boolean } = {},
): RowAction => ({
  key,
  icon: <Trash2 className="w-3.5 h-3.5" />,
  label: 'Delete',
  tone: 'danger',
  onClick,
  ...opts,
});

/** Convenience factory for a View action. */
export const viewAction = (onClick: () => void, key?: string): RowAction => ({
  key,
  icon: <Eye className="w-3.5 h-3.5" />,
  label: 'View',
  tone: 'info',
  onClick,
});

export default RowActions;