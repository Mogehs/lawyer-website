import { motion } from "framer-motion";
import { X, Trash2, AlertTriangle } from "lucide-react";
import { useTranslation } from "react-i18next";

const CaseDeleteModal = ({ isOpen, caseItem, onClose, onConfirm }) => {
  const { t } = useTranslation("CaseDelete");

  if (!isOpen || !caseItem) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex justify-center items-center z-[9999] p-4">
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.2, ease: "easeOut" }}
        className="relative bg-white rounded-lg shadow-lg w-full max-w-md flex flex-col"
      >
        {/* Header */}
        <div className="flex items-center bg-[#0B1F3B] justify-between p-3 rounded-t-lg">
          <h3 className="text-sm font-semibold flex items-center gap-1.5 text-white">
            <Trash2 className="w-4 h-4" />
            {t("deleteTitle")}
          </h3>
          <button
            onClick={onClose}
            className="text-[#0B1F3B] cursor-pointer rounded-lg bg-white hover:text-black transition-colors p-1"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Body */}
        <div className="space-y-3 p-4">
          <div className="flex items-start gap-2">
            <AlertTriangle
              className="text-[#0B1F3B] flex-shrink-0 mt-0.5"
              size={16}
            />
            <div>
              <p className="font-semibold text-slate-800 text-xs">
                {t("deleteConfirmation", { id: caseItem.id })}
              </p>
              <p className="text-[10px] text-slate-600 mt-0.5">
                {t("caseDetails", {
                  clientName: caseItem.client?.name,
                  caseDescription: caseItem.case?.description || t("defaultCase")
                })}
              </p>
            </div>
          </div>

          {/* Case Info */}
          <div className="bg-slate-50 border border-slate-200 rounded p-2">
            <div className="space-y-1 text-[10px] text-slate-600">
              {caseItem.case?.status && (
                <p>
                  {t("status")}:{" "}
                  <span className="font-medium text-slate-800">
                    {caseItem.case.status}
                  </span>
                </p>
              )}
              {caseItem.case?.hearingDate && (
                <p>
                  {t("hearing")}:{" "}
                  <span className="font-medium text-slate-800">
                    {caseItem.case.hearingDate}
                  </span>
                </p>
              )}
            </div>
          </div>

          {/* Warning */}
          <div className="bg-red-50 border border-red-200 rounded p-2">
            <p className="text-[10px] text-slate-700 leading-relaxed">
              <span className="font-semibold text-[#0B1F3B]">
                {t("warningTitle")}
              </span>{" "}
              {t("warningMessage")}
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="flex justify-end gap-2 px-4 py-2 border-t border-slate-200 bg-slate-50 rounded-b-lg">
          <button
            onClick={onClose}
            className="px-3 py-1 border cursor-pointer border-slate-300 text-slate-700 rounded text-xs hover:bg-white transition"
          >
            {t("cancel")}
          </button>
          <button
            onClick={onConfirm}
            className="flex items-center cursor-pointer gap-1 px-3 py-1 bg-[#0B1F3B] text-white rounded text-xs font-medium hover:bg-white hover:text-[#0B1F3B] transition"
          >
            <Trash2 className="w-3 h-3" />
            {t("delete")}
          </button>
        </div>
      </motion.div>
    </div>
  );
};

export default CaseDeleteModal;
