import React from "react";

export default function StatusPill({ status }) {
  let colorClass = "bg-gray-200 text-gray-800";

  switch (status.toLowerCase()) {
    case "approved":
      colorClass = "bg-green-100 text-green-800";
      break;
    case "pending":
      colorClass = "bg-yellow-100 text-yellow-800";
      break;
    case "modification requested":
      colorClass = "bg-red-100 text-red-800";
      break;
    case "main":
      colorClass = "bg-blue-100 text-blue-800";
      break;
    case "appeal":
      colorClass = "bg-purple-100 text-purple-800";
      break;
    case "cassation":
      colorClass = "bg-pink-100 text-pink-800";
      break;
  }

  return (
    <span className={`px-3 py-1 rounded-full text-sm font-medium ${colorClass}`}>
      {status}
    </span>
  );
}
