// src/redux/api/productApi.js

import { apiSlice } from "@/redux/api-slice/api-slice";
import { endpoints } from "@/redux/endpoints/endpoints";

export const productApi = apiSlice.injectEndpoints({
  overrideExisting: true,

  endpoints: (builder) => ({
    // Get All Products (Public search / catalog with pagination & filters)
    getAllProducts: builder.query({
      query: (params) => ({
        url: endpoints.product.getAllProducts,
        method: "GET",
        params,
      }),
      providesTags: ["Product"],
    }),

    // Get Seller's Products (Dashboard)
    getSellerProducts: builder.query({
      query: (params) => ({
        url: endpoints.product.getSellerProducts,
        method: "GET",
        params,
      }),
      providesTags: ["Product"],
    }),

    // Get Single Product by ID
    getProductById: builder.query({
      query: (id) => ({
        url: `${endpoints.product.getProductById}/${id}`,
        method: "GET",
      }),
      providesTags: ["Product"],
    }),

    // Get Single Product by Slug
    getProductBySlug: builder.query({
      query: (slug) => ({
        url: `${endpoints.product.getProductBySlug}/${slug}`,
        method: "GET",
      }),
      providesTags: ["Product"],
    }),

    // Create Product
    createProduct: builder.mutation({
      query: (data) => ({
        url: endpoints.product.createProduct,
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Product"],
    }),

    // Update Product
    updateProduct: builder.mutation({
      query: ({ id, ...data }) => ({
        url: `${endpoints.product.updateProduct}/${id}`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: ["Product"],
    }),

    // Delete Product
    deleteProduct: builder.mutation({
      query: (id) => ({
        url: `${endpoints.product.deleteProduct}/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Product"],
    }),

    // Toggle Product Status
    toggleProductStatus: builder.mutation({
      query: (id) => ({
        url: `${endpoints.product.toggleProductStatus}/${id}`,
        method: "PATCH",
      }),
      invalidatesTags: ["Product"],
    }),

    // Alias for existing dashboard pages
    getProducts: builder.query({
      query: (params) => ({
        url: endpoints.product.getAllProducts,
        method: "GET",
        params,
      }),
      providesTags: ["Product"],
    }),
  }),
});

export const {
  useGetAllProductsQuery,
  useGetSellerProductsQuery,
  useGetProductByIdQuery,
  useGetProductBySlugQuery,
  useCreateProductMutation,
  useUpdateProductMutation,
  useDeleteProductMutation,
  useToggleProductStatusMutation,
  useGetProductsQuery,
} = productApi;
