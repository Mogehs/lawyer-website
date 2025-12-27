// src/components/dashboardCaseManagement/OverviewHeader.jsx
import React from "react";
import { useTranslation } from "react-i18next";
import i18n from "../../../../i18n/index"; 

const OverviewHeader = () => {
  const { t } = useTranslation("overviewHeader");

  // Optional: set document direction based on language
  React.useEffect(() => {
    document.documentElement.dir = i18n.language === "ar" ? "rtl" : "ltr";
  }, [i18n.language]);

  return (
    <div
      className="mt-20 mb-6 sm:mb-8 
                 flex flex-col md:flex-row 
                 md:items-center md:justify-between 
                 gap-5 sm:gap-6 
                 pb-4  
                 px-2 sm:px-0"
    >
      {/* ===== Left Section ===== */}
      <div className={`text-center md:text-left`}>
        <h1 className="text-2xl sm:text-3xl font-bold text-[#0B1F3B] tracking-tight">
          {t("overviewTitle")}
        </h1>
        <p className="text-[#0B1F3B] mt-1 text-sm sm:text-base">
          {t("overviewDescription")}
        </p>
      </div>
    </div>
  );
};

export default OverviewHeader;
