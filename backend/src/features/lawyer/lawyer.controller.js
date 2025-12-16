import { Case, ActivityLog, Reminder } from "../secretary/secretary.model.js";
import User from "../auth/User.model.js";
import { asyncHandler } from "../../middleware/asyncHandler.js";
import { customError } from "../../utils/customError.js";

export const getAssignedCases = asyncHandler(async (req, res) => {
  const { page = 1, limit = 10, status, search } = req.query;

  // Build base query to include both assignedLawyer and approvingLawyer
  const query = {
    $or: [{ assignedLawyer: req.user._id }, { approvingLawyer: req.user._id }],
    archived: false,
  };

  if (status) query.status = status;
  if (search) {
    query.$and = [
      {
        $or: [
          { caseNumber: { $regex: search, $options: "i" } },
          { caseType: { $regex: search, $options: "i" } },
        ],
      },
    ];
  }

  const cases = await Case.find(query)
    .populate("clientId", "name contactNumber email")
    .populate("secretary", "name email")
    .populate("assignedLawyer", "name email")
    .populate("approvingLawyer", "name email")
    .limit(limit * 1)
    .skip((page - 1) * limit)
    .sort({ assignedAt: -1 });

  const count = await Case.countDocuments(query);

  res.status(200).json({
    success: true,
    data: cases,
    totalPages: Math.ceil(count / limit),
    currentPage: page,
  });
});

export const getCaseById = asyncHandler(async (req, res) => {
  const caseData = await Case.findById(req.params.id)
    .populate("clientId")
    .populate("assignedLawyer", "name email phone")
    .populate("approvingLawyer", "name email phone")
    .populate("secretary", "name email")
    .populate("directorSignature.signedBy", "name email");

  if (!caseData) {
    throw new customError("Case not found", 404);
  }

  if (
    caseData.assignedLawyer?._id.toString() !== req.user._id.toString() &&
    caseData.approvingLawyer?._id.toString() !== req.user._id.toString()
  ) {
    throw new customError("Not authorized to view this case", 403);
  }

  res.status(200).json({ success: true, data: caseData });
});

export const acceptCase = asyncHandler(async (req, res) => {
  const caseData = await Case.findById(req.params.id);

  if (!caseData) {
    throw new customError("Case not found", 404);
  }

  if (caseData.assignedLawyer?.toString() !== req.user._id.toString()) {
    throw new customError("Not authorized to accept this case", 403);
  }

  if (caseData.status !== "Assigned") {
    throw new customError("Case cannot be accepted at this stage", 400);
  }

  caseData.status = "UnderReview";
  await caseData.save();

  await ActivityLog.create({
    caseId: caseData._id,
    userId: req.user._id,
    action: "CASE_ACCEPTED",
    description: `Lawyer ${req.user.name} accepted case ${caseData.caseNumber}`,
  });

  res.status(200).json({
    success: true,
    message: "Case accepted successfully",
    data: caseData,
  });
});

export const submitMemorandum = asyncHandler(async (req, res) => {
  const { stageIndex, content, fileUrl } = req.body;

  const caseData = await Case.findById(req.params.id);

  if (!caseData) {
    throw new customError("Case not found", 404);
  }

  if (caseData.assignedLawyer?.toString() !== req.user._id.toString()) {
    throw new customError("Not authorized to submit memorandum", 403);
  }

  if (!caseData.stages[stageIndex]) {
    throw new customError("Stage not found", 404);
  }

  caseData.stages[stageIndex].memorandum = {
    content,
    fileUrl,
    preparedBy: req.user._id,
    preparedAt: new Date(),
    status: "Pending",
  };

  caseData.status = "PendingApproval";
  await caseData.save();

  await ActivityLog.create({
    caseId: caseData._id,
    userId: req.user._id,
    action: "MEMORANDUM_SUBMITTED",
    description: `Memorandum submitted for stage ${stageIndex + 1} of case ${
      caseData.caseNumber
    }`,
  });

  res.status(200).json({
    success: true,
    message: "Memorandum submitted successfully",
    data: caseData,
  });
});

export const uploadMemorandumFile = asyncHandler(async (req, res) => {
  try {
    let { stageIndex, content } = req.body;

    if (stageIndex === undefined || stageIndex === null || stageIndex === "") {
      throw new customError("Stage index is required", 400);
    }

    // Convert stageIndex to number
    stageIndex = parseInt(stageIndex);
    if (isNaN(stageIndex)) {
      throw new customError("Stage index must be a valid number", 400);
    }

    const caseData = await Case.findById(req.params.id);

    if (!caseData) {
      throw new customError("Case not found", 404);
    }

    if (caseData.assignedLawyer?.toString() !== req.user._id.toString()) {
      throw new customError("Not authorized to submit memorandum", 403);
    }

    console.log(
      "📋 Case stages:",
      caseData.stages.length,
      "Stage index:",
      stageIndex
    );

    if (!caseData.stages || caseData.stages.length === 0) {
      throw new customError("Case has no stages", 400);
    }

    if (stageIndex < 0 || stageIndex >= caseData.stages.length) {
      throw new customError(
        `Stage ${stageIndex} not found. Case has ${caseData.stages.length} stage(s)`,
        404
      );
    }

    if (!req.file) {
      throw new customError("No file uploaded", 400);
    }

    console.log(
      "📄 Uploading memorandum file:",
      req.file.originalname,
      req.file.path
    );

    caseData.stages[stageIndex].memorandum = {
      content: content || "",
      fileUrl: req.file.path,
      preparedBy: req.user._id,
      preparedAt: new Date(),
      status: "Pending",
    };

    caseData.status = "PendingApproval";

    // Mark the stages path as modified for Mongoose
    caseData.markModified("stages");

    await caseData.save({ validateBeforeSave: false });
    console.log("✅ Memorandum saved to database");

    await ActivityLog.create({
      caseId: caseData._id,
      userId: req.user._id,
      action: "MEMORANDUM_SUBMITTED",
      description: `Memorandum file submitted for stage ${
        parseInt(stageIndex) + 1
      } of case ${caseData.caseNumber}`,
    });

    res.status(200).json({
      success: true,
      message: "Memorandum uploaded successfully",
      data: caseData,
    });
  } catch (error) {
    console.error("❌ Upload Memorandum Error:", {
      message: error.message,
      stack: error.stack,
      name: error.name,
      errors: error.errors,
    });
    throw error;
  }
});

export const uploadCaseDocuments = asyncHandler(async (req, res) => {
  try {
    console.log("📤 Upload Documents Request:", {
      caseId: req.params.id,
      stageIndex: req.body.stageIndex,
      filesCount: req.files?.length || 0,
      userId: req.user?._id,
    });

    let { stageIndex } = req.body;

    if (stageIndex === undefined || stageIndex === null || stageIndex === "") {
      throw new customError("Stage index is required", 400);
    }

    // Convert stageIndex to number
    stageIndex = parseInt(stageIndex);
    if (isNaN(stageIndex)) {
      throw new customError("Stage index must be a valid number", 400);
    }

    const caseData = await Case.findById(req.params.id);

    if (!caseData) {
      throw new customError("Case not found", 404);
    }

    if (caseData.assignedLawyer?.toString() !== req.user._id.toString()) {
      throw new customError("Not authorized to upload documents", 403);
    }

    console.log(
      "📋 Case stages:",
      caseData.stages.length,
      "Stage index:",
      stageIndex
    );

    if (!caseData.stages || caseData.stages.length === 0) {
      throw new customError("Case has no stages", 400);
    }

    if (stageIndex < 0 || stageIndex >= caseData.stages.length) {
      throw new customError(
        `Stage ${stageIndex} not found. Case has ${caseData.stages.length} stage(s)`,
        404
      );
    }

    if (!req.files || req.files.length === 0) {
      throw new customError("No files uploaded", 400);
    }

    // Initialize documents array if it doesn't exist
    if (!caseData.stages[stageIndex].documents) {
      caseData.stages[stageIndex].documents = [];
      console.log("📁 Initialized documents array for stage", stageIndex);
    }

    // Add each uploaded file to the stage documents
    req.files.forEach((file) => {
      console.log("📄 Processing file:", file.originalname, file.path);
      const newDoc = {
        name: file.originalname,
        url: file.path,
        uploadedBy: req.user._id,
        uploadedAt: new Date(),
      };
      console.log("📄 Adding document:", newDoc);
      caseData.stages[stageIndex].documents.push(newDoc);
    });

    console.log(
      "💾 About to save. Stage documents count:",
      caseData.stages[stageIndex].documents.length
    );
    console.log(
      "💾 Stage structure:",
      JSON.stringify(caseData.stages[stageIndex], null, 2)
    );

    // Mark the stages path as modified for Mongoose
    caseData.markModified("stages");

    await caseData.save({ validateBeforeSave: false });
    console.log("✅ Documents saved to database");

    await ActivityLog.create({
      caseId: caseData._id,
      userId: req.user._id,
      action: "DOCUMENTS_UPLOADED",
      description: `${req.files.length} document(s) uploaded for stage ${
        parseInt(stageIndex) + 1
      } of case ${caseData.caseNumber}`,
    });

    res.status(200).json({
      success: true,
      message: "Documents uploaded successfully",
      data: caseData,
    });
  } catch (error) {
    console.error("❌ Upload Documents Error:", {
      message: error.message,
      stack: error.stack,
      name: error.name,
      errors: error.errors,
    });
    throw error;
  }
});

export const updateMemorandum = asyncHandler(async (req, res) => {
  const { stageIndex, content, fileUrl } = req.body;

  const caseData = await Case.findById(req.params.id);

  if (!caseData) {
    throw new customError("Case not found", 404);
  }

  if (caseData.assignedLawyer?.toString() !== req.user._id.toString()) {
    throw new customError("Not authorized to update memorandum", 403);
  }

  if (!caseData.stages[stageIndex]) {
    throw new customError("Stage not found", 404);
  }

  if (!caseData.stages[stageIndex].memorandum) {
    throw new customError("No memorandum found for this stage", 404);
  }

  if (caseData.stages[stageIndex].memorandum.status === "Approved") {
    throw new customError("Cannot update approved memorandum", 400);
  }

  if (content) caseData.stages[stageIndex].memorandum.content = content;
  if (fileUrl) caseData.stages[stageIndex].memorandum.fileUrl = fileUrl;
  caseData.stages[stageIndex].memorandum.preparedAt = new Date();
  caseData.stages[stageIndex].memorandum.status = "Pending";

  await caseData.save();

  await ActivityLog.create({
    caseId: caseData._id,
    userId: req.user._id,
    action: "MEMORANDUM_UPDATED",
    description: `Memorandum updated for stage ${stageIndex + 1} of case ${
      caseData.caseNumber
    }`,
  });

  res.status(200).json({
    success: true,
    message: "Memorandum updated successfully",
    data: caseData,
  });
});

export const approveMemorandum = asyncHandler(async (req, res) => {
  const { stageIndex } = req.body;

  const caseData = await Case.findById(req.params.id);

  if (!caseData) {
    throw new customError("Case not found", 404);
  }

  if (caseData.approvingLawyer?.toString() !== req.user._id.toString()) {
    throw new customError("Not authorized to approve memorandum", 403);
  }

  if (!caseData.stages[stageIndex]) {
    throw new customError("Stage not found", 404);
  }

  if (!caseData.stages[stageIndex].memorandum) {
    throw new customError("No memorandum found for this stage", 404);
  }

  if (caseData.stages[stageIndex].memorandum.status === "Approved") {
    throw new customError("Memorandum already approved", 400);
  }

  caseData.stages[stageIndex].memorandum.status = "Approved";
  caseData.stages[stageIndex].memorandum.approvedBy = req.user._id;
  caseData.stages[stageIndex].memorandum.approvedAt = new Date();
  caseData.stages[stageIndex].status = "Approved";
  caseData.status = "Approved";

  await caseData.save();

  await ActivityLog.create({
    caseId: caseData._id,
    userId: req.user._id,
    action: "MEMORANDUM_APPROVED",
    description: `Memorandum approved for stage ${stageIndex + 1} of case ${
      caseData.caseNumber
    } by ${req.user.name}`,
  });

  res.status(200).json({
    success: true,
    message: "Memorandum approved successfully",
    data: caseData,
  });
});

export const rejectMemorandum = asyncHandler(async (req, res) => {
  const { stageIndex, feedback } = req.body;

  const caseData = await Case.findById(req.params.id);

  if (!caseData) {
    throw new customError("Case not found", 404);
  }

  if (caseData.approvingLawyer?.toString() !== req.user._id.toString()) {
    throw new customError("Not authorized to reject memorandum", 403);
  }

  if (!caseData.stages[stageIndex]) {
    throw new customError("Stage not found", 404);
  }

  if (!caseData.stages[stageIndex].memorandum) {
    throw new customError("No memorandum found for this stage", 404);
  }

  if (!feedback || feedback.trim().length === 0) {
    throw new customError("Feedback is required for rejection", 400);
  }

  caseData.stages[stageIndex].memorandum.status = "Rejected";
  caseData.stages[stageIndex].memorandum.feedback = feedback;
  caseData.status = "UnderReview";

  await caseData.save();

  await ActivityLog.create({
    caseId: caseData._id,
    userId: req.user._id,
    action: "MEMORANDUM_REJECTED",
    description: `Memorandum rejected for stage ${stageIndex + 1} of case ${
      caseData.caseNumber
    }`,
  });

  res.status(200).json({
    success: true,
    message: "Memorandum rejected with feedback",
    data: caseData,
  });
});

export const getPendingApprovals = asyncHandler(async (req, res) => {
  const { page = 1, limit = 10 } = req.query;

  const query = {
    approvingLawyer: req.user._id,
    status: {
      $in: ["Assigned", "UnderReview", "PendingApproval", "PendingSignature"],
    },
    archived: false,
  };

  const cases = await Case.find(query)
    .populate("clientId", "name contactNumber email")
    .populate("assignedLawyer", "name email")
    .populate("approvingLawyer", "name email")
    .populate("secretary", "name email")
    .limit(limit * 1)
    .skip((page - 1) * limit)
    .sort({ updatedAt: -1 });

  const count = await Case.countDocuments(query);

  res.status(200).json({
    success: true,
    data: cases,
    totalPages: Math.ceil(count / limit),
    currentPage: page,
  });
});

export const updateStatusPendingSignature = asyncHandler(async (req, res) => {
  const caseData = await Case.findById(req.params.id);

  if (!caseData) {
    throw new customError("Case not found", 404);
  }
  caseData.status = req.body.status || "PendingSignature";
  await caseData.save();
  res.status(200).json({
    success: true,
    message: "Case status updated to Pending Signature",
    data: caseData,
  });
});

export const requestModificationBAL = asyncHandler(async (req, res) => {
  const { note } = req.body;
  const caseData = await Case.findById(req.params.id);
  if (!caseData) {
    throw new customError("Case not found", 404);
  }
  caseData.status = "UnderReview";
  caseData.modificationRequests.push({
    requestedBy: req.user._id,
    note,
    requestedAt: new Date(),
  });
  await caseData.save();
  res.status(200).json({
    success: true,
    message: "Modification request sent to lawyer",
    data: caseData,
  });
});

export const getMyArchive = asyncHandler(async (req, res) => {
  const { page = 1, limit = 10, search } = req.query;

  const query = {
    $or: [{ assignedLawyer: req.user._id }, { approvingLawyer: req.user._id }],
    archived: true,
  };

  if (search) {
    query.$and = [
      {
        $or: [
          { caseNumber: { $regex: search, $options: "i" } },
          { caseType: { $regex: search, $options: "i" } },
        ],
      },
    ];
  }

  const cases = await Case.find(query)
    .populate("clientId", "name contactNumber")
    .populate("assignedLawyer", "name email")
    .populate("approvingLawyer", "name email")
    .populate("archivedBy", "name email")
    .limit(limit * 1)
    .skip((page - 1) * limit)
    .sort({ archivedAt: -1 });

  const count = await Case.countDocuments(query);

  res.status(200).json({
    success: true,
    data: cases,
    totalPages: Math.ceil(count / limit),
    currentPage: page,
  });
});

export const getUpcomingHearings = asyncHandler(async (req, res) => {
  const cases = await Case.find({
    $or: [{ assignedLawyer: req.user._id }, { approvingLawyer: req.user._id }],
    archived: false,
  }).populate("clientId", "name contactNumber");

  const upcomingHearings = [];

  cases.forEach((caseData) => {
    caseData.stages.forEach((stage, index) => {
      if (stage.hearingDate && new Date(stage.hearingDate) >= new Date()) {
        upcomingHearings.push({
          caseId: caseData._id,
          caseNumber: caseData.caseNumber,
          caseType: caseData.caseType,
          clientName: caseData.clientId?.name,
          stageType: stage.stageType,
          stageNumber: stage.stageNumber,
          hearingDate: stage.hearingDate,
          hearingTime: stage.hearingTime,
        });
      }
    });
  });

  upcomingHearings.sort(
    (a, b) => new Date(a.hearingDate) - new Date(b.hearingDate)
  );

  res.status(200).json({
    success: true,
    data: upcomingHearings,
  });
});

export const getDashboardStats = asyncHandler(async (req, res) => {
  const totalAssigned = await Case.countDocuments({
    assignedLawyer: req.user._id,
    archived: false,
  });

  const underReview = await Case.countDocuments({
    assignedLawyer: req.user._id,
    status: "UnderReview",
    archived: false,
  });

  const pendingApproval = await Case.countDocuments({
    assignedLawyer: req.user._id,
    status: "PendingApproval",
    archived: false,
  });

  const approved = await Case.countDocuments({
    assignedLawyer: req.user._id,
    status: "Approved",
    archived: false,
  });

  const pendingMyApproval = await Case.countDocuments({
    approvingLawyer: req.user._id,
    status: "PendingApproval",
    archived: false,
  });

  const cases = await Case.find({
    $or: [{ assignedLawyer: req.user._id }, { approvingLawyer: req.user._id }],
    archived: false,
  }).populate("clientId", "name");

  const upcomingHearings = [];
  cases.forEach((caseData) => {
    caseData.stages.forEach((stage) => {
      if (stage.hearingDate && new Date(stage.hearingDate) >= new Date()) {
        upcomingHearings.push({
          caseNumber: caseData.caseNumber,
          clientName: caseData.clientId?.name,
          stageType: stage.stageType,
          hearingDate: stage.hearingDate,
          hearingTime: stage.hearingTime,
        });
      }
    });
  });

  upcomingHearings.sort(
    (a, b) => new Date(a.hearingDate) - new Date(b.hearingDate)
  );

  const recentActivity = await ActivityLog.find({
    userId: req.user._id,
  })
    .populate("caseId", "caseNumber")
    .sort({ timestamp: -1 })
    .limit(10);

  res.status(200).json({
    success: true,
    data: {
      totalAssigned,
      underReview,
      pendingApproval,
      approved,
      pendingMyApproval,
      upcomingHearings: upcomingHearings.slice(0, 5),
      recentActivity,
    },
  });
});

export const addCaseNote = asyncHandler(async (req, res) => {
  const { note } = req.body;

  const caseData = await Case.findById(req.params.id);

  if (!caseData) {
    throw new customError("Case not found", 404);
  }

  if (
    caseData.assignedLawyer?.toString() !== req.user._id.toString() &&
    caseData.approvingLawyer?.toString() !== req.user._id.toString()
  ) {
    throw new customError("Not authorized to add note", 403);
  }

  caseData.notes.push({
    text: note,
    addedBy: req.user._id,
  });

  await caseData.save();

  res.status(200).json({
    success: true,
    message: "Note added successfully",
    data: caseData,
  });
});

export const deleteCase = asyncHandler(async (req, res) => {
  const caseData = await Case.findById(req.params.id);

  if (!caseData) {
    throw new customError("Case not found", 404);
  }

  // Check if the lawyer is assigned to this case
  if (
    caseData.assignedLawyer?.toString() !== req.user._id.toString() &&
    caseData.approvingLawyer?.toString() !== req.user._id.toString()
  ) {
    throw new customError("Not authorized to delete this case", 403);
  }

  // Optional: Prevent deletion of archived cases
  if (caseData.archived) {
    throw new customError(
      "Cannot delete archived case. Unarchive it first.",
      400
    );
  }

  await Case.findByIdAndDelete(req.params.id);

  await ActivityLog.create({
    caseId: req.params.id,
    userId: req.user._id,
    action: "CASE_DELETED",
    description: `Case ${caseData.caseNumber} deleted by lawyer`,
  });

  res.status(200).json({
    success: true,
    message: "Case deleted successfully",
  });
});

export const getMyReminders = asyncHandler(async (req, res) => {
  const { upcoming } = req.query;

  const query = {
    recipients: req.user._id,
  };

  if (upcoming === "true") {
    query.reminderDate = { $gte: new Date() };
    query.sent = false;
  }

  const reminders = await Reminder.find(query)
    .populate("caseId", "caseNumber caseType")
    .sort({ reminderDate: 1 });

  res.status(200).json({
    success: true,
    data: reminders,
  });
});

export const getCaseTimeline = asyncHandler(async (req, res) => {
  const caseData = await Case.findById(req.params.id);

  if (!caseData) {
    throw new customError("Case not found", 404);
  }

  if (
    caseData.assignedLawyer?.toString() !== req.user._id.toString() &&
    caseData.approvingLawyer?.toString() !== req.user._id.toString()
  ) {
    throw new customError("Not authorized to view this case", 403);
  }

  const activities = await ActivityLog.find({
    caseId: req.params.id,
  })
    .populate("userId", "name email")
    .sort({ timestamp: 1 });

  res.status(200).json({
    success: true,
    data: activities,
  });
});

export const getAllLawyers = asyncHandler(async (req, res) => {
  const lawyers = await User.find({
    role: "lawyer",
    status: "active",
  }).select("name email phone");

  res.status(200).json({
    success: true,
    data: lawyers,
  });
});

export const getNotifications = asyncHandler(async (req, res) => {
  const { type, stage, status } = req.query;

  // Get all cases for this lawyer
  const cases = await Case.find({
    $or: [{ assignedLawyer: req.user._id }, { approvingLawyer: req.user._id }],
    archived: false,
  })
    .populate("clientId", "name")
    .populate("assignedLawyer", "name")
    .populate("approvingLawyer", "name")
    .sort({ updatedAt: -1 });

  const notifications = [];
  let notificationId = 1;

  for (const caseData of cases) {
    // New Assignment Notifications
    if (
      caseData.status === "Assigned" &&
      caseData.assignedLawyer?._id.toString() === req.user._id.toString()
    ) {
      notifications.push({
        id: notificationId++,
        caseId: caseData._id,
        caseNumber: caseData.caseNumber,
        clientName: caseData.clientId?.name || "Unknown",
        caseType: caseData.caseType,
        stage: "Main",
        type: "New Assignment",
        message: "New client case assigned for your review.",
        status: "unread",
        timestamp: caseData.assignedAt || caseData.createdAt,
      });
    }

    // Process each stage for various notifications
    for (const [index, stage] of caseData.stages.entries()) {
      const stageName = stage.stageType || `Stage ${index + 1}`;

      // Upload Reminder - if memorandum is not submitted or rejected
      if (
        caseData.assignedLawyer?._id.toString() === req.user._id.toString() &&
        (!stage.memorandum ||
          stage.memorandum.status === "Rejected" ||
          stage.status === "Pending")
      ) {
        notifications.push({
          id: notificationId++,
          caseId: caseData._id,
          caseNumber: caseData.caseNumber,
          clientName: caseData.clientId?.name || "Unknown",
          caseType: caseData.caseType,
          stage: stageName,
          type: "Upload Reminder",
          message: `Upload memorandum for ${stageName} stage.`,
          status: stage.memorandum?.status === "Rejected" ? "unread" : "read",
          timestamp: stage.memorandum?.preparedAt || caseData.updatedAt,
        });
      }

      // Ragab Feedback - if memorandum was approved or rejected
      if (
        caseData.assignedLawyer?._id.toString() === req.user._id.toString() &&
        stage.memorandum &&
        (stage.memorandum.status === "Approved" ||
          stage.memorandum.status === "Rejected")
      ) {
        const isApproved = stage.memorandum.status === "Approved";
        notifications.push({
          id: notificationId++,
          caseId: caseData._id,
          caseNumber: caseData.caseNumber,
          clientName: caseData.clientId?.name || "Unknown",
          caseType: caseData.caseType,
          stage: stageName,
          type: "Ragab Feedback",
          message: isApproved
            ? `Ragab approved your memorandum for ${stageName} stage.`
            : `Ragab requested changes to your ${stageName} memorandum.`,
          status: isApproved ? "read" : "unread",
          timestamp: stage.memorandum.approvedAt || caseData.updatedAt,
          feedback: stage.memorandum.feedback,
        });
      }

      // Hearing Reminders - upcoming hearings within 7 days
      if (stage.hearingDate) {
        const hearingDate = new Date(stage.hearingDate);
        const today = new Date();
        const daysUntil = Math.ceil(
          (hearingDate - today) / (1000 * 60 * 60 * 24)
        );

        if (daysUntil >= 0 && daysUntil <= 7) {
          notifications.push({
            id: notificationId++,
            caseId: caseData._id,
            caseNumber: caseData.caseNumber,
            clientName: caseData.clientId?.name || "Unknown",
            caseType: caseData.caseType,
            stage: stageName,
            type: "Hearing Reminder",
            message:
              daysUntil === 0
                ? `Hearing for ${stageName} stage is today!`
                : `Hearing for ${stageName} stage in ${daysUntil} day${
                    daysUntil > 1 ? "s" : ""
                  }.`,
            status: daysUntil <= 3 ? "unread" : "read",
            timestamp: hearingDate,
            daysUntil,
          });
        }
      }
    }
  }

  // Apply filters
  let filteredNotifications = notifications;

  if (type) {
    filteredNotifications = filteredNotifications.filter(
      (n) => n.type === type
    );
  }

  if (stage) {
    filteredNotifications = filteredNotifications.filter(
      (n) => n.stage === stage
    );
  }

  if (status) {
    filteredNotifications = filteredNotifications.filter(
      (n) => n.status === status
    );
  }

  // Sort by timestamp (newest first)
  filteredNotifications.sort(
    (a, b) => new Date(b.timestamp) - new Date(a.timestamp)
  );

  res.status(200).json({
    success: true,
    data: filteredNotifications,
    total: filteredNotifications.length,
    unreadCount: filteredNotifications.filter((n) => n.status === "unread")
      .length,
  });
});

export const markNotificationAsRead = asyncHandler(async (req, res) => {
  // Since notifications are generated dynamically, we'll just return success
  // In a real-world scenario, you'd store notification read status in the database
  res.status(200).json({
    success: true,
    message: "Notification marked as read",
  });
});
