export default function ModificationModal({
  isOpen,
  closeModal,
  selectedCase,
  modificationMessage,
  setModificationMessage,
  sendModificationRequest
}) {
  if (!isOpen || !selectedCase) return null;

  return (
    <div
      className="fixed inset-0 z-[9999] backdrop-blur flex items-center justify-center bg-black/70"
      onClick={closeModal} // clicking backdrop closes modal
    >
      <div
        className="bg-white rounded-xl p-6 w-full max-w-lg shadow-xl"
        onClick={(e) => e.stopPropagation()} // stop modal clicks from closing
      >
        <h2 className="text-lg font-semibold mb-4">Request Modification</h2>

        <textarea
          className="w-full border rounded p-2 mb-4"
          rows={4}
          value={modificationMessage}
          onChange={(e) => setModificationMessage(e.target.value)}
          placeholder="Enter modification message..."
        />

        <div className="flex justify-end gap-2">
          <button
            className="px-4 py-2 border rounded hover:bg-gray-50"
            onClick={closeModal}
          >
            Cancel
          </button>
          <button
            className="px-4 py-2 bg-amber-500 text-white rounded hover:bg-amber-600"
            onClick={sendModificationRequest}
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
}
