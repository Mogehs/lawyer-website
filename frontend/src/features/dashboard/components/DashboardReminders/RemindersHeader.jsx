// src/components/DashboardReminders/RemindersHeader.jsx
import React from "react";
import { Search } from "lucide-react";

const RemindersHeader = ({ search, setSearch, onAddClick }) => {
  return (
    <div className="mt-16 md:mt-20 mb-8 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6 pb-4 border-b border-[#fe9a00]/20">
      {/* ===== Left Section ===== */}
      <div className="flex-1 min-w-0 text-center sm:text-left">
        <h1 className="text-2xl sm:text-3xl font-bold text-[#0B1F3B] tracking-tight">
          Reminders
        </h1>
        <p className="text-[#0B1F3B] mt-1 text-sm sm:text-base">
          Manage, review, and track all case-related reminders efficiently.
        </p>
      </div>

      {/* ===== Right Section ===== */}
      <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-end gap-3 w-full lg:w-auto">
        {/* Search Bar */}
        <div className="relative w-full sm:w-[260px] lg:w-[280px]">
          <Search
            className="absolute left-3 top-1/2 -translate-y-1/2 text-[#0B1F3B] opacity-80"
            size={18}
          />
          <input
            type="text"
            placeholder="Search reminders..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-[#ffff] text-black placeholder-[#494C52] border border-[#0B1F3B] rounded-lg py-2 pl-10 pr-4 text-sm 
                       focus:outline-none focus:ring-2 focus:ring-[#0B1F3B] transition-all duration-300"
          />
        </div>

        {/* Add Button */}
        <button
          onClick={onAddClick}
          className=" text-[#494C52] px-5 py-2 rounded-lg font-semibold  bg-white border border-[#0B1F3B]  hover:bg-[#0B1F3B] hover:text-white  shadow-sm transition-all duration-200 text-sm sm:text-base whitespace-nowrap"
        >
          + Add Reminder
        </button>
      </div>
    </div>
  );
};

export default RemindersHeader;
