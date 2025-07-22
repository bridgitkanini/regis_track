import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { LoginRequest, RegisterRequest, User } from '../../types';
import { RootState } from '../../app/store';

// Define a service using a base URL and expected endpoints
export const authApi = createApi({
  reducerPath: 'authApi',
  baseQuery: fetchBaseQuery({
    baseUrl: process.env.NX_API_URL || 'http://localhost:3000/api/auth',
    prepareHeaders: (headers, { getState }) => {
      const token =
        (getState() as RootState).auth.token || localStorage.getItem('token');
      if (token) {
        headers.set('authorization', `Bearer ${token}`);
      }
      return headers;
    },
  }),
  tagTypes: ['User'],
  endpoints: (builder) => ({
    login: builder.mutation<{ user: User; token: string }, LoginRequest>({
      query: (credentials) => ({
        url: '/login',
        method: 'POST',
        body: credentials,
      }),
      invalidatesTags: ['User'],
    }),
    register: builder.mutation<{ user: User; token: string }, RegisterRequest>({
      query: (userData) => ({
        url: '/register',
        method: 'POST',
        body: userData,
      }),
    }),
    getCurrentUser: builder.query<User, void>({
      query: () => '/me',
      providesTags: ['User'],
    }),
    updateProfile: builder.mutation<{ user: User }, Partial<User>>({
      query: (userData) => ({
        url: '/profile',
        method: 'PATCH',
        body: userData,
      }),
      invalidatesTags: ['User'],
    }),
    changePassword: builder.mutation<
      { message: string },
      { currentPassword: string; newPassword: string }
    >({
      query: (passwords) => ({
        url: '/change-password',
        method: 'POST',
        body: passwords,
      }),
    }),
  }),
});

export const {
  useLoginMutation,
  useRegisterMutation,
  useGetCurrentUserQuery,
  useUpdateProfileMutation,
  useChangePasswordMutation,
} = authApi;
