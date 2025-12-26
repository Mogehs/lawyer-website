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
} from "lucide-react";
import { NavLink, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { clearProfile } from "../../auth/authSlice";
import { useLogoutMutation } from "../../auth/api/authApi";

const Sidebar = () => {
  const [isOpen, setIsOpen] = useState(window.innerWidth >= 1024);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [logout] = useLogoutMutation();

  // ✅ Secretary-specific menu items
  const links = [
    { name: "Overview", icon: <Home size={16} />, path: "." },
    { name: "Clients", icon: <Users size={16} />, path: "clients" },
    { name: "Cases", icon: <Scale size={16} />, path: "case-management" },
    { name: "Invoices", icon: <FileText size={16} />, path: "invoices" },
    { name: "Reminders", icon: <Bell size={16} />, path: "reminders" },
    {
      name: "Archive",
      icon: <FolderArchive size={16} />,
      path: "archive-cases",
    },
  ];

  const toggleSidebar = () => setIsOpen(!isOpen);

  const handleLogout = async () => {
    try {
      await logout().unwrap();
      dispatch(clearProfile());
      navigate("/login");
    } catch (error) {
      console.error("Logout error:", error);
      // Clear profile and navigate even if API fails
      dispatch(clearProfile());
      navigate("/login");
    }
  };

  return (
    <>
      {/* Mobile Menu Button */}
      <button
        onClick={toggleSidebar}
        className="lg:hidden fixed top-4 left-4 z-50 p-2 rounded-lg bg-gradient-to-r from-[#BCB083] to-[#A48C65] text-white shadow-md"
      >
        {isOpen ? <X size={20} /> : <Menu size={20} />}
      </button>

      {/* Sidebar */}
      <aside
        className={`fixed lg:static inset-y-0 left-0 z-40 bg-[#0B1F3B] backdrop-blur-xl text-white border-r border-blue-100 shadow-lg transition-all duration-300 ease-in-out ${
          isOpen ? "w-52" : "w-14"
        } overflow-hidden`}
      >
        {/* Header */}
        <div className="h-16 flex items-center justify-center border-b border-blue-100 px-2">
          {isOpen ? (
            <div className="flex items-center gap-2">
              <div className="p-1.5 bg-white rounded-lg shadow-sm">
                <Scale className="text-[#0B1F3B]" size={20} />
              </div>
              <div>
                <h1 className="text font-semibold text-white">Secretary</h1>
                <p className="text-[12px] text-slate-200">Case Management</p>
              </div>
            </div>
          ) : (
            <div className="p-1.5 bg-[#A48C65] rounded-lg shadow-sm">
              <Scale className="text-white" size={20} />
            </div>
          )}
        </div>

        {/* Navigation Links */}
        <nav className="mt-6 px-2">
          {links.map((link, i) => (
            <NavLink
              key={i}
              to={link.path}
              end={link.path === "."}
              className={({ isActive }) =>
                `flex items-center my-5 gap-3 px-3 py-3 mb-1 rounded-md transition-all duration-200 ${
                  isActive
                    ? "bg-white text-[#0B1F3B] font-medium shadow-sm"
                    : "text-white hover:bg-white/80 hover:text-[#0B1F3B]"
                }`
              }
            >
              {link.icon}
              {isOpen && <span className=" font-medium">{link.name}</span>}
            </NavLink>
          ))}
        </nav>

        {/* Toggle Button for Desktop */}
        <button
          onClick={toggleSidebar}
          className="hidden lg:flex absolute bottom-4 right-2 p-1.5 rounded-md bg-white text-[#0B1F3B] transition-colors shadow-sm"
        >
          {isOpen ? <X size={16} /> : <Menu size={16} />}
        </button>
      </aside>

      {/* Overlay for Mobile */}
      {isOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black bg-opacity-50 z-30"
          onClick={toggleSidebar}
        />
      )}
    </>
  );
};

export default Sidebar;
