// src/redux/api/roleApi.js

import { apiSlice } from "@/redux/api-slice/api-slice";
import { endpoints } from "@/redux/endpoints/endpoints";

export const roleApi = apiSlice.injectEndpoints({
  overrideExisting: true,
  endpoints: (builder) => ({
    getAllRoles: builder.query({
      query: () => ({
        url: endpoints.role.getAllRoles,
        method: "GET",
      }),
      providesTags: ["Role"],
    }),

    getRoleById: builder.query({
      query: (id) => ({
        url: `${endpoints.role.getRoleById}/${id}`,
        method: "GET",
      }),
      providesTags: ["Role"],
    }),

    createRole: builder.mutation({
      query: (data) => ({
        url: endpoints.role.createRole,
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Role"],
    }),

    updateRole: builder.mutation({
      query: ({ id, ...body }) => ({
        url: `${endpoints.role.updateRole}/${id}`,
        method: "PATCH",
        body,
      }),
      invalidatesTags: ["Role"],
    }),

    deleteRole: builder.mutation({
      query: (id) => ({
        url: `${endpoints.role.deleteRole}/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Role"],
    }),
  }),
});

export const {
  useGetAllRolesQuery,
  useGetRoleByIdQuery,
  useCreateRoleMutation,
  useUpdateRoleMutation,
  useDeleteRoleMutation,
} = roleApi;
