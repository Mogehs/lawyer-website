import { useState } from "react";
import {
  FileText,
  Plus,
  Search,
  Eye,
  AlertCircle,
} from "lucide-react";
import { useGetInvoicesQuery } from "../../accounting/api/accountingApi";
import { Link } from "react-router-dom";
import ViewInvoiceModal from "../components/ViewInvoiceModal";

const SecretaryInvoices = () => {
  const [filters, setFilters] = useState({
    status: "",
    startDate: "",
    endDate: "",
    page: 1,
    limit: 10,
  });
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedInvoice, setSelectedInvoice] = useState(null);

  const { data, isLoading, error } = useGetInvoicesQuery(filters);

  const invoices = data?.data || [];

  // Debug log to check invoice data structure
  console.log("Invoices data:", invoices);

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
          <span>Failed to load invoices</span>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
            <FileText size={28} className="text-[#A48C65]" />
            Client Invoices
          </h1>
          <p className="text-sm text-gray-600 mt-1">فواتير العملاء</p>
        </div>

        <Link
          to="/invoices/create"
          className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-[#BCB083] to-[#A48C65] hover:from-[#A48C65] hover:to-[#8B7355] text-white rounded-lg font-medium transition-all duration-200 shadow-md"
        >
          <Plus size={20} />
          Create Invoice
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
              placeholder="Search invoices..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#A48C65] focus:border-transparent"
            />
          </div>

          {/* Status Filter */}
          <select
            value={filters.status}
            onChange={(e) => setFilters({ ...filters, status: e.target.value, page: 1 })}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#A48C65] focus:border-transparent"
          >
            <option value="">All Status</option>
            <option value="paid">Paid</option>
            <option value="partially_paid">Partially Paid</option>
            <option value="unpaid">Unpaid</option>
            <option value="overdue">Overdue</option>
          </select>

          {/* Start Date */}
          <input
            type="date"
            value={filters.startDate}
            onChange={(e) => setFilters({ ...filters, startDate: e.target.value, page: 1 })}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#A48C65] focus:border-transparent"
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
            Clear Filters
          </button>
        )}
      </div>

      {/* Invoices Table */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        {isLoading ? (
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#A48C65]"></div>
          </div>
        ) : filteredInvoices.length > 0 ? (
          <>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gradient-to-r from-[#BCB083] to-[#A48C65] text-white">
                  <tr>
                    <th className="px-4 py-3 text-left text-sm font-semibold">
                      Invoice #
                    </th>
                    <th className="px-4 py-3 text-left text-sm font-semibold">
                      Client
                    </th>
                    <th className="px-4 py-3 text-left text-sm font-semibold">
                      Service
                    </th>
                    <th className="px-4 py-3 text-left text-sm font-semibold">
                      Total Amount
                    </th>
                    <th className="px-4 py-3 text-left text-sm font-semibold">
                      Paid Amount
                    </th>
                    <th className="px-4 py-3 text-left text-sm font-semibold">
                      Status
                    </th>
                    <th className="px-4 py-3 text-left text-sm font-semibold">
                      Due Date
                    </th>
                    <th className="px-4 py-3 text-center text-sm font-semibold">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {filteredInvoices.map((invoice) => (
                    <tr key={invoice._id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-4 py-3 text-sm font-medium text-gray-900">
                        {invoice.invoiceNumber}
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-700">
                        {invoice.client?.name || "N/A"}
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-700 max-w-xs truncate">
                        {invoice.serviceDescription}
                      </td>
                      <td className="px-4 py-3 text-sm font-medium text-gray-900">
                        {formatCurrency(invoice.totalAmount)}
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-700">
                        {formatCurrency(invoice.paidAmount)}
                      </td>
                      <td className="px-4 py-3">
                        <span
                          className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusBadge(
                            invoice.status
                          )}`}
                        >
                          {invoice.status.replace("_", " ").toUpperCase()}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-700">
                        {formatDate(invoice.dueDate)}
                      </td>
                      <td className="px-4 py-3 text-center">
                        <div className="flex items-center justify-center gap-2">
                          <button
                            onClick={() => setSelectedInvoice(invoice)}
                            className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                            title="View Details"
                          >
                            <Eye size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            <div className="px-4 py-3 bg-gray-50 border-t border-gray-200 flex items-center justify-between">
              <div className="text-sm text-gray-700">
                Showing {filteredInvoices.length} invoices
              </div>
            </div>
          </>
        ) : (
          <div className="flex flex-col items-center justify-center py-12">
            <FileText size={48} className="text-gray-300 mb-4" />
            <p className="text-gray-500 text-lg font-medium">No invoices found</p>
            <p className="text-gray-400 text-sm mt-1">
              {searchTerm ? "Try adjusting your search" : "Create your first invoice to get started"}
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

export default SecretaryInvoices;

