import React, { useState, useEffect, useRef } from "react";
import { useGetAllClientsQuery } from "../../api/secretaryApi";

const ClientInfoForm = ({
  clientInfo,
  onChange,
  onClientSelect,
  selectedClientId: parentSelectedClientId,
}) => {
  const { data: clientsData } = useGetAllClientsQuery();
  const [useExistingClient, setUseExistingClient] = useState(false);
  const [selectedClientId, setSelectedClientId] = useState("");
  const isInitialMount = useRef(true);

  // Only sync with parent on initial mount or when parent value actually changes
  useEffect(() => {
    if (parentSelectedClientId && parentSelectedClientId !== selectedClientId) {
      setSelectedClientId(parentSelectedClientId);
      setUseExistingClient(true);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [parentSelectedClientId]); // Exclude selectedClientId to prevent circular dependency

  // Notify parent when local selection changes (but not on initial mount)
  useEffect(() => {
    if (isInitialMount.current) {
      isInitialMount.current = false;
      return;
    }

    if (onClientSelect) {
      onClientSelect(selectedClientId || null);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedClientId]); // onClientSelect is now memoized in parent, safe to exclude

  const handleClientSelect = (e) => {
    const clientId = e.target.value;
    setSelectedClientId(clientId);

    if (clientId) {
      const client = clientsData?.clients?.find((c) => c._id === clientId);
      if (client) {
        // Populate form with selected client data
        onChange({ target: { name: "name", value: client.name } });
        onChange({ target: { name: "contact", value: client.contactNumber } });
        onChange({ target: { name: "email", value: client.email } });
        onChange({ target: { name: "nationalId", value: client.nationalId } });
        onChange({ target: { name: "address", value: client.address || "" } });
        onChange({
          target: {
            name: "additionalInformation",
            value: client.additionalInfo || "",
          },
        });
      }
    }
  };

  return (
    <div className="space-y-3">
      {/* Client Selection Toggle */}
      <div className="bg-blue-50 border border-[#0B1F3B] rounded p-3">
        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            id="useExisting"
            checked={useExistingClient}
            onChange={(e) => {
              setUseExistingClient(e.target.checked);
              if (!e.target.checked) {
                setSelectedClientId("");
              }
            }}
            className="w-3 h-3 text-[#0B1F3B] border border-[#0B1F3B]"
          />
          <label
            htmlFor="useExisting"
            className="text-xs font-medium text-slate-700"
          >
            Select from existing clients
          </label>
        </div>

        {useExistingClient && (
          <div className="mt-2">
            <select
              value={selectedClientId}
              onChange={handleClientSelect}
              className="w-full rounded px-2 py-1.5 border border-[#0B1F3B] bg-white focus:outline-none focus:ring-1 focus:ring-[#0B1F3B] text-xs"
            >
              <option value="">-- Select a client --</option>
              {clientsData?.clients?.map((client) => (
                <option key={client._id} value={client._id}>
                  {client.name} - {client.email}
                </option>
              ))}
            </select>
          </div>
        )}
      </div>

      {/* Personal Information Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {/* Client Name */}
        <div className="space-y-1">
          <label className="block text-[10px] font-semibold uppercase tracking-wide text-slate-600">
            Client Name *
          </label>
          <input
            type="text"
            name="name"
            placeholder="Enter name"
            value={clientInfo.name}
            onChange={onChange}
            className="w-full rounded px-2 py-1.5 border border-[#0B1F3B] bg-slate-50 focus:outline-none focus:ring-1 focus:ring-[#0B1F3B] text-xs"
            required
          />
        </div>

        {/* Contact Number */}
        <div className="space-y-1">
          <label className="block text-[10px] font-semibold uppercase tracking-wide text-slate-600">
            Contact Number *
          </label>
          <input
            type="text"
            name="contact"
            placeholder="Enter contact number"
            value={clientInfo.contact}
            onChange={onChange}
            className="w-full rounded px-2 py-1.5 border border-[#0B1F3B] bg-slate-50 focus:outline-none focus:ring-1 focus:ring-[#0B1F3B] text-xs"
            required
          />
        </div>

        {/* Email */}
        <div className="space-y-1">
          <label className="block text-[10px] font-semibold uppercase tracking-wide text-slate-600">
            Email Address *
          </label>
          <input
            type="email"
            name="email"
            placeholder="Enter email address"
            value={clientInfo.email}
            onChange={onChange}
            className="w-full rounded px-2 py-1.5 border border-[#0B1F3B] bg-slate-50 focus:outline-none focus:ring-1 focus:ring-[#0B1F3B] text-xs"
            required
          />
        </div>

        {/* National ID / Passport */}
        <div className="space-y-1">
          <label className="block text-[10px] font-semibold uppercase tracking-wide text-slate-600">
            National ID / Passport *
          </label>
          <input
            type="text"
            name="nationalId"
            placeholder="Enter ID or passport number"
            value={clientInfo.nationalId}
            onChange={onChange}
            className="w-full rounded px-2 py-1.5 border border-[#0B1F3B] bg-slate-50 focus:outline-none focus:ring-1 focus:ring-[#0B1F3B] text-xs"
            required
          />
        </div>
      </div>

      {/* Full Width Fields */}
      <div className="space-y-3">
        {/* Address */}
        <div className="space-y-1">
          <label className="block text-[10px] font-semibold uppercase tracking-wide text-slate-600">
            Address *
          </label>
          <textarea
            name="address"
            placeholder="Enter complete address"
            value={clientInfo.address}
            onChange={onChange}
            rows="2"
            className="w-full rounded px-2 py-1.5 border border-[#0B1F3B] bg-slate-50 focus:outline-none focus:ring-1 focus:ring-[#0B1F3B] text-xs resize-y"
            required
          />
        </div>

        {/* Additional Information */}
        <div className="space-y-1">
          <label className="block text-[10px] font-semibold uppercase tracking-wide text-slate-600">
            Additional Information
          </label>
          <textarea
            name="additionalInformation"
            placeholder="Any additional notes"
            value={clientInfo.additionalInformation}
            onChange={onChange}
            rows="2"
            className="w-full rounded px-2 py-1.5 border border-[#0B1F3B] bg-slate-50 focus:outline-none focus:ring-1 focus:ring-[#0B1F3B] text-xs resize-y"
          />
        </div>
      </div>
    </div>
  );
};

export default ClientInfoForm;
