import React, { useState } from "react";
import {
  Archive,
  Eye,
  Trash2,
  Edit,
  Bell,
  Calendar,
  Calendar as Calendar2,
  FileText,
  MoreVertical,
} from "lucide-react";

const CaseTable = ({
  cases,
  onArchive,
  onEditCase,
  onViewCase,
  onDeleteCase,
  onAddReminder,
  onScheduleHearing,
  onAssignLawyer,
  onUpdateCourtCaseId,
  onManageSessions,
}) => {
  const [openDropdown, setOpenDropdown] = useState(null);

  // Close dropdown when clicking outside
  React.useEffect(() => {
    const handleClickOutside = () => setOpenDropdown(null);
    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, []);

  // Badge helpers
  const getStageBadge = (stage) => {
    switch (stage) {
      case "Main":
        return "bg-blue-50 text-blue-700 border border-blue-200";
      case "Appeal":
        return "bg-orange-50 text-orange-700 border border-orange-200";
      case "Cassation":
        return "bg-purple-50 text-purple-700 border border-purple-200";
      default:
        return "bg-slate-100 text-slate-600 border border-slate-200";
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case "Pending":
        return "bg-amber-50 text-amber-700 border border-amber-200";
      case "Approved":
        return "bg-emerald-50 text-emerald-700 border border-emerald-200";
      case "Rejected":
        return "bg-red-50 text-red-700 border border-red-200";
      case "Closed":
        return "bg-slate-100 text-slate-700 border border-slate-200";
      case "Main Stage Ongoing":
        return "bg-blue-50 text-blue-700 border border-blue-200";
      case "Archived":
        return "bg-purple-50 text-purple-700 border border-purple-200";
      case "ReadyForSubmission":
        return "bg-cyan-50 text-cyan-700 border border-cyan-200";
      default:
        return "bg-slate-100 text-slate-600 border border-slate-200";
    }
  };

  // Action Dropdown Component
  const ActionDropdown = ({ caseItem, isOpen, onToggle }) => {
    const [buttonRef, setButtonRef] = React.useState(null);
    const isArchived = caseItem.case.status === "Archived";
    const canArchive = !isArchived;

    const actions = [
      {
        icon: Eye,
        label: "View Details",
        onClick: () => onViewCase?.(caseItem.id),
        color: "text-blue-600 hover:bg-blue-50",
      },
      {
        icon: Edit,
        label: "Edit Case",
        onClick: () => onEditCase?.(caseItem.id),
        color: "text-green-600 hover:bg-green-50",
      },
      {
        icon: FileText,
        label: caseItem.case.courtCaseId ? "Update Court ID" : "Add Court ID",
        onClick: () => onUpdateCourtCaseId?.(caseItem),
        color: "text-indigo-600 hover:bg-indigo-50",
      },
      {
        icon: Calendar2,
        label: "Manage Sessions",
        onClick: () => onManageSessions?.(caseItem),
        color: "text-teal-600 hover:bg-teal-50",
      },
      {
        icon: Bell,
        label: "Add Reminder",
        onClick: () => onAddReminder?.(caseItem),
        color: "text-orange-600 hover:bg-orange-50",
      },
      {
        icon: Archive,
        label: "Archive Case",
        onClick: () => onArchive?.(caseItem.id),
        color: canArchive ? "text-violet-600 hover:bg-violet-50" : "text-gray-400",
        disabled: !canArchive,
      },
      {
        icon: Trash2,
        label: "Delete Case",
        onClick: () => onDeleteCase?.(caseItem.id),
        color: "text-red-600 hover:bg-red-50",
        divider: true,
      },
    ];

    return (
      <div className="relative inline-block">
        <button
          ref={setButtonRef}
          onClick={(e) => {
            e.stopPropagation();
            onToggle();
          }}
          className="p-1.5 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <MoreVertical size={16} className="text-gray-500" />
        </button>

        {isOpen && (
          <>
            {/* Backdrop */}
            <div
              className="fixed inset-0 z-40"
              onClick={(e) => {
                e.stopPropagation();
                setOpenDropdown(null);
              }}
            />

            {/* Dropdown Menu */}
            <div className="fixed z-50 w-48 bg-white rounded-lg shadow-xl border border-gray-200 py-1"
                 style={{
                   top: buttonRef ? `${buttonRef.getBoundingClientRect().bottom + 4}px` : '0',
                   right: buttonRef ? `${window.innerWidth - buttonRef.getBoundingClientRect().right}px` : '0'
                 }}>
              {actions.map((action, index) => {
                const Icon = action.icon;
                return (
                  <React.Fragment key={index}>
                    {action.divider && <div className="border-t my-1" />}
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        if (!action.disabled) action.onClick();
                        setOpenDropdown(null);
                      }}
                      className={`w-full text-left px-3 py-2 hover:bg-gray-50 flex items-center gap-3 ${action.color} ${action.disabled ? 'opacity-50 cursor-not-allowed' : ''}`}>
                      <Icon size={16} />
                      <span className="text-sm">{action.label}</span>
                    </button>
                  </React.Fragment>
                );
              })}
            </div>
          </>
        )}
      </div>
    );
  };

  if (!cases.length) {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8 text-center">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-gray-100 rounded-full mb-4">
          <FileText size={32} className="text-gray-400" />
        </div>
        <p className="text-sm font-semibold text-gray-700">No cases found</p>
        <p className="text-xs text-gray-500 mt-1">
          Try adjusting your filters or search terms
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 w-full">
      {/* Mobile Card View */}
      <div className="block md:hidden divide-y divide-gray-100">
        {cases.map((c) => {
          return (
            <div
              key={c._id || c.id}
              className="p-4 hover:bg-gray-50 transition-colors"
            >
              <div className="flex justify-between items-start mb-3">
                <div className="flex-1">
                  {c.case.courtCaseId ? (
                    <span className="inline-flex items-center gap-2 bg-gradient-to-r from-[#BCB083] to-[#A48C65] text-white px-3 py-1.5 rounded-lg text-xs font-semibold">
                      <FileText size={12} />
                      {c.case.courtCaseId}
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1.5 bg-gray-100 text-gray-500 px-2.5 py-1 rounded-lg text-xs font-medium">
                      <FileText size={10} />
                      Not Assigned
                    </span>
                  )}
                  <p className="text-sm font-bold text-gray-900 mt-2">
                    {c.client.name}
                  </p>
                </div>
                <span
                  className={`px-2.5 py-1 rounded-lg text-[10px] font-semibold ${getStatusBadge(
                    c.case.status
                  )}`}
                >
                  {c.case.status}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-3 text-xs">
                <div>
                  <p className="text-[10px] font-medium text-gray-500 uppercase tracking-wider mb-0.5">Contact</p>
                  <p className="text-gray-900 font-medium truncate">{c.client.contact}</p>
                </div>
                <div>
                  <p className="text-[10px] font-medium text-gray-500 uppercase tracking-wider mb-0.5">Type</p>
                  <p className="text-gray-900 font-medium">{c.case.caseType}</p>
                </div>
                <div>
                  <p className="text-[10px] font-medium text-gray-500 uppercase tracking-wider mb-0.5">Lawyer</p>
                  <p className="text-gray-900 font-medium truncate">
                    {c.case.assignedLawyer || <span className="text-gray-400 italic">Unassigned</span>}
                  </p>
                </div>
              </div>

              <div className="flex justify-end pt-2 border-t border-gray-100">
                <ActionDropdown
                  caseItem={c}
                  isOpen={openDropdown === c.id}
                  onToggle={() => setOpenDropdown(openDropdown === c.id ? null : c.id)}
                />
              </div>
            </div>
          );
        })}
      </div>

      {/* Desktop/Tablet Table */}
      <div className="hidden md:block rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
          <thead className="bg-gradient-to-r from-gray-50 to-gray-100 border-b border-gray-200">
            <tr>
              <th className="px-4 py-3 text-left text-[10px] font-semibold text-gray-600 uppercase tracking-wider">
                Court ID
              </th>
              <th className="px-4 py-3 text-left text-[10px] font-semibold text-gray-600 uppercase tracking-wider">
                Client
              </th>
              <th className="px-4 py-3 text-left text-[10px] font-semibold text-gray-600 uppercase tracking-wider hidden lg:table-cell">
                Contact
              </th>
              <th className="px-4 py-3 text-left text-[10px] font-semibold text-gray-600 uppercase tracking-wider">
                Type
              </th>
              <th className="px-4 py-3 text-left text-[10px] font-semibold text-gray-600 uppercase tracking-wider hidden lg:table-cell">
                Stage
              </th>
              <th className="px-4 py-3 text-left text-[10px] font-semibold text-gray-600 uppercase tracking-wider">
                Status
              </th>
              <th className="px-4 py-3 text-right text-[10px] font-semibold text-gray-600 uppercase tracking-wider w-16">

              </th>
            </tr>
          </thead>
          <tbody>
            {cases.map((c) => {
              const lastStage =
                c.case.stages && c.case.stages.length > 0
                  ? c.case.stages[c.case.stages.length - 1].stage
                  : c.case.stage || "N/A";

              return (
                <tr
                  key={c._id || c.id}
                  className="border-b border-gray-100 hover:bg-gray-50/50 transition-colors"
                >
                  <td className="px-4 py-4 whitespace-nowrap">
                    {c.case.courtCaseId ? (
                      <span className="inline-flex items-center gap-2 bg-[#0B1F3B] text-white px-3 py-1.5 rounded-lg text-xs font-semibold shadow-sm">
                        <FileText size={14} />
                        {c.case.courtCaseId}
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1.5 bg-gray-100 text-gray-500 px-3 py-1.5 rounded-lg text-xs font-medium">
                        <FileText size={12} />
                        Not Assigned
                      </span>
                    )}
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap">
                    <p className="text-sm font-semibold text-gray-900">{c.client.name}</p>
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-600 hidden lg:table-cell">
                    {c.client.contact}
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-700 font-medium">
                    {c.case.caseType}
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap hidden lg:table-cell">
                    <span
                      className={`px-2.5 py-1 rounded-lg text-[10px] font-semibold ${getStageBadge(
                        lastStage
                      )}`}
                    >
                      {lastStage}
                    </span>
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap">
                    <span
                      className={`px-2.5 py-1 rounded-lg text-[10px] font-semibold ${getStatusBadge(
                        c.case.status
                      )}`}
                    >
                      {c.case.status}
                    </span>
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap text-right">
                    <ActionDropdown
                      caseItem={c}
                      isOpen={openDropdown === c.id}
                      onToggle={() => setOpenDropdown(openDropdown === c.id ? null : c.id)}
                    />
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
        </div>
      </div>
    </div>
  );
};

export default CaseTable;
