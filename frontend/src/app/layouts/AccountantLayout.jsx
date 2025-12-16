import { Outlet } from "react-router-dom";
import Sidebar from "../../features/accounting/components/Sidebar";
import Topbar from "../../features/accounting/components/Topbar";

const AccountantLayout = () => {
  return (
    <div className="flex h-screen overflow-hidden bg-gray-50">
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Topbar */}
        <Topbar />

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto p-4 md:p-6 mt-16">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AccountantLayout;

