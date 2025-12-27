import React, { useEffect, useState } from "react";
import { Eye, Trash2, ChevronRight } from "lucide-react";

const ArchiveTable = ({ cases, loading, onViewCase, onDeleteCase }) => {
   const [sidebarOpen, setSidebarOpen] = useState(window.innerWidth >= 1024);

   // 🔄 Sync with sidebar width
   useEffect(() => {
      const handleResize = () => {
         setSidebarOpen(window.innerWidth >= 1024);
      };

      const detectSidebar = () => {
         const sidebar = document.querySelector("aside");
         if (sidebar) {
            const isOpen = sidebar.classList.contains("w-64");
            setSidebarOpen(isOpen);
         }
      };

      window.addEventListener("resize", handleResize);
      const interval = setInterval(detectSidebar, 120);

      return () => {
         window.removeEventListener("resize", handleResize);
         clearInterval(interval);
      };
   }, []);

   if (loading)
      return (
         <div className="bg-white rounded border border-slate-200 p-8 text-center">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-slate-800 mx-auto mb-2"></div>
            <p className="text-xs text-slate-600">Loading archives...</p>
         </div>
      );

   if (!cases.length)
     return (
       <div className="bg-white rounded border border-slate-200 p-8 text-center">
         <ChevronRight size={40} className="text-[#0B1F3B] mx-auto mb-2" />
         <h3 className="text-[22px] font-medium text-[#0B1F3B] mb-1">
           No Archived Cases
         </h3>
         <p className="text-[14px] text-slate-500">
           Your case archives will appear here once cases are completed.
         </p>
       </div>
     );

   return (
      <div className="bg-white rounded border border-slate-200 overflow-hidden">
         <div className="overflow-x-auto">
            <table className="w-full">
               <thead className="bg-[#A48D66] text-white">
                  <tr>
                     {[
                        { label: "Case #", class: "" },
                        { label: "Client", class: "" },
                        { label: "Type", class: "" },
                        { label: "Date", class: "hidden lg:table-cell" },
                        { label: "Stages", class: "hidden xl:table-cell" },
                        { label: "Actions", class: "text-right" },
                     ].map((h) => (
                        <th
                           key={h.label}
                           className={`px-3 py-4 text-[16px] font-semibold uppercase ${h.class}`}
                        >
                           {h.label}
                        </th>
                     ))}
                  </tr>
               </thead>

               <tbody className="divide-y divide-slate-200">
                  {cases.map((caseData) => (
                     <tr key={caseData.id} className="hover:bg-[#A48D66] group">
                        {/* Case Number */}
                        <td className="px-3 py-4 text-xs font-semibold text-slate-800 group-hover:text-white">
                           {caseData.caseNumber}
                        </td>

                        {/* Client Name */}
                        <td className="px-3 py-4 text-xs text-slate-800 group-hover:text-white">
                           {caseData.clientId?.name || "—"}
                        </td>

                        {/* Case Type */}
                        <td className="px-3 py-4 ">
                           <span className="px-2 py-0.5 bg-blue-50 text-blue-700 border border-blue-200 rounded text-[10px] font-medium">
                              {caseData.caseType}
                           </span>
                        </td>

                        {/* Date */}
                        <td className="px-3 py-4 text-xs text-slate-600 hidden lg:table-cell group-hover:text-white">
                           {caseData.archivedAt
                              ? new Date(
                                   caseData.archivedAt
                                ).toLocaleDateString()
                              : "—"}
                        </td>

                        {/* Stages */}
                        <td className="px-3 py-2 hidden xl:table-cell">
                           <div className="text-[10px] text-slate-600">
                              {caseData.stages?.length || 0} stage
                              {caseData.stages?.length !== 1 ? "s" : ""}
                           </div>
                        </td>

                        {/* Actions */}
                        <td className="px-3 py-4">
                           <div className="flex justify-end gap-1">
                              <button
                                 onClick={() => onViewCase(caseData)}
                                 className="p-1 text-slate-600 hover:text-blue-600 hover:bg-blue-50 rounded transition"
                                 title="View"
                              >
                                 <Eye size={18} />
                              </button>
                              <button
                                 onClick={() => onDeleteCase(caseData)}
                                 className="p-1 text-slate-600 hover:text-red-600 hover:bg-red-50 rounded transition"
                                 title="Delete"
                              >
                                 <Trash2 size={18} />
                              </button>
                           </div>
                        </td>
                     </tr>
                  ))}
               </tbody>
            </table>
         </div>
      </div>
   );
};

export default ArchiveTable;
