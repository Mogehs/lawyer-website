// models/AdminReminder.js
import mongoose from "mongoose";

const adminReminderSchema = new mongoose.Schema(
  {
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    caseName: {
      type: String,
      required: true,
    },
    stage: {
      type: String,
      enum: ["Main Case", "Appeal", "Cassation"],
      required: true,
    },
    type: {
      type: String,
      enum: [
        "Before Hearing",
        "Before Submission",
        "Before Judgment",
        "Signature Pending",
        "Submission Deadline",
        "Approval Delay",
        "Archiving Pending",
        "Notification Delivery Failure",
        "Performance Alert",
      ],
      required: true,
    },
    lawyer: {
      type: String, // or ref:"User" if you have IDs
    },
    target: {
      type: String,
      enum: [
        "Secretary",
        "Assigned Lawyer",
        "All Lawyers",
        "Ragab (Approving Lawyer)",
        "Managing Director Only",
        "Everyone",
      ],
      required: true,
    },
    date: {
      type: Date,
      required: true,
    },
    description: {
      type: String,
    },
    isCompleted: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

const AdminReminder = mongoose.model("AdminReminder", adminReminderSchema);
export default AdminReminder;