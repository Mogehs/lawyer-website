// src/components/lawyer/RecentActivitiesTable.jsx
import React from "react";
import { Link } from "react-router-dom";
import { useGetDashboardStatsQuery } from "../../api/lawyerApi";

const getActivityStatus = (action) => {
   switch (action) {
      case "MEMORANDUM_APPROVED":
         return "completed";
      case "MEMORANDUM_REJECTED":
         return "rejected";
      case "MEMORANDUM_SUBMITTED":
         return "pending";
      default:
         return "new";
   }
};

const getStatusColors = (status) => {
   switch (status) {
      case "completed":
         return "bg-emerald-50 text-emerald-700 border-emerald-200";
      case "rejected":
         return "bg-red-50 text-red-700 border-red-200";
      case "pending":
         return "bg-amber-50 text-amber-700 border-amber-200";
      default:
         return "bg-blue-50 text-blue-700 border-blue-200";
   }
};

const formatDate = (dateString) => {
   const date = new Date(dateString);
   return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
   });
};

const RecentActivitiesTable = () => {
   const { data, isLoading, isError } = useGetDashboardStatsQuery();

   if (isLoading) {
      return (
         <div className="bg-white p-3 rounded-lg shadow-sm border border-slate-200 h-[200px] flex items-center justify-center">
            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-slate-800"></div>
         </div>
      );
   }

   if (isError) {
      return (
         <div className="bg-white p-3 rounded-lg shadow-sm border border-slate-200">
            <div className="bg-red-50 p-2 rounded-md border border-red-200">
               <p className="text-red-600 font-medium text-xs">
                  Failed to load activities
               </p>
               <p className="text-xs text-red-500 mt-0.5">
                  Please try refreshing the page
               </p>
            </div>
         </div>
      );
   }

   const recentActivitiesData =
      data?.data?.recentActivity?.map((activity) => ({
         caseId: activity.caseId?.caseNumber || "N/A",
         activity: activity.description || activity.action,
         stage: activity.action,
         date: formatDate(activity.timestamp || activity.createdAt),
         status: getActivityStatus(activity.action),
      })) || [];

   if (recentActivitiesData.length === 0) {
      return (
         <div className="bg-white p-3 rounded-lg shadow-sm border border-slate-200">
            <h2 className="text-sm font-semibold text-slate-800 mb-2">
               Recent Activities
            </h2>
            <div className="bg-slate-50 p-4 rounded-md text-center">
               <p className="text-slate-600 text-xs">No recent activities</p>
            </div>
         </div>
      );
   }

   return (
      <div className="bg-white p-6 mt-10 hover:-translate-y-2 hover:shadow-xl transition-all duration-500 rounded-lg shadow-sm border border-[#A48D66]">
         {/* Header */}
         <div className="flex items-center justify-between mb-3">
            <h2 className="text-[20px] font-semibold text-[#A48D66]">
               Recent Activities
            </h2>
            <span className="text-[14px] text-[#A48D66] bg-slate-50 px-2 py-0.5 border-2 border-[#A48D66] rounded-full">
               {recentActivitiesData.length} total
            </span>
         </div>

         {/* Desktop Table */}
         <div className="hidden md:block overflow-x-auto">
            <table className="min-w-full bg-white rounded-lg overflow-hidden">
               <thead className="bg-[#A48D66] border-b border-slate-200">
                  <tr>
                     <th className="px-4 py-3 text-left text-[16px] font-semibold uppercase tracking-wide text-white">
                        Case
                     </th>
                     <th className="px-4 py-3 text-left text-[16px] font-semibold uppercase tracking-wide text-white">
                        Activity
                     </th>
                     <th className="px-4 py-3 text-left text-[16px] font-semibold uppercase tracking-wide text-white">
                        Date
                     </th>
                     <th className="px-4 py-3 text-center text-[16px] font-semibold uppercase tracking-wide text-white">
                        Status
                     </th>
                  </tr>
               </thead>
               <tbody className="divide-y divide-slate-100">
                  {recentActivitiesData.map((item, index) => (
                     <tr
                        key={index}
                        className="hover:bg-[#A48D66] group transition-colors duration-150"
                     >
                        <td className="px-4 py-3 font-medium text-slate-800 text-[14px] group-hover:text-white">
                           {item.caseId}
                        </td>
                        <td className="px-4 py-3 text-slate-700 text-[14px] group-hover:text-white">
                           {item.activity}
                        </td>
                        <td className="px-4 py-3 text-slate-600 text-[14px] group-hover:text-white">
                           {item.date}
                        </td>
                        <td className="px- py-3 text-center group-hover:text-white">
                           <span
                              className={`rounded-full px-4 py-1.5 text-[14px] font-medium ${getStatusColors(
                                 item.status
                              )}`}
                           >
                              {item.status.charAt(0).toUpperCase() +
                                 item.status.slice(1)}
                           </span>
                        </td>
                     </tr>
                  ))}
               </tbody>
            </table>
         </div>

         {/* Mobile Cards */}
         <div className="md:hidden space-y-2">
            {recentActivitiesData.map((item, index) => (
               <div
                  key={index}
                  className="bg-slate-50 rounded-md p-2 border border-slate-200"
               >
                  <div className="flex justify-between items-center mb-1">
                     <p className="font-medium text-slate-800 text-xs">
                        {item.caseId}
                     </p>
                     <span className="text-[10px] text-slate-500">
                        {item.date}
                     </span>
                  </div>
                  <p className="text-slate-700 text-xs mb-2">{item.activity}</p>
                  <span
                     className={`px-2 py-0.5 rounded text-[10px] font-medium inline-block ${getStatusColors(
                        item.status
                     )}`}
                  >
                     {item.status.charAt(0).toUpperCase() +
                        item.status.slice(1)}
                  </span>
               </div>
            ))}
         </div>

         {/* Footer */}
         <div className="mt-3 pt-2 border-t border-slate-200">
            <Link
               to="my-cases"
               className="flex justify-end text-slate-700 hover:text-slate-900 font-medium text-xs transition-colors"
            >
               View All →
            </Link>
         </div>
      </div>
   );
};

export default RecentActivitiesTable;
