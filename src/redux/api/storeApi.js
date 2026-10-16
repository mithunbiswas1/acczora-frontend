// src/redux/api/storeApi.js

import { apiSlice } from "@/redux/api-slice/api-slice";
import { endpoints } from "@/redux/endpoints/endpoints";

export const storeApi = apiSlice.injectEndpoints({
  overrideExisting: true,

  endpoints: (builder) => ({
    // 1. Get Store Settings (Seller)
    getStoreSettings: builder.query({
      query: () => ({
        url: endpoints.store.getStoreSettings,
        method: "GET",
      }),
      providesTags: ["Store", "User"],
    }),

    // 2. Update Store Settings (Seller)
    updateStoreSettings: builder.mutation({
      query: (data) => ({
        url: endpoints.store.updateStoreSettings,
        method: "PATCH",
        body: data,
      }),
      invalidatesTags: ["Store", "User"],
    }),

    // 3. Get Store By Slug (Public storefront)
    getStoreBySlug: builder.query({
      query: (slug) => ({
        url: `${endpoints.store.getStoreBySlug}/${slug}`,
        method: "GET",
      }),
      providesTags: ["Store", "Product", "Review"],
    }),

    // 4. Get All Stores (Public directory & Admin)
    getAllStores: builder.query({
      query: (params) => ({
        url: endpoints.store.getAllStores,
        method: "GET",
        params,
      }),
      providesTags: ["Store"],
    }),

    // 5. Toggle Store Verification & Approve Seller (Admin)
    toggleStoreVerification: builder.mutation({
      query: (arg) => {
        const id = typeof arg === "object" ? arg.id : arg;
        const body = typeof arg === "object" ? arg : {};
        return {
          url: `${endpoints.store.toggleStoreVerification}/${id}`,
          method: "PATCH",
          body,
        };
      },
      invalidatesTags: ["Store", "Auth"],
    }),
  }),
});

export const {
  useGetStoreSettingsQuery,
  useUpdateStoreSettingsMutation,
  useGetStoreBySlugQuery,
  useGetAllStoresQuery,
  useToggleStoreVerificationMutation,
} = storeApi;
