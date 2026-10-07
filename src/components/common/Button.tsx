import React from 'react';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'accent' | 'outline' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'primary',
  size = 'md',
  isLoading = false,
  leftIcon,
  rightIcon,
  className = '',
  disabled,
  ...props
}) => {
  const baseClasses =
    'inline-flex items-center justify-center font-bold transition-all duration-200 rounded-xl focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-600 focus-visible:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed select-none active:scale-[0.98] cursor-pointer';

  const sizeClasses = {
    sm: 'text-xs min-h-[36px] px-3 py-1.5 gap-1.5',
    md: 'text-xs sm:text-sm min-h-[42px] px-4 py-2.5 gap-2 shadow-sm',
    lg: 'text-sm sm:text-base min-h-[48px] px-6 py-3.5 gap-2.5 shadow-md',
  };

  const variantClasses = {
    primary:
      'bg-emerald-600 text-white hover:bg-emerald-700 active:bg-emerald-800 shadow-emerald-600/20 hover:shadow-emerald-600/40',
    secondary:
      'bg-slate-900 text-white hover:bg-slate-800 active:bg-slate-950 shadow-slate-900/20',
    accent:
      'bg-amber-500 text-slate-950 font-extrabold hover:bg-amber-400 active:bg-amber-600 shadow-amber-500/25',
    outline:
      'border-2 border-slate-300 text-slate-800 bg-white hover:bg-slate-50 hover:border-slate-400 active:bg-slate-100',
    ghost:
      'text-slate-700 bg-transparent hover:bg-slate-100/80 active:bg-slate-200/80 hover:text-slate-950',
    danger:
      'bg-rose-600 text-white hover:bg-rose-700 active:bg-rose-800 shadow-rose-600/20',
  };

  return (
    <button
      className={`${baseClasses} ${sizeClasses[size]} ${variantClasses[variant]} ${className}`}
      disabled={disabled || isLoading}
      aria-busy={isLoading}
      {...props}
    >
      {isLoading ? (
        <svg
          className="animate-spin -ml-1 mr-2 h-4 w-4 text-current"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
        >
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
          ></circle>
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8v8H4z"
          ></path>
        </svg>
      ) : (
        leftIcon
      )}
      {children}
      {!isLoading && rightIcon}
    </button>
  );
};
