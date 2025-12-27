import React from "react";
import { useTranslation } from "react-i18next";

const UserTable = ({ users, updateStatus, updateRole, onView, onDelete, roles }) => {
  const { t, i18n } = useTranslation("userTable");
  const isRTL = i18n.language === "ar";

  return (
    <div className={`bg-white text-[#24344f] shadow-xl rounded-2xl border border-[#0B1F3B]/20 overflow-hidden ${isRTL ? "text-right" : "text-left"}`}>
      
      {/* Desktop Table */}
      <div className="hidden lg:block">
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead className="bg-[#0B1F3B] text-white uppercase tracking-wide text-xs font-semibold">
              <tr className="whitespace-nowrap">
                <th className="py-3 px-4">{t("tableHeaders.name")}</th>
                <th className="py-3 px-4">{t("tableHeaders.role")}</th>
                <th className="py-3 px-4">{t("tableHeaders.email")}</th>
                <th className="py-3 px-4">{t("tableHeaders.phone")}</th>
                <th className="py-3 px-4">{t("tableHeaders.status")}</th>
                <th className="py-3 px-4 text-center">{t("tableHeaders.assignedCases")}</th>
                <th className="py-3 px-4 text-center">{t("tableHeaders.actions")}</th>
              </tr>
            </thead>
            <tbody>
              {users.map((u, idx) => (
                <tr
                  key={u._id}
                  className={`${idx % 2 === 0 ? "bg-[blue]/5" : "bg-white"} hover:bg-slate-100 transition whitespace-nowrap`}
                >
                  <td className="py-3 px-4 font-semibold">{u.name}</td>
                  <td className="py-3 px-4">
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
                  </td>
                  <td className="py-3 px-4">{u.email}</td>
                  <td className="py-3 px-4">{u.phone ? u.phone : "NP"}</td>
                  <td className="py-3 px-4">
                    <select
                      value={u.status}
                      onChange={(e) => updateStatus(u._id, e.target.value)}
                      className="border rounded px-2 py-1 text-sm w-full"
                    >
                      <option value="active">{t("status.active")}</option>
                      <option value="inactive">{t("status.inactive")}</option>
                    </select>
                  </td>
                  <td className="py-3 px-4 text-center">{u.assignedCases ? u.assignedCases : "NP"}</td>
                  <td className="py-3 px-4 flex gap-2 justify-center">
                    <button
                      onClick={() => onView(u)}
                      className="bg-[#0B1F3B] cursor-pointer text-white px-3 py-1 rounded-md hover:bg-transparent border hover:text-[#494C52] hover:border-[#0B1F3B] transition text-sm"
                    >
                      {t("actions.view")}
                    </button>
                    <button
                      onClick={() => onDelete(u._id)}
                      className="bg-[#0B1F3B] text-white cursor-pointer px-3 py-1 rounded-md hover:bg-transparent border hover:text-[#494C52] hover:border-[#0B1F3B] transition text-sm"
                    >
                      {t("actions.delete")}
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
              <label className="text-sm font-medium">{t("tableHeaders.role")}:</label>
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
            <p><strong>{t("tableHeaders.email")}:</strong> {u.email}</p>
            <p><strong>{t("tableHeaders.phone")}:</strong> {u.phone ? u.phone : "NP"}</p>
            <div className="flex items-center justify-between mt-2 gap-2">
              <select
                value={u.status}
                onChange={(e) => updateStatus(u._id, e.target.value)}
                className="border rounded px-2 py-1 text-sm"
              >
                <option value="active">{t("status.active")}</option>
                <option value="inactive">{t("status.inactive")}</option>
              </select>
              <div className="flex gap-2">
                <button
                  onClick={() => onView(u)}
                  className="bg-slate-700 text-white px-3 py-1 rounded-md hover:bg-slate-800 transition text-sm"
                >
                  {t("actions.view")}
                </button>
                <button
                  onClick={() => onDelete(u._id)}
                  className="bg-red-600 text-white px-3 py-1 rounded-md hover:bg-red-700 transition text-sm"
                >
                  {t("actions.delete")}
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
