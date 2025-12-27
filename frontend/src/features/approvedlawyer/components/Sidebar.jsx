import { useState, useEffect } from "react";
import { Scale, FileText, LogOut, Menu, X } from "lucide-react";
import { NavLink, useNavigate } from "react-router-dom";
import { useLogoutMutation } from "../../auth/api/authApi";
import { useDispatch } from "react-redux";
import { clearProfile } from "../../auth/authSlice";

const Sidebar = () => {
  const [isOpen, setIsOpen] = useState(window.innerWidth >= 1024);
  const [logout, { isLoading }] = useLogoutMutation();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    const handleResize = () => {
      const desktop = window.innerWidth >= 1024;
      setIsOpen(desktop);
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const links = [
    { name: "Case Management", icon: <FileText size={20} />, path: "" },
  ];

  const toggleSidebar = () => setIsOpen((prev) => !prev);

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
        className="lg:hidden fixed top-4 left-4 z-50 p-2 rounded-lg bg-[#0B1F3B] text-white shadow-md"
      >
        {isOpen ? <X size={20} /> : <Menu size={20} />}
      </button>

      {/* Sidebar */}
      <aside
        className={`fixed lg:static inset-y-0 left-0 z-40 bg-[#0B1F3B] backdrop-blur-xl text-slate-700 border-r border-blue-100 shadow-lg transition-all duration-300 ease-in-out ${
          isOpen ? "w-52" : "w-14"
        } overflow-hidden`}
      >
        {/* Header */}
        <div className="h-16 flex items-center justify-center border-b border-blue-100 px-2">
          {isOpen ? (
            <div className="flex items-center gap-2">
              <div className="p-1.5 bg-[white] rounded-lg shadow-sm">
                <Scale className="text-[#0B1F3B]" size={20} />
              </div>
              <div>
                <h1 className="text-sm font-semibold text-[#f8f9fd]">Approving Lawyer</h1>
                <p className="text-[10px] text-white">Case Management</p>
              </div>
            </div>
          ) : (
            <div className="p-1.5 bg-[#0B1F3B] rounded-lg shadow-sm">
              <Scale className="text-white" size={20} />
            </div>
          )}
        </div>

        {/* Navigation Links */}
        <nav className="flex-1 overflow-y-auto py-4">
          {links.map((link, i) => (
            <NavLink
              key={i}
              to={link.path}
              end
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-3 rounded-lg mx-2 my-1 transition-all duration-200
                  ${
                    isActive
                      ? "bg-[white] text-[#0B1F3B] font-medium shadow-sm"
                      : "text-slate-700 hover:bg-white/80 hover:text-[#0B1F3B] hover:shadow-sm"
                  }
                  ${isOpen ? "justify-start" : "justify-center"}
                `
              }
            >
              {link.icon}
              {isOpen && <span className="text-sm">{link.name}</span>}
            </NavLink>
          ))}
        </nav>

        {/* Logout Button */}
        <div className="border-t border-blue-100 p-2">
          <button
            onClick={handleLogout}
            disabled={isLoading}
            className={`flex w-full items-center gap-3 px-4 py-3 text-white hover:text-red-600 hover:bg-red-50 rounded-lg transition-all duration-200
              ${isOpen ? "justify-start" : "justify-center"}
            `}
          >
            <LogOut size={20} />
            {isOpen && <span className="text-sm font-medium">{isLoading ? "Logging out..." : "Logout"}</span>}
          </button>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
