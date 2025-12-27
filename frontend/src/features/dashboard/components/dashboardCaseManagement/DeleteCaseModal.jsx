import React from "react";
import { motion } from "framer-motion";
import { X, Trash2 } from "lucide-react";

const DeleteCaseModal = ({ caseData, onCancel, onConfirm }) => {
  if (!caseData) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex justify-center items-center z-[9999] px-4 sm:px-6">
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.25, ease: "easeOut" }}
        className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md p-6 sm:p-8"
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-4 border-b pb-2">
          <h3 className="text-lg font-semibold text-[#0B1F3B] flex items-center gap-2">
            <Trash2 className="w-5 h-5 text-[#0B1F3B]" />
            Delete Case
          </h3>
          <button
            onClick={onCancel}
            className="w-8 h-8 flex items-center justify-center rounded-full bg-gray-200 text-gray-700 cursor-pointer hover:bg-[#0B1F3B] hover:text-white transition-all duration-200"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Body */}
        <p className="text-gray-700 text-sm sm:text-base mb-6">
          Are you sure you want to delete{" "}
          <span className="font-semibold text-[#0B1F3B]">{caseData.caseNumber}</span>{" "}
          for client <span className="font-semibold  text-[#0B1F3B]">{caseData.clientName}</span>? <br />
          This action cannot be undone.
        </p>

        {/* Buttons */}
        <div className="flex justify-end gap-3">
          <button
            onClick={onCancel}
            className="px-4 py-2 rounded-full bg-white text-gray-700 hover:bg-[#0B1F3B] border border-[#0B1F3B] hover:text-white cursor-pointer transition-all duration-200"
          >
            Cancel
          </button>
          <button
            onClick={() => onConfirm(caseData.id)}
            className="px-4 py-2 rounded-full bg-[#0B1F3B] cursor-pointer  text-white hover:bg-[#0B1F3B] transition-all duration-200"
          >
            Delete
          </button>
        </div>
      </motion.div>
    </div>
  );
};

export default DeleteCaseModal;
