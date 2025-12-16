import React, { useState } from "react";
import { X } from "lucide-react";
import {
  useGetLawyersQuery,
  useAssignCaseToLawyerMutation,
} from "../../api/secretaryApi";
import { toast } from "react-toastify";

const AssignLawyerModal = ({ isOpen, onClose, caseData }) => {
  const [selectedLawyer, setSelectedLawyer] = useState("");
  const [selectedApprovingLawyer, setSelectedApprovingLawyer] = useState("");

  const { data: lawyersData, isLoading: loadingLawyers } = useGetLawyersQuery();
  const [assignCaseToLawyer, { isLoading }] = useAssignCaseToLawyerMutation();

  if (!isOpen || !caseData) return null;

  // Check if the case status allows showing approving lawyer
  const showApprovingLawyer = caseData.status === "PendingApproval" ||
                               caseData.case?.status === "PendingApproval";

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!selectedLawyer) {
      toast.error("Please select a lawyer to assign");
      return;
    }

    // Only validate approving lawyer if the field is shown
    if (showApprovingLawyer) {
      if (!selectedApprovingLawyer) {
        toast.error("Please select an approving lawyer");
        return;
      }

      if (selectedLawyer === selectedApprovingLawyer) {
        toast.error("Assigned lawyer and approving lawyer must be different");
        return;
      }
    }

    try {
      const payload = {
        id: caseData._id || caseData.id,
        lawyerId: selectedLawyer,
      };

      // Only include approving lawyer if it should be shown
      if (showApprovingLawyer && selectedApprovingLawyer) {
        payload.approvingLawyerId = selectedApprovingLawyer;
      }

      await assignCaseToLawyer(payload).unwrap();

      toast.success(
        "Case assigned successfully! 📱 WhatsApp notifications sent to lawyers."
      );
      handleClose();
    } catch (error) {
      toast.error(error?.data?.message || "Failed to assign case");
    }
  };

  const handleClose = () => {
    setSelectedLawyer("");
    setSelectedApprovingLawyer("");
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-bold text-slate-800">
            Assign Case to Lawyer
          </h3>
          <button
            onClick={handleClose}
            className="p-1 hover:bg-slate-100 rounded-full transition"
          >
            <X size={20} className="text-slate-600" />
          </button>
        </div>

        <div className="mb-4 p-3 bg-slate-50 rounded-lg">
          <p className="text-sm text-slate-700">
            <strong>Case:</strong>{" "}
            {caseData.case?.caseNumber || caseData.caseNumber}
          </p>
          <p className="text-sm text-slate-600">
            <strong>Client:</strong>{" "}
            {caseData.client?.name || caseData.clientId?.name}
          </p>
          <p className="text-sm text-slate-600">
            <strong>Type:</strong>{" "}
            {caseData.case?.caseType || caseData.caseType}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1">
            <label className="block text-sm font-medium text-slate-700">
              Assigned Lawyer *
            </label>
            <select
              value={selectedLawyer}
              onChange={(e) => setSelectedLawyer(e.target.value)}
              className="w-full rounded-lg px-3 py-2 border border-slate-200 bg-slate-50 focus:ring-2 focus:ring-blue-500 text-sm"
              required
              disabled={loadingLawyers || isLoading}
            >
              <option value="">
                {loadingLawyers ? "Loading lawyers..." : "Select Lawyer"}
              </option>
              {lawyersData?.data?.map((lawyer) => (
                <option key={lawyer._id} value={lawyer._id}>
                  {lawyer.name} - {lawyer.email}
                </option>
              ))}
            </select>
            <p className="text-xs text-slate-500">
              Primary lawyer responsible for case handling
            </p>
          </div>

          {showApprovingLawyer && (
            <div className="space-y-1">
              <label className="block text-sm font-medium text-slate-700">
                Approving Lawyer *
              </label>
              <select
                value={selectedApprovingLawyer}
                onChange={(e) => setSelectedApprovingLawyer(e.target.value)}
                className="w-full rounded-lg px-3 py-2 border border-slate-200 bg-slate-50 focus:ring-2 focus:ring-blue-500 text-sm"
                required={showApprovingLawyer}
                disabled={loadingLawyers || isLoading}
              >
                <option value="">
                  {loadingLawyers
                    ? "Loading lawyers..."
                    : "Select Approving Lawyer"}
                </option>
                {lawyersData?.data?.map((lawyer) => (
                  <option key={lawyer._id} value={lawyer._id}>
                    {lawyer.name} - {lawyer.email}
                  </option>
                ))}
              </select>
              <p className="text-xs text-slate-500">
                Senior lawyer responsible for final case approval
              </p>
            </div>
          )}

          {!showApprovingLawyer && (
            <div className="bg-amber-50 border border-amber-200 rounded-lg p-3">
              <p className="text-xs text-amber-800">
                <strong>Note:</strong> Approving lawyer can be assigned once the case reaches "Pending Approval" status.
              </p>
            </div>
          )}

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
            <p className="text-xs text-blue-800">
              <strong>WhatsApp Integration:</strong> Both lawyers will
              receive instant notifications about the case assignment with all
              relevant details.
            </p>
          </div>

          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={handleClose}
              className="flex-1 px-4 py-2 bg-slate-200 text-slate-700 rounded-lg hover:bg-slate-300 transition"
              disabled={isLoading}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={isLoading || loadingLawyers}
            >
              {isLoading ? "Assigning..." : "Assign Case"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AssignLawyerModal;
