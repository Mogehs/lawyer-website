import { useState, useMemo, useEffect } from "react";
import { FiSearch } from "react-icons/fi";
import { toast } from "react-toastify";

import ApprovedLawyerCasesTable from "../components/ApprovedLawyerPage/ApprovedLawyerCasesTable";
import ApprovedLawyerViewModal from "../components/ApprovedLawyerPage/ApprovedLawyerViewModal";
import ModificationModal from "../components/ApprovedLawyerPage/ModificationModal";
import DeleteModal from "../components/ApprovedLawyerPage/DeleteModal";
import { usePendingApprovalsQuery, useRequestModificationBALMutation, useUpdateCaseApprovalMutation } from "../api/approvedLawyerApi";
export default function ApprovedLawyerPage() {
  const { data, error, isLoading } = usePendingApprovalsQuery();
  const [updateCaseApproval] = useUpdateCaseApprovalMutation();
  const [requestModificationBAL] = useRequestModificationBALMutation();

  const [sidebarOpen, setSidebarOpen] = useState(window.innerWidth >= 1024);
  const [cases, setCases] = useState([]);

  const [selectedCase, setSelectedCase] = useState(null);
  const [caseToDelete, setCaseToDelete] = useState(null);

  const [isModificationModalOpen, setIsModificationModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  const [filterStage, setFilterStage] = useState("");
  const [search, setSearch] = useState("");

  const [modificationMessage, setModificationMessage] = useState("");

  const STAGES = ["Main", "Appeal", "Cassation"];

  useEffect(() => {
    if (data?.data) {
      setCases(data.data);
    }
  }, [data]);

  useEffect(() => {
    const handleResize = () => {
      setSidebarOpen(window.innerWidth >= 1024);
    };

    const handleSidebarToggle = () => {
      const sidebar = document.querySelector("aside");
      if (sidebar) {
        setSidebarOpen(sidebar.classList.contains("w-64"));
      }
    };

    window.addEventListener("resize", handleResize);
    const interval = setInterval(handleSidebarToggle, 100);

    return () => {
      window.removeEventListener("resize", handleResize);
      clearInterval(interval);
    };
  }, []);

  const filteredCases = useMemo(() => {
    return cases.filter((c) => {
      const matchStage = filterStage === "" || c.currentStage === filterStage;
      const matchSearch =
        c.caseNumber?.toLowerCase().includes(search.toLowerCase()) ||
        c.clientId?.name?.toLowerCase().includes(search.toLowerCase()) ||
        c.clientId?.email?.toLowerCase().includes(search.toLowerCase()) ||
        c.clientId?.contactNumber?.toLowerCase().includes(search.toLowerCase());

      return matchStage && matchSearch;
    });
  }, [cases, filterStage, search]);

  const openModal = (c) => setSelectedCase(c);
  const closeModal = () => setSelectedCase(null);

  const openModificationModal = () => {
    setModificationMessage("");
    setIsModificationModalOpen(true);
  };

  const closeModificationModal = () => setIsModificationModalOpen(false);

  const openDeleteModal = (c) => {
    setCaseToDelete(c);
    setIsDeleteModalOpen(true);
  };

  const closeDeleteModal = () => {
    setCaseToDelete(null);
    setIsDeleteModalOpen(false);
  };

  const handleApproval = (id, status, note = "") => {
    updateCaseApproval({
      caseId: id,
      approvalData: { status, note },
    });

    closeModal();
    closeModificationModal();
  };

  const sendModificationRequest = async() => {
    const msg =
      modificationMessage.trim() === ""
        ? "Modification requested"
        : modificationMessage;

    console.log("message for modification....", msg);
    console.log("selected case....", selectedCase._id);

    const res = await requestModificationBAL({
      id: selectedCase._id,
      modificationData: { note: msg },
    });
    toast.success(res?.data?.message || "Modification request sent.");
    closeModal();
    closeModificationModal();

    // FIXED HERE
    // handleApproval(selectedCase._id, "Modification Requested", msg);
  };


  const handleDelete = (id) => {
    setCases((prev) => prev.filter((c) => c.id !== id));
    closeDeleteModal();
  };

  if (isLoading)
    return <p className="mt-20 text-center text-xl font-semibold">Loading...</p>;

  if (error)
    return (
      <p className="mt-20 text-center text-red-500 text-xl">
        Failed to load data.
      </p>
    );

  return (
    <div
      className={`mt-20 min-h-screen px-3 mr-20 sm:px-4 md:px-6 lg:px-2 py-3 sm:py-4 md:py-5 transition-all duration-300 ease-in-out ${sidebarOpen ? "lg:ml-64 md:ml-64" : "lg:ml-20 md:ml-14"
        }`}
    >
      <h1 className="text-2xl sm:text-3xl font-bold text-[#494C52]">
        Memorandums Management
      </h1>
      <p className="text-gray-600 mt-2 text-sm sm:text-base mb-4">
        Manage and review all case memorandums efficiently.
      </p>

      {/* SEARCH + FILTER */}
      <div className="flex flex-col sm:flex-row gap-4 mb-6 items-center w-full">
        <div className="relative flex-1 w-full md:w-[200px]">
          <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-[#494C52] text-lg" />
          <input
            type="text"
            placeholder="Search by case #, client name, email, or phone..."
            className="w-full lg:w-[680px] pl-12 pr-4 py-3 border border-gray-300 rounded-xl shadow shadow-[#494C52] text-gray-700 placeholder-[#494C52]
              focus:outline-none focus:ring-2 focus:ring-[#A48C65] focus:border-[#A48C65] transition-all duration-300"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <div className="w-full sm:w-48">
          <select
            value={filterStage}
            onChange={(e) => setFilterStage(e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-xl shadow-sm text-[#494C52]
              focus:outline-none focus:ring-2 focus:ring-[#A48C65] focus:border-[#A48C65] transition-all duration-300"
          >
            <option value="">All Stages</option>
            {STAGES.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* CASES TABLE */}
      <ApprovedLawyerCasesTable
        cases={filteredCases}
        openModal={openModal}
        openDeleteModal={openDeleteModal}
      />

      {/* VIEW MODAL */}
      {selectedCase && (
        <ApprovedLawyerViewModal
          selectedCase={selectedCase}
          closeModal={closeModal}
          openModificationModal={openModificationModal}
          handleApproval={handleApproval}
        />
      )}

      {/* MODIFICATION MODAL */}
      <ModificationModal
        selectedCase={selectedCase}
        isOpen={isModificationModalOpen}
        closeModal={closeModificationModal}
        modificationMessage={modificationMessage}
        setModificationMessage={setModificationMessage}
        sendModificationRequest={sendModificationRequest}
      />

      {/* DELETE MODAL */}
      <DeleteModal
        selectedCase={caseToDelete}
        isOpen={isDeleteModalOpen}
        closeModal={closeDeleteModal}
        handleDelete={handleDelete}
      />
    </div>
  );
}
