import React from "react";
import { Trash } from "lucide-react";
import { useTranslation } from "react-i18next";

const ArchiveDeleteModal = ({
  deleteCaseModal,
  setDeleteCaseModal,
  handleDeleteCase,
}) => {
  const { t } = useTranslation("ArchiveDeletemodal");
  if (!deleteCaseModal) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[10000] flex justify-center items-center p-4">
      <div className="bg-white rounded-lg shadow-lg w-full max-w-sm">
        <div className="bg-slate-800 px-4 py-3 rounded-t-lg border-b border-slate-700">
          <h3 className="text-sm font-semibold text-white flex items-center gap-2">
            <Trash size={16} /> {t("archiveDeleteModal.title")}
          </h3>
        </div>
        <div className="p-4">
          <p className="text-xs text-slate-700">
            {t("archiveDeleteModal.message").replace(
              "<caseNumber>",
              deleteCaseModal.caseNumber
            )}
          </p>
        </div>
        <div className="flex justify-end gap-2 px-4 py-3 bg-slate-50 rounded-b-lg">
          <button
            onClick={() => setDeleteCaseModal(null)}
            className="px-3 py-1.5 border border-slate-300 text-slate-700 rounded text-xs hover:bg-slate-100 transition"
          >
            {t("archiveDeleteModal.cancelButton")}
          </button>
          <button
            onClick={() => handleDeleteCase(deleteCaseModal._id)}
            className="px-3 py-1.5 bg-red-600 text-white rounded text-xs hover:bg-red-700 transition"
          >
            {t("archiveDeleteModal.deleteButton")}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ArchiveDeleteModal;
