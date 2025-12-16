import { customError } from "../../utils/customError.js";
import {
  Invoice,
  InstallmentSchedule,
  Payment,
  Expense,
} from "./accounting.model.js";
import mongoose from "mongoose";

// ============================================
// INVOICE CONTROLLERS
// ============================================

// @desc    Create new invoice
// @route   POST /api/accounting/invoices
// @access  Secretary, Director
export const createInvoice = async (req, res) => {
  const {
    client,
    case: caseId,
    serviceDescription,
    totalAmount,
    dueDate,
    isInstallment,
    installments,
    notes,
  } = req.body;

  // Generate invoice number
  const lastInvoice = await Invoice.findOne().sort({ createdAt: -1 });
  const invoiceNumber = lastInvoice
    ? `INV-${String(parseInt(lastInvoice.invoiceNumber.split("-")[1]) + 1).padStart(6, "0")}`
    : "INV-000001";

  const invoice = await Invoice.create({
    invoiceNumber,
    client,
    case: caseId || null,
    serviceDescription,
    totalAmount,
    dueDate,
    isInstallment,
    createdBy: req.user._id,
    notes: notes || "",
  });

  // Create installment schedule if applicable
  if (isInstallment && installments && installments.length > 0) {
    const installmentDocs = installments.map((inst, index) => ({
      invoice: invoice._id,
      installmentNumber: index + 1,
      amount: inst.amount,
      dueDate: inst.dueDate,
    }));

    await InstallmentSchedule.insertMany(installmentDocs);
  }

  const populatedInvoice = await Invoice.findById(invoice._id)
    .populate("client", "name email contactNumber")
    .populate("createdBy", "name email");

  res.status(201).json({
    success: true,
    message: "Invoice created successfully",
    data: populatedInvoice,
  });
};

// @desc    Get all invoices with filters
// @route   GET /api/accounting/invoices
// @access  Secretary, Accountant, Director
export const getInvoices = async (req, res) => {
  const {
    status,
    client,
    startDate,
    endDate,
    page = 1,
    limit = 10,
  } = req.query;

  const query = {};

  if (status) query.status = status;
  if (client) query.client = client;
  if (startDate || endDate) {
    query.createdAt = {};
    if (startDate) query.createdAt.$gte = new Date(startDate);
    if (endDate) query.createdAt.$lte = new Date(endDate);
  }

  const skip = (page - 1) * limit;

  const invoices = await Invoice.find(query)
    .populate("client", "name email contactNumber")
    .populate("case", "caseNumber title")
    .populate("createdBy", "name email")
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(parseInt(limit));

  const total = await Invoice.countDocuments(query);

  res.status(200).json({
    success: true,
    data: invoices,
    pagination: {
      page: parseInt(page),
      limit: parseInt(limit),
      total,
      pages: Math.ceil(total / limit),
    },
  });
};

// @desc    Get single invoice by ID
// @route   GET /api/accounting/invoices/:id
// @access  Secretary, Accountant, Director
export const getInvoiceById = async (req, res) => {
  const invoice = await Invoice.findById(req.params.id)
    .populate("client", "name email contactNumber")
    .populate("case", "caseNumber title")
    .populate("createdBy", "name email");

  if (!invoice) {
    throw new customError("Invoice not found", 404);
  }

  // Get installments if applicable
  let installments = [];
  if (invoice.isInstallment) {
    installments = await InstallmentSchedule.find({
      invoice: invoice._id,
    }).sort({ installmentNumber: 1 });
  }

  // Get payment history
  const payments = await Payment.find({ invoice: invoice._id })
    .populate("recordedBy", "name email")
    .sort({ paymentDate: -1 });

  res.status(200).json({
    success: true,
    data: {
      invoice,
      installments,
      payments,
    },
  });
};

// @desc    Update invoice
// @route   PUT /api/accounting/invoices/:id
// @access  Secretary, Director
export const updateInvoice = async (req, res) => {
  const { serviceDescription, totalAmount, dueDate, notes } = req.body;

  const invoice = await Invoice.findById(req.params.id);

  if (!invoice) {
    throw new customError("Invoice not found", 404);
  }

  // Don't allow updates if invoice has payments
  if (invoice.paidAmount > 0) {
    throw new customError(
      "Cannot update invoice with existing payments",
      400
    );
  }

  if (serviceDescription) invoice.serviceDescription = serviceDescription;
  if (totalAmount) invoice.totalAmount = totalAmount;
  if (dueDate) invoice.dueDate = dueDate;
  if (notes !== undefined) invoice.notes = notes;

  await invoice.save();

  const updatedInvoice = await Invoice.findById(invoice._id)
    .populate("client", "name email phone")
    .populate("createdBy", "name email");

  res.status(200).json({
    success: true,
    message: "Invoice updated successfully",
    data: updatedInvoice,
  });
};

// @desc    Delete invoice
// @route   DELETE /api/accounting/invoices/:id
// @access  Director only
export const deleteInvoice = async (req, res) => {
  const invoice = await Invoice.findById(req.params.id);

  if (!invoice) {
    throw new customError("Invoice not found", 404);
  }

  // Don't allow deletion if invoice has payments
  if (invoice.paidAmount > 0) {
    throw new customError("Cannot delete invoice with existing payments", 400);
  }

  // Delete related installments
  await InstallmentSchedule.deleteMany({ invoice: invoice._id });

  await invoice.deleteOne();

  res.status(200).json({
    success: true,
    message: "Invoice deleted successfully",
  });
};

// ============================================
// PAYMENT CONTROLLERS
// ============================================

// @desc    Record new payment
// @route   POST /api/accounting/payments
// @access  Accountant, Director
export const recordPayment = async (req, res) => {
  const {
    invoice: invoiceId,
    installment: installmentId,
    amount,
    paymentMethod,
    paymentDate,
    checkNumber,
    checkBank,
    checkDepositDate,
    bankTransactionId,
    bankName,
    notes,
  } = req.body;

  const invoice = await Invoice.findById(invoiceId);

  if (!invoice) {
    throw new customError("Invoice not found", 404);
  }

  // Check if amount exceeds remaining
  if (amount > invoice.remainingAmount) {
    throw new customError("Payment amount exceeds remaining balance", 400);
  }

  // Generate receipt number
  const lastPayment = await Payment.findOne().sort({ createdAt: -1 });
  const receiptNumber = lastPayment
    ? `RCP-${String(parseInt(lastPayment.receiptNumber.split("-")[1]) + 1).padStart(6, "0")}`
    : "RCP-000001";

  const paymentData = {
    invoice: invoiceId,
    amount,
    paymentMethod,
    paymentDate: paymentDate || new Date(),
    receiptNumber,
    recordedBy: req.user._id,
    notes: notes || "",
  };

  // Add check details if applicable
  if (paymentMethod === "check") {
    paymentData.checkNumber = checkNumber;
    paymentData.checkBank = checkBank;
    paymentData.checkDepositDate = checkDepositDate;
  }

  // Add bank transfer details if applicable
  if (paymentMethod === "bank_transfer") {
    paymentData.bankTransactionId = bankTransactionId;
    paymentData.bankName = bankName;
  }

  // Link to installment if provided
  if (installmentId) {
    const installment = await InstallmentSchedule.findById(installmentId);
    if (!installment) {
      throw new customError("Installment not found", 404);
    }
    paymentData.installment = installmentId;

    // Update installment
    installment.paidAmount += amount;
    await installment.save();
  }

  const payment = await Payment.create(paymentData);

  // Update invoice paid amount
  invoice.paidAmount += amount;
  await invoice.save();

  const populatedPayment = await Payment.findById(payment._id)
    .populate("invoice", "invoiceNumber totalAmount")
    .populate("recordedBy", "name email");

  res.status(201).json({
    success: true,
    message: "Payment recorded successfully",
    data: populatedPayment,
  });
};

// @desc    Get all payments with filters
// @route   GET /api/accounting/payments
// @access  Accountant, Director
export const getPayments = async (req, res) => {
  const {
    invoice,
    paymentMethod,
    startDate,
    endDate,
    page = 1,
    limit = 10,
  } = req.query;

  const query = {};

  if (invoice) query.invoice = invoice;
  if (paymentMethod) query.paymentMethod = paymentMethod;
  if (startDate || endDate) {
    query.paymentDate = {};
    if (startDate) query.paymentDate.$gte = new Date(startDate);
    if (endDate) query.paymentDate.$lte = new Date(endDate);
  }

  const skip = (page - 1) * limit;

  const payments = await Payment.find(query)
    .populate("invoice", "invoiceNumber client totalAmount")
    .populate({
      path: "invoice",
      populate: { path: "client", select: "name email" },
    })
    .populate("recordedBy", "name email")
    .sort({ paymentDate: -1 })
    .skip(skip)
    .limit(parseInt(limit));

  const total = await Payment.countDocuments(query);

  res.status(200).json({
    success: true,
    data: payments,
    pagination: {
      page: parseInt(page),
      limit: parseInt(limit),
      total,
      pages: Math.ceil(total / limit),
    },
  });
};

// @desc    Get payment by ID
// @route   GET /api/accounting/payments/:id
// @access  Accountant, Director
export const getPaymentById = async (req, res) => {
  const payment = await Payment.findById(req.params.id)
    .populate("invoice", "invoiceNumber totalAmount client")
    .populate({
      path: "invoice",
      populate: { path: "client", select: "name email phone" },
    })
    .populate("installment")
    .populate("recordedBy", "name email");

  if (!payment) {
    throw new customError("Payment not found", 404);
  }

  res.status(200).json({
    success: true,
    data: payment,
  });
};

// @desc    Delete payment
// @route   DELETE /api/accounting/payments/:id
// @access  Director only
export const deletePayment = async (req, res) => {
  const payment = await Payment.findById(req.params.id);

  if (!payment) {
    throw new customError("Payment not found", 404);
  }

  // Update invoice paid amount
  const invoice = await Invoice.findById(payment.invoice);
  if (invoice) {
    invoice.paidAmount -= payment.amount;
    await invoice.save();
  }

  // Update installment if applicable
  if (payment.installment) {
    const installment = await InstallmentSchedule.findById(payment.installment);
    if (installment) {
      installment.paidAmount -= payment.amount;
      await installment.save();
    }
  }

  await payment.deleteOne();

  res.status(200).json({
    success: true,
    message: "Payment deleted successfully",
  });
};

// ============================================
// EXPENSE CONTROLLERS
// ============================================

// @desc    Create new expense
// @route   POST /api/accounting/expenses
// @access  Accountant, Director
export const createExpense = async (req, res) => {
  const {
    category,
    description,
    amount,
    expenseDate,
    vendor,
    receiptUrl,
    notes,
  } = req.body;

  // Generate expense number
  const lastExpense = await Expense.findOne().sort({ createdAt: -1 });
  const expenseNumber = lastExpense
    ? `EXP-${String(parseInt(lastExpense.expenseNumber.split("-")[1]) + 1).padStart(6, "0")}`
    : "EXP-000001";

  const expense = await Expense.create({
    expenseNumber,
    category,
    description,
    amount,
    expenseDate: expenseDate || new Date(),
    vendor: vendor || "",
    receiptUrl: receiptUrl || null,
    recordedBy: req.user._id,
    notes: notes || "",
    status: "approved", // Auto-approve for now
  });

  const populatedExpense = await Expense.findById(expense._id).populate(
    "recordedBy",
    "name email"
  );

  res.status(201).json({
    success: true,
    message: "Expense created successfully",
    data: populatedExpense,
  });
};

// @desc    Get all expenses with filters
// @route   GET /api/accounting/expenses
// @access  Accountant, Director
export const getExpenses = async (req, res) => {
  const {
    category,
    status,
    startDate,
    endDate,
    page = 1,
    limit = 10,
  } = req.query;

  const query = {};

  if (category) query.category = category;
  if (status) query.status = status;
  if (startDate || endDate) {
    query.expenseDate = {};
    if (startDate) query.expenseDate.$gte = new Date(startDate);
    if (endDate) query.expenseDate.$lte = new Date(endDate);
  }

  const skip = (page - 1) * limit;

  const expenses = await Expense.find(query)
    .populate("recordedBy", "name email")
    .populate("approvedBy", "name email")
    .sort({ expenseDate: -1 })
    .skip(skip)
    .limit(parseInt(limit));

  const total = await Expense.countDocuments(query);

  res.status(200).json({
    success: true,
    data: expenses,
    pagination: {
      page: parseInt(page),
      limit: parseInt(limit),
      total,
      pages: Math.ceil(total / limit),
    },
  });
};

// @desc    Get expense by ID
// @route   GET /api/accounting/expenses/:id
// @access  Accountant, Director
export const getExpenseById = async (req, res) => {
  const expense = await Expense.findById(req.params.id)
    .populate("recordedBy", "name email")
    .populate("approvedBy", "name email");

  if (!expense) {
    throw new customError("Expense not found", 404);
  }

  res.status(200).json({
    success: true,
    data: expense,
  });
};

// @desc    Update expense
// @route   PUT /api/accounting/expenses/:id
// @access  Accountant, Director
export const updateExpense = async (req, res) => {
  const {
    category,
    description,
    amount,
    expenseDate,
    vendor,
    receiptUrl,
    notes,
  } = req.body;

  const expense = await Expense.findById(req.params.id);

  if (!expense) {
    throw new customError("Expense not found", 404);
  }

  if (category) expense.category = category;
  if (description) expense.description = description;
  if (amount) expense.amount = amount;
  if (expenseDate) expense.expenseDate = expenseDate;
  if (vendor !== undefined) expense.vendor = vendor;
  if (receiptUrl !== undefined) expense.receiptUrl = receiptUrl;
  if (notes !== undefined) expense.notes = notes;

  await expense.save();

  const updatedExpense = await Expense.findById(expense._id).populate(
    "recordedBy",
    "name email"
  );

  res.status(200).json({
    success: true,
    message: "Expense updated successfully",
    data: updatedExpense,
  });
};

// @desc    Delete expense
// @route   DELETE /api/accounting/expenses/:id
// @access  Director only
export const deleteExpense = async (req, res) => {
  const expense = await Expense.findById(req.params.id);

  if (!expense) {
    throw new customError("Expense not found", 404);
  }

  await expense.deleteOne();

  res.status(200).json({
    success: true,
    message: "Expense deleted successfully",
  });
};

// ============================================
// DASHBOARD & REPORTS CONTROLLERS
// ============================================

// @desc    Get financial dashboard data
// @route   GET /api/accounting/dashboard
// @access  Accountant, Director
export const getDashboard = async (req, res) => {
  const { startDate, endDate } = req.query;

  const dateFilter = {};
  if (startDate || endDate) {
    dateFilter.createdAt = {};
    if (startDate) dateFilter.createdAt.$gte = new Date(startDate);
    if (endDate) dateFilter.createdAt.$lte = new Date(endDate);
  }

  // Total Income (all paid amounts)
  const incomeResult = await Payment.aggregate([
    ...(Object.keys(dateFilter).length > 0 ? [{ $match: dateFilter }] : []),
    {
      $group: {
        _id: null,
        totalIncome: { $sum: "$amount" },
      },
    },
  ]);

  const totalIncome = incomeResult[0]?.totalIncome || 0;

  // Total Expenses
  const expenseFilter = { ...dateFilter, status: "approved" };
  const expenseResult = await Expense.aggregate([
    ...(Object.keys(expenseFilter).length > 0
      ? [{ $match: expenseFilter }]
      : []),
    {
      $group: {
        _id: null,
        totalExpenses: { $sum: "$amount" },
      },
    },
  ]);

  const totalExpenses = expenseResult[0]?.totalExpenses || 0;

  // Profit
  const profit = totalIncome - totalExpenses;

  // Outstanding Invoices
  const outstandingInvoices = await Invoice.find({
    status: { $in: ["unpaid", "partially_paid", "overdue"] },
  }).countDocuments();

  const outstandingAmount = await Invoice.aggregate([
    {
      $match: {
        status: { $in: ["unpaid", "partially_paid", "overdue"] },
      },
    },
    {
      $group: {
        _id: null,
        total: { $sum: "$remainingAmount" },
      },
    },
  ]);

  const totalOutstanding = outstandingAmount[0]?.total || 0;

  // Overdue Invoices
  const overdueInvoices = await Invoice.find({
    status: "overdue",
  }).countDocuments();

  // Recent Payments
  const recentPayments = await Payment.find()
    .populate("invoice", "invoiceNumber client")
    .populate({
      path: "invoice",
      populate: { path: "client", select: "name" },
    })
    .sort({ paymentDate: -1 })
    .limit(5);

  // Recent Invoices
  const recentInvoices = await Invoice.find()
    .populate("client", "name email")
    .sort({ createdAt: -1 })
    .limit(5);

  // Income by payment method
  const incomeByMethod = await Payment.aggregate([
    ...(Object.keys(dateFilter).length > 0 ? [{ $match: dateFilter }] : []),
    {
      $group: {
        _id: "$paymentMethod",
        total: { $sum: "$amount" },
        count: { $sum: 1 },
      },
    },
  ]);

  // Expenses by category
  const expensesByCategory = await Expense.aggregate([
    ...(Object.keys(expenseFilter).length > 0
      ? [{ $match: expenseFilter }]
      : []),
    {
      $group: {
        _id: "$category",
        total: { $sum: "$amount" },
        count: { $sum: 1 },
      },
    },
  ]);

  res.status(200).json({
    success: true,
    data: {
      summary: {
        totalIncome,
        totalExpenses,
        profit,
        outstandingInvoices,
        totalOutstanding,
        overdueInvoices,
      },
      recentPayments,
      recentInvoices,
      incomeByMethod,
      expensesByCategory,
    },
  });
};

// @desc    Get installments for an invoice
// @route   GET /api/accounting/invoices/:id/installments
// @access  Secretary, Accountant, Director
export const getInvoiceInstallments = async (req, res) => {
  const installments = await InstallmentSchedule.find({
    invoice: req.params.id,
  }).sort({ installmentNumber: 1 });

  res.status(200).json({
    success: true,
    data: installments,
  });
};

// @desc    Update overdue statuses (cron job)
// @route   POST /api/accounting/update-overdue
// @access  Private (system)
export const updateOverdueStatuses = async (req, res) => {
  const now = new Date();

  // Update overdue invoices
  await Invoice.updateMany(
    {
      dueDate: { $lt: now },
      status: { $in: ["unpaid", "partially_paid"] },
      remainingAmount: { $gt: 0 },
    },
    { status: "overdue" }
  );

  // Update overdue installments
  await InstallmentSchedule.updateMany(
    {
      dueDate: { $lt: now },
      status: { $in: ["pending", "partially_paid"] },
      paidAmount: { $lt: "$amount" },
    },
    { status: "overdue" }
  );

  res.status(200).json({
    success: true,
    message: "Overdue statuses updated successfully",
  });
};

