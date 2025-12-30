import { useState } from "react";
import { useTranslation } from "react-i18next";

const AddReminderModal = ({ onClose, onSubmit }) => {
  const { t } = useTranslation("addReminderModal");
  const [form, setForm] = useState({
    caseName: "",
    stage: "Main Case",
    type: "Before Hearing",
    lawyer: "",
    target: "Assigned Lawyer",
    date: "",
    description: "",
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.caseName || !form.date) return;
    onSubmit(form);
  };

  return (
    <div className="fixed inset-0 bg-black/60 flex justify-center items-center lg:top-14 z-50">
      {/* Modal Container */}
      <div
        className="bg-[#0B1F3B] text-[#f3f5f6] p-6 rounded-xl shadow-2xl
                   w-[90%] sm:w-[400px]
                   border border-[#0B1F3B]/30
                   max-h-[90vh] sm:max-h-[80vh]
                   overflow-y-auto"
      >
        <h3 className="text-lg font-semibold text-white mb-4">{t("addReminderModal.title")}</h3>

        <form onSubmit={handleSubmit} className="space-y-3">

          {/* Case Name */}
          <input
            type="text"
            name="caseName"
            placeholder={t("addReminderModal.caseName")}
            value={form.caseName}
            onChange={handleChange}
            className="w-full p-2 rounded-lg text-[#0B1F3B] bg-white border border-[#0B1F3B]/30 focus:outline-none"
          />

          {/* Lawyer */}
          <input
            type="text"
            name="lawyer"
            placeholder={t("addReminderModal.lawyer")}
            value={form.lawyer}
            onChange={handleChange}
            className="w-full p-2 rounded-lg text-[#0B1F3B] bg-white border border-[#0B1F3B]/30 focus:outline-none"
          />

          {/* Stage */}
          <select
            name="stage"
            value={form.stage}
            onChange={handleChange}
            className="w-full p-2 rounded-lg text-[#0B1F3B] bg-white border border-[#0B1F3B]/30 focus:outline-none"
          >
            <option>{t("addReminderModal.mainCase")}</option>
            <option>{t("addReminderModal.appeal")}</option>
            <option>{t("addReminderModal.cassation")}</option>
          </select>

          {/* Reminder Type */}
          <select
            name="type"
            value={form.type}
            onChange={handleChange}
            className="w-full p-2 rounded-lg text-[#0B1F3B] bg-white border border-[#0B1F3B]/30 focus:outline-none"
          >
            <option>{t("addReminderModal.beforeHearing")}</option>
            <option>{t("addReminderModal.beforeSubmission")}</option>
            <option>{t("addReminderModal.beforeJudgment")}</option>
            <option>{t("addReminderModal.signaturePending")}</option>
            <option>{t("addReminderModal.submissionDeadline")}</option>
            <option>{t("addReminderModal.approvalDelay")}</option>
            <option>{t("addReminderModal.archivingPending")}</option>
            <option>{t("addReminderModal.notificationFailure")}</option>
            <option>{t("addReminderModal.performanceAlert")}</option>
          </select>

          {/* Target Recipient */}
          <select
            name="target"
            value={form.target}
            onChange={handleChange}
            className="w-full p-2 rounded-lg text-[#0B1F3B] bg-white border border-[#0B1F3B]/30 focus:outline-none"
          >
            <option>{t("addReminderModal.secretary")}</option>
            <option>{t("addReminderModal.assignedLawyer")}</option>
            <option>{t("addReminderModal.allLawyers")}</option>
            <option>{t("addReminderModal.approvingLawyer")}</option>
            <option>{t("addReminderModal.managingDirector")}</option>
            <option>{t("addReminderModal.everyone")}</option>
          </select>

          {/* Date */}
          <input
            type="date"
            name="date"
            value={form.date}
            onChange={handleChange}
            className="w-full p-2 rounded-lg text-[#0B1F3B] bg-white border border-[#0B1F3B]/30 focus:outline-none"
          />

          {/* Description */}
          <textarea
            name="description"
            placeholder={t("addReminderModal.description")}
            value={form.description}
            onChange={handleChange}
            className="w-full p-2 rounded-lg text-[#0B1F3B] bg-white border border-[#0B1F3B]/30 focus:outline-none min-h-[80px]"
          />

          {/* Buttons */}
          <div className="flex justify-end gap-3 mt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 cursor-pointer border border-[#0B1F3B] text-gray-800 bg-white
                         hover:bg-[#0B1F3B] hover:text-white transition-all rounded-lg"
            >
              {t("addReminderModal.cancelButton")}
            </button>

            <button
              type="submit"
              className="px-4 cursor-pointer text-[#0B1F3B] py-2 bg-[white] hover:bg-[#0B1F3B] rounded-lg hover:text-white"
            >
              {t("addReminderModal.saveButton")}
            </button>
          </div>

        </form>
      </div>
    </div>
  );
};

export default AddReminderModal;
