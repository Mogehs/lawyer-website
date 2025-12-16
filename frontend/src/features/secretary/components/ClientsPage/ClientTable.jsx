// src/features/secretary/clients/ClientTable.jsx
import React, { useState, useEffect } from "react";
import { Trash2, Edit, FileText } from "lucide-react";
import DeleteModal from "./DeleteModal";
import { useDeleteClientMutation } from "../../api/secretaryApi";
import { toast } from "react-toastify";

export default function ClientTable({
  clients = [],
  setClients,
  setSelectedClient,
  setShowForm,
}) {
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [clientToDelete, setClientToDelete] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(window.innerWidth >= 1024);

  const [deleteClient, { isLoading: isDeleting }] = useDeleteClientMutation();

  // ✅ Sync sidebar width responsiveness (same logic as ArchiveTable)
   useEffect(() => {
      const handleResize = () => {
         const desktop = window.innerWidth >= 1024;
         setSidebarOpen(desktop);
      };

      const handleSidebarToggle = () => {
         // Listen for sidebar state changes from the sidebar component
         const sidebar = document.querySelector('aside');
         if (sidebar) {
            const isOpen = sidebar.classList.contains('w-64');
            setSidebarOpen(isOpen);
         }
      };

      window.addEventListener('resize', handleResize);
      const interval = setInterval(handleSidebarToggle, 100);

      return () => {
         window.removeEventListener('resize', handleResize);
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
      toast.success("Client deleted successfully");
      setDeleteModalOpen(false);
      setClientToDelete(null);
    } catch (error) {
      toast.error(error?.data?.message || "Failed to delete client");
      setDeleteModalOpen(false);
      setClientToDelete(null);
    }
  };

  if (!clients.length)
    return (
      <div className="bg-white rounded shadow-sm border border-slate-200 p-8 text-center mt-4">
        <FileText className="w-8 h-8 text-slate-400 mx-auto mb-2" />
        <h3 className="text-sm font-semibold text-slate-700 mb-1">
          No Clients Found
        </h3>
        <p className="text-[10px] text-slate-500">
          Clients will appear here once added.
        </p>
      </div>
    );

  const TableRow = ({ c, idx }) => (
    <>
      {/* Desktop Row */}
      <tr className="hidden md:table-row hover:bg-slate-50 transition">
        <td className="px-3 py-2 text-[10px] font-medium text-slate-600">
          {c._id?.slice(-6) || c.id}
        </td>
        <td className="px-3 py-2 text-xs text-slate-800">{c.name}</td>
        <td className="px-3 py-2 text-xs text-slate-700 hidden lg:table-cell">
          {c.email}
        </td>
        <td className="px-3 py-2 text-xs text-slate-700">{c.contactNumber}</td>
        <td className="px-3 py-2 text-xs text-slate-700 hidden xl:table-cell">
          {c.nationalId}
        </td>
        <td className="px-3 py-2 text-xs text-slate-700 hidden lg:table-cell truncate max-w-[150px]">
          {c.address}
        </td>
        <td className="px-3 py-2 text-xs text-slate-700 hidden xl:table-cell truncate max-w-[150px]">
          {c.additionalInfo || "-"}
        </td>
        <td className="px-3 py-2">
          <div className="flex justify-end gap-1">
            <button
              className="p-1 text-[#A48C65] hover:text-[#A48C65]  rounded transition-colors"
              onClick={() => handleEditClick(c)}
              title="Edit"
            >
              <Edit size={16} />
            </button>
            <button
              className="p-1 text-[#A48C65] hover:text-[#A48C65]  rounded transition-colors"
              onClick={() => handleDeleteClick(c)}
              title="Delete"
            >
              <Trash2 size={16} />
            </button>
          </div>
        </td>
      </tr>

      {/* Mobile Card */}
      <tr className="md:hidden">
        <td colSpan="8" className="p-0">
          <div className="p-3 border-b border-slate-200 hover:bg-slate-50">
            <div className="flex justify-between items-start mb-2">
              <div className="flex-1">
                <h3 className="text-xs font-semibold text-slate-800">
                  {c.name}
                </h3>
                <p className="text-[10px] text-slate-500 mt-0.5">
                  ID: {c._id?.slice(-6) || c.id}
                </p>
              </div>
              <div className="flex gap-1">
                <button
                  className="p-1 text-slate-600 hover:text-blue-600 hover:bg-blue-50 rounded transition-colors"
                  onClick={() => handleEditClick(c)}
                >
                  <Edit size={16} />
                </button>
                <button
                  className="p-1 text-slate-600 hover:text-red-600 hover:bg-red-50 rounded transition-colors"
                  onClick={() => handleDeleteClick(c)}
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
            <div className="space-y-1 text-[10px]">
              <div className="flex justify-between">
                <span className="text-slate-500">Contact:</span>
                <span className="text-slate-700 font-medium">
                  {c.contactNumber}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Email:</span>
                <span className="text-slate-700 truncate ml-2">{c.email}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">National ID:</span>
                <span className="text-slate-700 font-medium">
                  {c.nationalId}
                </span>
              </div>
              {c.address && (
                <div>
                  <span className="text-slate-500">Address:</span>
                  <p className="text-slate-700 mt-0.5">{c.address}</p>
                </div>
              )}
              {c.additionalInfo && (
                <div>
                  <span className="text-slate-500">Info:</span>
                  <p className="text-slate-700 mt-0.5">{c.additionalInfo}</p>
                </div>
              )}
            </div>
          </div>
        </td>
      </tr>
    </>
  );

  return (
    <div className="bg-white rounded shadow-sm border border-slate-200 overflow-hidden mt-4">
      <div className="hidden md:block overflow-x-auto">
        <table className="min-w-full bg-white rounded-lg overflow-hidden">
          <thead className="bg-[#A48C65]  text-white hidden md:table-header-group">
            <tr>
              {[
                { label: "ID", class: "" },
                { label: "Name", class: "" },
                { label: "Email", class: "hidden lg:table-cell" },
                { label: "Contact", class: "" },
                { label: "National ID", class: "hidden xl:table-cell" },
                { label: "Address", class: "hidden lg:table-cell" },
                { label: "Info", class: "hidden xl:table-cell" },
                { label: "Actions", class: "text-right" },
              ].map((h) => (
                <th
                  key={h.label}
                  className={`px-3 py-2 text-[10px] font-semibold uppercase tracking-wide ${h.class}`}
                >
                  {h.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200">
            {clients.map((c, idx) => (
              <TableRow key={c._id || c.id} c={c} idx={idx} />
            ))}
          </tbody>
        </table>
      </div>

      {/* Delete Modal */}
      {deleteModalOpen && (
        <DeleteModal
          isOpen={deleteModalOpen}
          onClose={() => {
            setDeleteModalOpen(false);
            setClientToDelete(null);
          }}
          onDelete={handleConfirmDelete}
          name={clientToDelete?.name}
          isDeleting={isDeleting}
        />
      )}
    </div>
  );
}
