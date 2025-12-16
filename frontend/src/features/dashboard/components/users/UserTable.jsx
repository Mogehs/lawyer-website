import React from "react";

const UserTable = ({ users, updateStatus, updateRole, onView, onDelete, roles }) => {
  return (
    <div className="bg-white text-[#24344f] shadow-xl rounded-2xl border border-[#fe9a00]/20 overflow-hidden">
      {/* Desktop Table */}
      <div className="hidden lg:block">
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead className="bg-[#A48C65] text-white uppercase tracking-wide text-xs font-semibold">
              <tr className="text-left whitespace-nowrap">
                <th className="py-3 px-4">Name</th>
                <th className="py-3 px-4">Role</th>
                <th className="py-3 px-4">Email</th>
                <th className="py-3 px-4">Phone</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-center">Assigned Cases</th>
                <th className="py-3 px-4 text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map((u, idx) => (
                <tr
                  key={u._id} // ✅ use MongoDB _id
                  className={`${idx % 2 === 0 ? "bg-[#bcb08356]" : "bg-white"} hover:bg-slate-100 transition whitespace-nowrap`}
                >
                  <td className="py-3 px-4 font-semibold">{u.name}</td>
                  <td className="py-3 px-4">
                    <select
                      value={u.role} // backend enum like "lawyer"
                      onChange={(e) => updateRole(u._id, e.target.value)}
                      className="border rounded px-2 py-1 text-sm w-full"
                    >
                      {roles.map((role) => (
                        <option key={role.value} value={role.value}>
                          {role.label}
                        </option>
                      ))}
                    </select>
                  </td>
                  <td className="py-3 px-4">{u.email}</td>
                  <td className="py-3 px-4">{u.phone?u.phone:'NP'}</td>
                  <td className="py-3 px-4">
                    <select
                      value={u.status}
                      onChange={(e) => updateStatus(u._id, e.target.value)}
                      className="border rounded px-2 py-1 text-sm w-full"
                    >
                      <option value="active">Active</option>
                      <option value="inactive">Inactive</option>
                    </select>
                  </td>
                  <td className="py-3 px-4 text-center">{u.assignedCases?u.assignedCases:'NP'}</td>
                  <td className="py-3 px-4 flex gap-2 justify-center">
                    <button
                      onClick={() => onView(u)}
                      className="bg-[#A48C65] text-white px-3 py-1 rounded-md hover:bg-transparent border hover:text-[#494C52] hover:border-[#A48C65] transition text-sm"
                    >
                      View
                    </button>
                    <button
                      onClick={() => onDelete(u._id)}
                      className="bg-[#A48C65] text-white px-3 py-1 rounded-md hover:bg-transparent border hover:text-[#494C52] hover:border-[#A48C65] transition text-sm"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Mobile / Tablet Card View */}
      <div className="lg:hidden flex flex-col gap-4 p-4">
        {users.map((u) => (
          <div key={u._id} className="bg-[#E1E1E2] rounded-xl p-4 shadow-md flex flex-col gap-2">
            <p className="font-semibold text-lg">{u.name}</p>
            <div className="flex flex-col gap-1">
              <label className="text-sm font-medium">Role:</label>
              <select
                value={u.role}
                onChange={(e) => updateRole(u._id, e.target.value)}
                className="border rounded px-2 py-1 text-sm w-full"
              >
                {roles.map((role) => (
                  <option key={role.value} value={role.value}>
                    {role.label}
                  </option>
                ))}
              </select>

            </div>
            <p><strong>Email:</strong> {u.email}</p>
            <p><strong>Phone:</strong> {u.phone?u.phone:'NP'}</p>
            <div className="flex items-center justify-between mt-2 gap-2">
              <select
                value={u.status}
                onChange={(e) => updateStatus(u._id, e.target.value)}
                className="border rounded px-2 py-1 text-sm"
              >
                <option value="Active">Active</option>
                <option value="Inactive">Inactive</option>
              </select>
              <div className="flex gap-2">
                <button
                  onClick={() => onView(u)}
                  className="bg-slate-700 text-white px-3 py-1 rounded-md hover:bg-slate-800 transition text-sm"
                >
                  View
                </button>
                <button
                  onClick={() => onDelete(u._id)}
                  className="bg-red-600 text-white px-3 py-1 rounded-md hover:bg-red-700 transition text-sm"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default UserTable;
