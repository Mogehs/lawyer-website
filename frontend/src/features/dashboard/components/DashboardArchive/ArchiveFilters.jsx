import { Search } from "lucide-react";

const ArchiveFilters = ({ filters, onFilterChange, onClearFilters, showFilters }) => {
  return (
    <div className={`rounded-2xl shadow-lg p-4 mb-6 ${showFilters ? 'block' : 'hidden lg:block'}`}>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-6  gap-6">
        
        {/* Search Client */}
        <div className="relative">
          <Search className="absolute left-3 top-3 text-[#BCB083]" size={18} />
          <input
            type="text"
            placeholder="Search Client"
            value={filters.searchClient}
            onChange={(e) => onFilterChange("searchClient", e.target.value)}
            className="w-full bg-[#ffff]  text-[#494C52] placeholder-[#494C52] border border-[#BCB083] rounded-lg py-2 pl-10 pr-4 text-sm 
                       focus:outline-none focus:ring-2 focus:ring-[#BCB083] transition-all duration-300"
          />
        </div>
        {/* Stage Select */}
        <select
          value={filters.stage}
          onChange={(e) => onFilterChange("stage", e.target.value)}
          className=" p-2 bg-[#ffff]   text-[#494C52] rounded-lg border border-[#BCB083]
            focus:outline-none  focus:ring-2 focus:ring-[#BCB083]"
        >
          <option value="">All Stages</option>
          <option value="Main">Main</option>
          <option value="Appeal">Appeal</option>
          <option value="Cassation">Cassation</option>
        </select>

        {/* Status Select */}
        <select
          value={filters.status}
          onChange={(e) => onFilterChange("status", e.target.value)}
          className="p-2 bg-[#ffff]   text-[#494C52] rounded-lg border border-[#BCB083]
            focus:outline-none  focus:ring-2 focus:ring-[#BCB083]"
        >
          <option value="">All Status</option>
          <option value="Approved">Approved</option>
          <option value="Rejected">Rejected</option>
        </select>

        {/* Date */}
        <input
          type="date"
          value={filters.date}
          onChange={(e) => onFilterChange("date", e.target.value)}
          className="p-2 bg-[#ffff]  text-[#494C52] rounded-lg border border-[#BCB083] focus:outline-none  focus:ring-2 focus:ring-[#BCB083]"
        />

        {/* Clear Button */}
        <button
          onClick={onClearFilters}
          className="flex items-center gap-2 px-4 py-2 bg-white border border-[#A48C65] text-gray-800 hover:bg-[#A48C65] hover:text-white transition-all duration-200 rounded-md"
        >
          Clear Filters
        </button>
      </div>
    </div>
  );
};

export default ArchiveFilters;
