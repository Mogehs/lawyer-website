import React from "react";
import { Eye, Trash, Download } from "lucide-react";

const ArchiveTable = ({ archives, onView, onDelete, sidebarOpen }) => {
  if (!archives.length) {
    return (
      <div className="bg-white rounded-2xl shadow-lg overflow-hidden p-8 text-center text-[#494C52]">
        <div className="flex flex-col items-center justify-center">
          <div className="text-4xl mb-2">📁</div>
          <p className="text-lg font-medium">No archived cases found</p>
          <p className="text-sm">Try adjusting your filters or search terms</p>
        </div>
      </div>
    );
  }

  return (
    <div
      className={`bg-white w-[300px] text-[#24344f] shadow-2xl rounded-2xl border border-[#fe9a00]/20 overflow-hidden transition-all duration-300 ${
        sidebarOpen ? "lg:w-[980px] md:w-[400px]" : "lg:w-full md:w-[480px]"
      }`}
    >
      {/* Desktop/Tablet Table */}
      <div className="hidden md:block overflow-x-auto whitespace-nowrap">
        <table className="min-w-full text-sm">
          <thead className="bg-[#24344f] text-[#fe9a00] uppercase tracking-wide text-xs font-semibold">
            <tr>
              <th className="px-6 py-4 text-left">Archive ID</th>
              <th className="px-6 py-4 text-left">Case ID</th>
              <th className="px-6 py-4 text-left">Client</th>
              <th className="px-6 py-4 text-left">Stage</th>
              <th className="px-6 py-4 text-left">Lawyer</th>
              <th className="px-6 py-4 text-left">Approved By</th>
              <th className="px-6 py-4 text-left">Submitted On</th>
              <th className="px-6 py-4 text-left">Status</th>
              <th className="px-6 py-4 text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {archives.map((a) => {
              const finalStage = a.stages[a.stages.length - 1];

              const stageBadge =
                finalStage.stage === "Main"
                  ? "bg-blue-100 text-blue-800 border border-blue-200"
                  : finalStage.stage === "Appeal"
                  ? "bg-purple-100 text-purple-800 border border-purple-200"
                  : "bg-orange-100 text-orange-800 border border-orange-200";

              const statusBadge =
                a.status === "Approved"
                  ? "bg-green-100 text-green-800 border border-green-200"
                  : a.status === "Pending"
                  ? "bg-yellow-100 text-yellow-800 border border-yellow-200"
                  : "bg-red-100 text-red-800 border border-red-200";

              return (
                <tr
                  key={a.id}
                  className="border-t border-[#fe9a00]/10 hover:bg-[#E1E1E2] transition-all duration-200"
                >
                  <td className="px-6 py-4 font-medium">{a.archiveId}</td>
                  <td className="px-6 py-4 font-medium">{a.id}</td>
                  <td className="px-6 py-4">{a.client}</td>
                  <td className="px-6 py-4">
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-semibold ${stageBadge}`}
                    >
                      {finalStage.stage}
                    </span>
                  </td>
                  <td className="px-6 py-4">{a.lawyers.join(", ")}</td>
                  <td className="px-6 py-4">{finalStage.approvedBy}</td>
                  <td className="px-6 py-4">{finalStage.submittedOn}</td>
                  <td className="px-6 py-4">
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-semibold ${statusBadge}`}
                    >
                      {a.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-center flex justify-center gap-3 flex-nowrap">
                    <button
                      onClick={() => onView(a)}
                      className="flex items-center gap-2 text-[#fe9a00] hover:text-white hover:bg-[#fe9a00]/80 px-3 py-1.5 rounded-full font-medium transition-all duration-200"
                    >
                      <Eye className="w-4 h-4" /> View
                    </button>
                    <button
                      onClick={() => onDelete(a)}
                      className="flex items-center gap-2 text-red-600 hover:text-white hover:bg-red-600/80 px-3 py-1.5 rounded-full font-medium transition-all duration-200"
                    >
                      <Trash className="w-4 h-4" /> Delete
                    </button>
                    {a.downloadFile && (
                      <a
                        href={a.downloadFile.url}
                        download={a.downloadFile.name}
                        className="flex items-center gap-2 text-blue-600 hover:text-white hover:bg-blue-600/80 px-3 py-1.5 rounded-full font-medium transition-all duration-200"
                      >
                        <Download className="w-4 h-4" />
                      </a>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Mobile Cards */}
      <div className="md:hidden flex flex-col gap-4 pt-10 bg-gray-100">
        {archives.map((a) => {
          const finalStage = a.stages[a.stages.length - 1];

          const stageBadge =
            finalStage.stage === "Main"
              ? "bg-blue-100 text-blue-800 border border-blue-200"
              : finalStage.stage === "Appeal"
              ? "bg-purple-100 text-purple-800 border border-purple-200"
              : "bg-orange-100 text-orange-800 border border-orange-200";

          const statusBadge =
            a.status === "Approved"
              ? "bg-green-100 text-green-800 border border-green-200"
              : a.status === "Pending"
              ? "bg-yellow-100 text-yellow-800 border border-yellow-200"
              : "bg-red-100 text-red-800 border border-red-200";

          return (
            <div
              key={a.id}
              className="bg-white shadow-lg rounded-2xl p-4 border border-[#fe9a00]/20 mx-4"
            >
              <div className="flex justify-between items-center mb-2">
                <h3 className="font-semibold text-lg">{a.client}</h3>
                <span
                  className={`px-2 py-1 rounded-full text-xs font-semibold ${statusBadge}`}
                >
                  {a.status}
                </span>
              </div>
              <div className="mb-2">
                <p>
                  <span className="font-semibold">Archive ID:</span> {a.archiveId}
                </p>
                <p>
                  <span className="font-semibold">Case ID:</span> {a.id}
                </p>
                <p>
                  <span className="font-semibold">Stage:</span>{" "}
                  <span
                    className={`px-2 py-1 rounded-full text-xs font-semibold ${stageBadge}`}
                  >
                    {finalStage.stage}
                  </span>
                </p>
                <p>
                  <span className="font-semibold">Lawyer:</span> {a.lawyers.join(", ")}
                </p>
                <p>
                  <span className="font-semibold">Approved By:</span> {finalStage.approvedBy}
                </p>
                <p>
                  <span className="font-semibold">Submitted On:</span> {finalStage.submittedOn}
                </p>
              </div>
              <div className="flex justify-between gap-2 flex-wrap">
                <button
                  onClick={() => onView(a)}
                  className="flex items-center gap-1 text-[#fe9a00] hover:text-white hover:bg-[#fe9a00]/80 px-3 py-1.5 rounded-full font-medium transition-all duration-200"
                >
                  <Eye className="w-4 h-4" /> View
                </button>
                <button
                  onClick={() => onDelete(a)}
                  className="flex items-center gap-1 text-red-600 hover:text-white hover:bg-red-600/80 px-3 py-1.5 rounded-full font-medium transition-all duration-200"
                >
                  <Trash className="w-4 h-4" /> Delete
                </button>
                {a.downloadFile && (
                  <a
                    href={a.downloadFile.url}
                    download={a.downloadFile.name}
                    className="flex items-center gap-1 text-blue-600 hover:text-white hover:bg-blue-600/80 px-3 py-1.5 rounded-full font-medium transition-all duration-200"
                  >
                    <Download className="w-4 h-4" />
                  </a>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ArchiveTable;
