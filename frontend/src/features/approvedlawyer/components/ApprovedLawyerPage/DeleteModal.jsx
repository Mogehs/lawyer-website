export default function DeleteModal({ selectedCase, isOpen, closeModal, handleDelete }) {
  if (!isOpen || !selectedCase) return null;

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 sm:p-6 md:p-8">
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
        onClick={closeModal}
      ></div>

      <div className="relative bg-white rounded-2xl shadow-2xl max-w-md w-full z-50 p-6 sm:p-8 md:p-10">
        <h3 className="text-xl sm:text-2xl font-semibold text-gray-800 mb-3">
          Confirm Delete
        </h3>

        <p className="text-gray-600 text-sm sm:text-base mb-6">
          Are you sure you want to delete case 
          <span className="font-medium text-gray-800"> "{selectedCase?.clientId?.name}"</span>? 
          This action cannot be undone.
        </p>

        <div className="flex flex-col sm:flex-row justify-end gap-3">
          <button
            className="px-5 py-2 sm:py-3 cursor-pointer bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300"
            onClick={closeModal}
          >
            Cancel
          </button>

          <button
            className="px-5 py-2 sm:py-3 bg-red-600 cursor-pointer text-white rounded-lg hover:bg-red-700"
            onClick={() => handleDelete(selectedCase?._id)}
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}
