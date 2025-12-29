// src/features/secretary/clients/ClientTable.jsx
import React, { useState, useEffect } from "react";
import { Trash2, Edit, FileText } from "lucide-react";
import DeleteModal from "./DeleteModal";
import { useDeleteClientMutation } from "../../api/secretaryApi";
import { toast } from "react-toastify";
import { useTranslation } from "react-i18next";


export default function ClientTable({
  clients = [],
  setClients,
  setSelectedClient,
  setShowForm,
}) {
  const { t } = useTranslation("seclinettable");

  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [clientToDelete, setClientToDelete] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(window.innerWidth >= 1024);

  const [deleteClient, { isLoading: isDeleting }] = useDeleteClientMutation();

  // ✅ Sidebar responsiveness
  useEffect(() => {
    const handleResize = () => {
      setSidebarOpen(window.innerWidth >= 1024);
    };

    const handleSidebarToggle = () => {
      const sidebar = document.querySelector("aside");
      if (sidebar) {
        setSidebarOpen(sidebar.classList.contains("w-64"));
      }
    };

    window.addEventListener("resize", handleResize);
    const interval = setInterval(handleSidebarToggle, 100);

    return () => {
      window.removeEventListener("resize", handleResize);
      clearInterval(interval);
    };
  }, []);

  const handleEditClick = (client) => {
    setSelectedClient(client);
    setShowForm(true);
  };

  const handleDeleteClick = (client) => {
    setClientToDelete(client);
    setDeleteModalOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!clientToDelete) return;

    try {
      await deleteClient(clientToDelete._id).unwrap();
      toast.success(t("clients.toast.deleteSuccess"));
    } catch (error) {
      toast.error(
        error?.data?.message || t("clients.toast.deleteError")
      );
    } finally {
      setDeleteModalOpen(false);
      setClientToDelete(null);
    }
  };

  // ✅ Empty State
  if (!clients.length)
    return (
      <div className="bg-white rounded shadow-sm border border-slate-200 p-8 text-center mt-4">
        <FileText className="w-8 h-8 text-slate-400 mx-auto mb-2" />
        <h3 className="text-sm font-semibold text-slate-700 mb-1">
          {t("clients.noClientsTitle")}
        </h3>
        <p className="text-[10px] text-slate-500">
          {t("clients.noClientsDesc")}
        </p>
      </div>
    );

  const TableRow = ({ c }) => (
    <>
      {/* Desktop Row */}
      <tr className="hidden md:table-row hover:bg-slate-50 transition">
        <td className="px-3 py-2 text-[10px] font-medium text-slate-600">
          {c._id?.slice(-6) || c.id}
        </td>
        <td className="px-3 py-2 text-sm text-slate-800">{c.name}</td>
        <td className="px-3 py-2 text-sm text-slate-700 hidden lg:table-cell">
          {c.email}
        </td>
        <td className="px-3 py-2 text-sm text-slate-700">
          {c.contactNumber}
        </td>
        <td className="px-3 py-2 text-sm text-slate-700 hidden xl:table-cell">
          {c.nationalId}
        </td>
        <td className="px-3 py-2 text-sm text-slate-700 hidden lg:table-cell truncate max-w-[150px]">
          {c.address}
        </td>
        <td className="px-3 py-2 text-sm text-slate-700 hidden xl:table-cell truncate max-w-[150px]">
          {c.additionalInfo || "-"}
        </td>
        <td className="px-3 py-2">
          <div className="flex justify-end gap-1">
            <button
              onClick={() => handleEditClick(c)}
              title={t("clients.actions.edit")}
              className="p-1 text-[#0B1F3B]"
            >
              <Edit size={16} />
            </button>
            <button
              onClick={() => handleDeleteClick(c)}
              title={t("clients.actions.delete")}
              className="p-1 text-[#0B1F3B]"
            >
              <Trash2 size={16} />
            </button>
          </div>
        </td>
      </tr>

      {/* Mobile Card */}
      <tr className="md:hidden">
        <td colSpan="8">
          <div className="p-3 border-b border-slate-200">
            <h3 className="text-xs font-semibold text-slate-800">
              {c.name}
            </h3>
            <p className="text-[10px] text-slate-500">
              {t("clients.mobile.id")}: {c._id?.slice(-6) || c.id}
            </p>

            <div className="space-y-1 text-[10px] mt-2">
              <div className="flex justify-between">
                <span>{t("clients.mobile.contact")}:</span>
                <span>{c.contactNumber}</span>
              </div>
              <div className="flex justify-between">
                <span>{t("clients.mobile.email")}:</span>
                <span>{c.email}</span>
              </div>
              <div className="flex justify-between">
                <span>{t("clients.mobile.nationalId")}:</span>
                <span>{c.nationalId}</span>
              </div>
            </div>
          </div>
        </td>
      </tr>
    </>
  );

  return (
    <div className="bg-white rounded shadow-sm border border-slate-200 overflow-hidden mt-4">
      <div className="hidden md:block overflow-x-auto">
        <table className="min-w-full">
          <thead className="bg-[#0B1F3B] text-white">
            <tr>
              {[
                "id",
                "name",
                "email",
                "contact",
                "nationalId",
                "address",
                "info",
                "actions",
              ].map((key) => (
                <th
                  key={key}
                  className="px-3 py-2 text-[10px] uppercase"
                >
                  {t(`clients.table.${key}`)}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {clients.map((c) => (
              <TableRow key={c._id || c.id} c={c} />
            ))}
          </tbody>
        </table>
      </div>

      {/* Delete Modal */}
      {deleteModalOpen && (
        <DeleteModal
          isOpen={deleteModalOpen}
          onClose={() => setDeleteModalOpen(false)}
          onDelete={handleConfirmDelete}
          name={clientToDelete?.name}
          isDeleting={isDeleting}
        />
      )}
    </div>
  );
}
