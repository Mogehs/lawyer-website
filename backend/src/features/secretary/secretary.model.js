import mongoose from "mongoose";

const documentSchema = new mongoose.Schema({
  name: { type: String, required: true },
  url: { type: String, required: true },
  uploadedAt: { type: Date, default: Date.now },
  uploadedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
});

const caseStageSchema = new mongoose.Schema({
  stageType: {
    type: String,
    enum: ["Main", "Appeal", "Cassation"],
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
