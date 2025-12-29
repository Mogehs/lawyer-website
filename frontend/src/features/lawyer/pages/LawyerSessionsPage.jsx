import { useState, useTransition, useMemo } from "react";
import { Calendar, Clock, MapPin, FileText, CheckCircle, XCircle, Upload } from "lucide-react";
import { toast } from "react-toastify";
import {
  useGetMyAssignedSessionsQuery,
  useCompleteSessionMutation,
  useUploadSessionMemorandumMutation,
} from "../api/lawyerApi";
import { useTranslation } from "react-i18next";
import i18n from "../../../i18n";

// Reusable file upload function
const uploadToCloudinary = async (file) => {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("upload_preset", "lawyer_memorandums");

  try {
    const response = await fetch(
      `https://api.cloudinary.com/v1_1/${import.meta.env.VITE_CLOUDINARY_CLOUD_NAME}/upload`,
      { method: "POST", body: formData }
    );
    const data = await response.json();
    return data.secure_url;
  } catch (error) {
    console.error("Cloudinary upload error:", error);
    throw new Error("Failed to upload file");
  }
};

const LawyerSessionsPage = () => {
  const { t } = useTranslation("lawyersession");
  const { data: sessionsData, isLoading, error, refetch } = useGetMyAssignedSessionsQuery();
  const [completeSession] = useCompleteSessionMutation();
  const [uploadMemorandum] = useUploadSessionMemorandumMutation();

  const [completingSession, setCompletingSession] = useState(null);
  const [uploadingForSession, setUploadingForSession] = useState(null);
  const [uploadingFile, setUploadingFile] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [completionData, setCompletionData] = useState({
    status: "COMPLETED",
    outcome: "",
    reasonForAdjournment: "",
    nextSessionDate: "",
  });
  const [memorandumData, setMemorandumData] = useState({
    content: "",
    fileUrl: "",
  });
  const [showDebug, setShowDebug] = useState(false);

  const sessions = useMemo(() => sessionsData?.data || [], [sessionsData]);
const isRTL = i18n.dir() === "rtl";
  // Handle file selection
  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    if (file) setSelectedFile(file);
  };

  // Complete session handler
  const handleCompleteSession = async (caseId, sessionId, session) => {
    if (!session.isReadyForSubmission) {
      toast.error(t("alerts.sessionNotReadyForSubmission"));
      return;
    }

    if (!completionData.outcome) {
      toast.error(t("alerts.missingOutcome"));
      return;
    }

    try {
      await completeSession({ caseId, sessionId, completionData }).unwrap();
      toast.success(t("alerts.sessionCompleted"));
      setCompletingSession(null);
      setCompletionData({
        status: "COMPLETED",
        outcome: "",
        reasonForAdjournment: "",
        nextSessionDate: "",
      });
    } catch (error) {
      toast.error(error?.data?.message || t("alerts.sessionCompletionError"));
    }
  };

  // Memorandum upload handler
  const handleUploadMemorandum = async (caseId, sessionId) => {
    if (!memorandumData.content && !selectedFile) {
      toast.error(t("alerts.memorandumContentError"));
      return;
    }

    try {
      setUploadingFile(true);
      let fileUrl = memorandumData.fileUrl;

      if (selectedFile) {
        fileUrl = await uploadToCloudinary(selectedFile);
      }

      await uploadMemorandum({
        caseId,
        sessionId,
        memorandumData: { content: memorandumData.content, fileUrl },
      }).unwrap();

      toast.success(t("alerts.uploadSuccess"));
      setUploadingForSession(null);
      setSelectedFile(null);
      setMemorandumData({ content: "", fileUrl: "" });
    } catch (error) {
      toast.error(error?.data?.message || t("alerts.uploadError"));
    } finally {
      setUploadingFile(false);
    }
  };

  // Render loading state
  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#A48C65]"></div>
      </div>
    );
  }

  // Render error state
  if (error) {
    return (
      <div className="text-center py-12">
        <p className="text-red-600 font-medium">{t("alerts.error")}</p>
        <p className="text-gray-500 text-sm mt-2">{error?.data?.message}</p>
      </div>
    );
  }

  // Render content
  return (
    <div  className={`space-y-6 ${isRTL ? "lg:mr-[220px]" : "lg:ml-[220px]"}`}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl text-[#0B1F3B] font-bold text-gray-900">{t("header.title")}</h1>
          <p className="text-gray-600 mt-1">{t("header.subtitle")}</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="px-4 py-2 bg-[#0B1F3B] text-white rounded-lg font-semibold">
            {sessions.length} {t("header.activeSessions")}
          </div>
        </div>
      </div>

      {/* Debug panel */}
      {showDebug && (
        <div className="bg-black/5 p-4 rounded text-sm">
          <pre className="max-h-64 overflow-auto text-xs">{JSON.stringify(sessionsData, null, 2)}</pre>
        </div>
      )}

      {/* Sessions List */}
      {sessions.length === 0 ? (
        <div className="bg-white rounded-lg shadow-md border border-gray-200 p-12 text-center">
          <Calendar size={64} className="mx-auto text-gray-400 mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">{t("alerts.noSessions")}</h3>
          <p className="text-gray-500">{t("alerts.noSessionsMessage")}</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6">
          {sessions.map(({ session, case: caseInfo }) => {
            const isAlreadyFinalized =
              session.status === "COMPLETED" ||
              session.status === "CANCELLED" ||
              !!session.completedAt;
            const canComplete = session.isReadyForSubmission && !isAlreadyFinalized;
            const canCancel = !isAlreadyFinalized;

            return (
              <div key={session._id} className="bg-white rounded-lg shadow-md border-2 border-gray-200 overflow-hidden">
                <div className="bg-[#0B1F3B] text-white px-6 py-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-lg font-bold">{t("sessionCard.sessionNumber")} #{session.sessionNumber}</h3>
                      <p className="text-sm text-white/90">{caseInfo.caseNumber}</p>
                    </div>
                    <span className="px-3 py-1 bg-white/20 rounded-full text-sm font-semibold">
                      {caseInfo.caseType}
                    </span>
                  </div>
                </div>

                <div className="p-6 space-y-4">
                  {/* Case & Client Info */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 bg-blue-50 rounded-lg">
                    <div>
                      <p className="text-xs font-medium text-gray-500 uppercase">{t("sessionCard.client")}</p>
                      <p className="text-sm font-semibold text-gray-900">{caseInfo.clientId?.name}</p>
                    </div>
                    <div>
                      <p className="text-xs font-medium text-gray-500 uppercase">{t("sessionCard.secretary")}</p>
                      <p className="text-sm font-semibold text-gray-900">{caseInfo.secretary?.name}</p>
                    </div>
                  </div>

                  {/* Session Details */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="flex items-center gap-2">
                      <Calendar size={16} className="text-[#0B1F3B]" />
                      <div>
                        <p className="text-xs text-gray-500">{t("sessionCard.date")}</p>
                        <p className="text-sm font-medium text-gray-900">
                          {new Date(session.sessionDate).toLocaleDateString("en-US", {
                            year: "numeric",
                            month: "long",
                            day: "numeric",
                          })}
                        </p>
                      </div>
                    </div>
                    {session.sessionTime && (
                      <div className="flex items-center gap-2">
                        <Clock size={16} className="text-[#0B1F3B]" />
                        <div>
                          <p className="text-xs text-gray-500">{t("sessionCard.time")}</p>
                          <p className="text-sm font-medium text-gray-900">{session.sessionTime}</p>
                        </div>
                      </div>
                    )}
                    {session.location && (
                      <div className="flex items-center gap-2">
                        <MapPin size={16} className="text-[#0B1F3B]" />
                        <div>
                          <p className="text-xs text-gray-500">{t("sessionCard.location")}</p>
                          <p className="text-sm font-medium text-gray-900">{session.location}</p>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Requirements */}
                  <div className="p-4 bg-[#0B1F3B]/5 rounded-lg">
                    <p className="text-sm font-semibold text-[#0B1F3B] mb-2">{t("sessionCard.requirements")}</p>
                    <div className="space-y-1">
                      {session.memorandumRequired && (
                        <p className="text-sm text-amber-800 flex items-center gap-2">
                          <FileText size={14} />
                          {t("sessionCard.memorandumRequired")}
                        </p>
                      )}
                      {session.supportingDocumentsRequired && (
                        <p className="text-sm text-amber-800 flex items-center gap-2">
                          <FileText size={14} />
                          {t("sessionCard.supportingDocumentsRequired")}
                        </p>
                      )}
                    </div>
                    {session.reviewNotes && (
                      <p className="text-xs text-amber-700 italic mt-2">{t("sessionCard.note")}: "{session.reviewNotes}"</p>
                    )}
                  </div>

                  {/* Memorandum Upload Section */}
                  {session.memorandumRequired && session.memorandum?.status === "PENDING" && (
                    <div className="border-t border-gray-200 pt-4">
                      {uploadingForSession === session._id ? (
                        <div className="space-y-4 p-4 bg-blue-50 rounded-lg">
                          <h4 className="font-semibold">{t("sessionCard.uploadMemorandum")}</h4>

                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">{t("sessionCard.memorandumContent")}</label>
                            <textarea
                              value={memorandumData.content}
                              onChange={(e) =>
                                setMemorandumData({
                                  ...memorandumData,
                                  content: e.target.value,
                                })
                              }
                              placeholder={t("sessionCard.enterMemorandumContent")}
                              rows="4"
                              className="w-full rounded-lg px-4 py-3 text-base border border-gray-300 bg-white focus:ring-2 focus:ring-[#A48C65] focus:border-transparent resize-y"
                            />
                          </div>

                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">{t("sessionCard.uploadMemorandumFile")}</label>
                            <div className="flex items-center gap-2">
                              <input
                                type="file"
                                accept=".pdf,.doc,.docx"
                                onChange={handleFileSelect}
                                className="block w-full text-sm text-gray-500
                                  file:mr-4 file:py-2 file:px-4
                                  file:rounded-lg file:border-0
                                  file:text-sm file:font-semibold
                                  file:bg-[#A48C65] file:text-white
                                  hover:file:bg-[#8B7355] file:cursor-pointer
                                  cursor-pointer"
                              />
                            </div>
                            {selectedFile && (
                              <p className="mt-2 text-sm text-green-600">
                                ✓ {t("sessionCard.selected")}: {selectedFile.name}
                              </p>
                            )}
                          </div>

                          <div className="flex gap-2">
                            <button
                              onClick={() => {
                                setUploadingForSession(null);
                                setSelectedFile(null);
                              }}
                              className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
                              disabled={uploadingFile}
                            >
                              {t("sessionCard.cancel")}
                            </button>
                            <button
                              onClick={() => handleUploadMemorandum(caseInfo._id, session._id)}
                              disabled={uploadingFile}
                              className="flex-1 px-4 py-2 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-lg hover:from-green-600 hover:to-green-700 transition-all shadow-md flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                              <Upload size={16} />
                              {uploadingFile ? t("sessionCard.uploading") : t("sessionCard.submitMemorandum")}
                            </button>
                          </div>
                        </div>
                      ) : (
                        <button
                          onClick={() => setUploadingForSession(session._id)}
                          className="w-full px-4 py-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg hover:from-blue-600 hover:to-blue-700 transition-all shadow-md flex items-center justify-center gap-2"
                        >
                          <Upload size={18} />
                          {t("sessionCard.uploadMemorandum")}
                        </button>
                      )}
                    </div>
                  )}

                  {/* Complete Session Section */}
                  <div className="border-t border-gray-200 pt-4">
                    {/* Warning if not ready for submission (director hasn't approved) */}
                    {!session.isReadyForSubmission && !isAlreadyFinalized && (
                      <div className="mb-4 p-3 bg-amber-50 border border-amber-300 rounded-lg">
                        <p className="text-sm font-semibold text-amber-800">{t("sessionCard.warningTitle")}</p>
                        <p className="text-xs text-amber-700 mt-1">
                          {session.memorandum?.status !== "APPROVED"
                            ? t("sessionCard.warningMessage1")
                            : t("sessionCard.warningMessage2")}
                        </p>
                      </div>
                    )}

                    {completingSession === session._id ? (
                      <div className="space-y-4 p-4 bg-green-50 rounded-lg">
                        <h4 className="font-semibold text-gray-900">{t("sessionCard.completeSession")}</h4>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">{t("sessionCard.status")} *</label>
                          <select
                            value={completionData.status}
                            onChange={(e) =>
                              setCompletionData({
                                ...completionData,
                                status: e.target.value,
                              })
                            }
                            className="w-full rounded-lg px-4 py-3 text-base border border-gray-300 bg-white focus:ring-2 focus:ring-[#A48C65] focus:border-transparent"
                          >
                            <option value="COMPLETED">{t("sessionCard.completed")}</option>
                            <option value="CANCELLED">{t("sessionCard.cancelled")}</option>
                          </select>
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">{t("sessionCard.outcome")} *</label>
                          <select
                            value={completionData.outcome}
                            onChange={(e) =>
                              setCompletionData({
                                ...completionData,
                                outcome: e.target.value,
                              })
                            }
                            className="w-full rounded-lg px-4 py-3 text-base border border-gray-300 bg-white focus:ring-2 focus:ring-[#A48C65] focus:border-transparent"
                          >
                            <option value="">{t("sessionCard.selectOutcome")}</option>
                            <option value="ADJOURNED">{t("sessionCard.adjourned")}</option>
                            <option value="FINALIZED">{t("sessionCard.finalized")}</option>
                            <option value="DISMISSED">{t("sessionCard.dismissed")}</option>
                            <option value="SETTLED">{t("sessionCard.settled")}</option>
                            <option value="WITHDRAWN">{t("sessionCard.withdrawn")}</option>
                          </select>
                        </div>

                        {completionData.outcome === "ADJOURNED" && (
                          <>
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-2">{t("sessionCard.reasonForAdjournment")}</label>
                              <textarea
                                value={completionData.reasonForAdjournment}
                                onChange={(e) =>
                                  setCompletionData({
                                    ...completionData,
                                    reasonForAdjournment: e.target.value,
                                  })
                                }
                                placeholder={t("sessionCard.reasonForAdjournment")}
                                rows="2"
                                className="w-full rounded-lg px-4 py-3 text-base border border-gray-300 bg-white focus:ring-2 focus:ring-[#A48C65] focus:border-transparent resize-y"
                              />
                            </div>

                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-2">{t("sessionCard.nextSessionDate")}</label>
                              <input
                                type="date"
                                value={completionData.nextSessionDate}
                                onChange={(e) =>
                                  setCompletionData({
                                    ...completionData,
                                    nextSessionDate: e.target.value,
                                  })
                                }
                                className="w-full rounded-lg px-4 py-3 text-base border border-gray-300 bg-white focus:ring-2 focus:ring-[#A48C65] focus:border-transparent"
                              />
                            </div>
                          </>
                        )}

                        <div className="flex gap-2">
                          <button
                            onClick={() => setCompletingSession(null)}
                            className="px-4 py-2 cursor-pointer bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
                          >
                            {t("sessionCard.cancel")}
                          </button>
                          <button
                            onClick={async () => {
                              await handleCompleteSession(caseInfo._id, session._id, session);
                              try {
                                refetch();
                              } catch (e) {}
                            }}
                            className="flex-1 px-4 py-2 cursor-pointer bg-gradient-to-r from-green-500 to-green-600 text-white rounded-lg hover:from-green-600 hover:to-green-700 transition-all shadow-md flex items-center justify-center gap-2"
                            disabled={!canComplete}
                          >
                            <CheckCircle size={16} />
                            {t("sessionCard.completeSessionButton")}
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div className="flex gap-2">
                        <button
                          onClick={() => setCompletingSession(session._id)}
                          disabled={!canComplete}
                          className={`flex-1 px-4 py-3 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-lg hover:from-green-600 hover:to-green-700 transition-all shadow-md flex items-center justify-center gap-2 ${!canComplete ? "opacity-50 cursor-not-allowed" : ""}`}
                          title={
                            !canComplete
                              ? isAlreadyFinalized
                                ? t("sessionCard.alreadyFinalized")
                                : t("sessionCard.mustBeApproved")
                              : t("sessionCard.completeSession")
                          }
                        >
                          <CheckCircle size={18} />
                          {t("sessionCard.completeSession")}
                        </button>
                        <button
                          onClick={() => {
                            setCompletingSession(session._id);
                            setCompletionData({
                              ...completionData,
                              status: "CANCELLED",
                            });
                          }}
                          className={`px-4 py-3 cursor-pointer bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors flex items-center gap-2 ${!canCancel ? "opacity-50 cursor-not-allowed" : ""}`}
                          disabled={!canCancel}
                        >
                          <XCircle size={18} />
                          {t("sessionCard.cancelSession")}
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default LawyerSessionsPage;
