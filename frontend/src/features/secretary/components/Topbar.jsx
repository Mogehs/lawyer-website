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

  const userName = userProfile?.name || "User";
  const userEmail = userProfile?.email || "user@example.com";
  const userRole = userProfile?.role || "Secretary";

  return (
    <header
      className={`fixed top-0 right-0 h-16
      bg-gradient-to-r from-[#BCB083] to-[#A48C65]
      shadow-md border-b border-white
      flex items-center justify-between
      px-4 z-40
      transition-all duration-300 ease-in-out
      ${sidebarOpen ? "left-52" : "left-14"}
      `}
    >
      {/* Title */}
      <div className="flex items-center">
        <h2 className="text-lg font-semibold text-white">
          Secretary Dashboard
        </h2>
      </div>

      {/* Profile Dropdown */}
      <div className="flex items-center">{/* Profile Dropdown */}
        <div className="relative dropdown-container">
          <button
            onClick={() => setDropdownOpen(!isDropdownOpen)}
            className="flex items-center gap-2 p-2 rounded-lg
               bg-white hover:bg-gray-50
               border border-gray-200
               transition-all duration-200"
          >
            <img
              src={`https://ui-avatars.com/api/?name=${encodeURIComponent(
                userName
              )}&background=11408b&color=fff&bold=true&size=128`}
              alt={`${userName} Avatar`}
              className="w-8 h-8 rounded-full object-cover"
            />
            <div className="hidden md:block text-left">
              <p className="text-sm font-semibold text-gray-800">{userName}</p>
              <p className="text-xs text-gray-500 capitalize">{userRole}</p>
            </div>
            <ChevronDown
              size={16}
              className={`text-gray-500 transition-transform duration-200 ${
                isDropdownOpen ? "rotate-180" : ""
              }`}
            />
          </button>

          {/* Dropdown Menu */}
          {isDropdownOpen && (
            <div
              className="absolute right-0 mt-2 w-48 bg-white border border-gray-200
               rounded-lg shadow-lg py-2 z-50"
            >
              <div className="px-4 py-2 border-b border-gray-200">
                <p className="text-xs text-gray-500">Signed in as</p>
                <p className="text-sm font-semibold text-gray-800 truncate">
                  {userEmail}
                </p>
              </div>

              <div className="py-1">
                <Link
                  to="/my-profile"
                  className="flex items-center gap-2 w-full px-4 py-2 text-gray-600 hover:bg-gray-50 hover:text-[#A48C65] transition-colors duration-200 text-sm font-medium"
                  onClick={() => setDropdownOpen(false)}
                >
                  <User size={16} /> My Profile
                </Link>
              </div>

              <div className="border-t border-gray-200 pt-1">
                <button
                  onClick={handleLogout}
                  disabled={isLoggingOut}
                  className="flex items-center gap-2 w-full px-4 py-2 text-gray-600 hover:bg-red-50 hover:text-red-600 transition-colors duration-200 text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <LogOut size={16} />
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
