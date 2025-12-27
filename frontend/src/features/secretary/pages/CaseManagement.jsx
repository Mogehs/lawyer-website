import React, { useState, useCallback } from "react";
import { Plus } from "lucide-react";
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
import { toast } from "react-toastify";

const CaseManagement = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [lawyerFilter, setLawyerFilter] = useState("");

  // Fetch cases from API
  const {
    data: casesData,
    isLoading,
    error,
  } = useGetAllCasesQuery({
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
  const [sessionCase, setSessionCase] = useState(null); // For session management


  // Transform API data to component format
  const cases = React.useMemo(() => {
    if (!casesData?.data) return [];

    return casesData.data.map((c) => ({
      id: c._id,
      _id: c._id, // Keep original _id for API operations
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
        assignedLawyer: c.assignedLawyer?.name || "Not Assigned",
        assignedLawyerId: c.assignedLawyer?._id || "", // Keep lawyer ID for editing
        approvingLawyer: c.approvingLawyer?.name || "Not Assigned",
        approvingLawyerId: c.approvingLawyer?._id || "", // Keep approving lawyer ID for editing
        hearingDate: c.hearingDate || "",
        filingDate: c.createdAt?.slice(0, 10) || "",
        status: c.status || "Pending",
        stage: c.stages?.[0]?.stageType || "Main Case",
        documents: c.documents || [],
      },
      clientId: c.clientId,
      stages: c.stages || [],
    }));
  }, [casesData]);

  // Filter cases based on status and lawyer filters (client-side)
  const filteredCases = React.useMemo(() => {
    return cases.filter((c) => {
      const matchesStatus = !statusFilter || c.case.status === statusFilter;
      const matchesLawyer =
        !lawyerFilter || c.case.assignedLawyer === lawyerFilter;
      return matchesStatus && matchesLawyer;
    });
  }, [cases, statusFilter, lawyerFilter]);



  // Add delete handler function
  const handleDeleteCase = (caseId) => {
    const caseToDelete = cases.find((c) => c.id === caseId);
    setdeleteCase(caseToDelete);
  };

  // Add confirm delete function
  const handleConfirmDelete = async () => {
    if (deleteCase) {
      try {
        await deleteCaseMutation(deleteCase.id).unwrap();
        toast.success("Case deleted successfully");
        setdeleteCase(null);
      } catch (error) {
        toast.error(error?.data?.message || "Failed to delete case");
      }
    }
  };
  // Archive handlers
  const handleArchiveCase = (caseId) => {
    const caseToArchive = cases.find((c) => c.id === caseId);
    setarchiveCase(caseToArchive);
  };

  const handleConfirmArchive = async () => {
    if (archiveCase) {
      try {
        await archiveCaseMutation(archiveCase.id).unwrap();
        toast.success("Case archived successfully");
        setarchiveCase(null);
      } catch (error) {
        toast.error(error?.data?.message || "Failed to archive case");
      }
    }
  };

  const handleViewCase = (caseId) => {
    const caseToView = cases.find((c) => c.id === caseId);
    setViewCase(caseToView);
  };

  const handleFilterChange = useCallback((filters) => {
    // Update search query for API filtering
    setSearchQuery(filters.search || "");
    // Update status and lawyer for client-side filtering
    setStatusFilter(filters.status || "");
    setLawyerFilter(filters.lawyer || "");
  }, []);

  const handleClearFilters = useCallback(() => {
    setSearchQuery("");
    setStatusFilter("");
    setLawyerFilter("");
  }, []);

  // Open Add Modal
  const handleOpenAddModal = () => {
    setEditCaseData(null);
    setShowAddModal(true);
  };

  // Open Edit Modal
  const handleEditCase = (caseId) => {
    const caseToEdit = cases.find((c) => c.id === caseId);
    setEditCaseData(caseToEdit);
    setShowAddModal(true);
  };

  // Add or update case
  const handleAddOrUpdateCase = () => {
    // Just close the modal - RTK Query will automatically refetch and update
    setShowAddModal(false);
    setEditCaseData(null);
  };

  return (
    <div className="space-y-6 lg:ml-[220px]">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-[#0B1F3B]">
            Case Management
          </h2>
          <p className="text-sm text-[#0B1F3B] mt-1">
            {filteredCases.length} case{filteredCases.length !== 1 ? "s" : ""} found
          </p>
        </div>
        <button
          onClick={handleOpenAddModal}
          className="flex items-center cursor-pointer gap-2 px-4 py-2 bg-[#0B1F3B]  text-white rounded-lg font-medium transition-all duration-200 shadow-md"
        >
          <Plus size={20} />
          Add Case
        </button>
      </div>

      <CaseFilters
        onFilterChange={handleFilterChange}
        onClearFilters={handleClearFilters}
      />

      {/* Loading & Error States */}
      {isLoading && (
        <div className="text-center py-8">
          <div className="inline-block animate-spin rounded-full h-5 w-5 border-b-2 border-slate-800"></div>
        </div>
      )}
      {error && (
        <div className="text-center py-8">
          <p className="text-red-600 text-xs font-medium">
            Error loading cases
          </p>
          <p className="text-red-500 text-xs mt-1">
            {error?.data?.message || "Something went wrong"}
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
          onAddReminder={(caseData) => setReminderCase(caseData)}
          onScheduleHearing={(caseData) => setHearingCase(caseData)}
          onAssignLawyer={(caseData) => setAssignLawyerCase(caseData)}
          onUpdateCourtCaseId={(caseData) => setCourtCaseIdCase(caseData)}
          onManageSessions={(caseData) => setSessionCase(caseData)}
        />
      )}

      {/* VIEW MODAL */}
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

      {/* ADD REMINDER MODAL */}
      <AddReminderModal
        isOpen={!!reminderCase}
        onClose={() => setReminderCase(null)}
        caseData={reminderCase}
      />

      {/* ADD HEARING DATE MODAL */}
      <AddHearingDateModal
        isOpen={!!hearingCase}
        onClose={() => setHearingCase(null)}
        caseData={hearingCase}
      />

      {/* ASSIGN LAWYER MODAL */}
      <AssignLawyerModal
        isOpen={!!assignLawyerCase}
        onClose={() => setAssignLawyerCase(null)}
        caseData={assignLawyerCase}
      />

      {/* UPDATE COURT CASE ID MODAL */}
      <UpdateCourtCaseIdModal
        isOpen={!!courtCaseIdCase}
        onClose={() => setCourtCaseIdCase(null)}
        caseData={courtCaseIdCase}
      />

      {/* SESSION MANAGEMENT MODAL */}
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
