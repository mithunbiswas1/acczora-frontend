// src/redux/api/orderApi.js

import { apiSlice } from "@/redux/api-slice/api-slice";
import { endpoints } from "@/redux/endpoints/endpoints";

export const orderApi = apiSlice.injectEndpoints({
  overrideExisting: true,

  endpoints: (builder) => ({
    // 1. Create Order & Auto-Deliver Credentials
    createOrder: builder.mutation({
      query: (data) => ({
        url: endpoints.order.createOrder,
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Order", "Product"],
    }),

    // 2. Get Buyer Orders
    getBuyerOrders: builder.query({
      query: (params) => ({
        url: endpoints.order.getBuyerOrders,
        method: "GET",
        params,
      }),
      providesTags: ["Order"],
    }),

    // 3. Get Seller Orders
    getSellerOrders: builder.query({
      query: (params) => ({
        url: endpoints.order.getSellerOrders,
        method: "GET",
        params,
      }),
      providesTags: ["Order"],
    }),

    // 4. Get All Orders (Admin)
    getAllOrders: builder.query({
      query: (params) => ({
        url: endpoints.order.getAllOrders,
        method: "GET",
        params,
      }),
      providesTags: ["Order"],
    }),

    // 5. Get Order by ID
    getOrderById: builder.query({
      query: (id) => ({
        url: `${endpoints.order.getOrderById}/${id}`,
        method: "GET",
      }),
      providesTags: ["Order"],
    }),

    // 6. Buy / Top-up Points
    buyPoints: builder.mutation({
      query: (data) => ({
        url: endpoints.order.buyPoints,
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["User", "Order"],
    }),

    // 7. Get My Points
    getMyPoints: builder.query({
      query: () => ({
        url: endpoints.order.getMyPoints,
        method: "GET",
      }),
      providesTags: ["User", "Order"],
    }),
  }),
});

export const {
  useCreateOrderMutation,
  useGetBuyerOrdersQuery,
  useGetSellerOrdersQuery,
  useGetAllOrdersQuery,
  useGetOrderByIdQuery,
  useBuyPointsMutation,
  useGetMyPointsQuery,
} = orderApi;
