export const mockOverviewStats = [
  {
    id: 'scanned-today',
    title: 'Applications Screened',
    value: 12480,
    prefix: '',
    suffix: '',
    change: '+14.2%',
    trend: 'up',
    isPositiveTrend: true,
    description: 'vs. 10,928 previous 24h',
    badge: 'Real-time',
    category: 'activity'
  },
  {
    id: 'flagged-fraud',
    title: 'High-Risk Intercepts',
    value: 342,
    prefix: '',
    suffix: '',
    change: '-5.1%',
    trend: 'down',
    isPositiveTrend: true,
    description: 'Intercepted before disbursement',
    badge: 'Critical',
    category: 'threat'
  },
  {
    id: 'exposure-saved',
    title: 'Capital Protected',
    value: 4850000,
    prefix: '$',
    suffix: '',
    change: '+$640k',
    trend: 'up',
    isPositiveTrend: true,
    description: 'Estimated fraud loss prevented',
    badge: 'Shield Active',
    category: 'financial'
  },
  {
    id: 'evidence-blocks',
    title: 'Ledger Audit Seals',
    value: 49821,
    prefix: '',
    suffix: '',
    change: '100%',
    trend: 'up',
    isPositiveTrend: true,
    description: 'Cryptographically sealed records',
    badge: 'Tamper-Proof',
    category: 'integrity'
  }
];

export const mockRiskDistribution = [
  { bracket: '0-20 (Safe)', count: 8640, percentage: 69.2, status: 'safe' },
  { bracket: '21-40 (Low)', count: 2150, percentage: 17.2, status: 'safe' },
  { bracket: '41-65 (Moderate)', count: 980, percentage: 7.9, status: 'warning' },
  { bracket: '66-85 (High)', count: 480, percentage: 3.8, status: 'critical' },
  { bracket: '86-100 (Critical)', count: 230, percentage: 1.9, status: 'critical' },
];

export const mockHourlyTrend = [
  { time: '00:00', total: 420, fraud: 12 },
  { time: '03:00', total: 290, fraud: 18 },
  { time: '06:00', total: 540, fraud: 14 },
  { time: '09:00', total: 1180, fraud: 45 },
  { time: '12:00', total: 1450, fraud: 52 },
  { time: '15:00', total: 1620, fraud: 61 },
  { time: '18:00', total: 1390, fraud: 38 },
  { time: '21:00', total: 890, fraud: 22 },
];

export const mockApplications = [
  {
    id: 'TL-98214',
    applicantName: 'Marcus Vance',
    loanAmount: '$35,000',
    riskScore: 89,
    riskLevel: 'CRITICAL',
    status: 'FLAGGED',
    primaryVector: 'Synthetic Identity (SSN/DOB Mismatch)',
    ledgerHash: 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855',
    timestamp: '2 mins ago'
  },
  {
    id: 'TL-98213',
    applicantName: 'Elena Rostova',
    loanAmount: '$12,500',
    riskScore: 14,
    riskLevel: 'SAFE',
    status: 'VERIFIED',
    primaryVector: 'Clean Profile & Verified Employer',
    ledgerHash: '8f434346648f6b96df89dda901c5176b10a6d83961dd3c1ac88b59b2dc327aa4',
    timestamp: '6 mins ago'
  },
  {
    id: 'TL-98212',
    applicantName: 'Devon Apex Logistics LLC',
    loanAmount: '$120,000',
    riskScore: 68,
    riskLevel: 'HIGH',
    status: 'UNDER REVIEW',
    primaryVector: 'Font Inconsistency on PDF Bank Statement',
    ledgerHash: 'ca978112ca1bbdcafac231b39a23dc4da786eff8147c4e72b9807785afee48bb',
    timestamp: '14 mins ago'
  },
  {
    id: 'TL-98211',
    applicantName: 'Sophia Lin',
    loanAmount: '$8,000',
    riskScore: 22,
    riskLevel: 'SAFE',
    status: 'VERIFIED',
    primaryVector: 'Biometric Liveness Confirmed',
    ledgerHash: 'fb8e20fc2e4c3f248c60c39bd652f3c1347298ab97b8b814a09c25091d310e5c',
    timestamp: '21 mins ago'
  },
  {
    id: 'TL-98210',
    applicantName: 'Arjun Mehta',
    loanAmount: '$45,000',
    riskScore: 78,
    riskLevel: 'CRITICAL',
    status: 'FLAGGED',
    primaryVector: 'Device Fingerprint Shared Across 19 Applications',
    ledgerHash: '35a92a54902b781878b277b02db74cb3efaeabf91ba632b4b41efc1b48b1bfb9',
    timestamp: '32 mins ago'
  }
];

export const mockTimelineEvents = [
  {
    id: 'evt-1',
    timestamp: '18:52:04 UTC',
    title: 'Syndicate Velocity Anomaly Intercepted',
    details: 'IP subnet 194.26.29.0/24 attempted 12 loan requests within 90 seconds using rotating EINs.',
    riskLevel: 'critical',
    entityId: 'TL-98214',
    hash: '7a9c8b...3e1f'
  },
  {
    id: 'evt-2',
    timestamp: '18:47:19 UTC',
    title: 'PDF Bank Statement Metadata Tamper',
    details: 'Photoshop 24.1 software artifact found in metadata header for Devon Apex LLC.',
    riskLevel: 'warning',
    entityId: 'TL-98212',
    hash: '09a41c...89d2'
  },
  {
    id: 'evt-3',
    timestamp: '18:31:00 UTC',
    title: 'Biometric Liveness Verification Confirmed',
    details: 'Passive 3D liveness check cleared with 99.8% confidence score.',
    riskLevel: 'safe',
    entityId: 'TL-98211',
    hash: '42d8e0...1a56'
  },
  {
    id: 'evt-4',
    timestamp: '18:15:42 UTC',
    title: 'Ledger Audit Root Merkle Block Sealed',
    details: 'Batch #49821 anchoring 1,024 evidence signatures written to immutable store.',
    riskLevel: 'info',
    entityId: 'SYSTEM',
    hash: '90fb2a...cc78'
  }
];

export const mockNetworkGraphData = {
  nodes: [
    {
      id: 'target-loan',
      data: { label: 'Loan App #TL-98214', type: 'application', risk: 'critical' },
      position: { x: 260, y: 150 },
    },
    {
      id: 'dev-1',
      data: { label: 'Device ID (IMEI: 9940...31)', type: 'device', risk: 'critical' },
      position: { x: 60, y: 40 },
    },
    {
      id: 'phone-1',
      data: { label: 'VoIP Phone (+1 415-555-0192)', type: 'phone', risk: 'warning' },
      position: { x: 460, y: 40 },
    },
    {
      id: 'bank-1',
      data: { label: 'Bank Account (Routing 121000)', type: 'bank', risk: 'critical' },
      position: { x: 80, y: 270 },
    },
    {
      id: 'prior-fraud',
      data: { label: 'Flagged Syndicate: PhantomApex', type: 'syndicate', risk: 'critical' },
      position: { x: 450, y: 270 },
    },
  ],
  edges: [
    { id: 'e1', source: 'dev-1', target: 'target-loan', label: '19 Linked Loans', animated: true },
    { id: 'e2', source: 'phone-1', target: 'target-loan', label: 'Burner Carrier' },
    { id: 'e3', source: 'target-loan', target: 'bank-1', label: 'Mule Destination' },
    { id: 'e4', source: 'target-loan', target: 'prior-fraud', label: 'Shared SSN Pattern', animated: true },
  ]
};
