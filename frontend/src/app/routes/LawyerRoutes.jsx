import LawyerArchieve from "../../features/lawyer/pages/LawyerArchieve";
import LawyerNotifications from "../../features/lawyer/pages/Lawyernotifications";
import LawyerOverview from "../../features/lawyer/pages/LawyerOverview";
import MyCases from "../../features/lawyer/pages/MyCases";
import LawyerSessionsPage from "../../features/lawyer/pages/LawyerSessionsPage";
import LawyerLayout from "../layouts/LawyerLayout";
import RoleProtectedRoute from "../middlewares/RoleProtectedRoute";

export const LawyerRoutes = {
  path: "lawyer",
  element: (
    <RoleProtectedRoute allowedRoles={["lawyer"]}>
      <LawyerLayout />
    </RoleProtectedRoute>
  ),
  children: [
    { index: true, element: <LawyerOverview /> },
    { path: "my-cases", element: <MyCases /> },
    { path: "sessions", element: <LawyerSessionsPage /> },
    { path: "archive", element: <LawyerArchieve /> },
    { path: "notifications", element: <LawyerNotifications /> },
  ],
};
