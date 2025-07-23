import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { useNavigate, Link } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { useRegisterMutation } from '../../features/auth/authApi';
import { loginSuccess } from '../../features/auth/authSlice';
import { useApiError } from '../../hooks/useApiError';
import { Button } from '../common/Button';
import { Input } from '../common/Input';
import { Loader } from '../common/Loader';

// Form validation schema
const registerSchema = yup.object().shape({
  firstName: yup.string().required('First name is required'),
  lastName: yup.string().required('Last name is required'),
  email: yup
    .string()
    .email('Please enter a valid email')
    .required('Email is required'),
  password: yup
    .string()
    .required('Password is required')
    .min(8, 'Password must be at least 8 characters')
    .matches(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
      'Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character'
    ),
  confirmPassword: yup
    .string()
    .oneOf([yup.ref('password'), undefined], 'Passwords must match')
    .required('Please confirm your password'),
});

type RegisterFormData = yup.InferType<typeof registerSchema>;

export const RegisterForm = () => {
  const [register, { error: apiError, isLoading }] = useRegisterMutation();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  useApiError(apiError);

  const {
    register: formRegister,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormData>({
    resolver: yupResolver(registerSchema),
  });

  const onSubmit = async (data: RegisterFormData) => {
    try {
      const { confirmPassword, ...userData } = data;
      const response = await register(userData).unwrap();
      dispatch(loginSuccess(response));
      navigate('/dashboard');
    } catch (err) {
      // Error is already handled by useApiError
      console.error('Registration error:', err);
    }
  };

  return (
    <div className="flex min-h-screen flex-col justify-center bg-background py-12 px-4 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <h2 className="text-center text-3xl font-bold tracking-tight text-foreground">
          Create a new account
        </h2>
        <p className="mt-2 text-center text-sm text-muted-foreground">
          Or{' '}
          <Link
            to="/login"
            className="font-medium text-primary hover:text-primary/80"
          >
            sign in to your existing account
          </Link>
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-card py-8 px-4 shadow sm:rounded-lg sm:px-10">
          <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
            <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-2">
              <div className="sm:col-span-1">
                <Input
                  id="firstName"
                  type="text"
                  label="First name"
                  autoComplete="given-name"
                  error={errors.firstName?.message}
                  {...formRegister('firstName')}
                />
              </div>
              <div className="sm:col-span-1">
                <Input
                  id="lastName"
                  type="text"
                  label="Last name"
                  autoComplete="family-name"
                  error={errors.lastName?.message}
                  {...formRegister('lastName')}
                />
              </div>
            </div>

            <div>
              <Input
                id="email"
                type="email"
                label="Email address"
                autoComplete="email"
                error={errors.email?.message}
                {...formRegister('email')}
              />
            </div>

            <div>
              <Input
                id="password"
                type="password"
                label="Password"
                autoComplete="new-password"
                error={errors.password?.message}
                {...formRegister('password')}
              />
              <p className="mt-1 text-xs text-muted-foreground">
                Must be at least 8 characters with uppercase, lowercase, number,
                and special character.
              </p>
            </div>

            <div>
              <Input
                id="confirmPassword"
                type="password"
                label="Confirm password"
                autoComplete="new-password"
                error={errors.confirmPassword?.message}
                {...formRegister('confirmPassword')}
              />
            </div>

            <div className="flex items-center">
              <input
                id="terms"
                name="terms"
                type="checkbox"
                className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                required
              />
              <label
                htmlFor="terms"
                className="ml-2 block text-sm text-muted-foreground"
              >
                I agree to the{' '}
                <a
                  href="#"
                  className="font-medium text-primary hover:text-primary/80"
                >
                  Terms of Service
                </a>{' '}
                and{' '}
                <a
                  href="#"
                  className="font-medium text-primary hover:text-primary/80"
                >
                  Privacy Policy
                </a>
              </label>
            </div>

            <div>
              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? (
                  <>
                    <Loader className="mr-2 h-4 w-4" />
                    Creating account...
                  </>
                ) : (
                  'Create account'
                )}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default RegisterForm;
