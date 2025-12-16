import { asyncHandler } from "../../middleware/asyncHandler.js";
import {
  sendWhatsAppMessage,
  sendWhatsAppMedia,
  notifyLawyerAssignment,
  notifySecretaryAssignment,
  notifyHearingReminder,
  notifyMemorandumApproval,
  notifyDirectorSignatureRequired,
  notifyDeadlineReminder,
  notifyCaseStatusUpdate,
  notifyDocumentSubmission,
  notifyUrgentAlert,
  notifyCourtDateUpdate,
  notifyClientMeetingScheduled,
  testWhatsAppConnection,
} from "../../utils/notifications.js";
import whatsappScheduler from "../../utils/whatsappScheduler.js";
import { customError } from "../../utils/customError.js";

// Test WhatsApp API connection
export const testConnection = asyncHandler(async (req, res) => {
  const result = await testWhatsAppConnection();

  res.status(result.success ? 200 : 500).json({
    success: result.success,
    message: result.success ? result.message : result.error,
  });
});

// Send immediate WhatsApp message
export const sendMessage = asyncHandler(async (req, res) => {
  const { to, message } = req.body;

  if (!to || !message) {
    throw new customError("Phone number and message are required", 400);
  }

  const result = await sendWhatsAppMessage(to, message);

  res.status(result.success ? 200 : 500).json({
    success: result.success,
    data: result.success ? { messageId: result.messageId } : null,
    message: result.success ? "Message sent successfully" : result.error,
  });
});

// Send WhatsApp media message
export const sendMediaMessage = asyncHandler(async (req, res) => {
  const { to, caption, mediaUrl } = req.body;

  if (!to || !caption || !mediaUrl) {
    throw new customError(
      "Phone number, caption, and media URL are required",
      400
    );
  }

  const result = await sendWhatsAppMedia(to, caption, mediaUrl);

  res.status(result.success ? 200 : 500).json({
    success: result.success,
    data: result.success ? { messageId: result.messageId } : null,
    message: result.success ? "Media message sent successfully" : result.error,
  });
});

// Notify lawyer assignment
export const notifyLawyerCaseAssignment = asyncHandler(async (req, res) => {
  const { lawyer, caseNumber, clientName, caseDetails } = req.body;

  if (!lawyer || !lawyer.email || !caseNumber || !clientName) {
    throw new customError(
      "Lawyer details, case number, and client name are required",
      400
    );
  }

  try {
    await notifyLawyerAssignment(lawyer, caseNumber, clientName, caseDetails);

    res.json({
      success: true,
      message: "Lawyer assignment notification sent successfully",
    });
  } catch (error) {
    throw new customError(
      "Failed to send lawyer assignment notification: " + error.message,
      500
    );
  }
});

// Notify secretary assignment
export const notifySecretaryCaseAssignment = asyncHandler(async (req, res) => {
  const { secretary, caseNumber, lawyerName, clientName, caseDetails } =
    req.body;

  if (
    !secretary ||
    !secretary.email ||
    !caseNumber ||
    !lawyerName ||
    !clientName
  ) {
    throw new customError(
      "Secretary details, case number, lawyer name, and client name are required",
      400
    );
  }

  try {
    await notifySecretaryAssignment(
      secretary,
      caseNumber,
      lawyerName,
      clientName,
      caseDetails
    );

    res.json({
      success: true,
      message: "Secretary assignment notification sent successfully",
    });
  } catch (error) {
    throw new customError(
      "Failed to send secretary assignment notification: " + error.message,
      500
    );
  }
});

// Send hearing reminder
export const sendHearingReminder = asyncHandler(async (req, res) => {
  const { recipients, caseNumber, hearingDate, hearingTime, caseDetails } =
    req.body;

  if (
    !recipients ||
    !Array.isArray(recipients) ||
    !caseNumber ||
    !hearingDate ||
    !hearingTime
  ) {
    throw new customError(
      "Recipients array, case number, hearing date, and time are required",
      400
    );
  }

  try {
    await notifyHearingReminder(
      recipients,
      caseNumber,
      hearingDate,
      hearingTime,
      caseDetails
    );

    res.json({
      success: true,
      message: "Hearing reminder sent successfully",
      data: { recipientCount: recipients.length },
    });
  } catch (error) {
    throw new customError(
      "Failed to send hearing reminder: " + error.message,
      500
    );
  }
});

// Schedule hearing reminders
export const scheduleHearingReminders = asyncHandler(async (req, res) => {
  const { caseNumber, hearingDate, hearingTime, recipients, caseDetails } =
    req.body;

  if (!caseNumber || !hearingDate || !hearingTime || !recipients) {
    throw new customError(
      "Case number, hearing date, time, and recipients are required",
      400
    );
  }

  try {
    const result = whatsappScheduler.scheduleHearingReminders({
      caseNumber,
      hearingDate,
      hearingTime,
      recipients,
      caseDetails,
    });

    res.json({
      success: true,
      message: `Scheduled ${result.totalScheduled} hearing reminders`,
      data: result,
    });
  } catch (error) {
    throw new customError(
      "Failed to schedule hearing reminders: " + error.message,
      500
    );
  }
});

// Schedule deadline reminders
export const scheduleDeadlineReminders = asyncHandler(async (req, res) => {
  const { caseNumber, deadline, taskDescription, recipients } = req.body;

  if (!caseNumber || !deadline || !taskDescription || !recipients) {
    throw new customError(
      "Case number, deadline, task description, and recipients are required",
      400
    );
  }

  try {
    const result = whatsappScheduler.scheduleDeadlineReminders({
      caseNumber,
      deadline,
      taskDescription,
      recipients,
    });

    res.json({
      success: true,
      message: `Scheduled ${result.totalScheduled} deadline reminders`,
      data: result,
    });
  } catch (error) {
    throw new customError(
      "Failed to schedule deadline reminders: " + error.message,
      500
    );
  }
});

// Send memorandum approval notification
export const sendMemorandumApprovalNotification = asyncHandler(
  async (req, res) => {
    const { secretary, caseNumber, lawyerName, memoDetails } = req.body;

    if (!secretary || !secretary.email || !caseNumber || !lawyerName) {
      throw new customError(
        "Secretary details, case number, and lawyer name are required",
        400
      );
    }

    try {
      await notifyMemorandumApproval(
        secretary,
        caseNumber,
        lawyerName,
        memoDetails
      );

      res.json({
        success: true,
        message: "Memorandum approval notification sent successfully",
      });
    } catch (error) {
      throw new customError(
        "Failed to send memorandum approval notification: " + error.message,
        500
      );
    }
  }
);

// Send director signature required notification
export const sendDirectorSignatureNotification = asyncHandler(
  async (req, res) => {
    const { director, caseNumber, documentType, urgency } = req.body;

    if (!director || !director.email || !caseNumber) {
      throw new customError(
        "Director details and case number are required",
        400
      );
    }

    try {
      await notifyDirectorSignatureRequired(
        director,
        caseNumber,
        documentType,
        urgency
      );

      res.json({
        success: true,
        message: "Director signature notification sent successfully",
      });
    } catch (error) {
      throw new customError(
        "Failed to send director signature notification: " + error.message,
        500
      );
    }
  }
);

// Send case status update
export const sendCaseStatusUpdate = asyncHandler(async (req, res) => {
  const { recipients, caseNumber, oldStatus, newStatus, updatedBy, notes } =
    req.body;

  if (!recipients || !caseNumber || !oldStatus || !newStatus || !updatedBy) {
    throw new customError(
      "Recipients, case number, status information, and updater name are required",
      400
    );
  }

  try {
    await notifyCaseStatusUpdate(
      recipients,
      caseNumber,
      oldStatus,
      newStatus,
      updatedBy,
      notes
    );

    res.json({
      success: true,
      message: "Case status update notification sent successfully",
      data: { recipientCount: recipients.length },
    });
  } catch (error) {
    throw new customError(
      "Failed to send case status update: " + error.message,
      500
    );
  }
});

// Send urgent alert
export const sendUrgentAlert = asyncHandler(async (req, res) => {
  const { recipients, caseNumber, alertType, message, actionRequired } =
    req.body;

  if (!recipients || !caseNumber || !alertType || !message || !actionRequired) {
    throw new customError("All alert fields are required", 400);
  }

  try {
    await notifyUrgentAlert(
      recipients,
      caseNumber,
      alertType,
      message,
      actionRequired
    );

    res.json({
      success: true,
      message: "Urgent alert sent successfully",
      data: { recipientCount: recipients.length },
    });
  } catch (error) {
    throw new customError("Failed to send urgent alert: " + error.message, 500);
  }
});

// Send court date update
export const sendCourtDateUpdate = asyncHandler(async (req, res) => {
  const { recipients, caseNumber, oldDate, newDate, courtName, reason } =
    req.body;

  if (
    !recipients ||
    !caseNumber ||
    !oldDate ||
    !newDate ||
    !courtName ||
    !reason
  ) {
    throw new customError("All court date update fields are required", 400);
  }

  try {
    await notifyCourtDateUpdate(
      recipients,
      caseNumber,
      oldDate,
      newDate,
      courtName,
      reason
    );

    res.json({
      success: true,
      message: "Court date update notification sent successfully",
      data: { recipientCount: recipients.length },
    });
  } catch (error) {
    throw new customError(
      "Failed to send court date update: " + error.message,
      500
    );
  }
});

// Send immediate notification to multiple recipients
export const sendImmediateNotification = asyncHandler(async (req, res) => {
  const { recipients, message, caseNumber } = req.body;

  if (!recipients || !Array.isArray(recipients) || !message || !caseNumber) {
    throw new customError(
      "Recipients array, message, and case number are required",
      400
    );
  }

  try {
    const result = await whatsappScheduler.sendImmediateNotification(
      recipients,
      message,
      caseNumber
    );

    res.json({
      success: result.success,
      message: `Sent ${result.totalSent} notifications, ${result.totalFailed} failed`,
      data: result,
    });
  } catch (error) {
    throw new customError(
      "Failed to send immediate notifications: " + error.message,
      500
    );
  }
});

// Get scheduled reminders
export const getScheduledReminders = asyncHandler(async (req, res) => {
  try {
    const reminders = whatsappScheduler.getScheduledReminders();

    res.json({
      success: true,
      message: "Scheduled reminders retrieved successfully",
      data: {
        reminders,
        totalScheduled: reminders.length,
      },
    });
  } catch (error) {
    throw new customError(
      "Failed to get scheduled reminders: " + error.message,
      500
    );
  }
});

// Cancel a scheduled reminder
export const cancelScheduledReminder = asyncHandler(async (req, res) => {
  const { reminderId } = req.params;

  if (!reminderId) {
    throw new customError("Reminder ID is required", 400);
  }

  try {
    const result = whatsappScheduler.cancelReminder(reminderId);

    res.json({
      success: result.success,
      message: result.success
        ? "Reminder cancelled successfully"
        : result.error,
    });
  } catch (error) {
    throw new customError("Failed to cancel reminder: " + error.message, 500);
  }
});

// Send document submission notification
export const sendDocumentSubmissionNotification = asyncHandler(
  async (req, res) => {
    const {
      recipients,
      caseNumber,
      documentType,
      submittedBy,
      submissionDate,
    } = req.body;

    if (
      !recipients ||
      !caseNumber ||
      !documentType ||
      !submittedBy ||
      !submissionDate
    ) {
      throw new customError("All document submission fields are required", 400);
    }

    try {
      await notifyDocumentSubmission(
        recipients,
        caseNumber,
        documentType,
        submittedBy,
        submissionDate
      );

      res.json({
        success: true,
        message: "Document submission notification sent successfully",
        data: { recipientCount: recipients.length },
      });
    } catch (error) {
      throw new customError(
        "Failed to send document submission notification: " + error.message,
        500
      );
    }
  }
);

// Send client meeting notification
export const sendClientMeetingNotification = asyncHandler(async (req, res) => {
  const {
    recipients,
    caseNumber,
    clientName,
    meetingDate,
    meetingTime,
    location,
  } = req.body;

  if (
    !recipients ||
    !caseNumber ||
    !clientName ||
    !meetingDate ||
    !meetingTime ||
    !location
  ) {
    throw new customError("All meeting fields are required", 400);
  }

  try {
    await notifyClientMeetingScheduled(
      recipients,
      caseNumber,
      clientName,
      meetingDate,
      meetingTime,
      location
    );

    res.json({
      success: true,
      message: "Client meeting notification sent successfully",
      data: { recipientCount: recipients.length },
    });
  } catch (error) {
    throw new customError(
      "Failed to send client meeting notification: " + error.message,
      500
    );
  }
});
