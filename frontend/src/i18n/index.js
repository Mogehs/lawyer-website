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
import ar_reportsStats from "./locals/ar/reportsStats.json";
import en_reportsStats from "./locals/en/reportsStats.json";
import en_reportsCaseCharts from "./locals/en/reportsCaseCharts.json";
import ar_reportsCaseCharts from "./locals/ar/reportsCaseCharts.json";
import ar_reportsCaseTimelines from "./locals/ar/reportsCaseTimelines.json";
import en_reportsCaseTimelines from "./locals/en/reportsCaseTimelines.json";
import en_reportsActivityLogs from "./locals/en/reportsActivityLogs.json";
import ar_reportsActivityLogs from "./locals/ar/reportsActivityLogs.json";
import ar_remindersHeader from "./locals/ar/remindersHeader.json";
import en_remindersHeader from "./locals/en/remindersHeader.json";
import en_usersPage from "./locals/en/usersPage.json";
import ar_usersPage from "./locals/ar/usersPage.json";
import ar_userTable from "./locals/ar/userTable.json";
import en_userTable from "./locals/en/userTable.json";
//---secretary translations end here---
import en_topbar1 from "./locals/en/topbarsecretary.json";
import ar_topbar1 from "./locals/ar/topbarsecretary.json";
import en_sidebar1 from "./locals/en/sidebarsecretary.json";
import ar_sidebar1 from "./locals/ar/sidebarsecretary.json";
import en_sesecretaryDashboard from "./locals/en/secretaryDashboard.json";
import ar_secretaryDashboard from "./locals/ar/secretaryDashboard.json";
import en_secretaryclient from "./locals/en/secretaryclient.json";
import ar_secretaryclient from "./locals/ar/secretaryclient.json";
import en_seclinettable from "./locals/en/seclinettable.json";
import ar_seclinettable from "./locals/ar/seclinettable.json";
import en_Modeldelet from "./locals/en/Modeldelet.json";
import ar_Modeldelet from "./locals/ar/Modeldelet.json";
import en_EditModel from "./locals/en/EditModel.json";
import ar_EditModel from "./locals/ar/EditModel.json";
import en_CaseManagement from "./locals/en/CaseManagement.json";
import ar_CaseManagement from "./locals/ar/CaseManagement.json";
import en_AddCase2 from "./locals/en/AddCase2.json";
import ar_AddCase2 from "./locals/ar/AddCase2.json";
import en_SecretaryInvoices from "./locals/en/SecretaryInvoices.json";
import ar_SecretaryInvoices from "./locals/ar/SecretaryInvoices.json";
import en_CreateInvoice from "./locals/en/CreateInvoice.json";
import ar_CreateInvoice from "./locals/ar/CreateInvoice.json";
import en_SecReminders from "./locals/en/SecReminders.json";
import ar_SecReminders from "./locals/ar/SecReminders.json";
//  lawyer website translations   
import en_lawyertopbar from "../i18n/lawyer/en/lawyertopbr.json";
import ar_lawyertopbarar from "../i18n/lawyer/ar/lawyertopbr.json";
import en_lawyersidebar from "../i18n/lawyer/en/lawyersidebar.json"
import ar_lawyersidebar from "../i18n/lawyer/ar/lawyersidebar.json";
import en_lawyeroverview from "../i18n/lawyer/en/lawyeroverview.json";
import ar_lawyeroverview from "../i18n/lawyer/ar/lawyeroverview.json";
import en_lawyercases from "../i18n/lawyer/en/lawyercases.json";
import ar_lawyercases from "../i18n/lawyer/ar/lawyercases.json";
import en_lawyersession from "../i18n/lawyer/en/lawyersession.json";
import ar_lawyersession from "../i18n/lawyer/ar/lawyersession.json";
import en_lawyerarchive from "../i18n/lawyer/en/lawyeracchive.json";
import ar_lawyerarchive from "../i18n/lawyer/ar/lawyeracchive.json";
import en_archiveheader from "../i18n/lawyer/en/archiveheader.json"; 
import ar_archiveheader from "../i18n/lawyer/ar/archiveheader.json";
import en_LawyerNotificationsPage from "../i18n/lawyer/en/LawyerNotificationsPage.json";
import ar_LawyerNotificationsPage from "../i18n/lawyer/ar/LawyerNotificationsPage.json";

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
    reportsStats: en_reportsStats,
    reportsCaseCharts: en_reportsCaseCharts,
    reportsCaseTimelines: en_reportsCaseTimelines,
    reportsActivityLogs: en_reportsActivityLogs,
    remindersHeader: en_remindersHeader,
    usersPage: en_usersPage,
    userTable: en_userTable,
    //---secretary translations end here---
    topbar1: en_topbar1,
    sidebar: en_sidebar1,
    secretaryDashboard: en_sesecretaryDashboard,
    secretaryclient: en_secretaryclient,
    seclinettable: en_seclinettable,
    Modeldelet: en_Modeldelet,
    EditModel: en_EditModel,
    CaseManagement: en_CaseManagement,
    AddCase2: en_AddCase2,
    SecretaryInvoices: en_SecretaryInvoices,
    CreateInvoice: en_CreateInvoice,
    SecReminders: en_SecReminders,
    // lawyer website translations
    lawyertopbr: en_lawyertopbar,
    lawyersidebar: en_lawyersidebar,
    lawyeroverview: en_lawyeroverview,
    lawyercases: en_lawyercases,
    lawyersession: en_lawyersession,
    lawyerarchive: en_lawyerarchive,
    archiveheader: en_archiveheader,
    LawyerNotificationsPage: en_LawyerNotificationsPage,
    
  
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
    reportsStats: ar_reportsStats,
    reportsCaseCharts: ar_reportsCaseCharts,
    reportsCaseTimelines: ar_reportsCaseTimelines,
    reportsActivityLogs: ar_reportsActivityLogs,
    remindersHeader: ar_remindersHeader,
    usersPage: ar_usersPage,
    userTable: ar_userTable,
    //
    topbar1: ar_topbar1,
    sidebar: ar_sidebar1,
    secretaryDashboard: ar_secretaryDashboard,
    secretaryclient: ar_secretaryclient,
    seclinettable: ar_seclinettable,
    Modeldelet: ar_Modeldelet,
    EditModel: ar_EditModel,
    CaseManagement: ar_CaseManagement,
    AddCase2: ar_AddCase2,
    SecretaryInvoices: ar_SecretaryInvoices,
    CreateInvoice: ar_CreateInvoice,
    SecReminders: ar_SecReminders,
    // lawyer website translations
    lawyertopbr: ar_lawyertopbarar,
    lawyersidebar: ar_lawyersidebar,
    lawyeroverview: ar_lawyeroverview,
    lawyercases: ar_lawyercases,
    lawyersession: ar_lawyersession,
    lawyerarchive: ar_lawyerarchive,
    archiveheader: ar_archiveheader,
    LawyerNotificationsPage: ar_LawyerNotificationsPage,

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
