import { asyncHandler } from "../../middleware/asyncHandler.js";
import { customError } from "../../utils/customError.js";
import { Case } from "../secretary/secretary.model.js";

// @desc    Get all sessions with approved memorandums (for director review)
// @route   GET /api/director/pending-sessions
// @access  Director
export const getPendingSessions = asyncHandler(async (req, res) => {
  // Fetch all non-archived cases (we'll filter sessions in JS to ensure array conditions match correctly)
  const cases = await Case.find({ archived: false })
    .populate("clientId", "name contactNumber email")
    .populate("assignedLawyer", "name email")
    .populate("approvingLawyer", "name email")
    .populate("secretary", "name email")
    .populate("sessions.reviewedBy", "name email")
    .populate("sessions.memorandum.preparedBy", "name email")
    .populate("sessions.directorApproval.approvedBy", "name email");

  const pendingSessions = [];

  cases.forEach((caseItem) => {
    if (caseItem.sessions && caseItem.sessions.length > 0) {
      caseItem.sessions.forEach((session) => {
        // Show sessions either with approved memorandum OR explicitly marked as pending signature,
        // and ensure not yet marked ready for submission
        const memoStatus = (session.memorandum?.status || "").toString().toLowerCase();
        const isApprovedMemo = memoStatus === "approved";
        const isSubmittedMemo = memoStatus === "submitted";
        const isPendingSignatureStatus = (session.status || "").toString().toUpperCase() === "PENDING_SIGNATURE";

        if ((isApprovedMemo || isPendingSignatureStatus || isSubmittedMemo) && !session.isReadyForSubmission) {
          pendingSessions.push({
            session,
            case: {
              _id: caseItem._id,
              caseNumber: caseItem.caseNumber,
              caseType: caseItem.caseType,
              clientId: caseItem.clientId,
              assignedLawyer: caseItem.assignedLawyer,
              approvingLawyer: caseItem.approvingLawyer,
              secretary: caseItem.secretary,
            },
          });
        }
      });
    }
  });

  res.status(200).json({
    success: true,
    data: pendingSessions,
    count: pendingSessions.length,
  });
});

// @desc    Director approves session and marks ready for submission
// @route   POST /api/director/cases/:caseId/sessions/:sessionId/approve
// @access  Director
export const approveSessionForSubmission = asyncHandler(async (req, res) => {
  const { caseId, sessionId } = req.params;
  const { signatureUrl, additionalDocuments, notes } = req.body;

  const caseData = await Case.findById(caseId);
  if (!caseData) {
    throw new customError("Case not found", 404);
  }

  const session = caseData.sessions.id(sessionId);
  if (!session) {
    throw new customError("Session not found", 404);
  }

  // Check if memorandum is approved
  if (session.memorandum?.status !== "APPROVED") {
    throw new customError(
      "Cannot approve session: Memorandum must be approved first",
      400
    );
  }

  // Set director approval
  session.directorApproval = {
    approvedBy: req.user._id,
    approvedAt: new Date(),
    signatureUrl: signatureUrl || "",
    additionalDocuments: additionalDocuments || [],
    notes: notes || "",
  };

  session.isReadyForSubmission = true;
  // Unlock the session for the assigned draft lawyer so they can complete it
  try {
    if (caseData.assignedLawyer) {
      session.isLocked = false;
      session.unlockedFor = caseData.assignedLawyer;
    }
  } catch (err) {
    // ignore if assignedLawyer missing
  }

  session.updatedAt = new Date();

  await caseData.save();

  res.status(200).json({
    success: true,
    message: "Session approved and marked ready for submission",
    data: session,
  });
});

// @desc    Debug: get all session summaries (director only) - useful for local debugging
// @route   GET /api/director/debug-sessions
// @access  Director
export const getAllSessionsSummary = asyncHandler(async (req, res) => {
  const cases = await Case.find({ archived: false })
    .select('caseNumber sessions')
    .lean();

  const summaries = [];
  cases.forEach(c => {
    (c.sessions || []).forEach(s => {
      summaries.push({
        caseNumber: c.caseNumber,
        sessionId: s._id,
        sessionNumber: s.sessionNumber,
        sessionStatus: s.status,
        memorandumStatus: s.memorandum?.status || null,
        isLocked: s.isLocked || false,
        isReadyForSubmission: s.isReadyForSubmission || false,
        unlockedFor: s.unlockedFor || null,
        createdAt: s.createdAt || null,
      });
    });
  });

  res.status(200).json({ success: true, data: summaries, count: summaries.length });
});
