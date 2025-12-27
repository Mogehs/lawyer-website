import { useState } from "react";
import { FileText, Upload, Eye, CheckCircle, X } from "lucide-react";
import { useGetPendingSignatureCasesQuery, useApproveWithSignedDocumentMutation } from "../api/directorApi";
import { toast } from "react-toastify";

const PendingSignatureCases = () => {
  const [selectedCase, setSelectedCase] = useState(null);
  const [selectedStage, setSelectedStage] = useState(0);
  const [signedDocument, setSignedDocument] = useState(null);
  const [showUploadModal, setShowUploadModal] = useState(false);

  const { data, isLoading, error, refetch } = useGetPendingSignatureCasesQuery();
  const [approveWithSignedDocument, { isLoading: isApproving }] = useApproveWithSignedDocumentMutation();

  const cases = data?.data || [];

  const handleViewCase = (caseItem) => {
    setSelectedCase(caseItem);
    setSelectedStage(0);
  };

  const handleApproveClick = (caseItem) => {
    setSelectedCase(caseItem);
    setSelectedStage(0);
    setShowUploadModal(true);
  };

  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Validate file type (PDF only)
      if (file.type !== "application/pdf") {
        toast.error("Please upload a PDF file only");
        return;
      }
      setSignedDocument(file);
    }
  };

  const handleApproveSubmit = async () => {
    if (!signedDocument) {
      toast.error("Please select a signed document");
      return;
    }

    const formData = new FormData();
    formData.append("memorandum", signedDocument);
    formData.append("stageIndex", selectedStage);

    try {
      await approveWithSignedDocument({
        id: selectedCase._id,
        formData,
      }).unwrap();

      toast.success("Case approved with signed document!");
      setShowUploadModal(false);
      setSelectedCase(null);
      setSignedDocument(null);
      refetch();
    } catch (error) {
      toast.error(error?.data?.message || "Failed to approve case");
    }
  };

  const formatDate = (date) => {
    return new Intl.DateTimeFormat("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    }).format(new Date(date));
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#0B1F3B]"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <p className="text-red-600">Error loading cases</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
          <FileText size={28} className="text-[#0B1F3B]" />
          Pending Signature Cases
        </h1>
        <p className="text-sm text-gray-600 mt-1">
          Review and approve cases with signed documents
        </p>
      </div>

      {/* Cases List */}
      {cases.length === 0 ? (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gray-100 rounded-full mb-4">
            <FileText size={32} className="text-gray-400" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            No Cases Pending Signature
          </h3>
          <p className="text-sm text-gray-500">
            All cases have been reviewed and approved.
          </p>
        </div>
      ) : (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gradient-to-r from-gray-50 to-gray-100 border-b border-gray-200">
                <tr>
                  <th className="px-4 py-3 text-left text-[10px] font-semibold text-gray-600 uppercase tracking-wider">
                    Case Number
                  </th>
                  <th className="px-4 py-3 text-left text-[10px] font-semibold text-gray-600 uppercase tracking-wider">
                    Client
                  </th>
                  <th className="px-4 py-3 text-left text-[10px] font-semibold text-gray-600 uppercase tracking-wider">
                    Case Type
                  </th>
                  <th className="px-4 py-3 text-left text-[10px] font-semibold text-gray-600 uppercase tracking-wider">
                    Assigned Lawyer
                  </th>
                  <th className="px-4 py-3 text-left text-[10px] font-semibold text-gray-600 uppercase tracking-wider">
                    Approving Lawyer
                  </th>
                  <th className="px-4 py-3 text-left text-[10px] font-semibold text-gray-600 uppercase tracking-wider">
                    Updated
                  </th>
                  <th className="px-4 py-3 text-center text-[10px] font-semibold text-gray-600 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {cases.map((caseItem) => (
                  <tr key={caseItem._id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-4 py-4 whitespace-nowrap">
                      <span className="text-sm font-semibold text-gray-900">
                        {caseItem.caseNumber}
                      </span>
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap">
                      <p className="text-sm font-medium text-gray-900">
                        {caseItem.clientId?.name || "N/A"}
                      </p>
                      <p className="text-xs text-gray-500">
                        {caseItem.clientId?.email || ""}
                      </p>
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-700">
                      {caseItem.caseType}
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-700">
                      {caseItem.assignedLawyer?.name || "Unassigned"}
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-700">
                      {caseItem.approvingLawyer?.name || "Unassigned"}
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-600">
                      {formatDate(caseItem.updatedAt)}
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap text-center">
                      <div className="flex items-center justify-center gap-2">
                        <button
                          onClick={() => handleViewCase(caseItem)}
                          className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                          title="View Details"
                        >
                          <Eye size={16} />
                        </button>
                        <button
                          onClick={() => handleApproveClick(caseItem)}
                          className="flex items-center gap-1 px-3 py-1.5 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors text-xs font-medium"
                          title="Approve with Signed Document"
                        >
                          <CheckCircle size={14} />
                          Approve
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* View Case Modal */}
      {selectedCase && !showUploadModal && (
        <div className="fixed inset-0 bg-black/20 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
            {/* Header */}
            <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between rounded-t-xl">
              <h2 className="text-lg font-semibold text-gray-900">Case Details</h2>
              <button
                onClick={() => setSelectedCase(null)}
                className="hover:bg-gray-100 rounded-full p-2 transition-colors"
              >
                <X size={20} className="text-gray-500" />
              </button>
            </div>

            {/* Content */}
            <div className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-xs font-medium text-gray-500 uppercase tracking-wider">Case Number</p>
                  <p className="text-sm font-semibold text-gray-900 mt-1">{selectedCase.caseNumber}</p>
                </div>
                <div>
                  <p className="text-xs font-medium text-gray-500 uppercase tracking-wider">Case Type</p>
                  <p className="text-sm font-semibold text-gray-900 mt-1">{selectedCase.caseType}</p>
                </div>
                <div>
                  <p className="text-xs font-medium text-gray-500 uppercase tracking-wider">Client</p>
                  <p className="text-sm font-semibold text-gray-900 mt-1">{selectedCase.clientId?.name}</p>
                </div>
                <div>
                  <p className="text-xs font-medium text-gray-500 uppercase tracking-wider">Status</p>
                  <span className="inline-block px-2 py-1 bg-yellow-100 text-yellow-700 rounded text-xs font-medium mt-1">
                    {selectedCase.status}
                  </span>
                </div>
              </div>

              {/* Stages with Memorandums */}
              <div className="mt-6">
                <h3 className="text-sm font-semibold text-gray-900 mb-3">Case Stages & Memorandums</h3>
                {selectedCase.stages?.map((stage, index) => (
                  <div key={index} className="border border-gray-200 rounded-lg p-4 mb-3">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="text-sm font-semibold text-gray-800">
                        Stage {index + 1}: {stage.stage || "Main"}
                      </h4>
                      <span className="text-xs text-gray-500">{stage.status}</span>
                    </div>
                    {stage.memorandum && (
                      <div className="bg-gray-50 rounded p-3">
                        <p className="text-xs text-gray-600 mb-2">{stage.memorandum.content}</p>
                        {stage.memorandum.fileUrl && (
                          <a
                            href={stage.memorandum.fileUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-xs text-blue-600 hover:underline flex items-center gap-1"
                          >
                            <FileText size={12} />
                            View Memorandum
                          </a>
                        )}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Footer */}
            <div className="sticky bottom-0 bg-white px-6 py-4 flex justify-end gap-3 rounded-b-xl border-t border-gray-200">
              <button
                onClick={() => setSelectedCase(null)}
                className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg font-medium transition-colors text-sm"
              >
                Close
              </button>
              <button
                onClick={() => {
                  setShowUploadModal(true);
                }}
                className="flex items-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg font-medium transition-colors text-sm"
              >
                <CheckCircle size={16} />
                Approve with Signed Document
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Upload Signed Document Modal */}
      {showUploadModal && selectedCase && (
        <div className="fixed inset-0 bg-black/20 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-lg w-full">
            {/* Header */}
            <div className="bg-[#0B1F3B] text-white px-6 py-4 flex items-center justify-between rounded-t-xl">
              <div className="flex items-center gap-2">
                <Upload size={24} />
                <h2 className="text-lg font-semibold">Upload Signed Document</h2>
              </div>
              <button
                onClick={() => {
                  setShowUploadModal(false);
                  setSignedDocument(null);
                }}
                className="hover:bg-white/20 rounded-full p-1 transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            {/* Content */}
            <div className="p-6 space-y-4">
              <p className="text-sm text-gray-700">
                Upload the signed memorandum document for case{" "}
                <span className="font-semibold">{selectedCase.caseNumber}</span>. This will replace the
                original memorandum and mark the case as approved.
              </p>

              {/* Stage Selection */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Select Stage
                </label>
                <select
                  value={selectedStage}
                  onChange={(e) => setSelectedStage(parseInt(e.target.value))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0B1F3B] focus:border-transparent"
                >
                  {selectedCase.stages?.map((stage, index) => (
                    <option key={index} value={index}>
                      Stage {index + 1}: {stage.stage || "Main"}
                    </option>
                  ))}
                </select>
              </div>

              {/* File Upload */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Signed Document (PDF only)
                </label>
                <input
                  type="file"
                  accept="application/pdf"
                  onChange={handleFileSelect}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0B1F3B] focus:border-transparent"
                />
                {signedDocument && (
                  <p className="text-xs text-green-600 mt-2 flex items-center gap-1">
                    <CheckCircle size={12} />
                    {signedDocument.name}
                  </p>
                )}
              </div>
            </div>

            {/* Footer */}
            <div className="bg-gray-50 px-6 py-4 flex justify-end gap-3 rounded-b-xl">
              <button
                onClick={() => {
                  setShowUploadModal(false);
                  setSignedDocument(null);
                }}
                className="px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-800 rounded-lg font-medium transition-colors"
                disabled={isApproving}
              >
                Cancel
              </button>
              <button
                onClick={handleApproveSubmit}
                disabled={!signedDocument || isApproving}
                className="flex items-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isApproving ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    Approving...
                  </>
                ) : (
                  <>
                    <CheckCircle size={16} />
                    Approve & Upload
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PendingSignatureCases;

