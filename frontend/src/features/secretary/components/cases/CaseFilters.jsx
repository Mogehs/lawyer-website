import React, { useState, useEffect } from "react";
import { useGetLawyersQuery } from "../../api/secretaryApi";

const CaseFilters = ({ onFilterChange, onClearFilters }) => {
  const [filters, setFilters] = useState({
    status: "",
    lawyer: "",
    search: "",
  });

  // Fetch lawyers dynamically from API
  const { data: lawyersData, isLoading: loadingLawyers } = useGetLawyersQuery();

  // Extract lawyer names from API response
  const lawyerOptions = React.useMemo(() => {
    if (!lawyersData?.data) return [];
    return lawyersData.data.map((lawyer) => lawyer.name);
  }, [lawyersData]);

  // Call onFilterChange whenever filters change
  useEffect(() => {
    onFilterChange(filters);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filters]); // Only depend on filters to prevent infinite re-renders

  const handleChange = (key, value) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
    // onFilterChange will be automatically called by the useEffect
  };

  const handleClear = () => {
    const cleared = { status: "", lawyer: "", search: "" };
    setFilters(cleared);
    onClearFilters?.();
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-3 mb-3 flex flex-wrap gap-2 items-end w-full">
      {/* Search */}
      <div className="flex flex-col flex-1 min-w-[150px]">
        <label className="text-slate-600 mb-1 text-[10px] font-semibold uppercase tracking-wide">
          Search
        </label>
        <input
          type="text"
          placeholder="Client name or Case ID"
          value={filters.search}
          onChange={(e) => handleChange("search", e.target.value)}
          className=" border-[#BCB083] border px-2 py-1.5 rounded bg-slate-50 w-full focus:outline-none focus:ring-1 focus:ring-[#A48C65] text-xs"
        />
      </div>

      {/* Status */}
      <div className="flex flex-col min-w-[130px]">
        <label className="text-slate-600  mb-1 text-[10px] font-semibold uppercase tracking-wide">
          Status
        </label>
        <select
          value={filters.status}
          onChange={(e) => handleChange("status", e.target.value)}
          className="border border-slate-200 px-2 py-1.5 rounded bg-slate-50 focus:outline-none focus:ring-1 focus:ring-[#A48C65] text-xs"
        >
          <option value="">All Status</option>
          <option value="Approved">Approved</option>
          <option value="Pending">Pending</option>
          <option value="Rejected">Rejected</option>
          <option value="Closed">Closed</option>
          <option value="Main Stage Ongoing">Main Stage Ongoing</option>
          <option value="Archived">Archived</option>
        </select>
      </div>

      {/* Lawyer */}
      <div className="flex flex-col min-w-[130px]">
        <label className="text-slate-600 mb-1 text-[10px] font-semibold uppercase tracking-wide">
          Lawyer
        </label>
        <select
          value={filters.lawyer}
          onChange={(e) => handleChange("lawyer", e.target.value)}
          className="border border-slate-200  px-2 py-1.5 rounded bg-slate-50 focus:outline-none focus:ring-1 focus:ring-[#A48C65] text-xs"
          disabled={loadingLawyers}
        >
          <option value="">
            {loadingLawyers ? "Loading..." : "All Lawyers"}
          </option>
          {lawyerOptions.map((lawyer) => (
            <option key={lawyer} value={lawyer}>
              {lawyer}
            </option>
          ))}
          {!loadingLawyers && lawyerOptions.length === 0 && (
            <option value="" disabled>
              No lawyers available
            </option>
          )}
        </select>
      </div>

      {/* Clear button */}
      <button
        onClick={handleClear}
        className="bg-red-50 border border-[#BCB083] hover:bg-red-100 text-[#A48C65] px-3 py-1.5 rounded transition-colors text-xs font-medium"
      >
        Clear Filters
      </button>
    </div>
  );
};

export default CaseFilters;
