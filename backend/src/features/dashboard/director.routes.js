import express from "express";
import { loginRequired } from "../../utils/loginRequired.js";
import { addUser, deleteCase, deleteUser, getAllArchivedCases, getAllCases, getAllReminders, getAllUsers, getPendingSignature, updateStatusReadyForSubmission, updateUserRole, userStats, getPendingSignatureCases, approveWithSignedDocument } from "./director.controller.js";
import { getPendingSessions, approveSessionForSubmission } from "./director.session.controller.js";
import { allowedRoles } from "../../utils/allowedRoles.js";
import { uploadMemorandum } from "../../middleware/upload.js";

const router = express.Router();

router.use(loginRequired, allowedRoles(['director']));

router.get("/director-archive", getAllArchivedCases);
router.get("/reminders", getAllReminders);
router.get('/all-users', getAllUsers);
router.put('/update-user-role/:id', updateUserRole);
router.delete("/delete-user/:id", deleteUser);
router.post("/addUser", addUser);
router.get("/stats", userStats);
router.get("/cases", getAllCases);
router.put("/updateStatusReadyForSubmission/:id", updateStatusReadyForSubmission);
router.get("/getPendingSignature", getPendingSignature);
router.get("/pending-signature-cases", getPendingSignatureCases);
router.post("/approve-signed/:id", uploadMemorandum.single('memorandum'), approveWithSignedDocument);
router.delete("/delete-case/:id", deleteCase);

// Session Management Routes
router.get("/pending-sessions", getPendingSessions);
router.post("/cases/:caseId/sessions/:sessionId/approve", approveSessionForSubmission);
export default router;