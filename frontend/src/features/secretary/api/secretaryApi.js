import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

export const secretaryApi = createApi({
  reducerPath: "secretaryApi",
  baseQuery: fetchBaseQuery({
    baseUrl: `${BACKEND_URL}/api/secretary`,
    credentials: "include",
  }),
  keepUnusedDataFor: 60, // Keep data for 60 seconds
  refetchOnMountOrArgChange: true,
  tagTypes: [
    "Clients",
    "Cases",
    "Archive",
    "ActivityLogs",
    "DashboardStats",
    "Reminders",
    "Sessions",
  ],
  endpoints: (builder) => ({
    // ==================== CLIENT ENDPOINTS ====================
    createClient: builder.mutation({
      query: (clientData) => ({
        url: "/clients",
        method: "POST",
        body: clientData,
      }),
      invalidatesTags: ["Clients"],
    }),
    getAllClients: builder.query({
      query: () => ({
        url: "/clients",
        method: "GET",
      }),
      providesTags: ["Clients"],
      transformResponse: (response) => ({
        clients: response.data || [],
        totalPages: response.totalPages || 1,
        currentPage: response.currentPage || 1,
      }),
    }),
    getClientById: builder.query({
      query: (id) => ({
        url: `/clients/${id}`,
        method: "GET",
      }),
      providesTags: (result, error, id) => [{ type: "Clients", id }],
    }),
    updateClient: builder.mutation({
      query: ({ id, data }) => ({
        url: `/clients/${id}`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: "Clients", id },
        "Clients",
      ],
    }),
    deleteClient: builder.mutation({
      query: (id) => ({
        url: `/clients/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Clients"],
    }),

    // ==================== CASE ENDPOINTS ====================
    getAllCases: builder.query({
      query: ({ page = 1, limit = 50, search = "" } = {}) => ({
        url: `/cases?page=${page}&limit=${limit}&search=${encodeURIComponent(
          search
        )}`,
        method: "GET",
      }),
      providesTags: ["Cases"],
    }),
    createCase: builder.mutation({
      query: (caseData) => ({
        url: "/cases",
        method: "POST",
        body: caseData,
      }),
      invalidatesTags: ["Cases", "DashboardStats"],
    }),
    getCaseById: builder.query({
      query: (id) => ({
        url: `/cases/${id}`,
        method: "GET",
      }),
      providesTags: (result, error, id) => [{ type: "Cases", id }],
    }),
    updateCase: builder.mutation({
      query: ({ id, data }) => ({
        url: `/cases/${id}`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: "Cases", id },
        "Cases",
      ],
    }),
    uploadCaseDocuments: builder.mutation({
      query: ({ id, documents }) => ({
        url: `/cases/${id}/documents`,
        method: "POST",
        body: { documents },
      }),
      invalidatesTags: (result, error, { id }) => [{ type: "Cases", id }],
    }),
    deleteCase: builder.mutation({
      query: (id) => ({
        url: `/cases/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Cases", "DashboardStats", "ActivityLogs"],
    }),
    uploadCaseDocumentsWithFiles: builder.mutation({
      query: ({ id, formData }) => ({
        url: `/cases/${id}/documents/upload`,
        method: "POST",
        body: formData,
      }),
      invalidatesTags: (result, error, { id }) => [{ type: "Cases", id }],
    }),
    assignCaseToLawyer: builder.mutation({
      query: ({ id, lawyerId, approvingLawyerId }) => ({
        url: `/cases/${id}/assign`,
        method: "POST",
        body: { lawyerId, approvingLawyerId },
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: "Cases", id },
        "Cases",
      ],
    }),

    // ==================== CASE STAGE ENDPOINTS ====================
    addCaseStage: builder.mutation({
      query: ({ id, stageData }) => ({
        url: `/cases/${id}/stages`,
        method: "POST",
        body: stageData,
      }),
      invalidatesTags: (result, error, { id }) => [{ type: "Cases", id }],
    }),
    uploadStageDocuments: builder.mutation({
      query: ({ id, stageId, documents }) => ({
        url: `/cases/${id}/stages/documents`,
        method: "POST",
        body: { stageId, documents },
      }),
      invalidatesTags: (result, error, { id }) => [{ type: "Cases", id }],
    }),
    uploadStageDocumentsWithFiles: builder.mutation({
      query: ({ id, formData }) => ({
        url: `/cases/${id}/stages/documents/upload`,
        method: "POST",
        body: formData,
      }),
      invalidatesTags: (result, error, { id }) => [{ type: "Cases", id }],
    }),
    updateHearingDetails: builder.mutation({
      query: ({ id, hearingData }) => ({
        url: `/cases/${id}/hearing`,
        method: "PUT",
        body: hearingData,
      }),
      invalidatesTags: (result, error, { id }) => [{ type: "Cases", id }],
    }),
    updateCourtCaseId: builder.mutation({
      query: ({ id, courtCaseId }) => ({
        url: `/cases/${id}/court-case-id`,
        method: "PUT",
        body: { courtCaseId },
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: "Cases", id },
        "Cases",
        "ActivityLogs",
      ],
    }),

    // ==================== COURT SUBMISSION ENDPOINTS ====================
    submitToCourt: builder.mutation({
      query: ({ id, submissionData }) => ({
        url: `/cases/${id}/submit`,
        method: "POST",
        body: submissionData,
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: "Cases", id },
        "ActivityLogs",
      ],
    }),
    uploadCourtSubmissionProof: builder.mutation({
      query: ({ id, formData }) => ({
        url: `/cases/${id}/submit/upload`,
        method: "POST",
        body: formData,
      }),
      invalidatesTags: (result, error, { id }) => [{ type: "Cases", id }],
    }),

    // ==================== ARCHIVE ENDPOINTS ====================
    archiveCase: builder.mutation({
      query: (id) => ({
        url: `/cases/${id}/archive`,
        method: "POST",
      }),
      invalidatesTags: ["Cases", "Archive", "DashboardStats"],
    }),
    getArchivedCases: builder.query({
      query: () => ({
        url: "/archive",
        method: "GET",
      }),
      providesTags: ["Archive"],
    }),

    // ==================== NOTES & ACTIVITY ENDPOINTS ====================
    addCaseNote: builder.mutation({
      query: ({ id, note }) => ({
        url: `/cases/${id}/notes`,
        method: "POST",
        body: { note },
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: "Cases", id },
        "ActivityLogs",
      ],
    }),
    getActivityLogs: builder.query({
      query: (params) => {
        const { page = 1, limit = 20 } = params || {};
        return {
          url: `/activity-logs?page=${page}&limit=${limit}`,
          method: "GET",
        };
      },
      providesTags: ["ActivityLogs"],
      transformResponse: (response) => response,
    }),
    getReminders: builder.query({
      query: () => ({
        url: "/reminders",
        method: "GET",
      }),
      providesTags: ["Reminders"],
    }),
    createReminder: builder.mutation({
      query: (reminderData) => ({
        url: "/reminders",
        method: "POST",
        body: reminderData,
      }),
      invalidatesTags: ["Reminders", "ActivityLogs"],
    }),
    deleteReminder: builder.mutation({
      query: (id) => ({
        url: `/reminders/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Reminders", "ActivityLogs"],
    }),

    // ==================== DASHBOARD & LAWYERS ====================
    getDashboardStats: builder.query({
      query: () => ({
        url: "/dashboard/stats",
        method: "GET",
      }),
      providesTags: ["DashboardStats"],
      transformResponse: (response) => response,
    }),
    getCaseStatsByStatus: builder.query({
      query: () => ({
        url: "/dashboard/case-stats",
        method: "GET",
      }),
      providesTags: ["DashboardStats"],
    }),
    getRecentCases: builder.query({
      query: (limit = 5) => ({
        url: `/dashboard/recent-cases?limit=${limit}`,
        method: "GET",
      }),
      providesTags: ["Cases"],
    }),
    getQuickStats: builder.query({
      query: () => ({
        url: "/dashboard/quick-stats",
        method: "GET",
      }),
      providesTags: ["DashboardStats"],
    }),
    getLawyers: builder.query({
      query: () => ({
        url: "/lawyers",
        method: "GET",
      }),
    }),

    // ==================== SESSION ENDPOINTS ====================
    createSession: builder.mutation({
      query: ({ caseId, sessionData }) => ({
        url: `/cases/${caseId}/sessions`,
        method: "POST",
        body: sessionData,
      }),
      invalidatesTags: ["Sessions", "Cases"],
    }),
    getSessions: builder.query({
      query: (caseId) => ({
        url: `/cases/${caseId}/sessions`,
        method: "GET",
      }),
      providesTags: ["Sessions"],
    }),
    updateSession: builder.mutation({
      query: ({ caseId, sessionId, data }) => ({
        url: `/cases/${caseId}/sessions/${sessionId}`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: ["Sessions", "Cases"],
    }),
    deleteSession: builder.mutation({
      query: ({ caseId, sessionId }) => ({
        url: `/cases/${caseId}/sessions/${sessionId}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Sessions", "Cases"],
    }),
  }),
});

export const {
  // Client hooks
  useCreateClientMutation,
  useGetAllClientsQuery,
  useGetClientByIdQuery,
  useUpdateClientMutation,
  useDeleteClientMutation,

  // Case hooks
  useGetAllCasesQuery,
  useCreateCaseMutation,
  useGetCaseByIdQuery,
  useUpdateCaseMutation,
  useDeleteCaseMutation,
  useUploadCaseDocumentsMutation,
  useUploadCaseDocumentsWithFilesMutation,
  useAssignCaseToLawyerMutation,

  // Case stage hooks
  useAddCaseStageMutation,
  useUploadStageDocumentsMutation,
  useUploadStageDocumentsWithFilesMutation,
  useUpdateHearingDetailsMutation,
  useUpdateCourtCaseIdMutation,

  // Court submission hooks
  useSubmitToCourtMutation,
  useUploadCourtSubmissionProofMutation,

  // Archive hooks
  useArchiveCaseMutation,
  useGetArchivedCasesQuery,

  // Notes & activity hooks
  useAddCaseNoteMutation,
  useGetActivityLogsQuery,
  useGetRemindersQuery,
  useCreateReminderMutation,
  useDeleteReminderMutation,

  // Dashboard & lawyers hooks
  useGetDashboardStatsQuery,
  useGetCaseStatsByStatusQuery,
  useGetRecentCasesQuery,
  useGetQuickStatsQuery,
  useGetLawyersQuery,

  // Session management hooks
  useCreateSessionMutation,
  useGetSessionsQuery,
  useUpdateSessionMutation,
  useDeleteSessionMutation,
} = secretaryApi;
