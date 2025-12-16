export const fetchArchivedCases = async () => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 1000));

  return [
    {
      id: 1,
      caseNumber: "C-2024-001",
      clientName: "Johnathan Davis",
      clientEmail: "contact@johndavis.com",
      clientPhone: "+1-555-902-1212",
      nationalId: "784-2394-112233",
      address: "742 Evergreen Street, New York, USA",
      additionalInfo: "Long-term corporate client dealing with litigation.",
      caseType: "Commercial Litigation",

      stages: [
        {
          stage: "Initial Filing & Discovery",
          hearingDate: "2024-03-15",
    completedDate: "2024-04-01",
          documents: [
            "complaint_filing.pdf",
            "discovery_requests.pdf",
            "exhibit_a.pdf",
          ],
        },
        {
          stage: "Appeal Proceedings",
          hearingDate: "2024-06-20",
           completedDate: "2024-07-15",

          documents: [
            "appeal_notice.pdf",
            "appellant_brief.pdf",
            "oral_argument_transcript.pdf",
          ],
        },
      ],

      date: "2024-07-10", // last updated / archive date
      archiveReference: "ARCH-CL-2024-001",
    },

    {
      id: 2,
      caseNumber: "C-2024-002",
      clientName: "Sarah Johnson",
      clientEmail: "sarah.johnson@enterprise.com",
      clientPhone: "+1-555-300-7788",
      nationalId: "321-8877-444122",
      address: "19 Sunset Boulevard, California, USA",
      additionalInfo: "Trademark and IP-related work.",
      caseType: "Intellectual Property",

      stages: [
        {
          stage: "Trademark Registration",
          hearingDate: "2024-02-28",
          completedDate: "2024-03-30",
          documents: [
            "trademark_application.pdf",
            "specimen_submission.pdf",
            "office_action_response.pdf",
          ],
        },
      ],

      date: "2024-03-15",
      archiveReference: "ARCH-IP-2024-002",
    },

    {
      id: 3,
      caseNumber: "C-2024-003",
      clientName: "Albert Smith",
      clientEmail: "legal@gts.com",
      clientPhone: "+1-555-778-4455",
      nationalId: "998-5510-662211",
      address: "54 Silicon Avenue, San Francisco, USA",
      additionalInfo: "International tech partner with multiple legal issues.",
      caseType: "Contract Dispute",

      stages: [
        {
          stage: "Arbitration Proceedings",
          hearingDate: "2024-05-10",
          documents: [
            "arbitration_agreement.pdf",
            "witness_statements.pdf",
            "expert_report.pdf",
          ],
        },
      ],

      date: "2024-06-01",
      archiveReference: "ARCH-CD-2024-003",
    },
  ];
};
