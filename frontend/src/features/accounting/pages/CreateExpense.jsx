import { useState } from "react";
import { TrendingDown } from "lucide-react";
import { useCreateExpenseMutation } from "../api/accountingApi";
import { useNavigate } from "react-router-dom";

const CreateExpense = () => {
  const navigate = useNavigate();
  const [createExpense, { isLoading }] = useCreateExpenseMutation();

  const [formData, setFormData] = useState({
    category: "",
    description: "",
    amount: "",
    expenseDate: new Date().toISOString().split("T")[0],
    vendor: "",
    notes: "",
  });

  const categories = [
    { value: "office_rent", label: "Office Rent / إيجار المكتب" },
    { value: "utilities", label: "Utilities / المرافق" },
    { value: "salaries", label: "Salaries / الرواتب" },
    { value: "supplies", label: "Supplies / اللوازم" },
    { value: "marketing", label: "Marketing / التسويق" },
    { value: "legal_fees", label: "Legal Fees / الرسوم القانونية" },
    { value: "court_fees", label: "Court Fees / رسوم المحكمة" },
    { value: "transportation", label: "Transportation / النقل" },
    { value: "technology", label: "Technology / التكنولوجيا" },
    { value: "maintenance", label: "Maintenance / الصيانة" },
    { value: "other", label: "Other / أخرى" },
  ];

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
        ...formData,
        amount: parseFloat(formData.amount),
      };

      await createExpense(payload).unwrap();
      alert("Expense created successfully!");
      navigate("/accountant/expenses");
    } catch (error) {
      alert(error?.data?.message || "Failed to create expense");
    }
  };

  return (
    <div className="space-y-6 lg:ml-[220px]">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
          <TrendingDown size={28} className="text-[#0B1F3B]" />
          Add New Expense
        </h1>
        <p className="text-sm text-gray-600 mt-1">إضافة مصروف جديد</p>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-md p-6">
        <div className="space-y-6">
          {/* Category */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Category / الفئة <span className="text-red-500">*</span>
            </label>
            <select
              name="category"
              value={formData.category}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0B1F3B] focus:border-transparent"
            >
              <option value="">Select Category</option>
              {categories.map((cat) => (
                <option key={cat.value} value={cat.value}>
                  {cat.label}
                </option>
              ))}
            </select>
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Description / الوصف <span className="text-red-500">*</span>
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              required
              rows={4}
              placeholder="Enter expense details..."
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0B1F3B] focus:border-transparent"
            />
          </div>

          {/* Amount */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Amount / المبلغ <span className="text-red-500">*</span>
            </label>
            <input
              type="number"
              name="amount"
              value={formData.amount}
              onChange={handleChange}
              required
              min="0"
              step="0.01"
              placeholder="0.00"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0B1F3B] focus:border-transparent"
            />
          </div>

          {/* Expense Date */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Expense Date / تاريخ المصروف <span className="text-red-500">*</span>
            </label>
            <input
              type="date"
              name="expenseDate"
              value={formData.expenseDate}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0B1F3B] focus:border-transparent"
            />
          </div>

          {/* Vendor */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Vendor / المورد
            </label>
            <input
              type="text"
              name="vendor"
              value={formData.vendor}
              onChange={handleChange}
              placeholder="Enter vendor name (optional)"
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
              {isLoading ? "Creating..." : "Add Expense"}
            </button>
            <button
              type="button"
              onClick={() => navigate("/accountant/expenses")}
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

export default CreateExpense;

