import { useState, useMemo, useEffect } from "react";
import { FiSearch } from "react-icons/fi";
import { FileText } from "lucide-react";
import { toast } from "react-toastify";

import ApprovedLawyerCasesTable from "../components/ApprovedLawyerPage/ApprovedLawyerCasesTable";
import ApprovedLawyerViewModal from "../components/ApprovedLawyerPage/ApprovedLawyerViewModal";
import ModificationModal from "../components/ApprovedLawyerPage/ModificationModal";
import DeleteModal from "../components/ApprovedLawyerPage/DeleteModal";
import { usePendingApprovalsQuery, useRequestModificationBALMutation } from "../api/approvedLawyerApi";
export default function ApprovedLawyerPage() {
  const { data, error, isLoading } = usePendingApprovalsQuery();
  const [requestModificationBAL] = useRequestModificationBALMutation();

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

  const sendModificationRequest = async() => {
    const msg =
      modificationMessage.trim() === ""
        ? "Modification requested"
        : modificationMessage;

    const res = await requestModificationBAL({
      id: selectedCase._id,
      modificationData: { note: msg },
    });
    toast.success(res?.data?.message || "Modification request sent.");
    closeModal();
    closeModificationModal();
  };


  const handleDelete = (id) => {
    setCases((prev) => prev.filter((c) => c.id !== id));
    closeDeleteModal();
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-full">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-[#0B1F3B]"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-full">
        <div className="text-red-600 flex items-center gap-2">
          <p className="text-center text-red-500 text-xl">Failed to load data.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
            <FileText size={28} className="text-[#0B1F3B]" />
            Case Management
          </h1>
          <p className="text-sm text-gray-600 mt-1">Review and approve cases assigned to you by the secretary.</p>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow-md p-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* SEARCH */}
          <div className="relative">
            <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
            <input
              type="text"
              placeholder="Search by case #, client name, email, or phone..."
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0B1F3B] focus:border-transparent"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          {/* FILTER STAGE */}
          <select
            value={filterStage}
            onChange={(e) => setFilterStage(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0B1F3B] focus:border-transparent"
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
