import {
  LayoutDashboard,
  FileText,
  CreditCard,
  TrendingDown,
  Menu,
  X,
  DollarSign,
} from "lucide-react";
import { useState } from "react";
import { Link, useLocation } from "react-router-dom";

const Sidebar = () => {
  const [isOpen, setIsOpen] = useState(window.innerWidth >= 1024);
  const location = useLocation();

  const toggleSidebar = () => setIsOpen(!isOpen);

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
        className={`fixed lg:static inset-y-0 left-0 z-40 bg-[#0B1F3B] backdrop-blur-xl text-slate-200 border-r border-blue-100 shadow-lg transition-all duration-300 ease-in-out ${
          isOpen ? "w-56" : "w-14"
        } overflow-hidden`}
      >
        {/* Header */}
        <div className="h-16 flex items-center justify-center border-b border-blue-100 px-2">
          {isOpen ? (
            <div className="flex items-center gap-2">
              <div className="p-1.5 bg-white rounded-lg shadow-sm">
                <DollarSign className="text-[#0B1F3B]" size={20} />
              </div>
              <div>
                <h1 className="text-sm font-semibold text-white">Accounting</h1>
                <p className="text-[10px] text-slate-200">Finance Portal</p>
              </div>
            </div>
          ) : (
            <div className="p-1.5 bg-[#A48C65] rounded-lg shadow-sm">
              <DollarSign className="text-white" size={20} />
            </div>
          )}
        </div>

        {/* Navigation Menu */}
        <nav className="mt-6 px-2">
          {menuItems.map((item) => {
            const Icon = item.icon;
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center gap-3 px-3 py-2 mb-1 rounded-md transition-all duration-200 ${
                  isActive(item.path)
                    ? "bg-white text-[#0B1F3B] font-medium shadow-sm"
                    : "text-slate-200 hover:bg-white/80 hover:text-[#0B1F3B]"
                }`}
              >
                <Icon size={16} className="flex-shrink-0" />
                {isOpen && (
                  <div className="flex flex-col">
                    <span className="text-sm font-medium">{item.name}</span>
                    <span className="text-[10px] opacity-70">
                      {item.nameAr}
                    </span>
                  </div>
                )}
              </Link>
            );
          })}
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

