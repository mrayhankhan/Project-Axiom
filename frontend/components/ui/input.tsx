import React from 'react';
import { cn } from '@/lib/utils';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
  icon?: React.ReactNode;
  iconPosition?: 'left' | 'right';
  onClear?: () => void;
  showClear?: boolean;
}

export function Input({
  label,
  error,
  helperText,
  icon,
  iconPosition = 'left',
  onClear,
  showClear,
  className = '',
  ...props
}: InputProps) {
  const hasError = !!error;

  return (
    <div className="w-full">
      {label && (
        <label className="block mb-1.5 text-sm text-text-primary font-medium">
          {label}
        </label>
      )}
      <div className="relative">
        {icon && iconPosition === 'left' && (
          <div className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted">
            {icon}
          </div>
        )}
        <input
          className={cn(
            "w-full px-3 py-2 rounded-md border transition-all duration-200",
            "bg-surface-a10 dark:bg-surface-a20 text-text-primary placeholder:text-text-muted",
            "disabled:bg-surface-a30 disabled:cursor-not-allowed",
            icon && iconPosition === 'left' ? 'pl-10' : '',
            icon && iconPosition === 'right' ? 'pr-10' : '',
            showClear || (icon && iconPosition === 'right') ? 'pr-10' : '',
            hasError
              ? 'border-danger-a20 focus:border-danger-a30 focus:ring-2 focus:ring-danger-a20/25'
              : 'border-surface-a40 focus:border-primary-a30 dark:focus:border-primary-a50 focus:ring-2 focus:ring-primary-a30/25',
            className
          )}
          {...props}
        />
        {showClear && props.value && onClear && (
          <button
            type="button"
            onClick={onClear}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-text-muted hover:text-text-primary"
            tabIndex={-1}
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        )}
        {icon && iconPosition === 'right' && !showClear && (
          <div className="absolute right-3 top-1/2 -translate-y-1/2 text-text-muted">
            {icon}
          </div>
        )}
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
