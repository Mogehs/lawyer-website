import React, { useEffect, useState } from "react";
import ReportsHeader from "../components/DashboardReports/ReportsHeader";
import ReportsStats from "../components/DashboardReports/ReportsStats";
import ReportsCaseCharts from "../components/DashboardReports/ReportsCaseCharts";
import ReportsCaseTimelines from "../components/DashboardReports/ReportsCaseTimelines";
// import ReportsActivityLogs from "../components/DashboardReports/ReportsActivityLogs";
import ReportsActivityLogs from "../components/DashboardReports/ReportsActivityLogs";

const ReportsAndAnalytics = () => {

    const [sidebarOpen, setSidebarOpen] = useState(window.innerWidth >= 1024);
  
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
      
      // Check sidebar state periodically (you can use a better state management approach)
      const interval = setInterval(handleSidebarToggle, 100);
      
      return () => {
        window.removeEventListener('resize', handleResize);
        clearInterval(interval);
      };
    }, []);
  return (
   <div
      className={`min-h-screen
                 px-3 sm:px-4 md:px-6 lg:px-2
                 py-3 sm:py-4 md:py-5 
                 transition-all duration-300 ease-in-out md:mt-20
                  ${sidebarOpen ? 'lg:ml-64 md:ml-64' : 'lg:ml-20 md:ml-15'}`}
    >
      <ReportsHeader/>
      <ReportsStats />
      <ReportsCaseCharts />
      <ReportsCaseTimelines />
      <ReportsActivityLogs />
    </div>
  );
};

export default ReportsAndAnalytics;
