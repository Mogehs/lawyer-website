// src/components/LawyerCases/DeleteModal.jsx
import React from "react";
import { X, Trash2 } from "lucide-react";

export default function DeleteModal({ isOpen, onClose, onDelete, caseName, isDeleting }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[10000] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={isDeleting ? undefined : onClose}
      ></div>

      {/* Modal */}
      <div className="relative bg-white w-full max-w-sm rounded-lg shadow-lg">
        <div className="bg-[#A48C65] px-4 py-3 rounded-t-lg border-b border-slate-700 flex justify-between items-center">
          <h2 className="text-sm font-semibold text-white flex items-center gap-2">
            <Trash2 size={16} /> Delete Case?
          </h2>
          <button
            onClick={onClose}
            disabled={isDeleting}
            className="p-1 hover:bg-slate-700 rounded transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <X size={14} className="text-white" />
          </button>
        </div>

        <div className="p-4">
          <p className="text-xs text-slate-700">
            Are you sure you want to delete{" "}
            <span className="font-semibold">{caseName}</span>? This action
            cannot be undone.
          </p>
        </div>

        <div className="flex justify-end gap-2 px-4 py-3 bg-slate-50 rounded-b-lg">
          <button
            onClick={onClose}
            disabled={isDeleting}
            className="px-3 py-1.5 border border-slate-300 text-slate-700 rounded text-xs hover:bg-slate-100 transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Cancel
          </button>
          <button
            onClick={onDelete}
            disabled={isDeleting}
            className="px-3 py-1.5 bg-[#A48C65] text-white rounded text-xs hover:bg-[#8B704D] flex items-center gap-1 transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Trash2 size={12} /> {isDeleting ? "Deleting..." : "Delete"}
          </button>
        </div>
      </div>
    </div>
  );
}
