import React from 'react';

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
        <label className="block mb-1.5 text-sm text-neutral-900 font-medium">
          {label}
        </label>
      )}
      <div className="relative">
        <select
          className={`
            w-full px-3 py-2 pr-10 rounded-md border transition-all duration-200
            appearance-none cursor-pointer
            ${hasError 
              ? 'border-danger-500 focus:border-danger-700 focus:ring-2 focus:ring-danger-200' 
              : 'border-neutral-300 focus:border-primary-500 focus:ring-2 focus:ring-primary-200'
            }
            bg-white text-neutral-900
            disabled:bg-neutral-100 disabled:cursor-not-allowed
            ${className}
          `}
          {...props}
        >
          <option value="">{placeholder}</option>
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-neutral-500">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </div>
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
