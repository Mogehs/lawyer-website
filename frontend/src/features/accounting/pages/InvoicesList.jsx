import { useState,  } from "react";
import { useTranslation } from "react-i18next";
import {
  FileText,
  Plus,
  Search,
  Filter,
  Eye,
  Edit,
  Trash2,
  AlertCircle,
} from "lucide-react";
import { useGetInvoicesQuery, useDeleteInvoiceMutation } from "../api/accountingApi";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import { selectUserProfile } from "../../auth/authSlice";
import ViewInvoiceModal from "../../secretary/components/ViewInvoiceModal";
import i18n from "../../../i18n";

const InvoicesList = () => {
  const {t} = useTranslation("accInvoice")
  const [filters, setFilters] = useState({
    status: "",
    startDate: "",
    endDate: "",
    page: 1,
    limit: 10,
  });
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedInvoice, setSelectedInvoice] = useState(null);
  const isRTL = i18n.dir() === "rtl";
   

  const userProfile = useSelector(selectUserProfile);
  const isDirector = userProfile?.role === "director";
  const isSecretary = userProfile?.role === "secretary";

  const { data, isLoading, error } = useGetInvoicesQuery(filters);
  const [deleteInvoice] = useDeleteInvoiceMutation();

  const invoices = data?.data || [];
  const pagination = data?.pagination || {};

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

  // Handle delete
  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this invoice?")) {
      try {
        await deleteInvoice(id).unwrap();
        alert(t("invoiceDeleteSuccess"));
      } catch (error) {
        alert(error?.data?.message || t("FailedtoDeleteInvoice"));
      }
    }
  };

  // Filter invoices by search
  const filteredInvoices = invoices.filter((invoice) => {
    if (!searchTerm) return true;
    const search = searchTerm.toLowerCase();
    return (
      invoice.invoiceNumber?.toLowerCase().includes(search) ||
      invoice.client?.name?.toLowerCase().includes(search) ||
      invoice.serviceDescription?.toLowerCase().includes(search)
    );
  });

  if (error) {
    return (
      <div className="flex justify-center items-center h-full">
        <div className="text-red-600 flex items-center gap-2">
          <AlertCircle size={20} />
          <span>{t("faildInvoice")}</span>
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
            <FileText size={28} className="text-[#0B1F3B]" />
            {t("invoicesManagement")}
          </h1>
          <p className="text-sm text-[#0B1F3B] mt-1">إدارة الفواتير</p>
        </div>

        {(isSecretary || isDirector) && (
          <Link
            to="/accountant/invoices/create"
            className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-[#BCB083] to-[#A48C65] hover:from-[#A48C65] hover:to-[#8B7355] text-white rounded-lg font-medium transition-all duration-200 shadow-md"
          >
            <Plus size={20} />
            {t("createInvoice")}
          </Link>
        )}
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
              placeholder={t("searchInvoice")}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0B1F3B] focus:border-transparent"
            />
          </div>

          {/* Status Filter */}
          <select
            value={filters.status}
            onChange={(e) => setFilters({ ...filters, status: e.target.value, page: 1 })}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0B1F3B] focus:border-transparent"
          >
            <option value="">{t("allStatus")}</option>
            <option value="paid">{t("paid")}</option>
            <option value="partially_paid">{t("partiallyPaid")}</option>
            <option value="unpaid">{t("unpaid")}</option>
            <option value="overdue">{t("overdue")}</option>
          </select>

          {/* Start Date */}
          <input
            type="date"
            value={filters.startDate}
            onChange={(e) => setFilters({ ...filters, startDate: e.target.value, page: 1 })}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0B1F3B] focus:border-transparent"
          />

          {/* End Date */}
          <input
            type="date"
            value={filters.endDate}
            onChange={(e) => setFilters({ ...filters, endDate: e.target.value, page: 1 })}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#A48C65] focus:border-transparent"
          />
        </div>

        {(filters.status || filters.startDate || filters.endDate) && (
          <button
            onClick={() => setFilters({ status: "", startDate: "", endDate: "", page: 1, limit: 10 })}
            className="mt-3 text-sm text-[#A48C65] hover:underline"
          >
            {t("clearFilter")}
          </button>
        )}
      </div>

      {/* Invoices Table */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        {isLoading ? (
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#0B1F3B]"></div>
          </div>
        ) : filteredInvoices.length > 0 ? (
          <>
            <div className="overflow-x-auto">
              <table className="w-full text-nowrap">
                <thead className="bg-[#0B1F3B] text-white">
                  <tr>
                    <th className="px-4 py-3 text-left text-sm font-semibold">
                      {t("invoiceNumber")}
                    </th>
                    <th className="px-4 py-3 text-left text-sm font-semibold">
                      {t("client")}
                    </th>
                    <th className="px-4 py-3 text-left text-sm font-semibold">
                      {t("service")}
                    </th>
                    <th className="px-4 py-3 text-left text-sm font-semibold">
                      {t("totalAmount")}
                    </th>
                    <th className="px-4 py-3 text-left text-sm font-semibold">
                      {t("paidAmount")}
                    </th>
                    <th className="px-4 py-3 text-left text-sm font-semibold">
                      {t("status")}
                    </th>
                    <th className="px-4 py-3 text-left text-sm font-semibold">
                      {t("dueDate")}
                    </th>
                    <th className="px-4 py-3 text-center text-sm font-semibold">
                      {t("actions")}
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {filteredInvoices.map((invoice) => (
                    <tr
                      key={invoice._id}
                      className="hover:bg-gray-50 transition-colors"
                    >
                      <td className="px-4 py-3 text-sm font-medium text-gray-800">
                        {invoice.invoiceNumber}
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-700">
                        {invoice.client?.name || "N/A"}
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-700">
                        <div className="max-w-xs truncate">
                          {invoice.serviceDescription}
                        </div>
                      </td>
                      <td className="px-4 py-3 text-sm font-semibold text-gray-800">
                        {formatCurrency(invoice.totalAmount)}
                      </td>
                      <td className="px-4 py-3 text-sm text-green-600 font-semibold">
                        {formatCurrency(invoice.paidAmount)}
                      </td>
                      <td className="px-4 py-3">
                        <span
                          className={`px-2 py-1 text-xs font-semibold rounded-full ${getStatusBadge(
                            invoice.status
                          )}`}
                        >
                          {invoice.status.replace("_", " ").toUpperCase()}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-700">
                        {formatDate(invoice.dueDate)}
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center justify-center gap-2">
                          <button
                            onClick={() => setSelectedInvoice(invoice)}
                            className="p-1.5 cursor-pointer text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                            title="View"
                          >
                            <Eye size={18} />
                          </button>
                          {(isSecretary || isDirector) && invoice.paidAmount === 0 && (
                            <>
                              <Link
                                to={`/accountant/invoices/${invoice._id}/edit`}
                                className="p-1.5 text-yellow-600 hover:bg-yellow-50 rounded-lg transition-colors"
                                title="Edit"
                              >
                                <Edit size={18} />
                              </Link>
                              {isDirector && (
                                <button
                                  onClick={() => handleDelete(invoice._id)}
                                  className="p-1.5 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                  title="Delete"
                                >
                                  <Trash2 size={18} />
                                </button>
                              )}
                            </>
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
                  Showing {(pagination.page - 1) * pagination.limit + 1} to{" "}
                  {Math.min(pagination.page * pagination.limit, pagination.total)} of{" "}
                  {pagination.total} invoices
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => setFilters({ ...filters, page: filters.page - 1 })}
                    disabled={pagination.page === 1}
                    className="px-3 py-1 border border-gray-300 rounded-lg text-sm font-medium hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    Previous
                  </button>
                  <span className="px-3 py-1 text-sm font-medium text-gray-700">
                    Page {pagination.page} of {pagination.pages}
                  </span>
                  <button
                    onClick={() => setFilters({ ...filters, page: filters.page + 1 })}
                    disabled={pagination.page === pagination.pages}
                    className="px-3 py-1 border border-gray-300 rounded-lg text-sm font-medium hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    Next
                  </button>
                </div>
              </div>
            )}
          </>
        ) : (
          <div className="text-center py-12">
            <FileText size={48} className="mx-auto text-gray-400 mb-4" />
            <p className="text-gray-600 font-medium">{t("noIvnoice")}</p>
            <p className="text-sm text-gray-500 mt-1">
              {t("noIvnoiceMsg")}
            </p>
          </div>
        )}
      </div>
      {/* View Invoice Modal */}
      <ViewInvoiceModal
        invoice={selectedInvoice}
        isOpen={!!selectedInvoice}
        onClose={() => setSelectedInvoice(null)}
      />
    </div>
  );
};

export default InvoicesList;
