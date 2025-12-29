// src/features/secretary/cases/CaseManagement.jsx
import React, { useState, useCallback } from "react";
import { Plus } from "lucide-react";
import { toast } from "react-toastify";
import { useTranslation } from "react-i18next";

import CaseFilters from "../components/cases/CaseFilters";
import CaseTable from "../components/cases/CaseTable";
import AddCase from "../components/cases/AddCase";
import ViewCaseModal from "../components/cases/ViewCaseModal";
import CaseDeleteModal from "../components/cases/CaseDeleteModal";
import ArchiveCaseModal from "../components/cases/ArchiveCaseModal";
import AddReminderModal from "../components/cases/AddReminderModal";
import AddHearingDateModal from "../components/cases/AddHearingDateModal";
import AssignLawyerModal from "../components/cases/AssignLawyerModal";
import UpdateCourtCaseIdModal from "../components/cases/UpdateCourtCaseIdModal";
import AddSessionModal from "../components/cases/AddSessionModal";

import {
  useGetAllCasesQuery,
  useArchiveCaseMutation,
  useDeleteCaseMutation,
} from "../api/secretaryApi";

const CaseManagement = () => {
  const { t } = useTranslation("CaseManagement");

  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [lawyerFilter, setLawyerFilter] = useState("");

  const { data: casesData, isLoading, error } = useGetAllCasesQuery({
    search: searchQuery,
    limit: 100,
  });
  const [archiveCaseMutation] = useArchiveCaseMutation();
  const [deleteCaseMutation] = useDeleteCaseMutation();

  const [showAddModal, setShowAddModal] = useState(false);
  const [editCaseData, setEditCaseData] = useState(null);
  const [viewCase, setViewCase] = useState(null);
  const [deleteCase, setdeleteCase] = useState(null);
  const [archiveCase, setarchiveCase] = useState(null);
  const [reminderCase, setReminderCase] = useState(null);
  const [hearingCase, setHearingCase] = useState(null);
  const [assignLawyerCase, setAssignLawyerCase] = useState(null);
  const [courtCaseIdCase, setCourtCaseIdCase] = useState(null);
  const [sessionCase, setSessionCase] = useState(null);

  const cases = React.useMemo(() => {
    if (!casesData?.data) return [];
    return casesData.data.map((c) => ({
      id: c._id,
      _id: c._id,
      caseNumber: c.caseNumber,
      caseType: c.caseType,
      status: c.status,
      courtCaseId: c.courtCaseId || "",
      client: {
        name: c.clientId?.name || "",
        contact: c.clientId?.contactNumber || "",
        email: c.clientId?.email || "",
        nationalId: c.clientId?.nationalId || "",
        address: c.clientId?.address || "",
        additionalInformation: c.clientId?.additionalInfo || "",
      },
      case: {
        caseNumber: c.caseNumber,
        courtCaseId: c.courtCaseId || "",
        caseType: c.caseType,
        description: c.caseDescription,
        assignedLawyer: c.assignedLawyer?.name || t("caseManagement.notAssigned"),
        assignedLawyerId: c.assignedLawyer?._id || "",
        approvingLawyer: c.approvingLawyer?.name || t("caseManagement.notAssigned"),
        approvingLawyerId: c.approvingLawyer?._id || "",
        hearingDate: c.hearingDate || "",
        filingDate: c.createdAt?.slice(0, 10) || "",
        status: c.status || t("caseManagement.status.pending"),
        stage: c.stages?.[0]?.stageType || t("caseManagement.stage.mainCase"),
        documents: c.documents || [],
      },
      clientId: c.clientId,
      stages: c.stages || [],
    }));
  }, [casesData, t]);

  const filteredCases = React.useMemo(() => {
    return cases.filter((c) => {
      const matchesStatus = !statusFilter || c.case.status === statusFilter;
      const matchesLawyer = !lawyerFilter || c.case.assignedLawyer === lawyerFilter;
      return matchesStatus && matchesLawyer;
    });
  }, [cases, statusFilter, lawyerFilter]);

  const handleDeleteCase = (caseId) => {
    const caseToDelete = cases.find((c) => c.id === caseId);
    setdeleteCase(caseToDelete);
  };

  const handleConfirmDelete = async () => {
    if (deleteCase) {
      try {
        await deleteCaseMutation(deleteCase.id).unwrap();
        toast.success(t("caseManagement.toast.deleted"));
        setdeleteCase(null);
      } catch (err) {
        toast.error(err?.data?.message || t("caseManagement.toast.deleteFailed"));
      }
    }
  };

  const handleArchiveCase = (caseId) => {
    const caseToArchive = cases.find((c) => c.id === caseId);
    setarchiveCase(caseToArchive);
  };

  const handleConfirmArchive = async () => {
    if (archiveCase) {
      try {
        await archiveCaseMutation(archiveCase.id).unwrap();
        toast.success(t("caseManagement.toast.archived"));
        setarchiveCase(null);
      } catch (err) {
        toast.error(err?.data?.message || t("caseManagement.toast.archiveFailed"));
      }
    }
  };

  const handleViewCase = (caseId) => {
    const caseToView = cases.find((c) => c.id === caseId);
    setViewCase(caseToView);
  };

  const handleFilterChange = useCallback((filters) => {
    setSearchQuery(filters.search || "");
    setStatusFilter(filters.status || "");
    setLawyerFilter(filters.lawyer || "");
  }, []);

  const handleClearFilters = useCallback(() => {
    setSearchQuery("");
    setStatusFilter("");
    setLawyerFilter("");
  }, []);

  const handleOpenAddModal = () => {
    setEditCaseData(null);
    setShowAddModal(true);
  };

  const handleEditCase = (caseId) => {
    const caseToEdit = cases.find((c) => c.id === caseId);
    setEditCaseData(caseToEdit);
    setShowAddModal(true);
  };

  const handleAddOrUpdateCase = () => {
    setShowAddModal(false);
    setEditCaseData(null);
  };

  return (
    <div className="space-y-6 lg:ml-[220px] rtl:lg:ml-0 rtl:lg:mr-[220px]">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-[#0B1F3B]">{t("caseManagement.title")}</h2>
          <p className="text-sm text-[#0B1F3B] mt-1">
            {t("caseManagement.casesFound", { count: filteredCases.length })}
          </p>
        </div>
        <button
          onClick={handleOpenAddModal}
          className="flex items-center cursor-pointer gap-2 px-4 py-2 bg-[#0B1F3B]  text-white rounded-lg font-medium transition-all duration-200 shadow-md"
        >
          <Plus size={20} />
          {t("caseManagement.buttons.addCase")}
        </button>
      </div>

      <CaseFilters
        onFilterChange={handleFilterChange}
        onClearFilters={handleClearFilters}
      />

      {isLoading && (
        <div className="text-center py-8">
          <div className="inline-block animate-spin rounded-full h-5 w-5 border-b-2 border-slate-800"></div>
          <p className="text-xs">{t("caseManagement.loading")}</p>
        </div>
      )}

      {error && (
        <div className="text-center py-8">
          <p className="text-red-600 text-xs font-medium">{t("caseManagement.error.title")}</p>
          <p className="text-red-500 text-xs mt-1">
            {error?.data?.message || t("caseManagement.error.message")}
          </p>
        </div>
      )}

      {!isLoading && (
        <CaseTable
          cases={filteredCases}
          onEditCase={handleEditCase}
          onViewCase={handleViewCase}
          onDeleteCase={handleDeleteCase}
          onArchive={handleArchiveCase}
          onAddReminder={(c) => setReminderCase(c)}
          onScheduleHearing={(c) => setHearingCase(c)}
          onAssignLawyer={(c) => setAssignLawyerCase(c)}
          onUpdateCourtCaseId={(c) => setCourtCaseIdCase(c)}
          onManageSessions={(c) => setSessionCase(c)}
        />
      )}

      <ViewCaseModal caseData={viewCase} onClose={() => setViewCase(null)} />

      <CaseDeleteModal
        isOpen={!!deleteCase}
        caseItem={deleteCase}
        onClose={() => setdeleteCase(null)}
        onConfirm={handleConfirmDelete}
      />

      <ArchiveCaseModal
        isOpen={!!archiveCase}
        caseItem={archiveCase}
        onClose={() => setarchiveCase(null)}
        onConfirm={handleConfirmArchive}
      />

      <AddReminderModal
        isOpen={!!reminderCase}
        onClose={() => setReminderCase(null)}
        caseData={reminderCase}
      />

      <AddHearingDateModal
        isOpen={!!hearingCase}
        onClose={() => setHearingCase(null)}
        caseData={hearingCase}
      />

      <AssignLawyerModal
        isOpen={!!assignLawyerCase}
        onClose={() => setAssignLawyerCase(null)}
        caseData={assignLawyerCase}
      />

      <UpdateCourtCaseIdModal
        isOpen={!!courtCaseIdCase}
        onClose={() => setCourtCaseIdCase(null)}
        caseData={courtCaseIdCase}
      />

      <AddSessionModal
        isOpen={!!sessionCase}
        onClose={() => setSessionCase(null)}
        caseId={sessionCase?._id}
      />

      <AddCase
        isOpen={showAddModal}
        onClose={() => {
          setShowAddModal(false);
          setEditCaseData(null);
        }}
        onAddCase={handleAddOrUpdateCase}
        caseData={editCaseData}
      />
    </div>
  );
};

export default CaseManagement;
