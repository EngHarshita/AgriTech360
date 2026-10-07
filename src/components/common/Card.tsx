import React from 'react';

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  className?: string;
  hoverEffect?: boolean;
  glass?: boolean;
}

export const Card: React.FC<CardProps> = ({
  children,
  className = '',
  hoverEffect = false,
  glass = false,
  ...props
}) => {
  const base = glass
    ? 'glass-card rounded-2xl shadow-soft'
    : 'bg-white rounded-2xl border border-slate-200/80 shadow-soft';
  const hover = hoverEffect
    ? 'transition-all duration-300 hover:shadow-card hover:-translate-y-0.5 hover:border-slate-300'
    : '';

  return (
    <div className={`${base} ${hover} overflow-hidden ${className}`} {...props}>
      {children}
    </div>
  );
};

export const CardHeader: React.FC<{
  title: string | React.ReactNode;
  subtitle?: string | React.ReactNode;
  action?: React.ReactNode;
  icon?: React.ReactNode;
  className?: string;
}> = ({ title, subtitle, action, icon, className = '' }) => (
  <div className={`p-5 pb-4 border-b border-slate-100 flex items-start justify-between gap-4 ${className}`}>
    <div className="flex items-center gap-3">
      {icon && (
        <div className="w-10 h-10 rounded-xl bg-primary-50 text-primary-700 flex items-center justify-center shrink-0">
          {icon}
        </div>
      )}
      <div>
        <h3 className="text-base font-bold text-slate-900 tracking-tight">{title}</h3>
        {subtitle && <p className="text-xs text-slate-500 mt-0.5">{subtitle}</p>}
      </div>
    </div>
    {action && <div className="shrink-0">{action}</div>}
  </div>
);

export const CardContent: React.FC<{ children: React.ReactNode; className?: string }> = ({
  children,
  className = 'p-5',
}) => <div className={className}>{children}</div>;

export const CardFooter: React.FC<{ children: React.ReactNode; className?: string }> = ({
  children,
  className = '',
}) => (
  <div className={`p-4 bg-slate-50/60 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500 ${className}`}>
    {children}
  </div>
);
