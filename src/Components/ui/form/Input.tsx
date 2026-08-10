import React, { forwardRef } from 'react';
import { FormField, inputBaseClass, fieldErrorClass } from './FormField';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  hint?: string;
  error?: string;
  required?: boolean;
  leftIcon?: React.ReactNode;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, hint, error, required, leftIcon, className = '', ...props }, ref) => {
    const input = (
      <input
        ref={ref}
        className={`${inputBaseClass} ${leftIcon ? 'pl-10' : ''} ${error ? fieldErrorClass : ''} ${className}`}
        {...props}
      />
    );

    return (
      <FormField label={label} hint={hint} error={error} required={required}>
        {leftIcon ? (
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-navy-400 dark:text-navy-500 pointer-events-none">
              {leftIcon}
            </span>
            {input}
          </div>
        ) : (
          input
        )}
      </FormField>
    );
  },
);

Input.displayName = 'Input';
