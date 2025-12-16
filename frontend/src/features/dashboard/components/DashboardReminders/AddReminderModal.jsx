// src/components/DashboardReminders/AddReminderModal.jsx
import { useState } from "react";

const AddReminderModal = ({ onClose, onSubmit }) => {
  const [form, setForm] = useState({
    caseName: "",
    stage: "Main Case",
    type: "Before Hearing",
    lawyer: "",
    target: "Assigned Lawyer",
    date: "",
    description: "",
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.caseName || !form.date) return;
    onSubmit(form);
  };

  return (
    <div className="fixed inset-0 bg-black/60 flex justify-center items-center z-50 lg:top-14">
      <div className="bg-[#BCB083] text-[#162030] p-6 rounded-xl shadow-2xl w-[90%] sm:w-[400px] border border-[#fe9a00]/30">

        <h3 className="text-lg font-semibold text-[#494C52] mb-4">
          Add New Reminder
        </h3>

        <form onSubmit={handleSubmit} className="space-y-3">

          {/* Case Name */}
          <input
            type="text"
            name="caseName"
            placeholder="Case Name"
            value={form.caseName}
            onChange={handleChange}
            className="w-full p-2 rounded-lg bg-white border border-[#fe9a00]/30 focus:outline-none"
          />

          {/* Lawyer */}
          <input
            type="text"
            name="lawyer"
            placeholder="Lawyer (optional depending on type)"
            value={form.lawyer}
            onChange={handleChange}
            className="w-full p-2 rounded-lg bg-white border border-[#fe9a00]/30 focus:outline-none"
          />

          {/* Stage */}
          <select
            name="stage"
            value={form.stage}
            onChange={handleChange}
            className="w-full p-2 rounded-lg bg-white border border-[#fe9a00]/30 focus:outline-none"
          >
            <option>Main Case</option>
            <option>Appeal</option>
            <option>Cassation</option>
          </select>

          {/* Reminder Type*/}
          <select
            name="type"
            value={form.type}
            onChange={handleChange}
            className="w-full p-2 rounded-lg bg-white border border-[#fe9a00]/30 focus:outline-none"
          >
            {/* Existing Types */}
            <option>Before Hearing</option>
            <option>Before Submission</option>
            <option>Before Judgment</option>

            {/* Admin Level Types */}
            <option>Signature Pending</option>
            <option>Submission Deadline</option>
            <option>Approval Delay</option>
            <option>Archiving Pending</option>
            <option>Notification Delivery Failure</option>
            <option>Performance Alert</option>
          </select>

          {/* Target Recipient */}
          <select
            name="target"
            value={form.target}
            onChange={handleChange}
            className="w-full p-2 rounded-lg bg-white border border-[#fe9a00]/30 focus:outline-none"
          >
            <option>Secretary</option>
            <option>Assigned Lawyer</option>
            <option>All Lawyers</option>
            <option>Ragab (Approving Lawyer)</option>
            <option>Managing Director Only</option>
            <option>Everyone</option>
          </select>

          {/* Date */}
          <input
            type="date"
            name="date"
            value={form.date}
            onChange={handleChange}
            className="w-full p-2 rounded-lg bg-white border border-[#fe9a00]/30 focus:outline-none"
          />

          {/* Optional Description */}
          <textarea
            name="description"
            placeholder="Additional notes (optional)"
            value={form.description}
            onChange={handleChange}
            className="w-full p-2 rounded-lg bg-white border border-[#fe9a00]/30 focus:outline-none min-h-[80px]"
          ></textarea>

          {/* Buttons */}
          <div className="flex justify-end gap-3 mt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2  border border-[#A48C65] text-gray-800 hover:bg-[#A48C65] hover:text-white transition-all duration-200 rounded-lg"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-[#A48C65] hover:bg-[#8c7a4e] rounded-lg text-white"
            >
              Save
            </button>
          </div>
        </form>

      </div>
    </div>
  );
};

export default AddReminderModal;
