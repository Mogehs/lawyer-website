import { useState, useEffect } from "react";
import { CreditCard } from "lucide-react";
import { useRecordPaymentMutation } from "../api/accountingApi";
import { useNavigate } from "react-router-dom";
import { useGetInvoicesQuery } from "../api/accountingApi";

const RecordPayment = () => {
  const navigate = useNavigate();
  const [recordPayment, { isLoading }] = useRecordPaymentMutation();
  const { data: invoicesData } = useGetInvoicesQuery({ status: "" });

  const [formData, setFormData] = useState({
    invoice: "",
    amount: "",
    paymentMethod: "cash",
    paymentDate: new Date().toISOString().split("T")[0],
    checkNumber: "",
    checkBank: "",
    checkDepositDate: "",
    bankTransactionId: "",
    bankName: "",
    notes: "",
  });

  const [selectedInvoice, setSelectedInvoice] = useState(null);

  // Get unpaid/partially paid invoices
  const unpaidInvoices =
    invoicesData?.data?.filter(
      (inv) =>
        inv.status === "unpaid" ||
        inv.status === "partially_paid" ||
        inv.status === "overdue"
    ) || [];

  useEffect(() => {
    if (formData.invoice && unpaidInvoices.length > 0) {
      const invoice = unpaidInvoices.find((inv) => inv._id === formData.invoice);
      setSelectedInvoice(invoice || null);
    } else {
      setSelectedInvoice(null);
    }
  }, [formData.invoice, unpaidInvoices]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const payload = {
        invoice: formData.invoice,
        amount: parseFloat(formData.amount),
        paymentMethod: formData.paymentMethod,
        paymentDate: formData.paymentDate,
        notes: formData.notes,
      };

      // Add payment-specific fields
      if (formData.paymentMethod === "check") {
        payload.checkNumber = formData.checkNumber;
        payload.checkBank = formData.checkBank;
        payload.checkDepositDate = formData.checkDepositDate;
      } else if (formData.paymentMethod === "bank_transfer") {
        payload.bankTransactionId = formData.bankTransactionId;
        payload.bankName = formData.bankName;
      }

      await recordPayment(payload).unwrap();
      alert("Payment recorded successfully!");
      navigate("/accountant/payments");
    } catch (error) {
      alert(error?.data?.message || "Failed to record payment");
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "QAR",
    }).format(amount || 0);
  };

  return (
    <div className="space-y-6 lg:ml-[220px]">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
          <CreditCard size={28} className="text-[#0B1F3B]" />
          Record Payment
        </h1>
        <p className="text-sm text-gray-600 mt-1">تسجيل دفعة</p>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-md p-6">
        <div className="space-y-6">
          {/* Invoice Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Select Invoice / اختر الفاتورة <span className="text-red-500">*</span>
            </label>
            <select
              name="invoice"
              value={formData.invoice}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0B1F3B] focus:border-transparent"
            >
              <option value="">Select Invoice</option>
              {unpaidInvoices.map((invoice) => (
                <option key={invoice._id} value={invoice._id}>
                  {invoice.invoiceNumber} - {invoice.client?.name} - Remaining:{" "}
                  {formatCurrency(invoice.remainingAmount)}
                </option>
              ))}
            </select>
          </div>

          {/* Invoice Details */}
          {selectedInvoice && (
            <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <h3 className="font-semibold text-gray-800 mb-2">Invoice Details</h3>
              <div className="grid grid-cols-2 gap-2 text-sm">
                <div>
                  <span className="text-gray-600">Client:</span>
                  <span className="ml-2 font-medium">
                    {selectedInvoice.client?.name}
                  </span>
                </div>
                <div>
                  <span className="text-gray-600">Total Amount:</span>
                  <span className="ml-2 font-medium">
                    {formatCurrency(selectedInvoice.totalAmount)}
                  </span>
                </div>
                <div>
                  <span className="text-gray-600">Paid Amount:</span>
                  <span className="ml-2 font-medium text-green-600">
                    {formatCurrency(selectedInvoice.paidAmount)}
                  </span>
                </div>
                <div>
                  <span className="text-gray-600">Remaining:</span>
                  <span className="ml-2 font-medium text-red-600">
                    {formatCurrency(selectedInvoice.remainingAmount)}
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* Amount */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Payment Amount / المبلغ المدفوع <span className="text-red-500">*</span>
            </label>
            <input
              type="number"
              name="amount"
              value={formData.amount}
              onChange={handleChange}
              required
              min="0.01"
              max={selectedInvoice?.remainingAmount || undefined}
              step="0.01"
              placeholder="0.00"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0B1F3B] focus:border-transparent"
            />
            {selectedInvoice && (
              <p className="text-xs text-gray-500 mt-1">
                Maximum: {formatCurrency(selectedInvoice.remainingAmount)}
              </p>
            )}
          </div>

          {/* Payment Method */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Payment Method / طريقة الدفع <span className="text-red-500">*</span>
            </label>
            <select
              name="paymentMethod"
              value={formData.paymentMethod}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0B1F3B] focus:border-transparent"
            >
              <option value="cash">Cash / نقدي</option>
              <option value="bank_transfer">Bank Transfer / تحويل بنكي</option>
              <option value="card">Card / بطاقة</option>
              <option value="check">Check / شيك</option>
            </select>
          </div>

          {/* Check Details */}
          {formData.paymentMethod === "check" && (
            <div className="border border-gray-200 rounded-lg p-4 space-y-4">
              <h3 className="font-semibold text-gray-800">Check Details</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Check Number <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="checkNumber"
                    value={formData.checkNumber}
                    onChange={handleChange}
                    required
                    placeholder="Enter check number"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0B1F3B] focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Bank Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="checkBank"
                    value={formData.checkBank}
                    onChange={handleChange}
                    required
                    placeholder="Enter bank name"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0B1F3B] focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Deposit Date <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="date"
                    name="checkDepositDate"
                    value={formData.checkDepositDate}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0B1F3B] focus:border-transparent"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Bank Transfer Details */}
          {formData.paymentMethod === "bank_transfer" && (
            <div className="border border-gray-200 rounded-lg p-4 space-y-4">
              <h3 className="font-semibold text-gray-800">Bank Transfer Details</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Transaction ID <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="bankTransactionId"
                    value={formData.bankTransactionId}
                    onChange={handleChange}
                    required
                    placeholder="Enter transaction ID"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0B1F3B] focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Bank Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="bankName"
                    value={formData.bankName}
                    onChange={handleChange}
                    required
                    placeholder="Enter bank name"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0B1F3B] focus:border-transparent"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Payment Date */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Payment Date / تاريخ الدفع <span className="text-red-500">*</span>
            </label>
            <input
              type="date"
              name="paymentDate"
              value={formData.paymentDate}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0B1F3B] focus:border-transparent"
            />
          </div>

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
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0B1F3B] focus:border-transparent"
            />
          </div>

          {/* Submit Buttons */}
          <div className="flex items-center gap-4 pt-4">
            <button
              type="submit"
              disabled={isLoading}
              className="px-6 py-2 bg-[#0B1F3B] cursor-pointer text-white rounded-lg font-medium transition-all duration-200 shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? "Recording..." : "Record Payment"}
            </button>
            <button
              type="button"
              onClick={() => navigate("/accountant/payments")}
              className="px-6 py-2 bg-gray-200 cursor-pointer hover:bg-gray-300 text-gray-800 rounded-lg font-medium transition-colors"
            >
              Cancel
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default RecordPayment;

