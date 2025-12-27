import React from "react";
import { useTranslation } from "react-i18next";
import i18n from "../../../../i18n/index";

const ReportsHeader = () => {
  const { t } = useTranslation("reportsHeader");
  const isRTL = i18n.language === "ar";

  return (
    <div className={`mb-8 ${isRTL ? "text-right" : "text-left"}`}>
      <h1 className="text-3xl font-bold text-[#0B1F3B]">{t("title")}</h1>
      <p className="text-[#0B1F3B]">{t("subtitle")}</p>
    </div>
  );
};

export default ReportsHeader;
