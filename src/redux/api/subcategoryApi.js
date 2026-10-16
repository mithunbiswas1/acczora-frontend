// src/redux/api/subcategoryApi.js

import { apiSlice } from "@/redux/api-slice/api-slice";
import { endpoints } from "@/redux/endpoints/endpoints";

export const subcategoryApi = apiSlice.injectEndpoints({
  overrideExisting: true,

  endpoints: (builder) => ({
    // 1. Get All Subcategories (Active + Inactive, for Admin)
    getAllSubcategories: builder.query({
      query: (params) => ({
        url: endpoints.subcategory.getAllSubcategories,
        method: "GET",
        params: { all: "true", ...params },
      }),
      providesTags: ["Subcategory"],
    }),

    // 2. Get All Active Subcategories (Active Only, for Dropdowns/Catalogs)
    getAllSubcategoriesActive: builder.query({
      query: (params) => ({
        url: endpoints.subcategory.getAllSubcategories,
        method: "GET",
        params: { is_active: "true", ...params },
      }),
      providesTags: ["Subcategory"],
    }),

    // 3. Get Subcategories List (Paginated, Search, Category filter)
    getSubcategoriesList: builder.query({
      query: (params) => ({
        url: endpoints.subcategory.getListSubcategories,
        method: "GET",
        params,
      }),
      providesTags: ["Subcategory"],
    }),

    // 4. Get Subcategories List Active (Paginated, Search, Active Only)
    getSubcategoriesListActive: builder.query({
      query: (params) => ({
        url: endpoints.subcategory.getListSubcategories,
        method: "GET",
        params: { is_active: "true", ...params },
      }),
      providesTags: ["Subcategory"],
    }),

    // Get List Subcategories (Legacy Alias)
    getListSubcategories: builder.query({
      query: (params) => ({
        url: endpoints.subcategory.getListSubcategories,
        method: "GET",
        params,
      }),
      providesTags: ["Subcategory"],
    }),

    // Get Subcategory By ID
    getSubcategoryById: builder.query({
      query: (id) => ({
        url: `${endpoints.subcategory.getSubcategoryById}/${id}`,
        method: "GET",
      }),
      providesTags: ["Subcategory"],
    }),

    // Get Subcategory By Slug
    getSubcategoryBySlug: builder.query({
      query: (slug) => ({
        url: `${endpoints.subcategory.getSubcategoryBySlug}/${slug}`,
        method: "GET",
      }),
      providesTags: ["Subcategory"],
    }),

    // Create Subcategory
    createSubcategory: builder.mutation({
      query: (data) => ({
        url: endpoints.subcategory.createSubcategory,
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Subcategory", "Category"],
    }),

    // Update Subcategory
    updateSubcategory: builder.mutation({
      query: ({ id, ...data }) => ({
        url: `${endpoints.subcategory.updateSubcategory}/${id}`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: ["Subcategory", "Category"],
    }),

    // Delete Subcategory
    deleteSubcategory: builder.mutation({
      query: (id) => ({
        url: `${endpoints.subcategory.deleteSubcategory}/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Subcategory", "Category"],
    }),

    // Toggle Subcategory Status
    toggleSubcategoryStatus: builder.mutation({
      query: (id) => ({
        url: `${endpoints.subcategory.toggleSubcategoryStatus}/${id}`,
        method: "PATCH",
      }),
      invalidatesTags: ["Subcategory", "Category"],
    }),

    // Alias for existing dashboard pages
    getSubcategories: builder.query({
      query: (params) => ({
        url: endpoints.subcategory.getListSubcategories,
        method: "GET",
        params,
      }),
      providesTags: ["Subcategory"],
    }),
  }),
});

export const {
  useGetAllSubcategoriesQuery,
  useGetAllSubcategoriesActiveQuery,
  useGetSubcategoriesListQuery,
  useGetSubcategoriesListActiveQuery,
  useGetListSubcategoriesQuery,
  useGetSubcategoriesQuery,
  useGetSubcategoryByIdQuery,
  useGetSubcategoryBySlugQuery,
  useCreateSubcategoryMutation,
  useUpdateSubcategoryMutation,
  useDeleteSubcategoryMutation,
  useToggleSubcategoryStatusMutation,
} = subcategoryApi;
