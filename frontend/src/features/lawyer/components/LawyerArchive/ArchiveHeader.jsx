import React from "react";
import { useTranslation } from "react-i18next"; // Import the translation hook

const ArchiveHeader = ({ caseCount }) => {
  const { t } = useTranslation("archiveHeader"); // Initialize the translation hook

  return (
    <div className="flex flex-col xs:flex-row xs:items-center xs:justify-between mb-3 gap-2 md:mt-8">
      <div>
        <h2 className="text-2xl lg:text-3xl font-bold text-[#0B1F3B]">
          {t("archiveHeader.title")} {/* Translated title */}
        </h2>
        <p className="text-[11px] md:text-[18px] text-slate-600 mt-0.5">
          {t("archiveHeader.caseCount", { count: caseCount })} {/* Translated case count */}
        </p>
      </div>
    </div>
  );
};

export default ArchiveHeader;
