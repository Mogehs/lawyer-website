
import { ChevronDown, LogOut, User } from "lucide-react";
import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { clearProfile, selectUserProfile } from "../../auth/authSlice";
import { useLogoutMutation } from "../../auth/api/authApi";

const Topbar = () => {
  const [isDropdownOpen, setDropdownOpen] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(window.innerWidth >= 1024);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const userProfile = useSelector(selectUserProfile);

  // Logout mutation
  const [logout, { isLoading: isLoggingOut }] = useLogoutMutation();

  // Close dropdown when clicking outside or pressing Escape
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
        const isOpen = sidebar.classList.contains("w-52");
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

  // Handle logout
  const handleLogout = async () => {
    try {
      await logout().unwrap();
      dispatch(clearProfile());
      navigate("/login");
    } catch (error) {
      console.error("Logout failed:", error);
      dispatch(clearProfile());
      navigate("/login");
    }
  };

  // Get user initials for avatar
  const getUserInitials = (name) => {
    if (!name) return "U";
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase();
  };

  const userName = userProfile?.name || "User";
  const userEmail = userProfile?.email || "user@example.com";
  const userRole = userProfile?.role || "Lawyer";

  return (
    <header
      className={`fixed top-0 right-0 h-15
      bg-[#0B1F3B]
      shadow-md border-b border-b border-[#ffff] 
      shadow-sm border-b border-slate-200
      flex items-center justify-end
      px-2 sm:px-3 z-40
      transition-all duration-300 ease-in-out
      ${sidebarOpen ? "left-52" : "left-14"}
      `}
    >
      {/* Right side: Stats and Profile */}
      <div className="flex items-center gap-2 sm:gap-3">
        {/* Quick Stats */}
        <div className="hidden xs:flex items-center gap-2 sm:gap-3">
          <div className="flex items-center gap-1">
            <span className="text-[10px] text-slate-500">Active:</span>
            <span className="text-xs font-semibold text-slate-800">
              {0}
            </span>
          </div>
          <div className="h-3 w-px bg-slate-300"></div>
          <div className="flex items-center gap-1">
            <span className="text-[10px] text-slate-500">Hearings:</span>
            <span className="text-xs font-semibold text-slate-800">
              {0}
            </span>
          </div>
        </div>

        <div className="hidden xs:block h-3 w-px bg-slate-300"></div>

        {/* Profile Dropdown */}
        <div className="relative dropdown-container">
          <button
            onClick={() => setDropdownOpen(!isDropdownOpen)}
            className="flex items-center gap-1.5 p-1 rounded-lg
               bg-slate-50 hover:bg-slate-100
               border border-slate-200
               transition-all duration-200"
          >
            <img
              src={`https://ui-avatars.com/api/?name=${encodeURIComponent(
                userName
              )}&background=11408b&color=fff&bold=true&size=128`}
              alt={`${userName} Avatar`}
              className="w-6 h-6 sm:w-7 sm:h-7 rounded-full object-cover"
            />
            <div className="hidden md:block text-left">
              <p className="text-xs font-semibold text-slate-800">{userName}</p>
              <p className="text-[10px] text-slate-500 capitalize">
                {userRole}
              </p>
            </div>
            <ChevronDown
              size={12}
              className={`text-slate-500 transition-transform duration-200 ${
                isDropdownOpen ? "rotate-180" : ""
              }`}
            />
          </button>

          {/* Dropdown Menu */}
          {isDropdownOpen && (
            <div
              className="absolute right-0 mt-2 w-44 bg-white border border-slate-200
                 rounded-lg shadow-lg py-2 z-50"
            >
              <div className="px-3 py-1.5 border-b border-slate-200">
                <p className="text-[10px] text-slate-500">Signed in as</p>
                <p className="text-xs font-semibold text-slate-800 truncate">
                  {userEmail}
                </p>
              </div>

              <div className="py-1">
                <Link
                  to="/my-profile"
                  className="flex items-center gap-2 w-full px-3 py-1.5 text-slate-600 hover:bg-slate-50 hover:text-[#A48C65] transition-colors duration-200 text-xs font-medium"
                  onClick={() => setDropdownOpen(false)}
                >
                  <User size={14} /> My Profile
                </Link>
              </div>

              <div className="border-t border-slate-200 pt-1">
                <button
                  onClick={handleLogout}
                  disabled={isLoggingOut}
                  className="flex items-center gap-2 w-full px-3 py-1.5 text-slate-600 hover:bg-red-50 hover:text-[#A48C65] transition-colors duration-200 text-xs font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <LogOut size={14} />
                  {isLoggingOut ? "Signing Out..." : "Sign Out"}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

    </header>
  );
};

export default Topbar;
