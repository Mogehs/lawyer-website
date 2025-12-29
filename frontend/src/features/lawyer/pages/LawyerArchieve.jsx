import { useState } from "react";
import { useTranslation } from "react-i18next"; // Assuming you're using react-i18next for translations

import ArchiveHeader from "../components/LawyerArchive/ArchiveHeader";
import ArchiveSearch from "../components/LawyerArchive/ArchiveSearch";
import ArchiveTable from "../components/LawyerArchive/ArchiveTable";
import ArchiveModal from "../components/LawyerArchive/ArchiveModal";
import ArchiveDeleteModal from "../components/LawyerArchive/ArchiveDeleteModal";

import { useGetMyArchiveQuery } from "../api/lawyerApi";
import i18n from "../../../i18n";

export default function LawyerArchive() {
  const [search, setSearch] = useState("");
  const [selectedCase, setSelectedCase] = useState(null);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [caseToDelete, setCaseToDelete] = useState(null);

  const { t } = useTranslation("lawyerarchive"); // Initialize translation hook
const isRTL = i18n.dir() === "rtl";
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
    <div  className={`space-y-6 ${isRTL ? "lg:mr-[220px]" : "lg:ml-[220px]"}`}>
      <ArchiveHeader caseCount={filteredCases.length} />

      <ArchiveSearch search={search} onSearchChange={setSearch} placeholder={t("archiveSearch.placeholder")} />

      <ArchiveTable
        cases={filteredCases}
        loading={isLoading}
        onViewCase={setSelectedCase}
        onDeleteCase={handleDeleteClick}
        viewCaseLabel={t("archiveTable.viewCase")}
        deleteCaseLabel={t("archiveTable.deleteCase")}
      />

      {/* View Modal */}
      {selectedCase && (
        <ArchiveModal
          caseData={selectedCase}
          onClose={() => setSelectedCase(null)}
          caseDetailsLabel={t("archiveModal.caseDetails")}
          clientNameLabel={t("archiveModal.clientName")}
          caseNumberLabel={t("archiveModal.caseNumber")}
          archiveReferenceLabel={t("archiveModal.archiveReference")}
        />
      )}

      {/* Delete Modal */}
      {deleteModalOpen && (
        <ArchiveDeleteModal
          caseToDelete={caseToDelete}
          onClose={() => setDeleteModalOpen(false)}
          onConfirm={handleConfirmDelete}
          confirmDeleteLabel={t("archiveDeleteModal.confirmDelete")}
          cancelLabel={t("archiveDeleteModal.cancel")}
          confirmLabel={t("archiveDeleteModal.confirm")}
        />
      )}

      {isError && (
        <p className="text-red-500 mt-4 text-center">{t("error.loadingFailed")}</p>
      )}
    </div>
  );
}
