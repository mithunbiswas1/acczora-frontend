// src/redux/api/userApi.js

import { apiSlice } from "@/redux/api-slice/api-slice";
import { endpoints } from "@/redux/endpoints/endpoints";

export const userApi = apiSlice.injectEndpoints({
  overrideExisting: true,
  endpoints: (builder) => ({
    getAllUsers: builder.query({
      query: (params) => ({
        url: endpoints.user.getAllUsers,
        method: "GET",
        params,
      }),
      providesTags: ["User"],
    }),

    getUserById: builder.query({
      query: (id) => ({
        url: `${endpoints.user.getUserById}/${id}`,
        method: "GET",
      }),
      providesTags: ["User"],
    }),

    updateUserByAdmin: builder.mutation({
      query: ({ id, ...body }) => ({
        url: `${endpoints.user.updateUserByAdmin}/${id}`,
        method: "PATCH",
        body,
      }),
      invalidatesTags: ["User"],
    }),

    deleteUserByAdmin: builder.mutation({
      query: (id) => ({
        url: `${endpoints.user.deleteUserByAdmin}/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["User"],
    }),

    getActiveAuthors: builder.query({
      query: () => ({
        url: endpoints.user.getActiveAuthors,
        method: "GET",
      }),
      providesTags: ["User"],
    }),
  }),
});

export const {
  useGetAllUsersQuery,
  useGetUserByIdQuery,
  useUpdateUserByAdminMutation,
  useDeleteUserByAdminMutation,
  useGetActiveAuthorsQuery,
} = userApi;
