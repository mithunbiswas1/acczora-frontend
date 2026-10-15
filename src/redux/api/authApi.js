// src/redux/features/authApi.js

import { apiSlice } from "@/redux/api-slice/api-slice";
import { endpoints } from "@/redux/endpoints/endpoints";

export const authApi = apiSlice.injectEndpoints({
  overrideExisting: true,

  endpoints: (builder) => ({
    // Registration API
    registration: builder.mutation({
      query: (data) => ({
        url: endpoints.auth.registration,
        method: "POST",
        body: data,
      }),
      invalidatesTags: [],
    }),

    // Login API
    login: builder.mutation({
      query: (data) => ({
        url: endpoints.auth.login,
        method: "POST",
        body: data,
      }),
      invalidatesTags: [],
    }),

    // Send OTP
    sendOtp: builder.mutation({
      query: (data) => ({
        url: endpoints.auth.sendOtp,
        method: "POST",
        body: data,
      }),
    }),

    // Verify OTP
    otpVerifyLogin: builder.mutation({
      query: (data) => ({
        url: endpoints.auth.otpVerifyLogin,
        method: "POST",
        body: data,
      }),
    }),

    // Get Current Authenticated Profile
    getProfile: builder.query({
      query: () => ({
        url: "profile",
        method: "GET",
      }),
      providesTags: ["Auth", "Profile"],
    }),

    // Logout API
    logout: builder.mutation({
      query: () => ({
        url: "logout",
        method: "POST",
      }),
      invalidatesTags: ["Auth", "Profile"],
    }),

    // Admin - List Users
    getAdminUsers: builder.query({
      query: (params) => ({
        url: "admin/users",
        method: "GET",
        params,
      }),
      providesTags: ["Auth"],
    }),

    // Admin - Update User & Permissions
    updateUserByAdmin: builder.mutation({
      query: ({ userId, data }) => ({
        url: `admin/update-user/${userId}`,
        method: "PATCH",
        body: data,
      }),
      invalidatesTags: ["Auth", "Profile"],
    }),

    // Super Admin - Delete User
    deleteUserByAdmin: builder.mutation({
      query: (userId) => ({
        url: `delete-user/${userId}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Auth"],
    }),
  }),
});

export const {
  useRegistrationMutation,
  useLoginMutation,
  useSendOtpMutation,
  useOtpVerifyLoginMutation,
  useGetProfileQuery,
  useLogoutMutation,
  useGetAdminUsersQuery,
  useUpdateUserByAdminMutation,
  useDeleteUserByAdminMutation,
} = authApi;

