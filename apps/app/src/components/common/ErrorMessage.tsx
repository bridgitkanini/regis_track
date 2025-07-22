import { ExclamationTriangleIcon } from '@heroicons/react/24/outline';

type ErrorMessageProps = {
  title: string;
  message: string;
  onRetry?: () => void;
};

export const ErrorMessage = ({ title, message, onRetry }: ErrorMessageProps) => {
  return (
    <div className="rounded-md bg-red-50 p-4">
      <div className="flex">
        <div className="flex-shrink-0">
          <ExclamationTriangleIcon className="h-5 w-5 text-red-400" aria-hidden="true" />
        </div>
        <div className="ml-3">
          <h3 className="text-sm font-medium text-red-800">{title}</h3>
          <div className="mt-2 text-sm text-red-700">
            <p>{message}</p>
          </div>
          {onRetry && (
            <div className="mt-4">
              <button
                type="button"
                className="rounded-md bg-red-50 px-2 py-1.5 text-sm font-medium text-red-800 hover:bg-red-100 focus:outline-none focus:ring-2 focus:ring-red-600 focus:ring-offset-2 focus:ring-offset-red-50"
                onClick={onRetry}
              >
                Retry
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
