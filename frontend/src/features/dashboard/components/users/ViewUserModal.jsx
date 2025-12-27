
const ViewUserModal = ({ user, onClose }) => {
  if (!user) return null;
  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur  flex items-center justify-center z-[9999] p-4">
      <div className="bg-white rounded-xl p-6 w-full max-w-md shadow-xl border border-gray-200">
        <h3 className="text-2xl text-center font-bold mb-4 text-[#0B1F3B]">User Details</h3>
        <div className="space-y-2 text-slate-800">
          <p><strong>Name:</strong> {user.name}</p>
          <p><strong>Role:</strong> {user.role}</p>
          <p><strong>Email:</strong> {user.email}</p>
          <p><strong>Phone:</strong> {user.phone}</p>
          <p><strong>Status:</strong> {user.status}</p>
          <p><strong>Assigned Cases:</strong> {user.assignedCases}</p>
          <p><strong>Created On:</strong> {user.createdOn}</p>
        </div>
        <button onClick={onClose} className="mt-6 cursor-pointer w-full bg-[#0B1F3B] text-white font-semibold py-2 rounded-lg transition">
          Close
        </button>
      </div>
    </div>
  );
};

export default ViewUserModal;
