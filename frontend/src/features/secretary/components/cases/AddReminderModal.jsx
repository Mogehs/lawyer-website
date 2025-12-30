import React, { useState } from "react";
import { X, Bell, Calendar } from "lucide-react";
import { useCreateReminderMutation } from "../../api/secretaryApi";
import { toast } from "react-toastify";
import { useTranslation } from "react-i18next";

const AddReminderModal = ({ isOpen, onClose, caseData }) => {
  const { t } = useTranslation("CaseReminder");

  const [formData, setFormData] = useState({
    reminderType: "Hearing",
    reminderDate: "",
    message: "",
  });

  const [createReminder, { isLoading }] = useCreateReminderMutation();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.reminderDate) {
      toast.error(t("addReminder.errors.selectDate"));
      return;
    }

    try {
      await createReminder({
        caseId: caseData._id,
        reminderType: formData.reminderType,
        reminderDate: formData.reminderDate,
        message:
          formData.message ||
          `${formData.reminderType} ${caseData.case.caseNumber}`,
      }).unwrap();

      toast.success(t("addReminder.success.created"));
      onClose();

      setFormData({
        reminderType: "Hearing",
        reminderDate: "",
        message: "",
      });
    } catch (error) {
      console.error("Create reminder error:", error);
      toast.error(
        error?.data?.message || t("addReminder.errors.failed")
      );
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-[9999] p-4">
      <div className="bg-white rounded-lg shadow-lg max-w-md w-full">
        {/* Header */}
        <div className="bg-[#0B1F3B] text-white p-3 rounded-t-lg flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Bell size={16} />
            <div>
              <h2 className="text-sm font-semibold">
                {t("addReminder.title")}
              </h2>
              <p className="text-[10px]">
                {t("addReminder.subtitle", {
                  caseNumber: caseData?.case?.caseNumber,
                  clientName: caseData?.client?.name,
                })}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded hover:bg-[#0B1F3B]"
          >
            <X size={16} />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-4 space-y-3">
          {/* Type */}
          <div>
            <label className="block text-[10px] font-semibold text-slate-600 mb-1">
              {t("addReminder.labels.type")} *
            </label>
            <select
              name="reminderType"
              value={formData.reminderType}
              onChange={handleChange}
              className="w-full px-2 py-1.5 border border-[#0B1F3B] rounded bg-slate-50 text-xs"
            >
              <option value="Hearing">
                {t("addReminder.types.hearing")}
              </option>
              <option value="Submission">
                {t("addReminder.types.submission")}
              </option>
            </select>
          </div>

          {/* Date */}
          <div>
            <label className="block text-[10px] font-semibold text-slate-600 mb-1">
              {t("addReminder.labels.date")} *
            </label>
            <div className="relative">
              <Calendar
                size={14}
                className="absolute left-2 top-1/2 -translate-y-1/2 text-slate-400"
              />
              <input
                type="date"
                name="reminderDate"
                value={formData.reminderDate}
                onChange={handleChange}
                min={new Date().toISOString().split("T")[0]}
                className="w-full pl-8 pr-2 py-1.5 border border-[#0B1F3B] rounded bg-slate-50 text-xs"
              />
            </div>
          </div>

          {/* Message */}
          <div>
            <label className="block text-[10px] font-semibold text-slate-600 mb-1">
              {t("addReminder.labels.message")}
            </label>
            <textarea
              name="message"
              value={formData.message}
              onChange={handleChange}
              rows="2"
              placeholder={t("addReminder.placeholders.message")}
              className="w-full px-2 py-1.5 border border-[#0B1F3B] rounded bg-slate-50 text-xs resize-none"
            />
          </div>

          {/* Buttons */}
          <div className="flex gap-2 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 border border-slate-300 text-slate-700 rounded text-xs py-1.5"
            >
              {t("addReminder.buttons.cancel")}
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="flex-1 bg-[#0B1F3B] text-white rounded text-xs py-1.5 disabled:opacity-50"
            >
              {isLoading
                ? t("addReminder.buttons.creating")
                : t("addReminder.buttons.create")}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddReminderModal;
