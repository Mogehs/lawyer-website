import { useState, useEffect } from "react";
import AddCaseModal from "../components/dashboardCaseManagement/AddCaseModal";
import CaseTimelineModal from "../components/dashboardCaseManagement/CaseTimelineModal";
import CasesTable from "../components/dashboardCaseManagement/CasesTable";
import CasesHeader from "../components/dashboardCaseManagement/CaseHeader";
import DeleteCaseModal from "../components/dashboardCaseManagement/DeleteCaseModal";
import { useGetAllCasesQuery } from "../api/directorApi";

const AllCases = () => {
  const { data, isLoading, isError } = useGetAllCasesQuery();
  const apiCases = data?.data || [];
  const [cases, setCases] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStage, setFilterStage] = useState("All");
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedCase, setSelectedCase] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(window.innerWidth >= 1024);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [caseToDelete, setCaseToDelete] = useState(null);

  useEffect(() => {
    const handleResize = () => {
      const desktop = window.innerWidth >= 1024;
      setSidebarOpen(desktop);
    };

    const handleSidebarToggle = () => {
      const sidebar = document.querySelector('aside');
      if (sidebar) {
        const isOpen = sidebar.classList.contains('w-64');
        setSidebarOpen(isOpen);
      }
    };

    window.addEventListener('resize', handleResize);

    const interval = setInterval(handleSidebarToggle, 100);

    return () => {
      window.removeEventListener('resize', handleResize);
      clearInterval(interval);
    };
  }, []);

  useEffect(() => {
    const formatted = apiCases.map((c) => ({
      ...c,
      clientName: c.clientId?.name || "N/A",
      lawyer: c.assignedLawyer?.name || "Not Assigned",
      stage: c.stages?.[0]?.status || "N/A",
      lastUpdated: new Date(c.updatedAt).toLocaleDateString(),
    }));
    setCases(formatted);
  }, [apiCases]);

  const filteredCases = cases.filter((c) => {
    const matchesSearch =
      c.clientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.caseNumber.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStage = filterStage === "All" || c.stage === filterStage;

    return matchesSearch && matchesStage;
  });

  const handleViewTimeline = (caseItem) => {
    setSelectedCase(caseItem);
  };

  const handleDeleteClick = (caseItem) => {
    setCaseToDelete(caseItem);
    setShowDeleteModal(true);
  };

  const handleConfirmDelete = (id) => {
    setCases((prev) => prev.filter((c) => c._id !== id));
    setShowDeleteModal(false);
  };

  return (
    <div
      className={`min-h-screen 
        px-3 sm:px-4 md:px-6 lg:px-2
        py-3 sm:py-2 md:py-5
        transition-all duration-300 ease-in-out
       ${sidebarOpen ? "lg:ml-64 md:ml-64 mr-20" : "lg:ml-20 md:ml-14"}`}
    >
      {/* Header */}
      <div className="mb-4 sm:mb-5 md:mb-6 lg:mb-8">
        <CasesHeader
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          filterStage={filterStage}
          setFilterStage={setFilterStage}
          onAddClick={() => setShowAddModal(true)}
        />
      </div>

      {/* Loading & Error */}
      {isLoading && <p className="text-center text-[#A48C65] py-10 text-xl">Loading cases...</p>}
      {isError && <p className="text-center text-[#A48C65] py-10 text-xl">Failed to load cases</p>}

      {/* Cases Table */}
      {!isLoading && !isError && (
        <CasesTable
          cases={filteredCases}
          onView={handleViewTimeline}
          onDelete={handleDeleteClick}
          sidebarOpen={sidebarOpen}
        />
      )}

      {/* Add Case Modal */}
      {showAddModal && (
        <div className={`fixed inset-0 flex items-center justify-center z-50 px-3 sm:px-4 md:px-6
          ${sidebarOpen ? "lg:pl-64" : "lg:pl-0"} transition-all duration-300`}>
          <AddCaseModal onCancel={() => setShowAddModal(false)} />
        </div>
      )}

      {/* Case Timeline Modal */}
      {selectedCase && (
        <CaseTimelineModal
          isOpen={!!selectedCase}
          onClose={() => setSelectedCase(null)}
          caseData={selectedCase}
        />
      )}

      {/* Delete Modal */}
      {showDeleteModal && (
        <DeleteCaseModal
          caseData={caseToDelete}
          onCancel={() => setShowDeleteModal(false)}
          onConfirm={() => handleConfirmDelete(caseToDelete?._id)}
        />
      )}
    </div>
  );
};

export default AllCases;
