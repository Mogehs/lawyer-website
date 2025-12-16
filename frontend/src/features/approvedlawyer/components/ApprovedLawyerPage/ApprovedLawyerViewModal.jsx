import { FiX, FiDownload, FiCheckCircle } from "react-icons/fi";

export default function ApprovedLawyerViewModal({
  selectedCase,
  closeModal,
  openModificationModal,
  handleApproval
}) {
  if (!selectedCase) return null;

  const STAGES = ["Main", "Appeal", "Cassation"];

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-3 sm:p-6">

      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/70 backdrop-blur-sm"
        onClick={closeModal}
      ></div>

      {/* Modal */}
      <div
        className="relative bg-white w-full max-w-4xl max-h-[90vh] overflow-y-auto rounded-2xl shadow-xl z-10"
        onClick={(e) => e.stopPropagation()}
      >

        {/* Header */}
        <div className="sticky top-0 bg-gradient-to-r from-[#BCB083] to-[#A48C65] text-white rounded-t-2xl px-5 py-5 flex justify-between items-center">
          <div>
            <h2 className="text-lg sm:text-xl font-bold">{selectedCase.caseType}</h2>
            <p className="text-blue-200 text-sm">{selectedCase.caseNumber}</p>
          </div>
          <button onClick={closeModal} className="p-2 hover:bg-white/10 rounded-lg">
            <FiX className="w-5 h-5 text-white" />
          </button>
        </div>

        {/* Client Info */}
        <div className="bg-gray-50 border-b border-gray-200 px-5 py-4 grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm text-gray-700">

          <div className="flex gap-2">
            <span className="font-semibold">Client:</span> 
            {selectedCase.clientId?.name}
          </div>

          <div className="flex gap-2">
            <span className="font-semibold">Phone:</span> 
            {selectedCase.clientId?.contactNumber}
          </div>

          <div className="flex gap-2">
            <span className="font-semibold">Case Type:</span> 
            {selectedCase.caseType}
          </div>

          <div className="flex gap-2">
            <span className="font-semibold">Secretary:</span> 
            {selectedCase.secretary?.name}
          </div>

          <div className="flex gap-2">
            <span className="font-semibold">Lawyer:</span> 
            {selectedCase.assignedLawyer?.name}
          </div>

        </div>

        {/* Stage Timeline */}
        <div className="p-5 space-y-5">
          <h3 className="text-lg sm:text-xl font-semibold text-gray-900">Stage Timeline</h3>

          <div className="relative flex items-center justify-between mt-4">
            <div className="absolute left-0 right-0 top-1/2 -translate-y-1/2 h-1 bg-gray-200 rounded-full"></div>

            {STAGES.map((stage, idx) => {
              const isCurrent = idx === selectedCase.currentStage;
              const isCompleted = idx < selectedCase.currentStage;

              return (
                <div key={idx} className="relative flex flex-col items-center w-full">
                  <div
                    className={`w-9 h-9 flex items-center justify-center rounded-full border-2 
                      ${
                        isCurrent
                          ? "bg-amber-500 border-amber-600 text-white"
                          : isCompleted
                          ? "bg-green-500 border-green-600 text-white"
                          : "bg-white border-gray-300 text-gray-600"
                      }
                    `}
                  >
                    {isCompleted ? (
                      <FiCheckCircle className="w-5 h-5" />
                    ) : (
                      <span className="text-sm font-semibold">{idx + 1}</span>
                    )}
                  </div>

                  <p className="mt-2 text-sm font-medium text-center">
                    {stage}
                  </p>
                </div>
              );
            })}
          </div>
        </div>

        {/* Documents */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4 p-5">
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
            <h4 className="font-semibold text-gray-900 mb-2 text-sm">Documents</h4>

            {selectedCase.documents?.length > 0 ? (
              selectedCase.documents.map((doc, i) => (
                <a
                  key={i}
                  href={doc.url}
                  download
                  className="inline-flex items-center gap-2 px-3 py-2 bg-gray-100 rounded hover:bg-gray-200 transition"
                >
                  <FiDownload /> {doc.name}
                </a>
              ))
            ) : (
              <p className="text-gray-500">No documents uploaded.</p>
            )}
          </div>

          {/* Memorandums - fallback */}
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
            <h4 className="font-semibold text-gray-900 mb-2 text-sm">Memorandums</h4>

            {selectedCase.memorandums?.length > 0 ? (
              selectedCase.memorandums.map((mem, i) => (
                <a
                  key={i}
                  href={mem.url}
                  download
                  className="inline-flex items-center gap-2 px-3 py-2 bg-gray-100 rounded hover:bg-gray-200 transition"
                >
                  <FiDownload /> {mem.name}
                </a>
              ))
            ) : (
              <p className="text-gray-500">No memorandums uploaded.</p>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="sticky bottom-0 bg-white border-t border-gray-200 rounded-b-2xl px-5 py-4 flex justify-between items-center">
          <button
            className="px-5 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
            onClick={closeModal}
          >
            Close
          </button>

          <div className="flex gap-2">
            <button
              className="flex items-center gap-2 px-5 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
              onClick={() => handleApproval(selectedCase._id, "PendingSignature")}
            >
              <FiCheckCircle /> Approve
            </button>

            <button
              className="flex items-center gap-2 px-5 py-2 bg-amber-500 text-white rounded-lg hover:bg-amber-600"
              onClick={openModificationModal}
            >
              Request Modification
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
