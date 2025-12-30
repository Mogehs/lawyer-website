import { useState } from "react";
import {
  TrendingDown,
  Plus,
  Search,
  Eye,
  Edit,
  Trash2,
  AlertCircle,
} from "lucide-react";
import {
  useGetExpensesQuery,
  useDeleteExpenseMutation,
} from "../api/accountingApi";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import { selectUserProfile } from "../../auth/authSlice";
import { t } from "i18next";
import { useTranslation } from "react-i18next";
import i18n from "../../../i18n";

const ExpensesList = () => {
  const {t} = useTranslation("accexpensesList")
  
  const [filters, setFilters] = useState({
    category: "",
    startDate: "",
    endDate: "",
    page: 1,
    limit: 10,
  });
  const [searchTerm, setSearchTerm] = useState("");

  const userProfile = useSelector(selectUserProfile);
  const isDirector = userProfile?.role === "director";

  const { data, isLoading, error } = useGetExpensesQuery(filters);
  const [deleteExpense] = useDeleteExpenseMutation();

  const expenses = data?.data || [];
  const pagination = data?.pagination || {};

  // Format currency
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "QAR",
    }).format(amount || 0);
  };
  const isRTL = i18n.dir() === "rtl";

  // Format date
  const formatDate = (date) => {
    return new Intl.DateTimeFormat("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    }).format(new Date(date));
  };

  // Get category label
  const getCategoryLabel = (category) => {
    return category
      .split("_")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  };

  // Handle delete
  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this expense?")) {
      try {
        await deleteExpense(id).unwrap();
        alert("Expense deleted successfully");
      } catch (error) {
        alert(error?.data?.message || "Failed to delete expense");
      }
    }
  };

  // Filter expenses by search
  const filteredExpenses = expenses.filter((expense) => {
    if (!searchTerm) return true;
    const search = searchTerm.toLowerCase();
    return (
      expense.expenseNumber?.toLowerCase().includes(search) ||
      expense.description?.toLowerCase().includes(search) ||
      expense.vendor?.toLowerCase().includes(search)
    );
  });

  if (error) {
    return (
      <div className="flex justify-center items-center h-full">
        <div className="text-red-600 flex items-center gap-2">
          <AlertCircle size={20} />
          <span>Failed to load expenses</span>
        </div>
      </div>
    );
  }

  return (
    <div className={`space-y-6 ${isRTL ? "lg:mr-[220px]":"lg:ml-[220px]" } `}>
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
            <TrendingDown size={28} className="text-[#0B1F3B]" />
            {t("expensesManagement")}
          </h1>
          <p className="text-sm text-gray-600 mt-1">إدارة المصروفات</p>
        </div>

        <Link
          to="/accountant/expenses/create"
          className="flex items-center gap-2 px-4 py-2 bg-[#0B1F3B] text-white rounded-lg font-medium transition-all duration-200 shadow-md"
        >
          <Plus size={20} />
        {t("addExpense")}
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
              placeholder={t("searchExpenses")}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0B1F3B] focus:border-transparent"
            />
          </div>

          {/* Category Filter */}
          <select
            value={filters.category}
            onChange={(e) =>
              setFilters({ ...filters, category: e.target.value, page: 1 })
            }
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0B1F3B] focus:border-transparent"
          >
            <option value="">{t("allCategories")}</option>
            <option value="office_rent">{t("office_rent")}</option>
            <option value="utilities">{t("utilities")}</option>
            <option value="salaries">{t("salaries")}</option>
            <option value="supplies"></option>
            <option value="marketing">{t("supplies")}</option>
            <option value="legal_fees">{t("legal_fees")}</option>
            <option value="court_fees">{t(  "court_fees")}</option>
            <option value="transportation">{t("transportation")}</option>
            <option value="technology">{t( "technology")}</option>
            <option value="maintenance">{t("maintenance")}</option>
            <option value="other">{t("other")}</option>
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

        {(filters.category || filters.startDate || filters.endDate) && (
          <button
            onClick={() =>
              setFilters({
                category: "",
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

      {/* Expenses Table */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        {isLoading ? (
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#0B1F3B]"></div>
          </div>
        ) : filteredExpenses.length > 0 ? (
          <>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-[#0B1F3B] text-white">
                  <tr>
                    <th className="px-4 py-3 text-left text-sm font-semibold">
                      {t("expenseNumber")}
                    </th>
                    <th className="px-4 py-3 text-left text-sm font-semibold">
                      {t("category")}
                    </th>
                    <th className="px-4 py-3 text-left text-sm font-semibold">
                      {t("description")}
                    </th>
                    <th className="px-4 py-3 text-left text-sm font-semibold">
                      {t( "vendor")}
                    </th>
                    <th className="px-4 py-3 text-left text-sm font-semibold">
                      {t("amount")}
                    </th>
                    <th className="px-4 py-3 text-left text-sm font-semibold">
                      {t( "date")}
                    </th>
                    <th className="px-4 py-3 text-center text-sm font-semibold">
                      {t(  "actions")}
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {filteredExpenses.map((expense) => (
                    <tr
                      key={expense._id}
                      className="hover:bg-gray-50 transition-colors"
                    >
                      <td className="px-4 py-3 text-sm font-medium text-gray-800">
                        {expense.expenseNumber}
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-700">
                        {getCategoryLabel(expense.category)}
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-700">
                        <div className="max-w-xs truncate">
                          {expense.description}
                        </div>
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-700">
                        {expense.vendor || "N/A"}
                      </td>
                      <td className="px-4 py-3 text-sm font-semibold text-red-600">
                        {formatCurrency(expense.amount)}
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-700">
                        {formatDate(expense.expenseDate)}
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center justify-center gap-2">
                          <Link
                            to={`/accountant/expenses/${expense._id}`}
                            className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                            title="View"
                          >
                            <Eye size={18} />
                          </Link>
                          <Link
                            to={`/accountant/expenses/${expense._id}/edit`}
                            className="p-1.5 text-yellow-600 hover:bg-yellow-50 rounded-lg transition-colors"
                            title="Edit"
                          >
                            <Edit size={18} />
                          </Link>
                          {isDirector && (
                            <button
                              onClick={() => handleDelete(expense._id)}
                              className="p-1.5 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                              title="Delete"
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
                  Showing {(pagination.page - 1) * pagination.limit + 1} to{" "}
                  {Math.min(
                    pagination.page * pagination.limit,
                    pagination.total
                  )}{" "}
                  of {pagination.total} expenses
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() =>
                      setFilters({ ...filters, page: filters.page - 1 })
                    }
                    disabled={pagination.page === 1}
                    className="px-3 py-1 border border-gray-300 rounded-lg text-sm font-medium hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    Previous
                  </button>
                  <span className="px-3 py-1 text-sm font-medium text-gray-700">
                    Page {pagination.page} of {pagination.pages}
                  </span>
                  <button
                    onClick={() =>
                      setFilters({ ...filters, page: filters.page + 1 })
                    }
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
            <TrendingDown size={48} className="mx-auto text-gray-400 mb-4" />
            <p className="text-gray-600 font-medium">{t("noExpenseFound")}</p>
            <p className="text-sm text-gray-500 mt-1">
              {t("noExpenseFoundMsg")}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ExpensesList;

