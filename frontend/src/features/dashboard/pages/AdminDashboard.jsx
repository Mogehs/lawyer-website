import RecentOrdersTable from "../components/dashboardoverview/RecentCasesTable";
import RevenueChart from "../components/dashboardoverview/CaseStageChart";
import StatsCard from "../components/dashboardoverview/StatsCard";
import OverviewHeader from "../components/dashboardoverview/OverviewHeader";

const AdminDashboard = () => {
  return (
    <div
      className="
        min-h-screen
        pt-16
        px-3 sm:px-4 md:px-6
        py-3 sm:py-4 md:py-5
        transition-all duration-300
        lg:ml-[190px]
      "
    >
      <OverviewHeader />
      <StatsCard />
      <RevenueChart />
      <RecentOrdersTable />
    </div>
  );
};

export default AdminDashboard;
