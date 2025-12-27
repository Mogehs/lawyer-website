// src/components/FinalApprovalTable.jsx
import React, { useEffect, useState } from "react";
import { Eye, Trash2 } from "lucide-react";

const FinalApprovalTable = ({ cases, onView, onDelete }) => {
   // Sidebar state
    const [sidebarOpen, setSidebarOpen] = useState(window.innerWidth >= 1024);
  
     useEffect(() => {
       const handleResize = () => {
         const desktop = window.innerWidth >= 1024;
         setSidebarOpen(desktop);
       };
   
       const handleSidebarToggle = () => {
         const sidebar = document.querySelector('aside');
         if (sidebar) {
           const isOpen = sidebar.classList.contains('w-64');
           setSidebarOpen(isOpen);
         }
       };
   
       window.addEventListener('resize', handleResize);
   
       const interval = setInterval(handleSidebarToggle, 100);
   
       return () => {
         window.removeEventListener('resize', handleResize);
         clearInterval(interval);
       };
     }, []);

  return (
    <div
      className={` w-[320px] bg-white   shadow-2xl rounded-2xl border border-[#0B1F3B]/20 overflow-hidden transition-all duration-300 ${
        sidebarOpen ? "lg:w-[980px] md:w-[420px]" : "lg:w-full md:w-[640px]"
      }`}
    >
      {/* ===== Desktop View ===== */}
      <div className="block">
        <div className="overflow-x-auto">
          <table className="w-full table-auto text-sm min-w-[700px] border-collapse">
            <thead className="bg-[#0B1F3B] text-white uppercase tracking-wide text-xs font-semibold">
              <tr className="whitespace-nowrap">
                <th className="px-4 py-3 text-left">Case #</th>
                <th className="px-4 py-3 text-left">Client</th>
                <th className="px-4 py-3 text-left">Lawyer</th>
                <th className="px-4 py-3 text-left">Stage</th>
                <th className="px-4 py-3 text-left">Status</th>
                <th className="px-4 py-3 text-left">Last Updated</th>
                <th className="px-4 py-3 text-center">Actions</th>
              </tr>
            </thead>

            <tbody>
              {cases.map((c) => (
                <tr
                  key={c._id}
                  className="border-t whitespace-nowrap border-[#fe9a00]/10 hover:bg-[#f9f9f9] transition-all duration-200"
                >
                  <td className="px-4 py-3 ">{c.caseNumber}</td>
                  <td className="px-4 py-3 ">{c.clientId.name}</td>
                  <td className="px-4 py-3 ">{c.assignedLawyer.name}</td>
                  <td className="px-4 py-3 ">{c.currentStage}</td>
                  <td className="px-4 py-3 ">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-medium ${
                        c.status === "Draft"
                          ? "bg-yellow-500/20 text-yellow-800 border border-yellow-500/30"
                          : c.status === "Approved & Signed"
                          ? "bg-green-500/20 text-green-800 border border-green-500/30"
                          : "bg-red-500/20 text-red-800 border border-red-500/30"
                      }`}
                    >
                      {c.status}
                    </span>
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap">
                    {new Date(c.updatedAt).toLocaleString()}
                  </td>
                  <td className="px-4 py-3 text-center flex flex-nowrap justify-center gap-2">
                    <button
                      onClick={() => onView(c)}
                      className="flex items-center justify-center gap-1 text-[#fe9a00] hover:text-white hover:bg-[#fe9a00]/90 px-3 py-1.5 rounded-full font-medium transition-all duration-200 shadow-sm hover:shadow-md"
                    >
                      <Eye className="w-4 h-4" /> View
                    </button>

                    <button
                      onClick={() => onDelete(c)}
                      className="flex items-center justify-center gap-1 text-red-600 hover:text-white hover:bg-red-600/90 px-3 py-1.5 rounded-full font-medium transition-all duration-200 shadow-sm hover:shadow-md"
                    >
                      <Trash2 className="w-4 h-4" /> Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

     

      {/* Bottom Accent Line */}
      <div className="h-[3px] w-full bg-[#0B1F3B]
" />
    </div>
  );
};

export default FinalApprovalTable;
