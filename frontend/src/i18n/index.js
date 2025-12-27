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
import en_allCases from "./locals/en/allCases.json";
import ar_allCases from "./locals/ar/allCases.json";
import ar_casesheader from "./locals/ar/casesheader.json";
import en_casesheader from "./locals/en/casesheader.json";
import en_casesTable from "./locals/en/casesTable.json";
import ar_casesTable from "./locals/ar/casesTable.json";
import en_caseTimeline from "./locals/en/caseTimeline.json";
import ar_caseTimeline from "./locals/ar/caseTimeline.json";
import en_addCase from "./locals/ar/addCase.json";
import ar_addCase from "./locals/en/addCase.json";
import en_pendingSignatures from "./locals/en/pendingSignatures.json";
import ar_pendingSignatures from "./locals/en/pendingSignatures.json";
import en_directorpendingsessions from "./locals/en/directorpendingsessions.json";
import ar_directorpendingsessions from "./locals/ar/directorpendingsessions.json";
import ar_archive from "./locals/ar/archive.json";
import en_archive from "./locals/en/archive.json";
import en_reportsHeader from "./locals/en/reportsHeader.json";
import ar_reportsHeader from "./locals/ar/reportsHeader.json";


const resources = {
  en: {
    topbar: en_topbar,
    adminsidebar: en_adminsidebar,
    overviewHeader: en_overviewHeader,
    statsCard: en_statsCard,
    caseStageChart: en_caseStageChart,
    recentCases: en_recentCases,
    allCases: en_allCases,
    casesheader: en_casesheader ,
    casesTable: en_casesTable,
    caseTimeline: en_caseTimeline, 
    addCase: en_addCase,
    pendingSignatures: en_pendingSignatures,
    directorpendingsessions: en_directorpendingsessions,
    archive: en_archive,
    reportsHeader: en_reportsHeader,
  },
  ar: {
    topbar: ar_topbar,
    adminsidebar: ar_adminsidebar,
    overviewHeader: ar_overviewHeader,
    statsCard: ar_statsCard,
    caseStageChart: ar_caseStageChart,
    recentCases: ar_recentCases,
    allCases: ar_allCases,
    casesheader: ar_casesheader,
    casesTable: ar_casesTable,
    caseTimeline: ar_caseTimeline,
    addCase: ar_addCase,
    pendingSignatures: ar_pendingSignatures,
    directorpendingsessions: ar_directorpendingsessions,
    archive: ar_archive,
    reportsHeader: ar_reportsHeader,
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
