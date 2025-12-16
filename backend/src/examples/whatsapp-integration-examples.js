// Example Integration with Case Management
// This shows how to integrate WhatsApp notifications with your existing case management system

import WhatsAppHelper from "../utils/whatsappHelper.js";

// Example: Update your case assignment controller
export const assignCaseToLawyer = async (req, res) => {
  try {
    const { caseId, lawyerId, secretaryId } = req.body;

    // Your existing case assignment logic
    const caseData = await Case.findById(caseId);
    const lawyer = await User.findById(lawyerId);
    const secretary = await User.findById(secretaryId);

    // Update case with assignments
    caseData.assignedLawyer = lawyerId;
    caseData.assignedSecretary = secretaryId;
    await caseData.save();

    // 🆕 NEW: Send WhatsApp notifications
    const notificationResult = await WhatsAppHelper.notifyNewCaseAssignment({
      lawyerData: {
        name: lawyer.name,
        email: lawyer.email,
        phone: lawyer.phone, // Make sure phone field exists in User model
      },
      secretaryData: {
        name: secretary.name,
        email: secretary.email,
        phone: secretary.phone,
      },
      caseNumber: caseData.caseNumber,
      clientName: caseData.clientName,
      caseDetails: {
        courtName: caseData.courtName,
        caseType: caseData.caseType,
        priority: caseData.priority || "Normal",
        assignedDate: new Date().toLocaleDateString(),
        hearingDate: caseData.hearingDate,
        hearingTime: caseData.hearingTime,
      },
    });

    res.json({
      success: true,
      message: "Case assigned successfully",
      case: caseData,
      notifications: notificationResult,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error assigning case",
      error: error.message,
    });
  }
};

// Example: Schedule hearing with automatic reminders
export const scheduleHearing = async (req, res) => {
  try {
    const { caseId, hearingDate, hearingTime, courtName, judge } = req.body;

    // Your existing hearing scheduling logic
    const caseData = await Case.findById(caseId).populate(
      "assignedLawyer assignedSecretary"
    );

    caseData.hearingDate = hearingDate;
    caseData.hearingTime = hearingTime;
    caseData.courtName = courtName;
    caseData.judge = judge;
    await caseData.save();

    // 🆕 NEW: Schedule WhatsApp reminders
    const hearingResult = await WhatsAppHelper.scheduleHearingWithReminders({
      caseNumber: caseData.caseNumber,
      hearingDate,
      hearingTime,
      courtName,
      judge,
      clientName: caseData.clientName,
      lawyersData: [
        {
          name: caseData.assignedLawyer.name,
          phone: caseData.assignedLawyer.phone,
          email: caseData.assignedLawyer.email,
        },
      ],
      secretariesData: [
        {
          name: caseData.assignedSecretary.name,
          phone: caseData.assignedSecretary.phone,
          email: caseData.assignedSecretary.email,
        },
      ],
      caseType: caseData.caseType,
    });

    res.json({
      success: true,
      message: "Hearing scheduled with automatic reminders",
      hearing: {
        date: hearingDate,
        time: hearingTime,
        court: courtName,
        judge,
      },
      notifications: hearingResult,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error scheduling hearing",
      error: error.message,
    });
  }
};

// Example: Memorandum approval workflow
export const approveMemorandum = async (req, res) => {
  try {
    const { memorandumId, approvedBy } = req.body;

    // Your existing approval logic
    const memorandum = await Memorandum.findById(memorandumId).populate(
      "case assignedSecretary"
    );

    memorandum.status = "approved";
    memorandum.approvedBy = approvedBy;
    memorandum.approvedDate = new Date();
    await memorandum.save();

    // 🆕 NEW: Send WhatsApp notification
    const notificationResult = await WhatsAppHelper.notifyDocumentWorkflow({
      type: "approval",
      caseNumber: memorandum.case.caseNumber,
      documentType: "Memorandum",
      submittedBy: approvedBy.name || "Director",
      recipientsData: [
        {
          name: memorandum.assignedSecretary.name,
          phone: memorandum.assignedSecretary.phone,
          email: memorandum.assignedSecretary.email,
        },
      ],
    });

    res.json({
      success: true,
      message: "Memorandum approved successfully",
      memorandum,
      notifications: notificationResult,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error approving memorandum",
      error: error.message,
    });
  }
};

// Example: Update case status with notifications
export const updateCaseStatus = async (req, res) => {
  try {
    const { caseId, newStatus, notes } = req.body;
    const updatedBy = req.user.name; // From your auth middleware

    // Your existing status update logic
    const caseData = await Case.findById(caseId).populate(
      "assignedLawyer assignedSecretary"
    );
    const oldStatus = caseData.status;

    caseData.status = newStatus;
    caseData.lastUpdated = new Date();
    if (notes) {
      caseData.statusNotes = notes;
    }
    await caseData.save();

    // 🆕 NEW: Send status update notifications
    const recipients = [];
    if (caseData.assignedLawyer?.phone) {
      recipients.push({
        name: caseData.assignedLawyer.name,
        phone: caseData.assignedLawyer.phone,
      });
    }
    if (caseData.assignedSecretary?.phone) {
      recipients.push({
        name: caseData.assignedSecretary.name,
        phone: caseData.assignedSecretary.phone,
      });
    }

    let notificationResult = null;
    if (recipients.length > 0) {
      const { notifyCaseStatusUpdate } = await import(
        "../utils/notifications.js"
      );
      await notifyCaseStatusUpdate(
        recipients,
        caseData.caseNumber,
        oldStatus,
        newStatus,
        updatedBy,
        notes
      );
      notificationResult = { recipients: recipients.length, sent: true };
    }

    res.json({
      success: true,
      message: "Case status updated successfully",
      case: caseData,
      notifications: notificationResult,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error updating case status",
      error: error.message,
    });
  }
};

// Example: Emergency alert for urgent court date changes
export const updateCourtDate = async (req, res) => {
  try {
    const { caseId, newDate, newTime, reason } = req.body;

    // Your existing logic
    const caseData = await Case.findById(caseId).populate(
      "assignedLawyer assignedSecretary"
    );
    const oldDate = caseData.hearingDate;

    caseData.hearingDate = newDate;
    caseData.hearingTime = newTime;
    await caseData.save();

    // 🆕 NEW: Send emergency court date change notification
    const changeResult = await WhatsAppHelper.notifyCourtDateChange({
      caseNumber: caseData.caseNumber,
      oldDate: oldDate,
      newDate: newDate,
      courtName: caseData.courtName,
      reason: reason,
      lawyersData: [
        {
          name: caseData.assignedLawyer.name,
          phone: caseData.assignedLawyer.phone,
        },
      ],
      secretariesData: [
        {
          name: caseData.assignedSecretary.name,
          phone: caseData.assignedSecretary.phone,
        },
      ],
    });

    res.json({
      success: true,
      message: "Court date updated with emergency notifications sent",
      oldDate,
      newDate,
      notifications: changeResult,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error updating court date",
      error: error.message,
    });
  }
};

// Example: Set up deadline tracking for important tasks
export const createDeadlineTask = async (req, res) => {
  try {
    const { caseId, taskDescription, deadline, assignedTo } = req.body;

    // Your existing task creation logic
    const task = new Task({
      case: caseId,
      description: taskDescription,
      deadline: deadline,
      assignedTo: assignedTo,
      status: "pending",
    });
    await task.save();

    // Get assigned persons data
    const assignedPersons = await User.find({
      _id: { $in: assignedTo },
    }).select("name phone email");

    // 🆕 NEW: Setup automatic deadline reminders
    const caseData = await Case.findById(caseId);
    const trackingResult = await WhatsAppHelper.setupDeadlineTracking({
      caseNumber: caseData.caseNumber,
      deadline: deadline,
      taskDescription: taskDescription,
      responsiblePersons: assignedPersons.map((person) => ({
        name: person.name,
        phone: person.phone,
        email: person.email,
      })),
    });

    res.json({
      success: true,
      message: "Deadline task created with automatic tracking",
      task,
      deadlineTracking: trackingResult,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error creating deadline task",
      error: error.message,
    });
  }
};

// Example: User model update to include phone field
/*
// Add to your User model schema:
const UserSchema = new mongoose.Schema({
  // ... existing fields
  phone: {
    type: String,
    required: function() {
      return this.role !== 'client'; // Require phone for staff members
    },
    validate: {
      validator: function(v) {
        return /^\+?[1-9]\d{1,14}$/.test(v); // Basic international phone number validation
      },
      message: 'Please provide a valid phone number'
    }
  },
  // Add WhatsApp preferences
  whatsappNotifications: {
    type: Boolean,
    default: true
  },
  notificationPreferences: {
    hearingReminders: { type: Boolean, default: true },
    caseAssignments: { type: Boolean, default: true },
    documentUpdates: { type: Boolean, default: true },
    urgentAlerts: { type: Boolean, default: true }
  }
});
*/

// Example: Admin endpoint to manage WhatsApp settings
export const getWhatsAppStatus = async (req, res) => {
  try {
    const status = await WhatsAppHelper.getNotificationStatus();

    res.json({
      success: true,
      whatsappStatus: status,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};
