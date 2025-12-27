import React, { useState, useEffect } from 'react';
import ArchiveFilters from '../components/DashboardArchive/ArchiveFilters';
import ArchiveTable from '../components/DashboardArchive/ArchiveTable';
import ArchiveViewModal from '../components/DashboardArchive/ArchiveViewModal';
import ArchiveDeleteModal from '../components/DashboardArchive/ArchiveDeleteModal';
import { useGetAllArchieveQuery } from '../api/directorApi';

const Archive = () => {
  const [filters, setFilters] = useState({
    searchClient: "",
    searchCaseId: "",
    stage: "",
    date: "",
    status: ""
  });
  const [page, setPage] = useState(1);
  const [limit] = useState(10);

  const { data, isLoading, isError, refetch } = useGetAllArchieveQuery({
    page,
    limit,
    search: filters.searchClient || filters.searchCaseId
  });

  const archives = data?.data || [];
  const totalPages = data?.totalPages || 1;

  const [selectedArchive, setSelectedArchive] = useState(null);
  const [archiveToDelete, setArchiveToDelete] = useState(null);
  const [isViewModalOpen, setViewModalOpen] = useState(false);
  const [isDeleteModalOpen, setDeleteModalOpen] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(window.innerWidth >= 1024);
  const [showFilters, setShowFilters] = useState(false);

  // Responsive sidebar
  useEffect(() => {
    const handleResize = () => setSidebarOpen(window.innerWidth >= 1024);
    const handleSidebarToggle = () => {
      const sidebar = document.querySelector('aside');
      if (sidebar) setSidebarOpen(sidebar.classList.contains('w-64'));
    };
    window.addEventListener('resize', handleResize);
    const interval = setInterval(handleSidebarToggle, 100);
    return () => {
      window.removeEventListener('resize', handleResize);
      clearInterval(interval);
    };
  }, []);

  const openViewModal = (archive) => {
    setSelectedArchive(archive);
    setViewModalOpen(true);
  };
  const openDeleteModal = (archive) => {
    setArchiveToDelete(archive);
    setDeleteModalOpen(true);
  };
  const closeModals = () => {
    setViewModalOpen(false);
    setDeleteModalOpen(false);
    setSelectedArchive(null);
    setArchiveToDelete(null);
  };
  const handleDeleteConfirm = () => {
    if (archiveToDelete) {
      closeModals();
      refetch();
    }
  };

  const handleFilterChange = (key, value) =>
    setFilters((prev) => ({ ...prev, [key]: value }));
  const clearFilters = () =>
    setFilters({ searchClient: "", searchCaseId: "", stage: "", date: "", status: "" });

  const exportToCSV = () => {
    const headers = ["Archive ID", "Case ID", "Client", "Stage", "Lawyer", "Submitted On", "Status", "Description"];
    const csvContent = [
      headers.join(","),
      ...archives.map((archive) => {
        const finalStage = archive.stages?.[archive.stages.length - 1] || {};
        return [
          archive.archiveId,
          archive.id,
          `"${archive.client}"`,
          finalStage.stage || "",
          `"${archive.lawyers?.join(", ") || ""}"`,
          finalStage.submittedOn || "",
          archive.status || "",
          `"${finalStage.description || ""}"`
        ].join(",");
      })
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `archived-cases-${new Date().toISOString().split('T')[0]}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  };

  if (isLoading)
    return <p className="text-center text-[#494C52] mt-20">Loading archived cases...</p>;
  if (isError)
    return <p className="text-center text-[#0B1F3B] mt-20">Failed to load archived cases.</p>;

  return (
    <div className={`min-h-screen transition-all duration-300 ease-in-out pt-16 px-3 sm:px-4 md:px-6 lg:px-10
      ${sidebarOpen ? 'lg:ml-64 md:ml-64' : 'lg:ml-50 md:ml-15'}
    `}>
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 mb-6">
        <div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-[#0B1F3B]">Archived Cases</h2>
          <p className="text-slate-600 mt-1">{archives.length} case{archives.length !== 1 ? 's' : ''} found</p>
        </div>
        <div className="flex flex-wrap gap-2 mt-2 md:mt-0">
          <button
            onClick={exportToCSV}
            className="flex items-center gap-2 px-4 py-2 text-[#0B1F3B] font-medium rounded-lg bg-white border border-[#0B1F3B] hover:bg-[#0B1F3B] hover:text-white transition-all duration-200"
          >
            Export CSV
          </button>
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center gap-2 px-4 py-2 bg-[#1C283C] text-[#fe9800e5] rounded-lg hover:bg-[#0B1F3B] hover:text-white transition-colors md:hidden"
          >
            Filters
          </button>
        </div>
      </div>

      {/* Filters */}
      <ArchiveFilters
        filters={filters}
        onFilterChange={handleFilterChange}
        onClearFilters={clearFilters}
        showFilters={showFilters}
      />

      {/* Table */}
      <div className="overflow-x-auto">
        <ArchiveTable
          archives={archives}
          onView={openViewModal}
          onDelete={openDeleteModal}
          sidebarOpen={sidebarOpen}
        />
      </div>

      {/* Modals */}
      <ArchiveViewModal isOpen={isViewModalOpen} archive={selectedArchive} onClose={closeModals} />
      <ArchiveDeleteModal isOpen={isDeleteModalOpen} archive={archiveToDelete} onClose={closeModals} onConfirm={handleDeleteConfirm} />

      {/* Pagination */}
      <div className="flex flex-wrap justify-end gap-2 mt-6">
        <button
          disabled={page <= 1}
          onClick={() => setPage(prev => Math.max(prev - 1, 1))}
          className="px-4 py-2 bg-white border border-[#a48c654f] text-gray-800 hover:bg-[#0B1F3B] hover:text-white transition-all duration-200 rounded disabled:opacity-50"
        >
          Previous
        </button>
        <span className="px-4 py-2">{page} / {totalPages}</span>
        <button
          disabled={page >= totalPages}
          onClick={() => setPage(prev => Math.min(prev + 1, totalPages))}
          className="px-4 py-2 bg-white border border-[#0B1F3B] text-gray-800 hover:bg-[#0B1F3B] hover:text-white transition-all duration-200 rounded disabled:opacity-50"
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default Archive;
