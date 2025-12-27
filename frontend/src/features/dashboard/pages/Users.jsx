import React, { useState, useEffect, useMemo } from "react";
import { Users, UserPlus, UserCheck, TrendingDown } from "lucide-react";
import { useTranslation } from "react-i18next";

import UserStats from "../components/users/UserStats";
import UsersHeader from "../components/users/UsersHeader";
import UserTable from "../components/users/UserTable";
import UserForm from "../components/users/UserForm";
import ViewUserModel from "../components/users/ViewUserModal";
import UserDeleteModal from "../components/users/UserDeleteModal";

import {
  useAllUsersQuery,
  useUserStatsQuery,
  useUpdateRoleMutation,
  useAddUserMutation,
  useDeleteUserMutation,
} from "../api/directorApi";

const UsersPage = () => {
  const { t, i18n } = useTranslation("usersPage");
  const isRTL = i18n.language === "ar";

  const [search, setSearch] = useState("");
  const { data: usersData } = useAllUsersQuery(search);
  const { data: userStats } = useUserStatsQuery();

  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(window.innerWidth >= 1024);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    role: "lawyer",
    password: "",
    confirmPassword: "",
  });

  const roles = [
    { value: "director", label: t("roles.director") },
    { value: "secretary", label: t("roles.secretary") },
    { value: "lawyer", label: t("roles.lawyer") },
    { value: "approvingLawyer", label: t("roles.approvingLawyer") },
  ];

  const [updateRoleApi] = useUpdateRoleMutation();
  const [addUserApi] = useAddUserMutation();
  const [deleteUserApi] = useDeleteUserMutation();

  // Sync local state with API data
  useEffect(() => {
    if (usersData?.users) setUsers(usersData.users);
  }, [usersData]);

  // Handle sidebar resize
  useEffect(() => {
    const handleResize = () => setSidebarOpen(window.innerWidth >= 1024);
    const handleSidebarToggle = () => {
      const sidebar = document.querySelector("aside");
      if (sidebar) setSidebarOpen(sidebar.classList.contains("w-64"));
    };
    window.addEventListener("resize", handleResize);
    const interval = setInterval(handleSidebarToggle, 100);
    return () => {
      window.removeEventListener("resize", handleResize);
      clearInterval(interval);
    };
  }, []);

  // Update role
  const updateRole = async (_id, role) => {
    try {
      await updateRoleApi({ id: _id, data: { role } }).unwrap();
      setUsers((prev) => prev.map((u) => (u._id === _id ? { ...u, role } : u)));
    } catch (err) {
      console.error("Error updating role:", err);
    }
  };

  // Update status
  const updateStatus = async (_id, status) => {
    try {
      await updateRoleApi({ id: _id, data: { status } }).unwrap();
      setUsers((prev) => prev.map((u) => (u._id === _id ? { ...u, status } : u)));
    } catch (err) {
      console.error("Error updating status:", err);
    }
  };

  // Add user
  const handleAddUser = async (e) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) return alert(t("passwordMismatch"));
    try {
      const response = await addUserApi(formData).unwrap();
      setUsers((prev) => [...prev, response.user]);
      setShowAddModal(false);
      setFormData({ name: "", email: "", phone: "", role: "lawyer", password: "", confirmPassword: "" });
    } catch (err) {
      console.error("Error adding user:", err);
    }
  };

  // Delete user
  const handleDelete = (id) => {
    setSelectedUserId(id);
    setShowDeleteModal(true);
  };
  const confirmDelete = async () => {
    try {
      await deleteUserApi(selectedUserId).unwrap();
      setUsers((prev) => prev.filter((u) => u._id !== selectedUserId));
      setShowDeleteModal(false);
    } catch (err) {
      console.error("Error deleting user:", err);
    }
  };

  // Stats
  const stats = useMemo(() => {
    if (!userStats?.data) return [];
    return [
      { title: t("stats.totalUsers"), value: userStats.data.totalUsers, icon: <Users size={20} />, color: "text-[#494C52]" },
      { title: t("stats.lawyers"), value: userStats.data.lawyers, icon: <UserPlus size={20} />, color: "text-[#494C52]" },
      { title: t("stats.approvingLawyers"), value: userStats.data.approvingLawyers, icon: <UserCheck size={20} />, color: "text-[#494C52]" },
      { title: t("stats.activeUsers"), value: userStats.data.activeUsers, icon: <TrendingDown size={20} />, color: "text-[#494C52]" }
    ];
  }, [userStats, t]);

  return (
    <div
      dir={isRTL ? "rtl" : "ltr"}
      className={`min-h-screen px-3 sm:px-4 md:px-6 lg:px-2 py-3 sm:py-4 md:py-25 transition-all duration-300 ease-in-out mt-14 md:mt-0 ${isRTL ? "lg:mr-[220px]" : "lg:ml-[220px]"}
      `}
    >
      <div className={`${isRTL ? "text-right" : "text-left"} mb-4`}>
        <h1 className="text-2xl sm:text-3xl font-bold text-[#0B1F3B] tracking-tight">{t("pageTitle")}</h1>
        <p className="text-[#0B1F3B] mt-1 text-sm sm:text-base">{t("pageSubtitle")}</p>
      </div>

      <UserStats stats={stats} isRTL={isRTL} />
      <UsersHeader search={search} setSearch={setSearch} onAdd={() => setShowAddModal(true)} t={t} isRTL={isRTL} />
      <UserTable users={users} updateStatus={updateStatus} updateRole={updateRole} roles={roles} onView={setSelectedUser} onDelete={handleDelete} isRTL={isRTL} />

      <UserForm show={showAddModal} onClose={() => setShowAddModal(false)} onSubmit={handleAddUser} formData={formData} setFormData={setFormData} roles={roles} isRTL={isRTL} />
      <ViewUserModel user={selectedUser} onClose={() => setSelectedUser(null)} isRTL={isRTL} />
      <UserDeleteModal show={showDeleteModal} onClose={() => setShowDeleteModal(false)} onDelete={confirmDelete} isRTL={isRTL} />
    </div>
  );
};

export default UsersPage;
