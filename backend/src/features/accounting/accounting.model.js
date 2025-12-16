import mongoose from "mongoose";

// Invoice Schema
const invoiceSchema = new mongoose.Schema(
  {
    invoiceNumber: {
      type: String,
      required: true,
      unique: true,
    },
    client: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Client",
      required: true,
    },
    case: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Case",
      default: null,
    },
    serviceDescription: {
      type: String,
      required: true,
    },
    totalAmount: {
      type: Number,
      required: true,
      min: 0,
    },
    paidAmount: {
      type: Number,
      default: 0,
      min: 0,
    },
    remainingAmount: {
      type: Number,
      default: function () {
        return this.totalAmount - this.paidAmount;
      },
    },
    status: {
      type: String,
      enum: ["unpaid", "partially_paid", "paid", "overdue"],
      default: "unpaid",
    },
    dueDate: {
      type: Date,
      required: true,
    },
    isInstallment: {
      type: Boolean,
      default: false,
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    notes: {
      type: String,
      default: "",
    },
  },
  {
    timestamps: true,
  }
);

// Installment Schedule Schema
const installmentScheduleSchema = new mongoose.Schema(
  {
    invoice: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Invoice",
      required: true,
    },
    installmentNumber: {
      type: Number,
      required: true,
    },
    amount: {
      type: Number,
      required: true,
      min: 0,
    },
    dueDate: {
      type: Date,
      required: true,
    },
    paidAmount: {
      type: Number,
      default: 0,
      min: 0,
    },
    status: {
      type: String,
      enum: ["pending", "paid", "overdue", "partially_paid"],
      default: "pending",
    },
    paidDate: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

// Payment Schema
const paymentSchema = new mongoose.Schema(
  {
    invoice: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Invoice",
      required: true,
    },
    installment: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "InstallmentSchedule",
      default: null,
    },
    amount: {
      type: Number,
      required: true,
      min: 0,
    },
    paymentMethod: {
      type: String,
      enum: ["cash", "bank_transfer", "card", "check"],
      required: true,
    },
    paymentDate: {
      type: Date,
      default: Date.now,
    },
    // Check specific fields
    checkNumber: {
      type: String,
      default: null,
    },
    checkBank: {
      type: String,
      default: null,
    },
    checkDepositDate: {
      type: Date,
      default: null,
    },
    // Bank transfer fields
    bankTransactionId: {
      type: String,
      default: null,
    },
    bankName: {
      type: String,
      default: null,
    },
    // General fields
    receiptNumber: {
      type: String,
      unique: true,
      sparse: true,
    },
    recordedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    notes: {
      type: String,
      default: "",
    },
  },
  {
    timestamps: true,
  }
);

// Expense Schema
const expenseSchema = new mongoose.Schema(
  {
    expenseNumber: {
      type: String,
      required: true,
      unique: true,
    },
    category: {
      type: String,
      required: true,
      enum: [
        "office_rent",
        "utilities",
        "salaries",
        "supplies",
        "marketing",
        "legal_fees",
        "court_fees",
        "transportation",
        "technology",
        "maintenance",
        "other",
      ],
    },
    description: {
      type: String,
      required: true,
    },
    amount: {
      type: Number,
      required: true,
      min: 0,
    },
    expenseDate: {
      type: Date,
      default: Date.now,
    },
    vendor: {
      type: String,
      default: "",
    },
    receiptUrl: {
      type: String,
      default: null,
    },
    recordedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    approvedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },
    status: {
      type: String,
      enum: ["pending", "approved", "rejected"],
      default: "approved",
    },
    notes: {
      type: String,
      default: "",
    },
  },
  {
    timestamps: true,
  }
);

// Indexes for better query performance
invoiceSchema.index({ client: 1, status: 1 });
invoiceSchema.index({ invoiceNumber: 1 });
invoiceSchema.index({ createdAt: -1 });

installmentScheduleSchema.index({ invoice: 1, installmentNumber: 1 });
installmentScheduleSchema.index({ dueDate: 1, status: 1 });

paymentSchema.index({ invoice: 1 });
paymentSchema.index({ paymentDate: -1 });

expenseSchema.index({ expenseDate: -1 });
expenseSchema.index({ category: 1 });

// Virtual for checking if invoice is overdue
invoiceSchema.virtual("isOverdue").get(function () {
  return (
    this.status !== "paid" &&
    this.dueDate < new Date() &&
    this.remainingAmount > 0
  );
});

// Pre-save middleware to update invoice status
invoiceSchema.pre("save", function (next) {
  this.remainingAmount = this.totalAmount - this.paidAmount;

  if (this.paidAmount >= this.totalAmount) {
    this.status = "paid";
  } else if (this.paidAmount > 0) {
    this.status = "partially_paid";
  } else if (this.dueDate < new Date()) {
    this.status = "overdue";
  } else {
    this.status = "unpaid";
  }

  next();
});

// Pre-save middleware for installment status
installmentScheduleSchema.pre("save", function (next) {
  if (this.paidAmount >= this.amount) {
    this.status = "paid";
    this.paidDate = this.paidDate || new Date();
  } else if (this.paidAmount > 0) {
    this.status = "partially_paid";
  } else if (this.dueDate < new Date()) {
    this.status = "overdue";
  } else {
    this.status = "pending";
  }

  next();
});

export const Invoice = mongoose.model("Invoice", invoiceSchema);
export const InstallmentSchedule = mongoose.model(
  "InstallmentSchedule",
  installmentScheduleSchema
);
export const Payment = mongoose.model("Payment", paymentSchema);
export const Expense = mongoose.model("Expense", expenseSchema);

