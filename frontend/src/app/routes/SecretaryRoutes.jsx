import CaseManagement from "../../features/secretary/pages/CaseManagement";
import ClientsPage from "../../features/secretary/pages/ClientsPage";
import SecretaryArchiveCases from "../../features/secretary/pages/SecretaryArchiveCases";
import SecretaryReminders from "../../features/secretary/pages/SecretaryReminders";
import SecretaryInvoices from "../../features/secretary/pages/SecretaryInvoices";
import SecretaryCreateInvoice from "../../features/secretary/pages/SecretaryCreateInvoice";
import SecretaryLayout from "../layouts/SecretaryLayout";
import RoleProtectedRoute from "../middlewares/RoleProtectedRoute";
import SecretaryDashboard from "./../../features/secretary/pages/SecretaryDashboard";

export const SecretaryRoutes = {
  path: "",
  element: (
    <RoleProtectedRoute allowedRoles={["secretary"]}>
    <SecretaryLayout />
    </RoleProtectedRoute>
  ),
  children: [
    { index: true, element: <SecretaryDashboard /> },
    { path: "clients", element: <ClientsPage /> },
    { path: "case-management", element: <CaseManagement /> },
    { path: "invoices", element: <SecretaryInvoices /> },
    { path: "invoices/create", element: <SecretaryCreateInvoice /> },
    { path: "reminders", element: <SecretaryReminders /> },
    { path: "archive-cases", element: <SecretaryArchiveCases /> },
  ],
};
