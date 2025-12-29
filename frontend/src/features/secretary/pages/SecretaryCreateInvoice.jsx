import { useState } from "react";
import { FileText, Plus, Trash2 } from "lucide-react";
import { useCreateInvoiceMutation } from "../../accounting/api/accountingApi";
import { useNavigate } from "react-router-dom";
import { useGetAllClientsQuery } from "../api/secretaryApi";
import { toast } from "react-toastify";
import { useTranslation } from "react-i18next";
import i18n from "../../../i18n";

const SecretaryCreateInvoice = () => {
  const { t } = useTranslation("CreateInvoice");
  const navigate = useNavigate();
  const [createInvoice, { isLoading }] = useCreateInvoiceMutation();
  const { data: clientsData, isLoading: isLoadingClients, error: clientsError } = useGetAllClientsQuery();

  const [formData, setFormData] = useState({
    client: "",
    serviceDescription: "",
    totalAmount: "",
    dueDate: "",
    isInstallment: false,
    notes: "",
  });

  const [installments, setInstallments] = useState([{ amount: "", dueDate: "" }]);

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
      toast.success(t("SecretaryCreateInvoice.form.submit") + " " + t("successfully"));
      navigate("/invoices");
    } catch (error) {
      toast.error(error?.data?.message || t("SecretaryCreateInvoice.form.errorCreate"));
    }
  };

  return (
    <div className={`space-y-6 ${i18n.language === "ar" ? "lg:mr-[220px]" : "lg:ml-[220px]"}`}>
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
          <FileText size={28} className="text-[#0B1F3B]" />
          {t("SecretaryCreateInvoice.header.title")}
        </h1>
        <p className="text-sm text-gray-600 mt-1">{t("SecretaryCreateInvoice.header.subtitle")}</p>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-md p-6 space-y-6">
        {/* Client Selection */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            {t("SecretaryCreateInvoice.form.client")} <span className="text-red-500">*</span>
          </label>
          <select
            name="client"
            value={formData.client}
            onChange={handleChange}
            required
            disabled={isLoadingClients}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0B1F3B] focus:border-transparent disabled:bg-gray-100"
          >
            <option value="">
              {isLoadingClients
                ? t("SecretaryCreateInvoice.form.loadingClients")
                : t("SecretaryCreateInvoice.form.clientPlaceholder")}
            </option>
            {clientsData?.clients?.map((client) => (
              <option key={client._id} value={client._id}>
                {client.name} - {client.email}
              </option>
            ))}
          </select>
          {clientsError && (
            <p className="mt-1 text-sm text-red-600">{t("SecretaryCreateInvoice.form.clientsError")}</p>
          )}
          {!isLoadingClients && !clientsError && (!clientsData?.clients || clientsData.clients.length === 0) && (
            <p className="mt-1 text-sm text-amber-600">{t("SecretaryCreateInvoice.form.noClients")}</p>
          )}
        </div>

        {/* Service Description */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            {t("SecretaryCreateInvoice.form.serviceDescription")} <span className="text-red-500">*</span>
          </label>
          <textarea
            name="serviceDescription"
            value={formData.serviceDescription}
            onChange={handleChange}
            required
            rows={4}
            placeholder={t("SecretaryCreateInvoice.form.serviceDescriptionPlaceholder")}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#A48C65] focus:border-transparent"
          />
        </div>

        {/* Total Amount */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            {t("SecretaryCreateInvoice.form.totalAmount")} <span className="text-red-500">*</span>
          </label>
          <input
            type="number"
            name="totalAmount"
            value={formData.totalAmount}
            onChange={handleChange}
            required
            min="0"
            step="0.01"
            placeholder={t("SecretaryCreateInvoice.form.totalAmountPlaceholder")}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#A48C65] focus:border-transparent"
          />
        </div>

        {/* Due Date */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            {t("SecretaryCreateInvoice.form.dueDate")} <span className="text-red-500">*</span>
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
            {t("SecretaryCreateInvoice.form.enableInstallment")}
          </label>
        </div>

        {/* Installments Section */}
        {formData.isInstallment && (
          <div className="border border-gray-200 rounded-lg p-4 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-800">{t("SecretaryCreateInvoice.form.installmentSchedule")}</h3>
              <button
                type="button"
                onClick={addInstallment}
                className="flex items-center gap-1 px-3 py-1 bg-[#0B1F3B] text-white rounded-lg text-sm font-medium transition-colors"
              >
                <Plus size={16} />
                {t("SecretaryCreateInvoice.form.addInstallment")}
              </button>
            </div>

            {installments.map((installment, index) => (
              <div key={index} className="grid grid-cols-1 md:grid-cols-3 gap-4 p-3 bg-gray-50 rounded-lg">
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">
                    {t("SecretaryCreateInvoice.form.installmentNumber", { index: index + 1 })}
                  </label>
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">
                    {t("SecretaryCreateInvoice.form.amount")}
                  </label>
                  <input
                    type="number"
                    value={installment.amount}
                    onChange={(e) => handleInstallmentChange(index, "amount", e.target.value)}
                    required={formData.isInstallment}
                    min="0"
                    step="0.01"
                    placeholder="0.00"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-[#A48C65] focus:border-transparent"
                  />
                </div>
                <div className="flex gap-2">
                  <div className="flex-1">
                    <label className="block text-xs font-medium text-gray-600 mb-1">{t("SecretaryCreateInvoice.form.dueDate")}</label>
                    <input
                      type="date"
                      value={installment.dueDate}
                      onChange={(e) => handleInstallmentChange(index, "dueDate", e.target.value)}
                      required={formData.isInstallment}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-[#A48C65] focus:border-transparent"
                    />
                  </div>
                  {installments.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeInstallment(index)}
                      className="mt-5 p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                      title={t("SecretaryCreateInvoice.form.remove")}
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
          <label className="block text-sm font-medium text-gray-700 mb-2">{t("SecretaryCreateInvoice.form.notes")}</label>
          <textarea
            name="notes"
            value={formData.notes}
            onChange={handleChange}
            rows={3}
            placeholder={t("SecretaryCreateInvoice.form.notes")}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#A48C65] focus:border-transparent"
          />
        </div>

        {/* Submit Buttons */}
        <div className="flex items-center gap-4 pt-4">
          <button
            type="submit"
            disabled={isLoading}
            className="px-6 py-2 bg-[#0B1F3B] text-white rounded-lg font-medium transition-all duration-200 shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? t("SecretaryCreateInvoice.form.creating") : t("SecretaryCreateInvoice.form.submit")}
          </button>
          <button
            type="button"
            onClick={() => navigate("/invoices")}
            className="px-6 py-2 bg-gray-200 text-gray-800 rounded-lg font-medium hover:bg-gray-300 transition-colors"
          >
            {t("SecretaryCreateInvoice.form.cancel")}
          </button>
        </div>
      </form>
    </div>
  );
};

export default SecretaryCreateInvoice;
