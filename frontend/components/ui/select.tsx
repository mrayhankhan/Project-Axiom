import React from 'react';
import { cn } from '@/lib/utils';

export interface SelectOption {
  value: string;
  label: string;
}

export interface SelectProps extends Omit<React.SelectHTMLAttributes<HTMLSelectElement>, 'size'> {
  label?: string;
  error?: string;
  helperText?: string;
  options: SelectOption[];
  placeholder?: string;
}

export function Select({
  label,
  error,
  helperText,
  options,
  placeholder = 'Select an option',
  className = '',
  ...props
}: SelectProps) {
  const hasError = !!error;

  return (
    <div className="w-full">
      {label && (
        <label className="block mb-1.5 text-sm text-text-primary font-medium">
          {label}
        </label>
      )}
      <div className="relative">
        <select
          className={cn(
            "w-full px-3 py-2 pr-10 rounded-md border transition-all duration-200 appearance-none cursor-pointer",
            "bg-surface-a10 dark:bg-surface-a20 text-text-primary",
            "disabled:bg-surface-a30 disabled:cursor-not-allowed",
            hasError
              ? 'border-danger-a20 focus:border-danger-a30 focus:ring-2 focus:ring-danger-a20/25'
              : 'border-surface-a40 focus:border-primary-a30 dark:focus:border-primary-a50 focus:ring-2 focus:ring-primary-a30/25',
            className
          )}
          {...props}
        >
          <option value="">{placeholder}</option>
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-text-muted">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </div>
      {error && (
        <p className="mt-1.5 text-xs text-danger-a20">{error}</p>
      )}
      {helperText && !error && (
        <p className="mt-1.5 text-xs text-text-muted">{helperText}</p>
      )}
    </div>
  );
}
