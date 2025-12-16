import { useEffect, useState } from "react";
import RemindersTable from "../components/DashboardReminders/RemindersTable";
import RemindersConfirmationModal from "../components/DashboardReminders/RemindersConfirmationModal";
import RemindersHeader from "../components/DashboardReminders/RemindersHeader";
import AddReminderModal from "../components/DashboardReminders/AddReminderModal";

import {
  useGetAllRemindersQuery,
  useCreateReminderMutation,
  useMarkCompletedMutation,
} from "../api/reminderApi";

const RemindersPage = () => {
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);

  const [showAddModal, setShowAddModal] = useState(false);
  const [modal, setModal] = useState({ show: false, message: "", type: "info" });

  const [sidebarOpen, setSidebarOpen] = useState(window.innerWidth >= 1024);

  // API hooks
  const { data, isLoading, isError, refetch } = useGetAllRemindersQuery({
    search,
    page,
    limit,
  });

  const [createReminder] = useCreateReminderMutation();
  const [markCompleted] = useMarkCompletedMutation();

  const reminders = data?.reminders || [];
  const totalPages = data?.totalPages || 1;

  useEffect(() => {
    const handleResize = () => {
      const desktop = window.innerWidth >= 1024;
      setSidebarOpen(desktop);
    };

    const handleSidebarToggle = () => {
      const sidebar = document.querySelector('aside');
      if (sidebar) {
        const isOpen = sidebar.classList.contains('w-64');
        setSidebarOpen(isOpen);
      }
    };

    window.addEventListener('resize', handleResize);

    const interval = setInterval(handleSidebarToggle, 100);

    return () => {
      window.removeEventListener('resize', handleResize);
      clearInterval(interval);
    };
  }, []);

  // Add reminder handler
  const handleAddReminder = async (newReminder) => {
    try {
      await createReminder(newReminder).unwrap();
      setModal({
        show: true,
        message: `New reminder "${newReminder.caseName}" added.`,
        type: "success",
      });
      setShowAddModal(false);
      refetch();
    } catch (error) {
      setModal({
        show: true,
        message: `Failed to add reminder: ${error.data?.message || error.message}`,
        type: "error",
      });
    }
  };

  // Action buttons (View / Mark Complete)
  const handleAction = async (action, reminder) => {
    if (action === "View") {
      setModal({
        show: true,
        message: `Case: ${reminder.caseName}\nLawyer: ${reminder.lawyer}\nDate: ${new Date(
          reminder.date
        ).toLocaleDateString()}\nStatus: ${reminder.isCompleted ? "Completed" : "Pending"}`,
        type: "info",
      });
    }

    if (action === "Mark Complete") {
      try {
        await markCompleted(reminder._id).unwrap();
        setModal({
          show: true,
          message: `Reminder "${reminder.caseName}" marked as completed.`,
          type: "success",
        });
        refetch();
      } catch (error) {
        setModal({
          show: true,
          message: `Failed to mark complete: ${error.data?.message || error.message}`,
          type: "error",
        });
      }
    }
  };

  // Pagination handler
  const handlePageChange = (newPage) => setPage(newPage);

  if (isLoading)
    return <p className="text-center mt-20">Loading reminders...</p>;

  if (isError)
    return (
      <p className="text-center text-red-500 mt-20">
        Failed to load reminders.
      </p>
    );

  return (
    <div
      className={`min-h-screen
        px-3 sm:px-4 md:px-6 lg:px-2
        py-3 sm:py-4 md:py-5 
        transition-all duration-300 ease-in-out
        ${sidebarOpen ? " md:ml-64 lg:ml-64" : "lg:ml-20 md:ml-15"}`}
    >
      {/* Header */}
      <RemindersHeader
        search={search}
        setSearch={setSearch}
        onAddClick={() => setShowAddModal(true)}
      />

      {/* Table */}
      <RemindersTable
        reminders={reminders}
        onAction={handleAction}
        page={page}
        totalPages={totalPages}
        onPageChange={handlePageChange}
      />

      {/* Add Reminder Modal */}
      {showAddModal && (
        <AddReminderModal
          onClose={() => setShowAddModal(false)}
          onSubmit={handleAddReminder}
        />
      )}

      {/* Confirmation Modal */}
      {modal.show && (
        <RemindersConfirmationModal
          message={modal.message}
          type={modal.type}
          onClose={() => setModal((prev) => ({ ...prev, show: false }))}
        />
      )}
    </div>
  );
};

export default RemindersPage;
