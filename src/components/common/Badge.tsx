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
    success: 'bg-emerald-50 text-emerald-800 border border-emerald-200/80 font-bold',
    warning: 'bg-amber-50 text-amber-900 border border-amber-200/80 font-bold',
    danger: 'bg-rose-50 text-rose-800 border border-rose-200/80 font-bold',
    info: 'bg-sky-50 text-sky-800 border border-sky-200/80 font-bold',
    primary: 'bg-[#F0F9F6] text-[#0B6B53] border border-[#BCE2D7] font-bold',
    accent: 'bg-[#FEF9EE] text-[#C77914] border border-[#FBE3AA] font-bold',
    neutral: 'bg-slate-100 text-slate-700 border border-slate-200 font-bold',
  };

  const dotClasses = {
    success: 'bg-[#16A34A]',
    warning: 'bg-[#F59E0B]',
    danger: 'bg-[#EF4444]',
    info: 'bg-[#0284C7]',
    primary: 'bg-[#0B6B53]',
    accent: 'bg-[#F5B642]',
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
