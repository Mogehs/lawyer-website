import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import LanguageDetector from "i18next-browser-languagedetector";

// Topbar translations
import en_topbar from "../secretary/loclas/en/topbar.json";
import ar_topbar from "../secretary/loclas/ar/topbar.json";
import en_sidebar from "../secretary/loclas/en/sidebar.json";
import ar_sidebar from "../secretary/loclas/ar/sidebar.json";



const resources = {
  en: {
    topbar: en_topbar,
    sidebar: en_sidebar
  },
  ar: {
    topbar: ar_topbar
    , sidebar: ar_sidebar
  }
};


i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: "en",
    interpolation: { escapeValue: false },
    detection: {
      order: ["localStorage", "cookie", "navigator"],
      caches: ["localStorage"]
    }
  });

export default i18n;
