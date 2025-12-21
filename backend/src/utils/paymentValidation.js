import { Invoice, InstallmentSchedule } from "../features/accounting/accounting.model.js";

/**
 * Check if a client has valid payment status to create a case
 *
 * @param {String} clientId - The MongoDB ObjectId of the client
 * @returns {Promise<Object>} - Returns object with isValid (boolean) and message (string)
 *
 * Valid payment conditions:
 * 1. At least one invoice exists for the client
 * 2. At least one invoice is fully paid (status === "paid"), OR
 * 3. For installment invoices, the first installment must be paid
 */
export const validateClientPaymentStatus = async (clientId) => {
  try {
    // Get all invoices for the client
    const clientInvoices = await Invoice.find({ client: clientId });

    // Check if client has any invoices
    if (clientInvoices.length === 0) {
      return {
        isValid: false,
        message: "No invoice found for this client. Please create an invoice first.",
        details: null
      };
    }

    // Check each invoice for valid payment
    for (const invoice of clientInvoices) {
      // Case 1: Invoice is fully paid
      if (invoice.status === "paid") {
        return {
          isValid: true,
          message: `Invoice ${invoice.invoiceNumber} is fully paid`,
          details: {
            invoiceId: invoice._id,
            invoiceNumber: invoice.invoiceNumber,
            paymentType: "full",
            totalAmount: invoice.totalAmount,
            paidAmount: invoice.paidAmount
          }
        };
      }

      // Case 2: Invoice has installments - check if first installment is paid
      if (invoice.isInstallment) {
        const installments = await InstallmentSchedule.find({
          invoice: invoice._id
        }).sort({ installmentNumber: 1 });

        if (installments.length > 0) {
          const firstInstallment = installments[0];
          if (firstInstallment.status === "paid") {
            return {
              isValid: true,
              message: `First installment of invoice ${invoice.invoiceNumber} is paid`,
              details: {
                invoiceId: invoice._id,
                invoiceNumber: invoice.invoiceNumber,
                paymentType: "installment",
                installmentNumber: 1,
                installmentAmount: firstInstallment.amount,
                totalAmount: invoice.totalAmount,
                paidAmount: invoice.paidAmount,
                remainingAmount: invoice.remainingAmount
              }
            };
          }
        }
      }
    }

    // No valid payment found
    return {
      isValid: false,
      message: "Client must either pay the invoice in full or pay the first installment before case registration.",
      details: {
        totalInvoices: clientInvoices.length,
        invoices: clientInvoices.map(inv => ({
          invoiceNumber: inv.invoiceNumber,
          status: inv.status,
          totalAmount: inv.totalAmount,
          paidAmount: inv.paidAmount,
          isInstallment: inv.isInstallment
        }))
      }
    };

  } catch (error) {
    console.error("Error validating client payment status:", error);
    throw new Error(`Payment validation failed: ${error.message}`);
  }
};

/**
 * Get payment summary for a client
 *
 * @param {String} clientId - The MongoDB ObjectId of the client
 * @returns {Promise<Object>} - Returns payment summary with statistics
 */
export const getClientPaymentSummary = async (clientId) => {
  try {
    const invoices = await Invoice.find({ client: clientId });

    const summary = {
      totalInvoices: invoices.length,
      totalAmount: 0,
      totalPaidAmount: 0,
      totalRemainingAmount: 0,
      fullyPaidInvoices: 0,
      partiallyPaidInvoices: 0,
      unpaidInvoices: 0,
      overdueInvoices: 0,
      installmentInvoices: 0,
      canCreateCase: false,
      reason: ""
    };

    for (const invoice of invoices) {
      summary.totalAmount += invoice.totalAmount;
      summary.totalPaidAmount += invoice.paidAmount;
      summary.totalRemainingAmount += invoice.remainingAmount;

      if (invoice.status === "paid") summary.fullyPaidInvoices++;
      else if (invoice.status === "partially_paid") summary.partiallyPaidInvoices++;
      else if (invoice.status === "unpaid") summary.unpaidInvoices++;
      else if (invoice.status === "overdue") summary.overdueInvoices++;

      if (invoice.isInstallment) summary.installmentInvoices++;
    }

    // Check if can create case
    const validationResult = await validateClientPaymentStatus(clientId);
    summary.canCreateCase = validationResult.isValid;
    summary.reason = validationResult.message;

    return summary;

  } catch (error) {
    console.error("Error getting client payment summary:", error);
    throw new Error(`Failed to get payment summary: ${error.message}`);
  }
};

export default {
  validateClientPaymentStatus,
  getClientPaymentSummary
};

