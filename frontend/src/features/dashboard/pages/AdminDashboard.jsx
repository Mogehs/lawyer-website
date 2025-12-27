import React from "react";
import { useTranslation } from "react-i18next";
import i18n from "../../../i18n";

import RecentOrdersTable from "../components/dashboardoverview/RecentCasesTable";
import RevenueChart from "../components/dashboardoverview/CaseStageChart";
import StatsCard from "../components/dashboardoverview/StatsCard";
import OverviewHeader from "../components/dashboardoverview/OverviewHeader";

const AdminDashboard = () => {
  const { t } = useTranslation();
  const isRTL = i18n.language === "ar";

  return (
    <div
      className={`min-h-screen pt-16
        px-3 sm:px-4 md:px-6 lg:px-10
        py-3 sm:py-4 md:py-5
        transition-all duration-300
        ${isRTL ? "lg:mr-[190px] text-right" : "lg:ml-[190px] text-left"}
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
