// src/redux/api-slice/api-slice.js

import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { API_BASE_URL } from "@/config/base-url";
import { getCookie, deleteCookie } from "@/utils/cookie";

const baseQuery = fetchBaseQuery({
  baseUrl: API_BASE_URL,
  credentials: "include", // Send & receive HTTP cookies automatically
  prepareHeaders: (headers) => {
    if (typeof window !== "undefined") {
      const token = getCookie("accessToken");
      if (token) {
        headers.set("Authorization", `Bearer ${token}`);
      }
    }
    return headers;
  },
});

// CUSTOM BASE QUERY WITH AUTH HANDLING
const baseQueryWithAuth = async (args, api, extraOptions) => {
  const result = await baseQuery(args, api, extraOptions);

  // HANDLE UNAUTHENTICATED ERROR
  if (result?.error) {
    const status = result.error.status;
    const data = result.error.data;

    if (status === 401 || data?.error === "Unauthenticated.") {
      if (typeof window !== "undefined") {
        deleteCookie("accessToken");
        deleteCookie("refreshToken");
        deleteCookie("userRole");
        localStorage.removeItem("user");

        // only redirect if in protected pages
        if (
          window.location.pathname.startsWith("/admin") ||
          window.location.pathname.startsWith("/seller") ||
          window.location.pathname.startsWith("/buyer") ||
          window.location.pathname.startsWith("/dashboard") ||
          window.location.pathname.startsWith("/profile")
        ) {
          window.location.href = "/login";
        }
      }
    }
  }

  return result;
};


export const apiSlice = createApi({
  reducerPath: "api",
  baseQuery: baseQueryWithAuth,
  tagTypes: [
    "Product",
    "Setting",
    "Slider",
    "Category",
    "Subcategory",
    "Auth",
    "Profile",
    "Orders",
    "Order",
    "ProductReviews",
    "Review",
    "Store",
    "User",
    "Tracking",
    "Earning",
    "Withdraw",
    "Role",
    "Support",
    "Setting",
  ],
  endpoints: () => ({}),
});
