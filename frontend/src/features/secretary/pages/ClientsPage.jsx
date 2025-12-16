// src/features/secretary/clients/ClientsPage.jsx
import React, { useEffect, useState } from "react";
import { Plus } from "lucide-react";
import ClientTable from "./../components/ClientsPage/ClientTable";
import ClientEditModal from "../components/ClientsPage/ClientEditModal";
import {
  useGetAllClientsQuery,
  useUpdateClientMutation,
  useCreateClientMutation,
} from "../api/secretaryApi";
import { toast } from "react-toastify";

const ClientsPage = () => {
  // Fetch clients from API
  const { data: clientsData, isLoading, error } = useGetAllClientsQuery();
  const [updateClient] = useUpdateClientMutation();
  const [createClient] = useCreateClientMutation();

  const [clients, setClients] = useState([]);
  const [selectedClient, setSelectedClient] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [isCreatingNew, setIsCreatingNew] = useState(false);

  // Update local state when API data changes
  useEffect(() => {
    if (clientsData?.clients) {
      setClients(clientsData.clients);
    }
  }, [clientsData]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">
            Client Management
          </h2>
          <p className="text-sm text-gray-600 mt-1">
            Manage client information and records
          </p>
        </div>
        <button
          onClick={() => {
            setSelectedClient({
              name: "",
              email: "",
              contactNumber: "",
              nationalId: "",
              address: "",
              additionalInfo: "",
            });
            setIsCreatingNew(true);
            setShowForm(true);
          }}
          className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-[#BCB083] to-[#A48C65] hover:from-[#A48C65] hover:to-[#8B7355] text-white rounded-lg font-medium transition-all duration-200 shadow-md"
        >
          <Plus size={20} />
          Add Client
        </button>
      </div>

      {/* Client Table */}
      <ClientTable
        clients={clients}
        setClients={setClients}
        setSelectedClient={(client) => {
          setSelectedClient(client);
          setIsCreatingNew(false);
        }}
        setShowForm={setShowForm}
      />

      {/* Client Form Modal */}
      {showForm && selectedClient && (
        <ClientEditModal
          client={selectedClient}
          isCreating={isCreatingNew}
          onClose={() => {
            setShowForm(false);
            setIsCreatingNew(false);
            setSelectedClient(null);
          }}
          onSave={async (updatedData) => {
            try {
              if (isCreatingNew) {
                await createClient(updatedData).unwrap();
                toast.success("Client created successfully");
              } else {
                await updateClient({
                  id: selectedClient._id || selectedClient.id,
                  data: updatedData,
                }).unwrap();
                toast.success("Client updated successfully");
              }
              setShowForm(false);
              setIsCreatingNew(false);
              setSelectedClient(null);
            } catch (error) {
              toast.error(
                error?.data?.message ||
                  `Failed to ${isCreatingNew ? "create" : "update"} client`
              );
            }
          }}
        />
      )}

      {/* Loading & Error States */}
      {isLoading && (
        <div className="text-center py-8">
          <div className="inline-block animate-spin rounded-full h-6 w-6 border-b-2 border-blue-500"></div>
          <p className="text-xs text-slate-500 mt-2">Loading clients...</p>
        </div>
      )}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded p-3 text-center">
          <p className="text-xs text-red-600">
            Error: {error?.data?.message || "Failed to load clients"}
          </p>
        </div>
      )}
    </div>
  );
};

export default ClientsPage;
