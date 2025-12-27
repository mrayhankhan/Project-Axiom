import React from 'react';

export interface BadgeProps {
  children: React.ReactNode;
  variant?: 'default' | 'success' | 'warning' | 'danger' | 'info' | 'neutral';
  size?: 'sm' | 'md';
  className?: string;
  dot?: boolean;
}

export function Badge({ 
  children, 
  variant = 'default', 
  size = 'md',
  className = '',
  dot = false 
}: BadgeProps) {
  const variantStyles = {
    default: 'bg-primary-100 text-primary-700 border-primary-200',
    success: 'bg-success-50 text-success-700 border-success-200',
    warning: 'bg-warning-50 text-warning-700 border-warning-200',
    danger: 'bg-danger-50 text-danger-700 border-danger-200',
    info: 'bg-info-50 text-info-700 border-info-200',
    neutral: 'bg-neutral-100 text-neutral-700 border-neutral-200'
  };
  
  const sizeStyles = {
    sm: 'px-2 py-0.5 text-xs',
    md: 'px-2.5 py-1 text-xs'
  };
  
  const dotColors = {
    default: 'bg-primary-500',
    success: 'bg-success-500',
    warning: 'bg-warning-500',
    danger: 'bg-danger-500',
    info: 'bg-info-500',
    neutral: 'bg-neutral-500'
  };
  
  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full border font-medium ${variantStyles[variant]} ${sizeStyles[size]} ${className}`}>
      {dot && <span className={`w-1.5 h-1.5 rounded-full ${dotColors[variant]}`} />}
      {children}
    </span>
  );
}

export interface RiskBadgeProps {
  level: 'low' | 'medium' | 'high' | 'critical';
  className?: string;
}

export function RiskBadge({ level, className = '' }: RiskBadgeProps) {
  const labels = {
    low: 'Low Risk',
    medium: 'Medium Risk',
    high: 'High Risk',
    critical: 'Critical Risk'
  };
  
  const styles = {
    low: 'bg-success-50 text-success-700 border-success-200',
    medium: 'bg-warning-50 text-warning-700 border-warning-200',
    high: 'bg-[#fff7ed] text-[#c2410c] border-[#fed7aa]',
    critical: 'bg-danger-50 text-danger-700 border-danger-200'
  };
  
  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium rounded-full border ${styles[level]} ${className}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${level === 'low' ? 'bg-success-500' : level === 'medium' ? 'bg-warning-500' : level === 'high' ? 'bg-[#f97316]' : 'bg-danger-500'}`} />
      {labels[level]}
    </span>
  );
}
