import React from "react";
import { useTranslation } from "react-i18next";
import OverviewCharts from "../components/LawyerOverview/OverviewCharts";
import RecentActivitiesTable from "../components/LawyerOverview/RecentActivitiesTable";
import StatCards from "../components/LawyerOverview/StatCards";

const LawyerOverview = () => {
  const { t, i18n } = useTranslation("lawyeroverview");
  const isRTL = i18n.dir() === "rtl"; // returns 'rtl' for Arabic, 'ltr' for English

  return (
    <div className={`space-y-6 ${isRTL ? "lg:mr-[220px]" : "lg:ml-[220px]"}`}>
      {/* Title & Subtitle */}
      <div>
        <h1 className="text-2xl text-[#0B1F3B] font-bold ">
          {t("overview.title")}
        </h1>
        <p className="text-sm text-[#0B1F3B] mt-1">
          {t("overview.subtitle")}
        </p>
      </div>

      {/* Components */}
      <StatCards
        casesLabel={t("statCards.cases")}
        memorandumsLabel={t("statCards.memorandums")}
        approvalsLabel={t("statCards.approvals")}
        hearingsLabel={t("statCards.hearings")}
      />
      <OverviewCharts />
      <RecentActivitiesTable
        title={t("recentActivities.title")}
        noDataText={t("recentActivities.noActivities")}
      />
    </div>
  );
};

export default LawyerOverview;
