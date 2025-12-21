import { asyncHandler } from "../../middleware/asyncHandler.js";
import { customError } from "../../utils/customError.js";
import { Case } from "./secretary.model.js";

// @desc    Create a new session for a case
// @route   POST /api/secretary/cases/:caseId/sessions
// @access  Secretary
export const createSession = asyncHandler(async (req, res) => {
  const { caseId } = req.params;
  const { sessionDate, sessionTime, location, notes } = req.body;

  const caseData = await Case.findById(caseId);
  if (!caseData) {
    throw new customError("Case not found", 404);
  }

  // Check if user is the secretary of this case
  if (caseData.secretary.toString() !== req.user._id.toString()) {
    throw new customError("Only the assigned secretary can create sessions", 403);
  }

  // Check if there are existing sessions
  if (caseData.sessions && caseData.sessions.length > 0) {
    // Get the last session
    const lastSession = caseData.sessions[caseData.sessions.length - 1];

    // Check if last session is completed or cancelled
    if (lastSession.status !== "COMPLETED" && lastSession.status !== "CANCELLED") {
      throw new customError(
        "Cannot create new session. Please complete or cancel the previous session first.",
        400
      );
    }
  }

  // Calculate next session number
  const sessionNumber = (caseData.sessions?.length || 0) + 1;

  // Create new session
  const newSession = {
    sessionNumber,
    sessionDate,
    sessionTime,
    location,
    notes,
    status: "UPCOMING",
    isLocked: true, // Locked until approving lawyer reviews
    createdBy: req.user._id,
    createdAt: new Date(),
  };

  caseData.sessions.push(newSession);
  await caseData.save();

  res.status(201).json({
    success: true,
    message: "Session created successfully",
    data: caseData.sessions[caseData.sessions.length - 1],
  });
});

// @desc    Get all sessions for a case
// @route   GET /api/secretary/cases/:caseId/sessions
// @access  Secretary, Lawyer, Approving Lawyer
export const getSessions = asyncHandler(async (req, res) => {
  const { caseId } = req.params;

  const caseData = await Case.findById(caseId)
    .populate("sessions.createdBy", "name email")
    .populate("sessions.reviewedBy", "name email")
    .populate("sessions.unlockedFor", "name email")
    .populate("sessions.memorandum.preparedBy", "name email");

  if (!caseData) {
    throw new customError("Case not found", 404);
  }

  res.status(200).json({
    success: true,
    data: caseData.sessions,
  });
});

// @desc    Get sessions assigned to draft lawyer (unlocked sessions only)
// @route   GET /api/lawyer/my-sessions
// @access  Draft Lawyer
export const getMyAssignedSessions = asyncHandler(async (req, res) => {
  // Find all cases assigned to this lawyer
  const cases = await Case.find({
    assignedLawyer: req.user._id,
    archived: false,
  })
    .populate("clientId", "name contactNumber email")
    .populate("secretary", "name email")
    .populate("approvingLawyer", "name email")
    .populate("sessions.reviewedBy", "name email")
    .populate("sessions.completedBy", "name email");

  // Extract sessions that are unlocked for this lawyer
  const mySessions = [];

  cases.forEach((caseItem) => {
    if (caseItem.sessions && caseItem.sessions.length > 0) {
      caseItem.sessions.forEach((session) => {
        // Only show sessions that are unlocked for this lawyer OR sessions that are marked ready for submission and assigned to this lawyer
        const unlockedForThisLawyer = session.unlockedFor && session.unlockedFor.toString() === req.user._id.toString() && !session.isLocked;
        const readyForThisLawyer = session.isReadyForSubmission && caseItem.assignedLawyer && caseItem.assignedLawyer.toString() === req.user._id.toString();

        if (unlockedForThisLawyer || readyForThisLawyer) {
          mySessions.push({
            session,
            case: {
              _id: caseItem._id,
              caseNumber: caseItem.caseNumber,
              caseType: caseItem.caseType,
              clientId: caseItem.clientId,
              secretary: caseItem.secretary,
              approvingLawyer: caseItem.approvingLawyer,
            },
          });
        }
      });
    }
  });

  res.status(200).json({
    success: true,
    data: mySessions,
    count: mySessions.length,
  });
});

// @desc    Update a session
// @route   PUT /api/secretary/cases/:caseId/sessions/:sessionId
// @access  Secretary
export const updateSession = asyncHandler(async (req, res) => {
  const { caseId, sessionId } = req.params;
  const { sessionDate, sessionTime, location, notes, status } = req.body;

  const caseData = await Case.findById(caseId);
  if (!caseData) {
    throw new customError("Case not found", 404);
  }

  // Check if user is the secretary of this case
  if (caseData.secretary.toString() !== req.user._id.toString()) {
    throw new customError("Only the assigned secretary can update sessions", 403);
  }

  const session = caseData.sessions.id(sessionId);
  if (!session) {
    throw new customError("Session not found", 404);
  }

  // Update session fields
  if (sessionDate) session.sessionDate = sessionDate;
  if (sessionTime) session.sessionTime = sessionTime;
  if (location) session.location = location;
  if (notes) session.notes = notes;
  if (status) session.status = status;
  session.updatedAt = new Date();

  await caseData.save();

  res.status(200).json({
    success: true,
    message: "Session updated successfully",
    data: session,
  });
});

// @desc    Delete a session
// @route   DELETE /api/secretary/cases/:caseId/sessions/:sessionId
// @access  Secretary
export const deleteSession = asyncHandler(async (req, res) => {
  const { caseId, sessionId } = req.params;

  const caseData = await Case.findById(caseId);
  if (!caseData) {
    throw new customError("Case not found", 404);
  }

  // Check if user is the secretary of this case
  if (caseData.secretary.toString() !== req.user._id.toString()) {
    throw new customError("Only the assigned secretary can delete sessions", 403);
  }

  const session = caseData.sessions.id(sessionId);
  if (!session) {
    throw new customError("Session not found", 404);
  }

  // Remove session
  caseData.sessions.pull(sessionId);
  await caseData.save();

  res.status(200).json({
    success: true,
    message: "Session deleted successfully",
  });
});

// @desc    Approving Lawyer reviews session and sets requirements
// @route   POST /api/lawyer/cases/:caseId/sessions/:sessionId/review
// @access  Approving Lawyer
export const reviewSession = asyncHandler(async (req, res) => {
  const { caseId, sessionId } = req.params;
  const { memorandumRequired, supportingDocumentsRequired, reviewNotes } = req.body;

  const caseData = await Case.findById(caseId);
  if (!caseData) {
    throw new customError("Case not found", 404);
  }

  // Check if user is the approving lawyer of this case
  if (caseData.approvingLawyer.toString() !== req.user._id.toString()) {
    throw new customError("Only the approving lawyer can review sessions", 403);
  }

  const session = caseData.sessions.id(sessionId);
  if (!session) {
    throw new customError("Session not found", 404);
  }

  // Set requirements
  session.memorandumRequired = memorandumRequired || false;
  session.supportingDocumentsRequired = supportingDocumentsRequired || false;
  session.reviewedBy = req.user._id;
  session.reviewedAt = new Date();
  session.reviewNotes = reviewNotes;

  // Unlock session for draft lawyer if memorandum is required
  if (memorandumRequired) {
    session.isLocked = false;
    session.unlockedFor = caseData.assignedLawyer;
  }

  session.updatedAt = new Date();
  await caseData.save();

  res.status(200).json({
    success: true,
    message: "Session reviewed and unlocked for draft lawyer",
    data: session,
  });
});

// @desc    Draft Lawyer uploads memorandum for session
// @route   POST /api/lawyer/cases/:caseId/sessions/:sessionId/memorandum
// @access  Draft Lawyer
export const uploadSessionMemorandum = asyncHandler(async (req, res) => {
  const { caseId, sessionId } = req.params;
  const { content, fileUrl } = req.body;

  const caseData = await Case.findById(caseId);
  if (!caseData) {
    throw new customError("Case not found", 404);
  }

  // Check if user is the assigned draft lawyer of this case
  if (caseData.assignedLawyer.toString() !== req.user._id.toString()) {
    throw new customError("Only the assigned draft lawyer can upload memorandum", 403);
  }

  const session = caseData.sessions.id(sessionId);
  if (!session) {
    throw new customError("Session not found", 404);
  }

  // Check if session is unlocked for this lawyer
  if (session.isLocked) {
    throw new customError("Session is locked. Waiting for approving lawyer review.", 403);
  }

  if (session.unlockedFor.toString() !== req.user._id.toString()) {
    throw new customError("You are not authorized to work on this session", 403);
  }

  // Upload memorandum
  session.memorandum.content = content;
  session.memorandum.fileUrl = fileUrl;
  session.memorandum.preparedBy = req.user._id;
  session.memorandum.preparedAt = new Date();
  session.memorandum.status = "SUBMITTED";

  session.updatedAt = new Date();
  await caseData.save();

  res.status(200).json({
    success: true,
    message: "Memorandum submitted successfully",
    data: session,
  });
});

// @desc    Approving Lawyer approves/rejects memorandum
// @route   POST /api/lawyer/cases/:caseId/sessions/:sessionId/memorandum/review
// @access  Approving Lawyer
// @desc    Draft Lawyer completes or cancels session
// @route   POST /api/lawyer/cases/:caseId/sessions/:sessionId/complete
// @access  Draft Lawyer
export const completeSession = asyncHandler(async (req, res) => {
  const { caseId, sessionId } = req.params;
  const { status, outcome, reasonForAdjournment, nextSessionDate } = req.body;
  // status: "COMPLETED" or "CANCELLED"
  // outcome: "ADJOURNED", "FINALIZED", "DISMISSED", etc.

  const caseData = await Case.findById(caseId);
  if (!caseData) {
    throw new customError("Case not found", 404);
  }

  // Check if user is the assigned draft lawyer of this case
  if (caseData.assignedLawyer.toString() !== req.user._id.toString()) {
    throw new customError("Only the assigned draft lawyer can complete sessions", 403);
  }

  const session = caseData.sessions.id(sessionId);
  if (!session) {
    throw new customError("Session not found", 404);
  }

  // Check if session is ready for submission (approved by director)
  if (!session.isReadyForSubmission) {
    throw new customError(
      "Cannot complete session: Session must be approved by director and marked ready for submission",
      403
    );
  }

  // Update session status
  session.status = status; // COMPLETED or CANCELLED
  session.outcome = outcome;
  session.reasonForAdjournment = reasonForAdjournment;
  session.nextSessionDate = nextSessionDate;
  session.completedBy = req.user._id;
  session.completedAt = new Date();
  session.updatedAt = new Date();

  // After completion/cancellation, clear ready/unlock to prevent further edits
  session.isReadyForSubmission = false;
  session.isLocked = true;
  session.unlockedFor = null;

  await caseData.save();

  res.status(200).json({
    success: true,
    message: `Session ${status.toLowerCase()} successfully`,
    data: session,
  });
});

export const reviewMemorandum = asyncHandler(async (req, res) => {
  const { caseId, sessionId } = req.params;
  const { status, feedback } = req.body; // status: "APPROVED" or "REJECTED"

  const caseData = await Case.findById(caseId);
  if (!caseData) {
    throw new customError("Case not found", 404);
  }

  // Check if user is the approving lawyer of this case
  if (caseData.approvingLawyer.toString() !== req.user._id.toString()) {
    throw new customError("Only the approving lawyer can review memorandum", 403);
  }

  const session = caseData.sessions.id(sessionId);
  if (!session) {
    throw new customError("Session not found", 404);
  }

  if (session.memorandum.status !== "SUBMITTED") {
    throw new customError("Memorandum has not been submitted yet", 400);
  }

  // Update memorandum status
  session.memorandum.status = status.toString().toUpperCase();
  session.memorandum.feedback = feedback;

  // If rejected, unlock again for draft lawyer to revise
  if (session.memorandum.status === "REJECTED") {
    session.isLocked = false;
  } else if (session.memorandum.status === "APPROVED") {
    // Lock after approval and mark session pending signature for director
    session.isLocked = true;
    session.status = "PENDING_SIGNATURE"; // session awaits director signature/upload
    session.pendingSignatureAt = new Date();
  }

  session.updatedAt = new Date();
  await caseData.save();

  res.status(200).json({
    success: true,
    message: `Memorandum ${status.toLowerCase()} successfully`,
    data: session,
  });
});

