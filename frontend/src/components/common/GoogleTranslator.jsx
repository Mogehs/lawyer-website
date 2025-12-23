import React, { useEffect, useRef, useState } from "react";
import { useLocation } from "react-router-dom";
import { FiGlobe, FiChevronDown, FiCheck } from "react-icons/fi";
import "./style.css";

const GoogleTranslate = ({ containerId = "google_translate_element" }) => {
  const location = useLocation();
  const initializationRef = useRef(false);
  const timeoutRef = useRef(null);
  const observerRef = useRef(null);
  const [isOpen, setIsOpen] = useState(false);
  const [selectedLang, setSelectedLang] = useState("en");
  const dropdownRef = useRef(null);

  const languages = [
    // Major Continental Languages (75%+ coverage)
    { code: "en", name: "English", flag: "🇬🇧" },
    { code: "ar", name: "Arabic", flag: "🇸🇦" },
    { code: "fr", name: "French", flag: "🇫🇷" },
    { code: "pt", name: "Portuguese", flag: "🇵🇹" },
    { code: "sw", name: "Swahili", flag: "🇰🇪" },

    // East African Languages
    { code: "am", name: "Amharic", flag: "🇪🇹" },
    { code: "ti", name: "Tigrinya", flag: "🇪🇷" },
    { code: "so", name: "Somali", flag: "🇸🇴" },
    { code: "rw", name: "Kinyarwanda", flag: "🇷🇼" },

    // West African Languages
    { code: "ha", name: "Hausa", flag: "🇳🇬" },
    { code: "yo", name: "Yoruba", flag: "🇳🇬" },
    { code: "ig", name: "Igbo", flag: "🇳🇬" },
    { code: "tw", name: "Twi", flag: "🇬🇭" },
    { code: "bm", name: "Bambara", flag: "🇲🇱" },
    { code: "wo", name: "Wolof", flag: "🇸🇳" },

    // Southern African Languages
    { code: "zu", name: "Zulu", flag: "🇿🇦" },
    { code: "xh", name: "Xhosa", flag: "🇿🇦" },
    { code: "af", name: "Afrikaans", flag: "🇿🇦" },
    { code: "ts", name: "Tsonga", flag: "🇿🇦" },
    { code: "tn", name: "Setswana", flag: "🇧🇼" },
    { code: "st", name: "Sesotho", flag: "🇱🇸" },
    { code: "sn", name: "Shona", flag: "🇿🇼" },
    { code: "ny", name: "Chichewa", flag: "🇲🇼" },

    // Central African Languages
    { code: "ln", name: "Lingala", flag: "🇨🇩" },
    { code: "bem", name: "Bemba", flag: "🇿🇲" },

    // Indian Ocean Islands
    { code: "mg", name: "Malagasy", flag: "🇲🇬" },
  ];

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Sync selected language with Google Translate's current state
  useEffect(() => {
    const syncLanguage = setInterval(() => {
      const select = document.querySelector(".goog-te-combo");
      if (select && select.value && select.value !== selectedLang) {
        setSelectedLang(select.value);
      }
    }, 500);

    return () => clearInterval(syncLanguage);
  }, [selectedLang]);

  const handleLanguageChange = (langCode) => {
    setSelectedLang(langCode);
    setIsOpen(false);

    // Wait for Google Translate to be ready
    const changeLanguage = () => {
      const select = document.querySelector(".goog-te-combo");
      if (select) {
        select.value = langCode;
        select.dispatchEvent(new Event("change", { bubbles: true }));
        // Also trigger using the native event
        const event = new Event("change");
        select.dispatchEvent(event);
        // Force the change using setTimeout to ensure it's processed
        setTimeout(() => {
          select.value = langCode;
          select.dispatchEvent(new Event("change"));
        }, 100);
      } else {
        // If select not found, try again after a delay
        setTimeout(changeLanguage, 200);
      }
    };

    changeLanguage();
  };

  useEffect(() => {
    const ensureInitialized = (targetId) => {
      // Clear any existing content in the container
      const container = document.getElementById(targetId);
      if (container) {
        container.innerHTML = "";
      }

      if (
        window.google &&
        window.google.translate &&
        window.google.translate.TranslateElement
      ) {
        try {
          new window.google.translate.TranslateElement(
            {
              pageLanguage: "en",
              includedLanguages:
                "en,af,am,ar,bem,bm,ha,ig,ln,mg,ny,rw,sn,so,st,sw,ti,tn,ts,tw,wo,xh,yo,zu,fr,pt",
              autoDisplay: false,
            },
            targetId
          );
          return true;
        } catch (e) {
          console.warn("Failed to initialize Google Translate:", e);
          return false;
        }
      }
      return false;
    };

    const filterLanguages = () => {
      const select = document.querySelector(".goog-te-combo");
      const africanLanguages = [
        "en",
        "af",
        "am",
        "ar",
        "bem",
        "bm",
        "ha",
        "ig",
        "ln",
        "mg",
        "ny",
        "rw",
        "sn",
        "so",
        "st",
        "sw",
        "ti",
        "tn",
        "ts",
        "tw",
        "wo",
        "xh",
        "yo",
        "zu",
        "fr",
        "pt",
      ];

      if (select && select.options) {
        Array.from(select.options).forEach((option) => {
          if (!africanLanguages.includes(option.value) && option.value !== "") {
            option.remove();
          }
        });
      }
    };

    const checkAndReinitialize = () => {
      const container = document.getElementById(containerId);
      const existingWidget = container?.querySelector(".goog-te-gadget");
      const selectElement = document.querySelector(".goog-te-combo");

      // If container exists but widget is missing or incomplete, reinitialize
      if (container && (!existingWidget || !selectElement)) {
        console.log("Google Translate widget missing, reinitializing...");
        ensureInitialized(containerId);
        // Filter languages after a short delay
        setTimeout(filterLanguages, 500);
      }
    };

    const setupPeriodicCheck = () => {
      // Clear existing timeout
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }

      // Check immediately
      checkAndReinitialize();

      // Set up periodic checking
      const periodicCheck = () => {
        checkAndReinitialize();
        timeoutRef.current = setTimeout(periodicCheck, 2000);
      };

      timeoutRef.current = setTimeout(periodicCheck, 1000);
    };

    window._gtPendingIds = window._gtPendingIds || new Set();
    window._gtPendingIds.add(containerId);

    const globalInit = () => {
      const ids = Array.from(window._gtPendingIds || []);
      ids.forEach((id) => ensureInitialized(id));

      // Setup mutation observer to watch for DOM changes
      if (observerRef.current) {
        observerRef.current.disconnect();
      }

      observerRef.current = new MutationObserver((mutations) => {
        let shouldFilter = false;
        mutations.forEach((mutation) => {
          if (
            (mutation.type === "childList" &&
              mutation.target.closest?.(".goog-te-gadget")) ||
            mutation.target.querySelector?.(".goog-te-combo")
          ) {
            shouldFilter = true;
          }
        });

        if (shouldFilter) {
          setTimeout(filterLanguages, 100);
        }
      });

      observerRef.current.observe(document.body, {
        childList: true,
        subtree: true,
        attributes: false,
      });

      window.setGoogleTranslateLanguage = function setGoogleTranslateLanguage(
        langCode
      ) {
        const attemptSet = (retries = 12) => {
          const select = document.querySelector(".goog-te-combo");
          if (select) {
            select.value = langCode;
            select.dispatchEvent(new Event("change", { bubbles: true }));
            return true;
          }
          if (retries > 0) setTimeout(() => attemptSet(retries - 1), 150);
          return false;
        };
        attemptSet();
      };

      initializationRef.current = true;
      setupPeriodicCheck();
    };

    if (!window.googleTranslateElementInit) {
      window.googleTranslateElementInit = globalInit;
    }

    const existing = document.getElementById("google-translate-script");
    if (!existing) {
      const googleScript = document.createElement("script");
      googleScript.id = "google-translate-script";
      googleScript.src =
        "https://translate.google.com/translate_a/element.js?cb=googleTranslateElementInit";
      googleScript.async = true;
      document.body.appendChild(googleScript);
    } else if (initializationRef.current) {
      // Script exists and we've initialized before, just reinitialize
      setupPeriodicCheck();
    } else {
      // Script exists but we haven't initialized, wait for it to load
      setTimeout(() => {
        if (window.googleTranslateElementInit) {
          window.googleTranslateElementInit();
        }
      }, 100);
    }

    // Cleanup function
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [containerId]);

  // Effect to handle route changes
  useEffect(() => {
    if (initializationRef.current) {
      // Wait a bit for the route change to complete
      const timer = setTimeout(() => {
        const container = document.getElementById(containerId);
        const existingWidget = container?.querySelector(".goog-te-gadget");

        if (!existingWidget) {
          console.log("Route changed, reinitializing Google Translate...");
          if (window.googleTranslateElementInit) {
            window.googleTranslateElementInit();
          }
        }
      }, 300);

      return () => clearTimeout(timer);
    }
  }, [location.pathname, containerId]);

  // Cleanup effect
  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, []);

  return (
    <div className="translate-wrapper-custom">
      {/* Hidden but functional Google Translate Element */}
      <div
        id={containerId}
        style={{
          position: "absolute",
          left: "-9999px",
          width: "1px",
          height: "1px",
          overflow: "hidden",
        }}
      ></div>

      {/* Custom Dropdown */}
      <div className="relative" ref={dropdownRef}>
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="flex items-center gap-2 px-2.5 py-1.5 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-1 shadow-sm"
        >
          <FiGlobe className="w-3.5 h-3.5 text-gray-600" />
          <span className="text-xs font-medium text-gray-700">
            {languages.find((lang) => lang.code === selectedLang)?.flag}{" "}
            <span className="hidden sm:inline">
              {languages.find((lang) => lang.code === selectedLang)?.name}
            </span>
          </span>
          <FiChevronDown
            className={`w-3.5 h-3.5 text-gray-500 transition-transform duration-200 ${
              isOpen ? "rotate-180" : ""
            }`}
          />
        </button>

        {/* Dropdown Menu */}
        {isOpen && (
          <div className="absolute right-0 mt-2 w-72 bg-white rounded-lg shadow-xl border border-gray-200 py-2 z-50 max-h-80 overflow-y-auto animate-fadeIn">
            <div className="px-3 py-2 border-b border-gray-100">
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
                Select Language
              </p>
            </div>
            {languages.map((lang) => {
              const isSelected = selectedLang === lang.code;
              return (
                <button
                  key={lang.code}
                  onClick={() => handleLanguageChange(lang.code)}
                  className={`w-full flex items-center justify-between px-4 py-2 text-sm transition-colors ${
                    isSelected
                      ? "bg-primary/5 text-primary"
                      : "text-gray-700 hover:bg-gray-50"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span className="text-base">{lang.flag}</span>
                    <span
                      className={`font-medium ${
                        isSelected ? "font-semibold" : ""
                      }`}
                    >
                      {lang.name}
                    </span>
                  </div>
                  {isSelected && <FiCheck className="w-4 h-4 text-primary" />}
                </button>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default GoogleTranslate;
