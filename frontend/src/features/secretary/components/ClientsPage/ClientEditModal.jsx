// src/features/secretary/clients/ClientEditModal.jsx
import React, { useState, useEffect } from "react";
import { X } from "lucide-react";
import { useTranslation } from "react-i18next";

export default function ClientEditModal({
  client,
  onClose,
  onSave,
  isCreating = false,
}) {
  const { t } = useTranslation("EditModel");

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    contactNumber: "",
    nationalId: "",
    address: "",
    additionalInfo: "",
  });

  // Load client data on open
  useEffect(() => {
    if (client) setFormData({ ...client });
  }, [client]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.contactNumber) return;
    onSave(formData);
  };

  return (
    <div className="fixed inset-0 z-[10000] flex justify-center items-center bg-black/50 backdrop-blur-sm p-4">
      <div className="bg-white rounded-lg shadow-lg w-full max-w-2xl max-h-[90vh] flex flex-col">
        
        {/* Header */}
        <div className="bg-[#0B1F3B] px-4 py-3 rounded-t-lg border-b border-white flex justify-between items-center">
          <h2 className="text-sm font-semibold text-white">
            {isCreating
              ? t("clientEditModal.titleAdd")
              : t("clientEditModal.titleEdit")}
          </h2>

          <button
            onClick={onClose}
            className="text-white cursor-pointer rounded p-1 hover:bg-[#0B1F3B]"
          >
            <X size={16} />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-4 overflow-y-auto flex-1">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">

            {/* Name */}
            <div className="space-y-1">
              <label className="text-[10px] font-semibold uppercase tracking-wide text-slate-600">
                {t("clientEditModal.labels.name")} *
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                placeholder={t("clientEditModal.placeholders.name")}
                required
                className="w-full border border-slate-200 rounded px-2 py-1.5 bg-slate-50 text-xs"
              />
            </div>

            {/* Email */}
            <div className="space-y-1">
              <label className="text-[10px] font-semibold uppercase tracking-wide text-slate-600">
                {t("clientEditModal.labels.email")} *
              </label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
                placeholder={t("clientEditModal.placeholders.email")}
                required
                className="w-full border border-slate-200 rounded px-2 py-1.5 bg-slate-50 text-xs"
              />
            </div>

            {/* Contact */}
            <div className="space-y-1">
              <label className="text-[10px] font-semibold uppercase tracking-wide text-slate-600">
                {t("clientEditModal.labels.contact")} *
              </label>
              <input
                type="text"
                value={formData.contactNumber}
                onChange={(e) =>
                  setFormData({ ...formData, contactNumber: e.target.value })
                }
                placeholder={t("clientEditModal.placeholders.contact")}
                required
                className="w-full border border-slate-200 rounded px-2 py-1.5 bg-slate-50 text-xs"
              />
            </div>

            {/* National ID */}
            <div className="space-y-1">
              <label className="text-[10px] font-semibold uppercase tracking-wide text-slate-600">
                {t("clientEditModal.labels.nationalId")}
              </label>
              <input
                type="text"
                value={formData.nationalId}
                onChange={(e) =>
                  setFormData({ ...formData, nationalId: e.target.value })
                }
                placeholder={t("clientEditModal.placeholders.nationalId")}
                className="w-full border border-slate-200 rounded px-2 py-1.5 bg-slate-50 text-xs"
              />
            </div>

            {/* Address */}
            <div className="space-y-1 sm:col-span-2">
              <label className="text-[10px] font-semibold uppercase tracking-wide text-slate-600">
                {t("clientEditModal.labels.address")}
              </label>
              <input
                type="text"
                value={formData.address}
                onChange={(e) =>
                  setFormData({ ...formData, address: e.target.value })
                }
                placeholder={t("clientEditModal.placeholders.address")}
                className="w-full border border-slate-200 rounded px-2 py-1.5 bg-slate-50 text-xs"
              />
            </div>

            {/* Additional Info */}
            <div className="space-y-1 sm:col-span-2">
              <label className="text-[10px] font-semibold uppercase tracking-wide text-slate-600">
                {t("clientEditModal.labels.additionalInfo")}
              </label>
              <textarea
                rows={2}
                value={formData.additionalInfo}
                onChange={(e) =>
                  setFormData({ ...formData, additionalInfo: e.target.value })
                }
                placeholder={t(
                  "clientEditModal.placeholders.additionalInfo"
                )}
                className="w-full border border-slate-200 rounded px-2 py-1.5 bg-slate-50 text-xs resize-y"
              />
            </div>
          </div>

          {/* Buttons */}
          <div className="flex justify-end gap-2 mt-4 pt-3 border-t border-slate-200">
            <button
              type="button"
              onClick={onClose}
              className="px-3 py-1.5 rounded border border-slate-300 text-xs text-slate-700 hover:bg-[#0B1F3B] hover:text-white transition"
            >
              {t("clientEditModal.buttons.cancel")}
            </button>

            <button
              type="submit"
              className="px-3 py-1.5 rounded bg-[#0B1F3B] text-white text-xs hover:bg-white hover:text-[#0B1F3B] hover:border-[#0B1F3B] border transition"
            >
              {isCreating
                ? t("clientEditModal.buttons.create")
                : t("clientEditModal.buttons.save")}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
