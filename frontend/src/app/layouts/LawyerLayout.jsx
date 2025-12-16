import { Outlet } from "react-router-dom";
import SideBar from "../../features/lawyer/components/SideBar";
import TopBar from "../../features/lawyer/components/TopBar";

const LawyerLayout = () => {
  return (
    <div className="flex h-screen overflow-hidden bg-gray-50">
      {/* Sidebar */}
      <SideBar />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Topbar */}
        <TopBar />

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto p-4 md:p-6 mt-16">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default LawyerLayout;
