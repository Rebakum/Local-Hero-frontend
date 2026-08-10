import React from 'react';
import { X } from 'lucide-react';
import { ModalShell } from './ModalShell';

export type ModalSize = 'sm' | 'md' | 'lg' | 'xl';

export interface ModalProps {
  open: boolean;
  onClose: () => void;
  title: string;
  description?: string;
  icon?: React.ReactNode;
  children?: React.ReactNode;
  footer?: React.ReactNode;
  size?: ModalSize;
  hideClose?: boolean;
}

const SIZE_MAP: Record<ModalSize, string> = {
  sm: 'max-w-md',
  md: 'max-w-xl',
  lg: 'max-w-2xl',
  xl: 'max-w-4xl',
};

export const Modal: React.FC<ModalProps> = ({
  open,
  onClose,
  title,
  description,
  icon,
  children,
  footer,
  size = 'md',
  hideClose = false,
}) => (
  <ModalShell isOpen={open} onClose={onClose} maxWidth={SIZE_MAP[size]}>
    {/* Header */}
    <div className="flex items-start gap-4 px-6 pt-6 pb-4 border-b border-navy-100 dark:border-white/10">
      {icon && (
        <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary shrink-0">
          {icon}
        </div>
      )}
      <div className="flex-1 min-w-0">
        <h2 className="font-heading text-lg font-bold text-navy-950 dark:text-white leading-tight">
          {title}
        </h2>
        {description && (
          <p className="text-xs text-navy-400 dark:text-navy-500 mt-1 leading-relaxed">
            {description}
          </p>
        )}
      </div>
      {!hideClose && (
        <button
          onClick={onClose}
          aria-label="Close modal"
          className="w-8 h-8 rounded-lg flex items-center justify-center text-navy-400 dark:text-navy-500 hover:bg-navy-100 dark:hover:bg-white/10 hover:text-navy-700 dark:hover:text-navy-200 transition-colors shrink-0"
        >
          <X className="w-4 h-4" />
        </button>
      )}
    </div>

    {/* Body */}
    <div className="flex-1 overflow-y-auto px-6 py-5">{children}</div>

    {/* Footer */}
    {footer && (
      <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-navy-100 dark:border-white/10 bg-navy-50/50 dark:bg-white/[0.02]">
        {footer}
      </div>
    )}
  </ModalShell>
);
