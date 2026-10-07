import React from 'react';

export interface BadgeProps {
  children: React.ReactNode;
  variant?: 'success' | 'warning' | 'danger' | 'info' | 'primary' | 'neutral' | 'accent';
  size?: 'sm' | 'md';
  dot?: boolean;
  className?: string;
}

export const Badge: React.FC<BadgeProps> = ({
  children,
  variant = 'primary',
  size = 'md',
  dot = false,
  className = '',
}) => {
  const sizeClasses = {
    sm: 'text-xs px-2 py-0.5 font-medium',
    md: 'text-xs px-2.5 py-1 font-semibold',
  };

  const variantClasses = {
    success: 'bg-emerald-50 text-emerald-900 border border-emerald-300 font-bold',
    warning: 'bg-amber-50 text-amber-950 border border-amber-300 font-bold',
    danger: 'bg-rose-50 text-rose-950 border border-rose-300 font-bold',
    info: 'bg-sky-50 text-sky-950 border border-sky-300 font-bold',
    primary: 'bg-emerald-50 text-emerald-900 border border-emerald-300 font-bold',
    accent: 'bg-amber-50 text-amber-950 border border-amber-300 font-bold',
    neutral: 'bg-slate-100 text-slate-800 border border-slate-300 font-bold',
  };

  const dotClasses = {
    success: 'bg-emerald-500',
    warning: 'bg-amber-500',
    danger: 'bg-rose-500',
    info: 'bg-sky-500',
    primary: 'bg-[#22C55E]',
    accent: 'bg-[#F59E0B]',
    neutral: 'bg-slate-400',
  };

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full transition-colors ${sizeClasses[size]} ${variantClasses[variant]} ${className}`}
    >
      {dot && (
        <span className={`w-1.5 h-1.5 rounded-full animate-pulse ${dotClasses[variant]}`} />
      )}
      {children}
    </span>
  );
};
