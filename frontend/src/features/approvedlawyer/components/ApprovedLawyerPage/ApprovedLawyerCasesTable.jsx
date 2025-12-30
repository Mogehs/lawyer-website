import { Eye, Trash2, FileText } from 'lucide-react';
import StatusPill from './StatusPill';
import { useTranslation } from 'react-i18next'; // Importing the translation hook

export default function ApprovedLawyerCasesTable({
  cases,
  openModal,
  openDeleteModal
}) {
  const { t } = useTranslation("appcasemanagement"); // Using translation hook to fetch text

  // Get the actual stage name from the case stages array
  const getCurrentStageName = (caseItem) => {
    if (caseItem.stages && caseItem.stages.length > 0) {
      const currentStageIndex = caseItem.currentStage || 0;
      return caseItem.stages[currentStageIndex]?.stageType || t('stages.main'); // Use translation
    }
    return t('stages.main'); // Default to 'Main' stage
  };

  // Show empty state if no cases
  if (!cases || cases.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-md border border-gray-200 p-12 text-center">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-gray-100 rounded-full mb-4">
          <FileText className="w-8 h-8 text-gray-400" />
        </div>
        <h3 className="text-lg font-semibold text-gray-900 mb-2">{t('noCasesAssigned')}</h3>
        <p className="text-sm text-gray-500">{t('noCasesMessage')}</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-[#0B1F3B] text-white">
            <tr>
              <th className="px-4 py-3 text-left text-sm font-semibold">{t('caseNumber')}</th>
              <th className="px-4 py-3 text-left text-sm font-semibold">{t('client')}</th>
              <th className="px-4 py-3 text-left text-sm font-semibold hidden lg:table-cell">{t('contact')}</th>
              <th className="px-4 py-3 text-left text-sm font-semibold">{t('caseType')}</th>
              <th className="px-4 py-3 text-left text-sm font-semibold hidden xl:table-cell">{t('stage')}</th>
              <th className="px-4 py-3 text-left text-sm font-semibold">{t('secretary')}</th>
              <th className="px-4 py-3 text-left text-sm font-semibold hidden xl:table-cell">{t('draftLawyer')}</th>
              <th className="px-4 py-3 text-left text-sm font-semibold">{t('status')}</th>
              <th className="px-4 py-3 text-right text-sm font-semibold">{t('actions')}</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {cases.map((c) => (
              <tr
                key={c._id}
                className="hover:bg-gray-50 transition-colors"
              >
                <td className="px-4 py-4 whitespace-nowrap">
                  <span className="inline-flex items-center gap-2 bg-[#0B1F3B] text-white px-3 py-1.5 rounded-lg text-xs font-semibold shadow-sm">
                    <FileText size={14} />
                    {c.caseNumber}
                  </span>
                </td>

                <td className="px-4 py-4">
                  <div className="text-sm font-medium text-gray-900">
                    {c.clientId?.name || 'N/A'}
                  </div>
                </td>

                <td className="px-4 py-4 whitespace-nowrap hidden lg:table-cell">
                  <div className="text-sm text-gray-600">
                    {c.clientId?.contactNumber || '—'}
                  </div>
                </td>

                <td className="px-4 py-4 whitespace-nowrap">
                  <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                    {c.caseType}
                  </span>
                </td>

                <td className="px-4 py-4 whitespace-nowrap hidden xl:table-cell">
                  <StatusPill status={getCurrentStageName(c)} />
                </td>

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

                <td className="px-4 py-4 whitespace-nowrap hidden xl:table-cell">
                  <div className="flex items-center">
                    <div className="flex-shrink-0 h-8 w-8 bg-indigo-100 rounded-full flex items-center justify-center">
                      <span className="text-xs font-semibold text-indigo-600">
                        {c.assignedLawyer?.name?.charAt(0) || 'L'}
                      </span>
                    </div>
                    <div className="ml-3">
                      <div className="text-sm font-medium text-gray-900">
                        {c.assignedLawyer?.name || t('unassigned')}
                      </div>
                    </div>
                  </div>
                </td>

                <td className="px-4 py-4 whitespace-nowrap">
                  <StatusPill status={c.status} />
                </td>

                <td className="px-4 py-4 whitespace-nowrap text-right">
                  <div className="flex justify-end gap-2">
                    <button
                      onClick={() => openModal(c)}
                      className="inline-flex cursor-pointer items-center gap-1.5 px-3 py-1.5 bg-[#0B1F3B] text-white text-xs font-medium rounded-lg hover:bg-[#0B1F3B] transition-colors shadow-sm"
                      title={t('viewCaseDetails')}
                    >
                      <Eye size={14} />
                      <span className="hidden sm:inline">{t('view')}</span>
                    </button>

                    <button
                      onClick={() => openDeleteModal(c)}
                      className="inline-flex cursor-pointer items-center gap-1.5 px-3 py-1.5 bg-red-500 text-white text-xs font-medium rounded-lg hover:bg-red-600 transition-colors shadow-sm"
                      title={t('deleteCase')}
                    >
                      <Trash2 size={14} />
                      <span className="hidden sm:inline">{t('delete')}</span>
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
