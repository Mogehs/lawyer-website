import React from "react";
import {
  X,
  FileText,
  Clock,
  CheckCircle,
  Shield,
  Download,
} from "lucide-react";

const ViewCaseModal = ({ viewModal, setViewModal }) => {
  if (!viewModal) return null;

  return (
    <div className="fixed inset-0 z-[10000] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div
        className="absolute inset-0"
        onClick={() => setViewModal(null)}
      ></div>

      <div className="relative bg-white w-full max-w-3xl max-h-[90vh] overflow-y-auto rounded-lg shadow-lg flex flex-col">
        {/* Header */}
        <div className="sticky top-0 bg-slate-800 text-white px-4 py-3 flex justify-between items-center border-b border-slate-700 rounded-t-lg">
          <div className="flex items-center gap-2">
            <FileText size={16} />
            <div>
              <h2 className="text-sm font-semibold">
                {viewModal.clientId?.name || "Unknown Client"}
              </h2>
              <p className="text-[10px] text-slate-300">
                {viewModal.clientId?.contactNumber || "N/A"} |{" "}
                {viewModal.caseType || "N/A"}
              </p>
            </div>
          </div>

          <button
            onClick={() => setViewModal(null)}
            className="p-1 hover:bg-slate-700 rounded transition"
          >
            <X size={16} />
          </button>
        </div>

        {/* Case Details */}
        <div className="p-3 bg-slate-50 border-b border-slate-200">
          <h3 className="text-xs font-semibold text-slate-800 mb-2">
            Case Details
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[10px] text-slate-700">
            <p>
              <strong>Archive ID:</strong> {viewModal._id?.slice(-6) || "N/A"}
            </p>
            <p>
              <strong>Case Number:</strong> {viewModal.caseNumber || "N/A"}
            </p>

            <p>
              <strong>Client Name:</strong> {viewModal.clientId?.name || "N/A"}
            </p>
            <p>
              <strong>Phone:</strong>{" "}
              {viewModal.clientId?.contactNumber || "N/A"}
            </p>

            <p>
              <strong>Email:</strong> {viewModal.clientId?.email || "N/A"}
            </p>
            <p>
              <strong>National ID:</strong>{" "}
              {viewModal.clientId?.nationalId || "N/A"}
            </p>

            <p>
              <strong>Address:</strong> {viewModal.clientId?.address || "N/A"}
            </p>
            <p>
              <strong>Additional Info:</strong>{" "}
              {viewModal.clientId?.additionalInfo || "N/A"}
            </p>

            <p>
              <strong>Case Type:</strong> {viewModal.caseType || "N/A"}
            </p>
            <p>
              <strong>Lawyer:</strong>{" "}
              {viewModal.assignedLawyer?.name || "Unassigned"}
            </p>

            <p>
              <strong>Archived Date:</strong>{" "}
              {viewModal.archivedAt
                ? new Date(viewModal.archivedAt).toLocaleDateString()
                : "N/A"}
            </p>
          </div>
        </div>

        {/* Stages */}
        <div className="p-3 space-y-3">
          {(viewModal.stages || []).map((stage, sIdx) => (
            <div
              key={sIdx}
              className="bg-white border border-slate-200 rounded p-3 shadow-sm"
            >
              <div className="flex justify-between items-start gap-2 mb-2">
                <div className="flex-1">
                  <h3 className="text-xs font-semibold text-slate-800">
                    Stage {sIdx + 1}: {stage.stage || "Unnamed Stage"}
                  </h3>

                  <div className="flex items-center gap-1 text-[10px] text-slate-600 mt-0.5">
                    <Clock size={10} />
                    <span>Date: {stage.hearingDate || "N/A"}</span>
                  </div>
                </div>

                {/* Status Badges */}
                <div className="flex flex-wrap gap-1">
                  <span
                    className={`px-1.5 py-0.5 rounded text-[10px] font-medium flex items-center gap-0.5 ${
                      stage.memorandums?.every((m) => m.approved)
                        ? "bg-green-50 text-green-700 border border-green-200"
                        : "bg-yellow-50 text-yellow-700 border border-yellow-200"
                    }`}
                  >
                    {stage.memorandums?.every((m) => m.approved) ? (
                      <CheckCircle size={10} />
                    ) : (
                      <Clock size={10} />
                    )}
                    {stage.memorandums?.every((m) => m.approved)
                      ? "Approved"
                      : "Pending"}
                  </span>

                  <span className="px-1.5 py-0.5 rounded text-[10px] font-medium flex items-center gap-0.5 bg-blue-50 text-blue-700 border border-blue-200">
                    <Shield size={10} /> Signed
                  </span>
                </div>
              </div>

              {/* Memorandums */}
              {stage.memorandums?.length > 0 && (
                <div className="mb-2 space-y-1">
                  <p className="text-[10px] font-medium text-slate-600">
                    Memorandums:
                  </p>
                  {stage.memorandums.map((m, i) => (
                    <div
                      key={i}
                      className="p-2 bg-slate-50 border border-slate-200 rounded flex justify-between items-center"
                    >
                      <span className="text-xs text-slate-800 truncate flex-1">
                        {m.name || "Unnamed Memo"}
                      </span>
                      <a
                        href={m.downloadLink || "#"}
                        className="p-1 text-slate-600 hover:text-blue-600 hover:bg-blue-50 rounded transition-colors"
                      >
                        <Download size={12} />
                      </a>
                    </div>
                  ))}
                </div>
              )}

              {/* Documents */}
              {stage.documents?.length > 0 && (
                <div className="space-y-1">
                  <p className="text-[10px] font-medium text-slate-600">
                    Documents:
                  </p>
                  {stage.documents.map((doc, dIdx) => (
                    <div
                      key={dIdx}
                      className="p-2 bg-slate-50 border border-slate-200 rounded flex justify-between items-center"
                    >
                      <span className="text-xs text-slate-800 truncate flex-1">
                        {doc.name || "Unnamed Document"}
                      </span>
                      <a
                        href={doc.downloadLink || "#"}
                        className="p-1 text-slate-600 hover:text-blue-600 hover:bg-blue-50 rounded transition-colors"
                      >
                        <Download size={12} />
                      </a>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}

          {/* Notifications */}
          {(viewModal.notifications || []).length > 0 && (
            <div className="bg-slate-50 border border-slate-200 rounded p-3">
              <h4 className="font-semibold text-slate-800 mb-2 flex items-center gap-1 text-xs">
                <FileText size={12} className="text-blue-600" /> Notifications
              </h4>
              <div className="space-y-1">
                {viewModal.notifications.map((n, idx) => (
                  <div
                    key={idx}
                    className="p-2 bg-white rounded border border-slate-200 text-slate-800 text-[10px]"
                  >
                    {n}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="sticky bottom-0 bg-slate-50 border-t border-slate-200 px-4 py-3 flex justify-between items-center gap-2 rounded-b-lg">
          <span className="text-[10px] text-slate-700">
            {(viewModal.stages || []).length} stage
            {(viewModal.stages || []).length !== 1 ? "s" : ""}
          </span>

          <div className="flex gap-2">
            <button
              onClick={() => setViewModal(null)}
              className="px-3 py-1.5 border border-slate-300 text-slate-700 rounded text-xs hover:bg-slate-100 transition"
            >
              Close
            </button>
            <a
              href={`/download/archive/${viewModal._id}`}
              className="flex items-center gap-1 px-3 py-1.5 bg-slate-700 text-white rounded text-xs hover:bg-slate-800 transition"
            >
              <Download size={12} /> Download
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ViewCaseModal;
