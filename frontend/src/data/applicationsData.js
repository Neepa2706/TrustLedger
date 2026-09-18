/**
 * TrustLedger Centralized Applications & Investigation Dataset
 * Single source of truth for digital lending risk evaluations.
 * All records represent synthetic demo scenarios.
 */

export const applicationsSummaryStats = {
  total: 128,
  highRisk: 6,
  needsReview: 17,
  verified: 105
};

export const applicationsList = [
  {
    id: 'APP-1001',
    applicant: 'Arjun Mehta',
    submittedAt: '2 min ago',
    timestamp: '2026-09-18 21:29 UTC',
    loanAmount: '₹15,000',
    documentStatus: 'Verified',
    kycStatus: 'Verified',
    networkStatus: 'Clear',
    integrityStatus: 'Verified',
    riskScore: 18,
    riskLevel: 'LOW',
    status: 'Verified',
    applicationStatus: 'Approved & Verified',
    analysisStatus: 'AI Analysis Complete',
    loanType: 'Unsecured Personal Credit',
    riskBreakdown: {
      documentForensics: { score: 12, status: 'Verified', explanation: 'Original banking PDF layout; zero font tampering.' },
      kycAnalysis: { score: 15, status: 'Verified', explanation: 'Passive 3D liveness verified with 99.8% confidence.' },
      fraudNetwork: { score: 8, status: 'Clear', explanation: 'No correlated device or bank account collisions detected.' },
      evidenceIntegrity: { score: 98, status: 'Verified', explanation: 'SHA-256 seal matches cryptographic ledger anchor.' }
    },
    reasons: [
      { id: 'r1', title: 'Clean profile & verified employer', severity: 'low', explanation: 'Corporate email and payroll deposit confirmed.', linkTo: '/documents' },
      { id: 'r2', title: 'Biometric liveness confirmed', severity: 'low', explanation: '3D facial depth passed all anti-spoof checks.', linkTo: '/kyc-analysis' }
    ],
    timeline: [
      { time: '21:27', event: 'Application submitted', type: 'submission' },
      { time: '21:28', event: 'Document forensics completed', type: 'doc' },
      { time: '21:28', event: 'KYC analysis completed', type: 'kyc' },
      { time: '21:29', event: 'Evidence hash verified', type: 'ledger' },
      { time: '21:29', event: 'Risk assessment generated', type: 'risk' }
    ],
    evidence: [
      { id: 'ev1', type: 'BANK STATEMENT', status: 'Verified', risk: 'Low', state: 'Forensic Pass', hash: '8f43...327a' },
      { id: 'ev2', type: 'GST FILING', status: 'Verified', risk: 'Low', state: 'Tax Filing Valid', hash: 'e2a1...99bc' },
      { id: 'ev3', type: 'IDENTITY DOCUMENT', status: 'Verified', risk: 'Low', state: 'DigiLocker Validated', hash: '1b4f...001a' },
      { id: 'ev4', type: 'KYC VIDEO', status: 'Verified', risk: 'Low', state: 'Liveness 99.8%', hash: 'c90e...dd41' }
    ],
    digitalSignals: [
      { type: 'DEVICE', value: 'Device-9A4F', detail: 'Single application on record' },
      { type: 'IP ADDRESS', value: '192.0.2.14', detail: 'Residential ISP in stated city' },
      { type: 'BANK ACCOUNT', value: '•••• 1092', detail: 'Established payroll account' },
      { type: 'EMAIL DOMAIN', value: 'tech-corp.com', detail: 'Verified corporate domain' }
    ]
  },
  {
    id: 'APP-1002',
    applicant: 'Priya Sharma',
    submittedAt: '14 min ago',
    timestamp: '2026-09-18 21:17 UTC',
    loanAmount: '₹28,000',
    documentStatus: 'Review',
    kycStatus: 'Verified',
    networkStatus: 'Watch',
    integrityStatus: 'Verified',
    riskScore: 54,
    riskLevel: 'MEDIUM',
    status: 'Needs Review',
    applicationStatus: 'Under Review',
    analysisStatus: 'AI Analysis Complete',
    loanType: 'Small Business Working Capital',
    riskBreakdown: {
      documentForensics: { score: 58, status: 'Review', explanation: 'Slight font spacing anomaly on bank statement page 2.' },
      kycAnalysis: { score: 22, status: 'Verified', explanation: 'Facial recognition matched government ID accurately.' },
      fraudNetwork: { score: 48, status: 'Watch', explanation: 'Shared IP address detected with 1 other previous inquiry.' },
      evidenceIntegrity: { score: 92, status: 'Verified', explanation: 'Evidence hash signed and recorded on audit chain.' }
    },
    reasons: [
      { id: 'r1', title: 'Secondary review suggested for bank statement', severity: 'medium', explanation: 'Line-item kerning requires human visual signoff.', linkTo: '/documents' },
      { id: 'r2', title: 'Shared IP address flagged on watch list', severity: 'medium', explanation: 'Public shared coworking Wi-Fi signal.', linkTo: '/fraud-network' }
    ],
    timeline: [
      { time: '21:10', event: 'Application submitted', type: 'submission' },
      { time: '21:12', event: 'Documents uploaded', type: 'doc' },
      { time: '21:14', event: 'Document forensics completed', type: 'doc' },
      { time: '21:15', event: 'KYC analysis completed', type: 'kyc' },
      { time: '21:17', event: 'Risk assessment generated', type: 'risk' }
    ],
    evidence: [
      { id: 'ev1', type: 'BANK STATEMENT', status: 'Review', risk: 'Medium', state: 'Anomaly Detected', hash: '4f88...91a2' },
      { id: 'ev2', type: 'GST FILING', status: 'Verified', risk: 'Low', state: 'Consistent Revenue', hash: '7c12...44bb' },
      { id: 'ev3', type: 'IDENTITY DOCUMENT', status: 'Verified', risk: 'Low', state: 'Government Verified', hash: '3e99...11cd' },
      { id: 'ev4', type: 'KYC VIDEO', status: 'Verified', risk: 'Low', state: 'Liveness 97.4%', hash: '09a4...65fe' }
    ],
    digitalSignals: [
      { type: 'DEVICE', value: 'Device-3B81', detail: 'Shared with 1 historical inquiry' },
      { type: 'IP ADDRESS', value: '192.0.2.188', detail: 'Shared commercial co-working hub' },
      { type: 'BANK ACCOUNT', value: '•••• 8831', detail: 'Commercial checking account' },
      { type: 'EMAIL DOMAIN', value: 'consulting-sharma.in', detail: 'Active registered domain (2 yrs)' }
    ]
  },
  {
    id: 'APP-1003',
    applicant: 'Rahul Verma',
    submittedAt: '21 min ago',
    timestamp: '2026-09-18 21:10 UTC',
    loanAmount: '₹45,000',
    documentStatus: 'Suspicious',
    kycStatus: 'Review',
    networkStatus: 'Connected',
    integrityStatus: 'Warning',
    riskScore: 91,
    riskLevel: 'HIGH',
    status: 'Investigate',
    applicationStatus: 'Needs Investigation',
    analysisStatus: 'AI Analysis Complete',
    loanType: 'Fast-Disbursal Personal Loan',
    riskBreakdown: {
      documentForensics: { score: 87, status: 'Suspicious', explanation: 'Potential formatting and metadata anomalies detected.' },
      kycAnalysis: { score: 64, status: 'Review', explanation: 'Video requires additional liveness review.' },
      fraudNetwork: { score: 91, status: 'Connected', explanation: 'Multiple connected digital signals detected.' },
      evidenceIntegrity: { score: 28, status: 'Warning', explanation: 'Current evidence fingerprint requires verification.' }
    },
    reasons: [
      { id: 'r1', title: 'Potential document manipulation signal', severity: 'critical', explanation: 'Font subset splice detected on net monthly salary row of bank statement.', linkTo: '/documents' },
      { id: 'r2', title: 'KYC video requires additional liveness review', severity: 'high', explanation: 'Facial micro-expression and depth variance flagged as borderline synthetic reproduction.', linkTo: '/kyc-analysis' },
      { id: 'r3', title: 'Multiple connected applications share digital signals', severity: 'critical', explanation: 'Device fingerprint and routing number collide with 3 previous loan inquiries across different identities.', linkTo: '/fraud-network' },
      { id: 'r4', title: 'Evidence integrity requires verification', severity: 'high', explanation: 'SHA-256 header hash diverges from original banking portal export signature.', linkTo: '/evidence-ledger' }
    ],
    timeline: [
      { time: '21:21', event: 'Application submitted', type: 'submission' },
      { time: '21:23', event: 'Documents uploaded', type: 'doc' },
      { time: '21:27', event: 'Document forensics completed', type: 'doc' },
      { time: '21:32', event: 'KYC analysis completed', type: 'kyc' },
      { time: '21:36', event: 'Fraud network analysis completed', type: 'network' },
      { time: '21:40', event: 'Evidence hash verified', type: 'ledger' },
      { time: '21:42', event: 'Risk assessment generated', type: 'risk' }
    ],
    evidence: [
      { id: 'ev1', type: 'BANK STATEMENT', status: 'Review', risk: 'Medium', state: 'Font Splicing Warning', hash: 'e3b0...b855' },
      { id: 'ev2', type: 'GST FILING', status: 'Suspicious', risk: 'High', state: 'Turnover Variance Mismatch', hash: 'ca97...48bb' },
      { id: 'ev3', type: 'IDENTITY DOCUMENT', status: 'Verified', risk: 'Low', state: 'Checksum Match', hash: 'fb8e...0e5c' },
      { id: 'ev4', type: 'KYC VIDEO', status: 'Review', risk: 'Medium', state: 'Liveness Under Review', hash: '35a9...bfb9' }
    ],
    digitalSignals: [
      { type: 'DEVICE', value: 'Device-7F2A', detail: 'Shared with 3 applications' },
      { type: 'IP ADDRESS', value: '192.0.2.24', detail: 'Seen across 4 applications' },
      { type: 'BANK ACCOUNT', value: '•••• 4821', detail: 'Linked to 2 applications' },
      { type: 'EMAIL DOMAIN', value: 'example-business.com', detail: 'Seen across 3 applications' }
    ]
  },
  {
    id: 'APP-1004',
    applicant: 'Ananya Rao',
    submittedAt: '38 min ago',
    timestamp: '2026-09-18 20:53 UTC',
    loanAmount: '₹60,000',
    documentStatus: 'Review',
    kycStatus: 'Review',
    networkStatus: 'Connected',
    integrityStatus: 'Warning',
    riskScore: 84,
    riskLevel: 'HIGH',
    status: 'Investigate',
    applicationStatus: 'Needs Investigation',
    analysisStatus: 'AI Analysis Complete',
    loanType: 'SME Expansion Credit',
    riskBreakdown: {
      documentForensics: { score: 79, status: 'Review', explanation: 'Tax deduction schedules exhibit duplicate transaction sequence IDs.' },
      kycAnalysis: { score: 72, status: 'Review', explanation: 'Lighting variance and synthetic background suppression observed.' },
      fraudNetwork: { score: 86, status: 'Connected', explanation: 'Direct collision with known syndicate phone cluster.' },
      evidenceIntegrity: { score: 45, status: 'Warning', explanation: 'Document creation timestamp post-dates file submission metadata.' }
    },
    reasons: [
      { id: 'r1', title: 'Suspicious duplicate transaction records', severity: 'critical', explanation: 'Audit log reveals duplicated batch vouchers across separate vendor payments.', linkTo: '/documents' },
      { id: 'r2', title: 'Phone number linked to high-velocity syndicate', severity: 'critical', explanation: 'Carrier records indicate temporary VoIP provisioning.', linkTo: '/fraud-network' }
    ],
    timeline: [
      { time: '20:45', event: 'Application submitted', type: 'submission' },
      { time: '20:48', event: 'Documents uploaded', type: 'doc' },
      { time: '20:50', event: 'Document forensics completed', type: 'doc' },
      { time: '20:52', event: 'Fraud network analysis completed', type: 'network' },
      { time: '20:53', event: 'Risk assessment generated', type: 'risk' }
    ],
    evidence: [
      { id: 'ev1', type: 'BANK STATEMENT', status: 'Review', risk: 'High', state: 'Duplicate Vouchers', hash: '77a1...09cc' },
      { id: 'ev2', type: 'GST FILING', status: 'Review', risk: 'Medium', state: 'Filing Re-scan Needed', hash: '22b4...88aa' },
      { id: 'ev3', type: 'IDENTITY DOCUMENT', status: 'Verified', risk: 'Low', state: 'Valid Document', hash: '55f1...112e' },
      { id: 'ev4', type: 'KYC VIDEO', status: 'Review', risk: 'High', state: 'Liveness Under Review', hash: '88c3...664b' }
    ],
    digitalSignals: [
      { type: 'DEVICE', value: 'Device-118A', detail: 'Shared with 2 loan requests' },
      { type: 'IP ADDRESS', value: '192.0.2.77', detail: 'VPN egress proxy' },
      { type: 'BANK ACCOUNT', value: '•••• 9940', detail: 'Recently opened account (8 days)' },
      { type: 'EMAIL DOMAIN', value: 'rao-enterprises.net', detail: 'Registered 3 days prior to inquiry' }
    ]
  },
  {
    id: 'APP-1005',
    applicant: 'Vikram Singh',
    submittedAt: '52 min ago',
    timestamp: '2026-09-18 20:39 UTC',
    loanAmount: '₹32,000',
    documentStatus: 'Review',
    kycStatus: 'Verified',
    networkStatus: 'Connected',
    integrityStatus: 'Verified',
    riskScore: 76,
    riskLevel: 'HIGH',
    status: 'Investigate',
    applicationStatus: 'Needs Investigation',
    analysisStatus: 'AI Analysis Complete',
    loanType: 'Commercial Equipment Lease',
    riskBreakdown: {
      documentForensics: { score: 68, status: 'Review', explanation: 'Invoice supplier address registered to residential apartment.' },
      kycAnalysis: { score: 18, status: 'Verified', explanation: 'Government biometric database match verified.' },
      fraudNetwork: { score: 88, status: 'Connected', explanation: 'Equipment vendor EIN matches 5 default accounts.' },
      evidenceIntegrity: { score: 89, status: 'Verified', explanation: 'Evidence chain securely anchored on ledger.' }
    },
    reasons: [
      { id: 'r1', title: 'Invoice supplier associated with historical defaults', severity: 'critical', explanation: 'Vendor entity flagged on creditor risk registry.', linkTo: '/fraud-network' },
      { id: 'r2', title: 'Rapid re-application velocity across digital channels', severity: 'high', explanation: '4 parallel inquiries submitted within 3 hours.', linkTo: '/fraud-network' }
    ],
    timeline: [
      { time: '20:30', event: 'Application submitted', type: 'submission' },
      { time: '20:33', event: 'Documents uploaded', type: 'doc' },
      { time: '20:36', event: 'Document forensics completed', type: 'doc' },
      { time: '20:38', event: 'Fraud network analysis completed', type: 'network' },
      { time: '20:39', event: 'Risk assessment generated', type: 'risk' }
    ],
    evidence: [
      { id: 'ev1', type: 'BANK STATEMENT', status: 'Verified', risk: 'Low', state: 'Pass', hash: '99d1...224a' },
      { id: 'ev2', type: 'GST FILING', status: 'Review', risk: 'High', state: 'Vendor Address Discrepancy', hash: '44e8...771c' },
      { id: 'ev3', type: 'IDENTITY DOCUMENT', status: 'Verified', risk: 'Low', state: 'Pass', hash: '66a0...339d' },
      { id: 'ev4', type: 'KYC VIDEO', status: 'Verified', risk: 'Low', state: 'Pass', hash: '11f2...558b' }
    ],
    digitalSignals: [
      { type: 'DEVICE', value: 'Device-99C1', detail: 'Shared with 4 loan applications' },
      { type: 'IP ADDRESS', value: '192.0.2.105', detail: 'Data center hosting IP' },
      { type: 'BANK ACCOUNT', value: '•••• 3319', detail: 'Single application' },
      { type: 'EMAIL DOMAIN', value: 'vikram-heavyequip.com', detail: 'Established vendor domain' }
    ]
  },
  {
    id: 'APP-1006',
    applicant: 'Devon Apex Logistics',
    submittedAt: '1h 14m ago',
    timestamp: '2026-09-18 20:17 UTC',
    loanAmount: '₹1,20,000',
    documentStatus: 'Suspicious',
    kycStatus: 'Review',
    networkStatus: 'Watch',
    integrityStatus: 'Warning',
    riskScore: 68,
    riskLevel: 'HIGH',
    status: 'Needs Review',
    applicationStatus: 'Under Active Review',
    analysisStatus: 'AI Analysis Complete',
    loanType: 'Fleet Expansion Term Loan',
    riskBreakdown: {
      documentForensics: { score: 78, status: 'Suspicious', explanation: 'Photoshop metadata signature in PDF header.' },
      kycAnalysis: { score: 42, status: 'Review', explanation: 'Authorized signatory POA requires secondary identity verification.' },
      fraudNetwork: { score: 55, status: 'Watch', explanation: 'Shared phone with non-operational corporate entity.' },
      evidenceIntegrity: { score: 38, status: 'Warning', explanation: 'Audit hash does not match issuer baseline.' }
    },
    reasons: [
      { id: 'r1', title: 'Photoshop 24.1 metadata artifact detected', severity: 'critical', explanation: 'Statement was exported from graphic design editor instead of banking software.', linkTo: '/documents' }
    ],
    timeline: [
      { time: '20:00', event: 'Application submitted', type: 'submission' },
      { time: '20:10', event: 'Document forensics completed', type: 'doc' },
      { time: '20:17', event: 'Risk assessment generated', type: 'risk' }
    ],
    evidence: [
      { id: 'ev1', type: 'BANK STATEMENT', status: 'Suspicious', risk: 'High', state: 'Photoshop Artifact Found', hash: 'ca97...48bb' },
      { id: 'ev2', type: 'GST FILING', status: 'Verified', risk: 'Low', state: 'Consistent Receipts', hash: '55e2...99aa' },
      { id: 'ev3', type: 'IDENTITY DOCUMENT', status: 'Verified', risk: 'Low', state: 'POA Valid', hash: '33b1...88cc' },
      { id: 'ev4', type: 'KYC VIDEO', status: 'Review', risk: 'Medium', state: 'Manual Signoff Needed', hash: '11c4...66aa' }
    ],
    digitalSignals: [
      { type: 'DEVICE', value: 'Device-44A9', detail: 'Shared across corporate fleet apps' },
      { type: 'IP ADDRESS', value: '192.0.2.49', detail: 'Static commercial office IP' },
      { type: 'BANK ACCOUNT', value: '•••• 7102', detail: 'Commercial checking account' },
      { type: 'EMAIL DOMAIN', value: 'devon-logistics.com', detail: 'Corporate domain (5 yrs)' }
    ]
  },
  {
    id: 'APP-1007',
    applicant: 'Elena Rostova',
    submittedAt: '1h 42m ago',
    timestamp: '2026-09-18 19:49 UTC',
    loanAmount: '₹12,500',
    documentStatus: 'Verified',
    kycStatus: 'Verified',
    networkStatus: 'Clear',
    integrityStatus: 'Verified',
    riskScore: 14,
    riskLevel: 'LOW',
    status: 'Verified',
    applicationStatus: 'Approved & Cleared',
    analysisStatus: 'AI Analysis Complete',
    loanType: 'Unsecured Personal Loan',
    riskBreakdown: {
      documentForensics: { score: 10, status: 'Verified', explanation: 'All salary slips and Form 16 documents certified without tampering.' },
      kycAnalysis: { score: 12, status: 'Verified', explanation: 'High-precision facial liveness confirmed.' },
      fraudNetwork: { score: 9, status: 'Clear', explanation: 'Clean device, clean IP, no collision history.' },
      evidenceIntegrity: { score: 99, status: 'Verified', explanation: 'Cryptographic ledger seal validated.' }
    },
    reasons: [
      { id: 'r1', title: 'Clean profile & verified employer', severity: 'low', explanation: 'Identity, payroll, and banking records fully reconciled.', linkTo: '/documents' }
    ],
    timeline: [
      { time: '19:40', event: 'Application submitted', type: 'submission' },
      { time: '19:45', event: 'Forensics completed', type: 'doc' },
      { time: '19:49', event: 'Risk assessment generated', type: 'risk' }
    ],
    evidence: [
      { id: 'ev1', type: 'BANK STATEMENT', status: 'Verified', risk: 'Low', state: 'Clean Audit', hash: '8f43...aa4' },
      { id: 'ev2', type: 'GST FILING', status: 'Verified', risk: 'Low', state: 'Cleared', hash: '22a8...bb1' },
      { id: 'ev3', type: 'IDENTITY DOCUMENT', status: 'Verified', risk: 'Low', state: 'Cleared', hash: '11d9...ee2' },
      { id: 'ev4', type: 'KYC VIDEO', status: 'Verified', risk: 'Low', state: 'Cleared', hash: '77f1...99c' }
    ],
    digitalSignals: [
      { type: 'DEVICE', value: 'Device-88F1', detail: 'Single user device' },
      { type: 'IP ADDRESS', value: '192.0.2.12', detail: 'Residential broadband' },
      { type: 'BANK ACCOUNT', value: '•••• 6041', detail: 'Established payroll' },
      { type: 'EMAIL DOMAIN', value: 'biotech-consult.org', detail: 'Verified work email' }
    ]
  },
  {
    id: 'APP-1008',
    applicant: 'Marcus Vance',
    submittedAt: '2h 10m ago',
    timestamp: '2026-09-18 19:21 UTC',
    loanAmount: '₹35,000',
    documentStatus: 'Suspicious',
    kycStatus: 'Review',
    networkStatus: 'Connected',
    integrityStatus: 'Warning',
    riskScore: 89,
    riskLevel: 'HIGH',
    status: 'Investigate',
    applicationStatus: 'Needs Investigation',
    analysisStatus: 'AI Analysis Complete',
    loanType: 'High-Velocity Personal Loan',
    riskBreakdown: {
      documentForensics: { score: 89, status: 'Suspicious', explanation: 'Font kerning variance on salary figures and altered routing codes.' },
      kycAnalysis: { score: 62, status: 'Review', explanation: 'PAN issuance records do not align with applicant stated age (44 yrs).' },
      fraudNetwork: { score: 94, status: 'Connected', explanation: 'Device fingerprint shared across 19 loan applications.' },
      evidenceIntegrity: { score: 31, status: 'Warning', explanation: 'Evidence hash mismatch on ledger proof.' }
    },
    reasons: [
      { id: 'r1', title: 'Synthetic identity risk (PAN / DOB mismatch)', severity: 'critical', explanation: 'PAN randomized issuance pattern indicates synthetic identity construct.', linkTo: '/kyc-analysis' },
      { id: 'r2', title: 'Device fingerprint shared across 19 applications', severity: 'critical', explanation: 'IMEI identifier repeatedly utilized across 4 different applicant names.', linkTo: '/fraud-network' }
    ],
    timeline: [
      { time: '19:10', event: 'Application submitted', type: 'submission' },
      { time: '19:15', event: 'Document forensics completed', type: 'doc' },
      { time: '19:18', event: 'Fraud network analysis completed', type: 'network' },
      { time: '19:21', event: 'Risk assessment generated', type: 'risk' }
    ],
    evidence: [
      { id: 'ev1', type: 'BANK STATEMENT', status: 'Suspicious', risk: 'High', state: 'Tampered Salary Line', hash: 'e3b0...b855' },
      { id: 'ev2', type: 'GST FILING', status: 'Suspicious', risk: 'High', state: 'Shell Entity Pattern', hash: '7a9c...3e1f' },
      { id: 'ev3', type: 'IDENTITY DOCUMENT', status: 'Review', risk: 'High', state: 'PAN Discrepancy', hash: '09a4...89d2' },
      { id: 'ev4', type: 'KYC VIDEO', status: 'Review', risk: 'Medium', state: 'Liveness Under Review', hash: '42d8...1a56' }
    ],
    digitalSignals: [
      { type: 'DEVICE', value: 'Device-Apple-9940', detail: 'Shared across 19 applications' },
      { type: 'IP ADDRESS', value: '192.0.2.89', detail: 'Subnet linked to PhantomApex syndicate' },
      { type: 'BANK ACCOUNT', value: '•••• 9901', detail: 'Rapid turnover mule account' },
      { type: 'EMAIL DOMAIN', value: 'fast-apex-capital.com', detail: 'Registered 14 days ago' }
    ]
  }
];

const idAliases = {
  'TL-98214': 'APP-1008',
  'TL-98213': 'APP-1007',
  'TL-98212': 'APP-1006',
  'TL-98211': 'APP-1001',
  'TL-98210': 'APP-1003'
};

export function getApplicationById(id) {
  if (!id) return null;
  const cleanId = String(id).trim().toUpperCase();
  const targetId = idAliases[cleanId] || cleanId;
  return applicationsList.find((app) => app.id.toUpperCase() === targetId) || null;
}

