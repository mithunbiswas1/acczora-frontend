// src/redux/api/settingApi.js

import { apiSlice } from "@/redux/api-slice/api-slice";
import { endpoints } from "@/redux/endpoints/endpoints";

export const settingApi = apiSlice.injectEndpoints({
  overrideExisting: true,
  endpoints: (builder) => ({
    getPlatformSettings: builder.query({
      query: () => ({
        url: endpoints.setting.getPlatformSettings,
        method: "GET",
      }),
      providesTags: ["Setting"],
    }),

    updatePlatformSettings: builder.mutation({
      query: (data) => ({
        url: endpoints.setting.updatePlatformSettings,
        method: "PATCH",
        body: data,
      }),
      invalidatesTags: ["Setting"],
    }),
  }),
});

export const {
  useGetPlatformSettingsQuery,
  useUpdatePlatformSettingsMutation,
} = settingApi;
