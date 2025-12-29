import React, { useState, useEffect, useMemo } from "react";
import { X, Search } from "lucide-react";
import { useTranslation } from "react-i18next";
import CaseDetailsForm from "./CaseDetailsForm";
import DocumentDetailsForm from "./DocumentDetailsForm";
import {
  useCreateCaseMutation,
  useUpdateCaseMutation,
  useGetAllClientsQuery,
} from "../../api/secretaryApi";
import { toast } from "react-toastify";

const AddCase = ({ isOpen, onClose, onAddCase, caseData }) => {
  const { t } = useTranslation("AddCase2");
  const [selectedClientId, setSelectedClientId] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");

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
        // Creating new case
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
  }, [isOpen, caseId, caseData]);

  const handleCaseChange = (e) =>
    setCaseInfo({ ...caseInfo, [e.target.name]: e.target.value });

  const handleDocumentChange = (e) => {
    if (e.target.name === "documents") {
      setCaseInfo((prev) => ({ ...prev, documents: e.target.value }));
    }
  };

  const [createCase, { isLoading: isCreating }] = useCreateCaseMutation();
  const [updateCase, { isLoading: isUpdating }] = useUpdateCaseMutation();
  const { data: clientsData } = useGetAllClientsQuery();

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

  const selectedClient = useMemo(() => {
    if (!selectedClientId || !clientsData?.clients) return null;
    return clientsData.clients.find((c) => c._id === selectedClientId);
  }, [selectedClientId, clientsData]);

  const handleSubmit = async () => {
    try {
      if (caseData) {
        // Update case
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
        toast.success(t("addCaseModal.notifications.updateSuccess"));
      } else {
        // Create new case validation
        if (!selectedClientId) {
          toast.error(t("addCaseModal.validation.selectClient"));
          return;
        }
        if (!caseInfo.caseType) {
          toast.error(t("addCaseModal.validation.caseType"));
          return;
        }
        if (!caseInfo.assignedLawyer) {
          toast.error(t("addCaseModal.validation.assignedLawyer"));
          return;
        }
        if (!caseInfo.approvingLawyer) {
          toast.error(t("addCaseModal.validation.approvingLawyer"));
          return;
        }

        await createCase({
          clientId: selectedClientId,
          caseType: caseInfo.caseType,
          caseDescription: caseInfo.description,
          assignedLawyer: caseInfo.assignedLawyer,
          approvingLawyer: caseInfo.approvingLawyer,
          stage: caseInfo.stage,
          documents: caseInfo.documents || [],
        }).unwrap();
        toast.success(t("addCaseModal.notifications.createSuccess"));
      }
      onAddCase();
      onClose();
      setSelectedClientId(null);
      setSearchQuery("");
    } catch (error) {
      toast.error(error?.data?.message || t("addCaseModal.validation.saveError"));
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className="bg-white rounded-lg shadow-2xl w-full max-w-5xl max-h-[95vh] flex flex-col">
        {/* Header */}
        <div className="bg-[#0B1F3B] px-6 py-4 rounded-t-lg flex justify-between items-center">
          <h2 className="text-xl font-bold text-white">
            {caseData ? t("addCaseModal.titles.edit") : t("addCaseModal.titles.add")}
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-white/20 cursor-pointer rounded-lg transition"
          >
            <X className="w-5 h-5 text-white" />
          </button>
        </div>

        {/* Scrollable Body */}
        <div className="flex-1 overflow-y-auto px-6 py-6">
          {/* Client Section */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-3">
              {t("addCaseModal.sections.selectClient.title")}
            </h3>

            <div className="relative mb-4">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="text"
                placeholder={t("addCaseModal.sections.selectClient.searchPlaceholder")}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0B1F3B] focus:border-transparent"
              />
            </div>

            <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 max-h-48 overflow-y-auto">
              {filteredClients.length === 0 ? (
                <p className="text-center text-gray-500 py-4">
                  {searchQuery
                    ? t("addCaseModal.sections.selectClient.noMatch")
                    : t("addCaseModal.sections.selectClient.noClients")}
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

            {selectedClient && (
              <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <p className="text-sm font-semibold text-gray-700 mb-2">
                  {t("addCaseModal.sections.selectClient.selectedClient")}
                </p>
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div><span className="text-gray-600">{t("addCaseModal.sections.selectClient.title")}:</span> <span className="ml-2 font-medium text-gray-800">{selectedClient.name}</span></div>
                  <div><span className="text-gray-600">Email:</span> <span className="ml-2 font-medium text-gray-800">{selectedClient.email}</span></div>
                  <div><span className="text-gray-600">Phone:</span> <span className="ml-2 font-medium text-gray-800">{selectedClient.contactNumber}</span></div>
                  <div><span className="text-gray-600">National ID:</span> <span className="ml-2 font-medium text-gray-800">{selectedClient.nationalId}</span></div>
                </div>
              </div>
            )}
          </div>

          {/* Case Details */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-3">
              {t("addCaseModal.sections.caseDetails.title")}
            </h3>
            <CaseDetailsForm
              caseInfo={caseInfo}
              onChange={handleCaseChange}
              isEditMode={!!caseData}
            />
          </div>

          {/* Documents */}
          <div>
            <h3 className="text-lg font-semibold text-gray-800 mb-3">
              {t("addCaseModal.sections.documents.title")}
            </h3>
            <DocumentDetailsForm
              caseInfo={caseInfo}
              onChange={handleDocumentChange}
            />
          </div>
        </div>

        {/* Footer */}
        <div className="sticky bottom-0 bg-white border-t border-gray-200 px-6 py-4 rounded-b-lg">
          <div className="flex justify-end gap-3">
            <button
              onClick={onClose}
              className="px-6 py-2.5 cursor-pointer bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors font-medium"
            >
              {t("addCaseModal.buttons.cancel")}
            </button>
            <button
              onClick={handleSubmit}
              disabled={isCreating || isUpdating || (!caseData && !selectedClientId)}
              className="px-6 py-2.5 cursor-pointer bg-[#0B1F3B] text-white rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed font-medium"
            >
              {isCreating || isUpdating ? (
                <span className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  {t("addCaseModal.buttons.saving")}
                </span>
              ) : (
                caseData ? t("addCaseModal.buttons.update") : t("addCaseModal.buttons.create")
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddCase;
