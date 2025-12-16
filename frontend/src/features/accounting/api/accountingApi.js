import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

const BASE_URL = import.meta.env.VITE_BACKEND_URL+"/api";

export const accountingApi = createApi({
  reducerPath: "accountingApi",
  baseQuery: fetchBaseQuery({
    baseUrl: BASE_URL,
    credentials: "include",
  }),
  tagTypes: ["Invoice", "Payment", "Expense", "Dashboard"],
  endpoints: (builder) => ({
    // ============================================
    // INVOICE ENDPOINTS
    // ============================================
    createInvoice: builder.mutation({
      query: (invoiceData) => ({
        url: "/accounting/invoices",
        method: "POST",
        body: invoiceData,
      }),
      invalidatesTags: ["Invoice", "Dashboard"],
    }),

    getInvoices: builder.query({
      query: (params) => ({
        url: "/accounting/invoices",
        params,
      }),
      providesTags: ["Invoice"],
    }),

    getInvoiceById: builder.query({
      query: (id) => `/accounting/invoices/${id}`,
      providesTags: (result, error, id) => [{ type: "Invoice", id }],
    }),

    updateInvoice: builder.mutation({
      query: ({ id, ...data }) => ({
        url: `/accounting/invoices/${id}`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: "Invoice", id },
        "Invoice",
        "Dashboard",
      ],
    }),

    deleteInvoice: builder.mutation({
      query: (id) => ({
        url: `/accounting/invoices/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Invoice", "Dashboard"],
    }),

    getInvoiceInstallments: builder.query({
      query: (invoiceId) => `/accounting/invoices/${invoiceId}/installments`,
      providesTags: (result, error, invoiceId) => [
        { type: "Invoice", id: invoiceId },
      ],
    }),

    // ============================================
    // PAYMENT ENDPOINTS
    // ============================================
    recordPayment: builder.mutation({
      query: (paymentData) => ({
        url: "/accounting/payments",
        method: "POST",
        body: paymentData,
      }),
      invalidatesTags: ["Payment", "Invoice", "Dashboard"],
    }),

    getPayments: builder.query({
      query: (params) => ({
        url: "/accounting/payments",
        params,
      }),
      providesTags: ["Payment"],
    }),

    getPaymentById: builder.query({
      query: (id) => `/accounting/payments/${id}`,
      providesTags: (result, error, id) => [{ type: "Payment", id }],
    }),

    deletePayment: builder.mutation({
      query: (id) => ({
        url: `/accounting/payments/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Payment", "Invoice", "Dashboard"],
    }),

    // ============================================
    // EXPENSE ENDPOINTS
    // ============================================
    createExpense: builder.mutation({
      query: (expenseData) => ({
        url: "/accounting/expenses",
        method: "POST",
        body: expenseData,
      }),
      invalidatesTags: ["Expense", "Dashboard"],
    }),

    getExpenses: builder.query({
      query: (params) => ({
        url: "/accounting/expenses",
        params,
      }),
      providesTags: ["Expense"],
    }),

    getExpenseById: builder.query({
      query: (id) => `/accounting/expenses/${id}`,
      providesTags: (result, error, id) => [{ type: "Expense", id }],
    }),

    updateExpense: builder.mutation({
      query: ({ id, ...data }) => ({
        url: `/accounting/expenses/${id}`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: "Expense", id },
        "Expense",
        "Dashboard",
      ],
    }),

    deleteExpense: builder.mutation({
      query: (id) => ({
        url: `/accounting/expenses/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Expense", "Dashboard"],
    }),

    // ============================================
    // DASHBOARD ENDPOINT
    // ============================================
    getDashboard: builder.query({
      query: (params) => ({
        url: "/accounting/dashboard",
        params,
      }),
      providesTags: ["Dashboard"],
    }),

    // ============================================
    // UTILITY ENDPOINT
    // ============================================
    updateOverdueStatuses: builder.mutation({
      query: () => ({
        url: "/accounting/update-overdue",
        method: "POST",
      }),
      invalidatesTags: ["Invoice", "Dashboard"],
    }),
  }),
});

export const {
  useCreateInvoiceMutation,
  useGetInvoicesQuery,
  useGetInvoiceByIdQuery,
  useUpdateInvoiceMutation,
  useDeleteInvoiceMutation,
  useGetInvoiceInstallmentsQuery,
  useRecordPaymentMutation,
  useGetPaymentsQuery,
  useGetPaymentByIdQuery,
  useDeletePaymentMutation,
  useCreateExpenseMutation,
  useGetExpensesQuery,
  useGetExpenseByIdQuery,
  useUpdateExpenseMutation,
  useDeleteExpenseMutation,
  useGetDashboardQuery,
  useUpdateOverdueStatusesMutation,
} = accountingApi;

