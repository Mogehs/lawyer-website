import { useState } from "react";
import { FileText, Plus, Trash2 } from "lucide-react";
import { useCreateInvoiceMutation } from "../../accounting/api/accountingApi";
import { useNavigate } from "react-router-dom";
import { useGetAllClientsQuery } from "../api/secretaryApi";
import { toast } from "react-toastify";

const SecretaryCreateInvoice = () => {
  const navigate = useNavigate();
  const [createInvoice, { isLoading }] = useCreateInvoiceMutation();
  const { data: clientsData, isLoading: isLoadingClients, error: clientsError } = useGetAllClientsQuery();

  console.log("Clients Data:", clientsData); // Debug log

  const [formData, setFormData] = useState({
    client: "",
    serviceDescription: "",
    totalAmount: "",
    dueDate: "",
    isInstallment: false,
    notes: "",
  });

  const [installments, setInstallments] = useState([
    { amount: "", dueDate: "" },
  ]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleInstallmentChange = (index, field, value) => {
    const updated = [...installments];
    updated[index][field] = value;
    setInstallments(updated);
  };

  const addInstallment = () => {
    setInstallments([...installments, { amount: "", dueDate: "" }]);
  };

  const removeInstallment = (index) => {
    if (installments.length > 1) {
      setInstallments(installments.filter((_, i) => i !== index));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const payload = {
        ...formData,
        totalAmount: parseFloat(formData.totalAmount),
      };

      if (formData.isInstallment && installments.length > 0) {
        payload.installments = installments.map((inst) => ({
          amount: parseFloat(inst.amount),
          dueDate: inst.dueDate,
        }));
      }

      await createInvoice(payload).unwrap();
      toast.success("Invoice created successfully!");
      navigate("/invoices");
    } catch (error) {
      toast.error(error?.data?.message || "Failed to create invoice");
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
          <FileText size={28} className="text-[#A48C65]" />
          Create New Invoice
        </h1>
        <p className="text-sm text-gray-600 mt-1">إنشاء فاتورة جديدة</p>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-md p-6">
        <div className="space-y-6">
          {/* Client Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Client / العميل <span className="text-red-500">*</span>
            </label>
            <select
              name="client"
              value={formData.client}
              onChange={handleChange}
              required
              disabled={isLoadingClients}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#A48C65] focus:border-transparent disabled:bg-gray-100"
            >
              <option value="">
                {isLoadingClients ? "Loading clients..." : "Select Client"}
              </option>
              {clientsData?.clients?.map((client) => (
                <option key={client._id} value={client._id}>
                  {client.name} - {client.email}
                </option>
              ))}
            </select>
            {clientsError && (
              <p className="mt-1 text-sm text-red-600">
                Error loading clients. Please refresh the page.
              </p>
            )}
            {!isLoadingClients && !clientsError && (!clientsData?.clients || clientsData.clients.length === 0) && (
              <p className="mt-1 text-sm text-amber-600">
                No clients found. Please add clients first.
              </p>
            )}
          </div>

          {/* Service Description */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Service Description / وصف الخدمة <span className="text-red-500">*</span>
            </label>
            <textarea
              name="serviceDescription"
              value={formData.serviceDescription}
              onChange={handleChange}
              required
              rows={4}
              placeholder="Enter service details..."
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#A48C65] focus:border-transparent"
            />
          </div>

          {/* Total Amount */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Total Amount / المبلغ الإجمالي <span className="text-red-500">*</span>
            </label>
            <input
              type="number"
              name="totalAmount"
              value={formData.totalAmount}
              onChange={handleChange}
              required
              min="0"
              step="0.01"
              placeholder="0.00"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#A48C65] focus:border-transparent"
            />
          </div>

          {/* Due Date */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Due Date / تاريخ الاستحقاق <span className="text-red-500">*</span>
            </label>
            <input
              type="date"
              name="dueDate"
              value={formData.dueDate}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#A48C65] focus:border-transparent"
            />
          </div>

          {/* Installment Checkbox */}
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="isInstallment"
              name="isInstallment"
              checked={formData.isInstallment}
              onChange={handleChange}
              className="w-4 h-4 text-[#A48C65] border-gray-300 rounded focus:ring-[#A48C65]"
            />
            <label htmlFor="isInstallment" className="text-sm font-medium text-gray-700">
              Enable Installment Payment / تفعيل الدفع بالتقسيط
            </label>
          </div>

          {/* Installments Section */}
          {formData.isInstallment && (
            <div className="border border-gray-200 rounded-lg p-4 space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-800">
                  Installment Schedule
                </h3>
                <button
                  type="button"
                  onClick={addInstallment}
                  className="flex items-center gap-1 px-3 py-1 bg-[#A48C65] hover:bg-[#8B7355] text-white rounded-lg text-sm font-medium transition-colors"
                >
                  <Plus size={16} />
                  Add
                </button>
              </div>

              {installments.map((installment, index) => (
                <div
                  key={index}
                  className="grid grid-cols-1 md:grid-cols-3 gap-4 p-3 bg-gray-50 rounded-lg"
                >
                  <div>
                    <label className="block text-xs font-medium text-gray-600 mb-1">
                      Installment #{index + 1}
                    </label>
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-600 mb-1">
                      Amount
                    </label>
                    <input
                      type="number"
                      value={installment.amount}
                      onChange={(e) =>
                        handleInstallmentChange(index, "amount", e.target.value)
                      }
                      required={formData.isInstallment}
                      min="0"
                      step="0.01"
                      placeholder="0.00"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-[#A48C65] focus:border-transparent"
                    />
                  </div>
                  <div className="flex gap-2">
                    <div className="flex-1">
                      <label className="block text-xs font-medium text-gray-600 mb-1">
                        Due Date
                      </label>
                      <input
                        type="date"
                        value={installment.dueDate}
                        onChange={(e) =>
                          handleInstallmentChange(index, "dueDate", e.target.value)
                        }
                        required={formData.isInstallment}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-[#A48C65] focus:border-transparent"
                      />
                    </div>
                    {installments.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeInstallment(index)}
                        className="mt-5 p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        title="Remove"
                      >
                        <Trash2 size={18} />
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Notes */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Notes / ملاحظات
            </label>
            <textarea
              name="notes"
              value={formData.notes}
              onChange={handleChange}
              rows={3}
              placeholder="Additional notes..."
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#A48C65] focus:border-transparent"
            />
          </div>

          {/* Submit Buttons */}
          <div className="flex items-center gap-4 pt-4">
            <button
              type="submit"
              disabled={isLoading}
              className="px-6 py-2 bg-gradient-to-r from-[#BCB083] to-[#A48C65] hover:from-[#A48C65] hover:to-[#8B7355] text-white rounded-lg font-medium transition-all duration-200 shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? "Creating..." : "Create Invoice"}
            </button>
            <button
              type="button"
              onClick={() => navigate("/invoices")}
              className="px-6 py-2 bg-gray-200 hover:bg-gray-300 text-gray-800 rounded-lg font-medium transition-colors"
            >
              Cancel
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default SecretaryCreateInvoice;

