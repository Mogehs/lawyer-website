import mongoose from "mongoose";

const documentSchema = new mongoose.Schema({
  name: { type: String, required: true },
  url: { type: String, required: true },
  uploadedAt: { type: Date, default: Date.now },
  uploadedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
});

// Session Schema for court hearings/sessions
const sessionSchema = new mongoose.Schema({
  sessionNumber: { type: Number, required: true },
  sessionDate: { type: Date, required: true },
  sessionTime: { type: String },
  location: { type: String },
  notes: { type: String },
  status: {
    type: String,
    enum: ["UPCOMING", "IN_PROGRESS", "PENDING_SIGNATURE", "COMPLETED", "CANCELLED"],
    default: "UPCOMING",
  },

  // Memorandum requirements - set by Approving Lawyer
  memorandumRequired: { type: Boolean, default: false },
  supportingDocumentsRequired: { type: Boolean, default: false },

  // Approval by Approving Lawyer
  reviewedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  reviewedAt: { type: Date },
  reviewNotes: { type: String },

  // Memorandum prepared by Draft Lawyer
  memorandum: {
    content: { type: String },
    fileUrl: { type: String },
    preparedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    preparedAt: { type: Date },
    status: {
      type: String,
      enum: ["PENDING", "SUBMITTED", "APPROVED", "REJECTED"],
      default: "PENDING",
    },
    feedback: { type: String },
  },

  // Documents for this session
  documents: [documentSchema],

  // Director signature and final approval
  directorApproval: {
    approvedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    approvedAt: { type: Date },
    signatureUrl: { type: String },
    additionalDocuments: [documentSchema],
    notes: { type: String },
  },
  isReadyForSubmission: { type: Boolean, default: false }, // Set by director after signing

  // Locking mechanism
  isLocked: { type: Boolean, default: true }, // Locked until approving lawyer reviews
  unlockedFor: { type: mongoose.Schema.Types.ObjectId, ref: "User" }, // Draft lawyer who can work

  // Session completion
  outcome: { type: String }, // "ADJOURNED", "FINALIZED", "DISMISSED", etc.
  reasonForAdjournment: { type: String },
  nextSessionDate: { type: Date },
  completedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  completedAt: { type: Date },

  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

const caseStageSchema = new mongoose.Schema({
  stageType: {
    type: String,
    enum: ["Main", "Appeal", "Cassation", "Execution", "Initial Review"],
    required: true,
  },
  stageNumber: { type: Number, required: true },
  documents: [documentSchema],
  memorandum: {
    content: String,
    fileUrl: String,
    preparedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    preparedAt: Date,
    approvedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    approvedAt: Date,
    feedback: String,
    status: {
      type: String,
      enum: ["Pending", "Approved", "Rejected"],
      default: "Pending",
    },
  },
  hearingDate: Date,
  hearingTime: String,
  courtSubmissionProof: String,
  status: {
    type: String,
    enum: ["InProgress", "Approved", "Submitted", "Completed"],
    default: "InProgress",
  },
  createdAt: { type: Date, default: Date.now },
});

const clientSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Client name is required"],
      trim: true,
      minlength: [2, "Name must be at least 2 characters"],
      maxlength: [100, "Name cannot exceed 100 characters"]
    },
    contactNumber: {
      type: String,
      required: [true, "Contact number is required"],
      trim: true,
      validate: {
        validator: function(v) {
          return /^[0-9+\-\s()]+$/.test(v);
        },
        message: props => `${props.value} is not a valid phone number!`
      }
    },
    email: {
      type: String,
      trim: true,
      lowercase: true,
      validate: {
        validator: function(v) {
          return !v || /^\S+@\S+\.\S+$/.test(v);
        },
        message: props => `${props.value} is not a valid email!`
      }
    },
    address: {
      type: String,
      trim: true,
      maxlength: [500, "Address cannot exceed 500 characters"]
    },
    nationalId: {
      type: String,
      trim: true
    },
    additionalInfo: {
      type: String,
      trim: true,
      maxlength: [1000, "Additional info cannot exceed 1000 characters"]
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "Created by is required"],
    },
    createdAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

const caseSchema = new mongoose.Schema(
  {
    caseNumber: { type: String, unique: true, required: true },
    courtCaseId: { type: String, default: "" }, // Court-assigned case ID after submission
    clientId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Client",
      required: true,
    },
    caseType: { type: String, required: true },
    caseDescription: String,
    documents: [documentSchema],
    assignedLawyer: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    assignedAt: Date,
    approvingLawyer: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    secretary: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    stages: [caseStageSchema],
    currentStage: { type: Number, default: 0 },
    sessions: [sessionSchema], // Court sessions/hearings
    directorSignature: {
      signedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
      signedAt: Date,
      signatureUrl: String,
    },
    status: {
      type: String,
      enum: [
        "Draft",
        "Assigned",
        "UnderReview",
        "PendingApproval",
        "Approved",
        "PendingSignature",
        "ReadyForSubmission",
        "Submitted",
        "Archived",
      ],
      default: "Draft",
      index: true
    },
    archived: { type: Boolean, default: false, index: true },
    archivedAt: Date,
    archivedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    modificationRequests: [
      {
        requestedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
        note: String,
        requestedAt: { type: Date, default: Date.now },
      },
    ],
  },
  { timestamps: true }
);

const reminderSchema = new mongoose.Schema(
  {
    caseId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Case",
      required: true,
    },
    reminderType: {
      type: String,
      enum: ["Submission", "Hearing"],
      required: true,
    },
    reminderDate: { type: Date, required: true },
    recipients: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    message: String,
    sent: { type: Boolean, default: false },
    sentAt: Date,
  },
  { timestamps: true }
);

// Add indexes for reminders
reminderSchema.index({ caseId: 1 });
reminderSchema.index({ reminderDate: 1, sent: 1 });
reminderSchema.index({ recipients: 1 });

const activityLogSchema = new mongoose.Schema({
  caseId: { type: mongoose.Schema.Types.ObjectId, ref: "Case", index: true },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, index: true },
  action: { type: String, required: true, index: true },
  description: String,
  timestamp: { type: Date, default: Date.now, index: true },
});

// Add compound index for activity log queries
activityLogSchema.index({ caseId: 1, timestamp: -1 });
activityLogSchema.index({ userId: 1, timestamp: -1 });

export const Client = mongoose.model("Client", clientSchema);
export const Case = mongoose.model("Case", caseSchema);
export const Reminder = mongoose.model("Reminder", reminderSchema);
export const ActivityLog = mongoose.model("ActivityLog", activityLogSchema);
