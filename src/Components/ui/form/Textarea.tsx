import React, { forwardRef } from 'react';
import { FormField, textareaBaseClass, fieldErrorClass } from './FormField';

export interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  hint?: string;
  error?: string;
  required?: boolean;
}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ label, hint, error, required, className = '', ...props }, ref) => (
    <FormField label={label} hint={hint} error={error} required={required}>
      <textarea
        ref={ref}
        className={`${textareaBaseClass} ${error ? fieldErrorClass : ''} ${className}`}
        {...props}
      />
    </FormField>
  ),
);

Textarea.displayName = 'Textarea';
