import { useEffect, useState } from 'react'
import { FiChevronRight, FiTrash2 } from 'react-icons/fi'
import StatusPill from './StatusPill'

export default function ApprovedLawyerCasesTable({
  cases,
  openModal,
  openDeleteModal
}) {
  const [sidebarOpen, setSidebarOpen] = useState(window.innerWidth >= 1024)

  useEffect(() => {
    const handleResize = () => {
      setSidebarOpen(window.innerWidth >= 1024)
    }

    const handleSidebarToggle = () => {
      const sidebar = document.querySelector('aside')
      if (sidebar) {
        const isOpen = sidebar.classList.contains('w-64')
        setSidebarOpen(isOpen)
      }
    }

    window.addEventListener('resize', handleResize)
    const interval = setInterval(handleSidebarToggle, 120)

    return () => {
      window.removeEventListener('resize', handleResize)
      clearInterval(interval)
    }
  }, [])

  // Stage conversion (0,1,2 → Main, Appeal, Cassation)
  const convertStage = (stageNum) => {
    const stages = ["Main", "Appeal", "Cassation"]
    return stages[stageNum] || "Unknown"
  }


  // Show empty state if no cases
  if (!cases || cases.length === 0) {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-gray-100 rounded-full mb-4">
          <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
        </div>
        <h3 className="text-lg font-semibold text-gray-900 mb-2">No Cases to Review</h3>
        <p className="text-sm text-gray-500">
          There are no pending cases assigned to you for approval at this time.
        </p>
      </div>
    );
  }

  return (
    <div
      className={`bg-white w-[320px] text-[#24344f] shadow-2xl rounded-2xl border border-[#fe9a00]/20 overflow-hidden transition-all duration-300 ${sidebarOpen ? "lg:w-[980px] md:w-[500px]" : "lg:w-[1200px] md:w-[680px]"
        }`}
    >
      <div className='block'>
        <div className='overflow-x-auto '>
          <table className='w-full table-auto text-sm min-w-[700px] border-collapse'>
            <thead className='bg-[#A48C65] text-white sticky top-0 z-10'>
              <tr>
                {[
                  'Case #',
                  'Client Name',
                  'Phone',
                  'Case Type',
                  'Stage',
                  'Secretary',
                  'Lawyer',
                  'Status',
                  'Actions'
                ].map(h => (
                  <th
                    key={h}
                    className='p-4 text-sm font-semibold uppercase whitespace-nowrap'
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>

            <tbody className='divide-y divide-slate-200'>
              {cases.map((c, idx) => (
                <tr
                  key={c._id}
                  className={`${idx % 2 === 0 ? 'bg-white' : 'bg-slate-50'
                    } hover:bg-slate-100 transition`}
                >
                  {/* Case number */}
                  <td className='p-4 font-semibold whitespace-nowrap'>
                    {c.caseNumber}
                  </td>

                  {/* Client Name */}
                  <td className='p-4 whitespace-nowrap'>
                    {c.clientId?.name}
                  </td>

                  {/* Phone */}
                  <td className='p-4 whitespace-nowrap'>
                    {c.clientId?.contactNumber || '—'}
                  </td>

                  {/* Case Type */}
                  <td className='p-4 whitespace-nowrap'>{c.caseType}</td>

                  {/* Stage */}
                  <td className='p-4 whitespace-nowrap'>
                    <StatusPill status={convertStage(c.currentStage)} />
                  </td>

                  {/* Secretary */}
                  <td className='p-4 whitespace-nowrap'>
                    {c.secretary?.name}
                  </td>

                  {/* Lawyer */}
                  <td className='p-4 whitespace-nowrap'>
                    {c.assignedLawyer?.name}
                  </td>

                  {/* Status */}
                  <td className='p-4 whitespace-nowrap'>
                    <StatusPill status={c.status} />
                  </td>

                  {/* Actions */}
                  <td className='p-4 whitespace-nowrap flex justify-end gap-2'>
                    <button
                      onClick={() => openModal(c)}
                      className='inline-flex items-center px-3 py-2 bg-slate-800 text-white rounded hover:bg-slate-700 gap-1'
                    >
                      <FiChevronRight /> Open
                    </button>

                    <button
                      onClick={() => openDeleteModal(c)}
                      className='inline-flex items-center px-3 py-2 bg-[#A48C65] text-white rounded hover:bg-[#8B6F3E] gap-1'
                    >
                      <FiTrash2 />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>

          </table>
        </div>
      </div>

    </div>
  )
}
