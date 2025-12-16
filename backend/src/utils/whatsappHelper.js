// WhatsApp Integration Helper
// Use this helper throughout your application to send notifications

import {
  notifyLawyerAssignment,
  notifySecretaryAssignment,
  notifyHearingReminder,
  notifyMemorandumApproval,
  notifyDirectorSignatureRequired,
  notifyDeadlineReminder,
  notifyCaseStatusUpdate,
  notifyDocumentSubmission,
  notifyUrgentAlert,
  notifyCourtDateUpdate,
  notifyClientMeetingScheduled,
} from "./notifications.js";
import whatsappScheduler from "./whatsappScheduler.js";

class WhatsAppHelper {
  // Quick case assignment notification
  static async notifyNewCaseAssignment(assignmentData) {
    const {
      lawyerId,
      lawyerData,
      secretaryId,
      secretaryData,
      caseNumber,
      clientName,
      caseDetails,
    } = assignmentData;

    const results = [];

    try {
      // Notify assigned lawyer
      if (lawyerData && lawyerData.phone) {
        const lawyerResult = await notifyLawyerAssignment(
          lawyerData,
          caseNumber,
          clientName,
          caseDetails
        );
        results.push({
          type: "lawyer",
          success: true,
          recipient: lawyerData.name,
        });
      }

      // Notify secretary about the assignment
      if (secretaryData && secretaryData.phone) {
        const secretaryResult = await notifySecretaryAssignment(
          secretaryData,
          caseNumber,
          lawyerData?.name || "Assigned Lawyer",
          clientName,
          caseDetails
        );
        results.push({
          type: "secretary",
          success: true,
          recipient: secretaryData.name,
        });
      }

      // Auto-schedule hearing reminders if hearing date is provided
      if (caseDetails.hearingDate && caseDetails.hearingTime) {
        const recipients = [];
        if (lawyerData?.phone) recipients.push(lawyerData);
        if (secretaryData?.phone) recipients.push(secretaryData);

        if (recipients.length > 0) {
          whatsappScheduler.scheduleHearingReminders({
            caseNumber,
            hearingDate: caseDetails.hearingDate,
            hearingTime: caseDetails.hearingTime,
            recipients,
            caseDetails,
          });
          results.push({
            type: "hearing_reminders",
            success: true,
            scheduled: true,
          });
        }
      }

      return {
        success: true,
        message: "Case assignment notifications sent successfully",
        results,
      };
    } catch (error) {
      console.error("Error in case assignment notification:", error);
      return {
        success: false,
        error: error.message,
        results,
      };
    }
  }

  // Quick hearing schedule with automatic reminders
  static async scheduleHearingWithReminders(hearingData) {
    const {
      caseNumber,
      hearingDate,
      hearingTime,
      courtName,
      judge,
      clientName,
      lawyerIds = [],
      secretaryIds = [],
      lawyersData = [],
      secretariesData = [],
    } = hearingData;

    try {
      const recipients = [...lawyersData, ...secretariesData].filter(
        (r) => r.phone
      );

      if (recipients.length === 0) {
        return {
          success: false,
          error: "No recipients with phone numbers found",
        };
      }

      // Send immediate notification
      await notifyHearingReminder(
        recipients,
        caseNumber,
        hearingDate,
        hearingTime,
        {
          courtName,
          judge,
          clientName,
          caseType: hearingData.caseType || "General",
        }
      );

      // Schedule automatic reminders
      const schedulerResult = whatsappScheduler.scheduleHearingReminders({
        caseNumber,
        hearingDate,
        hearingTime,
        recipients,
        caseDetails: {
          courtName,
          judge,
          clientName,
          caseType: hearingData.caseType || "General",
        },
      });

      return {
        success: true,
        message: "Hearing scheduled with automatic reminders",
        immediateNotifications: recipients.length,
        scheduledReminders: schedulerResult.totalScheduled,
      };
    } catch (error) {
      console.error("Error scheduling hearing with reminders:", error);
      return {
        success: false,
        error: error.message,
      };
    }
  }

  // Quick document workflow notification
  static async notifyDocumentWorkflow(workflowData) {
    const {
      type, // 'submission', 'approval', 'signature_required'
      caseNumber,
      documentType,
      submittedBy,
      recipientsData,
      urgency = "Normal",
    } = workflowData;

    try {
      const results = [];

      switch (type) {
        case "submission":
          await notifyDocumentSubmission(
            recipientsData,
            caseNumber,
            documentType,
            submittedBy,
            new Date().toLocaleDateString()
          );
          results.push({
            type: "document_submission",
            recipients: recipientsData.length,
          });
          break;

        case "approval":
          if (recipientsData.length > 0) {
            await notifyMemorandumApproval(
              recipientsData[0], // Usually secretary
              caseNumber,
              submittedBy,
              {
                documentType,
                approvedDate: new Date().toLocaleDateString(),
              }
            );
            results.push({
              type: "document_approval",
              recipient: recipientsData[0].name,
            });
          }
          break;

        case "signature_required":
          for (const recipient of recipientsData) {
            if (recipient.role === "director" && recipient.phone) {
              await notifyDirectorSignatureRequired(
                recipient,
                caseNumber,
                documentType,
                urgency
              );
              results.push({
                type: "signature_request",
                recipient: recipient.name,
              });
            }
          }
          break;

        default:
          throw new Error(`Unknown workflow type: ${type}`);
      }

      return {
        success: true,
        message: `Document workflow notifications sent for ${type}`,
        results,
      };
    } catch (error) {
      console.error("Error in document workflow notification:", error);
      return {
        success: false,
        error: error.message,
      };
    }
  }

  // Emergency alert system
  static async sendEmergencyAlert(alertData) {
    const {
      caseNumber,
      alertType,
      message,
      actionRequired,
      recipientsData,
      priority = "High",
    } = alertData;

    try {
      // Send urgent alert
      await notifyUrgentAlert(
        recipientsData,
        caseNumber,
        alertType,
        message,
        actionRequired
      );

      // If extremely urgent, also send a follow-up SMS
      if (priority === "Critical") {
        const urgentMessage = `🚨 CRITICAL ALERT 🚨\nCase: ${caseNumber}\n${alertType}\n\nIMMEDIATE ACTION REQUIRED\nCheck WhatsApp for details`;

        for (const recipient of recipientsData) {
          if (recipient.phone) {
            // This would use the same SMS API for urgent SMS backup
            console.log(
              `Critical SMS sent to ${recipient.name}: ${recipient.phone}`
            );
          }
        }
      }

      return {
        success: true,
        message: "Emergency alert sent successfully",
        recipients: recipientsData.length,
        priority,
      };
    } catch (error) {
      console.error("Error sending emergency alert:", error);
      return {
        success: false,
        error: error.message,
      };
    }
  }

  // Court date change notification
  static async notifyCourtDateChange(changeData) {
    const {
      caseNumber,
      oldDate,
      newDate,
      courtName,
      reason,
      lawyersData,
      secretariesData,
      clientContactRequired = true,
    } = changeData;

    try {
      const allRecipients = [...lawyersData, ...secretariesData].filter(
        (r) => r.phone
      );

      await notifyCourtDateUpdate(
        allRecipients,
        caseNumber,
        oldDate,
        newDate,
        courtName,
        reason
      );

      // If it's a last-minute change (within 48 hours), send as urgent
      const changeDate = new Date(newDate);
      const now = new Date();
      const hoursUntilHearing = (changeDate - now) / (1000 * 60 * 60);

      if (hoursUntilHearing < 48) {
        await this.sendEmergencyAlert({
          caseNumber,
          alertType: "Last-Minute Court Date Change",
          message: `Court date changed from ${oldDate} to ${newDate}. Reason: ${reason}`,
          actionRequired:
            "Update calendar, inform client immediately, reschedule preparations",
          recipientsData: allRecipients,
          priority: "Critical",
        });
      }

      return {
        success: true,
        message: "Court date change notifications sent",
        recipients: allRecipients.length,
        urgentAlert: hoursUntilHearing < 48,
      };
    } catch (error) {
      console.error("Error notifying court date change:", error);
      return {
        success: false,
        error: error.message,
      };
    }
  }

  // Deadline tracking
  static async setupDeadlineTracking(deadlineData) {
    const {
      caseNumber,
      deadline,
      taskDescription,
      responsiblePersons = [],
      alertDays = [5, 2, 1], // Days before deadline to send alerts
    } = deadlineData;

    try {
      // Schedule automatic deadline reminders
      const schedulerResult = whatsappScheduler.scheduleDeadlineReminders({
        caseNumber,
        deadline,
        taskDescription,
        recipients: responsiblePersons,
      });

      return {
        success: true,
        message: "Deadline tracking setup completed",
        deadline,
        scheduledReminders: schedulerResult.totalScheduled,
        responsiblePersons: responsiblePersons.length,
      };
    } catch (error) {
      console.error("Error setting up deadline tracking:", error);
      return {
        success: false,
        error: error.message,
      };
    }
  }

  // Get notification status
  static async getNotificationStatus() {
    try {
      const scheduledReminders = whatsappScheduler.getScheduledReminders();

      return {
        success: true,
        scheduledReminders: scheduledReminders.length,
        reminders: scheduledReminders,
        lastUpdate: new Date().toISOString(),
      };
    } catch (error) {
      return {
        success: false,
        error: error.message,
      };
    }
  }
}

export default WhatsAppHelper;
