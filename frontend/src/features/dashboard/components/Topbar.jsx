
import { ChevronDown, LogOut, User } from "lucide-react";
import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { clearProfile, selectUserProfile } from "../../auth/authSlice";
import { NavLink, useNavigate } from "react-router-dom";
import { useLogoutMutation } from "../../auth/api/authApi";

const Topbar = () => {
  const dispatch = useDispatch();
  const user = useSelector(selectUserProfile);
  const [isDropdownOpen, setDropdownOpen] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(window.innerWidth >= 1024);
  const navigate = useNavigate();
  const [logout, { isLoading }] = useLogoutMutation();

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (!e.target.closest(".dropdown-container")) setDropdownOpen(false);
    };
    const handleEsc = (e) => {
      if (e.key === "Escape") setDropdownOpen(false);
    };
    document.addEventListener("click", handleClickOutside);
    document.addEventListener("keydown", handleEsc);
    return () => {
      document.removeEventListener("click", handleClickOutside);
      document.removeEventListener("keydown", handleEsc);
    };
  }, []);

  // Watch for sidebar changes
  useEffect(() => {
    const handleResize = () => {
      const desktop = window.innerWidth >= 1024;
      setSidebarOpen(desktop);
    };

    const handleSidebarToggle = () => {
      const sidebar = document.querySelector("aside");
      if (sidebar) {
        const isOpen = sidebar.classList.contains("w-64");
        setSidebarOpen(isOpen);
      }
    };

    window.addEventListener("resize", handleResize);
    const interval = setInterval(handleSidebarToggle, 100);
    return () => {
      window.removeEventListener("resize", handleResize);
      clearInterval(interval);
    };
  }, []);

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
  }

  return (
    <header
      className={`fixed top-0 z-3 left-0 right-0 h-16 sm:h-20
      bg-[#0B1F3B]
      shadow-md border-b border-b border-[#ffff] bor
      flex items-center justify-between
      px-4 sm:px-6 md:px-10 md:z-[40]
      transition-all duration-300 ease-in-out
      lg:left-${sidebarOpen ? "64" : "20"} lg:right-0
      `}
    >
      {/* Left Quick Stats */}
      <div className={`flex items-center gap-6 sm:gap-8  ${sidebarOpen ? "ml-20 md:ml-[300px]" : "ml-15 md:ml-[130px]"}`}>
        <div className="text-right sm:text-center">
          <p className="text-sm  text-wrap sm:text-xs text-white">Active Cases</p>
          <p className="text-lg font-semibold text-slate-200">24</p>
        </div>
        <div className="text-right sm:text-center whitespace-nowrap">
          <p className="text-sm text-wrap sm:text-xs text-white">Today's Hearings</p>
          <p className="text-lg  font-semibold text-slate-200">3</p>
        </div>
      </div>


      {/* Profile Dropdown */}
      <div className="relative dropdown-container">
        <button
          onClick={() => setDropdownOpen(!isDropdownOpen)}
          className="flex items-center gap-3 p-1 sm:p-1.5 rounded-2xl 
               bg-white/80 hover:bg-white 
               border border-blue-100
               shadow-sm hover:shadow-md
               transition-all duration-200"
        >
          <img
            src="https://ui-avatars.com/api/?name=John+Doe&background=3b82f6&color=fff&bold=true&size=128"
            alt="Director Avatar"
            className="w-9 h-9 sm:w-10 sm:h-10 rounded-full border-2 border-[#A48C65] shadow-sm object-cover"
          />
          <div className="hidden sm:block text-left">
            <p className="text-sm font-semibold text-slate-800">{user?.name?user.name:""}</p>
            <p className="text-xs text-slate-500">{user?.role ? user.role.charAt(0).toUpperCase() + user.role.slice(1) : ""}</p>
          </div>
          <ChevronDown
            size={14}
            className={`text-slate-500 transition-transform duration-200 ${isDropdownOpen ? "rotate-180" : ""
              }`}
          />
        </button>

        {/* Dropdown Menu */}
        {isDropdownOpen && (
          <div
            className="absolute right-0 mt-3 w-52 bg-white/95 border border-blue-100 
                 rounded-2xl shadow-xl py-3 z-50 backdrop-blur-xl"
          >
            <div className="px-4 py-2 border-b border-blue-100">
              <p className="text-xs text-slate-500">Signed in as</p>
              <p className="text-sm font-semibold text-slate-800 truncate">
                {user?.email}
              </p>
            </div>

            <div className="py-2">
              <NavLink to ="/my-profile" className="flex items-center gap-3 w-full px-4 py-2 text-slate-600 hover:bg-blue-50 hover:text-[#A48C65] transition-colors duration-200 text-sm font-medium">
                <User size={16} /> My Profile
              </NavLink>
            </div>

            <div className="border-t border-blue-100 pt-2">
              <button
                onClick={handleLogout}
                disabled={isLoading}
                className="flex items-center gap-3 w-full px-4 py-2 text-slate-600 hover:bg-blue-50 hover:text-[#A48C65] transition-colors duration-200 text-sm font-medium"
              >
                <LogOut size={16} />
                {isLoading ? "Logging out..." : "Sign Out"}
              </button>
            </div>
          </div>
        )}
      </div>

    </header>
  );
};

export default Topbar;
