// UPDATED: ArchiveModal.jsx
import React from "react";
import {
  Download,
  X,
  FileText,
  Calendar,
  User,
  Archive,
  CheckCircle,
  Clock,
  Shield,
  Mail,
  Phone,
  MapPin,
  Info,
  IdCard,
} from "lucide-react";

const ArchiveModal = ({ caseData, onClose }) => {
  const DownloadButton = ({
    href,
    children,
    variant = "default",
    icon: Icon = Download,
  }) => (
    <a
      href={href}
      className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
        variant === "primary"
          ? "bg-blue-600 text-white hover:bg-blue-700 shadow-sm"
          : "bg-gray-100 text-gray-700 hover:bg-gray-200 border border-gray-300"
      }`}
      download
    >
      <Icon size={15} />
      {children}
    </a>
  );

  const StageCard = ({ stage, index }) => (
    <div className="bg-white border border-gray-200 rounded-xl p-5 hover:shadow-md transition-all duration-300">
      <div className="flex flex-col lg:flex-row lg:justify-between lg:items-start gap-4 mb-4">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-blue-100 rounded-lg">
              <FileText className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-bold text-gray-900">
                Stage {index + 1}: {stage.stage}
              </h3>

              {/* Stage Hearing Date */}
              <div className="flex items-center gap-2 text-sm text-gray-600 mt-1">
                <Calendar className="w-4 h-4" />
                Hearing: {stage.hearingDate}
              </div>

              

              {/* NEW: Stage Completed Date */}
              {stage.completedDate && (
                <div className="flex items-center gap-2 text-sm text-green-700 mt-1">
                  <CheckCircle className="w-4 h-4" />
                  Completed: {stage.completedDate}
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="flex flex-wrap gap-2">
          <span
            className={`px-3 py-1 rounded-full text-xs sm:text-sm font-semibold flex items-center gap-1 ${
              stage.ragabApproved
                ? "bg-green-100 text-green-800"
                : "bg-yellow-100 text-yellow-800"
            }`}
          >
            {stage.ragabApproved ? (
              <CheckCircle size={14} />
            ) : (
              <Clock size={14} />
            )}
            {stage.ragabApproved ? "Approved" : "Pending"}
          </span>

          <span
            className={`px-3 py-1 rounded-full text-xs sm:text-sm font-semibold flex items-center gap-1 ${
              stage.mdSigned
                ? "bg-blue-100 text-blue-800"
                : "bg-gray-100 text-gray-700"
            }`}
          >
            <Shield size={14} />
            MD {stage.mdSigned ? "Signed" : "Pending"}
          </span>
        </div>
      </div>

      {/* Documents Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3">
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
          <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2 text-sm">
            <FileText className="w-4 h-4 text-blue-600" />
            Legal Memorandum
          </h4>
          <DownloadButton
            href={`/download/memo/${stage.memorandum}`}
            variant="primary"
          >
            Download Document
          </DownloadButton>
        </div>

        <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
          <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2 text-sm">
            <FileText className="w-4 h-4 text-green-600" />
            Court Evidence
          </h4>
          <DownloadButton href={`/download/court-proof/${stage.courtProof}`}>
            Download Proof
          </DownloadButton>
        </div>

        <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
          <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2 text-sm">
            <FileText className="w-4 h-4 text-purple-600" />
            Supporting Files ({stage.documents.length})
          </h4>
          <div className="space-y-2">
            {stage.documents.map((doc, i) => (
              <DownloadButton key={i} href={`/download/document/${doc}`}>
                {doc}
              </DownloadButton>
            ))}
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-3 sm:p-6">
      <div
        className="absolute inset-0 bg-black/70 backdrop-blur-sm"
        onClick={onClose}
      ></div>

      {/* Modal */}
      <div className="relative bg-white w-full max-w-4xl max-h-[90vh] overflow-y-auto rounded-2xl shadow-xl z-10">

        {/* Header */}
        <div className="sticky top-0 bg-gradient-to-r from-gray-900 to-gray-800 text-white rounded-t-2xl px-5 py-5 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-white/10 rounded-lg">
              <FileText className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-lg sm:text-xl font-bold">{caseData.caseNumber}</h2>
              <p className="text-blue-200 text-sm">{caseData.clientName}</p>
            </div>
          </div>

          <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-lg transition">
            <X className="w-5 h-5 text-white" />
          </button>
        </div>

        {/* Case Meta */}
        <div className="bg-gray-50 border-b border-gray-200 px-5 py-4 space-y-3">

          {/* Client Info Section */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm text-gray-700">

            <div className="flex items-center gap-2">
              <User className="w-4 h-4 text-gray-500" />
              <span>{caseData.clientName}</span>
            </div>

            <div className="flex items-center gap-2">
              <Mail className="w-4 h-4 text-gray-500" />
              <span>{caseData.clientEmail}</span>
            </div>

            <div className="flex items-center gap-2">
              <Phone className="w-4 h-4 text-gray-500" />
              <span>{caseData.clientPhone}</span>
            </div>

            <div className="flex items-center gap-2">
              <IdCard className="w-4 h-4 text-gray-500" />
              <span>{caseData.nationalId}</span>
            </div>

            <div className="flex items-center gap-2">
              <MapPin className="w-4 h-4 text-gray-500" />
              <span>{caseData.address}</span>
            </div>

            <div className="flex items-center gap-2 col-span-1 sm:col-span-2">
              <Info className="w-4 h-4 text-gray-500" />
              <span>{caseData.additionalInfo}</span>
            </div>

          </div>
        </div>

        {/* Content */}
        <div className="p-5 space-y-5">
          <h3 className="text-lg sm:text-xl font-semibold text-gray-900">
            Case Proceedings
          </h3>
          <div className="space-y-5">
            {caseData.stages.map((stage, idx) => (
              <StageCard key={idx} stage={stage} index={idx} />
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="sticky bottom-0 bg-white border-t border-gray-200 rounded-b-2xl px-5 py-4 flex justify-between items-center">
          <div className="text-xs sm:text-sm text-gray-600">
            Total: {caseData.stages.length} legal stage
            {caseData.stages.length !== 1 ? "s" : ""}
          </div>

          <div className="flex gap-2">
            <button onClick={onClose} className="px-5 py-2 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition">
              Close
            </button>

            <a
              href={`/download/archive/${caseData.id}`}
              className="flex items-center gap-2 px-5 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition shadow-sm"
            >
              <Download size={16} />
              Download All
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ArchiveModal;
