import React, { useState, useEffect } from "react";
import { X, FileText } from "lucide-react";
import { useUpdateCourtCaseIdMutation } from "../../api/secretaryApi";
import { toast } from "react-toastify";

const UpdateCourtCaseIdModal = ({ isOpen, onClose, caseData }) => {
  const [courtCaseId, setCourtCaseId] = useState("");
  const [updateCourtCaseId, { isLoading }] = useUpdateCourtCaseIdMutation();

  // Update state when modal opens or caseData changes
  useEffect(() => {
    if (isOpen && caseData) {
      setCourtCaseId(caseData.courtCaseId || caseData.case?.courtCaseId || "");
    }
  }, [isOpen, caseData]);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!courtCaseId.trim()) {
      toast.error("Please enter the Court Case ID");
      return;
    }

    try {
      await updateCourtCaseId({
        id: caseData._id || caseData.id,
        courtCaseId: courtCaseId.trim(),
      }).unwrap();

      toast.success("Court Case ID updated successfully!");
      onClose();
    } catch (error) {
      toast.error(error?.data?.message || "Failed to update Court Case ID");
    }
  };

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-md overflow-hidden">
        {/* Header */}
        <div className="bg-[#0B1F3B] px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-white/20 p-2 rounded-lg">
              <FileText className="text-white" size={20} />
            </div>
            <div>
              <h2 className="text-white font-semibold text-lg">
                Update Court Case ID
              </h2>
              <p className="text-blue-100 text-xs">
                Case: {caseData?.caseNumber}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-white/80 cursor-pointer hover:text-white transition-colors p-1 rounded-lg hover:bg-white/10"
          >
            <X size={20} />
          </button>
        </div>

        {/* Content */}
        <form onSubmit={handleSubmit} className="p-6">
          <div className="space-y-4">
            {/* Case Information */}
            <div className="bg-[#fffff] border border-[#0B1F3B] rounded-lg p-4 space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-slate-600 font-medium">Case Type:</span>
                <span className="text-slate-800">{caseData?.caseType}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-600 font-medium">Client:</span>
                <span className="text-slate-800">
                  {caseData?.clientId?.name || "N/A"}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-600 font-medium">Status:</span>
                <span className="text-slate-800">{caseData?.status}</span>
              </div>
            </div>

            {/* Court Case ID Input */}
            <div className="space-y-2">
              <label className="block text-sm font-semibold text-slate-700">
                Court Case ID <span className="text-[#A48C65]">*</span>
              </label>
              <input
                type="text"
                value={courtCaseId}
                onChange={(e) => setCourtCaseId(e.target.value)}
                placeholder="Enter court-assigned case ID (e.g., CC-2025-1234)"
                className="w-full px-4 py-2.5 border border-[#0B1F3B] rounded-lg focus:ring-2 focus:ring-[#0B1F3B] focus:border-[#0B1F3B] outline-none transition-all text-sm"
                required
              />
              <p className="text-xs text-[#0B1F3B]">
                💡 Enter the case ID assigned by the court after submission
              </p>
            </div>

            {/* Current Court Case ID (if exists) */}
            {caseData?.courtCaseId && (
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
                <p className="text-xs text-yellow-800 font-medium">
                  Current Court Case ID:{" "}
                  <span className="font-bold">{caseData.courtCaseId}</span>
                </p>
                <p className="text-xs text-yellow-700 mt-1">
                  ⚠️ Updating will replace the existing Court Case ID
                </p>
              </div>
            )}
          </div>

          {/* Actions */}
          <div className="flex gap-3 mt-6">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2.5 bg-[#F3F1E7] cursor-pointer text-[#0B1F3B] rounded-lg hover:bg-[#E6E2D9] transition-colors font-medium text-sm"
              disabled={isLoading}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="flex-1 px-4 py-2.5 bg-[#0B1F3B] cursor-pointer text-white rounded-lg  transition-colors font-medium text-sm disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Updating...
                </>
              ) : (
                <>
                  <FileText size={16} />
                  Update Court Case ID
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UpdateCourtCaseIdModal;
