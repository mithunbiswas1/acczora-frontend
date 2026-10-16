// src/redux/api/supportApi.js

import { apiSlice } from "@/redux/api-slice/api-slice";
import { endpoints } from "@/redux/endpoints/endpoints";

export const supportApi = apiSlice.injectEndpoints({
  overrideExisting: true,
  endpoints: (builder) => ({
    createTicket: builder.mutation({
      query: (data) => ({
        url: endpoints.support.createTicket,
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Support"],
    }),

    getMyTickets: builder.query({
      query: () => ({
        url: endpoints.support.getMyTickets,
        method: "GET",
      }),
      providesTags: ["Support"],
    }),

    getTicketById: builder.query({
      query: (id) => ({
        url: `${endpoints.support.getTicketById}/${id}`,
        method: "GET",
      }),
      providesTags: ["Support"],
    }),

    replyTicket: builder.mutation({
      query: ({ id, message }) => ({
        url: `${endpoints.support.replyTicket}/${id}`,
        method: "POST",
        body: { message },
      }),
      invalidatesTags: ["Support"],
    }),

    getAllTickets: builder.query({
      query: (params) => ({
        url: endpoints.support.getAllTickets,
        method: "GET",
        params,
      }),
      providesTags: ["Support"],
    }),

    updateTicketStatus: builder.mutation({
      query: ({ id, ...body }) => ({
        url: `${endpoints.support.updateTicketStatus}/${id}`,
        method: "PATCH",
        body,
      }),
      invalidatesTags: ["Support"],
    }),
  }),
});

export const {
  useCreateTicketMutation,
  useGetMyTicketsQuery,
  useGetTicketByIdQuery,
  useReplyTicketMutation,
  useGetAllTicketsQuery,
  useUpdateTicketStatusMutation,
} = supportApi;
