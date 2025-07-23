import { AlertTriangle, AlertCircle, CheckCircle2, Info } from 'lucide-react';
import { cn } from '../../lib/utils';
import { Button } from './Button';

type Variant = 'error' | 'warning' | 'success' | 'info';

type ErrorMessageProps = {
  /** Title of the message */
  title: string;
  /** Main message content */
  message: React.ReactNode;
  /** Optional callback for retry action */
  onRetry?: () => void;
  /** Custom class name for the container */
  className?: string;
  /** Variant of the message */
  variant?: Variant;
  /** Optional custom icon */
  icon?: React.ReactNode;
  /** Additional actions to display */
  actions?: React.ReactNode;
};

const variantStyles = {
  error: {
    container: 'bg-destructive/10 border border-destructive/20',
    title: 'text-destructive',
    message: 'text-destructive/90',
    icon: <AlertTriangle className="h-5 w-5 text-destructive" />,
  },
  warning: {
    container: 'bg-amber-500/10 border border-amber-500/20',
    title: 'text-amber-800 dark:text-amber-500',
    message: 'text-amber-700/90 dark:text-amber-400/90',
    icon: (
      <AlertCircle className="h-5 w-5 text-amber-600 dark:text-amber-400" />
    ),
  },
  success: {
    container: 'bg-emerald-500/10 border border-emerald-500/20',
    title: 'text-emerald-800 dark:text-emerald-500',
    message: 'text-emerald-700/90 dark:text-emerald-400/90',
    icon: (
      <CheckCircle2 className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
    ),
  },
  info: {
    container: 'bg-blue-500/10 border border-blue-500/20',
    title: 'text-blue-800 dark:text-blue-500',
    message: 'text-blue-700/90 dark:text-blue-400/90',
    icon: <Info className="h-5 w-5 text-blue-600 dark:text-blue-400" />,
  },
};

export function ErrorMessage({
  title,
  message,
  onRetry,
  className,
  variant = 'error',
  icon,
  actions,
}: ErrorMessageProps) {
  const styles = variantStyles[variant];

  return (
    <div
      className={cn('rounded-lg p-4', styles.container, className)}
      role="alert"
    >
      <div className="flex">
        <div className="flex-shrink-0 pt-0.5">{icon || styles.icon}</div>
        <div className="ml-3 flex-1">
          <h3 className={cn('text-sm font-medium', styles.title)}>{title}</h3>
          <div className={cn('mt-1 text-sm', styles.message)}>
            {typeof message === 'string' ? <p>{message}</p> : message}
          </div>

          {(onRetry || actions) && (
            <div className="mt-4 flex flex-wrap gap-3">
              {onRetry && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={onRetry}
                  className="border-current text-current hover:bg-current/5"
                >
                  Retry
                </Button>
              )}
              {actions}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// Export convenience components for each variant
export function ErrorAlert(props: Omit<ErrorMessageProps, 'variant'>) {
  return <ErrorMessage variant="error" {...props} />;
}

export function WarningAlert(props: Omit<ErrorMessageProps, 'variant'>) {
  return <ErrorMessage variant="warning" {...props} />;
}

export function SuccessAlert(props: Omit<ErrorMessageProps, 'variant'>) {
  return <ErrorMessage variant="success" {...props} />;
}

export function InfoAlert(props: Omit<ErrorMessageProps, 'variant'>) {
  return <ErrorMessage variant="info" {...props} />;
}

export default ErrorMessage;
