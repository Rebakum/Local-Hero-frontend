import React from 'react';

interface FormFieldProps {
  label?: string;
  hint?: string;
  error?: string;
  required?: boolean;
  children: React.ReactNode;
  className?: string;
}

export const FormField: React.FC<FormFieldProps> = ({
  label,
  hint,
  error,
  required,
  children,
  className = '',
}) => (
  <div className={`space-y-1.5 ${className}`}>
    {label && (
      <label className="block text-xs font-semibold text-navy-700 dark:text-navy-300">
        {label}
        {required && <span className="text-red-500 ml-0.5">*</span>}
      </label>
    )}
    {children}
    {error ? (
      <p className="text-xs font-medium text-red-500">{error}</p>
    ) : hint ? (
      <p className="text-xs text-navy-800 dark:text-navy-300">{hint}</p>
    ) : null}
  </div>
);

export const inputBaseClass =
  'w-full h-10 px-3.5 rounded-xl bg-white dark:bg-navy-800 border border-navy-200 dark:border-white/10 text-sm text-navy-800 dark:text-navy-100 placeholder:text-navy-400 dark:placeholder:text-navy-500 outline-none transition-colors focus:border-primary focus:ring-2 focus:ring-primary/20 disabled:opacity-50 disabled:cursor-not-allowed';

export const textareaBaseClass =
  'w-full px-3.5 py-2.5 rounded-xl bg-white dark:bg-navy-800 border border-navy-200 dark:border-white/10 text-sm text-navy-800 dark:text-navy-100 placeholder:text-navy-400 dark:placeholder:text-navy-500 outline-none transition-colors focus:border-primary focus:ring-2 focus:ring-primary/20 disabled:opacity-50 disabled:cursor-not-allowed resize-y min-h-[96px]';

export const fieldErrorClass = 'border-red-400 dark:border-red-500/60 focus:border-red-400 focus:ring-red-500/20';
