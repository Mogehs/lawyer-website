import AccountantLayout from "../layouts/AccountantLayout";
import AccountingDashboard from "../../features/accounting/pages/AccountingDashboard";
import InvoicesList from "../../features/accounting/pages/InvoicesList";
import PaymentsList from "../../features/accounting/pages/PaymentsList";
import ExpensesList from "../../features/accounting/pages/ExpensesList";
import CreateInvoice from "../../features/accounting/pages/CreateInvoice";
import RecordPayment from "../../features/accounting/pages/RecordPayment";
import CreateExpense from "../../features/accounting/pages/CreateExpense";
import RoleProtectedRoute from "../middlewares/RoleProtectedRoute";

export const AccountantRoutes = {
  path: "accountant",
  element: (
    <RoleProtectedRoute allowedRoles={["accountant", "director"]}>
      <AccountantLayout />
    </RoleProtectedRoute>
  ),
  children: [
    { index: true, element: <AccountingDashboard /> },
    { path: "dashboard", element: <AccountingDashboard /> },
    { path: "invoices", element: <InvoicesList /> },
    { path: "invoices/create", element: <CreateInvoice /> },
    { path: "payments", element: <PaymentsList /> },
    { path: "payments/record", element: <RecordPayment /> },
    { path: "expenses", element: <ExpensesList /> },
    { path: "expenses/create", element: <CreateExpense /> },
  ],
};

