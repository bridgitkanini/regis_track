import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import {
  Member,
  MemberRequest,
  ApiResponse,
  PaginatedResponse,
} from '../../types';
import { RootState } from '../../app/store';

// Define a service using a base URL and expected endpoints
export const membersApi = createApi({
  reducerPath: 'membersApi',
  baseQuery: fetchBaseQuery({
    baseUrl: `${process.env.NX_API_URL || 'http://localhost:3000/api'}/members`,
    prepareHeaders: (headers, { getState }) => {
      const token =
        (getState() as RootState).auth.token || localStorage.getItem('token');
      if (token) {
        headers.set('authorization', `Bearer ${token}`);
      }
      return headers;
    },
  }),
  tagTypes: ['Member'],
  endpoints: (builder) => ({
    getMembers: builder.query<
      PaginatedResponse<Member[]>,
      {
        page?: number;
        limit?: number;
        search?: string;
        sortBy?: string;
        order?: 'asc' | 'desc';
      }
    >({
      query: ({
        page = 1,
        limit = 10,
        search = '',
        sortBy = 'createdAt',
        order = 'desc',
      }) => ({
        url: '/',
        params: { page, limit, search, sortBy, order },
      }),
      providesTags: (result) =>
        result
          ? [
              ...result.data.map(({ _id }) => ({
                type: 'Member' as const,
                id: _id,
              })),
              { type: 'Member', id: 'LIST' },
            ]
          : [{ type: 'Member', id: 'LIST' }],
    }),
    getMember: builder.query<ApiResponse<Member>, string>({
      query: (id) => `/${id}`,
      providesTags: (result, error, id) => [{ type: 'Member', id }],
    }),
    createMember: builder.mutation<ApiResponse<Member>, MemberRequest>({
      query: (memberData) => ({
        url: '/',
        method: 'POST',
        body: memberData,
      }),
      invalidatesTags: [{ type: 'Member', id: 'LIST' }],
    }),
    updateMember: builder.mutation<
      ApiResponse<Member>,
      { id: string; data: Partial<MemberRequest> }
    >({
      query: ({ id, data }) => ({
        url: `/${id}`,
        method: 'PATCH',
        body: data,
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: 'Member', id },
        { type: 'Member', id: 'LIST' },
      ],
    }),
    deleteMember: builder.mutation<{ success: boolean; id: string }, string>({
      query: (id) => ({
        url: `/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: (result, error, id) => [
        { type: 'Member', id },
        { type: 'Member', id: 'LIST' },
      ],
    }),
    uploadMemberPhoto: builder.mutation<{ url: string }, FormData>({
      query: (formData) => ({
        url: '/upload',
        method: 'POST',
        body: formData,
      }),
    }),
  }),
});

export const {
  useGetMembersQuery,
  useGetMemberQuery,
  useCreateMemberMutation,
  useUpdateMemberMutation,
  useDeleteMemberMutation,
  useUploadMemberPhotoMutation,
} = membersApi;
