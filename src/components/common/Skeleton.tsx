import React from 'react';

export interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> {
  className?: string;
  variant?: 'text' | 'circular' | 'rectangular' | 'card' | 'stat-card' | 'table-row';
  lines?: number;
  width?: string | number;
  height?: string | number;
}

export const Skeleton: React.FC<SkeletonProps> = ({
  className = '',
  variant = 'rectangular',
  lines = 1,
  width,
  height,
  style,
  ...props
}) => {
  const customStyle: React.CSSProperties = {
    ...style,
    ...(width ? { width } : {}),
    ...(height ? { height } : {}),
  };

  if (variant === 'circular') {
    return (
      <div
        className={`shimmer-element rounded-full shrink-0 ${className}`}
        style={customStyle}
        aria-hidden="true"
        {...props}
      />
    );
  }

  if (variant === 'text') {
    return (
      <div className={`space-y-2 ${className}`} aria-hidden="true">
        {Array.from({ length: lines }).map((_, i) => (
          <div
            key={i}
            className={`shimmer-element h-3.5 rounded-md ${
              i === lines - 1 && lines > 1 ? 'w-4/5' : 'w-full'
            }`}
            style={customStyle}
            {...props}
          />
        ))}
      </div>
    );
  }

  if (variant === 'stat-card') {
    return (
      <div className={`p-5 rounded-2xl bg-white border border-slate-200/80 shadow-soft space-y-3 ${className}`} aria-hidden="true">
        <div className="flex justify-between items-center">
          <div className="shimmer-element h-3 w-24 rounded" />
          <div className="shimmer-element h-8 w-8 rounded-lg" />
        </div>
        <div className="shimmer-element h-8 w-32 rounded-lg" />
        <div className="shimmer-element h-3 w-20 rounded" />
      </div>
    );
  }

  if (variant === 'card') {
    return (
      <div className={`p-6 rounded-3xl bg-white border border-slate-200/80 shadow-soft space-y-4 ${className}`} aria-hidden="true">
        <div className="flex items-center gap-3">
          <div className="shimmer-element h-10 w-10 rounded-xl shrink-0" />
          <div className="space-y-1.5 flex-1">
            <div className="shimmer-element h-4 w-32 rounded" />
            <div className="shimmer-element h-3 w-24 rounded" />
          </div>
        </div>
        <div className="space-y-2 pt-2">
          <div className="shimmer-element h-3.5 w-full rounded" />
          <div className="shimmer-element h-3.5 w-5/6 rounded" />
          <div className="shimmer-element h-3.5 w-2/3 rounded" />
        </div>
      </div>
    );
  }

  if (variant === 'table-row') {
    return (
      <tr className="border-b border-slate-100" aria-hidden="true">
        <td className="p-4 pl-6">
          <div className="shimmer-element h-4 w-28 rounded mb-1" />
          <div className="shimmer-element h-3 w-20 rounded" />
        </td>
        <td className="p-4">
          <div className="shimmer-element h-4 w-24 rounded" />
        </td>
        <td className="p-4">
          <div className="shimmer-element h-4 w-16 rounded ml-auto" />
        </td>
        <td className="p-4">
          <div className="shimmer-element h-5 w-14 rounded-full mx-auto" />
        </td>
        <td className="p-4">
          <div className="shimmer-element h-4 w-20 rounded ml-auto" />
        </td>
        <td className="p-4 pr-6">
          <div className="shimmer-element h-4 w-16 rounded ml-auto" />
        </td>
      </tr>
    );
  }

  return (
    <div
      className={`shimmer-element rounded-xl ${className}`}
      style={customStyle}
      aria-hidden="true"
      {...props}
    />
  );
};
