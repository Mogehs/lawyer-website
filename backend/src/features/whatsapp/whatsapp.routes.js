import express from "express";
import {
  testConnection,
  sendMessage,
  sendMediaMessage,
  notifyLawyerCaseAssignment,
  notifySecretaryCaseAssignment,
  sendHearingReminder,
  scheduleHearingReminders,
  scheduleDeadlineReminders,
  sendMemorandumApprovalNotification,
  sendDirectorSignatureNotification,
  sendCaseStatusUpdate,
  sendUrgentAlert,
  sendCourtDateUpdate,
  sendImmediateNotification,
  getScheduledReminders,
  cancelScheduledReminder,
  sendDocumentSubmissionNotification,
  sendClientMeetingNotification,
} from "./whatsapp.controller.js";
import { allowedRoles } from "../../utils/allowedRoles.js";
import { loginRequired } from "../../utils/loginRequired.js";

const router = express.Router();

// Test connection (admin only)
router.get(
  "/test-connection",
  loginRequired,
  allowedRoles("admin"),
  testConnection
);

// Basic messaging endpoints
router.post(
  "/send-message",
  loginRequired,
  allowedRoles("admin", "director", "secretary"),
  sendMessage
);

router.post(
  "/send-media",
  loginRequired,
  allowedRoles("admin", "director", "secretary"),
  sendMediaMessage
);

// Case assignment notifications
router.post(
  "/notify/lawyer-assignment",
  loginRequired,
  allowedRoles("admin", "director", "secretary"),
  notifyLawyerCaseAssignment
);

router.post(
  "/notify/secretary-assignment",
  loginRequired,
  allowedRoles("admin", "director"),
  notifySecretaryCaseAssignment
);

// Hearing management
router.post(
  "/notify/hearing-reminder",
  loginRequired,
  allowedRoles("admin", "director", "secretary"),
  sendHearingReminder
);

router.post(
  "/schedule/hearing-reminders",
  loginRequired,
  allowedRoles("admin", "director", "secretary"),
  scheduleHearingReminders
);

// Deadline management
router.post(
  "/schedule/deadline-reminders",
  loginRequired,
  allowedRoles("admin", "director", "secretary", "lawyer"),
  scheduleDeadlineReminders
);

// Document notifications
router.post(
  "/notify/memorandum-approval",
  loginRequired,
  allowedRoles("admin", "director", "lawyer"),
  sendMemorandumApprovalNotification
);

router.post(
  "/notify/director-signature",
  loginRequired,
  allowedRoles("admin", "secretary", "lawyer"),
  sendDirectorSignatureNotification
);

router.post(
  "/notify/document-submission",
  loginRequired,
  allowedRoles("admin", "director", "secretary", "lawyer"),
  sendDocumentSubmissionNotification
);

// Status and alerts
router.post(
  "/notify/case-status-update",
  loginRequired,
  allowedRoles("admin", "director", "secretary", "lawyer"),
  sendCaseStatusUpdate
);

router.post(
  "/notify/urgent-alert",
  loginRequired,
  allowedRoles("admin", "director"),
  sendUrgentAlert
);

router.post(
  "/notify/court-date-update",
  loginRequired,
  allowedRoles("admin", "director", "secretary"),
  sendCourtDateUpdate
);

router.post(
  "/notify/client-meeting",
  loginRequired,
  allowedRoles("admin", "director", "secretary", "lawyer"),
  sendClientMeetingNotification
);

// Immediate notifications
router.post(
  "/send-immediate",
  loginRequired,
  allowedRoles("admin", "director", "secretary"),
  sendImmediateNotification
);

// Scheduler management
router.get(
  "/scheduled-reminders",
  loginRequired,
  allowedRoles("admin", "director", "secretary"),
  getScheduledReminders
);

router.delete(
  "/scheduled-reminders/:reminderId",
  loginRequired,
  allowedRoles("admin", "director", "secretary"),
  cancelScheduledReminder
);

export default router;
