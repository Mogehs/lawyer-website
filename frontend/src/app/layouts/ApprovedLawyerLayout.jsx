import { Outlet } from "react-router-dom";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import Sidebar from "../../features/approvedlawyer/components/Sidebar";
import Topbar from "../../features/approvedlawyer/components/Topbar";
import { useMyProfileQuery } from "../../features/auth/api/authApi";
import { setProfile } from "../../features/auth/authSlice";

const ApprovedLawyerLayout = () => {
  const dispatch = useDispatch();
  const { data: profileData, isLoading } = useMyProfileQuery();

  useEffect(() => {
    if (profileData?.user) {
      dispatch(setProfile(profileData.user));
    }
  }, [profileData, dispatch]);

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center bg-gray-100">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen overflow-hidden bg-gray-50">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Topbar />
        <main className="flex-1 overflow-y-auto p-4 md:p-6 mt-16">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default ApprovedLawyerLayout;
