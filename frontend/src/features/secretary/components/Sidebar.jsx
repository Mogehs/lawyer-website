import { useState } from "react";
import {
  Users,
  Bell,
  FolderArchive,
  Scale,
  Home,
  FileText,
  Menu,
  X,
  LogOut, // ✅ Add LogOut icon
} from "lucide-react";
import { NavLink, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { clearProfile } from "../../auth/authSlice";
import { useLogoutMutation } from "../../auth/api/authApi";

const Sidebar = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [logout, { isLoading }] = useLogoutMutation();

  const links = [
    { name: "Overview", icon: <Home size={20} />, path: "/" },
    { name: "Clients", icon: <Users size={20} />, path: "clients" },
    { name: "Cases", icon: <Scale size={20} />, path: "case-management" },
    { name: "Invoices", icon: <FileText size={20} />, path: "invoices" },
    { name: "Reminders", icon: <Bell size={20} />, path: "reminders" },
    { name: "Archive", icon: <FolderArchive size={20} />, path: "archive-cases" },
  ];

  const handleLogout = async () => {
    try {
      await logout().unwrap();
    } finally {
      dispatch(clearProfile());
      navigate("/login");
    }
  };

  return (
    <>
      {/* Mobile Menu Button */}
      <button
        onClick={() => setMobileOpen(true)}
        className="lg:hidden fixed top-4 left-4 z-50 p-2 bg-white rounded-lg shadow-md"
      >
        <Menu size={22} />
      </button>

      {/* Mobile Overlay */}
      {mobileOpen && (
        <div
          onClick={() => setMobileOpen(false)}
          className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40 lg:hidden"
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed top-0 left-0 h-full z-50 flex flex-col
          bg-[#0B1F3B] border-r border-blue-100 shadow-lg
          transition-transform duration-300 ease-in-out
          w-56
          ${mobileOpen ? "translate-x-0" : "-translate-x-full"}
          lg:translate-x-0`}
      >
        {/* Mobile Close Button */}
        <button
          onClick={() => setMobileOpen(false)}
          className="lg:hidden absolute top-4 right-4 text-white"
        >
          <X size={22} />
        </button>

        {/* Header */}
        <div className="flex items-center gap-3 px-5 py-3 border-b border-blue-100">
          <div className="p-2 bg-white rounded-xl shadow-md transition-all duration-300 hover:scale-110 hover:rotate-3">
            <Scale size={24} className="text-[#0B1F3B]" />
          </div>
          <div>
            <h2 className="text-sm font-lg text-white">
              Secretary Dashboard
            </h2>
            <p className="text-xs text-blue-200">
              Case Management
            </p>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 py-4 overflow-y-auto">
          {links.map((link, i) => (
            <NavLink
              key={i}
              to={link.path}
              onClick={() => setMobileOpen(false)}
              className={({ isActive }) =>
                `flex items-center gap-3 px-5 py-2 mx-2 my-1 rounded-lg
                 transition-all duration-300
                 ${isActive
                   ? "bg-white text-[#0B1F3B] shadow-lg font-medium"
                   : "text-white hover:bg-white hover:text-[#0B1F3B]"}`
              }
            >
              {link.icon}
              <span className="text-sm font-medium">{link.name}</span>
            </NavLink>
          ))}
        </nav>

        {/* Logout */}
        <div className="px-4 mb-4 mt-auto">
          <button
            onClick={handleLogout}
            className="flex items-center cursor-pointer gap-3 px-4 py-3 w-full rounded-lg text-white bg-red-500 hover:bg-red-600 transition-all duration-300"
          >
            <LogOut size={20} />
            <span className="text-sm font-medium">
              {isLoading ? "Logging Out..." : "Logout"}
            </span>
          </button>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
