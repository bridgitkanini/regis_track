import { render, screen, waitFor, fireEvent, RenderOptions } from '../../../../test/test-utils';
import MemberForm from '../MemberForm';
import { describe, vi, beforeEach, it, expect } from 'vitest';
import { QueryClient } from '@tanstack/react-query';
import userEvent from '@testing-library/user-event';
import { QueryClientProvider } from '@tanstack/react-query';

type CustomRenderOptions = RenderOptions & {
  route?: string;
  initialTheme?: 'light' | 'dark' | 'system';
  wrapper?: React.ComponentType<{ children: React.ReactNode }>;
};

// Mock the API client
vi.mock('../../../lib/api/client', () => ({
  default: {
    get: vi.fn(),
    post: vi.fn(),
    put: vi.fn(),
  },
}));

// Mock the react-router-dom hooks
const mockNavigate = vi.fn();
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => mockNavigate,
    useParams: () => ({}),
  };
});

// Mock the react-hot-toast
vi.mock('react-hot-toast', () => ({
  toast: {
    success: vi.fn(),
    error: vi.fn(),
  },
}));

describe('MemberForm', () => {
  const mockRoles = [
    { _id: '1', name: 'Admin', permissions: ['all'] },
    { _id: '2', name: 'Member', permissions: ['read'] },
  ];

  const renderMemberForm = (isEdit = false, options: CustomRenderOptions = {}) => {
    const queryClient = new QueryClient();
  
    // Mock the roles query
    queryClient.setQueryData(['roles'], mockRoles);
  
    if (isEdit) {
      // Mock the member data for edit mode
      queryClient.setQueryData(['member', '123'], {
        _id: '123',
        firstName: 'John',
        lastName: 'Doe',
        email: 'john.doe@example.com',
        status: 'active',
        roleId: '1',
        dateOfBirth: '1990-01-01',
      });
    }
  
    const Wrapper = ({ children }: { children: React.ReactNode }) => (
      <QueryClientProvider client={queryClient}>
        {children}
      </QueryClientProvider>
    );

    return render(
      <Wrapper>
        <MemberForm />
      </Wrapper>,
      options
    );
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders the form with all fields', async () => {
    renderMemberForm();

    // Check if all form fields are rendered
    expect(screen.getByLabelText(/first name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/last name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/phone/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/address/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/city/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/state/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/postal code/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/country/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/date of birth/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/gender/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/status/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/role/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/notes/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/profile picture/i)).toBeInTheDocument();
  });

  it('validates required fields', async () => {
    renderMemberForm();

    // Submit the form without filling any fields
    const submitButton = screen.getByRole('button', { name: /save member/i });
    await userEvent.click(submitButton);

    // Check for validation errors
    expect(
      await screen.findByText(/first name is required/i)
    ).toBeInTheDocument();
    expect(
      await screen.findByText(/last name is required/i)
    ).toBeInTheDocument();
    expect(await screen.findByText(/email is required/i)).toBeInTheDocument();
    expect(await screen.findByText(/status is required/i)).toBeInTheDocument();
    expect(await screen.findByText(/role is required/i)).toBeInTheDocument();
  });

  it('validates email format', async () => {
    renderMemberForm();

    const emailInput = screen.getByLabelText(/email/i);

    // Enter an invalid email
    await userEvent.type(emailInput, 'invalid-email');
    await userEvent.tab(); // Trigger blur

    expect(
      await screen.findByText(/must be a valid email/i)
    ).toBeInTheDocument();

    // Clear and enter a valid email
    await userEvent.clear(emailInput);
    await userEvent.type(emailInput, 'valid@example.com');
    await userEvent.tab();

    expect(
      screen.queryByText(/must be a valid email/i)
    ).not.toBeInTheDocument();
  });

  it('submits the form with valid data', async () => {
    const mockPost = vi.fn().mockResolvedValueOnce({
      data: {
        success: true,
        data: { _id: '123', firstName: 'John', lastName: 'Doe' },
      },
    });

    // Mock the API client
    const apiClient = await import('../../../lib/api/client');
    apiClient.default.post = mockPost;

    renderMemberForm();

    // Fill in the form
    await userEvent.type(screen.getByLabelText(/first name/i), 'John');
    await userEvent.type(screen.getByLabelText(/last name/i), 'Doe');
    await userEvent.type(
      screen.getByLabelText(/email/i),
      'john.doe@example.com'
    );

    // Select role from dropdown
    const roleSelect = screen.getByLabelText(/role/i);
    await userEvent.click(roleSelect);
    const roleOption = await screen.findByText('Admin');
    await userEvent.click(roleOption);

    // Submit the form
    const submitButton = screen.getByRole('button', { name: /save member/i });
    await userEvent.click(submitButton);

    // Check if the form was submitted with the correct data
    await waitFor(() => {
      expect(mockPost).toHaveBeenCalledWith(
        '/api/members',
        expect.any(FormData),
        expect.objectContaining({
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        })
      );
    });

    // Check if success toast was shown
    const { toast } = await import('react-hot-toast');
    expect(toast.success).toHaveBeenCalledWith('Member created successfully');

    // Check if navigation occurred
    expect(mockNavigate).toHaveBeenCalledWith('/members');
  });

  it('handles form submission error', async () => {
    const errorMessage = 'Failed to create member';
    const mockPost = vi.fn().mockRejectedValueOnce({
      response: {
        data: {
          message: errorMessage,
        },
      },
    });

    // Mock the API client
    const apiClient = await import('../../../lib/api/client');
    apiClient.default.post = mockPost;

    renderMemberForm();

    // Fill in the form
    await userEvent.type(screen.getByLabelText(/first name/i), 'John');
    await userEvent.type(screen.getByLabelText(/last name/i), 'Doe');
    await userEvent.type(
      screen.getByLabelText(/email/i),
      'john.doe@example.com'
    );

    // Select role from dropdown
    const roleSelect = screen.getByLabelText(/role/i);
    await userEvent.click(roleSelect);
    const roleOption = await screen.findByText('Admin');
    await userEvent.click(roleOption);

    // Submit the form
    const submitButton = screen.getByRole('button', { name: /save member/i });
    await userEvent.click(submitButton);

    // Check if error toast was shown
    const { toast } = await import('react-hot-toast');
    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith(errorMessage);
    });
  });

  it('pre-fills the form in edit mode', async () => {
    renderMemberForm(true);

    // Check if form fields are pre-filled with member data
    expect(screen.getByLabelText(/first name/i)).toHaveValue('John');
    expect(screen.getByLabelText(/last name/i)).toHaveValue('Doe');
    expect(screen.getByLabelText(/email/i)).toHaveValue('john.doe@example.com');

    // Check if the submit button has the correct text
    expect(
      screen.getByRole('button', { name: /update member/i })
    ).toBeInTheDocument();
  });

  it('updates a member in edit mode', async () => {
    const mockPut = vi.fn().mockResolvedValueOnce({
      data: {
        success: true,
        data: { _id: '123', firstName: 'John', lastName: 'Doe' },
      },
    });

    // Mock the API client
    const apiClient = await import('../../../lib/api/client');
    apiClient.default.put = mockPut;

    renderMemberForm(true);

    // Update a field
    const firstNameInput = screen.getByLabelText(/first name/i);
    await userEvent.clear(firstNameInput);
    await userEvent.type(firstNameInput, 'Johnny');

    // Submit the form
    const submitButton = screen.getByRole('button', { name: /update member/i });
    await userEvent.click(submitButton);

    // Check if the form was submitted with the updated data
    await waitFor(() => {
      expect(mockPut).toHaveBeenCalledWith(
        '/api/members/123',
        expect.any(FormData),
        expect.objectContaining({
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        })
      );
    });

    // Check if success toast was shown
    const { toast } = await import('react-hot-toast');
    expect(toast.success).toHaveBeenCalledWith('Member updated successfully');

    // Check if navigation occurred
    expect(mockNavigate).toHaveBeenCalledWith('/members');
  });
});
