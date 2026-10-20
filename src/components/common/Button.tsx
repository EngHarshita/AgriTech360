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
      'bg-[#0B6B53] text-white hover:bg-[#095B46] active:bg-[#073C2F] shadow-sm shadow-[#0B6B53]/25 hover:shadow-[#0B6B53]/40',
    secondary:
      'bg-[#1B8F6B] text-white hover:bg-[#147657] active:bg-[#104B39] shadow-sm shadow-[#1B8F6B]/25',
    accent:
      'bg-[#F5B642] text-slate-950 font-extrabold hover:bg-[#EA9C1E] active:bg-[#C77914] shadow-sm shadow-[#F5B642]/30',
    outline:
      'border border-black/[0.1] text-slate-800 bg-white hover:bg-slate-50 hover:border-black/[0.18] active:bg-slate-100 shadow-soft',
    ghost:
      'text-slate-700 bg-transparent hover:bg-black/[0.04] active:bg-black/[0.07] hover:text-slate-950',
    danger:
      'bg-[#EF4444] text-white hover:bg-rose-600 active:bg-rose-700 shadow-rose-600/20',
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
