import React from "react";
import OverviewCharts from "../components/LawyerOverview/OverviewCharts";
import RecentActivitiesTable from "../components/LawyerOverview/RecentActivitiesTable";
import StatCards from "../components/LawyerOverview/StatCards";

const LawyerOverview = () => {
   return (
      <div className="space-y-6">
         {/* Title & Subtitle */}
         <div>
            <h1 className="text-2xl font-bold text-gray-800">
               Overview
            </h1>
            <p className="text-sm text-gray-600 mt-1">
               Track your cases, memorandums, approvals, and upcoming hearings.
            </p>
         </div>

         {/* Components */}
         <StatCards />
         <OverviewCharts />
         <RecentActivitiesTable />
      </div>
   );
};

export default LawyerOverview;
