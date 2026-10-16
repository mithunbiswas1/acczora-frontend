// src/redux/api/reviewApi.js

import { apiSlice } from "@/redux/api-slice/api-slice";
import { endpoints } from "@/redux/endpoints/endpoints";

export const reviewApi = apiSlice.injectEndpoints({
  overrideExisting: true,

  endpoints: (builder) => ({
    // 1. Create Review (Buyer submits review, status: pending)
    createReview: builder.mutation({
      query: (data) => ({
        url: endpoints.review.createReview,
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Review", "Order"],
    }),

    // 2. Get Buyer Reviews (Buyer sees all their submitted reviews, including pending)
    getBuyerReviews: builder.query({
      query: (params) => ({
        url: endpoints.review.getBuyerReviews,
        method: "GET",
        params,
      }),
      providesTags: ["Review"],
    }),

    // 3. Get Product Reviews (Public approved reviews + buyer's pending)
    getProductReviews: builder.query({
      query: (productId) => ({
        url: `${endpoints.review.getProductReviews}/${productId}`,
        method: "GET",
      }),
      providesTags: ["Review"],
    }),

    // 4. Get Store Reviews (Public approved reviews for seller)
    getStoreReviews: builder.query({
      query: (sellerId) => ({
        url: `${endpoints.review.getStoreReviews}/${sellerId}`,
        method: "GET",
      }),
      providesTags: ["Review"],
    }),

    // 5. Get Admin Reviews (Admin moderation list with status/star filters)
    getAdminReviews: builder.query({
      query: (params) => ({
        url: endpoints.review.getAdminReviews,
        method: "GET",
        params,
      }),
      providesTags: ["Review"],
    }),

    // 6. Approve Review (Admin approves review)
    approveReview: builder.mutation({
      query: (id) => ({
        url: `${endpoints.review.approveReview}/${id}`,
        method: "PATCH",
      }),
      invalidatesTags: ["Review", "Product"],
    }),

    // 7. Reject Review (Admin rejects review)
    rejectReview: builder.mutation({
      query: ({ id, feedback }) => ({
        url: `${endpoints.review.rejectReview}/${id}`,
        method: "PATCH",
        body: { feedback },
      }),
      invalidatesTags: ["Review", "Product"],
    }),

    // 8. Delete Review (Admin deletes review)
    deleteReview: builder.mutation({
      query: (id) => ({
        url: `${endpoints.review.deleteReview}/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Review", "Product"],
    }),

    // 9. Reply to Review (Seller responds to review)
    replyToReview: builder.mutation({
      query: ({ id, reply }) => ({
        url: `${endpoints.review.replyToReview}/${id}`,
        method: "PATCH",
        body: { reply },
      }),
      invalidatesTags: ["Review"],
    }),
  }),
});

export const {
  useCreateReviewMutation,
  useGetBuyerReviewsQuery,
  useGetProductReviewsQuery,
  useGetStoreReviewsQuery,
  useGetAdminReviewsQuery,
  useApproveReviewMutation,
  useRejectReviewMutation,
  useDeleteReviewMutation,
  useReplyToReviewMutation,
} = reviewApi;
