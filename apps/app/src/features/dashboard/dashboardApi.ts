import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { RootState } from '../../app/store';

export interface DashboardStats {
    totalMembers: number;
    activeMembers: number;
    inactiveMembers: number;
    totalUsers: number;
    recentActivities: any[];
    roleDistribution: any[];
    monthlyGrowth: any[];
    newMembersThisMonth: number;
    membershipRenewals: number;
  }

export const dashboardApi = createApi({
  reducerPath: 'dashboardApi',
  baseQuery: fetchBaseQuery({
    baseUrl: `${
      process.env.NX_API_URL || 'http://localhost:3000/api'
    }/dashboard`,
    prepareHeaders: (headers, { getState }) => {
      const token =
        (getState() as RootState).auth.token || localStorage.getItem('token');
      if (token) {
        headers.set('authorization', `Bearer ${token}`);
      }
      return headers;
    },
  }),
  tagTypes: ['Dashboard'],
  endpoints: (builder) => ({
    getDashboardStats: builder.query<
      { success: boolean; data: DashboardStats },
      void
    >({
      query: () => '/stats',
      providesTags: ['Dashboard'],
    }),
  }),
});

export const { useGetDashboardStatsQuery } = dashboardApi;
