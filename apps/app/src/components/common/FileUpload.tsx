import { ChangeEvent, forwardRef, useRef, useState } from 'react';
import { classNames } from '../../utils/classNames';

type FileUploadSize = 'sm' | 'md' | 'lg';

interface FileUploadProps {
  label?: string;
  error?: string;
  size?: FileUploadSize;
  fullWidth?: boolean;
  accept?: string;
  multiple?: boolean;
  onChange?: (files: FileList | null) => void;
  className?: string;
  id?: string;
  disabled?: boolean;
}

const sizeClasses = {
  sm: 'py-1 px-2 text-sm',
  md: 'py-2 px-3 text-base',
  lg: 'py-3 px-4 text-lg',
};

const FileUpload = forwardRef<HTMLInputElement, FileUploadProps>(
  (
    {
      label,
      error,
      size = 'md',
      fullWidth = false,
      accept,
      multiple = false,
      onChange,
      className = '',
      id,
      disabled = false,
      ...props
    },
    ref
  ) => {
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [fileName, setFileName] = useState<string>('');
    const fileUploadId = id || `file-upload-${Math.random().toString(36).substr(2, 9)}`;

    const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
      const files = e.target.files;
      if (files && files.length > 0) {
        setFileName(multiple ? `${files.length} files selected` : files[0].name);
      } else {
        setFileName('');
      }
      if (onChange) {
        onChange(files);
      }
    };

    const triggerFileInput = () => {
      if (fileInputRef.current) {
        fileInputRef.current.click();
      }
    };

    return (
      <div className={classNames(fullWidth ? 'w-full' : 'w-auto', 'space-y-1')}>
        {label && (
          <label
            htmlFor={fileUploadId}
            className="block text-sm font-medium text-gray-700 dark:text-gray-300"
          >
            {label}
          </label>
        )}
        <div className="flex items-center">
          <input
            type="file"
            id={fileUploadId}
            ref={(node) => {
              if (typeof ref === 'function') {
                ref(node);
              } else if (ref) {
                ref.current = node;
              }
              fileInputRef.current = node;
            }}
            className="hidden"
            accept={accept}
            multiple={multiple}
            onChange={handleFileChange}
            disabled={disabled}
            {...props}
          />
          <div className="flex-1">
            <div
              className={classNames(
                'flex-1 flex items-center justify-between px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md',
                'focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500',
                'bg-white dark:bg-gray-800 text-gray-900 dark:text-white',
                'disabled:opacity-50 disabled:cursor-not-allowed',
                sizeClasses[size],
                error ? 'border-red-500 focus:ring-red-500 focus:border-red-500' : '',
                className
              )}
              onClick={!disabled ? triggerFileInput : undefined}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  if (!disabled) triggerFileInput();
                }
              }}
            >
              <span className={classNames(!fileName && 'text-gray-400 dark:text-gray-500')}>
                {fileName || 'Choose a file...'}
              </span>
              <span className="ml-3">
                <svg
                  className="h-5 w-5 text-gray-400"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                  />
                </svg>
              </span>
            </div>
          </div>
        </div>
        {error && (
          <p className="mt-1 text-sm text-red-600 dark:text-red-400" id={`${fileUploadId}-error`}>
            {error}
          </p>
        )}
      </div>
    );
  }
);

FileUpload.displayName = 'FileUpload';

export { FileUpload };
export type { FileUploadProps };
