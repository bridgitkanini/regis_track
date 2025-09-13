import { useEffect, useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import type { SubmitHandler } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { useNavigate, useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { toast } from 'react-hot-toast';
import { Loader } from '../common/Loader';
import { Button } from '../common/Button';
import { Input } from '../common/Input';
import { Select } from '../common/Select';
import { Textarea } from '../common/Textarea';
import { DatePicker } from '../common/DatePicker';
import { FileUpload } from '../common/FileUpload';
import { cn } from '../../lib/utils';
import apiClient from '../../lib/api/client';
import { Role } from '../../types/role';

// Define the API response type
type ApiResponse<T> = {
  success: boolean;
  message?: string;
  data: T;
};

// Define the form values type
type FormValues = {
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  address?: string;
  city?: string;
  state?: string;
  postalCode?: string;
  country?: string;
  dateOfBirth: Date | null;
  gender?: 'male' | 'female' | 'other' | 'prefer-not-to-say';
  status: 'active' | 'inactive' | 'pending';
  roleId: string;
  notes?: string;
  profilePicture?: FileList;
};

// Define the structure of the error response from the API
interface ErrorResponse {
  message?: string;
  error?: string;
  statusCode?: number;
  [key: string]: unknown;
}

// Type guard for Axios error
const isAxiosError = (
  error: unknown
): error is { response?: { data?: unknown } } => {
  return typeof error === 'object' && error !== null && 'response' in error;
};

// Helper function to handle API errors
const handleApiError = (error: unknown, defaultMessage: string): string => {
  if (isAxiosError(error)) {
    const responseData = error.response?.data as ErrorResponse | undefined;
    return responseData?.message || responseData?.error || defaultMessage;
  }
  return defaultMessage;
};

// Convert FormValues to FormData for API submission
const toMemberFormData = (values: FormValues): FormData => {
  const formData = new FormData();

  // Append all form fields to FormData
  Object.entries(values).forEach(([key, value]) => {
    if (value !== undefined && value !== null) {
      if (
        key === 'profilePicture' &&
        value instanceof FileList &&
        value.length > 0
      ) {
        formData.append(key, value[0]);
      } else if (value instanceof Date) {
        formData.append(key, value.toISOString().split('T')[0]);
      } else if (typeof value === 'object') {
        formData.append(key, JSON.stringify(value));
      } else {
        formData.append(key, String(value));
      }
    }
  });

  return formData;
};

// Define the form validation schema using yup
const memberSchema = yup.object({
  firstName: yup.string().required('First name is required'),
  lastName: yup.string().required('Last name is required'),
  email: yup
    .string()
    .email('Please enter a valid email address')
    .required('Email is required'),
  phone: yup
    .string()
    .matches(
      /^[+]?[(]?[0-9]{1,4}[)]?[-\s.]?[0-9]{1,4}[-\s.]?[0-9]{1,9}$/,
      'Please enter a valid phone number'
    )
    .nullable()
    .optional(),
  address: yup.string().nullable().optional(),
  city: yup.string().nullable().optional(),
  state: yup.string().nullable().optional(),
  postalCode: yup.string().nullable().optional(),
  country: yup.string().nullable().optional(),
  dateOfBirth: yup
    .date()
    .nullable()
    .max(new Date(), 'Date of birth cannot be in the future')
    .typeError('Please enter a valid date'),
  gender: yup
    .string()
    .oneOf(
      ['male', 'female', 'other', 'prefer-not-to-say'],
      'Please select a valid gender'
    )
    .nullable()
    .optional(),
  status: yup
    .string()
    .oneOf(['active', 'inactive', 'pending'], 'Please select a valid status')
    .required('Status is required'),
  roleId: yup.string().required('Role is required'),
  notes: yup.string().nullable().optional(),
  profilePicture: yup
    .mixed()
    .test('fileSize', 'File size is too large (max 5MB)', (value) => {
      if (!value || !(value instanceof FileList) || value.length === 0)
        return true;
      return value[0].size <= 5 * 1024 * 1024; // 5MB
    }),
});

export const MemberForm = () => {
  const { id } = useParams<{ id?: string }>();
  const isEditing = !!id;
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [previewImage, setPreviewImage] = useState<string | null>(null);

  // Fetch roles for the role dropdown
  const {
    data: roles = [],
    isLoading: isLoadingRoles,
    error: rolesError,
  } = useQuery<Role[], Error>({
    queryKey: ['roles'],
    queryFn: async (): Promise<Role[]> => {
      try {
        const response = await apiClient.get<ApiResponse<Role[]>>('/api/roles');
        if (!response.data.success || !response.data.data) {
          throw new Error('Failed to fetch roles: Invalid response format');
        }
        return response.data.data;
      } catch (error) {
        const errorMessage = handleApiError(error, 'Failed to fetch roles');
        throw new Error(errorMessage);
      }
    },
  });

  // Member type for API responses
  type ApiMember = Omit<FormValues, 'dateOfBirth'> & {
    id: string;
    dateOfBirth?: string;
    profilePicture?: string;
  };

  // Fetch member data if in edit mode
  const { data: memberData, isLoading: isLoadingMember } = useQuery<
    FormValues | null,
    Error
  >({
    queryKey: ['member', id],
    queryFn: async (): Promise<FormValues | null> => {
      if (!id) return null;
      try {
        const response = await apiClient.get<ApiResponse<ApiMember>>(
          `/api/members/${id}`
        );
        const member = response.data.data;

        if (!member) {
          throw new Error('Member not found');
        }

        // Create a new object with all required FormValues properties
        const formValues: FormValues = {
          firstName: member.firstName || '',
          lastName: member.lastName || '',
          email: member.email || '',
          phone: member.phone,
          address: member.address,
          city: member.city,
          state: member.state,
          postalCode: member.postalCode,
          country: member.country,
          dateOfBirth: member.dateOfBirth ? new Date(member.dateOfBirth) : null,
          gender: member.gender,
          status: member.status || 'active',
          roleId: member.roleId || '',
          notes: member.notes,
        };

        // Set preview image if it exists
        if (member.profilePicture) {
          setPreviewImage(member.profilePicture);
        }

        return formValues;
      } catch (error) {
        const errorMessage = handleApiError(
          error,
          'Failed to load member data'
        );
        throw new Error(errorMessage);
      }
    },
    enabled: isEditing,
  });

  // Handle query errors
  useEffect(() => {
    if (rolesError) {
      toast.error(rolesError.message);
    }
  }, [rolesError]);

  // Initialize the form with react-hook-form
  const {
    control,
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
    watch,
  } = useForm<FormValues>({
    resolver: yupResolver(memberSchema) as any,
    defaultValues: {
      firstName: '',
      lastName: '',
      email: '',
      status: 'active',
      roleId: '',
      dateOfBirth: null,
    },
  });

  // Set form default values when member data is loaded
  useEffect(() => {
    if (memberData) {
      Object.entries(memberData).forEach(([key, value]) => {
        setValue(key as keyof FormValues, value as any);
      });
    }
  }, [memberData, setValue]);

  // Handle file input change for profile picture
  const handleFileChange = (files: FileList | null) => {
    const file = files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  // Form submission handler
  const onSubmit: SubmitHandler<FormValues> = async (data) => {
    setIsSubmitting(true);
    try {
      const formData = toMemberFormData(data);

      if (isEditing && id) {
        // Update existing member
        await apiClient.put(`/api/members/${id}`, formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });
        toast.success('Member updated successfully');
      } else {
        // Create new member
        await apiClient.post('/api/members', formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });
        toast.success('Member created successfully');
      }

      navigate('/members');
    } catch (error) {
      const errorMessage = handleApiError(
        error,
        isEditing ? 'Failed to update member' : 'Failed to create member'
      );
      toast.error(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Loading state
  if (isLoadingMember || isLoadingRoles) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="md:grid md:grid-cols-3 md:gap-6">
        <div className="md:col-span-1">
          <div className="px-4 sm:px-0">
            <h3 className="text-lg font-medium leading-6 text-foreground">
              {isEditing ? 'Edit Member' : 'Add New Member'}
            </h3>
            <p className="mt-1 text-sm text-muted-foreground">
              {isEditing
                ? 'Update the member details below.'
                : 'Fill in the form to add a new member.'}
            </p>
          </div>
        </div>

        <div className="mt-5 md:col-span-2 md:mt-0">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* Profile Picture Upload */}
            <div className="sm:col-span-6">
              <div className="flex items-center">
                <div className="mr-4">
                  <div className="h-20 w-20 rounded-full bg-muted overflow-hidden">
                    {previewImage ? (
                      <img
                        src={previewImage}
                        alt="Profile preview"
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <div className="h-full w-full flex items-center justify-center bg-primary/10 text-primary">
                        <span className="text-xl font-medium">
                          {watch('firstName')?.[0]?.toUpperCase()}
                          {watch('lastName')?.[0]?.toUpperCase()}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
                <div>
                  <FileUpload
                    id="profilePicture"
                    accept="image/*"
                    {...register('profilePicture')}
                    onChange={handleFileChange}
                    className="mt-2"
                  />
                  {errors.profilePicture && (
                    <p className="mt-1 text-sm text-destructive">
                      {errors.profilePicture.message}
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* Personal Information */}
            <div className="border-b border-border pb-6">
              <h4 className="text-base font-medium text-foreground mb-4">
                Personal Information
              </h4>

              <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
                <div className="sm:col-span-3">
                  <Input
                    label="First Name"
                    id="firstName"
                    {...register('firstName')}
                    error={errors.firstName?.message}
                    required
                  />
                </div>

                <div className="sm:col-span-3">
                  <Input
                    label="Last Name"
                    id="lastName"
                    {...register('lastName')}
                    error={errors.lastName?.message}
                    required
                  />
                </div>

                <div className="sm:col-span-4">
                  <Input
                    label="Email Address"
                    id="email"
                    type="email"
                    autoComplete="email"
                    {...register('email')}
                    error={errors.email?.message}
                    required
                  />
                </div>

                <div className="sm:col-span-3">
                  <Input
                    label="Phone Number"
                    id="phone"
                    type="tel"
                    autoComplete="tel"
                    {...register('phone')}
                    error={errors.phone?.message}
                  />
                </div>

                <div className="sm:col-span-3">
                  {(Controller as any)({
                    name: 'dateOfBirth',
                    control: control,
                    render: ({ field }: { field: any }) => (
                      <DatePicker
                        label="Date of Birth"
                        value={
                          field.value
                            ? field.value.toISOString().split('T')[0]
                            : ''
                        }
                        onChange={(e) =>
                          field.onChange(
                            e.target.value ? new Date(e.target.value) : null
                          )
                        }
                        max={new Date().toISOString().split('T')[0]}
                        error={errors.dateOfBirth?.message}
                      />
                    ),
                  })}
                </div>

                <div className="sm:col-span-3">
                  <Select
                    label="Gender"
                    id="gender"
                    {...register('gender')}
                    error={errors.gender?.message}
                    options={[
                      { value: '', label: 'Select Gender' },
                      { value: 'male', label: 'Male' },
                      { value: 'female', label: 'Female' },
                      { value: 'other', label: 'Other' },
                      {
                        value: 'prefer-not-to-say',
                        label: 'Prefer not to say',
                      },
                    ]}
                  />
                </div>
              </div>
            </div>

            {/* Address Information */}
            <div className="border-b border-border pb-6">
              <h4 className="text-base font-medium text-foreground mb-4">
                Address Information
              </h4>

              <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
                <div className="sm:col-span-6">
                  <Input
                    label="Street Address"
                    id="address"
                    {...register('address')}
                    error={errors.address?.message}
                  />
                </div>

                <div className="sm:col-span-3">
                  <Input
                    label="City"
                    id="city"
                    {...register('city')}
                    error={errors.city?.message}
                  />
                </div>

                <div className="sm:col-span-3">
                  <Input
                    label="State/Province"
                    id="state"
                    {...register('state')}
                    error={errors.state?.message}
                  />
                </div>

                <div className="sm:col-span-3">
                  <Input
                    label="Postal Code"
                    id="postalCode"
                    {...register('postalCode')}
                    error={errors.postalCode?.message}
                  />
                </div>

                <div className="sm:col-span-3">
                  <Input
                    label="Country"
                    id="country"
                    {...register('country')}
                    error={errors.country?.message}
                  />
                </div>
              </div>
            </div>

            {/* Additional Information */}
            <div className="border-b border-border pb-6">
              <h4 className="text-base font-medium text-foreground mb-4">
                Additional Information
              </h4>

              <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
                <div className="sm:col-span-3">
                  <Select
                    label="Status"
                    id="status"
                    {...register('status')}
                    error={errors.status?.message}
                    required
                    options={[
                      { value: 'active', label: 'Active' },
                      { value: 'inactive', label: 'Inactive' },
                      { value: 'pending', label: 'Pending' },
                    ]}
                  />
                </div>

                <div className="sm:col-span-3">
                  <Select
                    label="Role"
                    id="roleId"
                    {...register('roleId')}
                    error={errors.roleId?.message}
                    required
                    options={[
                      { value: '', label: 'Select a role' },
                      ...roles.map((role) => ({
                        value: role.id,
                        label: role.name,
                      })),
                    ]}
                  />
                </div>

                <div className="sm:col-span-6">
                  <Textarea
                    label="Notes"
                    id="notes"
                    rows={3}
                    {...register('notes')}
                    error={errors.notes?.message}
                  />
                </div>
              </div>
            </div>

            {/* Form Actions */}
            <div className="flex justify-end space-x-3">
              <Button
                type="button"
                variant="outline"
                onClick={() => navigate('/members')}
                disabled={isSubmitting}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? (
                  <>
                    <Loader className="mr-2 h-4 w-4" />
                    {isEditing ? 'Updating...' : 'Creating...'}
                  </>
                ) : isEditing ? (
                  'Update Member'
                ) : (
                  'Create Member'
                )}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default MemberForm;
