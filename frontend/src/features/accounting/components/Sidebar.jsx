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

const Sidebar = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [logout, { isLoading }] = useLogoutMutation();

  const menuItems = [
    {
      name: "Dashboard",
      nameAr: "لوحة التحكم",
      icon: LayoutDashboard,
      path: "/accountant/dashboard",
    },
    {
      name: "Invoices",
      nameAr: "الفواتير",
      icon: FileText,
      path: "/accountant/invoices",
    },
    {
      name: "Payments",
      nameAr: "المدفوعات",
      icon: CreditCard,
      path: "/accountant/payments",
    },
    {
      name: "Expenses",
      nameAr: "المصروفات",
      icon: TrendingDown,
      path: "/accountant/expenses",
    },
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
      <button
        onClick={() => setMobileOpen(true)}
        className="lg:hidden fixed top-4 left-4 z-[60] p-2 rounded-lg
        bg-gradient-to-r from-[#0B1F3B] to-[#0B1F3B] text-white shadow-md"
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
        {/* Mobile Close */}
        <button
          onClick={() => setMobileOpen(false)}
          className="lg:hidden absolute top-4 right-4 text-white"
        >
          <X size={22} />
        </button>

        {/* Header */}
        <div className="h-16 flex items-center gap-3 px-4 border-b border-blue-100">
          <div className="p-2 bg-white rounded-lg shadow-sm">
            <Coins size={22} className="text-[#0B1F3B]" />
          </div>
          <div>
            <h1 className="text-sm font-semibold text-white">Accounting</h1>
            <p className="text-xs text-slate-200">Finance Portal</p>
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
                <div className="flex flex-col">
                  <span className="text-sm">{item.name}</span>
                  <span className="text-[10px] opacity-70">
                    {item.nameAr}
                  </span>
                </div>
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
              {isLoading ? "Logging out..." : "Logout"}
            </span>
          </button>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
