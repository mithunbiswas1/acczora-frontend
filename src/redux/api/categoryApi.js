// src/redux/api/categoryApi.js

import { apiSlice } from "@/redux/api-slice/api-slice";
import { endpoints } from "@/redux/endpoints/endpoints";

export const categoryApi = apiSlice.injectEndpoints({
  overrideExisting: true,

  endpoints: (builder) => ({
    // 1. Get All Categories (Active + Inactive, for Admin)
    getAllCategories: builder.query({
      query: (params) => ({
        url: endpoints.category.getAllCategories,
        method: "GET",
        params: { all: "true", ...params },
      }),
      providesTags: ["Category"],
    }),

    // 2. Get All Active Categories (Active Only, for Dropdowns/Catalogs)
    getAllCategoriesActive: builder.query({
      query: (params) => ({
        url: endpoints.category.getAllCategories,
        method: "GET",
        params: { is_active: "true", ...params },
      }),
      providesTags: ["Category"],
    }),

    // 3. Get Categories List (Paginated, Filter, Search)
    getCategoriesList: builder.query({
      query: (params) => ({
        url: endpoints.category.getListCategories,
        method: "GET",
        params,
      }),
      providesTags: ["Category"],
    }),

    // 4. Get Categories List Active (Paginated, Search, Filter - Active Only)
    getCategoriesListActive: builder.query({
      query: (params) => ({
        url: endpoints.category.getListCategories,
        method: "GET",
        params: { is_active: "true", ...params },
      }),
      providesTags: ["Category"],
    }),

    // Aliases for compatibility
    getListCategories: builder.query({
      query: (params) => ({
        url: endpoints.category.getListCategories,
        method: "GET",
        params,
      }),
      providesTags: ["Category"],
    }),

    getCategories: builder.query({
      query: (params) => ({
        url: endpoints.category.getAllCategories,
        method: "GET",
        params: { all: "true", ...params },
      }),
      providesTags: ["Category"],
    }),

    // Get Category By ID
    getCategoryById: builder.query({
      query: (id) => ({
        url: `${endpoints.category.getCategoryById}/${id}`,
        method: "GET",
      }),
      providesTags: ["Category"],
    }),

    // Get Category By Slug
    getCategoryBySlug: builder.query({
      query: (slug) => ({
        url: `${endpoints.category.getCategoryBySlug}/${slug}`,
        method: "GET",
      }),
      providesTags: ["Category"],
    }),

    // Create Category
    createCategory: builder.mutation({
      query: (data) => ({
        url: endpoints.category.createCategory,
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Category"],
    }),

    // Update Category
    updateCategory: builder.mutation({
      query: ({ id, ...data }) => ({
        url: `${endpoints.category.updateCategory}/${id}`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: ["Category"],
    }),

    // Delete Category
    deleteCategory: builder.mutation({
      query: (id) => ({
        url: `${endpoints.category.deleteCategory}/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Category", "Subcategory"],
    }),

    // Toggle Category Status
    toggleCategoryStatus: builder.mutation({
      query: (id) => ({
        url: `${endpoints.category.toggleCategoryStatus}/${id}`,
        method: "PATCH",
      }),
      invalidatesTags: ["Category"],
    }),
  }),
});

export const {
  useGetAllCategoriesQuery,
  useGetAllCategoriesActiveQuery,
  useGetCategoriesListQuery,
  useGetCategoriesListActiveQuery,
  useGetListCategoriesQuery,
  useGetCategoriesQuery,
  useGetCategoryByIdQuery,
  useGetCategoryBySlugQuery,
  useCreateCategoryMutation,
  useUpdateCategoryMutation,
  useDeleteCategoryMutation,
  useToggleCategoryStatusMutation,
} = categoryApi;
