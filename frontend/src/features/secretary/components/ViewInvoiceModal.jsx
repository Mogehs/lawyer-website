import { X, FileText, User, Calendar, DollarSign } from "lucide-react";

const ViewInvoiceModal = ({ invoice, isOpen, onClose }) => {
  if (!isOpen || !invoice) return null;

  // Format currency
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount || 0);
  };

  // Format date
  const formatDate = (date) => {
    return new Intl.DateTimeFormat("en-US", {
      month: "long",
      day: "numeric",
      year: "numeric",
    }).format(new Date(date));
  };

  // Get status badge
  const getStatusBadge = (status) => {
    const badges = {
      paid: "bg-green-100 text-green-700",
      partially_paid: "bg-yellow-100 text-yellow-700",
      unpaid: "bg-gray-100 text-gray-700",
      overdue: "bg-red-100 text-red-700",
    };
    return badges[status] || "bg-gray-100 text-gray-700";
  };

  return (
    <div className="fixed inset-0 bg-black/20 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between rounded-t-xl">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-[#0B1F3B]/10 rounded-lg">
              <FileText size={20} className="text-[#0B1F3B]" />
            </div>
            <h2 className="text-lg font-semibold text-gray-900">Invoice Details</h2>
          </div>
          <button
            onClick={onClose}
            className="hover:bg-gray-100 rounded-full p-2 transition-colors"
          >
            <X size={20} className="text-gray-500" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Invoice Number and Status */}
          <div className="flex items-center justify-between pb-4 border-b border-gray-100">
            <div>
              <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">Invoice Number</p>
              <p className="text-xl font-bold text-gray-900 mt-1">
                {invoice.invoiceNumber}
              </p>
            </div>
            <span
              className={`px-3 py-1.5 text-xs font-medium rounded-lg ${getStatusBadge(
                invoice.status
              )}`}
            >
              {invoice.status.replace("_", " ").toUpperCase()}
            </span>
          </div>

          {/* Client Information */}
          <div className="pt-4">
            <div className="flex items-center gap-2 mb-3">
              <User size={18} className="text-[#0B1F3B]" />
              <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wide">
                Client Information
              </h3>
            </div>
            <div className="bg-gray-50/50 rounded-lg p-4 space-y-3 border border-gray-100">
              <div>
                <p className="text-[10px] font-medium text-gray-500 uppercase tracking-wider">Name</p>
                <p className="text-sm font-semibold text-gray-900 mt-0.5">
                  {invoice.client?.name || "N/A"}
                </p>
              </div>
              <div>
                <p className="text-[10px] font-medium text-gray-500 uppercase tracking-wider">Email</p>
                <p className="text-sm text-gray-700 mt-0.5">
                  {invoice.client?.email || "N/A"}
                </p>
              </div>
              {(invoice.client?.phone || invoice.client?.contactNumber) && (
                <div>
                  <p className="text-[10px] font-medium text-gray-500 uppercase tracking-wider">Phone</p>
                  <p className="text-sm text-gray-700 mt-0.5">
                    {invoice.client?.phone || invoice.client?.contactNumber}
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Service Description */}
          <div className="pt-4">
            <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wide mb-2">
              Service Description
            </h3>
            <p className="text-sm text-gray-700 leading-relaxed">
              {invoice.serviceDescription}
            </p>
          </div>

          {/* Financial Details */}
          <div className="pt-4">
            <div className="flex items-center gap-2 mb-3">
              <DollarSign size={18} className="text-[#0B1F3B]" />
              <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wide">
                Financial Details
              </h3>
            </div>
            <div className="bg-gradient-to-br from-gray-50 to-gray-100/50 rounded-lg p-4 space-y-3 border border-gray-100">
              <div className="flex justify-between items-center">
                <span className="text-xs font-medium text-gray-600">Total Amount</span>
                <span className="text-base font-bold text-gray-900">
                  {formatCurrency(invoice.totalAmount)}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-xs font-medium text-gray-600">Paid Amount</span>
                <span className="text-base font-semibold text-green-600">
                  {formatCurrency(invoice.paidAmount)}
                </span>
              </div>
              <div className="flex justify-between items-center pt-3 border-t border-gray-200">
                <span className="text-xs font-semibold text-gray-700">
                  Remaining Amount
                </span>
                <span className="text-lg font-bold text-[#0B1F3B]">
                  {formatCurrency(invoice.remainingAmount)}
                </span>
              </div>
            </div>
          </div>

          {/* Dates */}
          <div className="pt-4">
            <div className="flex items-center gap-2 mb-3">
              <Calendar size={18} className="text-[#0B1F3B]" />
              <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wide">Dates</h3>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-gray-50/50 rounded-lg p-3 border border-gray-100">
                <p className="text-[10px] font-medium text-gray-500 uppercase tracking-wider mb-1">Created Date</p>
                <p className="text-sm font-semibold text-gray-900">
                  {formatDate(invoice.createdAt)}
                </p>
              </div>
              <div className="bg-gray-50/50 rounded-lg p-3 border border-gray-100">
                <p className="text-[10px] font-medium text-gray-500 uppercase tracking-wider mb-1">Due Date</p>
                <p className="text-sm font-semibold text-gray-900">
                  {formatDate(invoice.dueDate)}
                </p>
              </div>
            </div>
          </div>

          {/* Installment Info */}
          {invoice.isInstallment && (
            <div className="pt-4">
              <div className="bg-blue-50/50 border border-blue-200/50 rounded-lg p-3">
                <p className="text-xs font-medium text-blue-700">
                  📋 This invoice has an installment payment plan
                </p>
              </div>
            </div>
          )}

          {/* Notes */}
          {invoice.notes && (
            <div className="pt-4">
              <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wide mb-2">
                Notes
              </h3>
              <p className="text-sm text-gray-700 leading-relaxed">
                {invoice.notes}
              </p>
            </div>
          )}

          {/* Created By */}
          <div className="pt-4 border-t border-gray-100">
            <p className="text-[10px] font-medium text-gray-500 uppercase tracking-wider">Created by</p>
            <p className="text-sm font-medium text-gray-900 mt-0.5">
              {invoice.createdBy?.name || "Unknown"}
            </p>
            <p className="text-xs text-gray-500">
              {invoice.createdBy?.email || "N/A"}
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="sticky bottom-0 bg-white px-6 py-4 flex justify-end gap-3 rounded-b-xl border-t border-gray-200">
          <button
            onClick={onClose}
            className="px-6 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg font-medium transition-all duration-200 text-sm"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default ViewInvoiceModal;

