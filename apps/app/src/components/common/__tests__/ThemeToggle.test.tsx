import { render, screen, fireEvent } from '@testing-library/react';
import { vi } from 'vitest';
import { ThemeToggle } from '../ThemeToggle';
import { ThemeProvider } from '../../../contexts/ThemeContext';

// Mock the ThemeContext
const mockSetTheme = vi.fn();

const renderWithTheme = (initialTheme = 'system') => {
  return render(
    <ThemeProvider initialTheme={initialTheme}>
      <ThemeToggle />
    </ThemeProvider>
  );
};

describe('ThemeToggle', () => {
  beforeEach(() => {
    // Clear all mocks before each test
    vi.clearAllMocks();

    // Mock matchMedia
    Object.defineProperty(window, 'matchMedia', {
      writable: true,
      value: vi.fn().mockImplementation((query) => ({
        matches: false,
        media: query,
        onchange: null,
        addListener: vi.fn(),
        removeListener: vi.fn(),
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
        dispatchEvent: vi.fn(),
      })),
    });
  });

  it('renders the theme toggle button', () => {
    renderWithTheme();
    const toggleButton = screen.getByRole('button', { name: /toggle theme/i });
    expect(toggleButton).toBeInTheDocument();
  });

  it('shows the sun icon when in light mode', () => {
    renderWithTheme('light');
    const sunIcon = screen.getByTestId('sun-icon');
    expect(sunIcon).toBeInTheDocument();
  });

  it('shows the moon icon when in dark mode', () => {
    renderWithTheme('dark');
    const moonIcon = screen.getByTestId('moon-icon');
    expect(moonIcon).toBeInTheDocument();
  });

  it('shows the theme selection menu when clicked', () => {
    renderWithTheme();
    const toggleButton = screen.getByRole('button', { name: /toggle theme/i });
    fireEvent.click(toggleButton);

    expect(screen.getByText('Light')).toBeInTheDocument();
    expect(screen.getByText('Dark')).toBeInTheDocument();
    expect(screen.getByText('System')).toBeInTheDocument();
  });

  it('calls setTheme with the selected theme when a theme is selected', () => {
    renderWithTheme();
    const toggleButton = screen.getByRole('button', { name: /toggle theme/i });
    fireEvent.click(toggleButton);

    const darkOption = screen.getByText('Dark');
    fireEvent.click(darkOption);

    // Since we can't directly test the context, we can verify the document class
    expect(document.documentElement.classList.contains('dark')).toBe(true);
  });
});
