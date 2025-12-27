import React from "react";
import { Search } from "lucide-react";
import { useTranslation } from "react-i18next";
import i18n from "../../../../i18n/index"; 

const CasesHeader = ({
  searchTerm,
  setSearchTerm,
  filterStage,
  setFilterStage,
  onAddClick,
}) => {
  const { t } = useTranslation("casesheader");
  const isRTL = i18n.language === "ar";

  return (
    <div
      dir={isRTL ? "rtl" : "ltr"} // Apply RTL/LTR based on language
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
      <div className={`text-center md:text-left max-w-full ${isRTL ? "md:text-right" : ""}`}>
        <h1 className="text-2xl sm:text-3xl font-bold text-[#0B1F3B] tracking-tight break-words">
          {t("title")}
        </h1>
        <p className="text-[#0B1F3B] mt-1 text-sm sm:text-base break-words">
          {t("description")}
        </p>
      </div>

      {/* ===== Right Section ===== */}
      <div
        className={`
          flex flex-col sm:flex-row flex-wrap
          items-stretch sm:items-center
          justify-center md:justify-end
          gap-3 sm:gap-2
          w-full md:w-auto
          max-w-full
        `}
      >
        {/* Search */}
        <div className="relative w-full max-w-full sm:w-[220px] md:w-[260px]">
          <Search
            className={`absolute ${isRTL ? "right-3" : "left-3"} top-1/2 -translate-y-1/2 text-[#0B1F3B] opacity-80`}
            size={18}
          />
          <input
            type="text"
            placeholder={t("searchPlaceholder")}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className={`
              w-full max-w-full
              bg-white text-black placeholder-black
              border border-[#0B1F3B]
              rounded-lg
              py-2 ${isRTL ? "pr-10 pl-4" : "pl-10 pr-4"}
              text-sm
              focus:outline-none focus:ring-2 focus:ring-[#0B1F3B]
              transition-all
            `}
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
          <option value="All">{t("filterAll")}</option>
          <option value="Main Case">{t("filterMainCase")}</option>
          <option value="Appeal">{t("filterAppeal")}</option>
          <option value="Cassation">{t("filterCassation")}</option>
        </select>
      </div>
    </div>
  );
};

export default CasesHeader;
