// src/components/dashboardCaseManagement/CasesHeader.jsx
import React from "react";

const OverviewHeader = () => {
  return (
    <div
      className="mt-20 mb-6 sm:mb-8 
                 flex flex-col md:flex-row 
                 md:items-center md:justify-between 
                 gap-5 sm:gap-6 
                 pb-4 border-b border-[#0B1F3B]/20 
                 px-2 sm:px-0"
    >
      {/* ===== Left Section ===== */}
      <div className="text-center md:text-left">
        <h1 className="text-2xl sm:text-3xl font-bold text-[#0B1F3B] tracking-tight">
        Overview
        </h1>
        <p className="text-[#0B1F3B] mt-1 text-sm sm:text-base">
        A complete view of your firm’s cases and activities.
        </p>
      </div>

    
    </div>
  );
};

export default OverviewHeader;
