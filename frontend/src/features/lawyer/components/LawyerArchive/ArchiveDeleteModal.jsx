// src/components/ArchiveComponents/ArchiveDeleteModal.jsx
import React from "react";
import { Trash2, AlertTriangle, X } from "lucide-react";

const ArchiveDeleteModal = ({ caseToDelete, onClose, onConfirm }) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      ></div>

      {/* Modal Container */}
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md z-10 transform transition-all duration-300 scale-100">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-gray-100 p-5 sm:p-6">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-red-100 rounded-xl">
              <AlertTriangle className="w-6 h-6 text-red-600" />
            </div>
            <div>
              <h3 className="text-lg sm:text-xl font-bold text-gray-900">
                Archive Deletion
              </h3>
              <p className="text-gray-500 text-sm">Permanent case removal</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        {/* Content */}
        <div className="p-5 sm:p-6">
          <div className="flex items-start gap-3 bg-red-50 border border-red-200 rounded-xl p-4 mb-5">
            <AlertTriangle className="w-5 h-5 text-red-600 mt-0.5 flex-shrink-0" />
            <p className="text-red-800 text-sm font-medium leading-relaxed">
              <strong>Warning:</strong> This action cannot be undone. All case
              data will be permanently deleted from the system.
            </p>
          </div>

          <p className="text-gray-800 text-base sm:text-lg font-medium mb-2">
            Are you sure you want to delete case{" "}
            <strong className="text-red-600">
              {caseToDelete?.caseNumber}
            </strong>
            ?
          </p>
          <p className="text-gray-600 text-sm">
            Client: <span className="font-medium">{caseToDelete?.clientName}</span>{" "}
            • Archive:{" "}
            <span className="font-medium">{caseToDelete?.archiveReference}</span>
          </p>
        </div>

        {/* Footer Actions */}
        <div className="flex flex-col sm:flex-row justify-end gap-3 p-5 sm:p-6 border-t border-gray-100">
          <button
            onClick={onClose}
            className="w-full sm:w-auto px-6 py-2.5 border-2 border-gray-300 text-gray-700 rounded-xl font-semibold hover:bg-gray-50 transition-all"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-2.5 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-xl font-semibold hover:from-red-600 hover:to-red-700 transition-all shadow-md shadow-red-500/25"
          >
            <Trash2 size={18} />
            Delete Permanently
          </button>
        </div>
      </div>
    </div>
  );
};

export default ArchiveDeleteModal;
