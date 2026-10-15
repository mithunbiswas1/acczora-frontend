// src/redux/api/categoryApi.js

import { apiSlice } from "@/redux/api-slice/api-slice";
import { endpoints } from "@/redux/endpoints/endpoints";

export const categoryApi = apiSlice.injectEndpoints({
  overrideExisting: true,

  endpoints: (builder) => ({
    // Get Categories
    getCategories: builder.query({
      query: (params = {}) => ({
        url: endpoints.category.categories,
        params,
      }),
      providesTags: (result) =>
        result?.data?.categories
          ? [
              ...result.data.categories.map(({ _id }) => ({
                type: "Category",
                id: _id,
              })),
              { type: "Category", id: "LIST" },
            ]
          : [{ type: "Category", id: "LIST" }],
    }),

    // Get Category By ID or Slug
    getCategoryById: builder.query({
      query: (id) => ({
        url: `${endpoints.category.categories}/${id}`,
      }),
      providesTags: (result, error, id) => [{ type: "Category", id }],
    }),

    // Create Category
    createCategory: builder.mutation({
      query: (data) => ({
        url: endpoints.category.categories,
        method: "POST",
        body: data,
      }),
      invalidatesTags: [{ type: "Category", id: "LIST" }],
    }),

    // Update Category
    updateCategory: builder.mutation({
      query: ({ id, ...data }) => ({
        url: `${endpoints.category.categories}/${id}`,
        method: "PATCH",
        body: data,
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: "Category", id },
        { type: "Category", id: "LIST" },
      ],
    }),

    // Delete Category
    deleteCategory: builder.mutation({
      query: (id) => ({
        url: `${endpoints.category.categories}/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: [
        { type: "Category", id: "LIST" },
        { type: "Subcategory", id: "LIST" },
      ],
    }),
  }),
});

export const {
  useGetCategoriesQuery,
  useGetCategoryByIdQuery,
  useCreateCategoryMutation,
  useUpdateCategoryMutation,
  useDeleteCategoryMutation,
} = categoryApi;
