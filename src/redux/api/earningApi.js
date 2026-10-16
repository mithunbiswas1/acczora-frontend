// src/redux/api/earningApi.js

import { apiSlice } from "@/redux/api-slice/api-slice";
import { endpoints } from "@/redux/endpoints/endpoints";

export const earningApi = apiSlice.injectEndpoints({
  overrideExisting: true,
  endpoints: (builder) => ({
    getSellerEarnings: builder.query({
      query: () => ({
        url: endpoints.earning.getSellerEarnings,
        method: "GET",
      }),
      providesTags: ["Earning"],
    }),

    getAllEarnings: builder.query({
      query: (params) => ({
        url: endpoints.earning.getAllEarnings,
        method: "GET",
        params,
      }),
      providesTags: ["Earning"],
    }),

    releaseEscrow: builder.mutation({
      query: (id) => ({
        url: `${endpoints.earning.releaseEscrow}/${id}`,
        method: "PATCH",
      }),
      invalidatesTags: ["Earning"],
    }),
  }),
});

export const {
  useGetSellerEarningsQuery,
  useGetAllEarningsQuery,
  useReleaseEscrowMutation,
} = earningApi;
