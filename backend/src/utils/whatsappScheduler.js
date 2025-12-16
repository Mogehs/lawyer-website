// WhatsApp Scheduler for Automated Reminders
import cron from "node-cron";
import {
  notifyHearingReminder,
  notifyDeadlineReminder,
  sendWhatsAppMessage,
  testWhatsAppConnection,
} from "./notifications.js";

class WhatsAppScheduler {
  constructor() {
    this.scheduledTasks = new Map();
    this.isInitialized = false;
  }

  async initialize() {
    try {
      // Test WhatsApp connection on initialization
      const connectionTest = await testWhatsAppConnection();
      if (!connectionTest.success) {
        console.warn(
          "⚠️ WhatsApp Scheduler: API not configured -",
          connectionTest.error
        );
        return false;
      }

      // Schedule daily reminder checks at 9:00 AM
      cron.schedule("0 9 * * *", () => {
        this.checkDailyReminders();
      });

      // Schedule hourly urgent checks
      cron.schedule("0 * * * *", () => {
        this.checkUrgentReminders();
      });

      console.log("✅ WhatsApp Scheduler initialized successfully");
      this.isInitialized = true;
      return true;
    } catch (error) {
      console.error("❌ WhatsApp Scheduler initialization failed:", error);
      return false;
    }
  }

  // Schedule a one-time reminder
  scheduleReminder(reminderData) {
    const {
      id,
      recipients,
      caseNumber,
      message,
      scheduledTime,
      type = "general",
    } = reminderData;

    try {
      // Convert scheduledTime to cron expression
      const reminderDate = new Date(scheduledTime);
      const cronExpression = this.dateToCron(reminderDate);

      // Schedule the task
      const task = cron.schedule(
        cronExpression,
        async () => {
          await this.sendScheduledReminder(reminderData);
          // Remove from scheduled tasks after execution
          this.scheduledTasks.delete(id);
        },
        {
          scheduled: false,
        }
      );

      // Store the task
      this.scheduledTasks.set(id, {
        task,
        data: reminderData,
        scheduledTime,
      });

      // Start the task
      task.start();

      console.log(
        `📅 Scheduled WhatsApp reminder for case ${caseNumber} at ${scheduledTime}`
      );
      return { success: true, id, scheduledTime };
    } catch (error) {
      console.error("❌ Error scheduling reminder:", error);
      return { success: false, error: error.message };
    }
  }

  // Cancel a scheduled reminder
  cancelReminder(id) {
    const scheduledTask = this.scheduledTasks.get(id);
    if (scheduledTask) {
      scheduledTask.task.stop();
      this.scheduledTasks.delete(id);
      console.log(`❌ Cancelled WhatsApp reminder: ${id}`);
      return { success: true };
    }
    return { success: false, error: "Reminder not found" };
  }

  // Schedule hearing reminders with multiple alerts
  scheduleHearingReminders(hearingData) {
    const {
      caseNumber,
      hearingDate,
      hearingTime,
      recipients,
      caseDetails = {},
    } = hearingData;

    const hearingDateTime = new Date(`${hearingDate} ${hearingTime}`);
    const now = new Date();

    const reminders = [
      { days: 7, label: "7 days before" },
      { days: 3, label: "3 days before" },
      { days: 1, label: "1 day before" },
      { hours: 2, label: "2 hours before" },
    ];

    const scheduledReminders = [];

    reminders.forEach((reminder) => {
      const reminderTime = new Date(hearingDateTime);

      if (reminder.days) {
        reminderTime.setDate(reminderTime.getDate() - reminder.days);
      } else if (reminder.hours) {
        reminderTime.setHours(reminderTime.getHours() - reminder.hours);
      }

      // Only schedule if reminder time is in the future
      if (reminderTime > now) {
        const reminderId = `hearing-${caseNumber}-${
          reminder.days || reminder.hours
        }${reminder.days ? "d" : "h"}`;

        const result = this.scheduleReminder({
          id: reminderId,
          recipients,
          caseNumber,
          type: "hearing",
          scheduledTime: reminderTime.toISOString(),
          hearingDate,
          hearingTime,
          caseDetails,
          reminderLabel: reminder.label,
        });

        if (result.success) {
          scheduledReminders.push(result);
        }
      }
    });

    return {
      success: true,
      scheduledReminders,
      totalScheduled: scheduledReminders.length,
    };
  }

  // Schedule deadline reminders
  scheduleDeadlineReminders(deadlineData) {
    const { caseNumber, deadline, taskDescription, recipients } = deadlineData;

    const deadlineDate = new Date(deadline);
    const now = new Date();

    const reminders = [
      { days: 5, label: "5 days before deadline" },
      { days: 2, label: "2 days before deadline" },
      { days: 1, label: "1 day before deadline" },
    ];

    const scheduledReminders = [];

    reminders.forEach((reminder) => {
      const reminderTime = new Date(deadlineDate);
      reminderTime.setDate(reminderTime.getDate() - reminder.days);

      if (reminderTime > now) {
        const reminderId = `deadline-${caseNumber}-${reminder.days}d`;

        const result = this.scheduleReminder({
          id: reminderId,
          recipients,
          caseNumber,
          type: "deadline",
          scheduledTime: reminderTime.toISOString(),
          deadline,
          taskDescription,
          daysRemaining: reminder.days,
          reminderLabel: reminder.label,
        });

        if (result.success) {
          scheduledReminders.push(result);
        }
      }
    });

    return {
      success: true,
      scheduledReminders,
      totalScheduled: scheduledReminders.length,
    };
  }

  // Send a scheduled reminder
  async sendScheduledReminder(reminderData) {
    const { type, recipients, caseNumber } = reminderData;

    try {
      switch (type) {
        case "hearing":
          await notifyHearingReminder(
            recipients,
            caseNumber,
            reminderData.hearingDate,
            reminderData.hearingTime,
            reminderData.caseDetails
          );
          break;

        case "deadline":
          await notifyDeadlineReminder(
            recipients,
            caseNumber,
            reminderData.deadline,
            reminderData.taskDescription,
            reminderData.daysRemaining
          );
          break;

        case "general":
          for (const recipient of recipients) {
            if (recipient.phone) {
              await sendWhatsAppMessage(recipient.phone, reminderData.message);
            }
          }
          break;

        default:
          console.warn(`⚠️ Unknown reminder type: ${type}`);
      }

      console.log(`✅ Sent scheduled ${type} reminder for case ${caseNumber}`);
    } catch (error) {
      console.error(
        `❌ Error sending scheduled reminder for case ${caseNumber}:`,
        error
      );
    }
  }

  // Check for daily reminders (runs at 9 AM)
  async checkDailyReminders() {
    console.log("🔍 Checking daily WhatsApp reminders...");
    // This would typically query your database for reminders due today
    // For now, we'll just log the check
  }

  // Check for urgent reminders (runs hourly)
  async checkUrgentReminders() {
    console.log("🔍 Checking urgent WhatsApp reminders...");
    // This would check for urgent reminders due soon
  }

  // Convert a Date object to a cron expression
  dateToCron(date) {
    const minute = date.getMinutes();
    const hour = date.getHours();
    const dayOfMonth = date.getDate();
    const month = date.getMonth() + 1;
    const year = date.getFullYear();

    // For one-time execution, use specific date/time
    return `${minute} ${hour} ${dayOfMonth} ${month} *`;
  }

  // Get all scheduled reminders
  getScheduledReminders() {
    const reminders = [];
    for (const [id, reminder] of this.scheduledTasks) {
      reminders.push({
        id,
        scheduledTime: reminder.scheduledTime,
        caseNumber: reminder.data.caseNumber,
        type: reminder.data.type,
      });
    }
    return reminders;
  }

  // Send immediate notification to multiple recipients
  async sendImmediateNotification(recipients, message, caseNumber) {
    const results = [];

    for (const recipient of recipients) {
      if (recipient.phone) {
        const result = await sendWhatsAppMessage(recipient.phone, message);
        results.push({
          recipient: recipient.name || recipient.phone,
          success: result.success,
          error: result.error,
        });
      }
    }

    console.log(
      `📤 Sent immediate WhatsApp notifications for case ${caseNumber}`
    );
    return {
      success: results.some((r) => r.success),
      results,
      totalSent: results.filter((r) => r.success).length,
      totalFailed: results.filter((r) => !r.success).length,
    };
  }

  // Cleanup expired reminders
  cleanup() {
    const now = new Date();
    for (const [id, reminder] of this.scheduledTasks) {
      const scheduledTime = new Date(reminder.scheduledTime);
      if (scheduledTime < now) {
        reminder.task.stop();
        this.scheduledTasks.delete(id);
        console.log(`🧹 Cleaned up expired reminder: ${id}`);
      }
    }
  }
}

// Create and export singleton instance
const whatsappScheduler = new WhatsAppScheduler();

export default whatsappScheduler;

// Export convenience functions
export const {
  scheduleReminder,
  cancelReminder,
  scheduleHearingReminders,
  scheduleDeadlineReminders,
  sendImmediateNotification,
  getScheduledReminders,
  cleanup,
} = whatsappScheduler;
