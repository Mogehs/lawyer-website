// src/components/ArchiveComponents/ArchiveSearch.jsx
import React from "react";
import { Search, Filter } from "lucide-react";

const ArchiveSearch = ({ search, onSearchChange }) => {
  return (
    <div className="mb-3">
      <div className="relative w-full xs:w-56">
        <Search size={20} className="absolute left-2 top-3.5 text-slate-400" />
        <input
          type="text"
          placeholder="Search archives..."
          className="w-full pl-8 pr-2 py-2.5 border shadow-md focus:shadow-lg border-slate-300 rounded focus:ring-1 focus:ring-[#0B1F3B] focus:outline-none text-[18px]"
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
        />
      </div>
    </div>
  );
};

export default ArchiveSearch;
