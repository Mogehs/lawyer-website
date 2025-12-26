import React from "react";
import { FaUserPlus, FaSearch } from "react-icons/fa";

const UsersHeader = ({ search, setSearch, onAdd }) => {
  return (
    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
      
      {/* Search Box */}
      <div className="relative w-full md:w-64  ">
        <span className="absolute inset-y-0 left-3 flex items-center text-[#0B1F3B]">
          <FaSearch />
        </span>
        <input
          type="text"
          placeholder="Search by name or email"
          className="w-full bg-[#ffff] text-black placeholder-[#0B1F3B] border border-[#0B1F3B] rounded-lg py-3 pl-10 pr-4 text-sm 
                       focus:outline-none focus:ring-2 focus:ring-[#0B1F3B] transition-all duration-300"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {/* Add User Button */}
      <button
        onClick={onAdd}
        className="flex items-center gap-2 text-[#494C52] px-4 py-2 rounded-lg
                   bg-white border border-[#0B1F3B]  hover:bg-[#0B1F3B] hover:text-white transition-all duration-200 shadow-sm"
      >
        <FaUserPlus /> Add User
      </button>
    </div>
  );
};

export default UsersHeader;
