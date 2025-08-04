import { useCallback } from 'react';
import { toast } from 'react-hot-toast';

interface ApiError {
  message?: string;
  error?: string;
  statusCode?: number;
  data?: {
    message?: string;
    error?: string;
    statusCode?: number;
  };
}

/**
 * A custom hook to handle API errors consistently across the application.
 * It extracts error messages from various error formats and displays them using toast notifications.
 * 
 * @returns An object containing the `handleError` function
 */
export const useApiError = () => {
  /**
   * Handles API errors by extracting the error message and displaying it using toast.
   * Supports multiple error formats including Axios errors, standard Error objects,
   * and custom API error responses.
   * 
   * @param error - The error object from the API call
   * @param defaultMessage - Default message to show if the error doesn't contain a message
   * @param options - Additional options for error handling
   * @param options.toastId - A unique ID for the toast to prevent duplicates
   * @param options.duration - Duration in milliseconds to show the toast
   * @returns The extracted error message
   */
  const handleError = useCallback(
    (
      error: unknown,
      defaultMessage = 'An error occurred. Please try again.',
      options: { toastId?: string; duration?: number } = {}
    ): string => {
      let errorMessage = defaultMessage;

      // Handle different error formats
      if (error instanceof Error) {
        // Standard Error object
        errorMessage = error.message || defaultMessage;
      } else if (typeof error === 'string') {
        // String error
        errorMessage = error;
      } else if (error && typeof error === 'object') {
        // Axios error or custom API error
        const apiError = error as ApiError;
        
        // Try to extract the most specific error message
        if (apiError.message) {
          errorMessage = apiError.message;
        } else if (apiError.error) {
          errorMessage = apiError.error;
        } else if (apiError.data) {
          if (typeof apiError.data === 'string') {
            errorMessage = apiError.data;
          } else if (apiError.data.message) {
            errorMessage = apiError.data.message;
          } else if (apiError.data.error) {
            errorMessage = apiError.data.error;
          }
        }
      }

      // Show error toast
      toast.error(errorMessage, {
        id: options.toastId,
        duration: options.duration || 5000,
        position: 'top-center',
      });

      // Log the full error in development
      if (process.env.NODE_ENV === 'development') {
        console.error('API Error:', error);
      }

      return errorMessage;
    },
    []
  );

  return { handleError };
};

export default useApiError;
