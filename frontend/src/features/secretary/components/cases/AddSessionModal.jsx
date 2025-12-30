import { X, Calendar, Clock, MapPin, Plus } from "lucide-react";
import { useState } from "react";
import { toast } from "react-toastify";
import { useTranslation } from "react-i18next";
import {
  useCreateSessionMutation,
  useGetSessionsQuery,
  useDeleteSessionMutation,
} from "../../api/secretaryApi";

const AddSessionModal = ({ isOpen, onClose, caseId }) => {
  const { t, i18n } = useTranslation("Sessionmange");

  const isRTL = i18n.language === "ar";

  const [sessionData, setSessionData] = useState({
    sessionDate: "",
    sessionTime: "",
    location: "",
    notes: "",
  });

  const [createSession, { isLoading: creating }] =
    useCreateSessionMutation();

  const { data: sessionsData, isLoading: loadingSessions } =
    useGetSessionsQuery(caseId, { skip: !isOpen });

  const [deleteSession] = useDeleteSessionMutation();

  const sessions = sessionsData?.data || [];

  const hasPendingSession = sessions.some(
    (s) => s.status !== "COMPLETED" && s.status !== "CANCELLED"
  );

  const lastSession =
    sessions.length > 0 ? sessions[sessions.length - 1] : null;

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!sessionData.sessionDate) {
      toast.error(t("selectSessionDate"));
      return;
    }

    try {
      await createSession({ caseId, sessionData }).unwrap();
      toast.success(t("sessionCreated"));
      setSessionData({
        sessionDate: "",
        sessionTime: "",
        location: "",
        notes: "",
      });
    } catch (error) {
      toast.error(error?.data?.message || t("createFailed"));
    }
  };

  const handleDelete = async (sessionId) => {
    if (!window.confirm(t("deleteConfirm"))) return;

    try {
      await deleteSession({ caseId, sessionId }).unwrap();
      toast.success(t("sessionDeleted"));
    } catch (error) {
      toast.error(error?.data?.message || t("deleteFailed"));
    }
  };

  const getStatusBadge = (session) => {
    const map = {
      COMPLETED: "completed",
      CANCELLED: "cancelled",
    };

    if (map[session.status]) {
      return (
        <span className="px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-700">
          {t(map[session.status])}
        </span>
      );
    }

    if (session.memorandum?.status === "APPROVED")
      return (
        <span className="px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-700">
          {t("memoApproved")}
        </span>
      );

    if (session.memorandum?.status === "SUBMITTED")
      return (
        <span className="px-2 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-700">
          {t("underReview")}
        </span>
      );

    if (!session.isLocked)
      return (
        <span className="px-2 py-1 text-xs font-semibold rounded-full bg-amber-100 text-amber-700">
          {t("inProgress")}
        </span>
      );

    return (
      <span className="px-2 py-1 text-xs font-semibold rounded-full bg-gray-100 text-gray-700">
        {t("pendingReview")}
      </span>
    );
  };

  if (!isOpen) return null;

  return (
    <div
      dir={isRTL ? "rtl" : "ltr"}
      className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/60 p-4"
    >
      <div className="bg-white w-full max-w-4xl rounded-xl shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="bg-[#0B1F3B] text-white px-6 py-4 flex justify-between">
          <h2 className="text-xl font-bold">
            {t("sessionManagement")}
          </h2>
          <button onClick={onClose}>
            <X />
          </button>
        </div>

        <div className="p-6 overflow-y-auto max-h-[70vh]">
          {/* Create Session */}
          <div className="border-2 border-[#0B1F3B] rounded-lg p-6 mb-6 bg-blue-50">
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <Plus /> {t("createNewSession")}
            </h3>

            {hasPendingSession && (
              <div className="mb-4 p-4 bg-amber-100 border border-amber-400 rounded">
                <strong>{t("cannotCreateSession")}</strong>
                <p className="text-sm">
                  {t("pendingSessionWarning", {
                    number: lastSession?.sessionNumber,
                  })}
                </p>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <input
                type="date"
                value={sessionData.sessionDate}
                onChange={(e) =>
                  setSessionData({
                    ...sessionData,
                    sessionDate: e.target.value,
                  })
                }
                disabled={hasPendingSession}
                className="w-full border rounded p-3"
              />

              <input
                type="time"
                value={sessionData.sessionTime}
                onChange={(e) =>
                  setSessionData({
                    ...sessionData,
                    sessionTime: e.target.value,
                  })
                }
                disabled={hasPendingSession}
                className="w-full border rounded p-3"
              />

              <input
                type="text"
                placeholder={t("locationPlaceholder")}
                value={sessionData.location}
                onChange={(e) =>
                  setSessionData({
                    ...sessionData,
                    location: e.target.value,
                  })
                }
                disabled={hasPendingSession}
                className="w-full border rounded p-3"
              />

              <textarea
                rows="3"
                placeholder={t("notesPlaceholder")}
                value={sessionData.notes}
                onChange={(e) =>
                  setSessionData({
                    ...sessionData,
                    notes: e.target.value,
                  })
                }
                disabled={hasPendingSession}
                className="w-full border rounded p-3"
              />

              <button
                disabled={creating || hasPendingSession}
                className="w-full bg-[#A48C65] text-white py-3 rounded"
              >
                {creating
                  ? t("creating")
                  : hasPendingSession
                  ? t("previousSessionMustComplete")
                  : t("createSession")}
              </button>
            </form>
          </div>

          {/* Sessions List */}
          <h3 className="font-bold mb-3">
            {t("existingSessions")} ({sessions.length})
          </h3>

          {loadingSessions ? (
            <p>{t("loadingSessions")}</p>
          ) : sessions.length === 0 ? (
            <p>{t("noSessions")}</p>
          ) : (
            sessions.map((session) => (
              <div
                key={session._id}
                className="border p-4 rounded mb-3"
              >
                <div className="flex justify-between">
                  <strong>
                    {t("sessionNumber", {
                      number: session.sessionNumber,
                    })}
                  </strong>
                  {getStatusBadge(session)}
                </div>

                <button
                  disabled={session.status !== "UPCOMING"}
                  onClick={() => handleDelete(session._id)}
                  className="mt-3 bg-red-500 text-white px-4 py-1 rounded disabled:opacity-50"
                >
                  {t("delete")}
                </button>
              </div>
            ))
          )}
        </div>

        <div className="p-4 border-t">
          <button
            onClick={onClose}
            className="w-full border py-2 rounded"
          >
            {t("close")}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddSessionModal;
