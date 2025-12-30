import {
  LayoutDashboard,
  FileText,
  CreditCard,
  TrendingDown,
  Coins,
  Menu,
  X,
  LogOut,
} from "lucide-react";
import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useLogoutMutation } from "../../auth/api/authApi";
import { useDispatch } from "react-redux";
import { clearProfile } from "../../auth/authSlice";
import i18n from "../../../i18n/index";
import { useTranslation } from "react-i18next";

const Sidebar = () => {
  const { t } = useTranslation("accSidebar"); // translation namespace
  const isRTL = i18n.language === "ar";

  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [logout, { isLoading }] = useLogoutMutation();

  // Menu items with keys only
  const menuItems = [
    { key: "dashboard", icon: LayoutDashboard, path: "/accountant/dashboard" },
    { key: "invoices", icon: FileText, path: "/accountant/invoices" },
    { key: "payments", icon: CreditCard, path: "/accountant/payments" },
    { key: "expenses", icon: TrendingDown, path: "/accountant/expenses" },
  ];

  const isActive = (path) => location.pathname === path;

  const handleLogout = async () => {
    try {
      await logout().unwrap();
    } finally {
      dispatch(clearProfile());
      navigate("/login");
      setMobileOpen(false);
    }
  };

  return (
    <>
      {/* Mobile Menu Button */}
      {!mobileOpen && (
        <button
          onClick={() => setMobileOpen(true)}
          className={`lg:hidden fixed top-4 z-[60] p-2 bg-white rounded-lg shadow-md ${
            isRTL ? "right-4" : "left-4"
          }`}
        >
          <Menu size={22} />
        </button>
      )}

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
          bg-[#0B1F3B] border-r border-blue-100 shadow-lg
          transition-transform duration-300 ease-in-out
          w-56
          ${isRTL ? "right-0 border-l" : "left-0 border-r"}
          ${
            mobileOpen
              ? "translate-x-0"
              : isRTL
              ? "translate-x-full"
              : "-translate-x-full"
          }
          lg:translate-x-0`}
      >
        {/* Mobile Close */}
        <button
          onClick={() => setMobileOpen(false)}
          className={`lg:hidden absolute top-4 text-white ${
            isRTL ? "left-4" : "right-4"
          }`}
        >
          <X size={22} />
        </button>

        {/* Header */}
        <div className="h-16 flex items-center gap-3 px-4 border-b border-blue-100">
          <div className="p-2 bg-white rounded-lg shadow-sm">
            <Coins size={22} className="text-[#0B1F3B]" />
          </div>
          <div>
            <h1 className="text-sm font-semibold text-white">{t("title")}</h1>
            <p className="text-xs text-slate-200">{t("subtitle")}</p>
          </div>
        </div>

        {/* Navigation */}
        <nav className="mt-6 px-2 flex-1 overflow-y-auto">
          {menuItems.map((item) => {
            const Icon = item.icon;
            return (
              <Link
                key={item.path}
                to={item.path}
                onClick={() => setMobileOpen(false)}
                className={`flex items-center gap-3 px-3 py-1 mb-1 rounded-md
                  transition-all duration-200
                  ${
                    isActive(item.path)
                      ? "bg-white text-[#0B1F3B] font-medium shadow-sm"
                      : "text-slate-200 hover:bg-white hover:text-[#0B1F3B]"
                  }`}
              >
                <Icon size={18} />
                <span className="text-sm font-medium">{t(item.key)}</span>
              </Link>
            );
          })}
        </nav>

        {/* Logout */}
        <div className="px-3 pb-4">
          <button
            onClick={handleLogout}
            className="group flex items-center gap-3 px-3 py-2 w-full rounded-md
              text-slate-200 transition-all duration-300
              hover:bg-red-500 hover:text-white hover:shadow-lg"
          >
            <LogOut
              size={18}
              className="group-hover:rotate-12 transition-transform"
            />
            <span className="text-sm font-medium">
              {isLoading ? t("loading") : t("default")}
            </span>
          </button>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
