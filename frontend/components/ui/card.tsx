import React from 'react';
import { cn } from '@/lib/utils';

export interface CardProps {
  children: React.ReactNode;
  className?: string;
  padding?: 'none' | 'sm' | 'md' | 'lg';
  hover?: boolean;
  onClick?: () => void;
}

export function Card({
  children,
  className = '',
  padding = 'md',
  hover = false,
  onClick
}: CardProps) {
  const paddingStyles = {
    none: '',
    sm: 'p-3',
    md: 'p-4',
    lg: 'p-6'
  };

  return (
    <div
      className={cn(
        "bg-surface-a10 dark:bg-surface-a20 rounded-lg border border-surface-a30 shadow-sm",
        paddingStyles[padding],
        hover && "hover:shadow-md transition-shadow cursor-pointer",
        onClick && "cursor-pointer",
        className
      )}
      onClick={onClick}
      role={onClick ? 'button' : undefined}
      tabIndex={onClick ? 0 : undefined}
      onKeyDown={onClick ? (e) => e.key === 'Enter' && onClick() : undefined}
    >
      {children}
    </div>
  );
}

export interface MetricCardProps {
  label: string;
  value: string | number;
  change?: string;
  trend?: 'up' | 'down' | 'neutral';
  icon?: React.ReactNode;
  className?: string;
}

export function MetricCard({ label, value, change, trend, icon, className = '' }: MetricCardProps) {
  const trendColors = {
    up: 'text-success-a20',
    down: 'text-danger-a20',
    neutral: 'text-text-muted'
  };

  return (
    <Card className={className}>
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className="text-sm text-text-muted mb-1">{label}</p>
          <p className="text-2xl font-semibold text-text-primary">{value}</p>
          {change && trend && (
            <p className={cn("text-xs mt-1", trendColors[trend])}>
              {trend === 'up' && '↑ '}
              {trend === 'down' && '↓ '}
              {change}
            </p>
          )}
        </div>
        {icon && (
          <div className="text-text-muted">
            {icon}
          </div>
        )}
      </div>
    </Card>
  );
}
