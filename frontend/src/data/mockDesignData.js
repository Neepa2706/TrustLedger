/**
 * TrustLedger Mock Design Dataset (Phases 1-4)
 * Precision KPIs, risk distributions, synthetic Indian applications,
 * and multi-pillar threat telemetry for the Lender Portal.
 */

export const mockOverviewStats = [
  {
    id: 'total-applications',
    title: 'Total Applications',
    value: 128,
    prefix: '',
    suffix: '',
    change: '+14.2%',
    trend: 'up',
    isPositiveTrend: true,
    description: 'Active loan intake cohort',
    badge: 'Portfolio',
    category: 'activity'
  },
  {
    id: 'high-risk',
    title: 'High Risk',
    value: 6,
    prefix: '0',
    suffix: '',
    change: '-2',
    trend: 'down',
    isPositiveTrend: true,
    description: 'Intercepted before disbursement',
    badge: 'Priority',
    category: 'threat'
  },
  {
    id: 'needs-review',
    title: 'Needs Review',
    value: 17,
    prefix: '',
    suffix: '',
    change: '+3',
    trend: 'up',
    isPositiveTrend: false,
    description: 'Pending underwriter signoff',
    badge: 'Attention',
    category: 'financial'
  },
  {
    id: 'evidence-verified',
    title: 'Evidence Verified',
    value: 105,
    prefix: '',
    suffix: '',
    change: '82%',
    trend: 'up',
    isPositiveTrend: true,
    description: 'Cryptographically sealed records',
    badge: 'Verified',
    category: 'integrity'
  }
];

export const mockRiskDistribution = [
  { bracket: '0-29 (Low)', count: 78, percentage: 60.9, status: 'safe' },
  { bracket: '30-69 (Medium)', count: 32, percentage: 25.0, status: 'warning' },
  { bracket: '70-100 (High)', count: 18, percentage: 14.1, status: 'critical' },
];

export const mockHourlyTrend = [
  { time: 'Day 1', total: 18, fraud: 1 },
  { time: 'Day 2', total: 22, fraud: 0 },
  { time: 'Day 3', total: 24, fraud: 2 },
  { time: 'Day 4', total: 19, fraud: 1 },
  { time: 'Day 5', total: 21, fraud: 0 },
  { time: 'Day 6', total: 16, fraud: 1 },
  { time: 'Day 7', total: 8,  fraud: 1 },
];

export const mockApplications = [
  {
    id: 'TL-APP-10001',
    applicantName: 'Arjun Kumar',
    loanAmount: '₹2,00,000',
    riskScore: 68,
    riskLevel: 'MEDIUM',
    status: 'UNDER REVIEW',
    primaryVector: 'Connected digital signals require investigation (Device & IP overlap)',
    ledgerHash: 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855',
    timestamp: 'Just now'
  },
  {
    id: 'APP-1001',
    applicantName: 'Arjun Mehta',
    loanAmount: '₹15,000',
    riskScore: 18,
    riskLevel: 'LOW',
    status: 'VERIFIED',
    primaryVector: 'Clean profile & verified employer payroll',
    ledgerHash: '8f434346648f6b96df89dda901c5176b10a6d83961dd3c1ac88b59b2dc327aa4',
    timestamp: '2 mins ago'
  },
  {
    id: 'APP-1002',
    applicantName: 'Priya Sharma',
    loanAmount: '₹28,000',
    riskScore: 54,
    riskLevel: 'MEDIUM',
    status: 'NEEDS REVIEW',
    primaryVector: 'Minor line-item kerning variance on bank statement',
    ledgerHash: 'ca978112ca1bbdcafac231b39a23dc4da786eff8147c4e72b9807785afee48bb',
    timestamp: '14 mins ago'
  },
  {
    id: 'APP-1003',
    applicantName: 'Rahul Verma',
    loanAmount: '₹1,50,000',
    riskScore: 91,
    riskLevel: 'HIGH',
    status: 'FLAGGED',
    primaryVector: 'OCR residue mismatch: Net deposit altered from ₹25,000 to ₹95,000',
    ledgerHash: '35a92a54902b781878b277b02db74cb3efaeabf91ba632b4b41efc1b48b1bfb9',
    timestamp: '24 mins ago'
  },
  {
    id: 'APP-1004',
    applicantName: 'Ananya Rao',
    loanAmount: '₹75,000',
    riskScore: 84,
    riskLevel: 'HIGH',
    status: 'FLAGGED',
    primaryVector: 'Connected digital signal: Device-7F2A shared with 3 applications',
    ledgerHash: 'fb8e20fc2e4c3f248c60c39bd652f3c1347298ab97b8b814a09c25091d310e5c',
    timestamp: '38 mins ago'
  },
  {
    id: 'APP-1005',
    applicantName: 'Vikram Singh',
    loanAmount: '₹1,20,000',
    riskScore: 76,
    riskLevel: 'HIGH',
    status: 'FLAGGED',
    primaryVector: 'Bank account •••• 4821 linked to multiple concurrent applications',
    ledgerHash: '72bd94294abfe019284102948102947182948291048291829471829482910482',
    timestamp: '52 mins ago'
  }
];

export const mockTimelineEvents = [
  {
    id: 'evt-1',
    timestamp: '10:31:00 UTC',
    title: 'Application TL-APP-10001 Assigned for Underwriter Review',
    details: 'Arjun Kumar submitted Personal Loan application for ₹2,00,000. 5-pillar signals synthesized.',
    riskLevel: 'warning',
    entityId: 'TL-APP-10001',
    hash: 'e3b0c4...b855'
  },
  {
    id: 'evt-2',
    timestamp: '10:24:00 UTC',
    title: 'Connected Digital Signals Flagged',
    details: 'Device-7F2A and IP 192.0.2.24 detected across multiple applications. Investigation recommended.',
    riskLevel: 'critical',
    entityId: 'TL-APP-10001',
    hash: '7a9c8b...3e1f'
  },
  {
    id: 'evt-3',
    timestamp: '10:20:00 UTC',
    title: 'Document Optical Quality Evaluated',
    details: 'Salary slip and Bank Statement inspected. Minor line-item variance noted for underwriter.',
    riskLevel: 'warning',
    entityId: 'TL-APP-10001',
    hash: '09a41c...89d2'
  },
  {
    id: 'evt-4',
    timestamp: '10:15:00 UTC',
    title: 'Biometric Camera Photograph Verified',
    details: 'Single face detected, centered framing, and sharpness passed optical heuristics.',
    riskLevel: 'safe',
    entityId: 'TL-APP-10001',
    hash: '42d8e0...1a56'
  }
];
