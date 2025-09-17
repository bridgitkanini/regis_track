import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '../../lib/utils';

const badgeVariants = cva(
  'inline-flex items-center rounded-full border font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2',
  {
    variants: {
      variant: {
        default:
          'border-transparent bg-primary text-primary-foreground hover:bg-primary/80',
        secondary:
          'border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80',
        destructive:
          'border-transparent bg-destructive text-destructive-foreground hover:bg-destructive/80',
        outline: 'text-foreground',
        success:
          'border-transparent bg-emerald-500/15 text-emerald-700 dark:text-emerald-400',
        warning:
          'border-transparent bg-amber-500/15 text-amber-700 dark:text-amber-400',
        error:
          'border-transparent bg-red-500/15 text-red-700 dark:text-red-400',
        info: 'border-transparent bg-blue-500/15 text-blue-700 dark:text-blue-400',
      },
      size: {
        sm: 'text-xs px-2 py-0.5',
        default: 'text-sm px-2.5 py-0.5',
        lg: 'text-base px-3 py-1',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  }
);

export interface BadgeProps extends VariantProps<typeof badgeVariants> {
  as?: 'div' | 'button';
  icon?: React.ReactNode;
  onClick?: () => void;
  className?: string;
  children?: React.ReactNode;
  [key: string]: any; // Allow other props
}

function Badge({
  className,
  variant,
  size,
  icon,
  children,
  onClick,
  as,
  ...props
}: BadgeProps) {
  const Component = as || (onClick ? 'button' : 'div');

  return (
    <Component
      className={cn(
        badgeVariants({ variant, size }),
        {
          'cursor-pointer': onClick,
          'gap-1.5': icon,
        },
        className
      )}
      onClick={onClick}
      {...props}
    >
      {icon && <span className="flex-shrink-0">{icon}</span>}
      {children}
    </Component>
  );
}
