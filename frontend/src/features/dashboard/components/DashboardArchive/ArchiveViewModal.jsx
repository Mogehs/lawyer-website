import { X, FileText, ClipboardList, Archive } from "lucide-react";
import { Gavel, FileSearch, Layers, ArrowBigUpDash } from "lucide-react";

const ArchiveViewModal = ({ isOpen, archive, onClose }) => {
    if (!isOpen || !archive) return null;

    return (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex justify-center items-center z-50 p-4">
            <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-6xl max-h-[90vh] flex flex-col">
                {/* Header */}
                <div className="flex items-center bg-[#0B1F3B] justify-between border-b border-gray-200 p-5 rounded-t-2xl">
                    <h3 className="text-xl font-semibold flex items-center gap-2 text-white">
                        <Archive className="w-5 h-5 text-[#0B1F3B]" />
                        Archive Details - {archive.archiveId}
                    </h3>
                    <button
                        onClick={onClose}
                        className="bg-white border border-[#0B1F3B] text-gray-800 hover:bg-[#0B1F3B] hover:text-white transition-all duration-200 rounded-full p-1"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* Scrollable Body */}
                <div className="overflow-y-auto space-y-4 p-6">
                    {archive.stages.map((stage, index) => (
                        <div
                            key={index}
                            className="border border-gray-200 rounded-xl p-5 shadow-sm hover:shadow-md transition-all duration-200 bg-white"
                        >
                            {/* Stage Header */}
                            <div className="flex justify-between items-center mb-4">
                                <span
                                    className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold
                                        ${stage.stage === "Main"
                                            ? "bg-blue-100 text-blue-800 border border-blue-200"
                                            : stage.stage === "Appeal"
                                                ? "bg-purple-100 text-purple-800 border border-purple-200"
                                                : "bg-orange-100 text-orange-800 border border-[#0B1F3B]"
                                        }`}
                                >
                                    {/* Dynamic Icon */}
                                    {stage.stage === "Main" && <Gavel className="w-4 h-4" />}
                                    {stage.stage === "Appeal" && <ArrowBigUpDash className="w-4 h-4" />}
                                    {stage.stage === "Review" && <FileSearch className="w-4 h-4" />}
                                    {stage.stage === "Other" && <Layers className="w-4 h-4" />}
                                    {stage.stage}
                                </span>
                                <span className="text-sm text-gray-500 bg-gray-100 px-3 py-1 rounded-md">
                                    {stage.submittedOn}
                                </span>
                            </div>

                            {/* Stage Information Grid */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-800 mb-4">
                                <div className="space-y-2">
                                    <p><span className="font-semibold text-gray-700">Client:</span> {archive.client}</p>
                                    <p><span className="font-semibold text-gray-700">Lawyer:</span> {archive.lawyers}</p>
                                </div>
                                <div className="space-y-2">
                                    <p><span className="font-semibold text-gray-700">Approved By:</span> {stage.approvedBy}</p>
                                    <p><span className="font-semibold text-gray-700">Archived On:</span> {archive.archivedOn}</p>
                                </div>
                            </div>

                            {/* Description & Outcome */}
                            <div className="space-y-3 mb-4">
                                <div>
                                    <span className="font-semibold text-gray-700 block mb-1">Description:</span>
                                    <p className="text-gray-700 bg-gray-50 p-3 rounded-lg border border-gray-200">
                                        {stage.description}
                                    </p>
                                </div>
                                <div>
                                    <span className="font-semibold text-gray-700 block mb-1">Outcome:</span>
                                    <p className="text-gray-700 bg-gray-50 p-3 rounded-lg border border-gray-200">
                                        {stage.outcome}
                                    </p>
                                </div>
                            </div>

                            {/* Files Section */}
                            <div className="space-y-3">
                                {/* Memorandum */}
                                {stage.memorandum && (
                                    <div className="flex items-center gap-3">
                                        <span className="font-semibold text-gray-700 flex items-center gap-2 flex-shrink-0">
                                            <ClipboardList className="w-4 h-4 text-[#fe9a00]" />
                                            Memorandum:
                                        </span>
                                        <a
                                            href={stage.memorandum.url}
                                            download
                                            className="text-blue-600 hover:text-blue-700 hover:underline font-medium transition-colors duration-200 bg-blue-50 px-3 py-1 rounded-lg border border-blue-200"
                                        >
                                            {stage.memorandum.name}
                                        </a>
                                    </div>
                                )}

                                {/* Evidence */}
                                {stage.evidence && stage.evidence.length > 0 && (
                                    <div className="flex items-start gap-3">
                                        <span className="font-semibold text-gray-700 flex items-center gap-2 flex-shrink-0 mt-1">
                                            <FileText className="w-4 h-4 text-[#fe9a00]" />
                                            Evidence:
                                        </span>
                                        <div className="flex flex-wrap gap-2">
                                            {stage.evidence.map((file, i) => (
                                                <a
                                                    key={i}
                                                    href={file.url}
                                                    download
                                                    className="text-blue-600 hover:text-blue-700 hover:underline font-medium transition-colors duration-200 bg-blue-50 px-3 py-1 rounded-lg border border-blue-200"
                                                >
                                                    {file.name}
                                                </a>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    ))}
                </div>

                {/* Footer */}
                <div className="flex justify-end px-8 py-4 border-t border-gray-200 bg-gray-50">
                    <button
                        onClick={onClose}
                        className="px-6 py-2.5 bg-[#1C2B4A] text-white rounded-lg font-medium hover:bg-[#24344f] transition-all duration-200"
                    >
                        Close Archive
                    </button>
                </div>
                
                {/* Gradient Border Bottom */}
                <div className="h-2 bg-gradient-to-r from-[#fe9a00] to-[#24344f] rounded-b-2xl"></div>
            </div>
        </div>
    );
};

export default ArchiveViewModal;