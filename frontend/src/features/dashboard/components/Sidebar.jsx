import { useState } from "react";
import {
  LayoutDashboard,
  FileCheck,
  Archive,
  BarChart3,
  Users,
  Bell,
  Scale,
  FolderOpen,
  LogOut,
  Menu,
  X,
} from "lucide-react";
import { NavLink, useNavigate } from "react-router-dom";
import { useLogoutMutation } from "../../auth/api/authApi";
import { useDispatch } from "react-redux";
import { clearProfile } from "../../auth/authSlice";

const Sidebar = () => {
  const [logout, { isLoading }] = useLogoutMutation();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [mobileOpen, setMobileOpen] = useState(false);

  const links = [
    { name: "Overview", icon: <LayoutDashboard size={22} />, path: "/" },
    { name: "All Cases", icon: <FolderOpen size={22} />, path: "all-cases" },
    { name: "Pending Sessions", icon: <FileCheck size={22} />, path: "pending-sessions" },
    { name: "Archive", icon: <Archive size={22} />, path: "archive" },
    { name: "Reports", icon: <BarChart3 size={22} />, path: "reports" },
    { name: "Reminders", icon: <Bell size={22} />, path: "reminders" },
    { name: "Team", icon: <Users size={22} />, path: "team" },
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
        className="lg:hidden fixed top-4 left-4 z-[60] p-2 bg-white rounded-lg shadow-md"
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
          w-55
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
            <h2 className="text-sm font-semibold text-white">
              Justice Law Firm
            </h2>
            <p className="text-sm text-blue-200">
              Managing Director
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
            >
              {({ isActive }) => (
                <div
                  className={`group relative flex items-center gap-3 px-5 py-2 mx-2 my-1 rounded-lg
                    overflow-hidden transition-all duration-300
                    ${isActive
                      ? "bg-white text-[#0B1F3B] shadow-lg"
                      : "text-white hover:bg-white hover:text-[#0B1F3B]"}`}
                >
                  <span
                    className={`absolute left-0 top-0 h-full w-1 bg-white rounded-r
                      transition-opacity duration-300
                      ${isActive ? "opacity-100" : "opacity-0 group-hover:opacity-100"}`}
                  />
                  <span className="transition-transform duration-300 group-hover:scale-110">
                    {link.icon}
                  </span>
                  <span className="text-sm font-medium">{link.name}</span>
                </div>
              )}
            </NavLink>
          ))}
        </nav>

        {/* Logout */}
        <div className="px-4 mb-4">
          <button
            onClick={handleLogout}
            className="group flex items-center gap-3 px-4 py-3 w-full rounded-lg
              transition-all duration-300
              text-white hover:bg-red-500 hover:shadow-lg"
          >
            <LogOut size={22} className="group-hover:rotate-12 transition-transform" />
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
