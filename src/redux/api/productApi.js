// src/redux/api/productApi.js

import { apiSlice } from "@/redux/api-slice/api-slice";
import { endpoints } from "@/redux/endpoints/endpoints";

export const productApi = apiSlice.injectEndpoints({
  overrideExisting: true,

  endpoints: (builder) => ({
    // Get Products (Public search / catalog)
    getProducts: builder.query({
      query: (params = {}) => ({
        url: endpoints.product.product,
        params,
      }),
      providesTags: (result) =>
        result?.data?.products
          ? [
              ...result.data.products.map(({ _id }) => ({
                type: "Product",
                id: _id,
              })),
              { type: "Product", id: "LIST" },
            ]
          : [{ type: "Product", id: "LIST" }],
    }),

    // Get Seller's Products (Dashboard)
    getSellerProducts: builder.query({
      query: (params = {}) => ({
        url: endpoints.product.seller,
        params,
      }),
      providesTags: (result) =>
        result?.data?.products
          ? [
              ...result.data.products.map(({ _id }) => ({
                type: "Product",
                id: _id,
              })),
              { type: "Product", id: "LIST" },
            ]
          : [{ type: "Product", id: "LIST" }],
    }),

    // Get Single Product
    getProductById: builder.query({
      query: (id) => ({
        url: `${endpoints.product.product}/${id}`,
      }),
      providesTags: (result, error, id) => [{ type: "Product", id }],
    }),

    // Create Product
    createProduct: builder.mutation({
      query: (data) => ({
        url: endpoints.product.product,
        method: "POST",
        body: data,
      }),
      invalidatesTags: [{ type: "Product", id: "LIST" }],
    }),

    // Update Product
    updateProduct: builder.mutation({
      query: ({ id, ...data }) => ({
        url: `${endpoints.product.product}/${id}`,
        method: "PATCH",
        body: data,
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: "Product", id },
        { type: "Product", id: "LIST" },
      ],
    }),

    // Delete Product
    deleteProduct: builder.mutation({
      query: (id) => ({
        url: `${endpoints.product.product}/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: [{ type: "Product", id: "LIST" }],
    }),

    // Toggle Product Status
    toggleProductStatus: builder.mutation({
      query: (id) => ({
        url: `${endpoints.product.product}/${id}/toggle`,
        method: "PATCH",
      }),
      invalidatesTags: (result, error, id) => [
        { type: "Product", id },
        { type: "Product", id: "LIST" },
      ],
    }),
  }),
});

export const {
  useGetProductsQuery,
  useGetSellerProductsQuery,
  useGetProductByIdQuery,
  useCreateProductMutation,
  useUpdateProductMutation,
  useDeleteProductMutation,
  useToggleProductStatusMutation,
} = productApi;
