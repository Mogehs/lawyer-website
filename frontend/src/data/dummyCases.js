
const dummyCases = [
  {
    id: "C-101",
    client: {
      name: "Ali Khan",
      contact: "03001234567",
      email: "ali.khan@example.com",
      nationalId: "35202-1234567-8",
      address: "House 12, Street 5, Islamabad",
      additionalInformation: "High-priority client"
    },
    case: {
      caseType: "Civil",
      description: "Dispute over property ownership",
      assignedLawyer: "Sara Ahmed",
      hearingDate: "2025-12-12",
      documents: [
        { name: "PropertyAgreement.pdf", url: "/uploads/property_agreement.pdf" },
        { name: "IDProof.pdf", url: "/uploads/id_proof.pdf" },
        { name: "EvidencePhoto.jpg", url: "/uploads/photo.jpg" }
      ],
      
      status: "Pending",
       stages: [
        {
          stage: "Main",
          submittedOn: "2025-10-10",
          description: "Client not satisfied with decision",
          outcome: "Partial settlement, but client requested appeal.",
          memorandum: { name: "Memorandum_A-2025-001.pdf", url: "/uploads/memorandum_A-2025-001.pdf" },
          evidence: [{ name: "Contract.pdf", url: "/uploads/contract.pdf" }],
        },
        {
          stage: "Appeal",
          submittedOn: "2025-10-20",
          approvedBy: "Ragab",
          description: "Appeal is not  resolved in favor of client.",
          outcome: "Case approved.",
          memorandum: { name: "Memorandum_A-2025-002.pdf", url: "/uploads/memorandum_A-2025-002.pdf" },
          evidence: [{ name: "WitnessStatement.docx", url: "/uploads/witness.docx" }],
        },
      ]
    
    }
  },
 {
  id: "C-102",
  client: {
    name: "Farah Iqbal",
    contact: "03005551234",
    email: "farah.iqbal@example.com",
    nationalId: "35201-9876543-1",
    address: "Block H, Gulberg, Lahore",
    additionalInformation: "Case requires senior lawyer"
  },
  case: {
    caseType: "Family",
    description: "Child custody dispute",
    assignedLawyer: "Raza Ali",
    hearingDate: "2025-11-18",
    filingDate: "2025-10-12",
    status: "Closed",

    documents: [
      { name: "MarriageCertificate.pdf", url: "/uploads/marriage.pdf" },
      { name: "CourtNotice.pdf", url: "/uploads/notice.pdf" }
    ],

    stages: [
      {
        stage: "Main",
        submittedOn: "2025-09-20",
        description: "Main court decision did not favor the client.",
        outcome: "Client requested an appeal.",
        memorandum: { name: "MainDecision.pdf", url: "/uploads/main_decision.pdf" },
        evidence: [{ name: "FinancialReport.pdf", url: "/uploads/finance.pdf" }]
      },
      {
        stage: "Appeal",
        submittedOn: "2025-10-01",
        approvedBy: "Justice Kamal",
        description: "Appeal was rejected due to insufficient evidence.",
        outcome: "Moved to Cassation.",
        memorandum: { name: "AppealOrder.pdf", url: "/uploads/appeal_order.pdf" },
        evidence: [{ name: "PsychologyReport.pdf", url: "/uploads/psychology.pdf" }]
      },
      {
        stage: "Cassation",
        submittedOn: "2025-10-25",
        approvedBy: "Supreme Court Panel",
        description: "Cassation reviewed all evidence and ruled in favor of client.",
        outcome: "Final decision: Client awarded custody.",
        memorandum: { name: "CassationFinal.pdf", url: "/uploads/cassation_final.pdf" },
        evidence: [
          { name: "VideoEvidence.mp4", url: "/uploads/video.mp4" },
          { name: "SchoolRecords.pdf", url: "/uploads/school_records.pdf" }
        ]
      }
    ]
  }
},
{
  id: "C-103",
  client: {
    name: "Usman Tariq",
    contact: "03331234567",
    email: "usman.tariq@example.com",
    nationalId: "37405-1239876-4",
    address: "Main Saddar, Karachi",
    additionalInformation: "Client requested urgent processing"
  },
  case: {
    caseType: "Criminal",
    description: "False accusation claim",
    assignedLawyer: "Ayesha Bano",
    hearingDate: "2025-12-01",
    status: "Main Stage Ongoing",

    documents: [
      { name: "FIR.pdf", url: "/uploads/fir.pdf" },
      { name: "AccusationLetter.pdf", url: "/uploads/accusation_letter.pdf" }
    ],

    stages: [
      {
        stage: "Main",
        submittedOn: "2025-10-08",
        description: "Investigation documents submitted; decision pending.",
        outcome: "Awaiting court response.",
        memorandum: { name: "InvestigationReport.pdf", url: "/uploads/investigation.pdf" },
        evidence: [
          { name: "CameraFootage.mp4", url: "/uploads/footage.mp4" },
          { name: "Witness1.pdf", url: "/uploads/witness1.pdf" }
        ]
      }
    ]
  }
},

];

export default dummyCases;
