import React from "react";
import { XCircle, Trash } from "lucide-react";

const ArchiveDeleteModal = ({
  deleteCaseModal,
  setDeleteCaseModal,
  handleDeleteCase,
}) => {
  if (!deleteCaseModal) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[10000] flex justify-center items-center p-4">
      <div className="bg-white rounded-lg shadow-lg w-full max-w-sm">
        <div className="bg-slate-800 px-4 py-3 rounded-t-lg border-b border-slate-700">
          <h3 className="text-sm font-semibold text-white flex items-center gap-2">
            <Trash size={16} /> Delete Case?
          </h3>
        </div>
        <div className="p-4">
          <p className="text-xs text-slate-700">
            Are you sure you want to permanently delete{" "}
            <span className="font-semibold">{deleteCaseModal.caseNumber}</span>?
            This action cannot be undone.
          </p>
        </div>
        <div className="flex justify-end gap-2 px-4 py-3 bg-slate-50 rounded-b-lg">
          <button
            onClick={() => setDeleteCaseModal(null)}
            className="px-3 py-1.5 border border-slate-300 text-slate-700 rounded text-xs hover:bg-slate-100 transition"
          >
            Cancel
          </button>
          <button
            onClick={() => handleDeleteCase(deleteCaseModal._id)}
            className="px-3 py-1.5 bg-red-600 text-white rounded text-xs hover:bg-red-700 transition"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
};

export default ArchiveDeleteModal;
