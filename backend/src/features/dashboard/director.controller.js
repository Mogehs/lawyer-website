import { asyncHandler } from "../../middleware/asyncHandler.js";
import { customError } from "../../utils/customError.js";
import User from "../auth/User.model.js";
import { Case, Reminder } from "../secretary/secretary.model.js";

export const getAllArchivedCases = asyncHandler(async (req, res) => {
  const { page = 1, limit = 10, search } = req.query;
  const query = { archived: true };

  if (search) {
    query.$or = [
      { caseNumber: { $regex: search, $options: "i" } },
      { caseType: { $regex: search, $options: "i" } },
      { "clientId.name": { $regex: search, $options: "i" } },
    ];
  }

  const cases = await Case.find(query)
    .populate("clientId", "name contactNumber")
    .populate("assignedLawyer", "name email")
    .populate("approvingLawyer", "name email")
    .populate("archivedBy", "name email")
    .limit(Number(limit))
    .skip((Number(page) - 1) * Number(limit))
    .sort({ archivedAt: -1 });
  const count = await Case.countDocuments(query);

  res.status(200).json({
    success: true,
    data: cases,
    totalPages: Math.ceil(count / limit),
    currentPage: Number(page),
  });
});

export const getAllReminders = asyncHandler(async (req, res) => {
  const { upcoming } = req.query;

  const query = {};
  if (upcoming === "true") {
    query.reminderDate = { $gte: new Date() };
    query.sent = false;
  }

  const reminders = await Reminder.find(query)
    .populate("caseId", "caseNumber caseType")
    .populate("recipients", "name email")
    .sort({ reminderDate: 1 });

  res.status(200).json({ success: true, data: reminders });
});

export const getAllUsers = asyncHandler(async (req, res) => {
    const { page = 1, limit = 10, search } = req.query;

    const query = {};
    if (search) {
        query.$or = [
            { name: { $regex: search, $options: "i" } },
            { email: { $regex: search, $options: "i" } },
        ];
    }

    const totalUsers = await User.countDocuments(query);

    const users = await User.find(query)
        .limit(Number(limit))
        .skip((page - 1) * Number(limit))
        .sort({ createdAt: -1 });

    res.status(200).json({
        success: true,
        page: Number(page),
        totalPages: Math.ceil(totalUsers / limit),
        totalUsers,
        users,
    });
});

export const updateUserRole = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const { role, status } = req.body;
    console.log(id)
    const user = await User.findById(id);
    if (!user) throw new customError('User not found!', 404);

    if (role) user.role = role;
    if (status) user.status = status;

    await user.save();

    res.status(200).json({
        success: true,
        message: "User updated successfully",
        user: {
            id: user._id,
            role: user.role,
            status: user.status,
        },
    });
});

// Get cases pending director signature
export const getPendingSignatureCases = asyncHandler(async (req, res) => {
  const { page = 1, limit = 10 } = req.query;

  const query = {
    status: "PendingSignature",
    archived: false,
  };

  const cases = await Case.find(query)
    .populate("clientId", "name contactNumber email")
    .populate("assignedLawyer", "name email")
    .populate("approvingLawyer", "name email")
    .populate("secretary", "name email")
    .limit(Number(limit))
    .skip((Number(page) - 1) * Number(limit))
    .sort({ updatedAt: -1 });

  const count = await Case.countDocuments(query);

  res.status(200).json({
    success: true,
    data: cases,
    totalPages: Math.ceil(count / limit),
    currentPage: Number(page),
  });
});

// Approve case and upload signed document (replaces memorandum)
export const approveWithSignedDocument = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { stageIndex } = req.body;

  const caseData = await Case.findById(id);
  if (!caseData) {
    throw new customError("Case not found", 404);
  }

  if (caseData.status !== "PendingSignature") {
    throw new customError("Case is not pending signature", 400);
  }

  if (!req.file) {
    throw new customError("Signed document is required", 400);
  }

  const index = parseInt(stageIndex);
  if (isNaN(index) || index < 0 || index >= caseData.stages.length) {
    throw new customError("Invalid stage index", 400);
  }

  // Replace the memorandum file with signed document
  if (caseData.stages[index].memorandum) {
    caseData.stages[index].memorandum.fileUrl = req.file.path;
    caseData.stages[index].memorandum.status = "Approved";
    caseData.stages[index].memorandum.signedBy = req.user._id;
    caseData.stages[index].memorandum.signedAt = new Date();
  }

  // Update case status to ReadyForSubmission (secretary can submit to court)
  caseData.status = "ReadyForSubmission";

  // Add director signature
  caseData.directorSignature = {
    signedBy: req.user._id,
    signedAt: new Date(),
    signatureUrl: req.file.path,
  };

  caseData.markModified("stages");
  await caseData.save();

  res.status(200).json({
    success: true,
    message: "Case approved and ready for submission",
    data: caseData,
  });
});

export const deleteUser = asyncHandler(async (req, res) => {
    const { id } = req.params;
    console.log(id)
    const user = await User.findById(id);
    if (!user) {
        throw new customError('User not found', 404);
    }
    await User.findByIdAndDelete(id);
    res.status(200).json({ message: "User deleted successfully" });
})

export const addUser = asyncHandler(async (req, res) => {
    const { name, email, phone, password, role } = req.body;

    if (!name || !email || !phone || !password || !role) {
        throw new customError("All fields are required", 400);
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
        throw new customError("User with this email already exists. Please try another email.", 400);
    }

    const isVerified = true;

    const newUser = await User.create({ name, email, phone, password, role, isVerified });

    res.status(201).json({
        success: true,
        message: "User created successfully",
        user: {
            id: newUser._id,
            name: newUser.name,
            email: newUser.email,
            phone: newUser.phone,
            role: newUser.role,
            isVerified: newUser.isVerified
        }
    });
});

export const userStats = asyncHandler(async (req, res) => {
    const totalUsers = await User.countDocuments();
    const lawyers = await User.countDocuments({ role: "lawyer" });
    const approvingLawyers = await User.countDocuments({ role: "approvingLawyer" });
    const activeUsers = await User.countDocuments({ status: "active" });
    res.status(200).json({
        success: true,
        data: {
            totalUsers, lawyers, approvingLawyers, activeUsers
        }
    })
})

export const getAllCases = asyncHandler(async (req, res) => {
  const { page = 1, limit = 10, status, search } = req.query;

  const query = {};
  if (status) query.status = status;
  if (search) {
    query.$or = [
      { caseNumber: { $regex: search, $options: "i" } },
      { caseType: { $regex: search, $options: "i" } },
    ];
  }

  const cases = await Case.find(query)
    .populate("clientId", "name contactNumber email")
    .populate("assignedLawyer", "name email")
    .populate("secretary", "name email")
    .limit(limit * 1)
    .skip((page - 1) * limit)
    .sort({ createdAt: -1 });

  const count = await Case.countDocuments(query);

  res.status(200).json({
    success: true,
    data: cases,
    totalPages: Math.ceil(count / limit),
    currentPage: page,
  });
});

export const getPendingSignature = asyncHandler(async (req, res) => {
  const { page = 1, limit = 10 } = req.query;
  const cases = await Case.find({
    // approvingLawyer: req.user._id,
    status: "PendingSignature",
    archived: false,
  })
    .populate("clientId", "name contactNumber")
    .populate("assignedLawyer", "name email")
    .populate("secretary", "name email")
    .limit(limit * 1)
    .skip((page - 1) * limit)
    .sort({ updatedAt: -1 });

  const count = await Case.countDocuments({
    approvingLawyer: req.user._id,
    status: "PendingApproval",
    archived: false,
  });

  res.status(200).json({
    success: true,
    data: cases,
    totalPages: Math.ceil(count / limit),
    currentPage: page,
  });
});

export const updateStatusReadyForSubmission = asyncHandler(async (req, res) => {
  const caseData = await Case.findById(req.params.id);
  if (!caseData) {
    throw new customError("Case not found", 404);
  }
  caseData.status = req.body.status || "ReadyForSubmission";
  await caseData.save();
  res.status(200).json({
    success: true,
    message: "Case status updated to Pending Signature",
    data: caseData,
  });
})

export const deleteCase = asyncHandler(async (req, res) => {
  const caseData = await Case.findById(req.params.id);
  if (!caseData) {
    throw new customError("Case not found", 404);
  }
  await Case.findByIdAndDelete(req.params.id);
  res.status(200).json({
    success: true,
    message: "Case deleted successfully",
  });
});