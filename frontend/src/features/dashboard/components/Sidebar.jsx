import { useState, useEffect } from "react";
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
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { NavLink, useNavigate } from "react-router-dom";
import { useLogoutMutation } from "../../auth/api/authApi";
import { useDispatch } from "react-redux";
import { clearProfile } from "../../auth/authSlice";

const Sidebar = () => {
  const [logout, { isLoading }] = useLogoutMutation();
  const [isOpen, setIsOpen] = useState(false);
  const [isDesktop, setIsDesktop] = useState(window.innerWidth >= 1024);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    const handleResize = () => setIsDesktop(window.innerWidth >= 1024);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const links = [
    { name: "Overview", icon: <LayoutDashboard size={22} />, path: "/" },
    { name: "All Cases", icon: <FolderOpen size={22} />, path: "all-cases" },
    { name: "Pending Sessions", icon: <FileCheck size={22} />, path: "pending-sessions" },
    { name: "Archive", icon: <Archive size={22} />, path: "archive" },
    { name: "Reports", icon: <BarChart3 size={22} />, path: "reports" },
    { name: "Reminders", icon: <Bell size={22} />, path: "reminders" },
    { name: "Team", icon: <Users size={22} />, path: "team" },
  ];

  const toggleSidebar = () => setIsOpen(!isOpen);

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
      {/* Mobile Overlay */}
      {!isDesktop && isOpen && (
        <div
          onClick={() => setIsOpen(false)}
          className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40"
        />
      )}

      {/* Toggle Button */}
      <button
        onClick={toggleSidebar}
        className={`fixed top-4 z-[9999] p-2 rounded-full bg-white shadow-md
          transition-all duration-300 hover:scale-110 hover:bg-blue-50 hover:shadow-xl
          ${isDesktop ? (isOpen ? "left-60" : "left-16") : isOpen ? "left-[200px]" : "left-4"}
        `}
      >
        {isOpen ? <ChevronLeft size={22} /> : <ChevronRight size={22} />}
      </button>

      {/* Sidebar */}
      <aside
        className={`fixed top-0 left-0 h-full z-50 flex flex-col
          bg-[#0B1F3B] border-r border-blue-100
          transition-all duration-300 ease-in-out shadow-lg
          ${isDesktop
            ? isOpen
              ? "w-64"
              : "w-20"
            : isOpen
            ? "w-64 translate-x-0"
            : "-translate-x-full w-64"}
        `}
      >
        {/* Header */}
        <div className={`flex items-center gap-3 px-5 py-6 border-b border-blue-100
          ${isOpen ? "justify-start" : "justify-center"}`}>
          <div className="p-2 bg-white rounded-xl shadow-md
            transition-all duration-300 hover:scale-110 hover:rotate-3">
            <Scale size={24} className="text-[#0B1F3B]" />
          </div>

          {isOpen && (
            <div>
              <h2 className="text-lg font-semibold text-white">Justice Law Firm</h2>
              <p className="text-sm text-blue-200">Managing Director</p>
            </div>
          )}
        </div>

        {/* Navigation */}
        <nav className="flex-1 py-4 overflow-y-auto">
          {links.map((link, i) => (
            <NavLink key={i} to={link.path}>
              {({ isActive }) => (
                <div
                  className={`group relative flex items-center gap-3 px-5 py-3 mx-2 my-1 rounded-lg
                    overflow-hidden transition-all duration-300
                    ${isActive
                      ? "bg-white text-[#0B1F3B] shadow-lg"
                      : "text-white hover:bg-white hover:text-[#0B1F3B]"}
                    ${isOpen || !isDesktop ? "justify-start" : "justify-center"}
                  `}
                >
                  {/* Left Indicator */}
                  <span
                    className={`absolute left-0 top-0 h-full w-1 bg-white rounded-r
                      transition-opacity duration-300
                      ${isActive ? "opacity-100" : "opacity-0 group-hover:opacity-100"}
                    `}
                  />

                  {/* Icon */}
                  <span className="transition-transform duration-300 group-hover:scale-110">
                    {link.icon}
                  </span>

                  {(isOpen || !isDesktop) && (
                    <span className="text-sm font-medium">{link.name}</span>
                  )}
                </div>
              )}
            </NavLink>
          ))}
        </nav>

        {/* Logout */}
        <div className="px-4 mb-4">
          <button
            onClick={handleLogout}
            className={`group flex items-center w-full rounded-lg
              transition-all duration-300
              ${isOpen ? "gap-3 px-4 py-3 justify-start" : "justify-center py-3"}
              text-white hover:bg-red-500 hover:shadow-lg
            `}
          >
            <LogOut size={22} className="group-hover:rotate-12 transition-transform" />
            {isOpen && (
              <span className="text-sm font-medium">
                {isLoading ? "Logging Out..." : "Logout"}
              </span>
            )}
          </button>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
