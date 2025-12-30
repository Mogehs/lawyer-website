import { X, Download, FileText, User, Phone, Briefcase, Scale, Calendar, Lock, Unlock } from "lucide-react";
import { useState } from "react";
import { useReviewSessionMutation, useReviewMemorandumMutation } from "../../api/approvedLawyerApi";
import { toast } from "react-toastify";
import { useTranslation } from "react-i18next"; // Import the translation hook

export default function ApprovedLawyerViewModal({
  selectedCase,
  closeModal,
  openModificationModal,
}) {
  const { t } = useTranslation("appmodel"); // Initialize translation hook
  const [reviewSession] = useReviewSessionMutation();
  const [reviewMemorandum] = useReviewMemorandumMutation();
  const [reviewingSession, setReviewingSession] = useState(null);
  const [sessionReview, setSessionReview] = useState({
    memorandumRequired: false,
    supportingDocumentsRequired: false,
    reviewNotes: "",
  });
  const [memoReviewing, setMemoReviewing] = useState(null);
  const [memoFeedback, setMemoFeedback] = useState("");

  if (!selectedCase) return null;

  // Get the actual stage from the case stages array
  const currentStageData = selectedCase.stages && selectedCase.stages.length > 0
    ? selectedCase.stages[selectedCase.currentStage || 0]
    : null;

  const currentStageName = currentStageData?.stageType || "Main";

  const sessions = selectedCase.sessions || [];

  const handleReviewSession = async (sessionId) => {
    if (!sessionReview.memorandumRequired && !sessionReview.supportingDocumentsRequired) {
      toast.error(t("toast.errorReviewSession"));
      return;
    }

    try {
      await reviewSession({
        caseId: selectedCase._id,
        sessionId,
        reviewData: sessionReview,
      }).unwrap();

      toast.success(t("toast.successReviewSession"));
      setReviewingSession(null);
      setSessionReview({
        memorandumRequired: false,
        supportingDocumentsRequired: false,
        reviewNotes: "",
      });
    } catch (error) {
      toast.error(error?.data?.message || t("toast.error"));
    }
  };

  const handleReviewMemorandum = async (sessionId, action) => {
    // action: 'APPROVED' or 'REJECTED'
    if (action === 'REJECTED' && memoFeedback.trim() === '') {
      toast.error(t('toast.errorReviewMemorandum'));
      return;
    }

    try {
      await reviewMemorandum({
        caseId: selectedCase._id,
        sessionId,
        reviewData: {
          status: action,
          feedback: memoFeedback,
        },
      }).unwrap();

      toast.success(`${t("toast.successReviewMemorandum")} ${action.toLowerCase()}`);
      setMemoReviewing(null);
      setMemoFeedback("");
      // Close modal to refresh list or caller can refetch
      closeModal();
    } catch (error) {
      toast.error(error?.data?.message || t('toast.errorMemoReview'));
    }
  };

  const getSessionStatusBadge = (session) => {
    if (session.memorandum?.status === "APPROVED") {
      return (
        <span className="px-3 py-1 text-sm font-semibold rounded-full bg-green-100 text-green-700">
          ✓ {t("sessionStatus.approved")}
        </span>
      );
    }
    if (session.memorandum?.status === "SUBMITTED") {
      return (
        <span className="px-3 py-1 text-sm font-semibold rounded-full bg-blue-100 text-blue-700">
          ⏳ {t("sessionStatus.pendingReview")}
        </span>
      );
    }
    if (!session.isLocked) {
      return (
        <span className="px-3 py-1 text-sm font-semibold rounded-full bg-amber-100 text-amber-700 flex items-center gap-1">
          <Unlock size={14} />
          {t("sessionStatus.inProgress")}
        </span>
      );
    }
    return (
      <span className="px-3 py-1 text-sm font-semibold rounded-full bg-gray-100 text-gray-700 flex items-center gap-1">
        <Lock size={14} />
        {t("sessionStatus.locked")}
      </span>
    );
  };

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={closeModal}
      ></div>

      {/* Modal */}
      <div
        className="relative bg-white w-full max-w-5xl max-h-[95vh] overflow-hidden rounded-xl shadow-2xl z-10 flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="bg-[#0B1F3B] text-white px-6 py-5 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-white/20 rounded-lg">
              <Scale size={24} />
            </div>
            <div>
              <h2 className="text-xl font-bold">{selectedCase.caseType} {t('modal.caseType')}</h2>
              <p className="text-sm text-white/90 flex  items-center gap-2 mt-1">
                <FileText size={14} />
                {selectedCase.caseNumber} {t('modal.caseNumber')}
              </p>
            </div>
          </div>
          <button
            onClick={closeModal}
            className="p-2 hover:bg-white/20 cursor-pointer rounded-lg transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Content - Scrollable */}
        <div className="flex-1 overflow-y-auto">
          {/* Client Information Card */}
          <div className="p-6 bg-gradient-to-br from-blue-50 to-indigo-50 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <User size={20} className="text-[#0B1F3B]" />
              {t("modal.clientInformation")}
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <div className="bg-white rounded-lg p-4 shadow-sm">
                <p className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-1">{t("modal.clientName")}</p>
                <p className="text-sm font-semibold text-gray-900">{selectedCase.clientId?.name || 'N/A'}</p>
              </div>
              <div className="bg-white rounded-lg p-4 shadow-sm">
                <p className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-1">{t("modal.contactNumber")}</p>
                <p className="text-sm font-semibold text-gray-900 flex items-center gap-1">
                  <Phone size={14} />
                  {selectedCase.clientId?.contactNumber || 'N/A'}
                </p>
              </div>
              <div className="bg-white rounded-lg p-4 shadow-sm">
                <p className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-1">{t("modal.email")}</p>
                <p className="text-sm font-semibold text-gray-900">{selectedCase.clientId?.email || 'N/A'}</p>
              </div>
            </div>
          </div>

          {/* Case Team Card */}
          <div className="p-6 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <Briefcase size={20} className="text-[#0B1F3B]" />
              {t("modal.caseTeam")}
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-center gap-3 bg-purple-50 rounded-lg p-4">
                <div className="h-12 w-12 bg-purple-200 rounded-full flex items-center justify-center shrink-0">
                  <span className="text-lg font-bold text-purple-700">
                    {selectedCase.secretary?.name?.charAt(0) || 'S'}
                  </span>
                </div>
                <div>
                  <p className="text-xs font-medium text-gray-500 uppercase tracking-wider">{t("modal.secretary")}</p>
                  <p className="text-sm font-semibold text-gray-900">{selectedCase.secretary?.name || 'N/A'}</p>
                  <p className="text-xs text-gray-600">{selectedCase.secretary?.email || ''}</p>
                </div>
              </div>
              <div className="flex items-center gap-3 bg-indigo-50 rounded-lg p-4">
                <div className="h-12 w-12 bg-indigo-200 rounded-full flex items-center justify-center shrink-0">
                  <span className="text-lg font-bold text-indigo-700">
                    {selectedCase.assignedLawyer?.name?.charAt(0) || 'L'}
                  </span>
                </div>
                <div>
                  <p className="text-xs font-medium text-gray-500 uppercase tracking-wider">{t("modal.draftLawyer")}</p>
                  <p className="text-sm font-semibold text-gray-900">{selectedCase.assignedLawyer?.name || 'Unassigned'}</p>
                  <p className="text-xs text-gray-600">{selectedCase.assignedLawyer?.email || ''}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Current Stage */}
          <div className="p-6 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">{t("modal.currentStage")}</h3>
            <div className="flex items-center gap-3">
              <div className="px-4 py-2 bg-[#0B1F3B] text-white rounded-lg font-semibold shadow-md">
                {currentStageName}
              </div>
              <span className="text-sm text-gray-600">
                {t("modal.status")}: <span className="font-medium text-gray-900">{selectedCase.status}</span>
              </span>
            </div>
          </div>

          {/* Sessions Section */}
          <div className="p-6 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <Calendar size={20} className="text-[#0B1F3B]" />
              {t("modal.courtSessions")} ({sessions.length})
            </h3>

            {sessions.length === 0 ? (
              <div className="text-center py-8 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
                <Calendar size={48} className="mx-auto text-gray-400 mb-2" />
                <p className="text-gray-500">{t("modal.noDocumentsUploaded")}</p>
              </div>
            ) : (
              <div className="space-y-4">
                {sessions.map((session) => (
                  <div
                    key={session._id}
                    className="bg-gradient-to-br from-gray-50 to-white border-2 border-gray-200 rounded-lg p-4"
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <h4 className="text-base font-bold text-gray-900">
                          {t("modal.sessionNumber")} #{session.sessionNumber}
                        </h4>
                        {getSessionStatusBadge(session)}
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm text-gray-600 mb-3">
                      <div className="flex items-center gap-2">
                        <Calendar size={14} className="text-[#0B153B]" />
                        <span>
                          {new Date(session.sessionDate).toLocaleDateString("en-US", {
                            year: "numeric",
                            month: "long",
                            day: "numeric",
                          })}
                        </span>
                      </div>
                      {session.location && (
                        <div className="flex items-center gap-2">
                          <span className="font-medium">{t("modal.location")}:</span>
                          <span>{session.location}</span>
                        </div>
                      )}
                    </div>

                    {session.notes && (
                      <p className="text-sm text-gray-600 italic mb-3">"{session.notes}"</p>
                    )}

                    {/* Show review form if session is locked and not reviewed */}
                    {session.isLocked && !session.reviewedBy && (
                      <div className="mt-3 pt-3 border-t border-gray-200">
                        {reviewingSession === session._id ? (
                          <div className="bg-blue-50 rounded-lg p-4 space-y-3">
                            <h5 className="font-semibold text-gray-900 text-sm">{t("modal.reviewSession")}</h5>

                            <div className="space-y-2">
                              <label className="flex items-center gap-2 cursor-pointer">
                                <input
                                  type="checkbox"
                                  checked={sessionReview.memorandumRequired}
                                  onChange={(e) =>
                                    setSessionReview({
                                      ...sessionReview,
                                      memorandumRequired: e.target.checked,
                                    })
                                  }
                                  className="w-4 h-4 text-[#A48C65] rounded focus:ring-2 focus:ring-[#A48C65]"
                                />
                                <span className="text-sm font-medium text-gray-700">
                                  {t("modal.memorandumRequired")}
                                </span>
                              </label>

                              <label className="flex items-center gap-2 cursor-pointer">
                                <input
                                  type="checkbox"
                                  checked={sessionReview.supportingDocumentsRequired}
                                  onChange={(e) =>
                                    setSessionReview({
                                      ...sessionReview,
                                      supportingDocumentsRequired: e.target.checked,
                                    })
                                  }
                                  className="w-4 h-4 text-[#A48C65] rounded focus:ring-2 focus:ring-[#A48C65]"
                                />
                                <span className="text-sm font-medium text-gray-700">
                                  {t("modal.supportingDocumentsRequired")}
                                </span>
                              </label>
                            </div>

                            <textarea
                              value={sessionReview.reviewNotes}
                              onChange={(e) =>
                                setSessionReview({
                                  ...sessionReview,
                                  reviewNotes: e.target.value,
                                })
                              }
                              placeholder={t("modal.reviewNotes")}
                              rows="2"
                              className="w-full rounded-lg px-3 py-2 text-sm border border-gray-300 focus:ring-2 focus:ring-[#A48C65] focus:border-transparent"
                            />

                            <div className="flex gap-2">
                              <button
                                onClick={() => setReviewingSession(null)}
                                className="px-4 py-2 cursor-pointer bg-gray-200 text-gray-700 text-sm rounded-lg hover:bg-gray-300 transition-colors"
                              >
                                {t("modal.cancel")}
                              </button>
                              <button
                                onClick={() => handleReviewSession(session._id)}
                                className="px-4 py-2 cursor-pointer bg-gradient-to-r from-green-500 to-green-600 text-white text-sm rounded-lg hover:from-green-600 hover:to-green-700 transition-all shadow-md"
                              >
                                <Unlock size={14} className="inline mr-1" />
                                {t("modal.approveUnlock")}
                              </button>
                            </div>
                          </div>
                        ) : (
                          <button
                            onClick={() => setReviewingSession(session._id)}
                            className="w-full px-4 py-2 bg-[#0B1538] text-white text-sm font-medium rounded-lg  transition-all shadow-md"
                          >
                            {t("modal.reviewSession")}
                          </button>
                        )}
                      </div>
                    )}

                    {/* Show review info if already reviewed */}
                    {session.reviewedBy && (
                      <div className="mt-3 p-3 bg-green-50 rounded-lg text-sm">
                        <p className="font-semibold text-green-800">✓ {t("sessionStatus.approved")}</p>
                        {session.memorandumRequired && (
                          <p className="text-green-700">• {t("modal.memorandumRequired")}</p>
                        )}
                        {session.supportingDocumentsRequired && (
                          <p className="text-green-700">• {t("modal.supportingDocumentsRequired")}</p>
                        )}
                        {session.reviewNotes && (
                          <p className="text-green-700 italic mt-1">"{session.reviewNotes}"</p>
                        )}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Documents Section */}
          <div className="p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <FileText size={20} className="text-[#0B1F3B]" />
              {t("modal.documents")}
            </h3>
            <div className="grid grid-cols-1  gap-4">
              {/* General Documents */}
              <div className="bg-gray-50 border w-full border-gray-200 rounded-lg p-4">
                <h4 className="font-semibold text-gray-900 mb-3 text-sm">{t("modal.generalDocuments")}</h4>
                {selectedCase.documents?.length > 0 ? (
                  <div className="space-y-2">
                    {selectedCase.documents.map((doc, i) => (
                      <a
                        key={i}
                        href={doc.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 px-3 py-2 bg-white border border-gray-200 rounded-lg hover:bg-gray-100 hover:border-[#A48C65] transition-all text-sm group"
                      >
                        <FileText size={16} className="text-gray-400 group-hover:text-[#A48C65]" />
                        <span className="flex-1 truncate text-gray-700">{doc.name}</span>
                        <Download size={14} className="text-gray-400 group-hover:text-[#A48C65]" />
                      </a>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-gray-500 italic">{t("modal.noDocumentsUploaded")}</p>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Footer - Sticky */}
        <div className="border-t border-gray-200 bg-white px-6 py-4 flex justify-between items-center gap-4">
          <button
            className="px-6 py-2.5 border-2 border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 cursor-pointer font-medium transition-colors"
            onClick={closeModal}
          >
            {t("modal.close")}
          </button>

          <div className="flex gap-3">
            {/* Approve Case button removed - approving lawyer approves sessions only */}
          </div>
        </div>
      </div>
    </div>
  );
}
