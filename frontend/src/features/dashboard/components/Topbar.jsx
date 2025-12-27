import { ChevronDown, LogOut, User } from "lucide-react";
import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { clearProfile, selectUserProfile } from "../../auth/authSlice";
import { NavLink, useNavigate } from "react-router-dom";
import { useLogoutMutation } from "../../auth/api/authApi";
import { useTranslation } from "react-i18next";

const Topbar = () => {
  const dispatch = useDispatch();
  const user = useSelector(selectUserProfile);
  const [isDropdownOpen, setDropdownOpen] = useState(false);
  const navigate = useNavigate();
  const [logout, { isLoading }] = useLogoutMutation();
  const { t, i18n } = useTranslation("topbar");

  const isRTL = i18n.dir() === "rtl";

  // Close dropdown on outside click or ESC
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

  // RTL support
  useEffect(() => {
    document.documentElement.dir = isRTL ? "rtl" : "ltr";
  }, [isRTL]);

  const handleLogout = async () => {
    try {
      await logout().unwrap();
    } catch (error) {
      console.error("Logout error:", error);
    } finally {
      dispatch(clearProfile());
      navigate("/login");
    }
  };

  const toggleLanguage = () => {
    const newLang = i18n.language === "en" ? "ar" : "en";
    i18n.changeLanguage(newLang);
  };

  return (
    <header
      className="fixed top-0 z-30 left-0 right-0 h-16 flex items-center justify-between
        px-4 sm:px-6 md:px-10 bg-[#0B1F3B] border-b border-white/20 shadow-md"
    >
      {/* Left / Center: Quick Stats */}
      <div
        className={`flex items-center gap-6 flex-1 ${
          isRTL ? "justify-center" : "lg:ml-[220px]"
        }`}
      >
        <div className="hidden sm:flex flex-col text-center">
          <p className="text-sm sm:text-xs text-white">{t("activeCases")}</p>
          <p className="text-lg font-semibold text-slate-200">24</p>
        </div>
        <div className="hidden sm:flex flex-col text-center whitespace-nowrap">
          <p className="text-sm sm:text-xs text-white">{t("todayHearings")}</p>
          <p className="text-lg font-semibold text-slate-200">3</p>
        </div>
      </div>

      {/* Right Controls */}
      <div className="flex items-center gap-3 sm:gap-4">
        {/* Language Toggle */}
        <button
          onClick={toggleLanguage}
          className="px-3 py-1 border cursor-pointer border-blue-100 rounded-xl bg-white/80 hover:bg-white
            text-sm font-medium shadow-sm"
        >
          {i18n.language === "en" ? t("languageArabic") : t("languageEnglish")}
        </button>

        {/* Profile Dropdown */}
        <div className="relative dropdown-container">
          <button
            onClick={() => setDropdownOpen(!isDropdownOpen)}
            className="flex items-center gap-2 sm:gap-3 p-1.5 rounded-xl
              bg-white/80 hover:bg-white border border-blue-100 shadow-sm"
          >
            <img
              src={`https://ui-avatars.com/api/?name=${user?.name || "User"}&background=3b82f6&color=fff&bold=true&size=128`}
              alt="Avatar"
              className="w-8 h-8 rounded-full border-2 border-[#0B1F3B]"
            />
            <div className="hidden sm:block text-left">
              <p className="text-sm font-semibold text-slate-800 truncate">
                {user?.name || ""}
              </p>
              <p className="text-xs text-slate-500">
                {user?.role
                  ? user.role.charAt(0).toUpperCase() + user.role.slice(1)
                  : ""}
              </p>
            </div>
            <ChevronDown
              size={14}
              className={`text-slate-500 transition-transform ${
                isDropdownOpen ? "rotate-180" : ""
              }`}
            />
          </button>

          {isDropdownOpen && (
            <div
              className="absolute right-0 mt-3 w-44 sm:w-52 bg-white/95
              border border-blue-100 rounded-2xl shadow-xl py-3 z-50"
            >
              <div className="px-4 py-2 border-b border-blue-100">
                <p className="text-xs text-slate-500">{t("signedInAs")}</p>
                <p className="text-sm font-semibold text-slate-800 truncate">
                  {user?.email}
                </p>
              </div>

              <NavLink
                to="/my-profile"
                className="flex items-center gap-3 px-4 py-2 text-slate-600
                  hover:bg-blue-50 hover:text-[#A48C65] text-sm font-medium"
              >
                <User size={16} /> {t("myProfile")}
              </NavLink>

              <button
                onClick={handleLogout}
                disabled={isLoading}
                className="flex items-center gap-3 w-full px-4 py-2 text-slate-600
                  hover:bg-blue-50 hover:text-[#A48C65] text-sm font-medium"
              >
                <LogOut size={16} />
                {isLoading ? t("loggingOut") : t("signOut")}
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Topbar;
