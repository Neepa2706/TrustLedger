"""
TrustLedger Loan Products & Application Schemas (Phase 2)
Defines models for synthetic loan products, multi-step application drafts,
financial information, document attachments, and pre-submission validation.
"""

from pydantic import BaseModel, Field
from typing import Optional, List, Dict, Any
from datetime import datetime


class LoanProduct(BaseModel):
    id: str
    name: str
    category: str  # Personal, Emergency, Business, Vehicle, Education
    description: str
    min_amount: int
    max_amount: int
    min_duration_months: int
    max_duration_months: int
    min_interest_rate: float
    max_interest_rate: float
    processing_fee_percentage: float
    processing_fee_description: str
    purpose_options: List[str]
    required_documents: List[Dict[str, Any]]
    eligibility_criteria: List[str]
    demo_only: bool = True
    active: bool = True


class LoanFinancialDetails(BaseModel):
    employer_or_business_name: Optional[str] = None
    work_experience_years: Optional[float] = None
    monthly_income: Optional[str] = None
    monthly_existing_obligations: Optional[str] = None
    approximate_monthly_expenses: Optional[str] = None
    payout_bank_name: Optional[str] = None
    payout_account_number: Optional[str] = None
    payout_account_masked: Optional[str] = None
    payout_ifsc_code: Optional[str] = None


class LoanApplicationDocument(BaseModel):
    document_id: str
    application_id: str
    document_type: str  # Identity Proof, Address Proof, Income Proof, Bank Statement, Business Proof
    filename: str
    file_type: str
    file_size_bytes: int
    storage_path: Optional[str] = None
    quality_status: str = "GOOD"  # GOOD, WARNING, ERROR
    quality_message: str = "Document quality looks acceptable."
    heuristic_type_match: str = "MATCH"  # MATCH, REVIEW, MISMATCH
    heuristic_message: Optional[str] = None
    is_pre_verified: bool = False
    uploaded_at: str


class LoanApplicationCreate(BaseModel):
    loan_product_id: str
    requested_amount: int = Field(..., gt=0)
    requested_duration_months: int = Field(..., gt=0)
    loan_purpose: str = Field(..., min_length=2)
    financial_details: Optional[LoanFinancialDetails] = None


class LoanApplicationUpdate(BaseModel):
    requested_amount: Optional[int] = None
    requested_duration_months: Optional[int] = None
    loan_purpose: Optional[str] = None
    current_step: Optional[int] = None
    financial_details: Optional[LoanFinancialDetails] = None
    application_status: Optional[str] = None  # DRAFT, READY_FOR_REVIEW, SUBMITTED


class LoanApplicationResponse(BaseModel):
    application_id: str
    user_id: str
    loan_product_id: str
    loan_product_name: str
    loan_category: str
    requested_amount: int
    requested_duration_months: int
    loan_purpose: str
    estimated_emi: int
    total_repayment: int
    total_interest: int
    current_step: int = 1  # 1 to 6
    application_status: str = "DRAFT"  # DRAFT, READY_FOR_REVIEW, SUBMITTED
    validation_status: str = "INCOMPLETE"  # INCOMPLETE, VALID, ACTION_REQUIRED
    validation_errors: List[str] = []
    # Pre-filled verified identity (locked)
    verified_applicant: Dict[str, Any]
    financial_details: LoanFinancialDetails
    documents: List[LoanApplicationDocument] = []
    is_demo: bool = True
    created_at: str
    updated_at: str


class LoanApplicationValidationResult(BaseModel):
    application_id: str
    is_valid: bool
    can_submit: bool
    status: str
    blocking_errors: List[str] = []
    advisories: List[str] = []
    summary: Dict[str, Any]


class DocumentComparisonResult(BaseModel):
    comparison_id: str
    application_id: str
    document_id: str
    document_type: str
    status: str  # MATCH, REVIEW, MISMATCH, NOT_CHECKED
    confidence: float = 0.90
    is_heuristic: bool = True
    matched_fields: List[str] = []
    review_fields: List[str] = []
    mismatched_fields: List[str] = []
    message: str
    internal_notes: Optional[str] = None
    compared_at: str


class KYCCheckItem(BaseModel):
    key: str
    title: str
    status: str  # completed, passed, review, failed, pending
    detail: str


class KYCVerificationResult(BaseModel):
    verification_id: str
    application_id: str
    user_id: str
    overall_status: str  # READY_FOR_SUBMISSION, REVIEW_REQUIRED, BLOCKED
    profile_identity_verified: bool
    identity_document_available: bool
    profile_photo_captured: bool
    face_detected: bool
    single_face_detected: bool
    face_quality_status: str  # GOOD, WARNING, ERROR
    face_check_label: str = "Face / KYC quality check"
    checks: List[KYCCheckItem] = []
    advisories: List[str] = []
    blocking_reasons: List[str] = []
    is_heuristic: bool = True
    can_submit: bool
    verified_at: Optional[str] = None


class FinalVerificationStatusResponse(BaseModel):
    application_id: str
    user_id: str
    overall_status: str  # READY_FOR_SUBMISSION, REVIEW_REQUIRED, BLOCKED
    can_submit: bool
    profile_verified: bool
    kyc_result: KYCVerificationResult
    document_comparisons: List[DocumentComparisonResult]
    blocking_reasons: List[str] = []
    advisories: List[str] = []
    declaration_required: bool = True
    message: str


class ApplicationSubmitRequest(BaseModel):
    borrower_declaration_confirmed: bool
    declaration_text: Optional[str] = None


class ApplicationSubmitResponse(BaseModel):
    application_id: str
    user_id: str
    loan_product_name: str
    requested_amount: int
    requested_duration_months: int
    application_status: str  # SUBMITTED
    current_step: str = "SUBMITTED"
    submitted_at: str
    kyc_status: str
    document_comparison_status: str
    next_step: str = "Lender verification"
    message: str
    is_demo: bool = True


class ApplicationAuditEvent(BaseModel):
    event_id: str
    application_id: str
    event_type: str
    event_summary: str
    timestamp: str
    event_hash: str


# =============================================================================
# PHASE 4: LENDER VERIFICATION, DECISIONS & INVESTIGATION MODELS
# =============================================================================

class UnderwriterDecisionRequest(BaseModel):
    decision: str = Field(..., description="APPROVED, REJECTED, or REQUEST_ACTION")
    decision_reason: Optional[str] = None
    internal_note: Optional[str] = None
    action_message: Optional[str] = None
    approved_amount: Optional[int] = None
    approved_duration_months: Optional[int] = None
    approved_interest_rate: Optional[float] = None
    approved_emi: Optional[int] = None


class ApprovedTerms(BaseModel):
    approved_amount: int
    approved_duration_months: int
    approved_interest_rate: float
    approved_emi: int
    approval_date: str
    decision_by: str = "Authorized Underwriter"


class UnderwriterDecisionResponse(BaseModel):
    application_id: str
    decision: str
    application_status: str
    reviewer_id: str
    reviewer_name: str
    approved_terms: Optional[ApprovedTerms] = None
    action_message: Optional[str] = None
    decision_reason: Optional[str] = None
    message: str
    decided_at: str


class ActionResponseSubmit(BaseModel):
    borrower_response: str
    response_document_id: Optional[str] = None


class ActionRequestDetail(BaseModel):
    request_id: str
    application_id: str
    requested_by: str
    request_type: str
    message: str
    status: str  # PENDING, RESOLVED
    borrower_response: Optional[str] = None
    created_at: str
    resolved_at: Optional[str] = None


class InvestigatorNoteCreate(BaseModel):
    note_text: str = Field(..., min_length=1)


class InvestigatorNoteResponse(BaseModel):
    note_id: str
    application_id: str
    author_id: str
    author_name: str
    note_text: str
    is_internal_only: bool = True
    created_at: str


class LenderApplicationListItem(BaseModel):
    id: str
    applicant: str
    loanProduct: str
    loanAmount: str
    requestedAmountNum: int
    submittedAt: str
    documentStatus: str
    kycStatus: str
    networkStatus: str
    integrityStatus: str
    riskScore: int
    riskLevel: str
    applicationStatus: str
    status: str
    loanType: str
    user_id: Optional[str] = None


class LenderInvestigationDetailsResponse(BaseModel):
    id: str
    applicant: str
    loanProduct: str
    loanAmount: str
    requestedAmountNum: int
    durationMonths: int
    submittedAt: str
    timestamp: str
    applicationStatus: str
    analysisStatus: str = "AI Analysis Complete"
    loanType: str
    riskScore: int
    riskLevel: str
    documentStatus: str
    kycStatus: str
    networkStatus: str
    integrityStatus: str
    
    # 5-Pillar Breakdown
    riskBreakdown: Dict[str, Any]
    reasons: List[Dict[str, Any]] = []
    timeline: List[Dict[str, Any]] = []
    evidence: List[Dict[str, Any]] = []
    digitalSignals: List[Dict[str, Any]] = []
    
    # Underwriting & Notes
    approvedTerms: Optional[ApprovedTerms] = None
    actionRequest: Optional[ActionRequestDetail] = None
    rejectionReason: Optional[str] = None
    internalNotes: List[InvestigatorNoteResponse] = []
    isDemo: bool = True


class BorrowerApplicationStatusResponse(BaseModel):
    application_id: str
    loan_product_name: str
    requested_amount: int
    requested_duration_months: int
    loan_purpose: str
    estimated_emi: int
    application_status: str  # SUBMITTED, UNDER_REVIEW, ACTION_REQUIRED, APPROVED, REJECTED
    current_stage: int  # 1 to 5
    submitted_at: Optional[str] = None
    updated_at: str
    next_step: str
    
    # Conditionally available data (strictly borrower-safe)
    approved_terms: Optional[ApprovedTerms] = None
    action_request: Optional[ActionRequestDetail] = None
    rejection_reason: Optional[str] = None
    
    # Zero exposure of internal notes or fraud graph
    message: str


# =============================================================================
# PHASE 5 / SECTION 34 EXTENSIONS: ALERTS, APPROVED LOANS, EVIDENCE, FORENSICS
# =============================================================================

class SecurityAlert(BaseModel):
    id: str
    category: str  # SUSPICIOUS_ACTIVITY, PAYMENT_DUE, MISSING_ACTION, DOCUMENT_ANOMALY
    title: str
    description: str
    severity: str  # INFO, REVIEW, HIGH
    source: str
    timestamp: str
    application_id: Optional[str] = None
    user_id: Optional[str] = None
    action_url: Optional[str] = None
    is_read: bool = False


class ApprovedLoanItem(BaseModel):
    id: str
    application_id: str
    borrower_name: str
    loan_type: str
    approved_amount: int
    tenure_months: int
    interest_rate: float
    emi: int
    approval_date: str
    payment_status: str  # CURRENT, UPCOMING, OVERDUE, GRACE_PERIOD
    total_paid: int
    total_remaining: int
    next_payment_due_date: str
    payment_progress_percentage: int
    disbursed_at: str
    underwriter_name: str


class PaymentMonitoringSummary(BaseModel):
    total_disbursed: int
    total_repaid: int
    outstanding: int
    next_payment_amount: int
    next_payment_date: str
    overdue_amount: int
    overdue_count: int
    active_loans_count: int
    is_demo: bool = True


class EvidenceLedgerEntry(BaseModel):
    evidence_id: str
    application_id: str
    file_name: str
    document_type: str
    timestamp: str
    sha256_hash: str
    previous_hash: Optional[str] = None
    integrity_status: str  # VERIFIED, WARNING, HASH_MISMATCH
    tamper_flag: bool = False
    verified_by: str = "System SHA-256 Engine"


class EvidenceVerificationResponse(BaseModel):
    application_id: str
    total_documents: int
    verified_count: int
    warning_count: int
    mismatch_count: int
    overall_integrity: str  # VERIFIED, WARNING, HASH_MISMATCH
    ledger_entries: List[EvidenceLedgerEntry]
    checked_at: str
    disclaimer: str = "Tamper-evident evidence ledger verified using SHA-256 cryptographic hashing."


class LenderApproveRequest(BaseModel):
    approved_amount: int = Field(..., gt=0)
    approved_duration_months: int = Field(..., gt=0)
    approved_interest_rate: float = Field(..., gt=0)
    approved_emi: int = Field(..., gt=0)
    processing_fee: Optional[int] = 0
    decision_notes: Optional[str] = None
    underwriter_name: Optional[str] = "Authorized Underwriter"


class LenderRejectRequest(BaseModel):
    reason: str = Field(..., min_length=3, description="Mandatory documented reason for rejection")
    internal_notes: Optional[str] = None


class LenderActionRequest(BaseModel):
    request_type: str = Field("DOCUMENT_CLARIFICATION", description="Missing document, poor document quality, identity mismatch, financial clarification, other")
    message: str = Field(..., min_length=3, description="Instruction message shown to borrower")
    internal_notes: Optional[str] = None


class LenderReviewRequest(BaseModel):
    status: str = Field("UNDER_REVIEW", description="UNDER_REVIEW or UNDER_VERIFICATION")
    internal_note: Optional[str] = None


