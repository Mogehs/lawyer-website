import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import LanguageDetector from "i18next-browser-languagedetector";

// Topbar translations
import en_topbar from "./locals/en/topbar.json";
import ar_topbar from "./locals/ar/topbar.json";

// Sidebar translations
import en_adminsidebar from "./locals/en/sidebar.json";
import ar_adminsidebar from "./locals/ar/sidebar.json";

// Overview Header translations
import en_overviewHeader from "./locals/en/overviewHeader.json";
import ar_overviewHeader from "./locals/ar/overviewHeader.json";

// Stats Card translations
import en_statsCard from "./locals/en/statsCard.json";
import ar_statsCard from "./locals/ar/statsCard.json";
import en_caseStageChart from "./locals/en/caseStageChart.json";
import ar_caseStageChart from "./locals/ar/caseStageChart.json";
import ar_recentCases from "./locals/ar/recentCases.json";
import en_recentCases from "./locals/en/recentCases.json";
const resources = {
  en: {
    topbar: en_topbar,
    adminsidebar: en_adminsidebar,
    overviewHeader: en_overviewHeader,
    statsCard: en_statsCard,
     caseStageChart: en_caseStageChart,
     recentCases: en_recentCases,
  },
  ar: {
    topbar: ar_topbar,
    adminsidebar: ar_adminsidebar,
    overviewHeader: ar_overviewHeader,
    statsCard: ar_statsCard,
     caseStageChart: ar_caseStageChart,
      recentCases: ar_recentCases,
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
