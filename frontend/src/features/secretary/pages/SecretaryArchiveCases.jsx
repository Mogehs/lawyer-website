import React, { useState, useEffect } from "react";
import { Archive, Search } from "lucide-react";
import ViewCaseModal from "../components/SecretaryArchiveCases/ViewCaseModal";
import ArchiveDeleteModal from "../components/SecretaryArchiveCases/ArchiveDeleteModal";
import ArchiveTable from "../components/SecretaryArchiveCases/ArchiveTable";
import { useGetArchivedCasesQuery } from "../api/secretaryApi";

const SecretaryArchiveCases = () => {
  const [search, setSearch] = useState("");
  const [viewModal, setViewModal] = useState(null);
  const [deleteCaseModal, setDeleteCaseModal] = useState(null);
  const [archivedCases, setArchivedCases] = useState([]);

  // Fetch archived cases from API
  const { data: archiveData, isLoading, error } = useGetArchivedCasesQuery();

  // Update local state when API data changes
  useEffect(() => {
    if (archiveData?.data) {
      setArchivedCases(archiveData.data);
    }
  }, [archiveData]);

  // Filter cases based on search (API already returns archived cases)
  const filteredCases = archivedCases.filter((c) => {
    const searchLower = search.toLowerCase();
    const clientName = c.clientId?.name?.toLowerCase() || "";
    const caseNumber = c.caseNumber?.toLowerCase() || "";
    const caseType = c.caseType?.toLowerCase() || "";

    return (
      clientName.includes(searchLower) ||
      caseNumber.includes(searchLower) ||
      caseType.includes(searchLower)
    );
  });

  const handleDeleteCase = (caseId) => {
    setArchivedCases((prev) => prev.filter((c) => c._id !== caseId));
    setDeleteCaseModal(null);
  };

  return (
    <div className="space-y-6 lg:ml-[225px]">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold text-[#0B1F3B] flex items-center gap-2">
          <Archive size={28} className="text-[#0B1F3B]" />
          Archive
        </h2>
        <p className="text-sm text-gray-600 mt-1">
          View completed cases with all stages and documents
        </p>
      </div>

      {/* Search */}
      <div className="relative mb-4 max-w-md">
        <Search className="absolute left-2 top-2 text-[#0B1F3B]" size={14} />
        <input
          type="text"
          placeholder="Search by client or case number..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="pl-8 py-1.5 pr-2 w-full border border-[#0B1F3B] rounded bg-slate-50 focus:ring-1 focus:ring-[#0B1F3B] focus:border-[#0B1F3B] outline-none text-xs text-slate-800"
        />
      </div>

      {/* Loading & Error States */}
      {isLoading && (
        <div className="text-center py-8">
          <div className="inline-block animate-spin rounded-full h-6 w-6 border-b-2 border-blue-500"></div>
          <p className="text-xs text-slate-500 mt-2">
            Loading archived cases...
          </p>
        </div>
      )}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded p-3 text-center">
          <p className="text-xs text-red-600">
            Error: {error?.data?.message || "Failed to load archived cases"}
          </p>
        </div>
      )}

      {/* Table Component */}
      {!isLoading && (
        <ArchiveTable
          cases={filteredCases}
          onView={setViewModal}
          onDelete={setDeleteCaseModal}
        />
      )}

      {/* Modals */}
      {viewModal && (
        <ViewCaseModal
          viewModal={viewModal}
          setViewModal={setViewModal}
          setDeleteModal={setDeleteCaseModal}
        />
      )}

      {deleteCaseModal && (
        <ArchiveDeleteModal
          deleteCaseModal={deleteCaseModal}
          setDeleteCaseModal={setDeleteCaseModal}
          handleDeleteCase={handleDeleteCase}
        />
      )}
    </div>
  );
};

export default SecretaryArchiveCases;
