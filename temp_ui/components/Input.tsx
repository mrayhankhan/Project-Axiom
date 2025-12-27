import React from 'react';

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
        <label className="block mb-1.5 text-sm text-neutral-900 font-medium">
          {label}
        </label>
      )}
      <div className="relative">
        {icon && iconPosition === 'left' && (
          <div className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-500">
            {icon}
          </div>
        )}
        <input
          className={`
            w-full px-3 py-2 rounded-md border transition-all duration-200
            ${icon && iconPosition === 'left' ? 'pl-10' : ''}
            ${icon && iconPosition === 'right' ? 'pr-10' : ''}
            ${showClear || (icon && iconPosition === 'right') ? 'pr-10' : ''}
            ${hasError 
              ? 'border-danger-500 focus:border-danger-700 focus:ring-2 focus:ring-danger-200' 
              : 'border-neutral-300 focus:border-primary-500 focus:ring-2 focus:ring-primary-200'
            }
            bg-white text-neutral-900 placeholder:text-neutral-400
            disabled:bg-neutral-100 disabled:cursor-not-allowed
            ${className}
          `}
          {...props}
        />
        {showClear && props.value && onClear && (
          <button
            type="button"
            onClick={onClear}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-700"
            tabIndex={-1}
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        )}
        {icon && iconPosition === 'right' && !showClear && (
          <div className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-500">
            {icon}
          </div>
        )}
      </div>
      {error && (
        <p className="mt-1.5 text-xs text-danger-500">{error}</p>
      )}
      {helperText && !error && (
        <p className="mt-1.5 text-xs text-neutral-500">{helperText}</p>
      )}
    </div>
  );
}
