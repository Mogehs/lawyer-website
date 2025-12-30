import { useTranslation } from "react-i18next";

const UserDeleteModal = ({ show, onClose, onDelete }) => {
  const { t } = useTranslation("teamviewmodel");

  if (!show) return null;

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur flex items-center justify-center z-[9999]">
      <div className="bg-white rounded-xl shadow-lg p-6 w-[90%] max-w-sm border border-gray-200">
        <h3 className="text-lg font-semibold text-[#0B1F3B] mb-3">{t("userDeleteModal.title")}</h3>
        <p className="text-sm text-gray-600 mb-5">{t("userDeleteModal.message")}</p>
        <div className="flex justify-end gap-3">
          <button onClick={onClose} className="px-4 cursor-pointer py-2 text-sm bg-gray-200 rounded hover:bg-gray-300">
            {t("userDeleteModal.cancelButton")}
          </button>
          <button onClick={onDelete} className="px-4 py-2 text-sm bg-[#0B1F3B] rounded hover:bg-transparent border text-white cursor-pointer hover:text-[#494C52] hover:border-[#0B1F3B] transition">
            {t("userDeleteModal.deleteButton")}
          </button>
        </div>
      </div>
    </div>
  );
};

export default UserDeleteModal;
