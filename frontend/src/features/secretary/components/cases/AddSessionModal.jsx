import { X, Calendar, Clock, MapPin, Plus } from "lucide-react";
import { useState } from "react";
import { toast } from "react-toastify";
import {
  useCreateSessionMutation,
  useGetSessionsQuery,
  useDeleteSessionMutation,
} from "../../api/secretaryApi";

const AddSessionModal = ({ isOpen, onClose, caseId }) => {
  const [sessionData, setSessionData] = useState({
    sessionDate: "",
    sessionTime: "",
    location: "",
    notes: "",
  });

  const [createSession, { isLoading: creating }] = useCreateSessionMutation();
  const { data: sessionsData, isLoading: loadingSessions } = useGetSessionsQuery(caseId, {
    skip: !isOpen,
  });
  const [deleteSession] = useDeleteSessionMutation();

  const sessions = sessionsData?.data || [];

  // Check if there's a pending session (not completed or cancelled)
  const hasPendingSession = sessions.some(
    (session) => session.status !== "COMPLETED" && session.status !== "CANCELLED"
  );
  const lastSession = sessions.length > 0 ? sessions[sessions.length - 1] : null;

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!sessionData.sessionDate) {
      toast.error("Please select a session date");
      return;
    }

    try {
      await createSession({
        caseId,
        sessionData,
      }).unwrap();

      toast.success("Session created successfully!");
      setSessionData({
        sessionDate: "",
        sessionTime: "",
        location: "",
        notes: "",
      });
    } catch (error) {
      toast.error(error?.data?.message || "Failed to create session");
    }
  };

  const handleDelete = async (sessionId) => {
    if (!window.confirm("Are you sure you want to delete this session?")) {
      return;
    }

    try {
      await deleteSession({ caseId, sessionId }).unwrap();
      toast.success("Session deleted successfully!");
    } catch (error) {
      toast.error(error?.data?.message || "Failed to delete session");
    }
  };

  const getStatusBadge = (session) => {
    if (session.status === "COMPLETED") {
      return (
        <span className="px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-700">
          ✓ Completed
        </span>
      );
    }
    if (session.status === "CANCELLED") {
      return (
        <span className="px-2 py-1 text-xs font-semibold rounded-full bg-red-100 text-red-700">
          ✗ Cancelled
        </span>
      );
    }
    if (session.memorandum?.status === "APPROVED") {
      return (
        <span className="px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-700">
          ✓ Memo Approved
        </span>
      );
    }
    if (session.memorandum?.status === "SUBMITTED") {
      return (
        <span className="px-2 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-700">
          ⏳ Under Review
        </span>
      );
    }
    if (!session.isLocked) {
      return (
        <span className="px-2 py-1 text-xs font-semibold rounded-full bg-amber-100 text-amber-700">
          🔓 In Progress
        </span>
      );
    }
    return (
      <span className="px-2 py-1 text-xs font-semibold rounded-full bg-gray-100 text-gray-700">
        🔒 Pending Review
      </span>
    );
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div className="relative bg-white w-full max-w-4xl max-h-[90vh] overflow-hidden rounded-xl shadow-2xl">
        {/* Header */}
        <div className="bg-gradient-to-r from-[#BCB083] to-[#A48C65] text-white px-6 py-4 flex justify-between items-center">
          <h2 className="text-xl font-bold">Session Management</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-white/20 rounded-lg transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        <div className="p-6 overflow-y-auto max-h-[calc(90vh-180px)]">
          {/* Create Session Form */}
          <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg p-6 mb-6 border-2 border-[#A48C65]">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <Plus size={20} className="text-[#A48C65]" />
              Create New Session
            </h3>

            {hasPendingSession && (
              <div className="mb-4 p-4 bg-amber-50 border-2 border-amber-400 rounded-lg">
                <p className="text-sm font-semibold text-amber-800 mb-1">
                  ⚠️ Cannot Create New Session
                </p>
                <p className="text-sm text-amber-700">
                  Session #{lastSession?.sessionNumber} is still pending. The assigned lawyer must
                  complete or cancel it before you can create a new session.
                </p>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Session Date */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <Calendar size={16} className="inline mr-2" />
                    Session Date <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="date"
                    value={sessionData.sessionDate}
                    onChange={(e) =>
                      setSessionData({ ...sessionData, sessionDate: e.target.value })
                    }
                    className="w-full rounded-lg px-4 py-3 text-base border border-gray-300 bg-white focus:ring-2 focus:ring-[#A48C65] focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed"
                    required
                    disabled={hasPendingSession}
                  />
                </div>

                {/* Session Time */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <Clock size={16} className="inline mr-2" />
                    Session Time
                  </label>
                  <input
                    type="time"
                    value={sessionData.sessionTime}
                    onChange={(e) =>
                      setSessionData({ ...sessionData, sessionTime: e.target.value })
                    }
                    className="w-full rounded-lg px-4 py-3 text-base border border-gray-300 bg-white focus:ring-2 focus:ring-[#A48C65] focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed"
                    disabled={hasPendingSession}
                  />
                </div>
              </div>

              {/* Location */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <MapPin size={16} className="inline mr-2" />
                  Location
                </label>
                <input
                  type="text"
                  value={sessionData.location}
                  onChange={(e) =>
                    setSessionData({ ...sessionData, location: e.target.value })
                  }
                  placeholder="e.g., Court Room 3, District Court"
                  className="w-full rounded-lg px-4 py-3 text-base border border-gray-300 bg-white focus:ring-2 focus:ring-[#A48C65] focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed"
                  disabled={hasPendingSession}
                />
              </div>

              {/* Notes */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Notes
                </label>
                <textarea
                  value={sessionData.notes}
                  onChange={(e) =>
                    setSessionData({ ...sessionData, notes: e.target.value })
                  }
                  placeholder="Additional notes about this session..."
                  rows="3"
                  className="w-full rounded-lg px-4 py-3 text-base border border-gray-300 bg-white focus:ring-2 focus:ring-[#A48C65] focus:border-transparent resize-y disabled:bg-gray-100 disabled:cursor-not-allowed"
                  disabled={hasPendingSession}
                />
              </div>

              <button
                type="submit"
                disabled={creating || hasPendingSession}
                className="w-full py-3 bg-gradient-to-r from-[#BCB083] to-[#A48C65] text-white rounded-lg font-semibold hover:from-[#A48C65] hover:to-[#8B7355] transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-md"
              >
                {creating ? "Creating..." : hasPendingSession ? "Previous Session Must Be Completed" : "Create Session"}
              </button>
            </form>
          </div>

          {/* Existing Sessions */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Existing Sessions ({sessions.length})
            </h3>

            {loadingSessions ? (
              <div className="text-center py-8">
                <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-[#A48C65]"></div>
                <p className="mt-2 text-gray-600">Loading sessions...</p>
              </div>
            ) : sessions.length === 0 ? (
              <div className="text-center py-8 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
                <Calendar size={48} className="mx-auto text-gray-400 mb-2" />
                <p className="text-gray-500">No sessions created yet</p>
              </div>
            ) : (
              <div className="space-y-3">
                {sessions.map((session) => (
                  <div
                    key={session._id}
                    className="bg-white border-2 border-gray-200 rounded-lg p-4 hover:border-[#A48C65] transition-all"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h4 className="text-lg font-bold text-gray-900">
                            Session #{session.sessionNumber}
                          </h4>
                          {getStatusBadge(session)}
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm text-gray-600">
                          <div className="flex items-center gap-2">
                            <Calendar size={14} className="text-[#A48C65]" />
                            <span>
                              {new Date(session.sessionDate).toLocaleDateString("en-US", {
                                year: "numeric",
                                month: "long",
                                day: "numeric",
                              })}
                            </span>
                          </div>
                          {session.sessionTime && (
                            <div className="flex items-center gap-2">
                              <Clock size={14} className="text-[#A48C65]" />
                              <span>{session.sessionTime}</span>
                            </div>
                          )}
                          {session.location && (
                            <div className="flex items-center gap-2">
                              <MapPin size={14} className="text-[#A48C65]" />
                              <span>{session.location}</span>
                            </div>
                          )}
                        </div>

                        {session.notes && (
                          <p className="mt-2 text-sm text-gray-600 italic">
                            "{session.notes}"
                          </p>
                        )}

                        {session.reviewedBy && (
                          <div className="mt-3 p-2 bg-blue-50 rounded text-xs text-blue-800">
                            ✓ Reviewed by approving lawyer
                            {session.memorandumRequired && " • Memorandum required"}
                          </div>
                        )}

                        {session.outcome && (
                          <div className="mt-3 p-3 bg-purple-50 rounded-lg border border-purple-200">
                            <p className="text-sm font-semibold text-purple-900 mb-1">
                              Session Outcome: {session.outcome}
                            </p>
                            {session.reasonForAdjournment && (
                              <p className="text-xs text-purple-700 mb-1">
                                Reason: {session.reasonForAdjournment}
                              </p>
                            )}
                            {session.nextSessionDate && (
                              <p className="text-xs text-purple-700">
                                Next Session: {new Date(session.nextSessionDate).toLocaleDateString("en-US", {
                                  year: "numeric",
                                  month: "long",
                                  day: "numeric",
                                })}
                              </p>
                            )}
                          </div>
                        )}
                      </div>

                      <button
                        onClick={() => handleDelete(session._id)}
                        disabled={session.status !== "UPCOMING"}
                        className="ml-4 px-3 py-1.5 bg-red-500 text-white text-sm rounded-lg hover:bg-red-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        title={session.status !== "UPCOMING" ? "Cannot delete completed/cancelled sessions" : "Delete session"}
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="border-t border-gray-200 bg-white px-6 py-4">
          <button
            onClick={onClose}
            className="w-full py-2.5 border-2 border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 font-medium transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddSessionModal;

