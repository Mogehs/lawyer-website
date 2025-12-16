import React from "react";
import {
  Bell,
  Calendar,
  FilePlus,
  AlertCircle,
  Trash2,
  Clock,
} from "lucide-react";
import {
  useGetRemindersQuery,
  useDeleteReminderMutation,
} from "../api/secretaryApi";

const SecretaryReminders = () => {
  // Fetch reminders from API with auto-refresh
  const {
    data: remindersData,
    isLoading,
    error,
    refetch,
  } = useGetRemindersQuery(undefined, {
    pollingInterval: 60000, // Refresh every 60 seconds
    skipPollingIfUnfocused: true,
  });

  // Delete reminder mutation
  const [deleteReminder, { isLoading: isDeleting }] =
    useDeleteReminderMutation();

  // Use API data
  const reminders = remindersData?.data || [];

  // Handle delete reminder
  const handleDeleteReminder = async (id) => {
    if (window.confirm("Are you sure you want to delete this reminder?")) {
      try {
        await deleteReminder(id).unwrap();
        alert("Reminder deleted successfully");
      } catch (error) {
        alert("Failed to delete reminder");
        console.error("Delete error:", error);
      }
    }
  };

  // Get icon based on reminder type
  const getIcon = (reminderType, isOverdue) => {
    if (isOverdue) return <AlertCircle size={18} />;
    if (reminderType === "Hearing") return <Calendar size={18} />;
    if (reminderType === "Submission") return <FilePlus size={18} />;
    return <Bell size={18} />;
  };


  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
          <Bell size={28} className="text-[#A48C65]" />
          Reminders
        </h2>
        <p className="text-sm text-gray-600 mt-1">
          Upcoming hearings and action-required alerts
        </p>
      </div>

      {/* Loading & Error States */}
      {isLoading && (
        <div className="text-center py-8">
          <div className="inline-block animate-spin rounded-full h-6 w-6 border-b-2 border-[#A48C65]"></div>
          <p className="text-xs text-slate-500 mt-2">Loading reminders...</p>
        </div>
      )}

      {error && (
        <div className="bg-red-50 border border-red-200 rounded p-3 mb-4">
          <h3 className="text-xs font-semibold text-red-800 mb-1">
            Error Loading Reminders
          </h3>
          <p className="text-[10px] text-red-600">
            {error?.data?.message ||
              "Unable to fetch reminders. Please try again."}
          </p>
          <button
            onClick={() => refetch()}
            className="mt-2 px-3 py-1 bg-red-600 text-white rounded text-[10px] hover:bg-red-700 transition"
          >
            Retry
          </button>
        </div>
      )}

      {!isLoading && !error && reminders.length === 0 && (
        <div className="text-center py-12">
          <div className="text-slate-300 mb-3">
            <Bell size={40} className="mx-auto" />
          </div>
          <h3 className="text-sm font-semibold text-slate-700 mb-1">
            No Reminders
          </h3>
          <p className="text-[10px] text-slate-500">
            Reminders will appear here when hearings or submissions are
            scheduled.
          </p>
        </div>
      )}

      {!isLoading && !error && reminders.length > 0 && (
        <div className="space-y-2">
          {reminders.map((reminder) => (
            <div
              key={reminder._id}
              className={`p-2.5 rounded bg-white shadow-sm border-l-2 ${
                reminder.isOverdue ? "border-red-500" : "border-[#A48C65]"
              } flex items-start gap-2 hover:shadow-md transition`}
            >
              <div
                className={`mt-0.5 ${
                  reminder.isOverdue ? "text-red-600" : "text-[#A48C65]"
                }`}
              >
                {getIcon(reminder.reminderType, reminder.isOverdue)}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex justify-between items-start mb-1">
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-xs text-slate-800 flex items-center gap-1 flex-wrap">
                      <span className="truncate">{reminder.caseName}</span>
                      {reminder.isToday && (
                        <span className="text-[9px] bg-orange-500 text-white px-1 py-0.5 rounded shrink-0 font-medium">
                          TODAY
                        </span>
                      )}
                      {reminder.isOverdue && (
                        <span className="text-[9px] bg-red-500 text-white px-1 py-0.5 rounded shrink-0 font-medium">
                          OVERDUE
                        </span>
                      )}
                    </h3>
                    <p className="text-[10px] text-slate-600 mt-0.5">
                      {reminder.caseNumber} • {reminder.caseType}
                    </p>
                  </div>
                  <button
                    onClick={() => handleDeleteReminder(reminder._id)}
                    disabled={isDeleting}
                    className="p-1 text-slate-600 hover:text-[#A48C65] hover:bg-red-50 rounded transition shrink-0 ml-2"
                    title="Delete"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>

                <p className="text-[10px] mt-1 text-slate-700">
                  {reminder.message}
                </p>

                <div className="flex items-center justify-between mt-1.5 text-[10px]">
                  <div className="flex items-center gap-2">
                    <span className="flex items-center gap-0.5 text-slate-600">
                      <Calendar size={10} /> {reminder.dueDate}
                    </span>
                    <span
                      className={`flex items-center gap-0.5 ${
                        reminder.isOverdue
                          ? "text-red-600 font-medium"
                          : "text-slate-600"
                      }`}
                    >
                      <Clock size={10} />
                      {reminder.isOverdue
                        ? `${reminder.daysUntil}d overdue`
                        : reminder.isToday
                        ? "Today"
                        : `${reminder.daysUntil}d left`}
                    </span>
                  </div>
                  <span className="px-1.5 py-0.5 bg-slate-100 border border-slate-200 rounded text-[9px] font-medium text-slate-700">
                    {reminder.type}
                  </span>
                </div>

                {reminder.stage && (
                  <p className="text-[9px] mt-1 text-slate-500">
                    Stage: {reminder.stage}
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default SecretaryReminders;
