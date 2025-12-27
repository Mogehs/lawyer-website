import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Clock, User, FileText, Calendar, CheckCircle, X, Info } from "lucide-react";
import { useTranslation } from "react-i18next";
import i18n from "../../../../i18n/index"; // adjust path to your i18n

const CaseTimelineModal = ({ isOpen, onClose, caseData }) => {
  const { t } = useTranslation("caseTimeline");
  const isRTL = i18n.language === "ar";

  const [stages, setStages] = useState(caseData?.stages || []);

  useEffect(() => {
    if (caseData) setStages(caseData.stages || []);
  }, [caseData]);

  if (!isOpen || !caseData) return null;

  return (
    <div
      dir={isRTL ? "rtl" : "ltr"}
      className="fixed inset-0 bg-black/40 backdrop-blur-sm flex justify-center items-start z-[9999] pt-10 md:pt-20 px-4"
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.25, ease: "easeOut" }}
        className="relative bg-white text-gray-800 rounded-2xl shadow-2xl w-full max-w-4xl p-6 md:p-8 border border-[#0B1F3B]/20 overflow-y-auto max-h-[80vh]"
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h3 className="md:text-xl text-lg font-semibold flex items-center gap-2 text-gray-800">
            <Clock className="w-5 h-5 text-[#0B1F3B]" />
            <span className="text-[#0B1F3B]">{t("caseDetails")}</span> —{" "}
            <span className="text-[#0B1F3B] font-medium">{caseData.caseNumber}</span>
          </h3>
          <button
            onClick={onClose}
            className="w-9 h-9 flex cursor-pointer items-center justify-center rounded-full bg-white border border-[#0B1F3B] text-gray-800 hover:bg-[#0B1F3B] hover:text-white transition-all duration-200 shadow-md"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Case Summary */}
        <div className="mb-6 bg-white border border-gray-200 rounded-xl p-4 text-sm text-[#494C52] shadow-sm space-y-2">
          <p>
            <strong>{t("caseNumber")}:</strong> {caseData.caseNumber}
          </p>
          <p>
            <strong>{t("caseType")}:</strong> {caseData.caseType}
          </p>
          <p>
            <strong>{t("status")}:</strong> {caseData.status}
          </p>
          <p>
            <strong>{t("currentStage")}:</strong> {caseData.stage}
          </p>
          <p>
            <strong>{t("createdAt")}:</strong>{" "}
            {new Date(caseData.createdAt).toLocaleString()}
          </p>
          <p>
            <strong>{t("lastUpdated")}:</strong>{" "}
            {new Date(caseData.updatedAt).toLocaleString()}
          </p>
          <p>
            <strong>{t("caseDescription")}:</strong> {caseData.caseDescription || t("notAvailable")}
          </p>
        </div>

        {/* Client & Staff Info */}
        <div className="mb-6 grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm text-gray-800">
          <div className="p-4 bg-white border border-gray-200 rounded-xl shadow-sm space-y-1">
            <h4 className="font-semibold text-gray-800 flex items-center gap-1">
              <User className="w-4 h-4 text-[#0B1F3B]" /> {t("clientInfo")}
            </h4>
            <p><strong>{t("name")}:</strong> {caseData.clientId?.name}</p>
            <p><strong>{t("email")}:</strong> {caseData.clientId?.email}</p>
            <p><strong>{t("contact")}:</strong> {caseData.clientId?.contactNumber}</p>
          </div>
          <div className="p-4 bg-white border border-gray-200 rounded-xl shadow-sm space-y-1">
            <h4 className="font-semibold text-gray-800 flex items-center gap-1">
              <User className="w-4 h-4 text-[#0B1F3B]" /> {t("lawyerInfo")}
            </h4>
            <p><strong>{t("name")}:</strong> {caseData.assignedLawyer?.name}</p>
            <p><strong>{t("email")}:</strong> {caseData.assignedLawyer?.email}</p>
          </div>
          <div className="p-4 bg-white border border-gray-200 rounded-xl shadow-sm space-y-1">
            <h4 className="font-semibold text-gray-800 flex items-center gap-1">
              <User className="w-4 h-4 text-[#0B1F3B]" /> {t("secretaryInfo")}
            </h4>
            <p><strong>{t("name")}:</strong> {caseData.secretary?.name}</p>
            <p><strong>{t("email")}:</strong> {caseData.secretary?.email}</p>
          </div>
        </div>

        {/* Documents & Notes */}
        <div className="mb-6 grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm text-gray-800">
          <div className="p-4 bg-white border border-gray-200 rounded-xl shadow-sm">
            <h4 className="font-semibold flex items-center gap-1">
              <FileText className="w-4 h-4 text-[#0B1F3B]" /> {t("documents")} ({caseData.documents?.length || 0})
            </h4>
            <ul className="list-disc pl-5 mt-2">
              {caseData.documents?.map((doc, i) => (
                <li key={i}>{doc.name || `${t("document")} ${i + 1}`}</li>
              ))}
            </ul>
          </div>
          <div className="p-4 bg-white border border-gray-200 rounded-xl shadow-sm">
            <h4 className="font-semibold flex items-center gap-1">
              <Info className="w-4 h-4 text-[#0B1F3B]" /> {t("notes")} ({caseData.notes?.length || 0})
            </h4>
            <ul className="list-disc pl-5 mt-2">
              {caseData.notes?.map((note, i) => (
                <li key={i}>{note.content || `${t("note")} ${i + 1}`}</li>
              ))}
            </ul>
          </div>
        </div>

        {/* Timeline */}
        <div className="space-y-5 max-h-[40vh] overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-gray-200">
          {stages.map((stage, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.25 }}
              className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm"
            >
              <div className="flex items-center justify-between mb-3">
                <h4 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
                  <FileText className="w-4 h-4" />
                  {stage.title || `${t("stage")} ${i + 1}`}
                </h4>
                <span className="text-xs text-gray-500">
                  {t("status")}: <span className="text-gray-800 font-medium">{stage.status || t("notAvailable")}</span>
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 text-sm">
                <div className="flex items-center gap-2 text-gray-600">
                  <User className="w-4 h-4 text-[#0B1F3B]" />
                  {t("lawyer")}: <span className="text-gray-800 font-medium">{stage.lawyer || t("unassigned")}</span>
                </div>

                <div className="flex items-center gap-2 text-gray-600">
                  <Calendar className="w-4 h-4 text-[#0B1F3B]" />
                  {t("hearing")}:{' '}
                  <span className="text-gray-800 font-medium">{stage.hearingDate || t("notSet")}</span>
                </div>

                <div className="flex items-center gap-2 text-gray-600">
                  <FileText className="w-4 h-4 text-[#0B1F3B]" />
                  {t("documents")}: <span className="text-gray-800 font-medium">{stage.documentsCount || 0}</span>
                </div>
              </div>

              <div className="flex items-center gap-4 mt-4 text-sm">
                <div className="flex items-center gap-2 text-gray-600">
                  <CheckCircle className={`w-4 h-4 ${stage.approvedByRagab ? "text-green-500" : "text-gray-400"}`} />
                  {stage.approvedByRagab ? t("approvedByRagab") : t("awaitingRagabApproval")}
                </div>

                <div className="flex items-center gap-2 text-gray-800">
                  <CheckCircle className={`w-4 h-4 ${stage.directorSigned ? "text-green-600" : "text-gray-500"}`} />
                  {stage.directorSigned ? t("directorSigned") : t("pendingDirector")}
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Footer */}
        <div className="flex justify-end gap-3 mt-6">
          <button
            onClick={onClose}
            className="px-5 py-2.5 rounded-full bg-white border border-[#0B1F3B] text-gray-800 hover:bg-[#0B1F3B] hover:text-white transition-all duration-200"
          >
            {t("close")}
          </button>
        </div>
      </motion.div>
    </div>
  );
};

export default CaseTimelineModal;
