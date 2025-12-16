import express from "express";
import { asyncHandler } from "../../middleware/asyncHandler.js";
import { loginRequired } from "../../utils/loginRequired.js";
import { allowedRoles } from "../../utils/allowedRoles.js";
import {
  createInvoice,
  getInvoices,
  getInvoiceById,
  updateInvoice,
  deleteInvoice,
  recordPayment,
  getPayments,
  getPaymentById,
  deletePayment,
  createExpense,
  getExpenses,
  getExpenseById,
  updateExpense,
  deleteExpense,
  getDashboard,
  getInvoiceInstallments,
  updateOverdueStatuses,
} from "./accounting.controller.js";

const router = express.Router();

// Apply authentication to all routes
router.use(loginRequired);

// ============================================
// INVOICE ROUTES
// ============================================

// Secretary and Director can create invoices
router.post(
  "/invoices",
  allowedRoles(["secretary", "director"]),
  asyncHandler(createInvoice)
);

// Secretary, Accountant, and Director can view invoices
router.get(
  "/invoices",
  allowedRoles(["secretary", "accountant", "director"]),
  asyncHandler(getInvoices)
);

router.get(
  "/invoices/:id",
  allowedRoles(["secretary", "accountant", "director"]),
  asyncHandler(getInvoiceById)
);

router.get(
  "/invoices/:id/installments",
  allowedRoles(["secretary", "accountant", "director"]),
  asyncHandler(getInvoiceInstallments)
);

// Secretary and Director can update invoices
router.put(
  "/invoices/:id",
  allowedRoles(["secretary", "director"]),
  asyncHandler(updateInvoice)
);

// Only Director can delete invoices
router.delete(
  "/invoices/:id",
  allowedRoles(["director"]),
  asyncHandler(deleteInvoice)
);

// ============================================
// PAYMENT ROUTES
// ============================================

// Accountant and Director can record payments
router.post(
  "/payments",
  allowedRoles(["accountant", "director"]),
  asyncHandler(recordPayment)
);

// Accountant and Director can view payments
router.get(
  "/payments",
  allowedRoles(["accountant", "director"]),
  asyncHandler(getPayments)
);

router.get(
  "/payments/:id",
  allowedRoles(["accountant", "director"]),
  asyncHandler(getPaymentById)
);

// Only Director can delete payments
router.delete(
  "/payments/:id",
  allowedRoles(["director"]),
  asyncHandler(deletePayment)
);

// ============================================
// EXPENSE ROUTES
// ============================================

// Accountant and Director can create expenses
router.post(
  "/expenses",
  allowedRoles(["accountant", "director"]),
  asyncHandler(createExpense)
);

// Accountant and Director can view expenses
router.get(
  "/expenses",
  allowedRoles(["accountant", "director"]),
  asyncHandler(getExpenses)
);

router.get(
  "/expenses/:id",
  allowedRoles(["accountant", "director"]),
  asyncHandler(getExpenseById)
);

// Accountant and Director can update expenses
router.put(
  "/expenses/:id",
  allowedRoles(["accountant", "director"]),
  asyncHandler(updateExpense)
);

// Only Director can delete expenses
router.delete(
  "/expenses/:id",
  allowedRoles(["director"]),
  asyncHandler(deleteExpense)
);

// ============================================
// DASHBOARD & REPORTS ROUTES
// ============================================

// Accountant and Director can view dashboard
router.get(
  "/dashboard",
  allowedRoles(["accountant", "director"]),
  asyncHandler(getDashboard)
);

// System route for updating overdue statuses
router.post(
  "/update-overdue",
  allowedRoles(["director"]),
  asyncHandler(updateOverdueStatuses)
);

export default router;

