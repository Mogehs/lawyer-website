import React from "react";
import { X, Trash2 } from "lucide-react";

const DeleteConfirmationModal = ({ caseItem, onConfirm, onCancel }) => {
  if (!caseItem) return null;

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-[9999]">
      <div className="bg-white rounded-2xl shadow-2xl w-[90%] max-w-md p-6 relative text-center border border-[#fe9a00]/30">
        {/* Close Button */}
        <button
          onClick={onCancel}
          className="absolute top-3 right-3 w-9 h-9 flex items-center justify-center rounded-full bg-gray-200 text-gray-700 hover:bg-[#fe9a00] hover:text-white transition-all duration-200"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex flex-col items-center gap-4">
          <div className="bg-red-100 p-4 rounded-full">
            <Trash2 className="w-8 h-8 text-[#A48C65]" />
          </div>

          <h2 className="text-lg font-semibold text-[#A48C65]">
            Delete Case {caseItem.caseNumber}?
          </h2>
          <p className="text-gray-600 text-sm">
            This action cannot be undone. Are you sure you want to delete this case?
          </p>

          <div className="flex justify-center gap-3 mt-5">
            <button
              onClick={onCancel}
              className="px-4 py-2 rounded-full bg-gray-200 text-gray-700 hover:bg-gray-300 transition-all duration-200"
            >
              Cancel
            </button>
            <button
              onClick={() => onConfirm(caseItem)}
              className="px-4 py-2 rounded-full bg-white border border-[#A48C65] text-gray-800 hover:bg-[#A48C65] hover:text-white transition-all duration-200"
            >
              Delete
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DeleteConfirmationModal;
