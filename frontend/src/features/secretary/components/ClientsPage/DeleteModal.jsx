// src/features/secretary/clients/DeleteModal.jsx
import React from "react";
import { useTranslation } from "react-i18next";

export default function DeleteModal({
  isOpen,
  onClose,
  onDelete,
  name,
  isDeleting = false,
}) {
  const { t } = useTranslation("Modeldelet");

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex justify-center items-center z-[10000] p-4">
      <div className="bg-white rounded-lg shadow-lg max-w-sm w-full">
        {/* Header */}
        <div className="bg-[#0B1F3B] px-4 py-3 rounded-t-lg border-b border-white">
          <h2 className="text-sm font-semibold text-white">
            {t("deleteModal.title")}
          </h2>
        </div>

        {/* Body */}
        <div className="p-4">
          <p className="text-xs text-slate-700">
            {t("deleteModal.message", { name })}
          </p>
        </div>

        {/* Footer */}
        <div className="flex justify-end gap-2 px-4 py-3 bg-slate-50 rounded-b-lg">
          <button
            onClick={onClose}
            disabled={isDeleting}
            className="px-3 py-1.5 cursor-pointer rounded border border-slate-300
              hover:bg-[#0B1F3B] hover:text-white text-xs text-slate-700
              transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {t("deleteModal.cancel")}
          </button>

          <button
            onClick={onDelete}
            disabled={isDeleting}
            className="px-3 py-1.5 rounded cursor-pointer bg-[#0B1F3B]
              hover:bg-white hover:text-[#0B1F3B] text-white text-xs
              hover:border-[#0B1F3B] border transition
              disabled:opacity-50 disabled:cursor-not-allowed
              flex items-center gap-1.5"
          >
            {isDeleting ? (
              <>
                <div className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                {t("deleteModal.deleting")}
              </>
            ) : (
              t("deleteModal.delete")
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
