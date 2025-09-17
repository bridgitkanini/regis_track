import { ReactElement } from 'react';
import { render, RenderOptions, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { expect } from 'vitest';
import { ThemeProvider } from '../src/contexts/ThemeContext';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { BrowserRouter } from 'react-router-dom';

type CustomRenderOptions = {
  route?: string;
  initialTheme?: 'light' | 'dark' | 'system';
} & Omit<RenderOptions, 'wrapper'>;

const AllTheProviders = ({
  children,
  initialTheme = 'system',
}: {
  children: React.ReactNode;
  initialTheme?: 'light' | 'dark' | 'system';
}) => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
        gcTime: 0,
      },
    },
  });

  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider defaultTheme={initialTheme}>
        <BrowserRouter>{children}</BrowserRouter>
      </ThemeProvider>
    </QueryClientProvider>
  );
};

const customRender = (
  ui: ReactElement,
  { route = '/', initialTheme = 'system', ...options }: CustomRenderOptions = {}
) => {
  window.history.pushState({}, 'Test page', route);

  return render(ui, {
    wrapper: ({ children }) => (
      <AllTheProviders initialTheme={initialTheme}>{children}</AllTheProviders>
    ),
    ...options,
  });
};

// Re-export everything
export * from '@testing-library/react';
// Override render method
export { customRender as render };

// Helper function to wait for a specific time (useful for testing async operations)
export const wait = (ms: number) =>
  new Promise((resolve) => setTimeout(resolve, ms));

// Helper function to mock a successful API response
export const mockSuccessResponse = <T,>(data: T) => ({
  ok: true,
  status: 200,
  json: async () => data,
  headers: new Headers({ 'Content-Type': 'application/json' }),
});

// Helper function to mock an error API response
export const mockErrorResponse = (status: number, message: string) => ({
  ok: false,
  status,
  statusText: message,
  json: async () => ({
    message,
    statusCode: status,
  }),
  headers: new Headers({ 'Content-Type': 'application/json' }),
});

// Helper to test form field validation
export const testFieldValidation = async (
  form: HTMLElement,
  fieldName: string,
  value: string,
  errorMessage: string
) => {
  const field = form.querySelector(`[name="${fieldName}"]`);
  if (!field) throw new Error(`Field ${fieldName} not found`);

  // Clear the field
  await userEvent.clear(field);

  // Enter the test value
  await userEvent.type(field, value);

  // Trigger validation by blurring
  await userEvent.tab();

  // Check if error message is displayed
  const errorElement = form.querySelector(`[data-testid="${fieldName}-error"]`);
  if (errorElement) {
    expect(errorElement).toHaveTextContent(errorMessage);
  } else {
    // If using a different error display pattern, check for the message in the document
    expect(screen.getByText(errorMessage)).toBeInTheDocument();
  }
};
