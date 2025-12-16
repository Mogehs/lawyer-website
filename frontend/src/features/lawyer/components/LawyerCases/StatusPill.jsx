import React from "react";

export default function StatusPill({ status }) {
  // Mapping for statuses
  const statusMap = {
    "Pending Lawyer Review": {
      bg: "bg-yellow-50",
      text: "text-yellow-800",
      border: "border-yellow-200",
      tooltip: "Waiting for lawyer submission",
    },
    "Under Revision by Ragab": {
      bg: "bg-blue-50",
      text: "text-blue-800",
      border: "border-blue-200",
      tooltip: "Ragab requested revision",
    },
    "Needs Modification": {
      bg: "bg-red-50",
      text: "text-red-800",
      border: "border-red-200",
      tooltip: "Requires modification",
    },
    Approved: {
      bg: "bg-green-50",
      text: "text-green-800",
      border: "border-green-200",
      tooltip: "Approved by Ragab",
    },
    Submitted: {
      bg: "bg-indigo-50",
      text: "text-indigo-800",
      border: "border-indigo-200",
      tooltip: "Submitted to court",
    },
  };

  // Mapping for stages
  const stageMap = {
    Main: {
      bg: "bg-blue-50",
      text: "text-blue-800",
      border: "border-blue-200",
      tooltip: "Main stage",
    },
    Appeal: {
      bg: "bg-yellow-50",
      text: "text-yellow-800",
      border: "border-yellow-200",
      tooltip: "Appeal stage",
    },
    Cassation: {
      bg: "bg-purple-50",
      text: "text-purple-800",
      border: "border-purple-200",
      tooltip: "Cassation stage",
    },
  };

  // Decide which map to use
  const st = statusMap[status] ||
    stageMap[status] || {
      bg: "bg-gray-50",
      text: "text-slate-800",
      border: "border-gray-200",
      tooltip: "",
    };

  return (
    <span
      title={st.tooltip}
      className={`px-1.5 py-0.5 text-[14px] rounded border font-medium ${st.bg} ${st.text} ${st.border}`}
    >
      {status}
    </span>
  );
}
