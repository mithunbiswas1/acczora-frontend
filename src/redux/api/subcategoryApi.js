// src/redux/api/subcategoryApi.js

import { apiSlice } from "@/redux/api-slice/api-slice";
import { endpoints } from "@/redux/endpoints/endpoints";

export const subcategoryApi = apiSlice.injectEndpoints({
  overrideExisting: true,

  endpoints: (builder) => ({
    // Get Subcategories
    getSubcategories: builder.query({
      query: (params = {}) => ({
        url: endpoints.subcategory.subcategories,
        params,
      }),
      providesTags: (result) =>
        result?.data?.subcategories
          ? [
              ...result.data.subcategories.map(({ _id }) => ({
                type: "Subcategory",
                id: _id,
              })),
              { type: "Subcategory", id: "LIST" },
            ]
          : [{ type: "Subcategory", id: "LIST" }],
    }),

    // Get Subcategory By ID or Slug
    getSubcategoryById: builder.query({
      query: (id) => ({
        url: `${endpoints.subcategory.subcategories}/${id}`,
      }),
      providesTags: (result, error, id) => [{ type: "Subcategory", id }],
    }),

    // Create Subcategory
    createSubcategory: builder.mutation({
      query: (data) => ({
        url: endpoints.subcategory.subcategories,
        method: "POST",
        body: data,
      }),
      invalidatesTags: [
        { type: "Subcategory", id: "LIST" },
        { type: "Category", id: "LIST" },
      ],
    }),

    // Update Subcategory
    updateSubcategory: builder.mutation({
      query: ({ id, ...data }) => ({
        url: `${endpoints.subcategory.subcategories}/${id}`,
        method: "PATCH",
        body: data,
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: "Subcategory", id },
        { type: "Subcategory", id: "LIST" },
        { type: "Category", id: "LIST" },
      ],
    }),

    // Delete Subcategory
    deleteSubcategory: builder.mutation({
      query: (id) => ({
        url: `${endpoints.subcategory.subcategories}/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: [
        { type: "Subcategory", id: "LIST" },
        { type: "Category", id: "LIST" },
      ],
    }),
  }),
});

export const {
  useGetSubcategoriesQuery,
  useGetSubcategoryByIdQuery,
  useCreateSubcategoryMutation,
  useUpdateSubcategoryMutation,
  useDeleteSubcategoryMutation,
} = subcategoryApi;
