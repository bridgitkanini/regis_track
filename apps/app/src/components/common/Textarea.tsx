import { TextareaHTMLAttributes, forwardRef } from 'react';
import { classNames } from '../../utils/classNames';

type TextareaSize = 'sm' | 'md' | 'lg';

interface TextareaProps extends Omit<TextareaHTMLAttributes<HTMLTextAreaElement>, 'size'> {
  label?: string;
  error?: string;
  inputSize?: TextareaSize;
  fullWidth?: boolean;
  rows?: number;
}

const sizeClasses = {
  sm: 'py-1 px-2 text-sm',
  md: 'py-2 px-3 text-base',
  lg: 'py-3 px-4 text-lg',
};

const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  (
    {
      className = '',
      label,
      error,
      inputSize = 'md',
      fullWidth = false,
      rows = 3,
      id,
      ...props
    },
    ref
  ) => {
    const textareaId = id || `textarea-${Math.random().toString(36).substr(2, 9)}`;
    
    return (
      <div className={classNames(fullWidth ? 'w-full' : 'w-auto', 'space-y-1')}>
        {label && (
          <label
            htmlFor={textareaId}
            className="block text-sm font-medium text-gray-700 dark:text-gray-300"
          >
            {label}
          </label>
        )}
        <div className="mt-1">
          <textarea
            id={textareaId}
            ref={ref}
            rows={rows}
            className={classNames(
              'block w-full rounded-md border border-gray-300 dark:border-gray-600',
              'focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500',
              'bg-white dark:bg-gray-800 text-gray-900 dark:text-white',
              'placeholder-gray-400 dark:placeholder-gray-500',
              'disabled:opacity-50 disabled:cursor-not-allowed',
              sizeClasses[inputSize],
              error
                ? 'border-red-500 focus:ring-red-500 focus:border-red-500'
                : '',
              className
            )}
            aria-invalid={!!error}
            aria-describedby={error ? `${textareaId}-error` : undefined}
            {...props}
          />
        </div>
        {error && (
          <p
            className="mt-1 text-sm text-red-600 dark:text-red-400"
            id={`${textareaId}-error`}
          >
            {error}
          </p>
        )}
      </div>
    );
  }
);

Textarea.displayName = 'Textarea';

export { Textarea };
export type { TextareaProps };
