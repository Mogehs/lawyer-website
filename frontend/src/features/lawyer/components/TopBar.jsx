import { ChevronDown, LogOut, User } from "lucide-react";
import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { clearProfile, selectUserProfile } from "../../auth/authSlice";
import { useLogoutMutation } from "../../auth/api/authApi";
import { useTranslation } from "react-i18next";

const Topbar = () => {
  const [isDropdownOpen, setDropdownOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 1024);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const userProfile = useSelector(selectUserProfile);
  const [logout, { isLoading: isLoggingOut }] = useLogoutMutation();

  const { t, i18n } = useTranslation("lawyertopbr");
  const isRTL = i18n.dir() === "rtl";

  // Apply RTL/LTR to the document
  useEffect(() => {
    document.documentElement.dir = isRTL ? "rtl" : "ltr";
  }, [isRTL]);

  // Handle window resize
  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 1024);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

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

  const handleLogout = async () => {
    try {
      await logout().unwrap();
    } finally {
      dispatch(clearProfile());
      navigate("/login");
    }
  };

  const toggleLanguage = () => {
    const newLang = i18n.language === "en" ? "ar" : "en";
    i18n.changeLanguage(newLang);
  };

  const userName = userProfile?.name || "User";
  const userEmail = userProfile?.email || "user@example.com";
  const userRole = userProfile?.role || t("lawyer");

  return (
    <header
      className={`fixed top-0 left-0 right-0 h-16 bg-[#0B1F3B] shadow-md border-b border-slate-200
        flex items-center justify-between px-4 z-40 transition-all duration-300`}
    >
      {/* Title */}
      <h2
        className={`text-lg font-semibold text-white flex-1 
          ${isMobile ? "mx-auto" : ""}
          ${!isMobile && isRTL ? "text-center" : "text-left"}
          ${!isMobile && !isRTL ? "lg:ml-[240px]" : ""}
          ${!isMobile && isRTL ? "lg:mr-[240px]" : ""}`}
      >
        {t("lawyerPortal")}
      </h2>

      {/* Right Controls */}
      <div className="flex items-center gap-3">
        {/* Language Toggle */}
        <button
          onClick={toggleLanguage}
          className="px-3 py-1 border cursor-pointer border-blue-100 rounded-xl bg-white/80 hover:bg-white text-sm font-medium shadow-sm"
        >
          {i18n.language === "en" ? t("languageArabic") : t("languageEnglish")}
        </button>

        {/* Profile Dropdown */}
        <div className="relative dropdown-container">
          <button
            onClick={() => setDropdownOpen(!isDropdownOpen)}
            className="flex items-center gap-2 p-2 rounded-lg bg-white hover:bg-gray-50 border border-gray-200 transition-all duration-200"
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
              className={`text-gray-500 transition-transform cursor-pointer duration-200 ${
                isDropdownOpen ? "rotate-180" : ""
              }`}
            />
          </button>

          {isDropdownOpen && (
            <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-lg shadow-lg py-2 z-50">
              <div className="px-4 py-2 border-b border-gray-200">
                <p className="text-xs text-gray-500">{t("signedInAs")}</p>
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
                  <User size={16} /> {t("myProfile")}
                </Link>
              </div>

              <div className="border-t border-gray-200 pt-1">
                <button
                  onClick={handleLogout}
                  disabled={isLoggingOut}
                  className="flex items-center gap-2 w-full px-4 py-2 text-gray-600 hover:bg-red-50 hover:text-red-600 transition-colors duration-200 text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <LogOut size={16} />
                  {isLoggingOut ? t("signingOut") : t("signOut")}
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
