import { useState } from "react";
import { Calendar, Clock, MapPin, FileText, CheckCircle, XCircle, Upload } from "lucide-react";
import { toast } from "react-toastify";
import {
  useGetMyAssignedSessionsQuery,
  useCompleteSessionMutation,
  useUploadSessionMemorandumMutation,
} from "../api/lawyerApi";

const LawyerSessionsPage = () => {
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

  const sessions = sessionsData?.data || [];

  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);
    }
  };

  const uploadToCloudinary = async (file) => {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", "lawyer_memorandums"); // You need to create this preset in Cloudinary

    try {
      const response = await fetch(
        `https://api.cloudinary.com/v1_1/${import.meta.env.VITE_CLOUDINARY_CLOUD_NAME}/upload`,
        {
          method: "POST",
          body: formData,
        }
      );
      const data = await response.json();
      return data.secure_url;
    } catch (error) {
      console.error("Cloudinary upload error:", error);
      throw new Error("Failed to upload file");
    }
  };

  const handleCompleteSession = async (caseId, sessionId, session) => {
    // Check if session is ready for submission (director approved)
    if (!session.isReadyForSubmission) {
      toast.error("Cannot complete session: Session must be approved by director first");
      return;
    }

    if (!completionData.outcome) {
      toast.error("Please provide session outcome");
      return;
    }

    try {
      await completeSession({
        caseId,
        sessionId,
        completionData,
      }).unwrap();

      toast.success("Session completed successfully!");
      setCompletingSession(null);
      setCompletionData({
        status: "COMPLETED",
        outcome: "",
        reasonForAdjournment: "",
        nextSessionDate: "",
      });
    } catch (error) {
      toast.error(error?.data?.message || "Failed to complete session");
    }
  };

  const handleUploadMemorandum = async (caseId, sessionId) => {
    if (!memorandumData.content && !selectedFile) {
      toast.error("Please provide memorandum content or upload a file");
      return;
    }

    try {
      setUploadingFile(true);
      let fileUrl = memorandumData.fileUrl;

      // Upload file to Cloudinary if selected
      if (selectedFile) {
        fileUrl = await uploadToCloudinary(selectedFile);
      }

      await uploadMemorandum({
        caseId,
        sessionId,
        memorandumData: {
          content: memorandumData.content,
          fileUrl,
        },
      }).unwrap();

      toast.success("Memorandum uploaded successfully!");
      setUploadingForSession(null);
      setSelectedFile(null);
      setMemorandumData({
        content: "",
        fileUrl: "",
      });
    } catch (error) {
      toast.error(error?.data?.message || "Failed to upload memorandum");
    } finally {
      setUploadingFile(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#A48C65]"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <p className="text-red-600 font-medium">Failed to load sessions</p>
        <p className="text-gray-500 text-sm mt-2">{error?.data?.message}</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 p-6 lg:ml-[220px]">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl text-[#0B1F3B] font-bold text-gray-900">My Assigned Sessions</h1>
          <p className="text-gray-600 mt-1">Sessions unlocked for you to work on</p>
        </div>
        <div className="flex items-center gap-3">
          {/* <button onClick={() => refetch()} className="px-3 py-2 bg-white border rounded">Refresh</button> */}
          {/* <button onClick={() => setShowDebug((s) => !s)} className="px-3 py-2 bg-white border rounded">{showDebug? 'Hide' : 'Show'} Debug</button> */}
          <div className="px-4 py-2 bg-[#0B1F3B] text-white rounded-lg font-semibold">
            {sessions.length} Active Session{sessions.length !== 1 ? "s" : ""}
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
          <h3 className="text-lg font-semibold text-gray-900 mb-2">No Active Sessions</h3>
          <p className="text-gray-500">
            You don't have any unlocked sessions at the moment.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6">
          {sessions.map(({ session, case: caseInfo }) => {
            // Compute whether the session can be completed or cancelled by this lawyer
            const isAlreadyFinalized = session.status === "COMPLETED" || session.status === "CANCELLED" || !!session.completedAt;
            const canComplete = session.isReadyForSubmission && !isAlreadyFinalized;
            const canCancel = !isAlreadyFinalized;

            return (
              <div
                key={session._id}
                className="bg-white rounded-lg shadow-md border-2 border-gray-200 overflow-hidden"
              >
                {/* Card Header */}
                <div className="bg-[#0B1F3B] text-white px-6 py-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-lg font-bold">Session #{session.sessionNumber}</h3>
                      <p className="text-sm text-white/90">{caseInfo.caseNumber}</p>
                    </div>
                    <span className="px-3 py-1 bg-white/20 rounded-full text-sm font-semibold">
                      {caseInfo.caseType}
                    </span>
                  </div>
                </div>

                {/* Card Body */}
                <div className="p-6 space-y-4">
                  {/* Case & Client Info */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 bg-blue-50 rounded-lg">
                    <div>
                      <p className="text-xs font-medium text-gray-500 uppercase">Client</p>
                      <p className="text-sm font-semibold text-gray-900">
                        {caseInfo.clientId?.name}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs font-medium text-gray-500 uppercase">Secretary</p>
                      <p className="text-sm font-semibold text-gray-900">
                        {caseInfo.secretary?.name}
                      </p>
                    </div>
                  </div>

                  {/* Session Details */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="flex items-center gap-2">
                      <Calendar size={16} className="text-[#0B1F3B]" />
                      <div>
                        <p className="text-xs text-gray-500">Date</p>
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
                          <p className="text-xs text-gray-500">Time</p>
                          <p className="text-sm font-medium text-gray-900">{session.sessionTime}</p>
                        </div>
                      </div>
                    )}
                    {session.location && (
                      <div className="flex items-center gap-2">
                        <MapPin size={16} className="text-[#0B1F3B]" />
                        <div>
                          <p className="text-xs text-gray-500">Location</p>
                          <p className="text-sm font-medium text-gray-900">{session.location}</p>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Requirements */}
                  <div className="p-4 bg-[#0B1F3B]/5  rounded-lg">
                    <p className="text-sm font-semibold text-[#0B1F3B] mb-2">
                      Requirements from Approving Lawyer:
                    </p>
                    <div className="space-y-1">
                      {session.memorandumRequired && (
                        <p className="text-sm text-amber-800 flex items-center gap-2">
                          <FileText size={14} />
                          Memorandum Required
                        </p>
                      )}
                      {session.supportingDocumentsRequired && (
                        <p className="text-sm text-amber-800 flex items-center gap-2">
                          <FileText size={14} />
                          Supporting Documents Required
                        </p>
                      )}
                    </div>
                    {session.reviewNotes && (
                      <p className="text-xs text-amber-700 italic mt-2">
                        Note: "{session.reviewNotes}"
                      </p>
                    )}
                  </div>

                  {/* Memorandum Upload Section */}
                  {session.memorandumRequired && session.memorandum?.status === "PENDING" && (
                    <div className="border-t border-gray-200 pt-4">
                      {uploadingForSession === session._id ? (
                        <div className="space-y-4 p-4 bg-blue-50 rounded-lg">
                          <h4 className="font-semibold ">Upload Memorandum</h4>

                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              Memorandum Content
                            </label>
                            <textarea
                              value={memorandumData.content}
                              onChange={(e) =>
                                setMemorandumData({
                                  ...memorandumData,
                                  content: e.target.value,
                                })
                              }
                              placeholder="Enter memorandum content..."
                              rows="4"
                              className="w-full rounded-lg px-4 py-3 text-base border border-gray-300 bg-white focus:ring-2 focus:ring-[#A48C65] focus:border-transparent resize-y"
                            />
                          </div>

                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              Upload Memorandum File
                            </label>
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
                                ✓ Selected: {selectedFile.name}
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
                              Cancel
                            </button>
                            <button
                              onClick={() => handleUploadMemorandum(caseInfo._id, session._id)}
                              disabled={uploadingFile}
                              className="flex-1 px-4 py-2 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-lg hover:from-green-600 hover:to-green-700 transition-all shadow-md flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                              <Upload size={16} />
                              {uploadingFile ? "Uploading..." : "Submit Memorandum"}
                            </button>
                          </div>
                        </div>
                      ) : (
                        <button
                          onClick={() => setUploadingForSession(session._id)}
                          className="w-full px-4 py-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg hover:from-blue-600 hover:to-blue-700 transition-all shadow-md flex items-center justify-center gap-2"
                        >
                          <Upload size={18} />
                          Upload Memorandum
                        </button>
                      )}
                    </div>
                  )}

                  {session.memorandum?.status === "SUBMITTED" && (
                    <div className="p-3 bg-blue-50 rounded-lg text-sm text-blue-800">
                      ⏳ Memorandum submitted - Awaiting approval from approving lawyer
                    </div>
                  )}

                  {/* Complete Session Section */}
                  <div className="border-t border-gray-200 pt-4">
                    {/* Warning if not ready for submission (director hasn't approved) */}
                    {!session.isReadyForSubmission && !isAlreadyFinalized && (
                      <div className="mb-4 p-3 bg-amber-50 border border-amber-300 rounded-lg">
                        <p className="text-sm font-semibold text-amber-800">
                          ⚠️ Cannot Complete Session Yet
                        </p>
                        <p className="text-xs text-amber-700 mt-1">
                          {session.memorandum?.status !== "APPROVED"
                            ? "Memorandum must be approved by the approving lawyer first."
                            : "Session must be reviewed and approved by the director before you can complete it."}
                        </p>
                      </div>
                    )}

                    {completingSession === session._id ? (
                      <div className="space-y-4 p-4 bg-green-50 rounded-lg">
                        <h4 className="font-semibold text-gray-900">Complete Session</h4>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Status <span className="text-red-500">*</span>
                          </label>
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
                            <option value="COMPLETED">Completed</option>
                            <option value="CANCELLED">Cancelled</option>
                          </select>
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Outcome <span className="text-red-500">*</span>
                          </label>
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
                            <option value="">Select Outcome</option>
                            <option value="ADJOURNED">Adjourned</option>
                            <option value="FINALIZED">Finalized</option>
                            <option value="DISMISSED">Dismissed</option>
                            <option value="SETTLED">Settled</option>
                            <option value="WITHDRAWN">Withdrawn</option>
                          </select>
                        </div>

                        {completionData.outcome === "ADJOURNED" && (
                          <>
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-2">
                                Reason for Adjournment
                              </label>
                              <textarea
                                value={completionData.reasonForAdjournment}
                                onChange={(e) =>
                                  setCompletionData({
                                    ...completionData,
                                    reasonForAdjournment: e.target.value,
                                  })
                                }
                                placeholder="e.g., Judge requested additional documents"
                                rows="2"
                                className="w-full rounded-lg px-4 py-3 text-base border border-gray-300 bg-white focus:ring-2 focus:ring-[#A48C65] focus:border-transparent resize-y"
                              />
                            </div>

                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-2">
                                Next Session Date
                              </label>
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
                            Cancel
                          </button>
                          <button
                            onClick={async () => {
                              await handleCompleteSession(caseInfo._id, session._id, session);
                              // refresh list after completion
                              try { refetch(); } catch (e) {}
                            }}
                            className="flex-1 px-4 py-2 cursor-pointer bg-gradient-to-r from-green-500 to-green-600 text-white rounded-lg hover:from-green-600 hover:to-green-700 transition-all shadow-md flex items-center justify-center gap-2"
                            disabled={!canComplete}
                          >
                            <CheckCircle size={16} />
                            {uploadingFile ? "Uploading..." : "Mark as Completed"}
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div className="flex gap-2">
                        <button
                          onClick={() => setCompletingSession(session._id)}
                          disabled={!canComplete}
                          className={`flex-1 px-4 py-3 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-lg hover:from-green-600 hover:to-green-700 transition-all shadow-md flex items-center justify-center gap-2 ${!canComplete ? 'opacity-50 cursor-not-allowed' : ''}`}
                          title={
                            !canComplete
                              ? isAlreadyFinalized
                                ? 'Session already finalized'
                                : 'Session must be approved by director first'
                              : 'Complete this session'
                          }
                        >
                          <CheckCircle size={18} />
                          Complete Session
                        </button>
                        <button
                          onClick={() => {
                            setCompletingSession(session._id);
                            setCompletionData({
                              ...completionData,
                              status: "CANCELLED",
                            });
                          }}
                          className={`px-4 py-3 cursor-pointer bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors flex items-center gap-2 ${!canCancel ? 'opacity-50 cursor-not-allowed' : ''}`}
                          disabled={!canCancel}
                        >
                          <XCircle size={18} />
                          Cancel Session
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

