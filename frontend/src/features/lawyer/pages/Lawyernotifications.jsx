// src/pages/LawyerNotificationsPage.jsx
import React, { useState, useMemo, useEffect } from "react";
import { Search, Bell, AlertCircle } from "lucide-react";
import {
   useGetNotificationsQuery,
   useMarkNotificationAsReadMutation,
} from "../api/lawyerApi";

export default function LawyerNotifications() {
   const [searchTerm, setSearchTerm] = useState("");
   const [typeFilter, setTypeFilter] = useState("");
   const [stageFilter, setStageFilter] = useState("");
   const [sidebarOpen, setSidebarOpen] = useState(window.innerWidth >= 1024);

   // Fetch notifications with filters
   const { data, isLoading, isError, refetch } = useGetNotificationsQuery({
      type: typeFilter || undefined,
      stage: stageFilter || undefined,
   });

   const [markAsRead] = useMarkNotificationAsReadMutation();

     // ✅ Sync with sidebar state
   useEffect(() => {
      const handleResize = () => {
         const desktop = window.innerWidth >= 1024;
         setSidebarOpen(desktop);
      };

      const handleSidebarToggle = () => {
         // Listen for sidebar state changes from the sidebar component
         const sidebar = document.querySelector('aside');
         if (sidebar) {
            const isOpen = sidebar.classList.contains('w-64');
            setSidebarOpen(isOpen);
         }
      };

      window.addEventListener('resize', handleResize);
      const interval = setInterval(handleSidebarToggle, 100);

      return () => {
         window.removeEventListener('resize', handleResize);
         clearInterval(interval);
      };
   }, []);

   // Filter notifications by search term
   const filteredNotifications = useMemo(() => {
      const notifications = data?.data || [];
      return notifications.filter((n) => {
         const matchesSearch =
            n.caseNumber?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            n.clientName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            n.caseType?.toLowerCase().includes(searchTerm.toLowerCase());
         return matchesSearch;
      });
   }, [data, searchTerm]);

   const handleMarkAsRead = async (id) => {
      try {
         await markAsRead(id).unwrap();
         // Refetch to update the list
         refetch();
      } catch (error) {
         console.error("Failed to mark notification as read:", error);
      }
   };

   if (isLoading) {
      return (
         <div
            className={`min-h-screen transition-all duration-300 ease-in-out pt-16 px-2 py-3 sm:px-3 sm:py-4 ${sidebarOpen ? "md:ml-52 ml-0" : "md:ml-14 ml-0"
               }`}
         >
            <div className="flex items-center justify-center h-64">
               <div className="flex flex-col items-center gap-2">
                  <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-slate-800"></div>
                  <p className="text-xs text-slate-600">
                     Loading notifications...
                  </p>
               </div>
            </div>
         </div>
      );
   }

   if (isError) {
      return (
         <div
            className={`min-h-screen transition-all duration-300 ease-in-out pt-16 px-2 py-3 sm:px-3 sm:py-4 mt-8 ${sidebarOpen ? "md:ml-52 ml-0" : "md:ml-14 ml-0"
               }`}
         >
            <div className="bg-red-50 p-3 rounded border border-red-200">
               <div className="flex items-center gap-2 text-red-600">
                  <AlertCircle size={14} />
                  <div>
                     <p className="text-xs font-medium">
                        Failed to load notifications
                     </p>
                     <p className="text-[10px] text-red-500">
                        Please try refreshing
                     </p>
                  </div>
               </div>
            </div>
         </div>
      );
   }

   const unreadCount = data?.unreadCount || 0;

   return (
      <div
         className={`min-h-screen
                 px-3 sm:px-4 mt-12 md:px-6 lg:px-2
                 py-3 sm:py-4 md:py-5 
                 transition-all duration-300 ease-in-out
              ${sidebarOpen ? 'lg:ml-64 md:ml-64' : 'lg:ml-20 md:ml-15'}`}
      >
         {/* Header - Compact */}
         <div className="flex flex-col xs:flex-row xs:items-center xs:justify-between mb-3 gap-2">
            <div>
               <h2 className="text-2xl md:text-3xl font-bold text-[#A48D66]">
                  Notifications
               </h2>
               <p className="text-[10px] sm:text-[18px] text-slate-600 mt-2">
                  {filteredNotifications.length} notification
                  {filteredNotifications.length !== 1 ? "s" : ""}
               </p>
            </div>
            {unreadCount > 0 && (
               <div className="flex items-center gap-1.5 bg-blue-50 px-2 py-1 rounded border border-blue-200">
                  <Bell size={14} className="text-[#A48D66]" />
                  <span className="text-[10px] text-[#A48D66] font-medium">
                     {unreadCount} unread
                  </span>
               </div>
            )}
         </div>

         {/* Search & Filters */}
         <div className="flex flex-col md:flex-row gap-2 mb-3">
            <div className="relative shadow-md focus:shadow-lg rounded-md w-full">
               <Search
                  size={20}
                  className="absolute top-3 left-2 text-slate-400"
               />
               <input
                  type="text"
                  placeholder="Search notifications..."
                  className="outline-none w-full rounded-md h-full pl-8   text-[18px] py-2  border-2 border-slate-200 focus:border-[#A48D66]"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
               />
            </div>

            <select
               className="border border-slate-300 rounded px-2 py-1.5 text-[16px] w-full md:w-auto focus:ring-1 focus:ring-[#A48D66]"
               value={typeFilter}
               onChange={(e) => setTypeFilter(e.target.value)}
            >
               <option value="">All Types</option>
               <option value="New Assignment">New Assignment</option>
               <option value="Upload Reminder">Upload Reminder</option>
               <option value="Hearing Reminder">Hearing Reminder</option>
               <option value="Ragab Feedback">Ragab Feedback</option>
            </select>

            <select
               className="border border-slate-300 rounded px-2 py-1.5 text-[16px] w-full md:w-auto focus:ring-1 focus:ring-[#A48D66]"
               value={stageFilter}
               onChange={(e) => setStageFilter(e.target.value)}
            >
               <option value="">All Stages</option>
               <option value="Main">Main</option>
               <option value="Appeal">Appeal</option>
               <option value="Cassation">Cassation</option>
            </select>
         </div>

         {/* Notifications List */}
         {filteredNotifications.length > 0 ? (
            <div className="space-y-2">
               {filteredNotifications.map((n) => (
                  <div
                     key={n.id}
                     className={`p-3 rounded border flex flex-col md:flex-row justify-between items-start md:items-center gap-2 hover:bg-slate-50 transition ${n.status === "unread"
                           ? "bg-blue-50 border-blue-200"
                           : "bg-white border-slate-200"
                        }`}
                  >
                     <div className="flex flex-col md:flex-row md:items-center gap-2 flex-1">
                        <span className="text-xs font-semibold text-[#A48D66]">
                           {n.caseNumber}
                        </span>
                        <span className="text-xs text-[#b39a70]">
                           {n.clientName}
                        </span>
                        <span className="text-[10px] text-[#c5ab7d]">
                           {n.caseType}
                        </span>
                        <span className="text-[10px] font-medium px-1.5 py-0.5 bg-slate-100 rounded">
                           {n.stage}
                        </span>
                        <span className="text-[9px] font-medium px-1.5 py-0.5 bg-slate-200 rounded">
                           {n.type}
                        </span>
                     </div>

                     <div className="flex flex-col md:flex-row md:items-center gap-2 w-full md:w-auto">
                        <p className="text-xs text-slate-800">{n.message}</p>
                        <span className="text-[9px] text-slate-500">
                           {new Date(n.timestamp).toLocaleDateString()}
                        </span>
                        {n.status === "unread" && (
                           <button
                              onClick={() => handleMarkAsRead(n.id)}
                              className="bg-slate-700 hover:bg-slate-800 text-white px-2 py-1 rounded text-[10px] whitespace-nowrap"
                           >
                              Mark Read
                           </button>
                        )}
                     </div>
                  </div>
               ))}
            </div>
         ) : (
            <div className="text-center py-8 bg-white rounded border border-slate-200">
               <Bell size={40} className="text-[#A48D66] mx-auto mb-2" />
               <h3 className="text-[20px] font-medium text-[#A48D66]">
                  No notifications
               </h3>
               <p className="text-[14px] text-slate-500 mt-1">
                  You're all caught up!
               </p>
            </div>
         )}
      </div>
   );
}
