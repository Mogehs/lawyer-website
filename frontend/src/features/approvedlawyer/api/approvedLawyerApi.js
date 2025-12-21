import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

export const approvedLawyerApi = createApi({
    reducerPath: 'approvedLawyerApi',
    baseQuery: fetchBaseQuery({
        baseUrl: `${BACKEND_URL}/api/lawyer`,
        credentials: "include",
    }),
    tagTypes: ['Cases', 'Sessions'],

    endpoints: (builder) => ({
        // GET: Pending Approvals
        pendingApprovals: builder.query({
            query: () => ({
                url: `/pending-approvals`,
                method: 'GET',
            }),
            providesTags: ['Cases'],
        }),

        updateCaseApproval: builder.mutation({
            query: ({ caseId, approvalData }) => ({
                url: `/pending-approvals/${caseId}`,
                method: 'POST',
                body: approvalData,
            }),
            invalidatesTags: ['Cases'],
        }),

        requestModificationBAL: builder.mutation({
            query: ({ id, modificationData }) => ({
                url: `/request-modification/${id}`,
                method: 'POST',
                body: modificationData,
            }),
            invalidatesTags: ['Cases'],
        }),

        // Session Review Endpoints
        reviewSession: builder.mutation({
            query: ({ caseId, sessionId, reviewData }) => ({
                url: `/cases/${caseId}/sessions/${sessionId}/review`,
                method: 'POST',
                body: reviewData,
            }),
            invalidatesTags: ['Sessions', 'Cases'],
        }),

        reviewMemorandum: builder.mutation({
            query: ({ caseId, sessionId, reviewData }) => ({
                url: `/cases/${caseId}/sessions/${sessionId}/memorandum/review`,
                method: 'POST',
                body: reviewData,
            }),
            invalidatesTags: ['Sessions', 'Cases'],
        }),

    }),
});

export const {
    usePendingApprovalsQuery,
    useUpdateCaseApprovalMutation,
    useRequestModificationBALMutation,
    useReviewSessionMutation,
    useReviewMemorandumMutation,
} = approvedLawyerApi;
