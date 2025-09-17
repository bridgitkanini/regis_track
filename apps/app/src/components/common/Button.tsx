import React, { ReactNode, ButtonHTMLAttributes, forwardRef } from 'react';
import { classNames } from '../../utils/classNames';

type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'danger' | 'ghost' | 'link';
type ButtonSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl' | 'default' | 'icon';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  variant?: ButtonVariant;
  size?: ButtonSize;
  fullWidth?: boolean;
  isLoading?: boolean;
  loading?: boolean; // alias for tests/legacy
  leftIcon?: ReactNode;
  rightIcon?: ReactNode;
  asChild?: boolean; // ignored but allowed for typing
}

const variantClasses = {
  primary: 'border-transparent text-white bg-indigo-600 hover:bg-indigo-700 focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500',
  secondary: 'border-transparent text-indigo-700 bg-indigo-100 hover:bg-indigo-200 focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500',
  outline: 'border-gray-300 text-gray-700 bg-white hover:bg-gray-50 focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500',
  danger: 'border-transparent text-white bg-red-600 hover:bg-red-700 focus:ring-2 focus:ring-offset-2 focus:ring-red-500',
  ghost: 'border-transparent text-gray-700 hover:bg-gray-100 focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500',
  link: 'bg-transparent border-transparent underline underline-offset-4 text-indigo-600 hover:text-indigo-700'
};

const sizeClasses = {
  xs: 'px-2.5 py-1.5 text-xs rounded',
  sm: 'px-3 py-2 text-sm leading-4 rounded-md',
  md: 'px-4 py-2 text-sm rounded-md',
  lg: 'px-4 py-2 text-base rounded-md',
  xl: 'px-6 py-3 text-base rounded-md',
  default: 'px-4 py-2 text-sm rounded-md',
  icon: 'h-10 w-10 p-0 inline-flex items-center justify-center rounded-md'
};

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(function Button(
  {
    children,
    variant = 'primary',
    size = 'md',
    type = 'button',
    fullWidth = false,
    disabled = false,
    isLoading,
    loading,
    leftIcon,
    rightIcon,
    className = '',
    ...props
  },
  ref
) {
  const baseClasses = 'inline-flex items-center justify-center border font-medium shadow-sm focus:outline-none';
  const widthClass = fullWidth ? 'w-full' : '';
  const effectiveLoading = isLoading ?? loading ?? false;
  const disabledClass = disabled || effectiveLoading ? 'opacity-60 cursor-not-allowed' : '';

  return (
    <button
      ref={ref}
      type={type as 'button' | 'submit' | 'reset' | undefined}
      className={classNames(
        baseClasses,
        variantClasses[variant],
        sizeClasses[size],
        widthClass,
        disabledClass,
        className
      )}
      disabled={disabled || effectiveLoading}
      {...props}
    >
      {effectiveLoading && (
        <svg
          className={classNames(
            'animate-spin -ml-1 mr-2',
            size === 'xs' ? 'h-3 w-3' : 'h-4 w-4',
            variant === 'primary' || variant === 'danger' ? 'text-white' : 'text-current'
          )}
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          data-testid="spinner"
        >
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
      )}
      {!effectiveLoading && leftIcon && <span className="mr-2">{leftIcon}</span>}
      {children}
      {rightIcon && <span className="ml-2">{rightIcon}</span>}
    </button>
  );
});

export default Button;