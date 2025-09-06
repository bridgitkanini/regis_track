import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { Activity, PaginatedResponse } from '../../types';
import { RootState } from '../../app/store';

// Define a service using a base URL and expected endpoints
export const activityApi = createApi({
  reducerPath: 'activityApi',
  baseQuery: fetchBaseQuery({
    baseUrl: `${
      process.env.NX_API_URL || 'http://localhost:3000/api'
    }/dashboard/activity-logs`,
    prepareHeaders: (headers, { getState }) => {
      const token =
        (getState() as RootState).auth.token || localStorage.getItem('token');
      if (token) {
        headers.set('authorization', `Bearer ${token}`);
      }
      return headers;
    },
  }),
  tagTypes: ['Activity'],
  endpoints: (builder) => ({
    getActivities: builder.query<
      PaginatedResponse<Activity[]>,
      {
        page?: number;
        limit?: number;
        userId?: string;
        action?: string;
        collection?: string;
        startDate?: string;
        endDate?: string;
        sortBy?: string;
        order?: 'asc' | 'desc';
      }
    >({
      query: ({
        page = 1,
        limit = 10,
        userId,
        action,
        collection,
        startDate,
        endDate,
        sortBy = 'timestamp',
        order = 'desc',
      }) => ({
        url: '/',
        params: {
          page,
          limit,
          userId,
          action,
          collection,
          startDate,
          endDate,
          sortBy,
          order,
        },
      }),
      providesTags: (result) =>
        result
          ? [
              ...result.data.map(({ _id }) => ({
                type: 'Activity' as const,
                id: _id,
              })),
              { type: 'Activity', id: 'LIST' },
            ]
          : [{ type: 'Activity', id: 'LIST' }],
    }),
    getActivity: builder.query<{ data: Activity }, string>({
      query: (id) => `/${id}`,
      providesTags: (result, error, id) => [{ type: 'Activity', id }],
    }),
    logActivity: builder.mutation<
      { success: boolean },
      Omit<Activity, '_id' | 'timestamp' | 'user'>
    >({
      query: (activityData) => ({
        url: '/',
        method: 'POST',
        body: activityData,
      }),
      invalidatesTags: [{ type: 'Activity', id: 'LIST' }],
    }),
    getRecentActivities: builder.query<Activity[], number>({
      query: (limit = 5) => ({
        url: '/recent',
        params: { limit },
      }),
      providesTags: (result) =>
        result
          ? [
              ...result.map(({ _id }) => ({
                type: 'Activity' as const,
                id: _id,
              })),
              { type: 'Activity', id: 'RECENT' },
            ]
          : [{ type: 'Activity', id: 'RECENT' }],
    }),
  }),
});

export const {
  useGetActivitiesQuery,
  useGetActivityQuery,
  useLogActivityMutation,
  useGetRecentActivitiesQuery,
} = activityApi;
