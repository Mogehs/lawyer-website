import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import i18n from "../../../i18n";

import ReportsHeader from "../components/DashboardReports/ReportsHeader";
import ReportsStats from "../components/DashboardReports/ReportsStats";
import ReportsCaseCharts from "../components/DashboardReports/ReportsCaseCharts";
import ReportsCaseTimelines from "../components/DashboardReports/ReportsCaseTimelines";
import ReportsActivityLogs from "../components/DashboardReports/ReportsActivityLogs";

const ReportsAndAnalytics = () => {
  const { t } = useTranslation();
  const isRTL = i18n.language === "ar";

  const [sidebarOpen, setSidebarOpen] = useState(window.innerWidth >= 1024);

  // ✅ Sync with sidebar state
  useEffect(() => {
    const handleResize = () => {
      setSidebarOpen(window.innerWidth >= 1024);
    };

    const handleSidebarToggle = () => {
      const sidebar = document.querySelector("aside");
      if (sidebar) {
        setSidebarOpen(sidebar.classList.contains("w-64"));
      }
    };

    window.addEventListener("resize", handleResize);
    const interval = setInterval(handleSidebarToggle, 100);

    return () => {
      window.removeEventListener("resize", handleResize);
      clearInterval(interval);
    };
  }, []);

  return (
    <div
      className={`min-h-screen pt-16 md:mt-20
        px-3 sm:px-4 md:px-6 lg:px-10
        py-3 sm:py-4 md:py-5
        transition-all duration-300 ease-in-out
        ${isRTL ? "lg:mr-[190px] text-right" : "lg:ml-[190px] text-left"}
      `}
    >
      <ReportsHeader />
      <ReportsStats />
      <ReportsCaseCharts />
      <ReportsCaseTimelines />
      <ReportsActivityLogs />
    </div>
  );
};

export default ReportsAndAnalytics;
