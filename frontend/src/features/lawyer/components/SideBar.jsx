import { useState, useEffect } from "react";
import {
  Bell,
  Home,
  LogOut,
  FileText,
  Archive,
  ChevronLeft,
  ChevronRight,
  Scale,
  Calendar,
} from "lucide-react";
import { NavLink, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { clearProfile } from "../../auth/authSlice";
import { useLogoutMutation } from "../../auth/api/authApi";

const Sidebar = () => {
  const [isOpen, setIsOpen] = useState(window.innerWidth >= 768 ? true : false);
  const [isDesktop, setIsDesktop] = useState(window.innerWidth >= 768);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [logout] = useLogoutMutation();

  useEffect(() => {
    const handleResize = () => {
      const desktop = window.innerWidth >= 768;
      setIsDesktop(desktop);
      setIsOpen(desktop ? true : false);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const links = [
    { name: "Overview", icon: <Home size={16} />, path: "." },
    { name: "My Cases", icon: <FileText size={16} />, path: "my-cases" },
    { name: "My Sessions", icon: <Calendar size={16} />, path: "sessions" },
    { name: "Archive", icon: <Archive size={16} />, path: "archive" },
    { name: "Notifications", icon: <Bell size={16} />, path: "notifications" },
  ];

  const toggleSidebar = () => setIsOpen((prev) => !prev);

  const handleLinkClick = () => {
    if (!isDesktop) setIsOpen(false);
  };

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
      {/* Mobile Overlay */}
      {!isDesktop && isOpen && (
        <div
          onClick={() => setIsOpen(false)}
          className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40"
        />
      )}

      {/* Sidebar Toggle Button */}
      <button
        onClick={toggleSidebar}
        className={`fixed top-4 p-2 rounded-lg shadow-md z-50
          bg-[white] text-[#0B1F3B]
          
          transition-all duration-300
          ${isDesktop ? (isOpen ? "left-48" : "left-10") : isOpen ? "left-48" : "left-4"}
        `}
      >
        {isOpen ? <ChevronLeft size={20} /> : <ChevronRight size={20} />}
      </button>

      {/* Sidebar */}
      <aside
        className={`fixed lg:static inset-y-0 left-0 z-40
        bg-[#0B1F3B] backdrop-blur-xl
        text-slate-700 border-r border-blue-100 shadow-lg
        transition-all duration-300 ease-in-out
        flex flex-col
        ${isOpen ? "w-52" : "w-14"}
        `}
      >
        {/* Header */}
        <div className="h-16 flex items-center justify-center border-b border-blue-100 px-2">
          {isOpen ? (
            <div className="flex items-center gap-2">
              <div className="p-1.5 bg-[white] rounded-lg shadow-sm">
                <Scale size={20} className="text-[#0B1F3B]" />
              </div>
              <div>
                <h1 className="text-sm font-semibold text-[#f8f8fa]">Lawyer Portal</h1>
                <p className="text-[10px] text-[white]">Case Management</p>
              </div>
            </div>
          ) : (
            <div className="p-1.5 bg-[white] rounded-lg shadow-sm">
              <Scale size={20} className="text-[#0B1F3B]" />
            </div>
          )}
        </div>

        {/* Navigation Menu */}
        <nav className="mt-6 px-2 flex-1 overflow-y-auto">
          {links.map((link, i) => (
            <NavLink
              key={i}
              to={link.path}
              onClick={handleLinkClick}
              className={({ isActive }) =>
                `flex items-center px-3 py-2 mb-1 rounded-md transition-all duration-200 ${
                  isOpen ? "gap-3" : "justify-center"
                } ${
                  isActive
                    ? "bg-white text-[#0B1F3B] font-medium shadow-sm"
                    : "text-white hover:bg-white hover:text-[#0B1F3B] hover:shadow-sm"
                }`
              }
            >
              <span className="flex-shrink-0">{link.icon}</span>
              {isOpen && (
                <span className="text-xs font-medium">{link.name}</span>
              )}
            </NavLink>
          ))}
        </nav>

        {/* Logout */}
        <div className="px-2 pb-4 border-t border-blue-100 pt-2">
          <button
            onClick={handleLogout}
            className={`flex w-full items-center px-3 py-2 rounded-md
              text-white hover:text-red-600 hover:bg-red-50
              transition-all duration-200 ${
                isOpen ? "gap-3" : "justify-center"
              }`}
          >
            <LogOut size={16} className="flex-shrink-0" />
            {isOpen && (
              <span className="text-xs font-medium">Logout</span>
            )}
          </button>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
