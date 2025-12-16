import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

export const directorReminderApi = createApi({
  reducerPath: "directorReminderApi",
  baseQuery: fetchBaseQuery({
    baseUrl: `${BACKEND_URL}/api/director`,
    credentials: "include",
  }),
  tagTypes: ["reminder"],
  endpoints: (builder) => ({

    createReminder: builder.mutation({
      query: (data) => ({
        url: "/create-reminder",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["reminder"],
    }),

    getAllReminders: builder.query({
      query: (params) => ({
        url: "/get-all-reminders",
        method: "GET",
        params,
      }),
      providesTags: ["reminder"],
    }),

    getSingleReminder: builder.query({
      query: (id) => `/get-single-reminder/${id}`,
      providesTags: ["reminder"],
    }),

    updateReminder: builder.mutation({
      query: ({ id, ...data }) => ({
        url: `/update-reminder/${id}`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: ["reminder"],
    }),

    markCompleted: builder.mutation({
      query: (id) => ({
        url: `/mark-completed/${id}`,
        method: "PUT",
      }),
      invalidatesTags: ["reminder"],
    }),

    deleteReminder: builder.mutation({
      query: (id) => ({
        url: `/delete-reminder/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["reminder"],
    }),
  }),
});

export const {
  useCreateReminderMutation,
  useGetAllRemindersQuery,
  useGetSingleReminderQuery,
  useUpdateReminderMutation,
  useMarkCompletedMutation,
  useDeleteReminderMutation,
} = directorReminderApi;
