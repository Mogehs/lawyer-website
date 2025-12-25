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
  Menu,
  X,
  LogOut,
  ChevronLeft,
  ChevronRight
} from "lucide-react";
import { NavLink, useNavigate } from "react-router-dom";
import { useLogoutMutation } from "../../auth/api/authApi";
import { useDispatch } from "react-redux";
import { clearProfile } from "../../auth/authSlice";

const Sidebar = () => {
  const [logout,{isLoading}] = useLogoutMutation();
  const [isOpen, setIsOpen] = useState(window.innerWidth >= 768 ? false : false);
  const [isDesktop, setIsDesktop] = useState(window.innerWidth >= 768);
  const dispatch = useDispatch();
  const navigate = useNavigate();

   useEffect(() => {
     const handleResize = () => {
       const desktop = window.innerWidth >= 1024;
       setIsDesktop(desktop);
     };
 
     const handleSidebarToggle = () => {
       const sidebar = document.querySelector('aside');
       if (sidebar) {
         const isOpen = sidebar.classList.contains('w-64');
         setIsOpen(isOpen);
       }
     };
 
     window.addEventListener('resize', handleResize);
 
     const interval = setInterval(handleSidebarToggle, 100);
 
     return () => {
       window.removeEventListener('resize', handleResize);
       clearInterval(interval);
     };
   }, []);

  const links = [
    { name: "Overview", icon: <LayoutDashboard size={22} />, },
    { name: "All Cases", icon: <FolderOpen size={22} />, path: "all-cases" },
    // { name: "Pending Signatures", icon: <FileCheck size={22} />, path: "pending-signatures" },
    { name: "Pending Sessions", icon: <FileCheck size={22} />, path: "pending-sessions" },
    { name: "Archive", icon: <Archive size={22} />, path: "archive" },
    { name: "Reports", icon: <BarChart3 size={22} />, path: "reports" },
    { name: "Reminders", icon: <Bell size={22} />, path: "reminders" },
    { name: "Team", icon: <Users size={22} />, path: "team" },
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
        ></div>
      )}

      {/* Hamburger / Close Button */}
      <button
        onClick={toggleSidebar}
        className={`fixed top-4  p-2 rounded-full shadow-md  z-[9999]
          bg-[#A48C65] text-white hover:bg-[#a48c659c] transition-all duration-300 hover:text-black
          ${isDesktop ? (isOpen ? "left-60" : "left-16") : isOpen ? "left-[200px] top-2" : "left-4 top-4"}
        `}
      >
        {isOpen ? <ChevronLeft size={22} /> : < ChevronRight size={22} />}
      </button>

      {/* Sidebar */}
      <aside
        className={`fixed top-0 left-0 h-full border-r border-blue-100
          bg-gradient-to-b from-blue-50 to-indigo-50/80 backdrop-blur-xl
          text-slate-700 shadow-lg transition-all duration-300 ease-in-out z-50
          ${isDesktop ? (isOpen ? "w-64" : "w-20") : isOpen ? "translate-x-0 w-64" : "-translate-x-full w-64"}
          flex flex-col
        `}
      >
        {/* Header */}
        <div
          className={`flex items-center gap-3 px-5 py-6 border-b border-blue-100 ${isOpen ? "justify-start" : "justify-center"
            }`}
        >
          <div className="p-2 bg-[#A48C65] rounded-xl shadow-md">
            <Scale size={24} className="text-white" />
          </div>

          {isOpen && (
            <div className="transition-all">
              <h2 className="text-lg font-semibold text-[#494C52]">
                Justice Law Firm
              </h2>
              <p className="text-xs text-slate-500">Managing Director</p>
            </div>
          )}
        </div>

        {/* Navigation Links */}
        <nav className="flex-1 overflow-y-auto py-4">
          {links.map((link, i) => (
            <NavLink
              key={i}
              to={link.path}
              onClick={handleLinkClick}
              className={({ isActive }) =>
                `flex items-center gap-3 px-5 py-3 rounded-lg mx-2 my-1 transition-all duration-200
                  ${isActive
                  ? "bg-gradient-to-r from-[#BCB083] to-[#A48C65] text-white font-medium  shadow-sm"
                  : "text-slate-700 hover:bg-white/80 hover:text-[#A48C65] hover:shadow-sm"
                }
                  ${isOpen || !isDesktop ? "justify-start" : "justify-center"}
                `
              }
            >
              {link.icon}
              {(isOpen || !isDesktop) && <span className="text-sm">{link.name}</span>}
            </NavLink>
          ))}
        </nav>

        {/* Logout Button at Bottom */}
        <div className="px-5 mt-auto mb-4">
          <button
            onClick={handleLogout}
            className={`flex w-full items-center ${isOpen ? "justify-start gap-3 px-4 py-3" : "justify-center w-full py-3"
              } text-slate-600 hover:text-[#A48C65] rounded-lg transition-all duration-200`}
          >
            <LogOut size={22} />
            {isOpen && <span className="text-sm font-medium">{isLoading?"Logging Out...":"Logout"}</span>}
          </button>
        </div>

      </aside>
    </>
  );
};

export default Sidebar;
