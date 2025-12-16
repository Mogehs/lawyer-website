import { motion } from "framer-motion";
import { X, Trash2, AlertTriangle, FileText } from "lucide-react";

const ArchiveDeleteModal = ({ isOpen, archive, onClose, onConfirm }) => {
    if (!isOpen || !archive) return null;

    return (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex justify-center items-center z-50 p-4">
            <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.25, ease: "easeOut" }}
                className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md max-h-[90vh] flex flex-col "
            >
                {/* Header */}
                <div className="flex items-center bg-[#24344f] justify-between border-b border-gray-200 p-5 rounded-t-2xl">
                    <h3 className="text-xl font-semibold flex items-center gap-2 text-white">
                        <FileText className="w-5 h-5 text-[#BCB083]" />
                        Delete Archive
                    </h3>
                    <button
                        onClick={onClose}
                        className="text-gray-400 hover:text-[#BCB083] transition-colors"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* Body */}
                <div className="overflow-y-auto space-y-6 p-6">
                    <div className="flex items-center gap-4">
                        <div className="p-3 bg-red-100 rounded-full">
                            <AlertTriangle className="text-red-500" size={24} />
                        </div>
                        <div>
                            <p className="font-medium text-gray-800 text-lg">
                                Delete this archive?
                            </p>
                            <p className="text-sm text-gray-600 mt-1">
                                Case ID: <strong className="text-[#BCB083]">{archive.id}</strong>
                            </p>
                        </div>
                    </div>

                    <div className="bg-red-50 border border-red-200 rounded-xl p-4">
                        <p className="text-sm text-gray-700">
                            <span className="font-semibold text-red-600">Warning:</span> This action is{" "}
                            <span className="font-semibold">irreversible</span>. All associated case
                            files and data for{" "}
                            <strong className="text-[#BCB083]">{archive.client}</strong> will be permanently removed.
                        </p>
                    </div>
                </div>

                {/* Footer */}
                <div className="flex justify-end px-8 py-4 border-t border-gray-200 bg-gray-50">
                    <button
                        onClick={onClose}
                        className="px-6 py-2.5 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-100 transition-all duration-200 mr-3"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={onConfirm}
                        className="flex items-center gap-2 px-6 py-2.5 bg-red-600 text-white rounded-lg font-medium hover:bg-red-700 transition-all duration-200"
                    >
                        <Trash2 className="w-4 h-4" />
                        Delete Permanently
                    </button>
                </div>
                
                {/* Gradient Border Bottom */}
                <div className="h-2 bg-gradient-to-r from-[#fe9a00] to-[#24344f] rounded-b-2xl"></div>
            </motion.div>
        </div>
    );
};

export default ArchiveDeleteModal;