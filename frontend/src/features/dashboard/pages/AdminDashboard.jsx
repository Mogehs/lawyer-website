import { useEffect } from "react";
import i18n from "../../../i18n/index";
import RecentOrdersTable from "../components/dashboardoverview/RecentCasesTable";
import RevenueChart from "../components/dashboardoverview/CaseStageChart";
import StatsCard from "../components/dashboardoverview/StatsCard";
import OverviewHeader from "../components/dashboardoverview/OverviewHeader";

const AdminDashboard = () => {
  // Set the page direction based on selected language
  useEffect(() => {
    document.documentElement.dir = i18n.language === "ar" ? "rtl" : "ltr";
  }, [i18n.language]);

  return (
    <div
      dir={i18n.language === "ar" ? "rtl" : "ltr"}
      className={`
        min-h-screen
        pt-16
        px-3 sm:px-4 md:px-6
        py-3 sm:py-4 md:py-5
        transition-all duration-300
        ${i18n.language === "ar" ? "lg:mr-[190px]" : "lg:ml-[190px]"}
      `}
    >
      <OverviewHeader />
      <StatsCard />
      <RevenueChart />
      <RecentOrdersTable />
    </div>
  );
};

export default AdminDashboard;
