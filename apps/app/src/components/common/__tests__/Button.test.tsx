import { render, screen, fireEvent } from '../../../../test/test-utils';
import { Button } from '../Button';
import { vi } from 'vitest';

describe('Button', () => {
  it('renders with default props', () => {
    render(<Button>Click me</Button>);
    const button = screen.getByRole('button', { name: /click me/i });

    expect(button).toBeInTheDocument();
    expect(button).toHaveClass('inline-flex', 'items-center', 'justify-center');
    expect(button).toHaveAttribute('type', 'button');
  });

  it('renders with custom className', () => {
    render(<Button className="custom-class">Custom Button</Button>);
    const button = screen.getByRole('button', { name: /custom button/i });

    expect(button).toHaveClass('custom-class');
  });

  it('renders as a link when asChild and as="a" are provided', () => {
    render(
      <Button asChild>
        <a href="/test">Link Button</a>
      </Button>
    );

    const link = screen.getByRole('link', { name: /link button/i });
    expect(link).toBeInTheDocument();
    expect(link).toHaveAttribute('href', '/test');
    expect(link).toHaveClass('inline-flex', 'items-center', 'justify-center');
  });

  it('calls onClick handler when clicked', () => {
    const handleClick = vi.fn();
    render(<Button onClick={handleClick}>Click me</Button>);

    const button = screen.getByRole('button', { name: /click me/i });
    fireEvent.click(button);

    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it('is disabled when disabled prop is true', () => {
    render(<Button disabled>Disabled Button</Button>);

    const button = screen.getByRole('button', { name: /disabled button/i });
    expect(button).toBeDisabled();
    expect(button).toHaveAttribute('aria-disabled', 'true');
  });

  it('shows loading state when loading is true', () => {
    render(<Button loading>Loading</Button>);

    const button = screen.getByRole('button', { name: /loading/i });
    const spinner = button.querySelector('[data-testid="spinner"]');

    expect(button).toBeDisabled();
    expect(spinner).toBeInTheDocument();
  });

  it('renders with different variants', () => {
    const { rerender } = render(<Button variant="primary">Primary</Button>);
    expect(screen.getByRole('button', { name: /primary/i })).toHaveClass(
      'bg-primary'
    );

    rerender(<Button variant="secondary">Secondary</Button>);
    expect(screen.getByRole('button', { name: /secondary/i })).toHaveClass(
      'bg-secondary'
    );

    rerender(<Button variant="outline">Outline</Button>);
    expect(screen.getByRole('button', { name: /outline/i })).toHaveClass(
      'border'
    );

    rerender(<Button variant="ghost">Ghost</Button>);
    expect(screen.getByRole('button', { name: /ghost/i })).toHaveClass(
      'hover:bg-accent'
    );

    rerender(<Button variant="link">Link</Button>);
    expect(screen.getByRole('button', { name: /link/i })).toHaveClass(
      'underline-offset-4'
    );
  });

  it('renders with different sizes', () => {
    const { rerender } = render(<Button size="sm">Small</Button>);
    expect(screen.getByRole('button', { name: /small/i })).toHaveClass(
      'h-9',
      'px-3',
      'rounded-md'
    );

    rerender(<Button size="default">Default</Button>);
    expect(screen.getByRole('button', { name: /default/i })).toHaveClass(
      'h-10',
      'px-4',
      'py-2'
    );

    rerender(<Button size="lg">Large</Button>);
    expect(screen.getByRole('button', { name: /large/i })).toHaveClass(
      'h-11',
      'px-8',
      'rounded-md'
    );

    rerender(<Button size="icon">Icon</Button>);
    expect(screen.getByRole('button', { name: /icon/i })).toHaveClass(
      'h-10',
      'w-10'
    );
  });

  it('renders with left and right icons', () => {
    const LeftIcon = () => <span data-testid="left-icon">←</span>;
    const RightIcon = () => <span data-testid="right-icon">→</span>;

    render(
      <Button leftIcon={<LeftIcon />} rightIcon={<RightIcon />}>
        With Icons
      </Button>
    );

    const button = screen.getByRole('button', { name: /with icons/i });
    expect(
      button.querySelector('[data-testid="left-icon"]')
    ).toBeInTheDocument();
    expect(
      button.querySelector('[data-testid="right-icon"]')
    ).toBeInTheDocument();
  });

  it('forwards ref to the button element', () => {
    const ref = { current: null } as React.RefObject<HTMLButtonElement>;
    render(<Button ref={ref}>Ref Button</Button>);

    expect(ref.current).toBeInstanceOf(HTMLButtonElement);
    expect(ref.current?.textContent).toBe('Ref Button');
  });
});
