import React, { useState } from "react";
import { motion } from "framer-motion";
import { X, FilePlus } from "lucide-react";
import { useTranslation } from "react-i18next";
import i18n from "../../../../i18n/index"; // adjust path

const AddCaseModal = ({ onCancel, onSubmit }) => {
  const { t } = useTranslation("addCase");
  const isRTL = i18n.language === "ar";

  const [formData, setFormData] = useState({
    caseNumber: "",
    clientName: "",
    lawyer: "",
    stage: "Main Case",
    status: "Submitted",
    hearingDate: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = () => {
    if (!formData.caseNumber.trim() || !formData.clientName.trim() || !formData.lawyer.trim()) return;
    onSubmit(formData);
  };

  return (
    <div className="fixed inset-0 bg-black/80 flex justify-center items-center backdrop-blur px-4 sm:px-6 z-[9999]" dir={isRTL ? "rtl" : "ltr"}>
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.25, ease: "easeOut" }}
        className="relative bg-[#E1E1E2] text-white rounded-2xl shadow-2xl w-full max-w-2xl overflow-y-auto scrollbar-thin scrollbar-thumb-[#fe9a00]/40 scrollbar-track-transparent max-h-[85vh]"
      >
        {/* Header */}
        <div className="sticky top-0 z-20 bg-slate-800 text-white px-5 sm:px-8 py-4 rounded-t-2xl flex items-center justify-between shadow-md">
          <h3 className="text-lg sm:text-xl font-semibold flex items-center gap-2">
            <FilePlus className="w-5 h-5" />
            {t("addNewCase")}
          </h3>
          <button
            onClick={onCancel}
            className="w-9 h-9 flex items-center justify-center rounded-full bg-white text-[#1c283c] hover:bg-white hover:text-gray-900 transition-all duration-200 shadow-md"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <div className="p-6 sm:p-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
            {[
              { label: t("caseNumber"), name: "caseNumber", placeholder: t("caseNumberPlaceholder"), type: "text" },
              { label: t("clientName"), name: "clientName", placeholder: t("clientNamePlaceholder"), type: "text" },
              { label: t("lawyer"), name: "lawyer", placeholder: t("lawyerPlaceholder"), type: "text" }
            ].map((input) => (
              <div key={input.name}>
                <label className="block text-sm text-[#1e2738] mb-1 sm:mb-2">{input.label}</label>
                <input
                  type={input.type}
                  name={input.name}
                  value={formData[input.name]}
                  onChange={handleChange}
                  placeholder={input.placeholder}
                  className="w-full bg-gray-50 text-gray-900 border border-gray-300 rounded-xl p-2.5 sm:p-3 text-sm focus:ring-2 focus:ring-[#fe9a00] focus:border-[#fe9a00] focus:outline-none placeholder-gray-500 transition-all duration-200"
                />
              </div>
            ))}

            {/* Stage */}
            <div>
              <label className="block text-sm text-[#1e2738] mb-1 sm:mb-2">{t("stage")}</label>
              <select
                name="stage"
                value={formData.stage}
                onChange={handleChange}
                className="w-full bg-gray-50 text-[#1e2738] border border-gray-300 rounded-xl p-2.5 sm:p-3 text-sm focus:ring-2 focus:ring-[#fe9a00] focus:border-[#fe9a00] focus:outline-none transition-all duration-200"
              >
                <option>{t("mainCase")}</option>
                <option>{t("appeal")}</option>
                <option>{t("cassation")}</option>
              </select>
            </div>

            {/* Status */}
            <div>
              <label className="block text-sm text-[#1e2738] mb-1 sm:mb-2">{t("status")}</label>
              <select
                name="status"
                value={formData.status}
                onChange={handleChange}
                className="w-full bg-gray-50 text-gray-900 border border-gray-300 rounded-xl p-2.5 sm:p-3 text-sm focus:ring-2 focus:ring-[#fe9a00] focus:border-[#fe9a00] focus:outline-none transition-all duration-200"
              >
                <option>{t("submitted")}</option>
                <option>{t("awaitingApproval")}</option>
                <option>{t("inProgress")}</option>
                <option>{t("closed")}</option>
              </select>
            </div>

            {/* Hearing Date */}
            <div className="sm:col-span-2">
              <label className="block text-sm text-[#1e2738] mb-1 sm:mb-2">{t("hearingDate")}</label>
              <input
                type="date"
                name="hearingDate"
                value={formData.hearingDate}
                onChange={handleChange}
                className="w-full bg-gray-50 text-gray-900 border border-gray-300 rounded-xl p-2.5 sm:p-3 text-sm focus:ring-2 focus:ring-[#fe9a00] focus:border-[#fe9a00] focus:outline-none transition-all duration-200"
              />
            </div>
          </div>

          {/* Buttons */}
          <div className="flex flex-col sm:flex-row justify-end gap-3 mt-8 pb-2">
            <button
              onClick={onCancel}
              className="px-5 py-2.5 rounded-full bg-gray-700 text-gray-200 hover:bg-gray-600 transition-all duration-200 w-full sm:w-auto"
            >
              {t("cancel")}
            </button>
            <button
              onClick={handleSubmit}
              disabled={!formData.caseNumber.trim() || !formData.clientName.trim() || !formData.lawyer.trim()}
              className={`px-5 py-2.5 rounded-full font-semibold transition-all duration-200 shadow-md w-full sm:w-auto ${
                formData.caseNumber.trim() && formData.clientName.trim() && formData.lawyer.trim()
                  ? "bg-[#fe9a00] text-[#1c283c] hover:bg-[#ffad33]"
                  : "bg-gray-500 text-gray-300 cursor-not-allowed"
              }`}
            >
              {t("addCaseButton")}
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default AddCaseModal;
