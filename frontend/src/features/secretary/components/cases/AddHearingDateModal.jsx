import React, { useState, useEffect } from "react";
import { X, Calendar, Clock } from "lucide-react";
import { useUpdateHearingDetailsMutation } from "../../api/secretaryApi";
import { toast } from "react-toastify";

const AddHearingDateModal = ({ isOpen, onClose, caseData }) => {
  const [hearingDate, setHearingDate] = useState("");
  const [hearingTime, setHearingTime] = useState("");
  const [selectedStageIndex, setSelectedStageIndex] = useState(0);

  const [updateHearingDetails, { isLoading }] =
    useUpdateHearingDetailsMutation();

  // Sync state when modal opens or caseData changes
  useEffect(() => {
    if (isOpen && caseData) {
      // Get the latest stage's hearing data if available
      const stages = caseData.stages || [];
      const latestStage = stages[stages.length - 1];

      if (latestStage?.hearingDate) {
        setHearingDate(latestStage.hearingDate.split('T')[0]); // Format date
      }
      if (latestStage?.hearingTime) {
        setHearingTime(latestStage.hearingTime);
      }
      setSelectedStageIndex(stages.length > 0 ? stages.length - 1 : 0);
    }
  }, [isOpen, caseData]);

  if (!isOpen || !caseData) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!hearingDate) {
      toast.error("Please select a hearing date");
      return;
    }

    if (!hearingTime) {
      toast.error("Please select a hearing time");
      return;
    }

    try {
      await updateHearingDetails({
        id: caseData._id || caseData.id,
        hearingData: {
          stageIndex: selectedStageIndex,
          hearingDate,
          hearingTime,
        },
      }).unwrap();

      toast.success(
        "Hearing date added successfully. WhatsApp reminders scheduled for lawyer and secretary."
      );
      handleClose();
    } catch (error) {
      toast.error(error?.data?.message || "Failed to add hearing date");
    }
  };

  const handleClose = () => {
    setHearingDate("");
    setHearingTime("");
    setSelectedStageIndex(0);
    onClose();
  };

  // Get minimum date (today)
  const today = new Date().toISOString().split("T")[0];

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-[9999] p-4">
      <div className="bg-white rounded-lg shadow-lg max-w-md w-full">
        {/* Header */}
        <div className="bg-[#A48C65] text-white px-4 py-3 flex justify-between items-center rounded-t-lg border-b border-[#8B754E]">
          <h2 className="text-sm font-semibold">Schedule Hearing Date</h2>
          <button
            onClick={handleClose}
            className="hover:bg-[#8B754E] rounded p-1 transition-colors"
          >
            <X size={16} />
          </button>
        </div>

        {/* Content */}
        <form onSubmit={handleSubmit} className="p-4 space-y-3">
          {/* Case Info */}
          <div className="bg-slate-50 p-2 rounded border border-slate-200">
            <p className="text-[10px] text-slate-500 mb-0.5">Case Number</p>
            <p className="font-semibold text-xs text-slate-900">
              {caseData?.case?.caseNumber || caseData?.caseNumber}
            </p>
            <p className="text-[10px] text-slate-500 mt-1.5 mb-0.5">
              Client Name
            </p>
            <p className="text-xs text-slate-800">
              {caseData?.client?.name || "N/A"}
            </p>
            <p className="text-[10px] text-slate-500 mt-1.5 mb-0.5">
              Assigned Lawyer
            </p>
            <p className="text-xs text-slate-800">
              {caseData?.case?.assignedLawyer || "Not Assigned"}
            </p>
          </div>

          {/* Stage Selection */}
          {caseData?.stages && caseData.stages.length > 0 && (
            <div>
              <label className="block text-[10px] font-semibold uppercase tracking-wide text-slate-600 mb-1">
                Select Stage
              </label>
              <select
                value={selectedStageIndex}
                onChange={(e) => setSelectedStageIndex(Number(e.target.value))}
                className="w-full px-2 py-1.5 border border-slate-200 rounded bg-slate-50 focus:ring-1 focus:ring-blue-500 text-xs"
              >
                {caseData.stages.map((stage, index) => (
                  <option key={index} value={index}>
                    {stage.stageType || stage.stage || `Stage ${index + 1}`}
                  </option>
                ))}
              </select>
            </div>
          )}

          {/* Hearing Date */}
          <div>
            <label className="block text-[10px] font-semibold uppercase tracking-wide text-slate-600 mb-1">
              <Calendar className="inline-block mr-1 w-3 h-3" />
              Date <span className="text-red-500">*</span>
            </label>
            <input
              type="date"
              value={hearingDate}
              onChange={(e) => setHearingDate(e.target.value)}
              min={today}
              className="w-full px-2 py-1.5 border border-slate-200 rounded bg-slate-50 focus:ring-1 focus:ring-blue-500 text-xs"
              required
            />
          </div>

          {/* Hearing Time */}
          <div>
            <label className="block text-[10px] font-semibold uppercase tracking-wide text-slate-600 mb-1">
              <Clock className="inline-block mr-1 w-3 h-3" />
              Time <span className="text-[#A48C65]">*</span>
            </label>
            <input
              type="time"
              value={hearingTime}
              onChange={(e) => setHearingTime(e.target.value)}
              className="w-full px-2 py-1.5 border border-slate-200 rounded bg-slate-50 focus:ring-1 focus:ring-blue-500 text-xs"
              required
            />
          </div>

          {/* Info Message */}
          <div className="bg-blue-50 border border-blue-200 rounded p-2">
            <p className="text-[10px] text-blue-800 leading-relaxed">
              <strong>Note:</strong> The assigned lawyer will be notified. A
              reminder will be created 3 days before the hearing.
            </p>
          </div>

          {/* Actions */}
          <div className="flex gap-2 pt-2">
            <button
              type="button"
              onClick={handleClose}
              className="flex-1 px-3 py-1.5 border border-slate-300 text-slate-700 rounded text-xs hover:bg-slate-50 transition"
              disabled={isLoading}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="flex-1 px-3 py-1.5 bg-slate-700 text-white rounded text-xs hover:bg-slate-800 transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? "Scheduling..." : "Schedule"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddHearingDateModal;
