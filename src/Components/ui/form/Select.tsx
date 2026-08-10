import React, { forwardRef } from 'react';
import { FormField, inputBaseClass, fieldErrorClass } from './FormField';

export interface SelectOption {
  value: string;
  label: string;
}

export interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  hint?: string;
  error?: string;
  required?: boolean;
  options: SelectOption[];
  placeholder?: string;
}

export const Select = forwardRef<HTMLSelectElement, SelectProps>(
  ({ label, hint, error, required, options, placeholder, className = '', ...props }, ref) => (
    <FormField label={label} hint={hint} error={error} required={required}>
      <select
        ref={ref}
        className={`${inputBaseClass} ${error ? fieldErrorClass : ''} appearance-none bg-no-repeat pr-8 ${className}`}
        style={{
          backgroundImage:
            "url(\"data:image/svg+xml;charset=UTF-8,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%239ca3af' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3e%3cpolyline points='6 9 12 15 18 9'%3e%3c/polyline%3e%3c/svg%3e\")",
          backgroundPosition: 'right 0.75rem center',
          backgroundSize: '1rem',
        }}
        {...props}
      >
        {placeholder && (
          <option value="" disabled>
            {placeholder}
          </option>
        )}
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
    </FormField>
  ),
);

Select.displayName = 'Select';
