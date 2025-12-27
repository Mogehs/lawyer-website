import React, { useRef, useState } from "react";
import {
  FiFileText,
  FiUpload,
  FiLoader,
  FiDownload,
  FiEye,
} from "react-icons/fi";
import { useUploadCaseDocumentMutation } from "../../api/lawyerApi";

export default function DocumentsTab({
  selectedCase,
  selectedStage,
  userRole,
}) {
  const fileInputRef = useRef(null);
  const [localFiles, setLocalFiles] = useState([]);
  const [uploadDocument, { isLoading: isUploading }] =
    useUploadCaseDocumentMutation();

  // Get current stage documents
  const currentStage = selectedCase.stages?.[selectedStage];
  const docs = currentStage?.documents || [];

  const handleUploadClick = () => fileInputRef.current?.click();

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    if (files.length > 0) {
      setLocalFiles(files);
    }
  };

  const handleSubmitDocuments = async () => {
    if (localFiles.length === 0) {
      alert("Please select files to upload");
      return;
    }

    console.log("📤 Uploading documents:", {
      filesCount: localFiles.length,
      stageIndex: selectedStage,
      caseId: selectedCase._id || selectedCase.id,
      files: localFiles.map((f) => ({ name: f.name, size: f.size })),
    });

    try {
      const formData = new FormData();
      localFiles.forEach((file) => {
        formData.append("documents", file);
        console.log("📄 Added file to FormData:", file.name);
      });
      formData.append("stageIndex", selectedStage);
      console.log("🎯 Stage index:", selectedStage);

      const result = await uploadDocument({
        id: selectedCase._id || selectedCase.id,
        formData,
      }).unwrap();

      console.log("✅ Upload successful:", result);
      console.log(
        "📄 New documents in response:",
        result.data?.stages?.[selectedStage]?.documents
      );
      alert("Documents uploaded successfully!");
      setLocalFiles([]);
      // Reset file input
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
      // Note: Parent component will auto-refresh from RTK Query cache invalidation
    } catch (error) {
      console.error("❌ Failed to upload documents:", {
        error,
        message: error?.message,
        data: error?.data,
        status: error?.status,
      });
      alert(
        `Failed to upload documents: ${
          error?.data?.message || error?.message || "Unknown error"
        }`
      );
    }
  };

  const handleView = (doc) => {
    const fileUrl = doc.url || doc.fileUrl;
    if (fileUrl) {
      window.open(fileUrl, "_blank");
    }
  };

  const handleDownload = (doc) => {
    const fileUrl = doc.url || doc.fileUrl;
    if (fileUrl) {
      const link = document.createElement("a");
      link.href = fileUrl;
      link.download = doc.name || doc.title || "document";
      link.target = "_blank";
      link.click();
    }
  };

  return (
    <div>
      <div className="mb-3 flex items-center justify-between">
        <div className="text-[10px] text-slate-600">
          Documents for{" "}
          <span className="font-medium text-slate-800">{selectedStage}</span>
        </div>
        {userRole !== "Client" && (
          <div className="flex gap-1.5">
            <button
              onClick={handleUploadClick}
              disabled={isUploading}
              className="inline-flex items-center gap-1 bg-white border border-slate-300 px-2 py-1 rounded text-[10px] cursor-pointer hover:bg-[#0B1F3B] hover:text-white disabled:opacity-50"
            >
              <FiUpload size={12} /> Choose
            </button>
            {localFiles.length > 0 && (
              <button
                onClick={handleSubmitDocuments}
                disabled={isUploading}
                className="inline-flex items-center gap-1 bg-[#A48C65] text-white px-2 py-1 rounded text-[10px] hover:bg-[#A48C65] hover:text-white disabled:opacity-50"
              >
                {isUploading ? (
                  <>
                    <FiLoader size={12} className="animate-spin" /> Uploading
                  </>
                ) : (
                  <>
                    <FiUpload size={12} /> Upload ({localFiles.length})
                  </>
                )}
              </button>
            )}
          </div>
        )}
        <input
          type="file"
          ref={fileInputRef}
          className="hidden"
          multiple
          accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
          onChange={handleFileChange}
        />
      </div>

      {/* Selected Files Preview */}
      {localFiles.length > 0 && (
        <div className="mb-3 p-2 bg-blue-50 border border-blue-200 rounded">
          <h4 className="text-[10px] font-semibold mb-1 text-blue-800">
            Selected:
          </h4>
          <div className="space-y-0.5">
            {localFiles.map((file, idx) => (
              <div
                key={idx}
                className="flex items-center gap-1.5 text-[10px] text-slate-700"
              >
                <FiFileText size={12} className="text-blue-600" />
                <span className="truncate flex-1">{file.name}</span>
                <span className="text-[9px] text-slate-500">
                  ({(file.size / 1024).toFixed(1)}KB)
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Uploaded Documents List */}
      <div className="space-y-2">
        {docs.length > 0 ? (
          docs.map((doc, idx) => (
            <div
              key={doc._id || idx}
              className="flex items-center justify-between p-2  border border-[#A48C65]  rounded hover:bg-slate-50 transition"
            >
              <div className="flex items-center gap-2 flex-1 min-w-0">
                <FiFileText size={14} className="text-slate-600 shrink-0" />
                <div className="min-w-0 flex-1">
                  <div className="text-[10px] font-medium text-slate-800 truncate">
                    {doc.name || doc.title || "Document"}
                  </div>
                  <div className="text-[9px] text-slate-500">
                    {doc.uploadedAt
                      ? new Date(doc.uploadedAt).toLocaleDateString()
                      : "No date"}
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-1 shrink-0">
                <button
                  onClick={() => handleView(doc)}
                  className="p-1 text-slate-600 hover:text-blue-600 hover:bg-blue-50 rounded transition"
                  title="View"
                >
                  <FiEye size={14} />
                </button>
                <button
                  onClick={() => handleDownload(doc)}
                  className="p-1 text-slate-600 hover:text-green-600 hover:bg-green-50 rounded transition"
                  title="Download"
                >
                  <FiDownload size={14} />
                </button>
              </div>
            </div>
          ))
        ) : (
          <div className="p-4 text-center text-slate-500 border border-dashed rounded">
            <FiFileText size={24} className="mx-auto mb-1 text-slate-400" />
            <p className="text-[10px]">No documents uploaded yet.</p>
          </div>
        )}
      </div>
    </div>
  );
}
