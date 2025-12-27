import React from 'react';

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
  
  const hoverStyles = hover ? 'hover:shadow-md transition-shadow cursor-pointer' : '';
  const clickableStyles = onClick ? 'cursor-pointer' : '';
  
  return (
    <div 
      className={`bg-white rounded-lg border border-neutral-200 shadow-sm ${paddingStyles[padding]} ${hoverStyles} ${clickableStyles} ${className}`}
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
    up: 'text-success-500',
    down: 'text-danger-500',
    neutral: 'text-neutral-500'
  };
  
  return (
    <Card className={className}>
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className="text-sm text-neutral-500 mb-1">{label}</p>
          <p className="text-2xl font-semibold text-neutral-900">{value}</p>
          {change && trend && (
            <p className={`text-xs mt-1 ${trendColors[trend]}`}>
              {trend === 'up' && '↑ '}
              {trend === 'down' && '↓ '}
              {change}
            </p>
          )}
        </div>
        {icon && (
          <div className="text-neutral-400">
            {icon}
          </div>
        )}
      </div>
    </Card>
  );
}
