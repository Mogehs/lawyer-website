import React, { useEffect, useState, useMemo } from "react";
import { FiX, FiSearch, FiEye, FiFileText } from "react-icons/fi";
import CaseDetail from "../components/LawyerCases/CaseDetail";
import DocumentsTab from "../components/LawyerCases/DocumentsTab";
import MemorandumTab from "../components/LawyerCases/MemorandumTab";
import { useGetAssignedCasesQuery } from "../api/lawyerApi";

export default function MyCases() {
   const [cases, setCases] = useState([]);
   const [search, setSearch] = useState("");
   const [statusFilter, setStatusFilter] = useState("");
   const [selectedCase, setSelectedCase] = useState(null);
   const [activeTab, setActiveTab] = useState("Details");
   const [selectedStage, setSelectedStage] = useState(0);

   const { data, isLoading, isError } = useGetAssignedCasesQuery({
      search: search || undefined,
      limit: 100,
   });

   useEffect(() => {
      if (data?.data) {
         const mapped = data.data.map((c) => ({
            ...c,
            id: c._id || c.id,
            _id: c._id || c.id,
            clientName: c.clientId?.name || "—",
            clientEmail: c.clientId?.email || "—",
            clientPhone: c.clientId?.contactNumber || "—",
            assignedStage: c.currentStage || 0,
            currentStage: c.currentStage || 0,
            stages: c.stages || [],
            notes: c.notes || [],
            caseNumber: c.caseNumber,
            caseType: c.caseType,
            status: c.status,
            courtCaseId: c.courtCaseId || "—",
            hearingDate: c.stages?.[c.currentStage]?.hearingDate || null,
         }));
         setCases(mapped);
      }
   }, [data]);


   // Filter cases
   const filteredCases = useMemo(() => {
      return cases.filter((c) => {
         const matchesStatus = !statusFilter || c.status === statusFilter;
         return matchesStatus;
      });
   }, [cases, statusFilter]);

   // Get unique statuses for filter
   const uniqueStatuses = useMemo(() => {
      return Array.from(new Set(cases.map((c) => c.status))).filter(Boolean);
   }, [cases]);

   const openCase = (c) => {
      const validCase = {
         ...c,
         _id: c._id || c.id,
         id: c.id || c._id,
         stages: Array.isArray(c.stages) ? c.stages : [],
         notes: Array.isArray(c.notes) ? c.notes : [],
         currentStage: typeof c.currentStage === "number" ? c.currentStage : 0,
      };
      setSelectedCase(validCase);
      setActiveTab("Details");
      setSelectedStage(validCase.currentStage);
   };

   const closeCase = () => setSelectedCase(null);

   const formatDate = (dateString) => {
      if (!dateString) return "—";
      const date = new Date(dateString);
      return date.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
   };

   const getStatusColor = (status) => {
      const colors = {
         Draft: "bg-gray-100 text-gray-700",
         Assigned: "bg-blue-100 text-blue-700",
         UnderReview: "bg-yellow-100 text-yellow-700",
         PendingApproval: "bg-orange-100 text-orange-700",
         Approved: "bg-green-100 text-green-700",
         PendingSignature: "bg-purple-100 text-purple-700",
         ReadyForSubmission: "bg-indigo-100 text-indigo-700",
         Submitted: "bg-teal-100 text-teal-700",
         Archived: "bg-slate-100 text-slate-700",
      };
      return colors[status] || "bg-gray-100 text-gray-700";
   };

   if (isLoading) {
      return (
         <div className="min-h-screen flex items-center justify-center">
            <div className="text-center">
               <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#A48C65] mx-auto"></div>
               <p className="mt-4 text-sm text-slate-600">Loading your cases...</p>
            </div>
         </div>
      );
   }

   if (isError) {
      return (
         <div className="min-h-screen flex items-center justify-center">
            <div className="text-center">
               <p className="text-red-500 text-sm">Error fetching cases. Please try again.</p>
            </div>
         </div>
      );
   }

   return (
      <div className="space-y-6">
         {/* Header */}
         <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
            <div>
               <h2 className="text-2xl font-bold text-[#0B1F3B]">
                  My Assigned Cases
               </h2>
               <p className="text-sm text-gray-600 mt-1">
                  {filteredCases.length} case{filteredCases.length !== 1 ? "s" : ""} assigned
               </p>
            </div>
         </div>

         {/* Search and Filters */}
         <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
            <div className="flex flex-col sm:flex-row gap-4">
               <div className="relative flex-1">
                  <FiSearch size={18} className="absolute top-1/2 transform -translate-y-1/2 left-3 text-gray-400" />
                  <input
                     type="text"
                     value={search}
                     onChange={(e) => setSearch(e.target.value)}
                     placeholder="Search cases..."
                     className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300
                        focus:ring-2 focus:ring-[#0B1F3B] focus:border-transparent focus:outline-none
                        transition-all duration-200"
                  />
               </div>
            </div>
            <div className="flex flex-wrap gap-2 mt-3">
               <button
                  onClick={() => setStatusFilter("")}
                  className={`px-2.5 py-1 text-[10px] rounded transition-all ${
                     !statusFilter
                        ? "bg-[#0B1F3B] text-white"
                        : "bg-white border border-slate-300 text-slate-600 hover:bg-slate-50"
                  }`}
               >
                  All
               </button>
               {uniqueStatuses.map((status) => (
                  <button
                     key={status}
                     onClick={() => setStatusFilter(status)}
                     className={`px-2.5 py-1 text-[10px] rounded transition-all ${
                        statusFilter === status
                           ? "bg-[#0B1F3B] text-white"
                           : "bg-white border border-slate-300 text-slate-600 hover:bg-slate-50"
                     }`}
                  >
                     {status}
                  </button>
               ))}
            </div>
         </div>

         {/* Cases Table */}
         {filteredCases.length === 0 ? (
            <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-6 text-center text-slate-500">
               <p className="text-sm font-medium text-slate-600">No cases found</p>
               <p className="text-xs text-slate-500 mt-1">
                  {search || statusFilter ? "Try adjusting your filters" : "Your assigned cases will appear here"}
               </p>
            </div>
         ) : (
            <div className="bg-white rounded-lg shadow-sm border border-slate-200 overflow-hidden w-full">
               {/* Mobile Card View */}
               <div className="block md:hidden">
                  {filteredCases.map((c) => (
                     <div key={c.id} className="border-b border-slate-200 p-3 space-y-2">
                        <div className="flex justify-between items-start">
                           <div className="flex-1">
                              {c.courtCaseId && c.courtCaseId !== "—" ? (
                                 <span className="inline-flex items-center gap-1.5 bg-[#0B1F3B] text-[#faf8f6] px-2.5 py-1 rounded text-xs font-bold border-2 border-[#A48C65]">
                                    <FiFileText size={12} />
                                    {c.courtCaseId}
                                 </span>
                              ) : (
                                 <span className="inline-flex items-center gap-1 bg-slate-100 text-slate-500 px-2 py-1 rounded text-[10px] font-medium border border-slate-300">
                                    <FiFileText size={10} />
                                    Not Assigned
                                 </span>
                              )}
                              <p className="text-xs font-semibold text-slate-900 mt-1.5">{c.clientName}</p>
                           </div>
                           <span className={`px-2 py-0.5 rounded text-[10px] font-medium ${getStatusColor(c.status)}`}>
                              {c.status}
                           </span>
                        </div>

                        <div className="grid grid-cols-2 gap-2 text-[10px]">
                           <div>
                              <span className="text-slate-500">Case #:</span>
                              <p className="text-slate-700">{c.caseNumber}</p>
                           </div>
                           <div>
                              <span className="text-slate-500">Type:</span>
                              <p className="text-slate-700">{c.caseType}</p>
                           </div>
                           <div>
                              <span className="text-slate-500">Email:</span>
                              <p className="text-slate-700 truncate">{c.clientEmail}</p>
                           </div>
                           <div>
                              <span className="text-slate-500">Hearing:</span>
                              <p className="text-slate-700">
                                 {c.hearingDate ? formatDate(c.hearingDate) : <span className="text-slate-400 italic">Not Set</span>}
                              </p>
                           </div>
                        </div>

                        <button
                           onClick={() => openCase(c)}
                           className="w-full p-1.5 bg-slate-100 text-[#0B1F3B] rounded transition-colors text-xs font-medium"
                        >
                           View Details
                        </button>
                     </div>
                  ))}
               </div>

               {/* Desktop/Tablet Table */}
               <div className="hidden md:block overflow-x-auto max-w-full">
                  <table className="w-full bg-white rounded-lg overflow-hidden">
                     <thead className="bg-[#0B1F3B] text-white border-b border-slate-200">
                        <tr>
                           <th className="px-4 py-3 text-left text-xs font-bold uppercase tracking-wide text-white whitespace-nowrap">
                              Court Case ID
                           </th>
                           <th className="px-3 py-2 text-left text-[10px] font-semibold uppercase tracking-wide text-white whitespace-nowrap">
                              Case Number
                           </th>
                           <th className="px-3 py-2 text-left text-[10px] font-semibold uppercase tracking-wide text-white whitespace-nowrap">
                              Client
                           </th>
                           <th className="px-3 py-2 text-left text-[10px] font-semibold uppercase tracking-wide text-white whitespace-nowrap hidden lg:table-cell">
                              Email
                           </th>
                           <th className="px-3 py-2 text-left text-[10px] font-semibold uppercase tracking-wide text-white whitespace-nowrap">
                              Type
                           </th>
                           <th className="px-3 py-2 text-left text-[10px] font-semibold uppercase tracking-wide text-white whitespace-nowrap">
                              Status
                           </th>
                           <th className="px-3 py-2 text-left text-[10px] font-semibold uppercase tracking-wide text-white whitespace-nowrap hidden xl:table-cell">
                              Hearing
                           </th>
                           <th className="px-3 py-2 text-center text-[10px] font-semibold uppercase tracking-wide text-white whitespace-nowrap">
                              Actions
                           </th>
                        </tr>
                     </thead>
                     <tbody>
                        {filteredCases.map((c) => (
                           <tr key={c.id} className="border-t border-slate-100 hover:bg-slate-50 transition-colors duration-150">
                              <td className="px-4 py-3 whitespace-nowrap">
                                 {c.courtCaseId && c.courtCaseId !== "—" ? (
                                    <span className="inline-flex items-center gap-1.5 bg-[#0B1F3B] text-[#fbfbfa] px-3 py-1.5 rounded text-sm font-bold border-2 border-[#0B1F3B]/50">
                                       <FiFileText size={14} />
                                       {c.courtCaseId}
                                    </span>
                                 ) : (
                                    <span className="inline-flex items-center gap-1 bg-slate-100 text-slate-500 px-2.5 py-1 rounded text-xs font-medium border border-slate-300">
                                       <FiFileText size={12} />
                                       Not Assigned
                                    </span>
                                 )}
                              </td>
                              <td className="px-3 py-2 text-slate-700 whitespace-nowrap text-xs">{c.caseNumber}</td>
                              <td className="px-3 py-2 text-slate-700 whitespace-nowrap text-xs">{c.clientName}</td>
                              <td className="px-3 py-2 text-slate-600 whitespace-nowrap hidden lg:table-cell text-xs">{c.clientEmail}</td>
                              <td className="px-3 py-2 text-slate-700 whitespace-nowrap text-xs">{c.caseType}</td>
                              <td className="px-3 py-2 whitespace-nowrap">
                                 <span className={`px-2 py-0.5 rounded text-[10px] font-medium ${getStatusColor(c.status)}`}>
                                    {c.status}
                                 </span>
                              </td>
                              <td className="px-3 py-2 whitespace-nowrap hidden xl:table-cell">
                                 {c.hearingDate ? (
                                    <span className="text-slate-700 text-xs">{formatDate(c.hearingDate)}</span>
                                 ) : (
                                    <span className="text-slate-400 text-[10px] italic">Not Set</span>
                                 )}
                              </td>
                              <td className="px-3 py-2 whitespace-nowrap">
                                 <div className="flex justify-center">
                                    <button
                                       onClick={() => openCase(c)}
                                       className="p-1.5 bg-slate-100 text-[#0B1F3B] rounded hover:bg-slate-200 transition-colors"
                                       title="View Details"
                                    >
                                       <FiEye size={14} />
                                    </button>
                                 </div>
                              </td>
                           </tr>
                        ))}
                     </tbody>
                  </table>
               </div>
            </div>
         )}

         {/* Case Detail Modal */}
         {selectedCase && (
            <div className="fixed inset-0 z-[9999] flex items-center justify-center p-3">
               {/* Backdrop */}
               <div
                  className="absolute inset-0 bg-black/60"
                  onClick={closeCase}
               />

               {/* Modal Content */}
               <div className="relative bg-white w-full max-w-5xl rounded-xl shadow-2xl flex flex-col max-h-[90vh] overflow-hidden">
                  {/* Header */}
                  <div className="flex justify-between items-center px-6 py-4 bg-gradient-to-r from-[#BCB083] to-[#A48C65] text-white">
                     <div>
                        <h2 className="font-semibold text-lg">{selectedCase.caseNumber}</h2>
                        <p className="text-xs text-white/80 mt-0.5">{selectedCase.caseType}</p>
                     </div>
                     <button
                        onClick={closeCase}
                        className="p-2 rounded-lg hover:bg-white/20 transition-colors"
                     >
                        <FiX size={20} />
                     </button>
                  </div>

                  {/* Tabs */}
                  <div className="px-6 py-3 bg-white sticky top-0 z-20 border-b border-slate-200">
                     <div className="flex gap-6 overflow-x-auto">
                        {["Details", "Documents", "Memorandum"].map((t) => (
                           <button
                              key={t}
                              onClick={() => setActiveTab(t)}
                              className={`pb-2 px-1 text-sm font-medium transition-all whitespace-nowrap ${
                                 activeTab === t
                                    ? "border-b-2 border-[#A48C65] text-[#A48C65]"
                                    : "text-slate-500 hover:text-slate-700"
                              }`}
                           >
                              {t}
                           </button>
                        ))}
                     </div>
                  </div>

                  {/* Tab Content */}
                  <div className="flex-1 overflow-auto p-6 bg-slate-50">
                     {activeTab === "Details" && (
                        <CaseDetail selectedCase={selectedCase} />
                     )}
                     {activeTab === "Documents" && (
                        <DocumentsTab
                           selectedCase={selectedCase}
                           selectedStage={selectedStage}
                        />
                     )}
                     {activeTab === "Memorandum" && (
                        <MemorandumTab
                           selectedCase={selectedCase}
                           selectedStage={selectedStage}
                        />
                     )}
                  </div>

                  {/* Footer */}
                  <div className="flex justify-end gap-2 px-6 py-4 border-t border-slate-200 sticky bottom-0 bg-white">
                     <button
                        onClick={closeCase}
                        className="px-4 py-2 rounded-lg border border-slate-300 text-sm text-slate-700
                           hover:bg-slate-50 transition-colors"
                     >
                        Close
                     </button>
                  </div>
               </div>
            </div>
         )}
      </div>
   );
}
