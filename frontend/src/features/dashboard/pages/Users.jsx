import React, { useState, useEffect, useMemo } from "react";
import { Users, UserPlus, UserCheck, TrendingDown } from "lucide-react";
import UserStats from "../components/users/UserStats";
import UsersHeader from "../components/users/UsersHeader";
import UserTable from "../components/users/UserTable";
import UserForm from "../components/users/UserForm";
// import ViewUserModal from "../components/users/ViewuserModal";
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
    role: "Lawyer",
    password: "",
    confirmPassword: "",
  });
  const roles = [
    { value: "director", label: "Managing Director" },
    { value: "secretary", label: "Secretary" },
    { value: "lawyer", label: "Lawyer" },
    { value: "approvingLawyer", label: "Approving Lawyer" },
  ];

  const [updateRoleApi] = useUpdateRoleMutation();
  const [addUserApi] = useAddUserMutation();
  const [deleteUserApi] = useDeleteUserMutation();

  // Sync local state with API data
  useEffect(() => {
    if (usersData?.users) setUsers(usersData.users);
  }, [usersData]);

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

  // Update role
  const updateRole = async (_id, role) => {
    try {
      await updateRoleApi({ id: _id, data: { role } }).unwrap();
      setUsers(prev => prev.map(u => u._id === _id ? { ...u, role } : u));
    } catch (err) {
      console.error("Error updating role:", err);
    }
  };

  // Update status
  const updateStatus = async (_id, status) => {
    try {
      await updateRoleApi({ id: _id, data: { status } }).unwrap();
      setUsers(prev => prev.map(u => u._id === _id ? { ...u, status } : u));
    } catch (err) {
      console.error("Error updating status:", err);
    }
  };

  // Add user
  const handleAddUser = async (e) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) return alert("Passwords do not match");
    try {
      const response = await addUserApi(formData).unwrap();
      setUsers(prev => [...prev, response.user]);
      setShowAddModal(false);
      setFormData({ name: "", email: "", phone: "", role: "Lawyer", password: "", confirmPassword: "" });
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
      setUsers(prev => prev.filter(u => u._id !== selectedUserId));
      setShowDeleteModal(false);
    } catch (err) {
      console.error("Error deleting user:", err);
    }
  };

  // Stats
  const stats = useMemo(() => {
    if (!userStats?.data) return [];
    return [
      { title: "Total Users", value: userStats.data.totalUsers, icon: <Users size={20} />, color: "text-[#494C52]" },
      { title: "Lawyers", value: userStats.data.lawyers, icon: <UserPlus size={20} />, color: "text-[#494C52]" },
      { title: "Approving Lawyers", value: userStats.data.approvingLawyers, icon: <UserCheck size={20} />, color: "text-[#494C52]" },
      { title: "Active Users", value: userStats.data.activeUsers, icon: <TrendingDown size={20} />, color: "text-[#494C52]" },
    ];
  }, [userStats]);

  return (
    <div className={`min-h-screen px-3 sm:px-4 md:px-6 lg:px-2 py-3 sm:py-4 md:py-25 transition-all duration-300 ease-in-out mt-14 md:mt-0 ${sidebarOpen ? "lg:ml-64 md:ml-64" : "lg:ml-20 md:ml-15"}`}>
      <div className="text-center md:text-left">
        <h1 className="text-2xl sm:text-3xl font-bold text-[#494C52] tracking-tight">Team Management</h1>
        <p className="text-[#494C52] mt-1 text-sm sm:text-base">Manage your team members, roles, and access permissions.</p>
      </div>

      <UserStats stats={stats} />
      <UsersHeader search={search} setSearch={setSearch} onAdd={() => setShowAddModal(true)} />
      <UserTable users={users} updateStatus={updateStatus} updateRole={updateRole} roles={roles} onView={setSelectedUser} onDelete={handleDelete} />

      <UserForm show={showAddModal} onClose={() => setShowAddModal(false)} onSubmit={handleAddUser} formData={formData} setFormData={setFormData} roles={roles} />
      <ViewUserModel user={selectedUser} onClose={() => setSelectedUser(null)} />
      <UserDeleteModal show={showDeleteModal} onClose={() => setShowDeleteModal(false)} onDelete={confirmDelete} />
    </div>
  );
};

export default UsersPage;
