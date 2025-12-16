export const validateClientData = (data) => {
  const errors = [];

  if (!data.name || data.name.trim().length === 0) {
    errors.push("Client name is required");
  }

  if (!data.contactNumber || data.contactNumber.trim().length === 0) {
    errors.push("Contact number is required");
  }

  const phoneRegex = /^[0-9]{10,15}$/;
  if (
    data.contactNumber &&
    !phoneRegex.test(data.contactNumber.replace(/[\s\-\(\)]/g, ""))
  ) {
    errors.push("Invalid contact number format");
  }

  if (data.email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(data.email)) {
      errors.push("Invalid email format");
    }
  }

  return errors;
};

export const validateCaseData = (data) => {
  const errors = [];

  if (!data.clientId) {
    errors.push("Client ID is required");
  }

  if (!data.caseType || data.caseType.trim().length === 0) {
    errors.push("Case type is required");
  }

  return errors;
};

export const validateDocuments = (documents) => {
  const errors = [];

  if (!Array.isArray(documents) || documents.length === 0) {
    errors.push("At least one document is required");
  }

  documents.forEach((doc, index) => {
    if (!doc.name || !doc.url) {
      errors.push(`Document at index ${index} must have name and url`);
    }
  });

  return errors;
};

export const validateAssignment = (data) => {
  const errors = [];

  if (!data.lawyerId) {
    errors.push("Lawyer ID is required");
  }

  if (!data.approvingLawyerId) {
    errors.push("Approving lawyer ID is required");
  }

  return errors;
};

export const validateHearingData = (data) => {
  const errors = [];

  if (data.stageIndex === undefined || data.stageIndex === null) {
    errors.push("Stage index is required");
  }

  if (!data.hearingDate) {
    errors.push("Hearing date is required");
  }

  if (data.hearingDate) {
    const hearingDate = new Date(data.hearingDate);
    if (hearingDate < new Date()) {
      errors.push("Hearing date must be in the future");
    }
  }

  if (!data.hearingTime) {
    errors.push("Hearing time is required");
  }

  return errors;
};

export const validateCourtSubmission = (data) => {
  const errors = [];

  if (data.stageIndex === undefined || data.stageIndex === null) {
    errors.push("Stage index is required");
  }

  if (!data.courtSubmissionProof) {
    errors.push("Court submission proof is required");
  }

  return errors;
};
