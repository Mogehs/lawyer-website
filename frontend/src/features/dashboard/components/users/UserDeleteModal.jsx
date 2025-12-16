import React from "react";

const UserDeleteModal = ({ show, onClose, onDelete }) => {
  if (!show) return null;
  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur flex items-center justify-center z-[9999]">
      <div className="bg-white rounded-xl shadow-lg p-6 w-[90%] max-w-sm border border-gray-200">
        <h3 className="text-lg font-semibold text-[#BCB083] mb-3">Confirm Deletion</h3>
        <p className="text-sm text-gray-600 mb-5">Are you sure you want to delete this user? This action cannot be undone.</p>
        <div className="flex justify-end gap-3">
          <button onClick={onClose} className="px-4 py-2 text-sm bg-gray-200 rounded hover:bg-gray-300">Cancel</button>
          <button onClick={onDelete} className="px-4 py-2 text-sm bg-[#A48C65] rounded hover:bg-transparent border text-white hover:text-[#494C52] hover:border-[#A48C65] transition">Delete</button>
        </div>
      </div>
    </div>
  );
};

export default UserDeleteModal;
