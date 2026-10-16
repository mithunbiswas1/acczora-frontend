// src/redux/api/withdrawApi.js

import { apiSlice } from "@/redux/api-slice/api-slice";
import { endpoints } from "@/redux/endpoints/endpoints";

export const withdrawApi = apiSlice.injectEndpoints({
  overrideExisting: true,
  endpoints: (builder) => ({
    createWithdraw: builder.mutation({
      query: (data) => ({
        url: endpoints.withdraw.createWithdraw,
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Withdraw", "User", "Order"],
    }),

    getMyWithdrawals: builder.query({
      query: () => ({
        url: endpoints.withdraw.getMyWithdrawals,
        method: "GET",
      }),
      providesTags: ["Withdraw"],
    }),

    getAllWithdrawals: builder.query({
      query: (params) => ({
        url: endpoints.withdraw.getAllWithdrawals,
        method: "GET",
        params,
      }),
      providesTags: ["Withdraw"],
    }),

    updateWithdrawStatus: builder.mutation({
      query: ({ id, ...body }) => ({
        url: `${endpoints.withdraw.updateWithdrawStatus}/${id}`,
        method: "PATCH",
        body,
      }),
      invalidatesTags: ["Withdraw"],
    }),
  }),
});

export const {
  useCreateWithdrawMutation,
  useGetMyWithdrawalsQuery,
  useGetAllWithdrawalsQuery,
  useUpdateWithdrawStatusMutation,
} = withdrawApi;
