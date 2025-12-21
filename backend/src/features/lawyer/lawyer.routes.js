import express from "express";
import {
  getAssignedCases,
  getCaseById,
  acceptCase,
  submitMemorandum,
  uploadMemorandumFile,
  uploadCaseDocuments,
  updateMemorandum,
  approveMemorandum,
  rejectMemorandum,
  getPendingApprovals,
  getMyArchive,
  getUpcomingHearings,
  getDashboardStats,
  addCaseNote,
  getMyReminders,
  getCaseTimeline,
  getAllLawyers,
  getNotifications,
  markNotificationAsRead,
  updateStatusPendingSignature,
  requestModificationBAL,
  deleteCase,
} from "./lawyer.controller.js";
import {
  reviewSession,
  uploadSessionMemorandum,
  reviewMemorandum,
  completeSession,
  getMyAssignedSessions,
} from "../secretary/session.controller.js";
import { loginRequired } from "../../utils/loginRequired.js";
import {
  uploadMemorandum,
  uploadCaseDocuments as uploadDocsMulter,
} from "../../middleware/upload.js";

const router = express.Router();

router.use(loginRequired);

router.get("/cases", getAssignedCases);
router.get("/cases/:id", getCaseById);
router.post("/cases/:id/accept", acceptCase);
router.delete("/cases/:id", deleteCase);
router.post("/cases/:id/memorandum", submitMemorandum);
router.post(
  "/cases/:id/memorandum/upload",
  uploadMemorandum.single("memorandum"),
  uploadMemorandumFile
);
router.post(
  "/cases/:id/documents/upload",
  uploadDocsMulter.array("documents", 10),
  uploadCaseDocuments
);
router.put("/cases/:id/memorandum", updateMemorandum);
router.post("/cases/:id/memorandum/approve", approveMemorandum);
router.post("/cases/:id/memorandum/reject", rejectMemorandum);
router.post("/cases/:id/notes", addCaseNote);
router.get("/cases/:id/timeline", getCaseTimeline);

router.get("/pending-approvals", getPendingApprovals);
router.post("/pending-approvals/:id", updateStatusPendingSignature);
router.post("/request-modification/:id", requestModificationBAL);
router.delete("/delete-case/:id", deleteCase);

// Session Management Routes for Lawyers
router.get("/my-sessions", getMyAssignedSessions); // Draft lawyer gets their unlocked sessions
router.post("/cases/:caseId/sessions/:sessionId/review", reviewSession); // Approving lawyer reviews session
router.post("/cases/:caseId/sessions/:sessionId/memorandum", uploadSessionMemorandum); // Draft lawyer uploads memorandum
router.post("/cases/:caseId/sessions/:sessionId/memorandum/review", reviewMemorandum); // Approving lawyer reviews memorandum
router.post("/cases/:caseId/sessions/:sessionId/complete", completeSession); // Draft lawyer completes/cancels session

router.get("/archive", getMyArchive);
router.get("/hearings", getUpcomingHearings);
router.get("/reminders", getMyReminders);
router.get("/dashboard/stats", getDashboardStats);
router.get("/all-lawyers", getAllLawyers);
router.get("/notifications", getNotifications);
router.post("/notifications/:id/read", markNotificationAsRead);

export default router;
