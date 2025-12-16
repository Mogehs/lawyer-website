import React from "react";
import StatusPill from "./StatusPill";

export default function DetailsTab({ selectedCase }) {
  return (
    <div className="flex flex-col md:flex-row gap-3">
      {/* Left Panel: Case Info */}
      <div className="flex-1 bg-white rounded shadow-sm border border-slate-200 overflow-hidden">
        <div className="bg-slate-800 text-white px-4 py-2">
          <h3 className="text-xs font-semibold">Case Details</h3>
        </div>
        <div className="p-3 space-y-2 text-xs">
          <div className="flex justify-between">
            <span className="text-slate-500">Case Number:</span>
            <span className="text-slate-800 font-medium">
              {selectedCase.caseNumber}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-500">Client:</span>
            <span className="text-slate-800">{selectedCase.clientName}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-500">Case Type:</span>
            <span className="text-slate-800">{selectedCase.caseType}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-slate-500">Assigned Stage:</span>
            <StatusPill status={selectedCase.assignedStage} />
          </div>
          <div className="flex justify-between">
            <span className="text-slate-500">Assigned Date:</span>
            <span className="text-slate-800">
              {selectedCase.assignedDate || "—"}
            </span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-slate-500">Status:</span>
            <StatusPill status={selectedCase.status} />
          </div>
        </div>
      </div>

      {/* Right Panel: Stage Summary */}
      <div className="flex-1 bg-white rounded shadow-sm border border-slate-200 overflow-hidden">
        <div className="bg-slate-800 text-white px-4 py-2">
          <h3 className="text-xs font-semibold">Stage Timeline</h3>
        </div>
        <div className="p-3 flex flex-col gap-2 max-h-[400px] overflow-y-auto">
          {selectedCase.stages.map((stage, idx) => (
            <div
              key={idx}
              className="flex justify-between items-center p-2 border rounded hover:bg-slate-50 transition"
            >
              <div className="flex-1">
                <div className="text-xs font-medium text-slate-800">
                  {stage.type}
                </div>
                <div className="text-[10px] text-slate-500">
                  {stage.date || "—"}
                </div>
              </div>
              <div>
                {stage.completed ? (
                  <StatusPill status="Approved" />
                ) : (
                  <StatusPill status="Pending Lawyer Review" />
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
