import sendMail from "./sendMail.js";

// WhatsApp API configuration from environment variables
const SMS_API_URL = "https://custom1.waghl.com/send-message";
const SMS_MEDIA_API_URL = "https://custom1.waghl.com/send-media";

// Function to get environment variables (called when needed)
const getApiCredentials = () => {
  return {
    apiKey: process.env.SMS_API_KEY,
    sender: process.env.SMS_SENDER,
  };
};

// Function to validate environment variables (called when needed)
const validateApiCredentials = () => {
  const { apiKey, sender } = getApiCredentials();
  if (!apiKey || !sender) {
    console.error("❌ Missing SMS API credentials in environment variables");
    console.error("Please set SMS_API_KEY and SMS_SENDER in your .env file");
    return false;
  }
  return true;
};

// Core WhatsApp API Functions
export const sendWhatsAppMessage = async (to, message) => {
  try {
    if (!validateApiCredentials()) {
      const error =
        "SMS API credentials not configured in environment variables";
      console.error("❌", error);
      return { success: false, error: error };
    }

    const { apiKey, sender } = getApiCredentials();

    // Validate phone number
    if (!to || typeof to !== "string") {
      const error = "Invalid phone number provided";
      console.error("❌", error, "Received:", to);
      return { success: false, error: error };
    }

    // Remove any non-digit characters for the API
    const formattedNumber = to.replace(/\D/g, "");

    console.log(`📤 Sending WhatsApp message to ${formattedNumber}...`);

    const response = await fetch(SMS_API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        api_key: apiKey,
        sender: sender,
        number: formattedNumber,
        message: message,
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      console.error("❌ Error sending WhatsApp message:", {
        status: response.status,
        data: data,
        to: to,
        formattedNumber: formattedNumber,
      });
      return {
        success: false,
        error:
          data.message ||
          `Failed to send WhatsApp message (Status: ${response.status})`,
      };
    }

    console.log(
      `✅ WhatsApp message sent successfully to ${formattedNumber}. Response:`,
      data
    );
    return { success: true, messageId: data.id || "sent", status: "sent" };
  } catch (error) {
    const errorDetails = { message: error.message, to: to };
    console.error("❌ Error sending WhatsApp message:", errorDetails);
    return { success: false, error: error.message, details: errorDetails };
  }
};

export const sendWhatsAppMedia = async (to, caption, mediaUrl) => {
  try {
    if (!validateApiCredentials()) {
      const error =
        "SMS API credentials not configured in environment variables";
      console.error("❌", error);
      return { success: false, error: error };
    }

    const { apiKey, sender } = getApiCredentials();

    // Validate inputs
    if (!to || typeof to !== "string") {
      const error = "Invalid phone number provided";
      console.error("❌", error, "Received:", to);
      return { success: false, error: error };
    }

    if (!mediaUrl || typeof mediaUrl !== "string") {
      const error = "Invalid media URL provided";
      console.error("❌", error, "Received:", mediaUrl);
      return { success: false, error: error };
    }

    const formattedNumber = to.replace(/\D/g, "");
    console.log(`📤 Sending WhatsApp media to ${formattedNumber}...`);

    const response = await fetch(SMS_MEDIA_API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        api_key: apiKey,
        sender: sender,
        number: formattedNumber,
        caption: caption,
        media_type: "image",
        url: mediaUrl,
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      console.error("❌ Error sending WhatsApp media:", {
        status: response.status,
        data: data,
        to: to,
        formattedNumber: formattedNumber,
      });
      return {
        success: false,
        error:
          data.message ||
          `Failed to send WhatsApp media (Status: ${response.status})`,
      };
    }

    console.log(
      `✅ WhatsApp media sent successfully to ${formattedNumber}. Response:`,
      data
    );
    return { success: true, messageId: data.id || "sent", status: "sent" };
  } catch (error) {
    const errorDetails = { message: error.message, to: to };
    console.error("❌ Error sending WhatsApp media:", errorDetails);
    return { success: false, error: error.message, details: errorDetails };
  }
};

// Legacy function for backward compatibility
export const sendWhatsAppNotification = async (phoneNumber, message) => {
  const result = await sendWhatsAppMessage(phoneNumber, message);
  if (result.success) {
    console.log(`📱 WhatsApp notification sent to ${phoneNumber}: ${message}`);
  } else {
    console.error(
      `❌ WhatsApp notification failed for ${phoneNumber}:`,
      result.error
    );
  }
  return result;
};

export const sendEmailNotification = async (email, subject, message) => {
  try {
    const result = await sendMail({ email, subject, text: message });
    if (!result.success) {
      console.warn(`⚠️ Email notification failed for ${email}:`, result.error);
    }
    return result;
  } catch (error) {
    console.error("❌ Email notification error:", error.message);
    return { success: false, error: error.message };
  }
};

// Specialized Lawyer Notification Functions
export const notifyLawyerAssignment = async (
  lawyer,
  caseNumber,
  clientName,
  caseDetails = {}
) => {
  const {
    courtName,
    caseType,
    assignedDate,
    priority = "Normal",
  } = caseDetails;

  const emailMessage = `New case assigned: ${caseNumber} for client ${clientName}`;

  // Detailed WhatsApp message for lawyers
  const whatsappMessage =
    `⚖️ NEW CASE ASSIGNMENT\n\n` +
    `📋 Case Number: ${caseNumber}\n` +
    `👤 Client: ${clientName}\n` +
    `📅 Assigned Date: ${assignedDate || new Date().toLocaleDateString()}\n` +
    `🏛️ Court: ${courtName || "To be determined"}\n` +
    `📂 Case Type: ${caseType || "General"}\n` +
    `⚠️ Priority: ${priority}\n\n` +
    `📱 Please log into the system to review case details and begin preparation.\n\n` +
    `📞 For urgent matters, contact the secretary immediately.`;

  const results = {
    email: null,
    whatsapp: null,
  };

  // Try email notification (non-blocking)
  results.email = await sendEmailNotification(
    lawyer.email,
    "New Case Assignment",
    emailMessage
  );

  // Try WhatsApp notification (non-blocking)
  if (lawyer.phone) {
    results.whatsapp = await sendWhatsAppMessage(lawyer.phone, whatsappMessage);
  }

  return results;
};

export const notifySecretaryAssignment = async (
  secretary,
  caseNumber,
  lawyerName,
  clientName,
  caseDetails = {}
) => {
  const { courtName, hearingDate, caseType } = caseDetails;

  const emailMessage = `Case ${caseNumber} assigned to lawyer ${lawyerName} for client ${clientName}`;

  // Detailed WhatsApp message for secretaries
  const whatsappMessage =
    `📝 CASE ASSIGNMENT UPDATE\n\n` +
    `📋 Case Number: ${caseNumber}\n` +
    `⚖️ Assigned Lawyer: ${lawyerName}\n` +
    `👤 Client: ${clientName}\n` +
    `🏛️ Court: ${courtName || "To be determined"}\n` +
    `📂 Case Type: ${caseType || "General"}\n` +
    `${hearingDate ? `📅 Next Hearing: ${hearingDate}\n` : ""}\n` +
    `📌 Secretary Tasks:\n` +
    `• Prepare case documents\n` +
    `• Schedule client meetings\n` +
    `• Monitor deadlines\n` +
    `• Coordinate with lawyer\n\n` +
    `💻 Access the dashboard for complete case details.`;

  const results = {
    email: null,
    whatsapp: null,
  };

  // Try email notification (non-blocking)
  results.email = await sendEmailNotification(
    secretary.email,
    "Case Assignment Update",
    emailMessage
  );

  // Try WhatsApp notification (non-blocking)
  if (secretary.phone) {
    results.whatsapp = await sendWhatsAppMessage(secretary.phone, whatsappMessage);
  }

  return results;
};

export const notifyHearingReminder = async (
  recipients,
  caseNumber,
  hearingDate,
  hearingTime,
  caseDetails = {}
) => {
  const { courtName, clientName, caseType, judge } = caseDetails;

  const emailMessage = `Hearing Reminder: Case ${caseNumber} scheduled on ${hearingDate} at ${hearingTime}`;

  // Detailed WhatsApp reminder
  const whatsappMessage =
    `⏰ HEARING REMINDER\n\n` +
    `📋 Case Number: ${caseNumber}\n` +
    `📅 Hearing Date: ${hearingDate}\n` +
    `🕐 Time: ${hearingTime}\n` +
    `🏛️ Court: ${courtName || "To be confirmed"}\n` +
    `👨‍⚖️ Judge: ${judge || "To be confirmed"}\n` +
    `👤 Client: ${clientName || "See case details"}\n` +
    `📂 Case Type: ${caseType || "General"}\n\n` +
    `📋 Preparation Checklist:\n` +
    `• Review case documents\n` +
    `• Prepare arguments\n` +
    `• Confirm client attendance\n` +
    `• Gather evidence\n\n` +
    `⚠️ Please arrive 30 minutes early.`;

  for (const recipient of recipients) {
    await sendEmailNotification(
      recipient.email,
      "Hearing Reminder",
      emailMessage
    );

    if (recipient.phone) {
      await sendWhatsAppMessage(recipient.phone, whatsappMessage);
    }
  }
};

export const notifyMemorandumApproval = async (
  secretary,
  caseNumber,
  lawyerName,
  memoDetails = {}
) => {
  const { documentType = "Memorandum", approvedDate, nextSteps } = memoDetails;

  const emailMessage = `Memorandum approved for case ${caseNumber}. Ready for final review.`;

  const whatsappMessage =
    `✅ DOCUMENT APPROVED\n\n` +
    `📋 Case Number: ${caseNumber}\n` +
    `📄 Document: ${documentType}\n` +
    `⚖️ Prepared by: ${lawyerName}\n` +
    `✅ Approved Date: ${approvedDate || new Date().toLocaleDateString()}\n\n` +
    `📌 Next Steps:\n` +
    `${
      nextSteps ||
      "• Proceed with final review\n• Prepare for submission\n• Update case status"
    }\n\n` +
    `💻 Access the system to view the approved document.`;

  await sendEmailNotification(
    secretary.email,
    "Memorandum Approved",
    emailMessage
  );

  if (secretary.phone) {
    await sendWhatsAppMessage(secretary.phone, whatsappMessage);
  }
};

export const notifyDirectorSignatureRequired = async (
  director,
  caseNumber,
  documentType = "Document",
  urgency = "Normal"
) => {
  const emailMessage = `Your signature is required for case ${caseNumber}`;

  const urgencyIcon =
    urgency === "Urgent" ? "🚨" : urgency === "High" ? "⚠️" : "📝";

  const whatsappMessage =
    `${urgencyIcon} SIGNATURE REQUIRED\n\n` +
    `📋 Case Number: ${caseNumber}\n` +
    `📄 Document Type: ${documentType}\n` +
    `⚠️ Priority: ${urgency}\n` +
    `📅 Date: ${new Date().toLocaleDateString()}\n\n` +
    `${
      urgency === "Urgent" ? "🚨 URGENT: Immediate attention required\n\n" : ""
    }` +
    `📌 Required Action:\n` +
    `• Review document details\n` +
    `• Verify information\n` +
    `• Provide digital signature\n` +
    `• Approve for submission\n\n` +
    `💻 Please log in to the system to complete the signature process.`;

  await sendEmailNotification(
    director.email,
    "Signature Required",
    emailMessage
  );

  if (director.phone) {
    await sendWhatsAppMessage(director.phone, whatsappMessage);
  }
};

// Additional notification functions for comprehensive case management
export const notifyDeadlineReminder = async (
  recipients,
  caseNumber,
  deadline,
  taskDescription,
  daysRemaining
) => {
  const urgencyLevel =
    daysRemaining <= 1
      ? "🚨 URGENT"
      : daysRemaining <= 3
      ? "⚠️ HIGH PRIORITY"
      : "📅 REMINDER";

  const whatsappMessage =
    `${urgencyLevel} DEADLINE REMINDER\n\n` +
    `📋 Case Number: ${caseNumber}\n` +
    `⏰ Deadline: ${deadline}\n` +
    `📝 Task: ${taskDescription}\n` +
    `📅 Days Remaining: ${daysRemaining}\n\n` +
    `${daysRemaining <= 1 ? "🚨 IMMEDIATE ACTION REQUIRED!\n" : ""}` +
    `💻 Please review and complete the required tasks in the system.`;

  for (const recipient of recipients) {
    if (recipient.phone) {
      await sendWhatsAppMessage(recipient.phone, whatsappMessage);
    }
  }
};

export const notifyCaseStatusUpdate = async (
  recipients,
  caseNumber,
  oldStatus,
  newStatus,
  updatedBy,
  notes = ""
) => {
  const whatsappMessage =
    `📊 CASE STATUS UPDATE\n\n` +
    `📋 Case Number: ${caseNumber}\n` +
    `📈 Status Changed: ${oldStatus} → ${newStatus}\n` +
    `👤 Updated by: ${updatedBy}\n` +
    `📅 Date: ${new Date().toLocaleDateString()}\n` +
    `${notes ? `📝 Notes: ${notes}\n` : ""}\n` +
    `💻 Check the system for complete case updates.`;

  for (const recipient of recipients) {
    if (recipient.phone) {
      await sendWhatsAppMessage(recipient.phone, whatsappMessage);
    }
  }
};

export const notifyDocumentSubmission = async (
  recipients,
  caseNumber,
  documentType,
  submittedBy,
  submissionDate
) => {
  const whatsappMessage =
    `📄 DOCUMENT SUBMITTED\n\n` +
    `📋 Case Number: ${caseNumber}\n` +
    `📄 Document: ${documentType}\n` +
    `👤 Submitted by: ${submittedBy}\n` +
    `📅 Submission Date: ${submissionDate}\n\n` +
    `✅ Document is now available for review in the system.\n` +
    `💻 Please log in to access and review the document.`;

  for (const recipient of recipients) {
    if (recipient.phone) {
      await sendWhatsAppMessage(recipient.phone, whatsappMessage);
    }
  }
};

export const notifyUrgentAlert = async (
  recipients,
  caseNumber,
  alertType,
  message,
  actionRequired
) => {
  const whatsappMessage =
    `🚨 URGENT ALERT\n\n` +
    `📋 Case Number: ${caseNumber}\n` +
    `⚠️ Alert Type: ${alertType}\n` +
    `📝 Message: ${message}\n` +
    `📅 Date: ${new Date().toLocaleDateString()}\n\n` +
    `🎯 Action Required:\n${actionRequired}\n\n` +
    `⏰ IMMEDIATE ATTENTION NEEDED\n` +
    `💻 Please log in to the system immediately.`;

  for (const recipient of recipients) {
    if (recipient.phone) {
      await sendWhatsAppMessage(recipient.phone, whatsappMessage);
    }
  }
};

export const notifyCourtDateUpdate = async (
  recipients,
  caseNumber,
  oldDate,
  newDate,
  courtName,
  reason
) => {
  const whatsappMessage =
    `📅 COURT DATE CHANGED\n\n` +
    `📋 Case Number: ${caseNumber}\n` +
    `🏛️ Court: ${courtName}\n` +
    `📅 Old Date: ${oldDate}\n` +
    `📅 New Date: ${newDate}\n` +
    `📝 Reason: ${reason}\n` +
    `📅 Updated: ${new Date().toLocaleDateString()}\n\n` +
    `📋 Next Steps:\n` +
    `• Update your calendar\n` +
    `• Inform the client\n` +
    `• Reschedule preparations\n` +
    `• Confirm attendance\n\n` +
    `💻 Check the system for complete details.`;

  for (const recipient of recipients) {
    if (recipient.phone) {
      await sendWhatsAppMessage(recipient.phone, whatsappMessage);
    }
  }
};

export const notifyClientMeetingScheduled = async (
  recipients,
  caseNumber,
  clientName,
  meetingDate,
  meetingTime,
  location
) => {
  const whatsappMessage =
    `🤝 CLIENT MEETING SCHEDULED\n\n` +
    `📋 Case Number: ${caseNumber}\n` +
    `👤 Client: ${clientName}\n` +
    `📅 Date: ${meetingDate}\n` +
    `🕐 Time: ${meetingTime}\n` +
    `📍 Location: ${location}\n` +
    `📅 Scheduled: ${new Date().toLocaleDateString()}\n\n` +
    `📋 Preparation:\n` +
    `• Review case files\n` +
    `• Prepare questions\n` +
    `• Gather documents\n` +
    `• Set agenda\n\n` +
    `💻 Access the system for meeting details.`;

  for (const recipient of recipients) {
    if (recipient.phone) {
      await sendWhatsAppMessage(recipient.phone, whatsappMessage);
    }
  }
};

// Test function for API connection
export const testWhatsAppConnection = async () => {
  try {
    if (!validateApiCredentials()) {
      return {
        success: false,
        error:
          "WhatsApp API credentials not configured. Please check your environment variables.",
      };
    }
    return { success: true, message: "WhatsApp API configured successfully" };
  } catch (error) {
    console.error("❌ WhatsApp API connection failed:", error.message);
    return { success: false, error: error.message };
  }
};
