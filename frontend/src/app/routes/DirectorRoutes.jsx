import DashboardLayout from "../layouts/AdminLayout";
import AdminDashboard from "../../features/dashboard/pages/AdminDashboard";
import AllCases from "../../features/dashboard/pages/AllCases";
import RemindersPage from "../../features/dashboard/pages/RemindersPage";
import ReportsAndAnalytics from "../../features/dashboard/pages/ReportsAndAnalytics";
import Archive from "../../features/dashboard/pages/Archive";
import RoleProtectedRoute from "../middlewares/RoleProtectedRoute";
import UsersPage from "../../features/dashboard/pages/Users.jsx";
import PendingSignatureCases from "../../features/dashboard/pages/PendingSignatureCases";

export const adminRoutes = {
    path: "director",
    element: (
        <RoleProtectedRoute allowedRoles={['director']}>
            <DashboardLayout />
         </RoleProtectedRoute>
    ),
    children: [
        { index: true, element: <AdminDashboard /> },
        { path: "all-cases", element: <AllCases /> },
        { path: "pending-signatures", element: <PendingSignatureCases /> },
        { path: "archive", element: <Archive /> },
        { path: "reports", element: <ReportsAndAnalytics /> },
        { path: "reminders", element: <RemindersPage /> },
        { path: "team", element: <UsersPage /> },
    ],
};
