import React, { useState } from "react";
import { X, Bell, Calendar } from "lucide-react";
import { useCreateReminderMutation } from "../../api/secretaryApi";
import { toast } from "react-toastify";

const AddReminderModal = ({ isOpen, onClose, caseData }) => {
  const [formData, setFormData] = useState({
    reminderType: "Hearing",
    reminderDate: "",
    message: "",
  });

  const [createReminder, { isLoading }] = useCreateReminderMutation();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.reminderDate) {
      toast.error("Please select a reminder date");
      return;
    }

    try {
      await createReminder({
        caseId: caseData._id,
        reminderType: formData.reminderType,
        reminderDate: formData.reminderDate,
        message:
          formData.message ||
          `${formData.reminderType} reminder for ${caseData.case.caseNumber}`,
      }).unwrap();

      toast.success("Reminder created successfully");
      onClose();
      setFormData({
        reminderType: "Hearing",
        reminderDate: "",
        message: "",
      });
    } catch (error) {
      console.error("Failed to create reminder:", error);
      toast.error(error?.data?.message || "Failed to create reminder");
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-[9999] p-4">
      <div className="bg-white rounded-lg shadow-lg max-w-md w-full">
        {/* Header */}
        <div className="bg-[#A48C65] text-white p-3 rounded-t-lg flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Bell size={16} />
            <div>
              <h2 className="text-sm font-semibold">Add Reminder</h2>
              <p className="text-[10px] text-white">
                {caseData?.case?.caseNumber} - {caseData?.client?.name}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-white hover:text-white hover:bg-[#bfac8c] p-1 rounded transition"
          >
            <X size={16} />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-4 space-y-3">
          {/* Reminder Type */}
          <div>
            <label className="block text-[10px] font-semibold uppercase tracking-wide text-slate-600 mb-1">
              Type *
            </label>
            <select
              name="reminderType"
              value={formData.reminderType}
              onChange={handleChange}
              required
              className="w-full px-2 py-1.5 border border-[#A48C65] rounded bg-slate-50 focus:ring-1 focus:ring-[#A48C65] text-xs"
            >
              <option value="Hearing">Hearing</option>
              <option value="Submission">Submission</option>
            </select>
          </div>

          {/* Reminder Date */}
          <div>
            <label className="block text-[10px] font-semibold uppercase tracking-wide text-slate-600 mb-1">
              Date *
            </label>
            <div className="relative">
              <Calendar
                size={14}
                className="absolute left-2 top-1/2 transform -translate-y-1/2 text-slate-400"
              />
              <input
                type="date"
                name="reminderDate"
                value={formData.reminderDate}
                onChange={handleChange}
                required
                min={new Date().toISOString().split("T")[0]}
                className="w-full pl-8 pr-2 py-1.5 border border-[#A48C65] rounded bg-slate-50 focus:ring-1 focus:ring-[#A48C65] text-xs"
              />
            </div>
          </div>

          {/* Custom Message */}
          <div>
            <label className="block text-[10px] font-semibold uppercase tracking-wide text-slate-600 mb-1">
              Message (Optional)
            </label>
            <textarea
              name="message"
              value={formData.message}
              onChange={handleChange}
              rows="2"
              placeholder="Enter a custom reminder message..."
              className="w-full px-2 py-1.5 border border-[#A48C65] rounded bg-slate-50 focus:ring-1 focus:ring-[#A48C65] text-xs resize-none"
            />
          </div>

          {/* Action Buttons */}
          <div className="flex gap-2 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-3 py-1.5 border border-slate-300 text-slate-700 rounded text-xs hover:bg-slate-50 transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="flex-1 px-3 py-1.5 bg-[#A48C65] text-white rounded text-xs hover:bg-[#8B754E] transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? "Creating..." : "Create"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddReminderModal;
