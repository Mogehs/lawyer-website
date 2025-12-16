import { Eye, Trash2 } from "lucide-react";

const CasesTable = ({ cases, onView, onDelete,sidebarOpen }) => {
  return (
  <div
      className={`bg-white w-[320px] text-[#24344f] shadow-2xl rounded-2xl border border-[#fe9a00]/20 overflow-hidden transition-all duration-300 ${
        sidebarOpen ? "lg:w-[980px] md:w-[440px]" : "lg:w-full md:w-[640px]"
      }`}
    >
      {/* ===== Desktop Table ===== */}
      <div className="block">
        <div className="overflow-x-auto">
          <table className="w-full table-auto text-sm min-w-[700px] border-collapse">
            <thead className="bg-[#A48C65] text-white  uppercase tracking-wide text-xs font-semibold">
              <tr className="whitespace-nowrap">
                <th className="px-6 py-4 text-left">Case #</th>
                <th className="px-6 py-4 text-left">Client</th>
                <th className="px-6 py-4 text-left">Lawyer</th>
                <th className="px-6 py-4 text-left">Stage</th>
                <th className="px-6 py-4 text-left">Status</th>
                <th className="px-6 py-4 text-left">Last Updated</th>
                <th className="px-6 py-4 text-center">Actions</th>
              </tr>
            </thead>

            <tbody>
              {cases.map((c) => (
                <tr key={c._id} className="border-t whitespace-nowrap border-[#A48C65]/40 hover:bg-[#bcb0835d] transition-all duration-200">
                  <td className="px-6 py-4">{c.caseNumber}</td>
                  <td className="px-6 py-4">{c.clientName}</td>
                  <td className="px-6 py-4">{c.lawyer}</td>
                  <td className="px-6 py-4">{c.stage}</td>
                  <td className="px-6 py-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium
                      ${c.status === "Submitted" ? "bg-green-500/20 text-green-800 border border-[#A48C65]"
                      : c.status === "Awaiting Approval" ? "bg-yellow-500/20 text-yellow-800 border border-[#A48C65]"
                      : " text-black border border-[#A48C65]"}`}>
                      {c.status}
                    </span>
                  </td>
                  <td className="px-6 py-4">{c.lastUpdated}</td>
                  <td className="px-6 py-4 text-center flex justify-center gap-2">
                    <button onClick={() => onView(c)} className="flex items-center gap-2 text-[#A48C65] hover:text-white hover:bg-[#A48C65]/80 px-3 py-1.5 rounded-full font-medium">
                      <Eye className="w-4 h-4" /> View
                    </button>
                    <button onClick={() => onDelete(c)} className="flex items-center gap-2 text-[#A48C65] hover:text-white hover:bg-[#A48C65]/80 px-3 py-1.5 rounded-full font-medium">
                      <Trash2 className="w-4 h-4" /> Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

     

      <div className="h-[3px] w-full bg-gradient-to-r from-[#BCB083] to-[#A48C65]
]" />
    </div>
  );
};

export default CasesTable;
