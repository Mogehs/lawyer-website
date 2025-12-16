import express from "express";
import {
  createClient,
  getAllClients,
  getClientById,
  updateClient,
  deleteClient,
  getAllCases,
  createCase,
  getCaseById,
  updateCase,
  deleteCase,
  uploadCaseDocuments,
  assignCaseToLawyer,
  addCaseStage,
  uploadStageDocuments,
  updateHearingDetails,
  submitToCourt,
  archiveCase,
  getArchivedCases,
  addCaseNote,
  getActivityLogs,
  getDashboardStats,
  getLawyers,
  uploadCaseDocumentsWithFiles,
  uploadStageDocumentsWithFiles,
  uploadCourtSubmissionProof,
  getReminders,
  getCaseStatsByStatus,
  getRecentCases,
  getQuickStats,
  createReminder,
  deleteReminder,
  updateCourtCaseId,
} from "./secretary.controller.js";
import { loginRequired } from "../../utils/loginRequired.js";
import {
  uploadCaseDocuments as uploadCaseDocsMulter,
  uploadCourtProof,
} from "../../middleware/upload.js";

const router = express.Router();

router.use(loginRequired);

router.post("/clients", createClient);
router.get("/clients", getAllClients);
router.get("/clients/:id", getClientById);
router.put("/clients/:id", updateClient);
router.delete("/clients/:id", deleteClient);

router.get("/cases", getAllCases);
router.post("/cases", createCase);
router.get("/cases/:id", getCaseById);
router.put("/cases/:id", updateCase);
router.delete("/cases/:id", deleteCase);
router.post("/cases/:id/documents", uploadCaseDocuments);
router.post(
  "/cases/:id/documents/upload",
  uploadCaseDocsMulter.array("documents", 10),
  uploadCaseDocumentsWithFiles
);
router.post("/cases/:id/assign", assignCaseToLawyer);
router.post("/cases/:id/stages", addCaseStage);
router.post("/cases/:id/stages/documents", uploadStageDocuments);
router.post(
  "/cases/:id/stages/documents/upload",
  uploadCaseDocsMulter.array("documents", 10),
  uploadStageDocumentsWithFiles
);
router.put("/cases/:id/hearing", updateHearingDetails);
router.put("/cases/:id/court-case-id", updateCourtCaseId);
router.post("/cases/:id/submit", submitToCourt);
router.post(
  "/cases/:id/submit/upload",
  uploadCourtProof.single("courtProof"),
  uploadCourtSubmissionProof
);
router.post("/cases/:id/archive", archiveCase);
router.post("/cases/:id/notes", addCaseNote);

router.get("/archive", getArchivedCases);
router.get("/reminders", getReminders);
router.post("/reminders", createReminder);
router.delete("/reminders/:id", deleteReminder);
router.get("/activity-logs", getActivityLogs);
router.get("/dashboard/stats", getDashboardStats);
router.get("/dashboard/case-stats", getCaseStatsByStatus);
router.get("/dashboard/recent-cases", getRecentCases);
router.get("/dashboard/quick-stats", getQuickStats);
router.get("/lawyers", getLawyers);

export default router;
