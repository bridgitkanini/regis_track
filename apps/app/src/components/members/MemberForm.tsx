import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import type { SubmitHandler } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { useNavigate, useParams } from 'react-router-dom';
import { Button } from '../common/Button';
import { Loader } from '../common/Loader';
import { toast } from 'react-hot-toast';
import apiClient from '../../lib/api/client';
import { useQuery } from '@tanstack/react-query';
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

// Yup schema type for the form validation

type YupSchemaType = yup.ObjectSchema<{
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
}, yup.AnyObject, {
  firstName: string;
  lastName: string;
  email: string;
  phone?: string | undefined;
  address?: string | undefined;
  city?: string | undefined;
  state?: string | undefined;
  postalCode?: string | undefined;
  country?: string | undefined;
  dateOfBirth: Date | null;
  gender?: "male" | "female" | "other" | "prefer-not-to-say" | undefined;
  status: "active" | "inactive" | "pending";
  roleId: string;
  notes?: string | undefined;
  profilePicture?: FileList | undefined;
}, "">;

// Define the structure of the error response from the API
interface ErrorResponse {
  message?: string;
  error?: string;
  statusCode?: number;
}

// Type guard to check if the error is an Axios error
const isAxiosError = (error: unknown): error is { response?: { data?: unknown } } => {
  return (error as { isAxiosError?: boolean })?.isAxiosError === true;
};

// Helper function to handle API errors
const handleApiError = (error: unknown, defaultMessage: string): string => {
  // Handle Axios errors
  if (isAxiosError(error)) {
    const responseData = error.response?.data as ErrorResponse | undefined;
    return responseData?.message || responseData?.error || String(error) || defaultMessage;
  }
  
  // Handle standard Error objects
  if (error instanceof Error) {
    return error.message;
  }
  
  // Handle string errors
  if (typeof error === 'string') {
    return error;
  }
  
  // Fallback to default message
  return defaultMessage;
};

// Convert FormValues to FormData for API submission
const toMemberFormData = (values: FormValues): FormData => {
  const formData = new FormData();
  
  // Add all fields to form data
  Object.entries(values).forEach(([key, value]) => {
    if (value === undefined || value === null) {
      return; // Skip undefined and null values
    }
    
    if (key === 'profilePicture' && value instanceof FileList && value.length > 0) {
      formData.append(key, value[0]);
    } else if (key === 'dateOfBirth' && value instanceof Date) {
      formData.append(key, value.toISOString().split('T')[0]);
    } else {
      formData.append(key, String(value));
    }
  });
  
  return formData;
};

// Define the form validation schema using yup
const memberSchema = yup.object({
  firstName: yup.string().required('First name is required'),
  lastName: yup.string().required('Last name is required'),
  email: yup.string().email('Invalid email').required('Email is required'),
  phone: yup.string(),
  address: yup.string(),
  city: yup.string(),
  state: yup.string(),
  postalCode: yup.string(),
  country: yup.string(),
  dateOfBirth: yup.date().nullable(),
  gender: yup.string().oneOf(['male', 'female', 'other', 'prefer-not-to-say']),
  status: yup.string().oneOf(['active', 'inactive', 'pending']).required('Status is required'),
  roleId: yup.string().required('Role is required'),
  notes: yup.string(),
  profilePicture: yup.mixed<FileList>(),
}) as unknown as YupSchemaType; // Type assertion to handle Yup's complex types

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
        return response.data.data; // Return the roles array
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
  const { data: memberData, isLoading: isLoadingMember } = useQuery<FormValues | null, Error>({
    queryKey: ['member', id],
    queryFn: async (): Promise<FormValues | null> => {
      if (!id) return null;
      try {
        const response = await apiClient.get<ApiResponse<ApiMember>>(`/api/members/${id}`);
        const member = response.data.data; // Access the nested data property
        
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
          // profilePicture will be handled separately
        };
        return formValues;
      } catch (error) {
        const errorMessage = handleApiError(error, 'Failed to load member data');
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
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
  } = useForm<FormValues>({
    // Use the properly typed schema
    resolver: yupResolver(memberSchema),
    defaultValues: {
      firstName: '',
      lastName: '',
      email: '',
      status: 'active',
      roleId: '',
      dateOfBirth: null,
    },
  });

  // Set form values when member data is loaded
  useEffect(() => {
    if (memberData && isEditing) {
      // Create a copy of memberData to avoid mutating the original
      const formData = { ...memberData };
      
      // Reset the form with the member data
      reset(formData);
      
      // Set preview image if exists
      // The profile picture URL comes from the API as a string
      // and is stored in the profilePicture field of the member data
      if (memberData.profilePicture && typeof memberData.profilePicture === 'string') {
        setPreviewImage(
          `${process.env.NX_API_URL || 'http://localhost:3333'}/uploads/profile-pictures/${memberData.profilePicture}`
        );
      }
    }
  }, [memberData, isEditing, reset]);

  // Handle file input change for profile picture
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Create a preview URL for the image
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewImage(reader.result as string);
      };
      reader.readAsDataURL(file);
      
      // Update form value with the selected file(s)
      const files = e.target.files;
      if (files && files.length > 0) {
        setValue('profilePicture', files, { shouldValidate: true });
      }
    }
  };

  const onSubmit: SubmitHandler<FormValues> = async (formData) => {
    try {
      setIsSubmitting(true);
      const memberFormData = toMemberFormData(formData);
      
      if (isEditing && id) {
        // Update existing member
        await apiClient.put(`/api/members/${id}`, memberFormData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });
        toast.success('Member updated successfully');
      } else {
        // Create new member
        await apiClient.post('/api/members', memberFormData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });
        toast.success('Member created successfully');
      }
      
      // Redirect to members list
      navigate('/members');
    } catch (error) {
      const errorMessage = handleApiError(error, `Failed to ${isEditing ? 'update' : 'create'} member`);
      toast.error(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleRemoveImage = () => {
    setPreviewImage(null);
    // Clear the file input by setting it to undefined
    const fileInput = document.getElementById('profilePicture') as HTMLInputElement;
    if (fileInput) {
      fileInput.value = '';
    }
    // Reset the form value
    setValue('profilePicture', undefined as unknown as FileList);
  };

  if (isLoadingMember || isLoadingRoles) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader size="lg" />
      </div>
    );
  }

  if (rolesError) {
    return (
      <div className="rounded-md bg-red-50 p-4">
        <div className="flex">
          <div className="ml-3">
            <h3 className="text-sm font-medium text-red-800">
              Error loading required data
            </h3>
            <div className="mt-2 text-sm text-red-700">
              <p>Failed to load roles. Please try again later.</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-gray-900">
          {isEditing ? 'Edit Member' : 'Add New Member'}
        </h1>
        <p className="mt-1 text-sm text-gray-500">
          {isEditing
            ? 'Update member information.'
            : 'Add a new member to your organization.'}
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div className="bg-white shadow rounded-lg overflow-hidden">
          <div className="px-4 py-5 sm:p-6">
            <div className="md:grid md:grid-cols-3 md:gap-6">
              <div className="md:col-span-1">
                <h3 className="text-lg font-medium leading-6 text-gray-900">
                  Profile
                </h3>
                <p className="mt-1 text-sm text-gray-500">
                  Basic member information.
                </p>
              </div>
              <div className="mt-5 md:col-span-2 md:mt-0">
                <div className="grid grid-cols-6 gap-6">
                  <div className="col-span-6 sm:col-span-3">
                    <label
                      htmlFor="firstName"
                      className="block text-sm font-medium text-gray-700"
                    >
                      First name *
                    </label>
                    <input
                      type="text"
                      id="firstName"
                      autoComplete="given-name"
                      className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm ${
                        errors.firstName ? 'border-red-300' : 'border-gray-300'
                      }`}
                      {...register('firstName')}
                    />
                    {errors.firstName && (
                      <p className="mt-1 text-sm text-red-600">
                        {errors.firstName.message}
                      </p>
                    )}
                  </div>

                  <div className="col-span-6 sm:col-span-3">
                    <label
                      htmlFor="lastName"
                      className="block text-sm font-medium text-gray-700"
                    >
                      Last name *
                    </label>
                    <input
                      type="text"
                      id="lastName"
                      autoComplete="family-name"
                      className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm ${
                        errors.lastName ? 'border-red-300' : 'border-gray-300'
                      }`}
                      {...register('lastName')}
                    />
                    {errors.lastName && (
                      <p className="mt-1 text-sm text-red-600">
                        {errors.lastName.message}
                      </p>
                    )}
                  </div>

                  <div className="col-span-6 sm:col-span-4">
                    <label
                      htmlFor="email"
                      className="block text-sm font-medium text-gray-700"
                    >
                      Email address *
                    </label>
                    <input
                      type="email"
                      id="email"
                      autoComplete="email"
                      className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm ${
                        errors.email ? 'border-red-300' : 'border-gray-300'
                      }`}
                      {...register('email')}
                    />
                    {errors.email && (
                      <p className="mt-1 text-sm text-red-600">
                        {errors.email.message}
                      </p>
                    )}
                  </div>

                  <div className="col-span-6 sm:col-span-4">
                    <label
                      htmlFor="phone"
                      className="block text-sm font-medium text-gray-700"
                    >
                      Phone
                    </label>
                    <input
                      type="tel"
                      id="phone"
                      autoComplete="tel"
                      className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm ${
                        errors.phone ? 'border-red-300' : 'border-gray-300'
                      }`}
                      {...register('phone')}
                    />
                    {errors.phone && (
                      <p className="mt-1 text-sm text-red-600">
                        {errors.phone.message}
                      </p>
                    )}
                  </div>

                  <div className="col-span-6 sm:col-span-3">
                    <label
                      htmlFor="dateOfBirth"
                      className="block text-sm font-medium text-gray-700"
                    >
                      Date of birth
                    </label>
                    <input
                      type="date"
                      id="dateOfBirth"
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                      {...register('dateOfBirth')}
                    />
                  </div>

                  <div className="col-span-6 sm:col-span-3">
                    <label
                      htmlFor="gender"
                      className="block text-sm font-medium text-gray-700"
                    >
                      Gender
                    </label>
                    <select
                      id="gender"
                      className="mt-1 block w-full rounded-md border border-gray-300 bg-white py-2 px-3 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
                      {...register('gender')}
                    >
                      <option value="">Select...</option>
                      <option value="male">Male</option>
                      <option value="female">Female</option>
                      <option value="other">Other</option>
                      <option value="prefer-not-to-say">Prefer not to say</option>
                    </select>
                  </div>

                  <div className="col-span-6">
                    <label className="block text-sm font-medium text-gray-700">
                      Profile photo
                    </label>
                    <div className="mt-1 flex items-center">
                      <span className="inline-block h-12 w-12 overflow-hidden rounded-full bg-gray-100">
                        {previewImage ? (
                          <img
                            src={previewImage}
                            alt="Profile preview"
                            className="h-full w-full object-cover"
                          />
                        ) : (
                          <svg
                            className="h-full w-full text-gray-300"
                            fill="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path d="M24 20.993V24H0v-2.996A14.977 14.977 0 0112.004 15c4.904 0 9.26 2.354 11.996 5.993zM16.002 8.999a4 4 0 11-8 0 4 4 0 018 0z" />
                          </svg>
                        )}
                      </span>
                      <div className="ml-4 flex">
                        <div className="relative">
                          <input
                            id="profilePicture"
                            type="file"
                            accept="image/*"
                            className="hidden"
                            onChange={handleFileChange}
                          />
                          <label
                            htmlFor="profilePicture"
                            className="rounded-md border border-gray-300 bg-white py-2 px-3 text-sm font-medium leading-4 text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                          >
                            Change
                          </label>
                        </div>
                        {previewImage && (
                          <button
                            type="button"
                            onClick={handleRemoveImage}
                            className="ml-2 rounded-md border border-gray-300 bg-white py-2 px-3 text-sm font-medium leading-4 text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                          >
                            Remove
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-gray-50 px-4 py-3 text-right sm:px-6">
            <Button
              type="button"
              variant="outline"
              onClick={() => navigate('/members')}
              className="mr-2"
            >
              Cancel
            </Button>
            <Button type="submit" isLoading={isSubmitting}>
              {isEditing ? 'Update Member' : 'Add Member'}
            </Button>
          </div>
        </div>

        <div className="bg-white shadow rounded-lg overflow-hidden">
          <div className="px-4 py-5 sm:p-6">
            <div className="md:grid md:grid-cols-3 md:gap-6">
              <div className="md:col-span-1">
                <h3 className="text-lg font-medium leading-6 text-gray-900">
                  Additional Information
                </h3>
                <p className="mt-1 text-sm text-gray-500">
                  Additional details about the member.
                </p>
              </div>
              <div className="mt-5 md:col-span-2 md:mt-0">
                <div className="grid grid-cols-6 gap-6">
                  <div className="col-span-6 sm:col-span-3">
                    <label
                      htmlFor="roleId"
                      className="block text-sm font-medium text-gray-700"
                    >
                      Role *
                    </label>
                    <select
                      id="roleId"
                      className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm ${
                        errors.roleId ? 'border-red-300' : 'border-gray-300'
                      }`}
                      {...register('roleId')}
                    >
                      <option value="">Select a role</option>
                      {roles?.map((role) => (
                        <option key={role.id} value={role.id}>
                          {role.name}
                        </option>
                      ))}
                    </select>
                    {errors.roleId && (
                      <p className="mt-1 text-sm text-red-600">
                        {errors.roleId.message}
                      </p>
                    )}
                  </div>

                  <div className="col-span-6 sm:col-span-3">
                    <label
                      htmlFor="status"
                      className="block text-sm font-medium text-gray-700"
                    >
                      Status *
                    </label>
                    <select
                      id="status"
                      className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm ${
                        errors.status ? 'border-red-300' : 'border-gray-300'
                      }`}
                      {...register('status')}
                    >
                      <option value="active">Active</option>
                      <option value="inactive">Inactive</option>
                      <option value="pending">Pending</option>
                    </select>
                    {errors.status && (
                      <p className="mt-1 text-sm text-red-600">
                        {errors.status.message}
                      </p>
                    )}
                  </div>

                  <div className="col-span-6">
                    <label
                      htmlFor="address"
                      className="block text-sm font-medium text-gray-700"
                    >
                      Street address
                    </label>
                    <input
                      type="text"
                      id="address"
                      autoComplete="street-address"
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                      {...register('address')}
                    />
                  </div>

                  <div className="col-span-6 sm:col-span-6 lg:col-span-2">
                    <label
                      htmlFor="city"
                      className="block text-sm font-medium text-gray-700"
                    >
                      City
                    </label>
                    <input
                      type="text"
                      id="city"
                      autoComplete="address-level2"
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                      {...register('city')}
                    />
                  </div>

                  <div className="col-span-6 sm:col-span-3 lg:col-span-2">
                    <label
                      htmlFor="state"
                      className="block text-sm font-medium text-gray-700"
                    >
                      State / Province
                    </label>
                    <input
                      type="text"
                      id="state"
                      autoComplete="address-level1"
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                      {...register('state')}
                    />
                  </div>

                  <div className="col-span-6 sm:col-span-3 lg:col-span-2">
                    <label
                      htmlFor="postalCode"
                      className="block text-sm font-medium text-gray-700"
                    >
                      ZIP / Postal code
                    </label>
                    <input
                      type="text"
                      id="postalCode"
                      autoComplete="postal-code"
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                      {...register('postalCode')}
                    />
                  </div>

                  <div className="col-span-6">
                    <label
                      htmlFor="notes"
                      className="block text-sm font-medium text-gray-700"
                    >
                      Notes
                    </label>
                    <div className="mt-1">
                      <textarea
                        id="notes"
                        rows={3}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                        defaultValue={''}
                        {...register('notes')}
                      />
                    </div>
                    <p className="mt-2 text-sm text-gray-500">
                      Any additional notes about the member.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-gray-50 px-4 py-3 text-right sm:px-6">
            <Button
              type="button"
              variant="outline"
              onClick={() => navigate('/members')}
              className="mr-2"
            >
              Cancel
            </Button>
            <Button type="submit" isLoading={isSubmitting}>
              {isEditing ? 'Update Member' : 'Add Member'}
            </Button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default MemberForm;
