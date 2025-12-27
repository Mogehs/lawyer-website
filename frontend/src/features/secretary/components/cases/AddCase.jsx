import React, { useState, useEffect, useMemo } from "react";
import { X, Search } from "lucide-react";
import CaseDetailsForm from "./CaseDetailsForm";
import DocumentDetailsForm from "./DocumentDetailsForm";
import {
  useCreateCaseMutation,
  useUpdateCaseMutation,
  useGetAllClientsQuery,
} from "../../api/secretaryApi";
import { toast } from "react-toastify";

const AddCase = ({ isOpen, onClose, onAddCase, caseData }) => {
  const [selectedClientId, setSelectedClientId] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");

  // Memoize caseData ID to prevent unnecessary re-renders
  const caseId = useMemo(() => caseData?._id || caseData?.id, [caseData]);


  const [caseInfo, setCaseInfo] = useState({
    caseType: "",
    description: "",
    assignedLawyer: "",
    approvingLawyer: "",
    filingDate: new Date().toISOString().slice(0, 10),
    status: "Pending",
    stage: "Main Case",
    documents: [],
  });

  // Reset state when modal opens/closes
  useEffect(() => {
    if (isOpen) {
      if (caseData) {
        // Editing existing case
        setSelectedClientId(caseData.client?._id || null);
        setCaseInfo({
          ...caseData.case,
          assignedLawyer:
            caseData.case.assignedLawyerId ||
            caseData.case.assignedLawyer ||
            "",
          approvingLawyer:
            caseData.case.approvingLawyerId ||
            caseData.case.approvingLawyer ||
            "",
        });
      } else {
        // Creating new case - reset everything
        setSelectedClientId(null);
        setSearchQuery("");
        setCaseInfo({
          caseType: "",
          description: "",
          assignedLawyer: "",
          approvingLawyer: "",
          filingDate: new Date().toISOString().slice(0, 10),
          status: "Pending",
          stage: "Main Case",
          documents: [],
        });
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen, caseId]);

  const handleCaseChange = (e) =>
    setCaseInfo({ ...caseInfo, [e.target.name]: e.target.value });

  const handleDocumentChange = (e) => {
    if (e.target.name === "documents") {
      setCaseInfo((prev) => ({
        ...prev,
        documents: e.target.value,
      }));
    }
  };

  const [createCase, { isLoading: isCreating }] = useCreateCaseMutation();
  const [updateCase, { isLoading: isUpdating }] = useUpdateCaseMutation();
  const { data: clientsData } = useGetAllClientsQuery();

  // Filter clients based on search query
  const filteredClients = useMemo(() => {
    if (!clientsData?.clients) return [];
    if (!searchQuery.trim()) return clientsData.clients;

    const query = searchQuery.toLowerCase();
    return clientsData.clients.filter(
      (client) =>
        client.name?.toLowerCase().includes(query) ||
        client.email?.toLowerCase().includes(query) ||
        client.contactNumber?.toLowerCase().includes(query) ||
        client.nationalId?.toLowerCase().includes(query)
    );
  }, [clientsData, searchQuery]);

  // Get selected client details
  const selectedClient = useMemo(() => {
    if (!selectedClientId || !clientsData?.clients) return null;
    return clientsData.clients.find((c) => c._id === selectedClientId);
  }, [selectedClientId, clientsData]);

  const handleSubmit = async () => {
    try {
      if (caseData) {
        // Update existing case
        const updatePayload = {
          id: caseData._id || caseData.id,
          data: {
            caseType: caseInfo.caseType,
            caseDescription: caseInfo.description,
            assignedLawyer: caseInfo.assignedLawyer || null,
            documents: caseInfo.documents,
          },
        };
        await updateCase(updatePayload).unwrap();
        toast.success("Case updated successfully!");
      } else {
        // Create new case - validate client selection
        if (!selectedClientId) {
          toast.error("Please select a client from the list");
          return;
        }

        // Validate required fields
        if (!caseInfo.caseType) {
          toast.error("Please select a case type");
          return;
        }

        if (!caseInfo.assignedLawyer) {
          toast.error("Please assign a draft lawyer to the case");
          return;
        }

        if (!caseInfo.approvingLawyer) {
          toast.error("Please assign an approving lawyer to the case");
          return;
        }

        // Create the case
        await createCase({
          clientId: selectedClientId,
          caseType: caseInfo.caseType,
          caseDescription: caseInfo.description,
          assignedLawyer: caseInfo.assignedLawyer,
          approvingLawyer: caseInfo.approvingLawyer,
          stage: caseInfo.stage,
          documents: caseInfo.documents || [],
        }).unwrap();
        toast.success(
          "Case created successfully. WhatsApp notifications sent to assigned lawyer."
        );
      }
      onAddCase();
      onClose();
      setSelectedClientId(null);
      setSearchQuery("");
    } catch (error) {
      toast.error(error?.data?.message || "Failed to save case");
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className="bg-white rounded-lg shadow-2xl w-full max-w-5xl max-h-[95vh] flex flex-col">
        {/* Fixed Header */}
        <div className="bg-[#0B1F3B] px-6 py-4 rounded-t-lg">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-white">
              {caseData ? "Edit Case" : "Add New Case"}
            </h2>
            <button
              onClick={onClose}
              className="p-2 hover:bg-white/20 cursor-pointer rounded-lg transition"
            >
              <X className="w-5 h-5 text-white" />
            </button>
          </div>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto px-6 py-6">
          {/* Client Selection Section */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-3">
              Select Client
            </h3>

            {/* Search Bar */}
            <div className="relative mb-4">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="text"
                placeholder="Search by name, email, phone, or national ID..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0B1F3B] focus:border-transparent"
              />
            </div>

            {/* Client Selection Grid */}
            <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 max-h-48 overflow-y-auto">
              {filteredClients.length === 0 ? (
                <p className="text-center text-gray-500 py-4">
                  {searchQuery ? "No clients found matching your search" : "No clients available"}
                </p>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {filteredClients.map((client) => (
                    <div
                      key={client._id}
                      onClick={() => setSelectedClientId(client._id)}
                      className={`p-3 border-2 rounded-lg cursor-pointer transition-all ${
                        selectedClientId === client._id
                          ? "border-[#0B1F3B]/10"
                          : "border-gray-200 hover:border-[#0B1F3B] bg-white"
                      }`}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <p className="font-semibold text-gray-800">{client.name}</p>
                          <p className="text-sm text-gray-600">{client.email}</p>
                          <p className="text-sm text-gray-500">{client.contactNumber}</p>
                        </div>
                        {selectedClientId === client._id && (
                          <div className="w-5 h-5 rounded-full bg-[#0B1F3B] flex items-center justify-center">
                            <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                            </svg>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Selected Client Info */}
            {selectedClient && (
              <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <p className="text-sm font-semibold text-gray-700 mb-2">Selected Client:</p>
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div>
                    <span className="text-gray-600">Name:</span>
                    <span className="ml-2 font-medium text-gray-800">{selectedClient.name}</span>
                  </div>
                  <div>
                    <span className="text-gray-600">Email:</span>
                    <span className="ml-2 font-medium text-gray-800">{selectedClient.email}</span>
                  </div>
                  <div>
                    <span className="text-gray-600">Phone:</span>
                    <span className="ml-2 font-medium text-gray-800">{selectedClient.contactNumber}</span>
                  </div>
                  <div>
                    <span className="text-gray-600">National ID:</span>
                    <span className="ml-2 font-medium text-gray-800">{selectedClient.nationalId}</span>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Case Details Section */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-3">
              Case Details
            </h3>
            <CaseDetailsForm
              caseInfo={caseInfo}
              onChange={handleCaseChange}
              isEditMode={!!caseData}
            />
          </div>

          {/* Documents Section */}
          <div>
            <h3 className="text-lg font-semibold text-gray-800 mb-3">
              Documents
            </h3>
            <DocumentDetailsForm
              caseInfo={caseInfo}
              onChange={handleDocumentChange}
            />
          </div>
        </div>

        {/* Fixed Footer */}
        <div className="sticky bottom-0 bg-white border-t border-gray-200 px-6 py-4 rounded-b-lg">
          <div className="flex justify-end gap-3">
            <button
              onClick={onClose}
              className="px-6 py-2.5 cursor-pointer bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors font-medium"
            >
              Cancel
            </button>
            <button
              onClick={handleSubmit}
              disabled={isCreating || isUpdating || (!caseData && !selectedClientId)}
              className="px-6 py-2.5 cursor-pointer bg-[#0B1F3B] text-white rounded-lg  transition-all disabled:opacity-50 disabled:cursor-not-allowed font-medium"
            >
              {isCreating || isUpdating ? (
                <span className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Saving...
                </span>
              ) : (
                caseData ? "Update Case" : "Create Case"
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddCase;
