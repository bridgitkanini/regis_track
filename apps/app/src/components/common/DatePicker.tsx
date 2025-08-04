import { forwardRef } from 'react';
import { classNames } from '../../utils/classNames';

type DatePickerSize = 'sm' | 'md' | 'lg';

interface DatePickerProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'size'> {
  label?: string;
  error?: string;
  inputSize?: DatePickerSize;
  fullWidth?: boolean;
}

const sizeClasses = {
  sm: 'py-1 px-2 text-sm',
  md: 'py-2 px-3 text-base',
  lg: 'py-3 px-4 text-lg',
};

const DatePicker = forwardRef<HTMLInputElement, DatePickerProps>(
  (
    {
      className = '',
      label,
      error,
      inputSize = 'md',
      fullWidth = false,
      id,
      ...props
    },
    ref
  ) => {
    const datePickerId = id || `datepicker-${Math.random().toString(36).substr(2, 9)}`;
    
    return (
      <div className={classNames(fullWidth ? 'w-full' : 'w-auto', 'space-y-1')}>
        {label && (
          <label
            htmlFor={datePickerId}
            className="block text-sm font-medium text-gray-700 dark:text-gray-300"
          >
            {label}
          </label>
        )}
        <div className="relative rounded-md shadow-sm">
          <input
            type="date"
            id={datePickerId}
            ref={ref}
            className={classNames(
              'block w-full rounded-md border border-gray-300 dark:border-gray-600',
              'focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500',
              'bg-white dark:bg-gray-800 text-gray-900 dark:text-white',
              'disabled:opacity-50 disabled:cursor-not-allowed',
              sizeClasses[inputSize],
              error
                ? 'border-red-500 focus:ring-red-500 focus:border-red-500'
                : '',
              className
            )}
            aria-invalid={!!error}
            aria-describedby={error ? `${datePickerId}-error` : undefined}
            {...props}
          />
        </div>
        {error && (
          <p
            className="mt-1 text-sm text-red-600 dark:text-red-400"
            id={`${datePickerId}-error`}
          >
            {error}
          </p>
        )}
      </div>
    );
  }
);

DatePicker.displayName = 'DatePicker';

export { DatePicker };
export type { DatePickerProps };
