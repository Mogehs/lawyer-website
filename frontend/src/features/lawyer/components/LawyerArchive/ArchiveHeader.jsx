// src/components/ArchiveComponents/ArchiveHeader.jsx
import React from "react";
import { Archive } from "lucide-react";

const ArchiveHeader = ({ caseCount }) => {
  return (
    <div className="flex flex-col xs:flex-row xs:items-center xs:justify-between mb-3 gap-2 md:mt-8">
      <div>
        <h2 className="text-2xl lg:text-3xl font-bold text-[#0B1F3B]">
          Case Archives
        </h2>
        <p className="text-[11px] md:text-[18px] text-slate-600 mt-0.5">
          {caseCount} archived case{caseCount !== 1 ? "s" : ""}
        </p>
      </div>
    </div>
  );
};

export default ArchiveHeader;
