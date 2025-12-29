import React from "react";
import { User, FileText, Calendar } from "lucide-react";
import { useTranslation } from "react-i18next";

import StatCards from "../components/Secretaryoverview/StatCards";
import SecretaryCharts from "../components/Secretaryoverview/SecretaryCharts";
import RecentActivity from "../components/Secretaryoverview/RecentActivity";

import {
  useGetDashboardStatsQuery,
  useGetActivityLogsQuery,
} from "../api/secretaryApi";

const SecretaryDashboard = () => {
  const { t, i18n } = useTranslation("secretaryDashboard");
  const isRTL = i18n.dir() === "rtl";

  // Fetch dashboard stats
  const {
    data: statsData,
    isLoading: statsLoading,
    error: statsError,
    refetch: refetchStats,
  } = useGetDashboardStatsQuery(undefined, {
    pollingInterval: 30000,
    skipPollingIfUnfocused: true,
    refetchOnMountOrArgChange: true,
  });

  // Fetch activity logs
  const {
    data: activityData,
    isLoading: activityLoading,
    error: activityError,
  } = useGetActivityLogsQuery(undefined, {
    pollingInterval: 30000,
    skipPollingIfUnfocused: true,
    refetchOnMountOrArgChange: true,
  });

  // Dashboard metrics
  const metrics = [
    { title: t("totalClients"), value: statsData?.stats?.totalClients ?? 0, icon: <User size={28} /> },
    { title: t("activeCases"), value: statsData?.stats?.activeCases ?? 0, icon: <FileText size={28} /> },
    { title: t("pendingDocuments"), value: statsData?.stats?.pendingDocuments ?? 0, icon: <FileText size={28} /> },
    { title: t("upcomingHearings"), value: statsData?.stats?.upcomingHearings ?? 0, icon: <Calendar size={28} /> },
  ];

  // Chart data
  const caseTypeData =
    statsData?.caseTypeData?.length > 0
      ? statsData.caseTypeData.map(item => ({ ...item, name: t(item.name.toLowerCase()) }))
      : [
          { name: t("civil"), value: 0 },
          { name: t("criminal"), value: 0 },
          { name: t("family"), value: 0 },
        ];

  const pendingDocsData =
    statsData?.pendingDocsData?.length > 0
      ? statsData.pendingDocsData.map(item => ({
          ...item,
          status: t(item.status.replace(" ", "").replace(/^\w/, c => c.toLowerCase())),
        }))
      : [
          { status: t("notStarted"), count: 0 },
          { status: t("inProgress"), count: 0 },
          { status: t("completed"), count: 0 },
        ];

  const recentActivities = activityData?.activities || [];

  return (
    <div className={`space-y-6 ${isRTL ? "lg:mr-[240px]" : "lg:ml-[240px]"}`}>
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-[#0B1F3B]">{t("overviewTitle")}</h1>
        <p className="text-sm text-[#0B1F3B] mt-1">{t("overviewSubtitle")}</p>
      </div>

      {/* Loading */}
      {(statsLoading || activityLoading) && (
        <div className="text-center py-8">
          <div className="inline-block animate-spin rounded-full h-5 w-5 border-b-2 border-slate-800" />
        </div>
      )}

      {/* Error */}
      {(statsError || activityError) && !statsLoading && (
        <div className="bg-red-50 border border-red-200 rounded-md p-3 mb-4">
          <h3 className="text-red-800 font-semibold text-xs mb-1">{t("errorTitle")}</h3>
          <p className="text-red-600 text-xs">
            {statsError?.data?.message || activityError?.data?.message || t("errorMessage")}
          </p>
          <button
            onClick={refetchStats}
            className="mt-2 px-3 py-1 bg-red-600 text-white rounded text-xs hover:bg-red-700 transition"
          >
            {t("retry")}
          </button>
        </div>
      )}

      {/* Content */}
      {!statsLoading && !statsError && (
        <div className="space-y-4 pb-4">
          <StatCards metrics={metrics} />
          <SecretaryCharts caseTypeData={caseTypeData} pendingDocsData={pendingDocsData} />
          {!activityLoading && !activityError && <RecentActivity recentActivities={recentActivities} />}
          {activityLoading && (
            <div className="text-center py-4">
              <div className="inline-block animate-spin rounded-full h-5 w-5 border-b-2 border-slate-800" />
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default SecretaryDashboard;
