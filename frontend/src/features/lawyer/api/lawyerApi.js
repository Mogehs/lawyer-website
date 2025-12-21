import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

export const lawyerApi = createApi({
  reducerPath: "lawyerApi",
  baseQuery: fetchBaseQuery({
    baseUrl: `${BACKEND_URL}/api`,
    credentials: "include",
  }),
  keepUnusedDataFor: 60,
  refetchOnMountOrArgChange: true,
  tagTypes: [
    "Cases",
    "Archive",
    "Notifications",
    "DashboardStats",
    "Hearings",
    "Reminders",
    "Timeline",
    "PendingApprovals",
    "Sessions",
  ],
  endpoints: (builder) => ({
    // ==================== DASHBOARD ====================
    getDashboardStats: builder.query({
      query: () => "/lawyer/dashboard/stats",
      providesTags: ["DashboardStats"],
      pollingInterval: 30000, // Auto-refresh every 30 seconds
      skipPollingIfUnfocused: true,
      refetchOnMountOrArgChange: true,
    }),

    // ==================== CASES ====================
    getAssignedCases: builder.query({
      query: (params) => {
        const { page = 1, limit = 10, status, search } = params || {};
        const queryParams = new URLSearchParams();
        if (page) queryParams.append("page", page);
        if (limit) queryParams.append("limit", limit);
        if (status) queryParams.append("status", status);
        if (search) queryParams.append("search", search);
        return `/lawyer/cases?${queryParams.toString()}`;
      },
      providesTags: ["Cases"],
      pollingInterval: 60000, // Auto-refresh every 60 seconds
      skipPollingIfUnfocused: true,
    }),

    getCaseById: builder.query({
      query: (id) => `/lawyer/cases/${id}`,
      providesTags: (result, error, id) => [{ type: "Cases", id }],
    }),

    acceptCase: builder.mutation({
      query: (id) => ({
        url: `/lawyer/cases/${id}/accept`,
        method: "POST",
      }),
      invalidatesTags: ["Cases", "DashboardStats", "Notifications"],
    }),

    // ==================== MEMORANDUM ====================
    submitMemorandum: builder.mutation({
      query: ({ id, stageIndex, content, fileUrl }) => ({
        url: `/lawyer/cases/${id}/memorandum`,
        method: "POST",
        body: { stageIndex, content, fileUrl },
      }),
      invalidatesTags: ["Cases", "DashboardStats", "Timeline"],
    }),

    uploadMemorandumFile: builder.mutation({
      query: ({ id, formData }) => ({
        url: `/lawyer/cases/${id}/memorandum/upload`,
        method: "POST",
        body: formData,
      }),
      invalidatesTags: (result, error, { id }) => [
        "Cases",
        { type: "Cases", id },
        "DashboardStats",
        "Timeline",
      ],
    }),

    uploadCaseDocument: builder.mutation({
      query: ({ id, formData }) => ({
        url: `/lawyer/cases/${id}/documents/upload`,
        method: "POST",
        body: formData,
      }),
      invalidatesTags: (result, error, { id }) => [
        "Cases",
        { type: "Cases", id },
        "DashboardStats",
        "Timeline",
      ],
    }),

    updateMemorandum: builder.mutation({
      query: ({ id, stageIndex, content, fileUrl }) => ({
        url: `/lawyer/cases/${id}/memorandum`,
        method: "PUT",
        body: { stageIndex, content, fileUrl },
      }),
      invalidatesTags: ["Cases", "Timeline"],
    }),

    // ==================== APPROVALS (For Ragab) ====================
    getPendingApprovals: builder.query({
      query: (params) => {
        const { page = 1, limit = 10 } = params || {};
        return `/lawyer/pending-approvals?page=${page}&limit=${limit}`;
      },
      providesTags: ["PendingApprovals"],
      pollingInterval: 60000,
      skipPollingIfUnfocused: true,
    }),

    approveMemorandum: builder.mutation({
      query: ({ id, stageIndex }) => ({
        url: `/lawyer/cases/${id}/memorandum/approve`,
        method: "POST",
        body: { stageIndex },
      }),
      invalidatesTags: [
        "Cases",
        "PendingApprovals",
        "DashboardStats",
        "Notifications",
        "Timeline",
      ],
    }),

    rejectMemorandum: builder.mutation({
      query: ({ id, stageIndex, feedback }) => ({
        url: `/lawyer/cases/${id}/memorandum/reject`,
        method: "POST",
        body: { stageIndex, feedback },
      }),
      invalidatesTags: [
        "Cases",
        "PendingApprovals",
        "DashboardStats",
        "Notifications",
        "Timeline",
      ],
    }),

    // ==================== ARCHIVE ====================
    getMyArchive: builder.query({
      query: (params) => {
        const { page = 1, limit = 10, search } = params || {};
        const queryParams = new URLSearchParams();
        if (page) queryParams.append("page", page);
        if (limit) queryParams.append("limit", limit);
        if (search) queryParams.append("search", search);
        return `/lawyer/archive?${queryParams.toString()}`;
      },
      providesTags: ["Archive"],
      pollingInterval: 120000, // Refresh every 2 minutes (archive changes less frequently)
      skipPollingIfUnfocused: true,
    }),

    // ==================== HEARINGS ====================
    getUpcomingHearings: builder.query({
      query: () => "/lawyer/hearings",
      providesTags: ["Hearings"],
      pollingInterval: 60000,
      skipPollingIfUnfocused: true,
    }),

    // ==================== REMINDERS ====================
    getMyReminders: builder.query({
      query: (params) => {
        const { upcoming } = params || {};
        return `/lawyer/reminders${upcoming ? "?upcoming=true" : ""}`;
      },
      providesTags: ["Reminders"],
      pollingInterval: 60000,
      skipPollingIfUnfocused: true,
    }),

    // ==================== CASE NOTES ====================
    addCaseNote: builder.mutation({
      query: ({ id, note }) => ({
        url: `/lawyer/cases/${id}/notes`,
        method: "POST",
        body: { note },
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: "Cases", id },
        "Timeline",
      ],
    }),

    // ==================== DELETE CASE ====================
    deleteCase: builder.mutation({
      query: (id) => ({
        url: `/lawyer/cases/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Cases", "DashboardStats"],
    }),

    // ==================== TIMELINE ====================
    getCaseTimeline: builder.query({
      query: (id) => `/lawyer/cases/${id}/timeline`,
      providesTags: ["Timeline"],
    }),

    // ==================== LAWYERS LIST ====================
    getAllLawyers: builder.query({
      query: () => "/lawyer/all-lawyers",
    }),

    // ==================== NOTIFICATIONS ====================
    getNotifications: builder.query({
      query: (params) => {
        const { type, stage, status } = params || {};
        const queryParams = new URLSearchParams();
        if (type) queryParams.append("type", type);
        if (stage) queryParams.append("stage", stage);
        if (status) queryParams.append("status", status);
        return `/lawyer/notifications${
          queryParams.toString() ? `?${queryParams.toString()}` : ""
        }`;
      },
      providesTags: ["Notifications"],
      pollingInterval: 60000, // Auto-refresh every 60 seconds
      skipPollingIfUnfocused: true,
    }),

    markNotificationAsRead: builder.mutation({
      query: (id) => ({
        url: `/lawyer/notifications/${id}/read`,
        method: "POST",
      }),
      invalidatesTags: ["Notifications"],
    }),

    // ==================== BACKWARD COMPATIBILITY ====================
    // Keep old endpoints for existing code
    lawyerCases: builder.query({
      query: (search) => ({
        url: `/lawyer/cases?search=${encodeURIComponent(search || "")}`,
        method: "GET",
      }),
      providesTags: ["Cases"],
    }),

    getLawyerArchieve: builder.query({
      query: (search) => ({
        url: `/lawyer/archive?search=${encodeURIComponent(search || "")}`,
        method: "GET",
      }),
      providesTags: ["Archive"],
    }),

    lawyerDashboardStats: builder.query({
      query: () => ({
        url: `/lawyer/dashboard/stats`,
        method: "GET",
      }),
      providesTags: ["DashboardStats"],
    }),

    // ==================== SESSION MANAGEMENT ====================
    getMyAssignedSessions: builder.query({
      query: () => "/lawyer/my-sessions",
      providesTags: ["Sessions"],
    }),

    completeSession: builder.mutation({
      query: ({ caseId, sessionId, completionData }) => ({
        url: `/lawyer/cases/${caseId}/sessions/${sessionId}/complete`,
        method: "POST",
        body: completionData,
      }),
      invalidatesTags: ["Sessions", "Cases"],
    }),

    uploadSessionMemorandum: builder.mutation({
      query: ({ caseId, sessionId, memorandumData }) => ({
        url: `/lawyer/cases/${caseId}/sessions/${sessionId}/memorandum`,
        method: "POST",
        body: memorandumData,
      }),
      invalidatesTags: ["Sessions", "Cases"],
    }),
  }),
});

export const {
  // Dashboard
  useGetDashboardStatsQuery,

  // Cases
  useGetAssignedCasesQuery,
  useGetCaseByIdQuery,
  useAcceptCaseMutation,

  // Memorandum
  useSubmitMemorandumMutation,
  useUploadMemorandumFileMutation,
  useUpdateMemorandumMutation,

  // Documents
  useUploadCaseDocumentMutation,

  // Approvals
  useGetPendingApprovalsQuery,
  useApproveMemorandumMutation,
  useRejectMemorandumMutation,

  // Archive
  useGetMyArchiveQuery,

  // Hearings
  useGetUpcomingHearingsQuery,

  // Reminders
  useGetMyRemindersQuery,

  // Notes
  useAddCaseNoteMutation,

  // Delete Case
  useDeleteCaseMutation,

  // Timeline
  useGetCaseTimelineQuery,

  // Lawyers
  useGetAllLawyersQuery,

  // Notifications
  useGetNotificationsQuery,
  useMarkNotificationAsReadMutation,

  // Session Management
  useGetMyAssignedSessionsQuery,
  useCompleteSessionMutation,
  useUploadSessionMemorandumMutation,

  // Backward compatibility - deprecated
  useLawyerCasesQuery,
  useGetLawyerArchieveQuery,
  useLawyerDashboardStatsQuery,
} = lawyerApi;
