import { Eye, Trash2, FileText } from 'lucide-react';
import StatusPill from './StatusPill';

export default function ApprovedLawyerCasesTable({
  cases,
  openModal,
  openDeleteModal
}) {
  // Get the actual stage name from the case stages array
  const getCurrentStageName = (caseItem) => {
    if (caseItem.stages && caseItem.stages.length > 0) {
      const currentStageIndex = caseItem.currentStage || 0;
      return caseItem.stages[currentStageIndex]?.stageType || "Main";
    }
    return "Main";
  };

  // Show empty state if no cases
  if (!cases || cases.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-md border border-gray-200 p-12 text-center">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-gray-100 rounded-full mb-4">
          <FileText className="w-8 h-8 text-gray-400" />
        </div>
        <h3 className="text-lg font-semibold text-gray-900 mb-2">No Cases Assigned</h3>
        <p className="text-sm text-gray-500">
          There are no cases assigned to you for review at this time.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gradient-to-r from-[#BCB083] to-[#A48C65] text-white">
            <tr>
              <th className="px-4 py-3 text-left text-sm font-semibold">
                Case #
              </th>
              <th className="px-4 py-3 text-left text-sm font-semibold">
                Client
              </th>
              <th className="px-4 py-3 text-left text-sm font-semibold hidden lg:table-cell">
                Contact
              </th>
              <th className="px-4 py-3 text-left text-sm font-semibold">
                Case Type
              </th>
              <th className="px-4 py-3 text-left text-sm font-semibold hidden xl:table-cell">
                Stage
              </th>
              <th className="px-4 py-3 text-left text-sm font-semibold">
                Secretary
              </th>
              <th className="px-4 py-3 text-left text-sm font-semibold hidden xl:table-cell">
                Draft Lawyer
              </th>
              <th className="px-4 py-3 text-left text-sm font-semibold">
                Status
              </th>
              <th className="px-4 py-3 text-right text-sm font-semibold">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {cases.map((c) => (
              <tr
                key={c._id}
                className="hover:bg-gray-50 transition-colors"
              >
                {/* Case Number */}
                <td className="px-4 py-4 whitespace-nowrap">
                  <span className="inline-flex items-center gap-2 bg-gradient-to-r from-[#BCB083] to-[#A48C65] text-white px-3 py-1.5 rounded-lg text-xs font-semibold shadow-sm">
                    <FileText size={14} />
                    {c.caseNumber}
                  </span>
                </td>

                {/* Client Name */}
                <td className="px-4 py-4">
                  <div className="text-sm font-medium text-gray-900">
                    {c.clientId?.name || 'N/A'}
                  </div>
                </td>

                {/* Phone */}
                <td className="px-4 py-4 whitespace-nowrap hidden lg:table-cell">
                  <div className="text-sm text-gray-600">
                    {c.clientId?.contactNumber || '—'}
                  </div>
                </td>

                {/* Case Type */}
                <td className="px-4 py-4 whitespace-nowrap">
                  <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                    {c.caseType}
                  </span>
                </td>

                {/* Stage */}
                <td className="px-4 py-4 whitespace-nowrap hidden xl:table-cell">
                  <StatusPill status={getCurrentStageName(c)} />
                </td>

                {/* Secretary */}
                <td className="px-4 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <div className="flex-shrink-0 h-8 w-8 bg-purple-100 rounded-full flex items-center justify-center">
                      <span className="text-xs font-semibold text-purple-600">
                        {c.secretary?.name?.charAt(0) || 'S'}
                      </span>
                    </div>
                    <div className="ml-3">
                      <div className="text-sm font-medium text-gray-900">
                        {c.secretary?.name || 'N/A'}
                      </div>
                    </div>
                  </div>
                </td>

                {/* Draft Lawyer */}
                <td className="px-4 py-4 whitespace-nowrap hidden xl:table-cell">
                  <div className="flex items-center">
                    <div className="flex-shrink-0 h-8 w-8 bg-indigo-100 rounded-full flex items-center justify-center">
                      <span className="text-xs font-semibold text-indigo-600">
                        {c.assignedLawyer?.name?.charAt(0) || 'L'}
                      </span>
                    </div>
                    <div className="ml-3">
                      <div className="text-sm font-medium text-gray-900">
                        {c.assignedLawyer?.name || 'Unassigned'}
                      </div>
                    </div>
                  </div>
                </td>

                {/* Status */}
                <td className="px-4 py-4 whitespace-nowrap">
                  <StatusPill status={c.status} />
                </td>

                {/* Actions */}
                <td className="px-4 py-4 whitespace-nowrap text-right">
                  <div className="flex justify-end gap-2">
                    <button
                      onClick={() => openModal(c)}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#A48C65] text-white text-xs font-medium rounded-lg hover:bg-[#8B7355] transition-colors shadow-sm"
                      title="View Case Details"
                    >
                      <Eye size={14} />
                      <span className="hidden sm:inline">View</span>
                    </button>

                    <button
                      onClick={() => openDeleteModal(c)}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-red-500 text-white text-xs font-medium rounded-lg hover:bg-red-600 transition-colors shadow-sm"
                      title="Delete Case"
                    >
                      <Trash2 size={14} />
                      <span className="hidden sm:inline">Delete</span>
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
}
