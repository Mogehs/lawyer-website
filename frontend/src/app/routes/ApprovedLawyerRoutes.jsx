import ApprovedLawyerPage from "../../features/approvedlawyer/pages/ApprovedLawyerPage";
import ApprovedLawyerLayout from "../layouts/ApprovedLawyerLayout";
import RoleProtectedRoute from "../middlewares/RoleProtectedRoute";


export const ApprovedLawyerRoutes = {
    path: 'approvingLawyer',
    element: (
        <RoleProtectedRoute allowedRoles={['approvingLawyer']}>
            <ApprovedLawyerLayout />
    </RoleProtectedRoute>
    ),
    children: [
        { index: true, element: <ApprovedLawyerPage /> },
    ]
}