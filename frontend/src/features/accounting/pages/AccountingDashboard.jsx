import { useState } from "react";
import {
  Coins,
  TrendingDown,
  TrendingUp,
  AlertCircle,
  FileText,
  CreditCard,
} from "lucide-react";
import { useGetDashboardQuery } from "../api/accountingApi";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import i18n from "../../../i18n";

const AccountingDashboard = () => {
  const { t } = useTranslation("accountingDashboard");
  const [dateRange, setDateRange] = useState({
    startDate: "",
    endDate: "",
  });

  const { data, isLoading, error } = useGetDashboardQuery(
    dateRange.startDate || dateRange.endDate ? dateRange : undefined
  );

  const dashboard = data?.data;
  const isRTL = i18n.dir() === "rtl";
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

  // Get expense category label
  const getExpenseCategoryLabel = (category) => {
    return category
      .split("_")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-full">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#A48C65]"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-full">
        <div className="text-red-600 flex items-center gap-2">
          <AlertCircle size={20} />
          <span>{t("noData")}</span>
        </div>
      </div>
    );
  }

  return (
    <div className={`space-y-6 ${isRTL ? "lg:mr-[220px]" : "lg:ml-[220px]"}`}>
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[#0B1F3B]">{t("title")}</h1>
          <p className="text-sm text-[#0B1F3B] mt-1">
            لوحة تحكم المحاسبة - {t("subtitle")}
          </p>
        </div>

        {/* Date Range Filter */}
        <div className="flex items-center gap-2">
          <input
            type="date"
            value={dateRange.startDate}
            onChange={(e) =>
              setDateRange({ ...dateRange, startDate: e.target.value })
            }
            className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-[#A48C65] focus:border-transparent"
          />
          <span className="text-gray-500">{t("to")}</span>
          <input
            type="date"
            value={dateRange.endDate}
            onChange={(e) =>
              setDateRange({ ...dateRange, endDate: e.target.value })
            }
            className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-[#A48C65] focus:border-transparent"
          />
          {(dateRange.startDate || dateRange.endDate) && (
            <button
              onClick={() => setDateRange({ startDate: "", endDate: "" })}
              className="px-3 py-2 bg-gray-200 hover:bg-gray-300 rounded-lg text-sm font-medium transition-colors"
            >
              {t("clear")}
            </button>
          )}
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Income */}
        <div className="bg-[#F5F7FA] rounded-lg p-6 text-[#0B1F3B] shadow-lg">
          <div className="flex items-center justify-between mb-4">
            <TrendingUp size={24} className="text-[#1E1E1E]" />
            <Coins size={32} className=" text-[#0B1F3B]" />
          </div>
          <h3 className="text-sm font-medium opacity-90">{t("totalIncome")}</h3>
          <p className="text-3xl font-bold mt-2">
            {formatCurrency(dashboard?.summary?.totalIncome)}
          </p>
          <p className="text-xs opacity-75 mt-1">إجمالي الدخل</p>
        </div>

        {/* Total Expenses */}
        <div className="bg-[#F5F7FA] rounded-lg p-6 text-[#0B1F3B] shadow-lg">
          <div className="flex items-center justify-between mb-4">
            <TrendingDown size={24} className="text-[#1E1E1E]" />
            <Coins size={32} className=" text-[#0B1F3B]" />
          </div>
          <h3 className="text-sm font-medium opacity-90">
            {t("totalExpenses")}
          </h3>
          <p className="text-3xl font-bold mt-2">
            {formatCurrency(dashboard?.summary?.totalExpenses)}
          </p>
          <p className="text-xs opacity-75 mt-1">إجمالي المصروفات</p>
        </div>

        {/* Net Profit */}
        <div
          className={`bg-[#F5F7FA] ${
            dashboard?.summary?.profit >= 0
              ? "from-blue-500 to-blue-600"
              : "from-orange-500 to-orange-600"
          } rounded-lg p-6 text-[#0B1F3B] shadow-lg`}
        >
          <div className="flex items-center justify-between mb-4">
            {dashboard?.summary?.profit >= 0 ? (
              <TrendingUp size={24} />
            ) : (
              <TrendingDown size={24} className="text-[#1E1E1E]" />
            )}
            <Coins size={32} className=" text-[#0B1F3B]" />
          </div>
          <h3 className="text-sm font-medium opacity-90">{t("netProfit")}</h3>
          <p className="text-3xl font-bold mt-2">
            {formatCurrency(dashboard?.summary?.profit)}
          </p>
          <p className="text-xs opacity-75 mt-1">صافي الربح</p>
        </div>

        {/* Outstanding Invoices */}
        <div className="bg-[#F5F7FA] rounded-lg p-6 text-[#0B1F3B] shadow-lg">
          <div className="flex items-center justify-between mb-4">
            <AlertCircle size={24} className="text-[#1E1E1E]" />
            <FileText size={32} className=" text-[#0B1F3B]" />
          </div>
          <h3 className="text-sm font-medium opacity-90">
            {t("outstandingInvoices")}
          </h3>
          <p className="text-3xl font-bold mt-2">
            {dashboard?.summary?.outstandingInvoices || 0}
          </p>
          <p className="text-xs opacity-75 mt-1">
            {formatCurrency(dashboard?.summary?.totalOutstanding)}
          </p>
        </div>
      </div>

      {/* Two Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Payments */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
              <CreditCard size={20} className="text-[#0B1F3B]" />
              <p className="text-[#0B1F3B]">{t("recentPayments")}</p>
            </h2>
            <Link
              to="/accountant/payments"
              className="text-sm text-gray-500 hover:underline"
            >
              {t("viewAll")}
            </Link>
          </div>
          <div className="space-y-3">
            {dashboard?.recentPayments?.length > 0 ? (
              dashboard.recentPayments.map((payment) => (
                <div
                  key={payment._id}
                  className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  <div>
                    <p className="font-medium text-gray-800">
                      {payment.invoice?.client?.name || "N/A"}
                    </p>
                    <p className="text-xs text-gray-500">
                      {payment.invoice?.invoiceNumber || "N/A"} •{" "}
                      {getPaymentMethodLabel(payment.paymentMethod)}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-green-600">
                      {formatCurrency(payment.amount)}
                    </p>
                    <p className="text-xs text-gray-500">
                      {formatDate(payment.paymentDate)}
                    </p>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-gray-500 text-center py-4">
                {t("noRecentPayments")}
              </p>
            )}
          </div>
        </div>

        {/* Recent Invoices */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
              <FileText size={20} className="text-[#0B1F3B]" />
              {t("recentInvoices")}
            </h2>
            <Link
              to="/accountant/invoices"
              className="text-sm text-gray-500 hover:underline"
            >
              {t("viewAll")}
            </Link>
          </div>
          <div className="space-y-3">
            {dashboard?.recentInvoices?.length > 0 ? (
              dashboard.recentInvoices.map((invoice) => (
                <div
                  key={invoice._id}
                  className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  <div>
                    <p className="font-medium text-gray-800">
                      {invoice.invoiceNumber}
                    </p>
                    <p className="text-xs text-gray-500">
                      {invoice.client?.name || "N/A"}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-gray-800">
                      {formatCurrency(invoice.totalAmount)}
                    </p>
                    <span
                      className={`text-xs px-2 py-1 rounded-full ${
                        invoice.status === "paid"
                          ? "bg-green-100 text-green-700"
                          : invoice.status === "partially_paid"
                          ? "bg-yellow-100 text-yellow-700"
                          : invoice.status === "overdue"
                          ? "bg-red-100 text-red-700"
                          : "bg-gray-100 text-gray-700"
                      }`}
                    >
                      {invoice.status.replace("_", " ").toUpperCase()}
                    </span>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-gray-500 text-center py-4">
                {t("noRecentInvoices")}
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Income & Expenses Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Income by Payment Method */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">
            {t("incomeByPaymentMethod")}
          </h2>
          <div className="space-y-3">
            {dashboard?.incomeByMethod?.length > 0 ? (
              dashboard.incomeByMethod.map((item) => (
                <div
                  key={item._id}
                  className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                >
                  <div>
                    <p className="font-medium text-gray-800">
                      {getPaymentMethodLabel(item._id)}
                    </p>
                    <p className="text-xs text-gray-500">
                      {item.count} transaction{item.count !== 1 ? "s" : ""}
                    </p>
                  </div>
                  <p className="font-semibold text-green-600">
                    {formatCurrency(item.total)}
                  </p>
                </div>
              ))
            ) : (
              <p className="text-gray-500 text-center py-4">{t("noData")}</p>
            )}
          </div>
        </div>

        {/* Expenses by Category */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">
            {t("expensesByCategory")}
          </h2>
          <div className="space-y-3">
            {dashboard?.expensesByCategory?.length > 0 ? (
              dashboard.expensesByCategory.map((item) => (
                <div
                  key={item._id}
                  className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                >
                  <div>
                    <p className="font-medium text-gray-800">
                      {getExpenseCategoryLabel(item._id)}
                    </p>
                    <p className="text-xs text-gray-500">
                      {item.count} expense{item.count !== 1 ? "s" : ""}
                    </p>
                  </div>
                  <p className="font-semibold text-red-600">
                    {formatCurrency(item.total)}
                  </p>
                </div>
              ))
            ) : (
              <p className="text-gray-500 text-center py-4">{t("noData")}</p>
            )}
          </div>
        </div>
      </div>

      {/* Overdue Alert */}
      {dashboard?.summary?.overdueInvoices > 0 && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="flex items-center gap-3">
            <AlertCircle size={24} className="text-red-600" />
            <div>
              <p className="font-semibold text-red-800">
                {dashboard.summary.overdueInvoices} {t("overdueAlert")}
                {dashboard.summary.overdueInvoices !== 1 ? "s" : ""}
              </p>
              <p className="text-sm text-red-700">{t("overdueAlertMessage")}</p>
            </div>
            <Link
              to="/accountant/invoices?status=overdue"
              className="ml-auto px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg text-sm font-medium transition-colors"
            >
              {t("viewAll")}
            </Link>
          </div>
        </div>
      )}
    </div>
  );
};

export default AccountingDashboard;
