import React, { useState, useEffect, useRef, useMemo, useCallback } from "react";
import { X } from "lucide-react";
import ClientInfoForm from "./ClientInfoForm";
import CaseDetailsForm from "./CaseDetailsForm";
import DocumentDetailsForm from "./DocumentDetailsForm";
import {
  useCreateCaseMutation,
  useUpdateCaseMutation,
  useGetAllClientsQuery,
} from "../../api/secretaryApi";
import { toast } from "react-toastify";

const AddCase = ({ isOpen, onClose, onAddCase, caseData }) => {
  const [step, setStep] = useState(1);
  const prevOpenState = useRef(false);
  const [selectedClientId, setSelectedClientId] = useState(null);

  // Memoize caseData ID to prevent unnecessary re-renders
  const caseId = useMemo(() => caseData?._id || caseData?.id, [caseData]);

  const [clientInfo, setClientInfo] = useState({
    name: "",
    contact: "",
    email: "",
    nationalId: "",
    address: "",
    additionalInformation: "",
  });

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

  // Only run when modal transitions from closed to open
  useEffect(() => {
    // Detect when modal just opened
    if (isOpen && !prevOpenState.current) {
      if (caseData) {
        setClientInfo({ ...caseData.client });
        // When editing, use assignedLawyerId for the dropdown value
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
        // Reset for new case
        setClientInfo({
          name: "",
          contact: "",
          email: "",
          nationalId: "",
          address: "",
          additionalInformation: "",
        });
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
      setStep(1);
    }

    // Update ref for next render
    prevOpenState.current = isOpen;
  }, [isOpen, caseId]); // Use caseId instead of caseData

  const handleClientChange = (e) =>
    setClientInfo({ ...clientInfo, [e.target.name]: e.target.value });
  const handleCaseChange = (e) =>
    setCaseInfo({ ...caseInfo, [e.target.name]: e.target.value });

  // Memoize the callback to prevent recreation on every render
  const handleClientSelect = useCallback((clientId) => {
    setSelectedClientId(clientId);
  }, []);

  // Memoize document change handler to prevent infinite loop in DocumentDetailsForm
  const handleDocumentChange = useCallback((e) => {
    if (e.target.name === "documents") {
      setCaseInfo((prev) => ({
        ...prev,
        documents: e.target.value,
      }));
    }
  }, []);

  const [createCase, { isLoading: isCreating }] = useCreateCaseMutation();
  const [updateCase, { isLoading: isUpdating }] = useUpdateCaseMutation();
  const { data: clientsData } = useGetAllClientsQuery();

  const handleNext = () => setStep(step + 1);
  const handleBack = () => setStep(step - 1);

  const handleSubmit = async () => {
    try {
      if (caseData) {
        // Update existing case - use _id from MongoDB
        // Note: approvingLawyer is NOT updated - it's set only during creation
        const updatePayload = {
          id: caseData._id || caseData.id,
          data: {
            caseType: caseInfo.caseType,
            caseDescription: caseInfo.description,
            assignedLawyer: caseInfo.assignedLawyer || null,
            documents: caseInfo.documents,
          },
        };
        console.log("📤 Update Payload:", updatePayload);
        await updateCase(updatePayload).unwrap();
        toast.success("Case updated successfully!");
      } else {
        // Create new case - requires clientId
        let clientId = selectedClientId;

        // If no client selected from dropdown, try to find by email/contact
        if (!clientId) {
          const existingClient = clientsData?.clients?.find(
            (c) =>
              c.email === clientInfo.email ||
              c.contactNumber === clientInfo.contact
          );
          clientId = existingClient?._id;
        }

        // If still no client, show error
        if (!clientId) {
          toast.error(
            "Please select an existing client or create a new client first from the Clients page."
          );
          return;
        }

        // Validate required fields
        if (!caseInfo.caseType) {
          toast.error("Please select a case type");
          return;
        }

        if (!caseInfo.assignedLawyer) {
          toast.error("Please assign a lawyer to the case");
          return;
        }

        // Create the case with assigned lawyer only
        await createCase({
          clientId,
          caseType: caseInfo.caseType,
          caseDescription: caseInfo.description,
          assignedLawyer: caseInfo.assignedLawyer,
          documents: caseInfo.documents || [],
        }).unwrap();
        toast.success(
          "Case created successfully. WhatsApp notifications sent to assigned lawyer."
        );
      }
      onAddCase();
      onClose();
      setSelectedClientId(null);
    } catch (error) {
      toast.error(error?.data?.message || "Failed to save case");
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className="bg-white rounded-lg shadow-lg w-full max-w-2xl max-h-[90vh] flex flex-col">
        {/* Fixed Header */}
        <div className="bg-[#A48C65] px-4 py-3 rounded-t-lg">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-semibold text-white">
              {caseData ? "Edit Case" : "Add New Case"}
            </h2>
            <button
              onClick={onClose}
              className="p-1 hover:bg-[#7A6B3A] rounded transition"
            >
              <X className="w-4 h-4 text-white" />
            </button>
          </div>

          {/* Mini Step Indicator */}
          <div className="flex items-center justify-center mt-3 space-x-2">
            {/* Step 1 */}
            <div className="flex items-center">
              <div
                className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-medium ${
                  step >= 1
                    ? "bg-white text-slate-800"
                    : "bg-[#BCB083] text-black"
                }`}
              >
                1
              </div>
              <span
                className={`ml-1.5 text-[10px] ${
                  step >= 1 ? "text-white" : "text-white"
                }`}
              >
                Client
              </span>
            </div>

            {/* Connector */}
            <div
              className={`w-6 h-0.5 ${step >= 2 ? "bg-white" : "bg-white"}`}
            ></div>

            {/* Step 2 */}
            <div className="flex items-center">
              <div
                className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-medium ${
                  step >= 2
                    ? "bg-white text-slate-800"
                    : "bg-slate-600 text-white"
                }`}
              >
                2
              </div>
              <span
                className={`ml-1.5 text-[10px] ${
                  step >= 2 ? "text-white" : "text-white"
                }`}
              >
                Case
              </span>
            </div>

            {/* Connector */}
            <div
              className={`w-6 h-0.5 ${step >= 3 ? "bg-white" : "bg-white"}`}
            ></div>

            {/* Step 3 */}
            <div className="flex items-center">
              <div
                className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-medium ${
                  step >= 3
                    ? "bg-white text-slate-800"
                    : "bg-slate-600 text-white"
                }`}
              >
                3
              </div>
              <span
                className={`ml-1.5 text-[10px] ${
                  step >= 3 ? "text-white" : "text-white"
                }`}
              >
                Documents
              </span>
            </div>
          </div>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto px-6 py-4">
          {step === 1 && (
            <ClientInfoForm
              clientInfo={clientInfo}
              onChange={handleClientChange}
              onClientSelect={handleClientSelect}
              selectedClientId={selectedClientId}
            />
          )}

          {step === 2 && (
            <CaseDetailsForm
              caseInfo={caseInfo}
              onChange={handleCaseChange}
              isEditMode={!!caseData}
            />
          )}

          {step === 3 && (
            <DocumentDetailsForm
              caseInfo={caseInfo}
              onChange={handleDocumentChange}
            />
          )}
        </div>
        {/* Fixed Footer */}
        <div className="sticky bottom-0 bg-white border-t border-gray-200 px-6 py-4 rounded-b-2xl">
          <div className="flex justify-between">
            {step > 1 && (
              <button
                onClick={handleBack}
                className="px-6 py-2 bg-[#BCB083] text-gray-700 rounded-lg hover:bg-[#A48C65] transition-colors hover:text-white"
              >
                Back
              </button>
            )}

            <button
              onClick={step === 3 ? handleSubmit : handleNext}
              disabled={isCreating || isUpdating}
              className={`px-6 py-2 bg-[#A48C65] text-white rounded-lg hover:bg-[#A48C65] transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${
                step === 1 ? "ml-auto" : ""
              }`}
            >
              {step === 3 ? (
                isCreating || isUpdating ? (
                  <span className="flex items-center gap-2">
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    Saving...
                  </span>
                ) : (
                  "Save Case"
                )
              ) : (
                "Next"
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddCase;
