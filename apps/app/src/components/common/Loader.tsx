import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '../../lib/utils';

const loaderVariants = cva('animate-spin', {
  variants: {
    variant: {
      default: 'text-primary',
      primary: 'text-primary',
      secondary: 'text-secondary',
      destructive: 'text-destructive',
      success: 'text-emerald-600 dark:text-emerald-400',
      warning: 'text-amber-600 dark:text-amber-400',
      error: 'text-destructive',
      info: 'text-blue-600 dark:text-blue-400',
    },
    size: {
      xs: 'h-3 w-3',
      sm: 'h-4 w-4',
      md: 'h-6 w-6',
      lg: 'h-8 w-8',
      xl: 'h-12 w-12',
    },
  },
  defaultVariants: {
    variant: 'primary',
    size: 'md',
  },
});

export interface LoaderProps
  extends React.SVGAttributes<SVGSVGElement>,
    VariantProps<typeof loaderVariants> {
  /**
   * Optional label for screen readers
   */
  label?: string;
  /**
   * Optional class name for the container
   */
  containerClassName?: string;
}

export function Loader({
  className,
  variant,
  size,
  label = 'Loading...',
  containerClassName,
  ...props
}: LoaderProps) {
  return (
    <div
      className={cn('flex items-center justify-center', containerClassName)}
      role="status"
      aria-label={label}
    >
      <svg
        className={cn(loaderVariants({ variant, size, className }))}
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        aria-hidden="true"
        {...props}
      >
        <circle
          className="opacity-25"
          cx="12"
          cy="12"
          r="10"
          stroke="currentColor"
          strokeWidth="4"
        />
        <path
          className="opacity-75"
          fill="currentColor"
          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
        />
      </svg>
      <span className="sr-only">{label}</span>
    </div>
  );
}

// Spinner component (alternative style)
export function Spinner({
  className,
  variant = 'primary',
  size = 'md',
  ...props
}: Omit<LoaderProps, 'variant' | 'size'> & {
  variant?: 'primary' | 'secondary' | 'default';
  size?: 'sm' | 'md' | 'lg';
}) {
  const sizeClasses = {
    sm: 'h-4 w-4 border-2',
    md: 'h-6 w-6 border-[3px]',
    lg: 'h-8 w-8 border-4',
  };

  const variantClasses = {
    default:
      'border-t-primary border-r-primary/30 border-b-primary/30 border-l-primary/30',
    primary:
      'border-t-primary border-r-primary/30 border-b-primary/30 border-l-primary/30',
    secondary:
      'border-t-secondary border-r-secondary/30 border-b-secondary/30 border-l-secondary/30',
  };

  return (
    <div
      className={cn(
        'inline-block animate-spin rounded-full',
        sizeClasses[size],
        variantClasses[variant],
        className
      )}
      role="status"
      {...props}
    >
      <span className="sr-only">Loading...</span>
    </div>
  );
}
