import React from 'react';
import { cn } from '@/lib/utils';

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
    default: 'bg-primary-a30/10 text-primary-a40 border-primary-a30/20',
    success: 'bg-success-a20/10 text-success-a20 border-success-a20/20',
    warning: 'bg-warning-a20/10 text-warning-a20 border-warning-a20/20',
    danger: 'bg-danger-a20/10 text-danger-a20 border-danger-a20/20',
    info: 'bg-info-a20/10 text-info-a20 border-info-a20/20',
    neutral: 'bg-surface-a20 text-text-secondary border-surface-a30'
  };

  const sizeStyles = {
    sm: 'px-2 py-0.5 text-xs',
    md: 'px-2.5 py-1 text-xs'
  };

  const dotColors = {
    default: 'bg-primary-a30',
    success: 'bg-success-a20',
    warning: 'bg-warning-a20',
    danger: 'bg-danger-a20',
    info: 'bg-info-a20',
    neutral: 'bg-text-muted'
  };

  return (
    <span className={cn(
      "inline-flex items-center gap-1.5 rounded-full border font-medium",
      variantStyles[variant],
      sizeStyles[size],
      className
    )}>
      {dot && <span className={cn("w-1.5 h-1.5 rounded-full", dotColors[variant])} />}
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
    low: 'bg-success-a20/10 text-success-a20 border-success-a20/20',
    medium: 'bg-warning-a20/10 text-warning-a20 border-warning-a20/20',
    high: 'bg-warning-a30/20 text-warning-a30 border-warning-a30/30', // Orange-ish
    critical: 'bg-danger-a20/10 text-danger-a20 border-danger-a20/20'
  };

  return (
    <span className={cn(
      "inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium rounded-full border",
      styles[level],
      className
    )}>
      <span className={cn(
        "w-1.5 h-1.5 rounded-full",
        level === 'low' ? 'bg-success-a20' :
          level === 'medium' ? 'bg-warning-a20' :
            level === 'high' ? 'bg-warning-a30' :
              'bg-danger-a20'
      )} />
      {labels[level]}
    </span>
  );
}
