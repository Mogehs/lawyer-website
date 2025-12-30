import React, { useState, useEffect, useMemo } from "react";
import { useGetLawyersQuery } from "../../api/secretaryApi";
import { useTranslation } from "react-i18next";

const CaseFilters = ({ onFilterChange, onClearFilters }) => {
  const { t, i18n } = useTranslation("Casemainfilter"); // Namespace
  const isRTL = i18n.language === "ar";

  const [filters, setFilters] = useState({
    status: "",
    lawyer: "",
    search: "",
  });

  // Fetch lawyers dynamically
  const { data: lawyersData, isLoading: loadingLawyers } = useGetLawyersQuery();

  const lawyerOptions = useMemo(() => {
    if (!lawyersData?.data) return [];
    return lawyersData.data.map((lawyer) => lawyer.name);
  }, [lawyersData]);

  // Call onFilterChange whenever filters change
  useEffect(() => {
    onFilterChange(filters);
  }, [filters]);

  const handleChange = (key, value) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  const handleClear = () => {
    setFilters({ status: "", lawyer: "", search: "" });
    onClearFilters?.();
  };

  return (
    <div
      className={`bg-white rounded-lg shadow-sm border border-slate-200 p-3 mb-3 flex flex-wrap gap-2 items-end w-full ${
        isRTL ? "rtl" : "ltr"
      }`}
    >
      {/* Search */}
      <div className="flex flex-col flex-1 min-w-[150px]">
        <label className="text-slate-600 mb-1 text-[10px] font-semibold uppercase tracking-wide">
          {t("filters.searchLabel")}
        </label>
        <input
          type="text"
          placeholder={t("filters.searchPlaceholder")}
          value={filters.search}
          onChange={(e) => handleChange("search", e.target.value)}
          className="border-[#0B1F3B] border px-2 py-1.5 rounded bg-slate-50 w-full focus:outline-none focus:ring-1 focus:ring-[#0B1F3B] text-xs"
        />
      </div>

      {/* Status */}
      <div className="flex flex-col min-w-[130px]">
        <label className="text-slate-600 mb-1 text-[10px] font-semibold uppercase tracking-wide">
          {t("filters.statusLabel")}
        </label>
        <select
          value={filters.status}
          onChange={(e) => handleChange("status", e.target.value)}
          className="border border-slate-200 px-2 py-1.5 rounded bg-slate-50 focus:outline-none focus:ring-1 focus:ring-[#0B1F3B] text-xs"
        >
          <option value="">{t("filters.statusOptions.all")}</option>
          <option value="Approved">{t("filters.statusOptions.approved")}</option>
          <option value="Pending">{t("filters.statusOptions.pending")}</option>
          <option value="Rejected">{t("filters.statusOptions.rejected")}</option>
          <option value="Closed">{t("filters.statusOptions.closed")}</option>
          <option value="Main Stage Ongoing">
            {t("filters.statusOptions.mainStageOngoing")}
          </option>
          <option value="Archived">{t("filters.statusOptions.archived")}</option>
        </select>
      </div>

      {/* Lawyer */}
      <div className="flex flex-col min-w-[130px]">
        <label className="text-slate-600 mb-1 text-[10px] font-semibold uppercase tracking-wide">
          {t("filters.lawyerLabel")}
        </label>
        <select
          value={filters.lawyer}
          onChange={(e) => handleChange("lawyer", e.target.value)}
          className="border border-slate-200 px-2 py-1.5 rounded bg-slate-50 focus:outline-none focus:ring-1 focus:ring-[#0B1F3B] text-xs"
          disabled={loadingLawyers}
        >
          <option value="">
            {loadingLawyers
              ? t("filters.lawyerOptions.loading")
              : t("filters.lawyerOptions.all")}
          </option>
          {lawyerOptions.map((lawyer) => (
            <option key={lawyer} value={lawyer}>
              {lawyer}
            </option>
          ))}
          {!loadingLawyers && lawyerOptions.length === 0 && (
            <option value="" disabled>
              {t("filters.lawyerOptions.none")}
            </option>
          )}
        </select>
      </div>

      {/* Clear button */}
      <button
        onClick={handleClear}
        className="bg-red-50 border border-[#0B1F3B] hover:bg-red-100 text-[#0B1F3B] px-3 py-1.5 rounded transition-colors text-xs font-medium"
      >
        {t("filters.clearButton")}
      </button>
    </div>
  );
};

export default CaseFilters;
