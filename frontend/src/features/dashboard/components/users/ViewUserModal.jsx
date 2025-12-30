import { useTranslation } from "react-i18next";

const ViewUserModal = ({ user, onClose }) => {
  const { t } = useTranslation("teamviewmodel");
  if (!user) return null;

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur flex items-center justify-center z-[9999] p-4">
      <div className="bg-white rounded-xl p-6 w-full max-w-md shadow-xl border border-gray-200">
        <h3 className="text-2xl text-center font-bold mb-4 text-[#0B1F3B]">
          {t("viewUserModal.title")}
        </h3>
        <div className="space-y-2 text-slate-800">
          <p><strong>{t("viewUserModal.name")}:</strong> {user.name}</p>
          <p><strong>{t("viewUserModal.role")}:</strong> {user.role}</p>
          <p><strong>{t("viewUserModal.email")}:</strong> {user.email}</p>
          <p><strong>{t("viewUserModal.phone")}:</strong> {user.phone}</p>
          <p><strong>{t("viewUserModal.status")}:</strong> {user.status}</p>
          <p><strong>{t("viewUserModal.assignedCases")}:</strong> {user.assignedCases}</p>
          <p><strong>{t("viewUserModal.createdOn")}:</strong> {user.createdOn}</p>
        </div>
        <button
          onClick={onClose}
          className="mt-6 cursor-pointer w-full bg-[#0B1F3B] text-white font-semibold py-2 rounded-lg transition"
        >
          {t("viewUserModal.closeButton")}
        </button>
      </div>
    </div>
  );
};

export default ViewUserModal;
