import { useSelector } from "react-redux";
import { Link, Navigate, useLocation } from "react-router-dom";
import { selectUserProfile, selectIsLoading } from "../../features/auth/authSlice";

const RoleProtectedRoute = ({ allowedRoles, children }) => {
  const user = useSelector(selectUserProfile);
  const isLoading = useSelector(selectIsLoading);
  const location = useLocation();

  // Show loading state while checking authentication
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-[#BCB083] mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  // If no user, redirect to login
  if (!user) {
    return (
      <div className="relative flex items-center justify-center min-h-screen h-screen">
        <img
          src="/home.jpeg"
          alt="home"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="relative z-10 text-center px-6">
          <h1 className="text-white text-3xl md:text-4xl font-bold mb-4">
            You are not logged in
          </h1>

          <p className="text-gray-200 text-lg mb-6">
            Please login to access this page
          </p>

          <Link
            to="/login"
            className="
            inline-block px-8 py-3 
            bg-white text-black font-semibold
            rounded-full shadow-lg
            transition-all duration-300 ease-in-out
            hover:bg-gray-200 hover:shadow-xl
          "
          >
            Login Now
          </Link>
        </div>
      </div>
    );
  }

  // Check if user has the required role
  if (!allowedRoles.includes(user.role)) {
    // Redirect to user's appropriate dashboard
    const roleRoutes = {
      director: "/director",
      secretary: "/",
      lawyer: "/lawyer",
      approvingLawyer: "/approvingLawyer"
    };

    const userRoute = roleRoutes[user.role] || "/login";
    return <Navigate to={userRoute} state={{ from: location }} replace />;
  }

  return children;
};

export default RoleProtectedRoute;
