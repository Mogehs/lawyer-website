import React from "react";

export default function CaseDetail({ selectedCase }) {
  if (!selectedCase) return null;

  const {
    caseNumber,
    caseType,
    clientName,
    clientEmail,
    clientPhone,
    status,
    stages = [],
    documents = [],
    notes = [],
    memorandum = {},
    hearing,
  } = selectedCase;

  return (
    <div className="space-y-3">
      {/* Basic Info */}
      <div className="bg-white shadow-sm border border-slate-200 p-3 rounded">
        <h2 className="text-sm font-semibold mb-2 text-slate-800">
          {caseNumber}
        </h2>
        <div className="space-y-1.5 text-xs">
          <div className="flex justify-between">
            <span className="text-slate-500">Case Type:</span>
            <span className="text-slate-700 font-medium">
              {caseType || "—"}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-500">Status:</span>
            <span className="text-slate-700 font-medium">{status || "—"}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-500">Client Name:</span>
            <span className="text-slate-700 font-medium">
              {clientName || "—"}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-500">Email:</span>
            <span className="text-slate-700">{clientEmail || "—"}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-500">Phone:</span>
            <span className="text-slate-700">{clientPhone || "—"}</span>
          </div>
          {hearing && (
            <div className="flex justify-between">
              <span className="text-slate-500">Hearing:</span>
              <span className="text-slate-700">
                {new Date(hearing).toLocaleString()}
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Stages */}
      <div className="bg-white shadow-sm border border-slate-200 p-3 rounded">
        <h3 className="text-xs font-semibold mb-2 text-slate-800">Stages</h3>
        {stages.length > 0 ? (
          <div className="space-y-1">
            {stages.map((stage, idx) => (
              <div
                key={idx}
                className="text-xs p-2 bg-slate-50 rounded border border-slate-200"
              >
                <span className="font-medium text-slate-700">
                  {stage.title || `Stage ${idx + 1}`}
                </span>
                <span className="text-slate-500">
                  {" "}
                  — {stage.description || "No description"}
                </span>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-[10px] text-slate-500">No stages available.</p>
        )}
      </div>

      {/* Documents */}
      <div className="bg-white shadow-sm border border-slate-200 p-3 rounded">
        <h3 className="text-xs font-semibold mb-2 text-slate-800">Documents</h3>
        {documents.length > 0 ? (
          <div className="space-y-1">
            {documents.map((doc) => (
              <div
                key={doc._id}
                className="flex items-center justify-between p-2 bg-slate-50 rounded border border-slate-200"
              >
                <a
                  href={doc.url}
                  download={doc.name}
                  className="text-xs text-blue-600 hover:underline flex-1 truncate"
                >
                  {doc.name}
                </a>
                <span className="text-[10px] text-slate-500 ml-2">
                  {new Date(doc.uploadedAt).toLocaleDateString()}
                </span>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-[10px] text-slate-500">No documents uploaded.</p>
        )}
      </div>

      {/* Notes */}
      <div className="bg-white shadow-sm border border-slate-200 p-3 rounded">
        <h3 className="text-xs font-semibold mb-2 text-slate-800">Notes</h3>
        {notes.length > 0 ? (
          <div className="space-y-1">
            {notes.map((note, idx) => (
              <div
                key={idx}
                className="text-xs p-2 bg-slate-50 rounded border border-slate-200 text-slate-700"
              >
                {note}
              </div>
            ))}
          </div>
        ) : (
          <p className="text-[10px] text-slate-500">No notes available.</p>
        )}
      </div>

      {/* Memorandum Status by Stage */}
      <div className="bg-white shadow-sm border border-slate-200 p-3 rounded">
        <h3 className="text-xs font-semibold mb-2 text-slate-800">
          Memorandum Status
        </h3>
        {stages.length > 0 ? (
          <div className="space-y-2">
            {stages.map((stage, idx) => {
              const stageMemo = stage.memorandum;
              return (
                <div
                  key={idx}
                  className="border-l-2 border-slate-300 pl-2 py-1"
                >
                  <p className="font-semibold text-xs text-slate-700">
                    {stage.stageType || `Stage ${idx + 1}`}
                  </p>
                  {stageMemo ? (
                    <div className="mt-1 space-y-1 text-[10px]">
                      <div className="flex items-center gap-1">
                        <span className="text-slate-500">Status:</span>
                        <span
                          className={`px-1.5 py-0.5 rounded text-[9px] font-medium ${
                            stageMemo.status === "Approved"
                              ? "bg-green-50 text-green-700 border border-green-200"
                              : stageMemo.status === "Rejected"
                              ? "bg-red-50 text-red-700 border border-red-200"
                              : stageMemo.status === "Pending"
                              ? "bg-yellow-50 text-yellow-700 border border-yellow-200"
                              : "bg-slate-50 text-slate-700 border border-slate-200"
                          }`}
                        >
                          {stageMemo.status}
                        </span>
                      </div>
                      {stageMemo.content && (
                        <div>
                          <span className="text-slate-500">Content:</span>
                          <p className="text-slate-700 mt-0.5">
                            {stageMemo.content}
                          </p>
                        </div>
                      )}
                      {stageMemo.fileUrl && (
                        <div>
                          <span className="text-slate-500">File:</span>
                          <a
                            href={stageMemo.fileUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-600 hover:underline ml-1"
                          >
                            View Document
                          </a>
                        </div>
                      )}
                      {stageMemo.preparedAt && (
                        <p className="text-[9px] text-slate-500">
                          Prepared:{" "}
                          {new Date(stageMemo.preparedAt).toLocaleString()}
                        </p>
                      )}
                      {stageMemo.feedback && (
                        <div className="p-1.5 bg-red-50 rounded border border-red-200">
                          <span className="text-red-600 font-medium">
                            Feedback:
                          </span>
                          <p className="text-red-600 mt-0.5">
                            {stageMemo.feedback}
                          </p>
                        </div>
                      )}
                    </div>
                  ) : (
                    <p className="text-[10px] text-slate-500 mt-0.5">
                      No memorandum submitted yet
                    </p>
                  )}
                </div>
              );
            })}
          </div>
        ) : (
          <p className="text-[10px] text-slate-500">No stages available.</p>
        )}
      </div>
    </div>
  );
}
