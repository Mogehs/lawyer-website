import { useState } from "react";

import ArchiveHeader from "../components/LawyerArchive/ArchiveHeader";
import ArchiveSearch from "../components/LawyerArchive/ArchiveSearch";
import ArchiveTable from "../components/LawyerArchive/ArchiveTable";
import ArchiveModal from "../components/LawyerArchive/ArchiveModal";
import ArchiveDeleteModal from "../components/LawyerArchive/ArchiveDeleteModal";

import { useGetMyArchiveQuery } from "../api/lawyerApi";

export default function LawyerArchive() {
  const [search, setSearch] = useState("");
  const [selectedCase, setSelectedCase] = useState(null);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [caseToDelete, setCaseToDelete] = useState(null);

  const { data, isLoading, isError } = useGetMyArchiveQuery({
    search: search || undefined,
  });

  const archivedCases = data?.data || [];

  const filteredCases = archivedCases.filter(
    (c) =>
      c.caseNumber?.toLowerCase().includes(search.toLowerCase()) ||
      c.clientId?.name?.toLowerCase().includes(search.toLowerCase()) ||
      (c.archiveReference &&
        c.archiveReference.toLowerCase().includes(search.toLowerCase()))
  );

  const handleDeleteClick = (c) => {
    setCaseToDelete(c);
    setDeleteModalOpen(true);
  };

  const handleConfirmDelete = () => {
    if (caseToDelete) {
      // TODO: Implement delete API call here when backend is ready
      // For now, just close the modal
      console.log("Delete functionality to be implemented");
    }
    setDeleteModalOpen(false);
    setCaseToDelete(null);
  };

  return (
    <div className="space-y-6 lg:ml-[220px]">
      <ArchiveHeader caseCount={filteredCases.length} />

      <ArchiveSearch search={search} onSearchChange={setSearch} />

      <ArchiveTable
        cases={filteredCases}
        loading={isLoading}
        onViewCase={setSelectedCase}
        onDeleteCase={handleDeleteClick}
      />

      {/* View Modal */}
      {selectedCase && (
        <ArchiveModal
          caseData={selectedCase}
          onClose={() => setSelectedCase(null)}
        />
      )}

      {/* Delete Modal */}
      {deleteModalOpen && (
        <ArchiveDeleteModal
          caseToDelete={caseToDelete}
          onClose={() => setDeleteModalOpen(false)}
          onConfirm={handleConfirmDelete}
        />
      )}

      {isError && (
        <p className="text-red-500 mt-4 text-center">
          Failed to load archived cases.
        </p>
      )}
    </div>
  );
}
