import React from "react";
import { useGetLawyersQuery } from "../../api/secretaryApi";

const CaseDetailsForm = ({ caseInfo, onChange }) => {
  const {
    data: lawyersData,
    isLoading: loadingLawyers,
    error: lawyersError,
  } = useGetLawyersQuery();

  // Filter lawyers by role
  const regularLawyers = React.useMemo(() => {
    return lawyersData?.data?.filter((lawyer) => lawyer.role === "lawyer") || [];
  }, [lawyersData]);

  // Filter approving lawyers
  const approvingLawyers = React.useMemo(() => {
    return lawyersData?.data?.filter((lawyer) => lawyer.role === "approvingLawyer") || [];
  }, [lawyersData]);

  return (
    <div className="space-y-5">
      {/* Case Information Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {/* Case Type */}
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">
            Case Type <span className="text-red-500">*</span>
          </label>
          <select
            name="caseType"
            value={caseInfo.caseType}
            onChange={onChange}
            className="w-full rounded-lg px-4 py-3 text-base border border-gray-300 bg-white focus:ring-2 focus:ring-[#A48C65] focus:border-transparent transition-all shadow-sm hover:border-[#A48C65]"
            required
          >
            <option value="">Select Case Type</option>
            <option value="Civil">Civil Case</option>
            <option value="Criminal">Criminal Case</option>
            <option value="Family">Family Case</option>
            <option value="Commercial">Commercial Case</option>
            <option value="Labor">Labor Case</option>
            <option value="Administrative">Administrative Case</option>
          </select>
        </div>

        {/* Assigned Lawyer (Draft Lawyer) */}
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">
            Draft Lawyer <span className="text-red-500">*</span>
          </label>
          <select
            name="assignedLawyer"
            value={caseInfo.assignedLawyer}
            onChange={onChange}
            className="w-full rounded-lg px-4 py-3 text-base border border-gray-300 bg-white focus:ring-2 focus:ring-[#A48C65] focus:border-transparent transition-all shadow-sm hover:border-[#A48C65] disabled:bg-gray-100 disabled:cursor-not-allowed"
            required
            disabled={loadingLawyers}
          >
            <option value="">
              {loadingLawyers ? "Loading lawyers..." : "Select Draft Lawyer"}
            </option>
            {regularLawyers.map((lawyer) => (
              <option key={lawyer._id} value={lawyer._id}>
                {lawyer.name} - {lawyer.email}
              </option>
            ))}
            {!regularLawyers.length && !loadingLawyers && (
              <option value="" disabled>
                No draft lawyers available
              </option>
            )}
          </select>
          {loadingLawyers && (
            <p className="text-sm text-blue-600 flex items-center gap-2 mt-1">
              <span className="inline-block w-4 h-4 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></span>
              Loading lawyers...
            </p>
          )}
          {lawyersError && (
            <p className="text-sm text-red-600 mt-1">
              Error: {lawyersError?.data?.message || "Failed to load lawyers"}
            </p>
          )}
          {!regularLawyers.length && !loadingLawyers && !lawyersError && (
            <p className="text-sm text-orange-600 mt-1">
              No draft lawyers found.
            </p>
          )}
        </div>

        {/* Approving Lawyer */}
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">
            Approving Lawyer <span className="text-red-500">*</span>
          </label>
          <select
            name="approvingLawyer"
            value={caseInfo.approvingLawyer}
            onChange={onChange}
            className="w-full rounded-lg px-4 py-3 text-base border border-gray-300 bg-white focus:ring-2 focus:ring-[#A48C65] focus:border-transparent transition-all shadow-sm hover:border-[#A48C65] disabled:bg-gray-100 disabled:cursor-not-allowed"
            required
            disabled={loadingLawyers}
          >
            <option value="">
              {loadingLawyers ? "Loading lawyers..." : "Select Approving Lawyer"}
            </option>
            {approvingLawyers.map((lawyer) => (
              <option key={lawyer._id} value={lawyer._id}>
                {lawyer.name} - {lawyer.email}
              </option>
            ))}
            {!approvingLawyers.length && !loadingLawyers && (
              <option value="" disabled>
                No approving lawyers available
              </option>
            )}
          </select>
          {loadingLawyers && (
            <p className="text-sm text-blue-600 flex items-center gap-2 mt-1">
              <span className="inline-block w-4 h-4 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></span>
              Loading lawyers...
            </p>
          )}
          {lawyersError && (
            <p className="text-sm text-red-600 mt-1">
              Error: {lawyersError?.data?.message || "Failed to load lawyers"}
            </p>
          )}
          {!approvingLawyers.length && !loadingLawyers && !lawyersError && (
            <p className="text-sm text-orange-600 mt-1">
              No approving lawyers found.
            </p>
          )}
        </div>

        {/* Case Status */}
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">
            Case Status <span className="text-red-500">*</span>
          </label>
          <select
            name="status"
            value={caseInfo.status}
            onChange={onChange}
            className="w-full rounded-lg px-4 py-3 text-base border border-gray-300 bg-white focus:ring-2 focus:ring-[#A48C65] focus:border-transparent transition-all shadow-sm hover:border-[#A48C65]"
            required
          >
            <option value="Pending">Pending</option>
            <option value="In Progress">In Progress</option>
            <option value="Under Review">Under Review</option>
            <option value="Completed">Completed</option>
            <option value="On Hold">On Hold</option>
            <option value="Closed">Closed</option>
          </select>
        </div>

        {/* Case Stage */}
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">
            Case Stage <span className="text-red-500">*</span>
          </label>
          <select
            name="stage"
            value={caseInfo.stage}
            onChange={onChange}
            className="w-full rounded-lg px-4 py-3 text-base border border-gray-300 bg-white focus:ring-2 focus:ring-[#A48C65] focus:border-transparent transition-all shadow-sm hover:border-[#A48C65]"
            required
          >
            <option value="Main Case">Main Case</option>
            <option value="Appeal">Appeal</option>
            <option value="Cassation">Cassation</option>
            <option value="Execution">Execution</option>
            <option value="Initial Review">Initial Review</option>
          </select>
        </div>
      </div>

      {/* Full Width Description */}
      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-700">
          Case Description <span className="text-red-500">*</span>
        </label>
        <textarea
          name="description"
          placeholder="Provide detailed description of the case..."
          value={caseInfo.description}
          onChange={onChange}
          rows="4"
          className="w-full rounded-lg px-4 py-3 text-base border border-gray-300 bg-white focus:ring-2 focus:ring-[#A48C65] focus:border-transparent transition-all shadow-sm hover:border-[#A48C65] resize-y"
          required
        />
      </div>

      {/* Filing Date - Hidden but functional */}
      <input type="hidden" name="filingDate" value={caseInfo.filingDate} />
    </div>
  );
};

export default CaseDetailsForm;
