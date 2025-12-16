import { createBrowserRouter, RouterProvider } from "react-router-dom";
import AuthLayout from "../layouts/AuthLayout";
import MainLayout from "../layouts/MainLayout";
import { adminRoutes } from "./DirectorRoutes";
import { SecretaryRoutes } from "./SecretaryRoutes";
import { LawyerRoutes } from "./LawyerRoutes";
import { authRoutes } from "./AuthRouter";
import { ApprovedLawyerRoutes } from "./ApprovedLawyerRoutes";
import { AccountantRoutes } from "./AccountantRoutes";


const router = createBrowserRouter([
    {
        element: <MainLayout />,
    },
    {
        element: <AuthLayout />
    },
    adminRoutes,
    SecretaryRoutes,
    LawyerRoutes,
    authRoutes,
    ApprovedLawyerRoutes,
    AccountantRoutes,
])

export default function AppRouter() {
    return <RouterProvider router={router} />
}