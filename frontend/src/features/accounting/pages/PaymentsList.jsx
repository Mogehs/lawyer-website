import { useState } from "react";
import {
  CreditCard,
  Plus,
  Search,
  Eye,
  Trash2,
  AlertCircle,
} from "lucide-react";
import { useGetPaymentsQuery, useDeletePaymentMutation } from "../api/accountingApi";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import { selectUserProfile } from "../../auth/authSlice";
import { useTranslation } from "react-i18next";
import i18n from "../../../i18n";

const PaymentsList = () => {
  const { t } = useTranslation("accPaymentList");
  const [filters, setFilters] = useState({
    paymentMethod: "",
    startDate: "",
    endDate: "",
    page: 1,
    limit: 10,
  });
  const [searchTerm, setSearchTerm] = useState("");
  const isRTL = i18n.dir() === "rtl";

  const userProfile = useSelector(selectUserProfile);
  const isDirector = userProfile?.role === "director";

  const { data, isLoading, error } = useGetPaymentsQuery(filters);
  const [deletePayment] = useDeletePaymentMutation();

  const payments = data?.data || [];
  const pagination = data?.pagination || {};

  // State for Modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedPayment, setSelectedPayment] = useState(null);

  // Format currency
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "QAR",
    }).format(amount || 0);
  };

  // Format date
  const formatDate = (date) => {
    return new Intl.DateTimeFormat("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    }).format(new Date(date));
  };

  // Get payment method label
  const getPaymentMethodLabel = (method) => {
    const labels = {
      cash: t("cash"),
      bank_transfer: t("bankTransfer"),
      card: t("card"),
      check: t("check"),
    };
    return labels[method] || method;
  };

  // Get payment method badge
  const getPaymentMethodBadge = (method) => {
    const badges = {
      cash: "bg-green-100 text-green-700",
      bank_transfer: "bg-blue-100 text-blue-700",
      card: "bg-purple-100 text-purple-700",
      check: "bg-yellow-100 text-yellow-700",
    };
    return badges[method] || "bg-gray-100 text-gray-700";
  };

  // Handle delete
  const handleDelete = async (id) => {
    if (window.confirm(t("areYouSure"))) {
      try {
        await deletePayment(id).unwrap();
        alert(t("paymentRecordSuccessfully"));
      } catch (error) {
        alert(error?.data?.message || t("failedPaymentRecord"));
      }
    }
  };

  // Filter payments by search
  const filteredPayments = payments.filter((payment) => {
    if (!searchTerm) return true;
    const search = searchTerm.toLowerCase();
    return (
      payment.receiptNumber?.toLowerCase().includes(search) ||
      payment.invoice?.invoiceNumber?.toLowerCase().includes(search) ||
      payment.invoice?.client?.name?.toLowerCase().includes(search)
    );
  });

  // Handle opening the modal
  const handleOpenModal = (payment) => {
    setSelectedPayment(payment);
    setIsModalOpen(true);
  };

  // Handle closing the modal
  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedPayment(null);
  };

  // Modal Component
  const PaymentDetailModal = ({ isOpen, onClose, payment }) => {
    if (!payment) return null;

    return (
      <div
        className={`fixed inset-0 z-50 bg-black/60 bg-opacity-50 flex items-center justify-center ${isOpen ? 'block' : 'hidden'}`}
        onClick={onClose}
      >
        <div
          className="bg-white p-6 rounded-lg w-96"
          onClick={(e) => e.stopPropagation()} // Prevent click from closing the modal
        >
          <h2 className="text-xl font-bold text-gray-800 mb-4">{t("invoiceDetail")}</h2>
          <p><strong>{t("receiptNumber")}:</strong> {payment.receiptNumber}</p>
          <p><strong>{t("invoiceNumber")}:</strong> {payment.invoice?.invoiceNumber || "N/A"}</p>
          <p><strong>{t("client")}:</strong> {payment.invoice?.client?.name || "N/A"}</p>
          <p><strong>{t("amount")}:</strong> {formatCurrency(payment.amount)}</p>
          <p><strong>{t("paymentMethod")}:</strong> {getPaymentMethodLabel(payment.paymentMethod)}</p>
          <p><strong>{t("paymentDate")}:</strong> {formatDate(payment.paymentDate)}</p>
          <div className="flex justify-end mt-4">
            <button
              onClick={onClose}
              className="px-4 py-2 bg-[#0B1F3B] text-white rounded-lg"
            >
              {t("cancel")}
            </button>
          </div>
        </div>
      </div>
    );
  };

  if (error) {
    return (
      <div className="flex justify-center items-center h-full">
        <div className="text-red-600 flex items-center gap-2">
          <AlertCircle size={20} />
          <span>{t("failedToLoadPayment")}</span>
        </div>
      </div>
    );
  }

  return (
    <div className={`space-y-6 ${isRTL ? "lg:mr-[220px]" : "lg:ml-[220px]"}`}>
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
            <CreditCard size={28} className="text-[#0B1F3B]" />
            {t("paymentsManagement")}
          </h1>
          <p className="text-sm text-gray-600 mt-1">{t("paymentsManagement")}</p>
        </div>

        <Link
          to="/accountant/payments/record"
          className="flex items-center gap-2 px-4 py-2 bg-[#0B1F3B] text-white rounded-lg font-medium transition-all duration-200 shadow-md"
        >
          <Plus size={20} />
          {t("recordPayment")}
        </Link>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow-md p-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {/* Search */}
          <div className="relative">
            <Search
              size={18}
              className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
            />
            <input
              type="text"
              placeholder={t("searchPayments")}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0B1F3B] focus:border-transparent"
            />
          </div>

          {/* Payment Method Filter */}
          <select
            value={filters.paymentMethod}
            onChange={(e) =>
              setFilters({ ...filters, paymentMethod: e.target.value, page: 1 })
            }
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0B1F3B] focus:border-transparent"
          >
            <option value="">{t("allMethods")}</option>
            <option value="cash">{t("cash")}</option>
            <option value="bank_transfer">{t("bankTransfer")}</option>
            <option value="card">{t("card")}</option>
            <option value="check">{t("check")}</option>
          </select>

          {/* Start Date */}
          <input
            type="date"
            value={filters.startDate}
            onChange={(e) =>
              setFilters({ ...filters, startDate: e.target.value, page: 1 })
            }
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0B1F3B] focus:border-transparent"
          />

          {/* End Date */}
          <input
            type="date"
            value={filters.endDate}
            onChange={(e) =>
              setFilters({ ...filters, endDate: e.target.value, page: 1 })
            }
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0B1F3B] focus:border-transparent"
          />
        </div>

        {(filters.paymentMethod || filters.startDate || filters.endDate) && (
          <button
            onClick={() =>
              setFilters({
                paymentMethod: "",
                startDate: "",
                endDate: "",
                page: 1,
                limit: 10,
              })
            }
            className="mt-3 text-sm text-[#0B1F3B] hover:underline"
          >
            {t("clearFilter")}
          </button>
        )}
      </div>

      {/* Payments Table */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        {isLoading ? (
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#0B1F3B]"></div>
          </div>
        ) : filteredPayments.length > 0 ? (
          <>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-[#0B1F3B] text-white">
                  <tr>
                    <th className="px-4 py-3 text-left text-sm font-semibold">
                      {t("receiptNumber")}
                    </th>
                    <th className="px-4 py-3 text-left text-sm font-semibold">
                      {t("invoiceNumber")}
                    </th>
                    <th className="px-4 py-3 text-left text-sm font-semibold">
                      {t("client")}
                    </th>
                    <th className="px-4 py-3 text-left text-sm font-semibold">
                      {t("amount")}
                    </th>
                    <th className="px-4 py-3 text-left text-sm font-semibold">
                      {t("paymentMethod")}
                    </th>
                    <th className="px-4 py-3 text-left text-sm font-semibold">
                      {t("paymentDate")}
                    </th>
                    <th className="px-4 py-3 text-center text-sm font-semibold">
                      {t("actions")}
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {filteredPayments.map((payment) => (
                    <tr
                      key={payment._id}
                      className="hover:bg-gray-50 transition-colors"
                    >
                      <td className="px-4 py-3 text-sm font-medium text-gray-800">
                        {payment.receiptNumber}
                      </td>
                      <td className="px-4 py-3 text-sm text-blue-600 font-medium">
                        {payment.invoice?.invoiceNumber || "N/A"}
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-700">
                        {payment.invoice?.client?.name || "N/A"}
                      </td>
                      <td className="px-4 py-3 text-sm font-semibold text-green-600">
                        {formatCurrency(payment.amount)}
                      </td>
                      <td className="px-4 py-3">
                        <span
                          className={`px-2 py-1 text-xs font-semibold rounded-full ${getPaymentMethodBadge(
                            payment.paymentMethod
                          )}`}
                        >
                          {getPaymentMethodLabel(payment.paymentMethod)}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-700">
                        {formatDate(payment.paymentDate)}
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center justify-center gap-2">
                          <Link
                            to="#"
                            className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                            title={t("view")}
                            onClick={() => handleOpenModal(payment)}
                          >
                            <Eye size={18} />
                          </Link>
                          {isDirector && (
                            <button
                              onClick={() => handleDelete(payment._id)}
                              className="p-1.5 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                              title={t("delete")}
                            >
                              <Trash2 size={18} />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            {pagination.pages > 1 && (
              <div className="flex items-center justify-between px-4 py-3 border-t border-gray-200">
                <div className="text-sm text-gray-600">
                  {t("showing")}{" "}
                  {(pagination.page - 1) * pagination.limit + 1}{" "}
                  {t("to")}{" "}
                  {Math.min(
                    pagination.page * pagination.limit,
                    pagination.total
                  )}{" "}
                  {t("of")} {pagination.total}{" "}
                  {t("payments")}
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() =>
                      setFilters({ ...filters, page: filters.page - 1 })
                    }
                    disabled={pagination.page === 1}
                    className="px-3 py-1 border border-gray-300 rounded-lg text-sm font-medium hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    {t("previous")}
                  </button>
                  <span className="px-3 py-1 text-sm font-medium text-gray-700">
                    {t("page")} {pagination.page} {t("of")} {pagination.pages}
                  </span>
                  <button
                    onClick={() =>
                      setFilters({ ...filters, page: filters.page + 1 })
                    }
                    disabled={pagination.page === pagination.pages}
                    className="px-3 py-1 border border-gray-300 rounded-lg text-sm font-medium hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    {t("next")}
                  </button>
                </div>
              </div>
            )}
          </>
        ) : (
          <div className="text-center py-12">
            <CreditCard size={48} className="mx-auto text-gray-400 mb-4" />
            <p className="text-gray-600 font-medium">{t("noPaymentFound")}</p>
            <p className="text-sm text-gray-500 mt-1">
              {t("noPaymentFoundMsg")}
            </p>
          </div>
        )}
      </div>

      {/* Modal */}
      <PaymentDetailModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        payment={selectedPayment}
      />
    </div>
  );
};

export default PaymentsList;
