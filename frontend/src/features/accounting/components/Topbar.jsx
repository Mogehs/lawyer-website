import { ChevronDown, LogOut, User } from "lucide-react";
import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { clearProfile, selectUserProfile } from "../../auth/authSlice";
import { useLogoutMutation } from "../../auth/api/authApi";

const Topbar = () => {
  const [isDropdownOpen, setDropdownOpen] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const userProfile = useSelector(selectUserProfile);
  const [logout, { isLoading }] = useLogoutMutation();

  // Close dropdown on outside click or ESC
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (!e.target.closest(".dropdown-container")) {
        setDropdownOpen(false);
      }
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

  // Logout handler
  const handleLogout = async () => {
    try {
      await logout().unwrap();
    } finally {
      dispatch(clearProfile());
      navigate("/login");
    }
  };

  const userName = userProfile?.name || "User";
  const userEmail = userProfile?.email || "user@example.com";
  const userRole = userProfile?.role || "Accountant";

  return (
    <header
      className="
        fixed top-0 right-0 left-0
        lg:left-56
        h-16 z-40
        bg-[#0B1F3B]
        border-b border-white
        shadow-md
        flex items-center
        px-4
      "
    >
      {/* Centered Title (Mobile) */}
      <h2
        className="
          absolute left-1/2 -translate-x-1/2
          text-lg font-semi-bold text-nowrap text-white
          lg:static lg:translate-x-0
        "
      >
        Accounting Management
      </h2>

      {/* Right Section */}
      <div className="ml-auto relative dropdown-container">
        <button
          onClick={() => setDropdownOpen((prev) => !prev)}
          className="
            flex items-center gap-2 p-2 rounded-lg
            bg-white hover:bg-gray-50
            border border-gray-200
            transition-all duration-200
          "
        >
          <img
            src={`https://ui-avatars.com/api/?name=${encodeURIComponent(
              userName
            )}&background=11408b&color=fff&bold=true`}
            alt="User Avatar"
            className="w-8 h-8 rounded-full object-cover"
          />

          <div className="hidden md:block text-left">
            <p className="text-sm font-semibold text-gray-800">{userName}</p>
            <p className="text-xs text-gray-500 capitalize">{userRole}</p>
          </div>

          <ChevronDown
            size={16}
            className={`text-gray-500 transition-transform cursor-pointer duration-200 ${
              isDropdownOpen ? "rotate-180" : ""
            }`}
          />
        </button>

        {/* Dropdown */}
        {isDropdownOpen && (
          <div
            className="
              absolute right-0 mt-2 w-48
              bg-white border border-gray-200
              rounded-lg shadow-lg
              py-2 z-50
            "
          >
            <div className="px-4 py-2 border-b border-gray-200">
              <p className="text-xs text-gray-500">Signed in as</p>
              <p className="text-sm font-semibold text-gray-800 truncate">
                {userEmail}
              </p>
            </div>

            <Link
              to="/my-profile"
              onClick={() => setDropdownOpen(false)}
              className="
                flex items-center gap-2 px-4 py-2
                text-sm text-gray-600
                hover:bg-gray-50 hover:text-[#A48C65]
                transition-colors
              "
            >
              <User size={16} />
              My Profile
            </Link>

            <div className="border-t border-gray-200 mt-1">
              <button
                onClick={handleLogout}
                disabled={isLoading}
                className="
                  flex items-center gap-2 w-full px-4 py-2
                  text-sm text-gray-600
                  hover:bg-red-50 hover:text-red-600
                  transition-colors
                  disabled:opacity-50 disabled:cursor-not-allowed
                "
              >
                <LogOut size={16} />
                {isLoading ? "Signing Out..." : "Sign Out"}
              </button>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

export default Topbar;
