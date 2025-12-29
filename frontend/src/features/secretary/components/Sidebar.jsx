import { useState, useEffect } from "react";
import {
  Users,
  Bell,
  FolderArchive,
  Scale,
  Home,
  FileText,
  Menu,
  X,
  LogOut,
} from "lucide-react";
import { NavLink, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { clearProfile } from "../../auth/authSlice";
import { useLogoutMutation } from "../../auth/api/authApi";
import { useTranslation } from "react-i18next";
import i18n from "../../../i18n/secretary/index";
const Sidebar = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [logout, { isLoading }] = useLogoutMutation();
  const { t, i18n } = useTranslation("sidebar");

  const isRTL = i18n.dir() === "rtl";

  // Apply RTL globally (safe if already handled elsewhere)
  useEffect(() => {
    document.documentElement.dir = isRTL ? "rtl" : "ltr";
  }, [isRTL]);

  const links = [
    { key: "overview", icon: <Home size={20} />, path: "/" },
    { key: "clients", icon: <Users size={20} />, path: "clients" },
    { key: "cases", icon: <Scale size={20} />, path: "case-management" },
    { key: "invoices", icon: <FileText size={20} />, path: "invoices" },
    { key: "reminders", icon: <Bell size={20} />, path: "reminders" },
    { key: "archive", icon: <FolderArchive size={20} />, path: "archive-cases" },
  ];

  const handleLogout = async () => {
    try {
      await logout().unwrap();
    } catch (err) {
      console.error("Logout failed:", err);
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
        className={`lg:hidden fixed top-4 z-50 p-2 bg-white rounded-lg shadow-md
          ${isRTL ? "right-4" : "left-4"}`}
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
        className={`fixed top-0 h-full z-50 flex flex-col
          bg-[#0B1F3B] border-blue-100 shadow-lg
          transition-transform duration-300 ease-in-out
          w-56
          ${isRTL ? "right-0 border-l" : "left-0 border-r"}
          ${mobileOpen ? "translate-x-0" : isRTL ? "translate-x-full" : "-translate-x-full"}
          lg:translate-x-0`}
      >
        {/* Mobile Close Button */}
        <button
          onClick={() => setMobileOpen(false)}
          className={`lg:hidden absolute top-4 text-white
            ${isRTL ? "left-4" : "right-4"}`}
        >
          <X size={22} />
        </button>

        {/* Header */}
        <div className="flex items-center gap-3 px-5 py-3 border-b border-blue-100">
          <div className="p-2 bg-white rounded-xl shadow-md transition-all duration-300 hover:scale-110 hover:rotate-3">
            <Scale size={24} className="text-[#0B1F3B]" />
          </div>
          <div>
            <h2 className="text-sm font-medium text-white">
              {t("dashboardTitle")}
            </h2>
            <p className="text-xs text-blue-200">
              {t("dashboardSubtitle")}
            </p>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 py-4 overflow-y-auto">
          {links.map((link) => (
            <NavLink
              key={link.key}
              to={link.path}
              onClick={() => setMobileOpen(false)}
              className={({ isActive }) =>
                `flex items-center gap-3 px-5 py-2 mx-2 my-1 rounded-lg
                 transition-all duration-300
                 ${
                   isActive
                     ? "bg-white text-[#0B1F3B] shadow-lg font-medium"
                     : "text-white hover:bg-white hover:text-[#0B1F3B]"
                 }`
              }
            >
              {link.icon}
              <span className="text-sm font-medium">
                {t(link.key)}
              </span>
            </NavLink>
          ))}
        </nav>

        {/* Logout */}
        <div className="px-4 mb-4 mt-auto">
          <button
            onClick={handleLogout}
            disabled={isLoading}
            className="flex items-center gap-3 px-4 py-3 w-full rounded-lg
              text-white bg-red-500 hover:bg-red-600 transition-all duration-300
              disabled:opacity-50"
          >
            <LogOut size={20} />
            <span className="text-sm font-medium">
              {isLoading ? t("loggingOut") : t("logout")}
            </span>
          </button>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
