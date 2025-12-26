import React from "react";
import { Search } from "lucide-react";

const CasesHeader = ({
  searchTerm,
  setSearchTerm,
  filterStage,
  setFilterStage,
  onAddClick,
}) => {
  return (
    <div
      className="
        mt-16 lg:mt-20
        w-full max-w-full
        mb-6 sm:mb-8
        flex flex-col md:flex-row
        md:items-center md:justify-between
        gap-5 sm:gap-6
        pb-4
        border-b border-[#A48C65]/20
        px-2 sm:px-0
        overflow-x-hidden
      "
    >
      {/* ===== Left Section ===== */}
      <div className="text-center md:text-left max-w-full ">
        <h1 className="text-2xl sm:text-3xl font-bold text-[#0B1F3B] tracking-tight break-words">
          All Cases
        </h1>
        <p className="text-[#0B1F3B] mt-1 text-sm sm:text-base break-words">
          View, search, and manage all client cases.
        </p>
      </div>

      {/* ===== Right Section ===== */}
      <div
        className="
          flex flex-col sm:flex-row flex-wrap
          items-stretch sm:items-center
          justify-center md:justify-end
          gap-3 sm:gap-2
          w-full md:w-auto
          max-w-full
        "
      >
        {/* Search */}
        <div className="relative w-full max-w-full sm:w-[220px] md:w-[260px]">
          <Search
            className="absolute left-3 top-1/2 -translate-y-1/2 text-[#0B1F3B] opacity-80"
            size={18}
          />
          <input
            type="text"
            placeholder="Search cases..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="
              w-full max-w-full
              bg-white text-black placeholder-black
              border border-[#0B1F3B]
              rounded-lg
              py-2 pl-10 pr-4
              text-sm
              focus:outline-none focus:ring-2 focus:ring-[#0B1F3B]
              transition-all
            "
          />
        </div>

        {/* Filter */}
        <select
          className="
            w-full max-w-full sm:w-auto
            bg-white text-gray-800
            border border-[#0B1F3B]/40
            rounded-lg
            px-3 py-2
            focus:outline-none focus:ring-2 focus:ring-[#0B1F3B]
            transition-all
          "
          value={filterStage}
          onChange={(e) => setFilterStage(e.target.value)}
        >
          <option value="All">All Stages</option>
          <option value="Main Case">Main Case</option>
          <option value="Appeal">Appeal</option>
          <option value="Cassation">Cassation</option>
        </select>
      </div>
    </div>
  );
};

export default CasesHeader;
