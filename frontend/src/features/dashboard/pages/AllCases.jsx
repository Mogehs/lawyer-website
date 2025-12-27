import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import i18n from "../../../i18n/index";
import AddCaseModal from "../components/dashboardCaseManagement/AddCaseModal";
import CaseTimelineModal from "../components/dashboardCaseManagement/CaseTimelineModal";
import CasesTable from "../components/dashboardCaseManagement/CasesTable";
import CasesHeader from "../components/dashboardCaseManagement/CaseHeader";
import DeleteCaseModal from "../components/dashboardCaseManagement/DeleteCaseModal";
import { useGetAllCasesQuery } from "../api/directorApi";

const AllCases = () => {
  const { t } = useTranslation("allCases");
  const isRTL = i18n.language === "ar";

  const { data, isLoading, isError } = useGetAllCasesQuery();
  const apiCases = data?.data || [];

  const [cases, setCases] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStage, setFilterStage] = useState("All");
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedCase, setSelectedCase] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [caseToDelete, setCaseToDelete] = useState(null);

  // Set page direction
  useEffect(() => {
    document.documentElement.dir = isRTL ? "rtl" : "ltr";
  }, [isRTL]);

  // Format API data (keep internal values untranslated)
  useEffect(() => {
    const formatted = apiCases.map((c) => ({
      ...c,
      clientName: c.clientId?.name || t("noClient"),
      lawyer: c.assignedLawyer?.name || t("notAssigned"),
      stage: c.stages?.[0]?.status || "N/A", // internal value for logic
      status: c.status || "N/A",
      lastUpdated: new Date(c.updatedAt).toLocaleDateString(),
    }));
    setCases(formatted);
  }, [apiCases, t]);

  // Filtering
  const filteredCases = cases.filter((c) => {
    const matchesSearch =
      c.clientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.caseNumber.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStage =
      filterStage === "All" || c.stage === filterStage; // use internal value

    return matchesSearch && matchesStage;
  });

  const handleViewTimeline = (caseItem) => setSelectedCase(caseItem);
  const handleDeleteClick = (caseItem) => {
    setCaseToDelete(caseItem);
    setShowDeleteModal(true);
  };
  const handleConfirmDelete = (id) => {
    setCases((prev) => prev.filter((c) => c._id !== id));
    setShowDeleteModal(false);
  };

  return (
    <div className={`max-w-sm md:max-w-7xl ${isRTL ? "text-right" : "text-left"}`}>
      <div className={`min-h-screen pt-16 px-3 sm:px-4 md:px-6 py-3 sm:py-4 md:py-5 transition-all duration-300 ${isRTL ? "lg:mr-52" : "lg:ml-52"}`}>
        {/* Header */}
        <div className="mb-4 sm:mb-5 md:mb-6 lg:mb-8">
          <CasesHeader
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
            filterStage={filterStage}
            setFilterStage={setFilterStage}
            onAddClick={() => setShowAddModal(true)}
            searchPlaceholder={t("searchPlaceholder")}
            filterAllLabel={t("filterAll")}
            addCaseLabel={t("addCaseButton")}
          />
        </div>

        {/* Loading & Error */}
        {isLoading && <p className="text-center text-[#0B1F3B] py-10 text-xl">{t("loadingCases")}</p>}
        {isError && <p className="text-center text-[#0B1F3B] py-10 text-xl">{t("failedLoadCases")}</p>}

        {/* Cases Table */}
        {!isLoading && !isError && (
          <div className="overflow-x-auto">
            <CasesTable
              cases={filteredCases}
              onView={handleViewTimeline}
              onDelete={handleDeleteClick}
              isRTL={isRTL}
              t={t} // pass translation function to table
            />
          </div>
        )}

        {/* Add Case Modal */}
        {showAddModal && (
          <div className="fixed inset-0 flex items-center justify-center z-50 px-3 sm:px-4 md:px-6">
            <AddCaseModal onCancel={() => setShowAddModal(false)} />
          </div>
        )}

        {/* Case Timeline Modal */}
        {selectedCase && <CaseTimelineModal isOpen onClose={() => setSelectedCase(null)} caseData={selectedCase} />}

        {/* Delete Modal */}
        {showDeleteModal && (
          <DeleteCaseModal
            caseData={caseToDelete}
            onCancel={() => setShowDeleteModal(false)}
            onConfirm={() => handleConfirmDelete(caseToDelete?._id)}
            confirmTitle={t("confirmDeleteTitle")}
            confirmMessage={t("confirmDeleteMessage")}
            cancelLabel={t("cancel")}
            confirmLabel={t("confirm")}
          />
        )}
      </div>
    </div>
  );
};

export default AllCases;
