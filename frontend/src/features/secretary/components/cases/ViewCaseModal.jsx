import React from "react";
import {
  X,
  FileText,
  Clock,
  Shield,
  Download,
} from "lucide-react";

const ViewCaseModal = ({ caseData, onClose }) => {
  if (!caseData) {
    return null;
  }

  const { client, case: caseInfo } = caseData;

  // Helper function to download a document
  const handleDownload = async (url, filename) => {
    if (!url) {
      alert('Document URL is missing');
      return;
    }

    try {
      // Check if it's a Cloudinary URL or external URL
      const isCloudinary = url.includes('cloudinary.com');

      if (isCloudinary) {
        // For Cloudinary, force download by adding fl_attachment parameter
        let downloadUrl = url;
        if (!url.includes('fl_attachment')) {
          // Add download flag to Cloudinary URL
          downloadUrl = url.replace('/upload/', '/upload/fl_attachment/');
        }
        // Open in new tab for Cloudinary URLs
        window.open(downloadUrl, '_blank');
      } else {
        // For other URLs, try fetch and blob method
        const response = await fetch(url, {
          mode: 'cors',
          credentials: 'omit'
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const blob = await response.blob();
        const blobUrl = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = blobUrl;
        link.download = filename || 'document';
        link.style.display = 'none';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);

        // Clean up blob URL after a delay
        setTimeout(() => window.URL.revokeObjectURL(blobUrl), 100);
      }
    } catch (error) {
      console.error('Error downloading file:', error);
      // Fallback: try to open in new tab
      try {
        window.open(url, '_blank');
      } catch (fallbackError) {
        alert('Failed to download document. Please try again or contact support.');
      }
    }
  };

  // Helper function to download all documents
  const handleDownloadAll = async () => {
    const allDocuments = [];

    // Collect all documents from stages
    caseInfo.stages?.forEach((stage, idx) => {
      // Add memorandum if exists
      if (stage.memorandum) {
        const memoUrl = stage.memorandum.fileUrl || stage.memorandum.url;
        const memoName = stage.memorandum.name || `memorandum-stage-${idx + 1}.pdf`;
        if (memoUrl) {
          allDocuments.push({ url: memoUrl, name: memoName });
        }
      }
      // Add evidence documents
      if (stage.evidence && Array.isArray(stage.evidence)) {
        stage.evidence.forEach(e => {
          if (e.url && e.name) {
            allDocuments.push({ url: e.url, name: e.name });
          }
        });
      }
      // Add stage documents
      if (stage.documents && Array.isArray(stage.documents)) {
        stage.documents.forEach(d => {
          if (d.url && d.name) {
            allDocuments.push({ url: d.url, name: d.name });
          }
        });
      }
    });

    // Collect case documents
    if (caseInfo.documents && Array.isArray(caseInfo.documents)) {
      caseInfo.documents.forEach(doc => {
        if (doc.url && doc.name) {
          allDocuments.push({ url: doc.url, name: doc.name });
        }
      });
    }

    if (allDocuments.length === 0) {
      alert('No documents available to download');
      return;
    }

    // Download each document with a slight delay to prevent blocking
    for (const doc of allDocuments) {
      try {
        await handleDownload(doc.url, doc.name);
        // Small delay between downloads
        await new Promise(resolve => setTimeout(resolve, 500));
      } catch (error) {
        console.error(`Failed to download ${doc.name}:`, error);
      }
    }
  };

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center px-4 sm:px-6 py-4">
      {/* Overlay */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      ></div>

      {/* Modal Content */}
      <div className="relative bg-white w-full max-w-3xl max-h-[80vh] overflow-y-auto rounded-lg shadow-lg z-10 flex flex-col">
        {/* Header */}
        <div className="sticky top-0 bg-[#A48C65] text-white rounded-t-lg px-4 py-3 flex justify-between items-center ">
          <div className="flex items-center gap-2">
            <FileText className="w-4 h-4" />
            <div>
              <h2 className="text-sm font-semibold">{client.name}</h2>
              <p className="text-white text-[10px]">
                {client.contact} | {client.email} | {caseInfo.caseType}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1 hover:bg-[#decfb8] hover:text-black rounded transition"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Case Info */}
        <div className="bg-slate-50 border-b  border-[#BCB083] px-4 py-2 text-[10px] text-slate-600 flex flex-wrap gap-3">
          <span className="flex items-center gap-1">
            <Clock className="w-3 h-3" />
            {caseInfo.filingDate}
          </span>
          <span className="flex items-center gap-1">
            <Shield className="w-3 h-3" />
            {caseInfo.status}
          </span>
          <span className="flex items-center gap-1">
            <FileText className="w-3 h-3" />
            {caseInfo.assignedLawyer}
          </span>
          {caseInfo.courtCaseId && (
            <span className="flex items-center gap-1 bg-indigo-50 text-indigo-700 px-2 py-0.5 rounded font-medium">
              <FileText className="w-3 h-3" />
              Court ID: {caseInfo.courtCaseId}
            </span>
          )}
        </div>

        {/* Body Content */}
        <div className="p-3 space-y-3">
          {/* Stages */}
          {caseInfo.stages?.map((stage, idx) => (
            <div
              key={idx}
              className="bg-white border border-[#BCB083] rounded-lg p-3 shadow-sm"
            >
              {/* Stage Header */}
              <div className="flex flex-col lg:flex-row lg:justify-between lg:items-start gap-2 mb-2">
                <div className="flex-1">
                  <h3 className="text-xs font-semibold text-slate-800 mb-1">
                    Stage {stage.stageNumber || idx + 1}: {stage.stageType || 'Main'}
                  </h3>
                  <div className="space-y-0.5 text-[10px] text-slate-600">
                    {stage.hearingDate && (
                      <p className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        Hearing: {new Date(stage.hearingDate).toLocaleDateString()}
                        {stage.hearingTime && ` at ${stage.hearingTime}`}
                      </p>
                    )}
                    {stage.createdAt && (
                      <p className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        Created: {new Date(stage.createdAt).toLocaleDateString()}
                      </p>
                    )}
                    {stage.memorandum?.feedback && (
                      <p className="line-clamp-2">Feedback: {stage.memorandum.feedback}</p>
                    )}
                  </div>
                </div>

                {/* Stage Badges */}
                <div className="flex flex-wrap gap-1">
                  <span className={`px-2 py-0.5 rounded text-[10px] font-medium flex items-center gap-1 border ${
                    stage.status === 'Completed' ? 'bg-green-50 text-green-700 border-green-200' :
                    stage.status === 'Approved' ? 'bg-blue-50 text-blue-700 border-blue-200' :
                    stage.status === 'Submitted' ? 'bg-purple-50 text-purple-700 border-purple-200' :
                    'bg-amber-50 text-amber-700 border-amber-200'
                  }`}>
                    <Clock size={10} /> {stage.status || 'InProgress'}
                  </span>
                  {stage.memorandum?.status && (
                    <span className={`px-2 py-0.5 rounded text-[10px] font-medium flex items-center gap-1 border ${
                      stage.memorandum.status === 'Approved' ? 'bg-green-50 text-green-700 border-green-200' :
                      stage.memorandum.status === 'Rejected' ? 'bg-red-50 text-red-700 border-red-200' :
                      'bg-yellow-50 text-yellow-700 border-yellow-200'
                    }`}>
                      <Shield size={10} /> Memo: {stage.memorandum.status}
                    </span>
                  )}
                </div>
              </div>

              {/* Memorandum */}
              {stage.memorandum?.fileUrl && (
                <div className="mb-2">
                  <h4 className="font-semibold text-slate-700 text-[10px] mb-1 flex items-center gap-1">
                    <FileText size={10} /> Memorandum
                  </h4>
                  <div className="p-2 bg-slate-50 border border-slate-200 rounded flex justify-between items-center">
                    <span className="text-[10px] text-slate-700 truncate max-w-[70%]">
                      {stage.memorandum.fileUrl.split('/').pop() || `Memorandum-Stage-${stage.stageNumber || idx + 1}`}
                    </span>
                    <button
                      onClick={() => handleDownload(stage.memorandum.fileUrl, `memorandum-stage-${stage.stageNumber || idx + 1}.pdf`)}
                      className="p-1 text-slate-600 hover:text-blue-600 rounded transition-colors"
                      title="Download Memorandum"
                    >
                      <Download size={12} />
                    </button>
                  </div>
                  {stage.memorandum.content && (
                    <p className="text-[9px] text-slate-500 mt-1 line-clamp-2">
                      {stage.memorandum.content}
                    </p>
                  )}
                </div>
              )}

              {/* Stage Documents */}
              {stage.documents?.length > 0 && (
                <div className="mb-2">
                  <h4 className="font-semibold text-slate-700 text-[10px] mb-1 flex items-center gap-1">
                    <Shield size={10} /> Stage Documents ({stage.documents.length})
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {stage.documents.map((doc, i) => (
                      <div
                        key={i}
                        className="p-2 bg-slate-50 border border-slate-200 rounded flex justify-between items-center"
                      >
                        <span className="text-[10px] text-slate-700 truncate max-w-[70%]">
                          {doc.name}
                        </span>
                        <button
                          onClick={() => handleDownload(doc.url, doc.name)}
                          className="p-1 text-slate-600 hover:text-blue-600 rounded transition-colors"
                          title="Download"
                        >
                          <Download size={12} />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ))}

          {/* Case Documents */}
          {caseInfo.documents?.length > 0 && (
            <div className="bg-white border border-[#BCB083] rounded-lg p-3">
              <h4 className="font-semibold text-slate-800 text-xs mb-2 flex items-center gap-1">
                <FileText size={12} /> Case Documents
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {caseInfo.documents.map((doc, i) => (
                  <div
                    key={i}
                    className="p-2 bg-slate-50 border border-slate-200 rounded flex justify-between items-center"
                  >
                    <span className="text-[10px] text-slate-700 truncate max-w-[70%]">
                      {doc.name}
                    </span>
                    <button
                      onClick={() => handleDownload(doc.url, doc.name)}
                      className="p-1 text-slate-600 hover:text-[#BCB083] rounded transition-colors"
                      title="Download"
                    >
                      <Download size={12} />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Case Description */}
          {caseInfo.description && (
            <div className="bg-slate-50 border  border-[#BCB083] rounded-lg p-3">
              <h4 className="font-semibold text-slate-800 text-xs mb-1 flex items-center gap-1">
                <FileText size={12} /> Description
              </h4>
              <p className="text-slate-700 text-[10px] leading-relaxed">
                {caseInfo.description}
              </p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="sticky bottom-0 bg-slate-50 border-t border-slate-200 rounded-b-lg px-4 py-2 flex justify-between items-center gap-2">
          <span className="text-[10px] text-slate-600">
            {(caseInfo.stages || []).length} stage
            {(caseInfo.stages || []).length !== 1 ? "s" : ""} •{" "}
            {caseInfo.documents?.length || 0} docs
          </span>

          <div className="flex gap-2">
            <button
              onClick={onClose}
              className="px-3 py-1 border border-slate-300 text-slate-700 rounded text-xs hover:bg-white transition"
            >
              Close
            </button>
            <button
              onClick={handleDownloadAll}
              className="flex items-center gap-1 px-3 py-1 bg-[#A48C65] text-white rounded text-xs hover:bg-[#8c7a4e] transition"
            >
              <Download size={12} /> Download All
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ViewCaseModal;
