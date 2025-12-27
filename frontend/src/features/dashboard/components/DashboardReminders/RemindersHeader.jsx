import React from "react";
import { Search } from "lucide-react";
import { useTranslation } from "react-i18next";

const RemindersHeader = ({ search, setSearch, onAddClick }) => {
  const { t, i18n } = useTranslation("remindersHeader"); // <--- use namespace
  const isRTL = i18n.language === "ar";

  return (
    <div
      className={`mt-16 md:mt-20 mb-8 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6 pb-4 border-b border-[#0B1F3B]/20
        ${isRTL ? "text-right" : "text-left"}
      `}
    >
      {/* Title */}
      <div className="flex-1 min-w-0">
        <h1 className="text-2xl sm:text-3xl font-bold text-[#0B1F3B] tracking-tight">
          {t("title")}
        </h1>
        <p className="text-[#0B1F3B] mt-1 text-sm sm:text-base">
          {t("subtitle")}
        </p>
      </div>

      {/* Actions */}
      <div
        className={`flex flex-col sm:flex-row items-center gap-3 w-full lg:w-auto
          ${isRTL ? "lg:justify-start" : "lg:justify-end"}
        `}
      >
        <div className="relative w-full sm:w-[260px] lg:w-[280px]">
          <Search
            size={18}
            className={`absolute top-1/2 -translate-y-1/2 text-[#0B1F3B] opacity-80
              ${isRTL ? "right-3" : "left-3"}
            `}
          />
          <input
            type="text"
            placeholder={t("searchPlaceholder")}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className={`w-full bg-white text-black placeholder-[#494C52] border border-[#0B1F3B] rounded-lg py-2 text-sm
              focus:outline-none focus:ring-2 focus:ring-[#0B1F3B] transition-all duration-300
              ${isRTL ? "pr-10 pl-4 text-right" : "pl-10 pr-4 text-left"}
            `}
          />
        </div>

        <button
          onClick={onAddClick}
          className="px-5 py-2 rounded-lg font-semibold bg-white border border-[#0B1F3B]
                     text-[#494C52] hover:bg-[#0B1F3B] hover:text-white
                     shadow-sm transition-all duration-200 text-sm sm:text-base whitespace-nowrap"
        >
          {t("addButton")}
        </button>
      </div>
    </div>
  );
};

export default RemindersHeader;
