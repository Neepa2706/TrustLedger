/**
 * TrustLedger Synthetic Demo Loan Products Catalog (Phase 2)
 * 
 * IMPORTANT PRODUCT POSITIONING:
 * These are demo financial products created for the hackathon prototype.
 * They are clearly marked as DEMO PRODUCTS and do not represent guaranteed
 * offers or commitments from any licensed financial institution.
 */

export const DEMO_LOAN_PRODUCTS = [
  {
    id: 'personal-loan',
    name: 'Personal Loan',
    category: 'Personal',
    tagline: 'Flexible financing for personal aspirations & needs',
    description: 'Quick digital credit for medical expenses, family occasions, home renovation, or planned personal expenses with flexible tenure.',
    minAmount: 25000,
    maxAmount: 500000,
    defaultAmount: 150000,
    minDurationMonths: 6,
    maxDurationMonths: 36,
    defaultDurationMonths: 24,
    minInterestRate: 12.0,
    maxInterestRate: 18.0,
    defaultInterestRate: 14.5,
    processingFeePercentage: 2.0,
    processingFeeDescription: 'Up to 2% of sanctioned loan amount',
    iconName: 'UserCheck',
    badge: 'Popular Choice',
    purposeOptions: [
      'Medical Expenses',
      'Home Improvement / Renovation',
      'Family Occasion / Wedding',
      'Higher Education',
      'Consolidate Existing Debts',
      'Other Personal Need'
    ],
    requiredDocuments: [
      { type: 'Identity Proof', required: true, note: 'Aadhaar Card (pre-verified from your profile)' },
      { type: 'Address Proof', required: true, note: 'Electricity bill, Voter ID, or Rental agreement' },
      { type: 'Income Proof', required: true, note: 'Recent Salary Slip or Form 16' },
      { type: 'Bank Statement', required: true, note: 'Last 3 months bank account statement (PDF)' }
    ],
    eligibilityCriteria: [
      'Indian citizen aged between 21 and 58 years',
      'Minimum monthly net income of ₹25,000',
      'Active savings bank account with Net Banking / UPI',
      'Verified TrustLedger profile'
    ],
    demoOnly: true
  },
  {
    id: 'emergency-loan',
    name: 'Emergency Cash Loan',
    category: 'Emergency',
    tagline: 'Urgent liquidity for unexpected life events',
    description: 'Immediate short-term liquidity for medical emergencies, sudden travel, or urgent repair needs with fast document processing.',
    minAmount: 10000,
    maxAmount: 100000,
    defaultAmount: 40000,
    minDurationMonths: 3,
    maxDurationMonths: 18,
    defaultDurationMonths: 9,
    minInterestRate: 14.0,
    maxInterestRate: 20.0,
    defaultInterestRate: 16.0,
    processingFeePercentage: 2.0,
    processingFeeDescription: 'Up to 2% processing fee',
    iconName: 'Zap',
    badge: 'Fast Turnaround',
    purposeOptions: [
      'Urgent Medical Emergency',
      'Emergency Vehicle Repair',
      'Urgent Household Maintenance',
      'Travel for Family Emergency',
      'Short-term Cash Bridge'
    ],
    requiredDocuments: [
      { type: 'Identity Proof', required: true, note: 'Aadhaar Card (pre-verified from your profile)' },
      { type: 'Address Proof', required: true, note: 'Utility bill or Government issued address ID' },
      { type: 'Income Proof', required: true, note: 'Latest 1 month salary slip or bank credit proof' }
    ],
    eligibilityCriteria: [
      'Indian resident aged 20 years or above',
      'Regular source of monthly income (₹15,000+)',
      'Verified TrustLedger personal account'
    ],
    demoOnly: true
  },
  {
    id: 'business-support-loan',
    name: 'Business Support Loan',
    category: 'Business',
    tagline: 'Working capital & inventory financing for MSMEs',
    description: 'Empower your enterprise with collateral-free working capital, stock inventory purchases, machinery upgrades, and vendor payments.',
    minAmount: 50000,
    maxAmount: 1000000,
    defaultAmount: 350000,
    minDurationMonths: 12,
    maxDurationMonths: 48,
    defaultDurationMonths: 36,
    minInterestRate: 13.0,
    maxInterestRate: 19.0,
    defaultInterestRate: 15.0,
    processingFeePercentage: 2.0,
    processingFeeDescription: 'Up to 2% processing fee',
    iconName: 'Briefcase',
    badge: 'MSME Growth',
    purposeOptions: [
      'Working Capital / Cash Flow',
      'Inventory Restocking',
      'Shop Renovation / Modernization',
      'Equipment / Machinery Purchase',
      'Business Marketing & Expansion'
    ],
    requiredDocuments: [
      { type: 'Identity Proof', required: true, note: 'Aadhaar Card (pre-verified from your profile)' },
      { type: 'Business Proof', required: true, note: 'Udyam Registration, GST Certificate, or Trade License' },
      { type: 'Bank Statement', required: true, note: 'Last 6 months current or savings account statement' },
      { type: 'Income Proof', required: true, note: 'ITR or Financial summary' }
    ],
    eligibilityCriteria: [
      'Business operating for at least 1 year',
      'Valid business registration or MSME Udyam certificate',
      'Annual business turnover of ₹3,00,000+',
      'Verified TrustLedger profile'
    ],
    demoOnly: true
  },
  {
    id: 'two-wheeler-loan',
    name: 'Two-Wheeler Loan',
    category: 'Vehicle',
    tagline: 'Drive your dream bike or EV scooter',
    description: 'Affordable on-road financing for commuter motorcycles, gearless scooters, and electric two-wheelers with low processing charges.',
    minAmount: 30000,
    maxAmount: 200000,
    defaultAmount: 85000,
    minDurationMonths: 12,
    maxDurationMonths: 36,
    defaultDurationMonths: 24,
    minInterestRate: 11.0,
    maxInterestRate: 15.0,
    defaultInterestRate: 12.5,
    processingFeePercentage: 1.5,
    processingFeeDescription: '1.5% processing fee',
    iconName: 'Compass',
    badge: 'Low Interest',
    purposeOptions: [
      'New Motorcycle Purchase',
      'Electric Scooter (EV) Purchase',
      'Commuter Scooter Purchase'
    ],
    requiredDocuments: [
      { type: 'Identity Proof', required: true, note: 'Aadhaar Card (pre-verified)' },
      { type: 'Address Proof', required: true, note: 'Current address proof' },
      { type: 'Income Proof', required: true, note: 'Recent salary credit or ITR' }
    ],
    eligibilityCriteria: [
      'Aged 21 to 65 years',
      'Salaried or self-employed with ₹18,000+ monthly income',
      'Valid driving license preferred'
    ],
    demoOnly: true
  },
  {
    id: 'education-skill-loan',
    name: 'Education & Skills Loan',
    category: 'Education',
    tagline: 'Invest in your career advancement',
    description: 'Career-focused educational financing for tech coding bootcamps, executive diplomas, aviation training, and certification programs.',
    minAmount: 40000,
    maxAmount: 400000,
    defaultAmount: 120000,
    minDurationMonths: 6,
    maxDurationMonths: 36,
    defaultDurationMonths: 18,
    minInterestRate: 10.0,
    maxInterestRate: 14.0,
    defaultInterestRate: 11.5,
    processingFeePercentage: 1.0,
    processingFeeDescription: '1% processing fee',
    iconName: 'GraduationCap',
    badge: 'Career Boost',
    purposeOptions: [
      'Software Development / Data Bootcamp',
      'Executive MBA / Certification',
      'Aviation / Technical Skill Training',
      'Professional License Exam Coaching'
    ],
    requiredDocuments: [
      { type: 'Identity Proof', required: true, note: 'Aadhaar Card (pre-verified)' },
      { type: 'Course Admission Proof', required: true, note: 'Offer letter or course fee invoice' },
      { type: 'Income Proof', required: true, note: 'Applicant or Co-applicant income proof' }
    ],
    eligibilityCriteria: [
      'Confirmed admission in recognized educational institution or course',
      'Minimum 10+2 qualification',
      'Applicant or earning co-applicant required'
    ],
    demoOnly: true
  },
  {
    id: 'drone-commercial-loan',
    name: 'Drone Commercial & Enterprise Loan',
    category: 'Commercial Drone',
    tagline: 'DGCA-registered UAVs, agriculture sprayers & mapping rigs',
    description: 'Financing for commercial UAVs, DGCA-registered agricultural sprayers, aerial surveying LiDAR payloads, and enterprise drone fleets with flexible repayment.',
    minAmount: 100000,
    maxAmount: 2000000,
    defaultAmount: 650000,
    minDurationMonths: 12,
    maxDurationMonths: 60,
    defaultDurationMonths: 36,
    minInterestRate: 11.5,
    maxInterestRate: 16.5,
    defaultInterestRate: 13.0,
    processingFeePercentage: 1.5,
    processingFeeDescription: '1.5% processing fee on sanctioned amount',
    iconName: 'Send',
    badge: 'Enterprise Specialized',
    purposeOptions: [
      'DGCA Approved Drone Purchase',
      'Agricultural Spraying & Precision Farming UAV',
      'Aerial Surveying, Mapping & LiDAR Payload',
      'Drone Repair, Fleet Maintenance & Ground Control Station',
      'Enterprise Drone Service Expansion'
    ],
    requiredDocuments: [
      { type: 'Identity Proof', required: true, note: 'Aadhaar / Passport (pre-verified)' },
      { type: 'Bank Statement', required: true, note: 'Last 6 months active bank account statement (PDF)' },
      { type: 'DGCA Drone Registration / UIN', required: true, note: 'DGCA Digital Sky UIN / DAN Certificate or Proforma Invoice' },
      { type: 'Drone Insurance', required: true, note: 'Drone Third-Party / Hull Insurance policy or quote' }
    ],
    eligibilityCriteria: [
      'Indian citizen or registered entity aged 21 to 60 years',
      'Valid DGCA Remote Pilot Certificate or certified drone operator',
      'Active bank account with regular cashflow (₹40,000+ monthly)',
      'Commercial drone model compliant with DGCA Digital Sky requirements'
    ],
    demoOnly: true
  }
];

export function normalizeLoanProduct(p) {
  if (!p) return null;
  const staticMatch = DEMO_LOAN_PRODUCTS.find((d) => d.id === p.id) || {};

  const minAmt = Number(p.minAmount ?? p.min_amount ?? staticMatch.minAmount ?? 10000);
  const maxAmt = Number(p.maxAmount ?? p.max_amount ?? staticMatch.maxAmount ?? 500000);
  const minDur = Number(p.minDurationMonths ?? p.min_duration_months ?? staticMatch.minDurationMonths ?? 6);
  const maxDur = Number(p.maxDurationMonths ?? p.max_duration_months ?? staticMatch.maxDurationMonths ?? 36);
  const minRate = Number(p.minInterestRate ?? p.min_interest_rate ?? staticMatch.minInterestRate ?? 12.0);
  const maxRate = Number(p.maxInterestRate ?? p.max_interest_rate ?? staticMatch.maxInterestRate ?? 18.0);
  const feePct = Number(p.processingFeePercentage ?? p.processing_fee_percentage ?? staticMatch.processingFeePercentage ?? 2.0);
  const feeDesc = p.processingFeeDescription || p.processing_fee_description || staticMatch.processingFeeDescription || `Up to ${feePct}%`;

  const purposes = p.purposeOptions || p.purpose_options || staticMatch.purposeOptions || ['Personal Need'];
  const reqDocs = p.requiredDocuments || p.required_documents || staticMatch.requiredDocuments || [];
  const criteria = p.eligibilityCriteria || p.eligibility_criteria || staticMatch.eligibilityCriteria || [];

  return {
    ...staticMatch,
    ...p,
    id: p.id,
    name: p.name || staticMatch.name || 'Personal Loan',
    category: p.category || staticMatch.category || 'Personal',
    tagline: p.tagline || staticMatch.tagline || 'Digital lending for verified borrowers',
    description: p.description || staticMatch.description || 'Flexible digital credit product.',
    iconName: p.iconName || staticMatch.iconName || (p.category === 'Emergency' ? 'Zap' : p.category === 'Business' ? 'Briefcase' : p.category === 'Education' ? 'GraduationCap' : 'UserCheck'),
    badge: p.badge || staticMatch.badge || (p.category === 'Personal' ? 'Popular Choice' : p.category === 'Emergency' ? 'Fast Turnaround' : null),

    // Standardized CamelCase for UI components
    minAmount: minAmt,
    maxAmount: maxAmt,
    defaultAmount: Number(p.defaultAmount || staticMatch.defaultAmount || Math.round((minAmt + maxAmt) / 4 / 1000) * 1000),
    minDurationMonths: minDur,
    maxDurationMonths: maxDur,
    defaultDurationMonths: Number(p.defaultDurationMonths || staticMatch.defaultDurationMonths || 24),
    minInterestRate: minRate,
    maxInterestRate: maxRate,
    defaultInterestRate: Number(p.defaultInterestRate || staticMatch.defaultInterestRate || Number(((minRate + maxRate) / 2).toFixed(1))),
    processingFeePercentage: feePct,
    processingFeeDescription: feeDesc,
    purposeOptions: purposes,
    requiredDocuments: reqDocs,
    eligibilityCriteria: criteria,

    // Snake_case aliases
    min_amount: minAmt,
    max_amount: maxAmt,
    min_duration_months: minDur,
    max_duration_months: maxDur,
    min_interest_rate: minRate,
    max_interest_rate: maxRate,
    processing_fee_percentage: feePct,
    processing_fee_description: feeDesc,
    purpose_options: purposes,
    required_documents: reqDocs,
    eligibility_criteria: criteria,

    demoOnly: true,
    active: true
  };
}

export function getLoanProductById(id) {
  const p = DEMO_LOAN_PRODUCTS.find((item) => item.id === id) || null;
  return normalizeLoanProduct(p);
}

export function calculateEstimatedEmi(principal, annualRatePct, tenureMonths) {
  if (!principal || !tenureMonths || principal <= 0 || tenureMonths <= 0) {
    return { emi: 0, totalRepayment: 0, totalInterest: 0 };
  }

  const monthlyRate = annualRatePct / 12.0 / 100.0;
  let emi = 0;

  if (monthlyRate === 0) {
    emi = principal / tenureMonths;
  } else {
    const factor = Math.pow(1.0 + monthlyRate, tenureMonths);
    emi = (principal * monthlyRate * factor) / (factor - 1.0);
  }

  const roundedEmi = Math.round(emi);
  const totalRepayment = roundedEmi * tenureMonths;
  const totalInterest = Math.max(0, totalRepayment - principal);

  return {
    emi: roundedEmi,
    totalRepayment,
    totalInterest
  };
}
