import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

export const directorApi = createApi({
    reducerPath: "directorApi",
    baseQuery: fetchBaseQuery({
        baseUrl: `${BACKEND_URL}/api/director`,
        credentials: "include",
    }),
    tagTypes: ["Users"],
    endpoints: (builder) => ({
        userStats: builder.query({
            query: () => ({
                url: "/stats",
                method: "GET",
            }),
            providesTags: ["director"],
        }),
        allUsers: builder.query({
            query: (search = "") => ({
                url: `/all-users?search=${encodeURIComponent(search)}`,
                method: "GET",
            }),
            providesTags: (result) =>
                result
                    ? [
                        ...result.users.map(({ _id }) => ({ type: "director", id: _id })),
                        { type: "director", id: "LIST" },
                    ]
                    : [{ type: "director", id: "LIST" }],
        }),
        updateRole: builder.mutation({
            query: ({ id, data }) => ({
                url: `/update-user-role/${id}`,
                method: "PUT",
                body: data,
            }),
            providesTags: ["director"],
        }),
        addUser: builder.mutation({
            query: (data) => ({
                url: "/addUser",
                method: "POST",
                body: data,
            }),
            providesTags: ["director"],
        }),


        deleteUser: builder.mutation({
            query: (id) => ({
                url: `/delete-user/${id}`,
                method: "DELETE",
            }),
            providesTags: ["director"],
        }),

        getAllCases: builder.query({
            query: (search = "") => ({
                url: `/cases?search=${search}`,
                method: 'GET',
            }),
            invalidatesTags: ["director"],
        }),

        getAllArchieve: builder.query({
            query: (search) => ({
                url: `/director-archive?search=${encodeURIComponent(search)}`,
                method: 'GET'
            }),
            invalidatesTags: ["director"],
        }),

        getAllReminders: builder.query({
            query: () => ({
                url: `/reminders`,
                method: "GET"
            }),
            invalidatesTags: ["director"],
        }),

        getPendingSignature: builder.query({
            query: () => ({
                url: `/getPendingSignature`,
                method: "GET"
            }),
            invalidatesTags: ["director"],
        }),

        getPendingSignatureCases: builder.query({
            query: ({ page = 1, limit = 10 } = {}) => ({
                url: `/pending-signature-cases?page=${page}&limit=${limit}`,
                method: "GET"
            }),
            providesTags: ["director"],
        }),

        approveWithSignedDocument: builder.mutation({
            query: ({ id, formData }) => ({
                url: `/approve-signed/${id}`,
                method: "POST",
                body: formData,
            }),
            invalidatesTags: ["director"],
        }),

        updateStatusReadyForSubmission: builder.mutation({
            query: ({ id, data }) => ({
                url: `/updateStatusReadyForSubmission/${id}`,
                method: "PUT",
                body: data,
            }),
            invalidatesTags: ["director"],
        }),

        deleteCase: builder.mutation({
            query: (id) => ({
                url: `/delete-case/${id}`,
                method: "DELETE",
            }),
            invalidatesTags: ["director"],
        }),
        getPendingSessions: builder.query({
            query: () => ({
                url: `/pending-sessions`,
                method: "GET",
            }),
            providesTags: ["director"],
        }),

        approveSessionForSubmission: builder.mutation({
            query: ({ caseId, sessionId, body }) => ({
                url: `/cases/${caseId}/sessions/${sessionId}/approve`,
                method: "POST",
                body,
            }),
            invalidatesTags: ["director"],
        }),
    }),
});

export const {
    useUserStatsQuery,
    useAllUsersQuery,
    useUpdateRoleMutation,
    useAddUserMutation,
    useDeleteUserMutation,
    useGetPendingSignatureCasesQuery,
    useApproveWithSignedDocumentMutation,
    useGetAllCasesQuery,
    useGetAllArchieveQuery,
    useGetAllRemindersQuery,
    useGetPendingSignatureQuery,
    useUpdateStatusReadyForSubmissionMutation,
    useDeleteCaseMutation,
    useGetPendingSessionsQuery,
    useApproveSessionForSubmissionMutation,
} = directorApi;
