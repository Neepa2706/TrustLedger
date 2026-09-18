"""
TrustLedger Loan Service (Phase 2)
Provides loan product catalog, draft application management,
document attachment handling with optical quality heuristics,
EMI calculations, and user data isolation.
"""

import uuid
import re
import math
import hashlib
from datetime import datetime
from typing import Dict, Any, List, Optional, Tuple
from pathlib import Path

from app.models.loan_application import (
    LoanProduct,
    LoanApplicationCreate,
    LoanApplicationUpdate,
    LoanApplicationResponse,
    LoanFinancialDetails,
    LoanApplicationDocument,
    LoanApplicationValidationResult,
    DocumentComparisonResult,
    KYCVerificationResult,
    FinalVerificationStatusResponse,
    ApplicationSubmitRequest,
    ApplicationSubmitResponse,
    ApplicationAuditEvent,
    UnderwriterDecisionRequest,
    UnderwriterDecisionResponse,
    ApprovedTerms,
    ActionResponseSubmit,
    ActionRequestDetail,
    InvestigatorNoteCreate,
    InvestigatorNoteResponse,
    LenderApplicationListItem,
    LenderInvestigationDetailsResponse,
    BorrowerApplicationStatusResponse
)
from app.api.routes.user_profile import PROFILES_STORE, DOCUMENTS_STORE
from app.services.user_verifier import user_verifier
from app.services.document_comparison import document_comparison_service
from app.services.kyc_service import kyc_service

# In-memory storage for prototype loan applications and attachments
APPLICATIONS_STORE: Dict[str, Dict[str, Any]] = {}
APPLICATION_DOCS_STORE: Dict[str, List[Dict[str, Any]]] = {}
COMPARISONS_STORE: Dict[str, List[Dict[str, Any]]] = {}
KYC_STORE: Dict[str, Dict[str, Any]] = {}
AUDIT_EVENTS_STORE: Dict[str, List[Dict[str, Any]]] = {}

# Phase 4 In-memory storage for Underwriter Reviews, Action Requests, and Investigator Notes
LENDER_REVIEWS_STORE: Dict[str, Dict[str, Any]] = {}
ACTION_REQUESTS_STORE: Dict[str, Dict[str, Any]] = {}
INVESTIGATOR_NOTES_STORE: Dict[str, List[Dict[str, Any]]] = {}


# Centralized Synthetic Demo Loan Products Catalog
DEMO_LOAN_PRODUCTS: List[LoanProduct] = [
    LoanProduct(
        id="personal-loan",
        name="Personal Loan",
        category="Personal",
        description="Flexible financing for medical emergencies, home renovation, education, or personal expenses.",
        min_amount=25000,
        max_amount=500000,
        min_duration_months=6,
        max_duration_months=36,
        min_interest_rate=12.0,
        max_interest_rate=18.0,
        processing_fee_percentage=2.0,
        processing_fee_description="Up to 2% of sanctioned loan amount",
        purpose_options=[
            "Medical Expenses",
            "Home Improvement / Renovation",
            "Family Occasion / Wedding",
            "Higher Education",
            "Consolidate Existing Debts",
            "Other Personal Need"
        ],
        required_documents=[
            {"type": "Identity Proof", "required": True, "note": "Aadhaar Card (pre-verified from profile)"},
            {"type": "Address Proof", "required": True, "note": "Electricity Bill, Voter ID, or Rental Agreement"},
            {"type": "Income Proof", "required": True, "note": "Recent Salary Slip or Form 16"},
            {"type": "Bank Statement", "required": True, "note": "Last 3 months bank account statement (PDF)"}
        ],
        eligibility_criteria=[
            "Indian citizen aged between 21 and 58 years",
            "Minimum monthly net income of ₹25,000",
            "Active savings bank account with Net Banking / UPI",
            "Verified TrustLedger profile"
        ],
        demo_only=True,
        active=True
    ),
    LoanProduct(
        id="emergency-loan",
        name="Emergency Cash Loan",
        category="Emergency",
        description="Quick short-term liquidity for urgent unexpected expenses, immediate medical bills, or urgent travel.",
        min_amount=10000,
        max_amount=100000,
        min_duration_months=3,
        max_duration_months=18,
        min_interest_rate=14.0,
        max_interest_rate=20.0,
        processing_fee_percentage=2.0,
        processing_fee_description="Up to 2% processing fee",
        purpose_options=[
            "Urgent Medical Emergency",
            "Emergency Vehicle Repair",
            "Urgent Household Maintenance",
            "Travel for Family Emergency",
            "Short-term Cash Bridge"
        ],
        required_documents=[
            {"type": "Identity Proof", "required": True, "note": "Aadhaar Card (pre-verified from profile)"},
            {"type": "Address Proof", "required": True, "note": "Utility bill or Government issued address ID"},
            {"type": "Income Proof", "required": True, "note": "Latest 1 month salary slip or bank credit proof"}
        ],
        eligibility_criteria=[
            "Indian resident aged 20 years or above",
            "Regular source of monthly income (₹15,000+)",
            "Verified TrustLedger personal account"
        ],
        demo_only=True,
        active=True
    ),
    LoanProduct(
        id="business-support-loan",
        name="Business Support Loan",
        category="Business",
        description="Working capital, equipment purchase, and inventory restocking for small businesses and merchants.",
        min_amount=50000,
        max_amount=1000000,
        min_duration_months=12,
        max_duration_months=48,
        min_interest_rate=13.0,
        max_interest_rate=19.0,
        processing_fee_percentage=2.0,
        processing_fee_description="Up to 2% processing fee",
        purpose_options=[
            "Working Capital / Cash Flow",
            "Inventory Restocking",
            "Shop Renovation / Modernization",
            "Equipment / Machinery Purchase",
            "Business Marketing & Expansion"
        ],
        required_documents=[
            {"type": "Identity Proof", "required": True, "note": "Aadhaar Card (pre-verified from profile)"},
            {"type": "Business Proof", "required": True, "note": "Udyam Registration, GST Certificate, or Trade License"},
            {"type": "Bank Statement", "required": True, "note": "Last 6 months current or savings account statement"},
            {"type": "Income Proof", "required": True, "note": "ITR or Financial summary"}
        ],
        eligibility_criteria=[
            "Business operating for at least 1 year",
            "Valid business registration or MSME Udyam certificate",
            "Annual business turnover of ₹3,00,000+",
            "Verified TrustLedger profile"
        ],
        demo_only=True,
        active=True
    ),
    LoanProduct(
        id="two-wheeler-loan",
        name="Two-Wheeler Loan",
        category="Vehicle",
        description="Affordable financing for new petrol and electric two-wheelers with flexible tenure.",
        min_amount=30000,
        max_amount=200000,
        min_duration_months=12,
        max_duration_months=36,
        min_interest_rate=11.0,
        max_interest_rate=15.0,
        processing_fee_percentage=1.5,
        processing_fee_description="1.5% processing fee",
        purpose_options=[
            "New Motorcycle Purchase",
            "Electric Scooter (EV) Purchase",
            "Commuter Scooter Purchase"
        ],
        required_documents=[
            {"type": "Identity Proof", "required": True, "note": "Aadhaar Card (pre-verified)"},
            {"type": "Address Proof", "required": True, "note": "Current address proof"},
            {"type": "Income Proof", "required": True, "note": "Recent salary credit or ITR"}
        ],
        eligibility_criteria=[
            "Aged 21 to 65 years",
            "Salaried or self-employed with ₹18,000+ monthly income",
            "Valid driving license preferred"
        ],
        demo_only=True,
        active=True
    ),
    LoanProduct(
        id="education-skill-loan",
        name="Education & Skills Loan",
        category="Education",
        description="Advance your career with financing for professional diplomas, tech bootcamps, or certification courses.",
        min_amount=40000,
        max_amount=400000,
        min_duration_months=6,
        max_duration_months=36,
        min_interest_rate=10.0,
        max_interest_rate=14.0,
        processing_fee_percentage=1.0,
        processing_fee_description="1% processing fee",
        purpose_options=[
            "Software Development / Data Bootcamp",
            "Executive MBA / Certification",
            "Aviation / Technical Skill Training",
            "Professional License Exam Coaching"
        ],
        required_documents=[
            {"type": "Identity Proof", "required": True, "note": "Aadhaar Card (pre-verified)"},
            {"type": "Course Admission Proof", "required": True, "note": "Offer letter or course fee invoice"},
            {"type": "Income Proof", "required": True, "note": "Applicant or Co-applicant income proof"}
        ],
        eligibility_criteria=[
            "Confirmed admission in recognized educational institution or course",
            "Minimum 10+2 qualification",
            "Applicant or earning co-applicant required"
        ],
        demo_only=True,
        active=True
    )
]


def calculate_emi(principal: float, annual_rate_pct: float, tenure_months: int) -> Tuple[int, int, int]:
    """Calculates standard monthly EMI, total repayment, and total interest."""
    if principal <= 0 or tenure_months <= 0:
        return 0, 0, 0

    monthly_rate = (annual_rate_pct / 12.0) / 100.0
    if monthly_rate == 0:
        emi = principal / tenure_months
    else:
        # Standard formula: P * r * (1 + r)^n / ((1 + r)^n - 1)
        factor = math.pow(1.0 + monthly_rate, tenure_months)
        emi = (principal * monthly_rate * factor) / (factor - 1.0)

    emi_rounded = int(round(emi))
    total_repayment = emi_rounded * tenure_months
    total_interest = max(0, total_repayment - int(principal))
    return emi_rounded, total_repayment, total_interest


def mask_bank_account(account_number: Optional[str]) -> Optional[str]:
    """Masks bank account number: e.g. XXXX XXXX 4821."""
    if not account_number:
        return None
    clean = re.sub(r'\s+', '', str(account_number))
    if len(clean) >= 4:
        return f"XXXX XXXX {clean[-4:]}"
    return "XXXX XXXX ****"


class LoanService:
    """Manages borrower loan applications, product listings, and security boundaries."""

    def __init__(self):
        self._seed_demo_application()

    def _seed_demo_application(self):
        """Seeds synthetic baseline demo application TL-APP-10001 (Arjun Kumar)."""
        demo_app_id = "TL-APP-10001"
        demo_user_id = "usr_demo_arjun"
        
        # Profile
        if demo_user_id not in PROFILES_STORE:
            PROFILES_STORE[demo_user_id] = {
                "full_name": "Arjun Kumar",
                "date_of_birth": "1994-08-12",
                "gender": "Male",
                "mobile": "9812345678",
                "email": "arjun.kumar@example.in",
                "address": "Flat 402, Green Glen Layout, Bellandur",
                "city": "Bengaluru",
                "state": "Karnataka",
                "pincode": "560103",
                "occupation": "Software Engineer",
                "employment_type": "Full-time Salaried",
                "monthly_income": "95,000",
                "aadhaar_masked": "XXXX XXXX 4821",
                "pan_masked": "AB•••••4821",
                "is_verified": True,
                "verification_status": "VERIFIED"
            }

        # Application Record
        if demo_app_id not in APPLICATIONS_STORE:
            APPLICATIONS_STORE[demo_app_id] = {
                "application_id": demo_app_id,
                "user_id": demo_user_id,
                "loan_product_id": "personal-loan",
                "loan_product_name": "Personal Loan",
                "loan_category": "Personal",
                "requested_amount": 200000,
                "requested_duration_months": 24,
                "loan_purpose": "Home Renovation / Modernization",
                "estimated_emi": 9650,
                "total_repayment": 231600,
                "total_interest": 31600,
                "current_step": 6,
                "application_status": "UNDER_REVIEW",
                "validation_status": "VALID",
                "validation_errors": [],
                "verified_applicant": {
                    "full_name": "Arjun Kumar",
                    "date_of_birth": "1994-08-12",
                    "aadhaar_masked": "XXXX XXXX 4821",
                    "pan_masked": "AB•••••4821",
                    "mobile": "9812345678",
                    "email": "arjun.kumar@example.in",
                    "city": "Bengaluru"
                },
                "financial_details": {
                    "employer_or_business_name": "Cognitive Solutions India Ltd",
                    "work_experience_years": 4.5,
                    "monthly_income": "95,000",
                    "monthly_existing_obligations": "15,000",
                    "approximate_monthly_expenses": "35,000",
                    "payout_bank_name": "HDFC Bank",
                    "payout_account_number": "XXXX XXXX 4821",
                    "payout_account_masked": "XXXX XXXX 4821",
                    "payout_ifsc_code": "HDFC0001234"
                },
                "risk_score": 68,
                "risk_level": "MEDIUM",
                "document_status": "Review",
                "kyc_status": "Verified",
                "network_status": "Connected",
                "integrity_status": "Verified",
                "submitted_at": "2026-09-18T10:30:00Z",
                "created_at": "2026-09-18T10:15:00Z",
                "updated_at": "2026-09-18T10:30:00Z"
            }

            # Seed Documents
            APPLICATION_DOCS_STORE[demo_app_id] = [
                {
                    "document_id": "DOC-TL10001-01",
                    "application_id": demo_app_id,
                    "document_type": "Bank Statement",
                    "filename": "Bank_Statement_ArjunKumar_Apr2026.pdf",
                    "file_type": "PDF",
                    "file_size_bytes": 84200,
                    "storage_path": "uploads/borrower_data/usr_demo_arjun/apps/bank_stmt.pdf",
                    "quality_status": "GOOD",
                    "quality_message": "Document resolution and optical quality acceptable.",
                    "heuristic_type_match": "REVIEW",
                    "heuristic_message": "Potential document structure or formatting anomaly requires review.",
                    "is_pre_verified": False,
                    "uploaded_at": "2026-09-18T10:20:00Z",
                    "risk_score": 72,
                    "risk_level": "MEDIUM",
                    "findings": [
                        {
                            "id": "f-tl1",
                            "type": "formatting",
                            "severity": "medium",
                            "title": "Document formatting alignment anomaly",
                            "description": "Line-item spacing variance observed on account credits summary. Manual inspection recommended.",
                            "location": "Page 2: Credits"
                        }
                    ],
                    "sha256_hash": "e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855",
                    "integrity_status": "INTEGRITY VERIFIED"
                },
                {
                    "document_id": "DOC-TL10001-02",
                    "application_id": demo_app_id,
                    "document_type": "Identity Proof",
                    "filename": "Aadhaar_Card_ArjunKumar.pdf",
                    "file_type": "PDF",
                    "file_size_bytes": 45200,
                    "storage_path": "uploads/borrower_data/usr_demo_arjun/apps/aadhaar.pdf",
                    "quality_status": "GOOD",
                    "quality_message": "Document identity tokens match registered profile.",
                    "heuristic_type_match": "MATCH",
                    "heuristic_message": "Aadhaar checksum and name match registered profile.",
                    "is_pre_verified": True,
                    "uploaded_at": "2026-09-18T10:22:00Z",
                    "risk_score": 15,
                    "risk_level": "LOW",
                    "findings": [],
                    "sha256_hash": "8f432b11a910034a7812bcfe110294119934adfe890123bb45cd678901234567",
                    "integrity_status": "INTEGRITY VERIFIED"
                },
                {
                    "document_id": "DOC-TL10001-03",
                    "application_id": demo_app_id,
                    "document_type": "Income Proof",
                    "filename": "Salary_Slip_May2026.pdf",
                    "file_type": "PDF",
                    "file_size_bytes": 32100,
                    "storage_path": "uploads/borrower_data/usr_demo_arjun/apps/salary.pdf",
                    "quality_status": "GOOD",
                    "quality_message": "Employer details consistent with application.",
                    "heuristic_type_match": "MATCH",
                    "heuristic_message": "Income details verified.",
                    "is_pre_verified": False,
                    "uploaded_at": "2026-09-18T10:24:00Z",
                    "risk_score": 22,
                    "risk_level": "LOW",
                    "findings": [],
                    "sha256_hash": "9a8b7c6d5e4f3a2b1c0d9e8f7a6b5c4d3e2f1a0b9c8d7e6f5a4b3c2d1e0f9a8b",
                    "integrity_status": "INTEGRITY VERIFIED"
                }
            ]

            # Seed Audit Events
            AUDIT_EVENTS_STORE[demo_app_id] = [
                {
                    "event_id": "evt_tl001",
                    "application_id": demo_app_id,
                    "user_id": demo_user_id,
                    "event_type": "APPLICATION_CREATED",
                    "event_summary": "Application initialized for Personal Loan (₹2,00,000, 24 mos).",
                    "timestamp": "2026-09-18T10:15:00Z",
                    "event_hash": "68cdfaecc1e828114f820294ab82410a7249a8fe02948271049281a4e1029481"
                },
                {
                    "event_id": "evt_tl002",
                    "application_id": demo_app_id,
                    "user_id": demo_user_id,
                    "event_type": "DOCUMENT_UPLOADED",
                    "event_summary": "Uploaded Bank Statement ('Bank_Statement_ArjunKumar_Apr2026.pdf').",
                    "timestamp": "2026-09-18T10:20:00Z",
                    "event_hash": "72bd94294abfe019284102948102947182948291048291829471829482910482"
                },
                {
                    "event_id": "evt_tl003",
                    "application_id": demo_app_id,
                    "user_id": demo_user_id,
                    "event_type": "KYC_CHECKED",
                    "event_summary": "KYC check completed with status VERIFIED.",
                    "timestamp": "2026-09-18T10:25:00Z",
                    "event_hash": "83fe019284102948102947182948291048291829471829482910482910482910"
                },
                {
                    "event_id": "evt_tl004",
                    "application_id": demo_app_id,
                    "user_id": demo_user_id,
                    "event_type": "APPLICATION_SUBMITTED",
                    "event_summary": "Borrower confirmed declaration and submitted application TL-APP-10001.",
                    "timestamp": "2026-09-18T10:30:00Z",
                    "event_hash": "94ab029481029471829482910482918294718294829104829104829104829104"
                },
                {
                    "event_id": "evt_tl005",
                    "application_id": demo_app_id,
                    "user_id": demo_user_id,
                    "event_type": "UNDER_REVIEW_STARTED",
                    "event_summary": "Application entered underwriter inspection queue.",
                    "timestamp": "2026-09-18T10:31:00Z",
                    "event_hash": "a5bc130592130582930593021593029305930293015930293059302930159302"
                }
            ]

            # Seed Notes
            INVESTIGATOR_NOTES_STORE[demo_app_id] = [
                {
                    "note_id": "note_tl001",
                    "application_id": demo_app_id,
                    "author_id": "usr_demo_8824",
                    "author_name": "Alex Sterling (Underwriting Lead)",
                    "note_text": "Shared device signal detected with 2 other applications from coworking space subnet. Bank statement requires visual kerning review.",
                    "is_internal_only": True,
                    "created_at": "2026-09-18T10:35:00Z"
                }
            ]

    def get_products(self, category: Optional[str] = None) -> List[LoanProduct]:
        """Returns catalog of loan products, optionally filtered by category."""
        if not category or category.lower() == "all":
            return [p for p in DEMO_LOAN_PRODUCTS if p.active]
        cat_lower = category.lower()
        return [p for p in DEMO_LOAN_PRODUCTS if p.active and p.category.lower() == cat_lower]

    def get_product_by_id(self, product_id: str) -> Optional[LoanProduct]:
        """Lookup loan product by unique id."""
        for p in DEMO_LOAN_PRODUCTS:
            if p.id == product_id:
                return p
        return None

    def get_user_verified_profile(self, user_id: str) -> Dict[str, Any]:
        """Retrieves locked identity fields from Phase 1 profile."""
        profile = PROFILES_STORE.get(user_id, {})
        return {
            "full_name": profile.get("full_name", "Verified Applicant"),
            "date_of_birth": profile.get("date_of_birth", "1992-05-14"),
            "gender": profile.get("gender", "Male"),
            "mobile": profile.get("mobile", "9876543210"),
            "email": profile.get("email", "applicant@trustledger.in"),
            "address": profile.get("address", "Sector 14, Gurugram"),
            "city": profile.get("city", "Gurugram"),
            "state": profile.get("state", "Haryana"),
            "pincode": profile.get("pincode", "122001"),
            "occupation": profile.get("occupation", "Salaried Professional"),
            "employment_type": profile.get("employment_type", "Full-time Salaried"),
            "monthly_income": profile.get("monthly_income", "75,000"),
            "aadhaar_masked": profile.get("aadhaar_masked", "XXXX XXXX 4821"),
            "pan_masked": profile.get("pan_masked", "AB•••••4821"),
            "is_verified": profile.get("verification_status") == "VERIFIED",
            "verification_status": profile.get("verification_status", "VERIFIED")
        }

    def create_application(self, user_id: str, create_data: LoanApplicationCreate) -> LoanApplicationResponse:
        """Creates a new loan application draft for the authenticated borrower."""
        product = self.get_product_by_id(create_data.loan_product_id)
        if not product:
            raise ValueError(f"Loan product '{create_data.loan_product_id}' not found.")

        # Validate bounds
        if create_data.requested_amount < product.min_amount or create_data.requested_amount > product.max_amount:
            raise ValueError(f"Loan amount must be between ₹{product.min_amount:,} and ₹{product.max_amount:,}.")

        if create_data.requested_duration_months < product.min_duration_months or create_data.requested_duration_months > product.max_duration_months:
            raise ValueError(f"Loan duration must be between {product.min_duration_months} and {product.max_duration_months} months.")

        app_id = f"APP-{datetime.utcnow().year}-{uuid.uuid4().hex[:6].upper()}"
        now = datetime.utcnow().isoformat() + "Z"

        # Calculate initial EMI estimates (using average interest rate)
        avg_rate = (product.min_interest_rate + product.max_interest_rate) / 2.0
        emi, total_rep, total_int = calculate_emi(create_data.requested_amount, avg_rate, create_data.requested_duration_months)

        verified_applicant = self.get_user_verified_profile(user_id)

        # Financial details
        fin = create_data.financial_details or LoanFinancialDetails(
            employer_or_business_name=None,
            monthly_income=verified_applicant.get("monthly_income", "75,000"),
            monthly_existing_obligations="0",
            approximate_monthly_expenses="30,000",
            payout_bank_name="HDFC Bank",
            payout_account_number=None,
            payout_account_masked=None,
            payout_ifsc_code=None
        )

        app_record = {
            "application_id": app_id,
            "user_id": user_id,
            "loan_product_id": product.id,
            "loan_product_name": product.name,
            "loan_category": product.category,
            "requested_amount": create_data.requested_amount,
            "requested_duration_months": create_data.requested_duration_months,
            "loan_purpose": create_data.loan_purpose,
            "estimated_emi": emi,
            "total_repayment": total_rep,
            "total_interest": total_int,
            "current_step": 2,
            "application_status": "DRAFT",
            "validation_status": "INCOMPLETE",
            "validation_errors": [],
            "verified_applicant": verified_applicant,
            "financial_details": fin.model_dump(),
            "created_at": now,
            "updated_at": now
        }

        APPLICATIONS_STORE[app_id] = app_record

        # Automatically link pre-verified Aadhaar document from Phase 1 if exists
        user_docs = DOCUMENTS_STORE.get(user_id, [])
        app_docs = []
        if user_docs:
            latest_aadhaar = user_docs[-1]
            pre_verified_doc = {
                "document_id": f"doc_ref_{latest_aadhaar.get('document_id', 'aadhaar')}",
                "application_id": app_id,
                "document_type": "Identity Proof",
                "filename": latest_aadhaar.get("filename", "Verified_Aadhaar_Document.pdf"),
                "file_type": latest_aadhaar.get("file_type", "PDF"),
                "file_size_bytes": latest_aadhaar.get("file_size_bytes", 524288),
                "storage_path": f"uploads/borrower_data/{user_id}/verified_aadhaar",
                "quality_status": "GOOD",
                "quality_message": "Pre-verified during profile registration.",
                "heuristic_type_match": "MATCH",
                "heuristic_message": "Matches verified Aadhaar identity on profile.",
                "is_pre_verified": True,
                "uploaded_at": now
            }
            app_docs.append(pre_verified_doc)

        APPLICATION_DOCS_STORE[app_id] = app_docs

        self.record_audit_event(
            application_id=app_id,
            user_id=user_id,
            event_type="APPLICATION_CREATED",
            event_summary=f"Initialized draft application for {product.name} (₹{create_data.requested_amount:,})."
        )

        return self.format_application_response(app_record, app_docs)

    def get_applications(self, user_id: str) -> List[LoanApplicationResponse]:
        """Retrieves all loan applications belonging strictly to the authenticated borrower."""
        user_apps = [app for app in APPLICATIONS_STORE.values() if app.get("user_id") == user_id]
        results = []
        for app in user_apps:
            docs = APPLICATION_DOCS_STORE.get(app["application_id"], [])
            results.append(self.format_application_response(app, docs))
        return results

    def get_application_by_id(self, application_id: str, user_id: str) -> Optional[LoanApplicationResponse]:
        """
        Retrieves a single application, enforcing strict user ownership.
        Returns None if not found or unauthorized.
        """
        app = APPLICATIONS_STORE.get(application_id)
        if not app:
            return None
        # Strict isolation check: User A cannot see User B's application!
        if app.get("user_id") != user_id:
            return None

        docs = APPLICATION_DOCS_STORE.get(application_id, [])
        return self.format_application_response(app, docs)

    def update_application(
        self,
        application_id: str,
        user_id: str,
        update_data: LoanApplicationUpdate
    ) -> Optional[LoanApplicationResponse]:
        """Updates draft fields while verifying authenticated ownership."""
        app = APPLICATIONS_STORE.get(application_id)
        if not app or app.get("user_id") != user_id:
            return None

        product = self.get_product_by_id(app["loan_product_id"])
        now = datetime.utcnow().isoformat() + "Z"

        # Apply updates
        if update_data.requested_amount is not None:
            app["requested_amount"] = update_data.requested_amount
        if update_data.requested_duration_months is not None:
            app["requested_duration_months"] = update_data.requested_duration_months
        if update_data.loan_purpose is not None:
            app["loan_purpose"] = update_data.loan_purpose
        if update_data.current_step is not None:
            app["current_step"] = update_data.current_step
        if update_data.application_status is not None:
            app["application_status"] = update_data.application_status

        # Recalculate EMI if amount or duration changed
        if product:
            avg_rate = (product.min_interest_rate + product.max_interest_rate) / 2.0
            emi, total_rep, total_int = calculate_emi(app["requested_amount"], avg_rate, app["requested_duration_months"])
            app["estimated_emi"] = emi
            app["total_repayment"] = total_rep
            app["total_interest"] = total_int

        if update_data.financial_details:
            fin_dict = update_data.financial_details.model_dump(exclude_unset=True)
            # Mask bank account number if supplied
            if "payout_account_number" in fin_dict and fin_dict["payout_account_number"]:
                raw_acc = fin_dict["payout_account_number"]
                fin_dict["payout_account_masked"] = mask_bank_account(raw_acc)
                # Never store full raw account in logs
            app["financial_details"].update(fin_dict)

        app["updated_at"] = now
        docs = APPLICATION_DOCS_STORE.get(application_id, [])
        return self.format_application_response(app, docs)

    def evaluate_document_type_heuristic(self, document_type: str, filename: str, content_preview: str) -> Tuple[str, str]:
        """
        Prototype heuristic check verifying if uploaded file corresponds
        reasonably to the designated document category.
        """
        text_lower = (filename + " " + content_preview).lower()
        doc_type_lower = document_type.lower()

        if "statement" in doc_type_lower:
            indicators = ["statement", "bank", "account", "balance", "credit", "debit", "ifsc", "transaction", "closing"]
            matches = sum(1 for ind in indicators if ind in text_lower)
            if matches >= 2:
                return "MATCH", "Document appears consistent with a Bank Statement."
            elif matches == 1:
                return "REVIEW", "Contains partial bank statement signals. Underwriter review recommended."
            return "REVIEW", "Prototype note: File lacks standard bank statement header tokens."

        elif "income" in doc_type_lower or "salary" in doc_type_lower:
            indicators = ["salary", "payslip", "pay slip", "earnings", "deductions", "net pay", "gross", "employer"]
            matches = sum(1 for ind in indicators if ind in text_lower)
            if matches >= 1:
                return "MATCH", "Document appears consistent with Salary / Income proof."
            return "REVIEW", "Prototype note: File requires underwriter confirmation of salary details."

        elif "business" in doc_type_lower:
            indicators = ["gst", "udyam", "msme", "registration", "tax", "license", "proprietorship", "company", "firm"]
            matches = sum(1 for ind in indicators if ind in text_lower)
            if matches >= 1:
                return "MATCH", "Document matches Business proof / registration format."
            return "REVIEW", "Prototype note: File requires MSME registry verification."

        return "MATCH", "Document format acceptable for designated type."

    def add_document(
        self,
        application_id: str,
        user_id: str,
        document_type: str,
        filename: str,
        content: bytes
    ) -> LoanApplicationDocument:
        """Saves and inspects an application document."""
        app = APPLICATIONS_STORE.get(application_id)
        if not app or app.get("user_id") != user_id:
            raise PermissionError("Application not found or unauthorized access.")

        # Optical quality inspection
        quality = user_verifier.evaluate_document_quality(content, filename)
        quality_status = "GOOD" if quality["is_valid"] and quality["readable"] else ("WARNING" if quality["is_valid"] else "ERROR")
        quality_message = "Document quality looks acceptable." if quality_status == "GOOD" else (
            quality["warnings"][0] if quality["warnings"] else "Document may be difficult to read. Please upload a clearer copy."
        )

        # Type heuristic inspection
        type_match, type_msg = self.evaluate_document_type_heuristic(
            document_type,
            filename,
            quality.get("extracted_text", "")
        )

        doc_id = f"doc_{uuid.uuid4().hex[:8]}"
        now = datetime.utcnow().isoformat() + "Z"
        ext = Path(filename).suffix.replace(".", "").upper() or "FILE"

        doc_record = {
            "document_id": doc_id,
            "application_id": application_id,
            "document_type": document_type,
            "filename": filename,
            "file_type": ext,
            "file_size_bytes": len(content),
            "storage_path": f"uploads/borrower_data/{user_id}/apps/{doc_id}_{filename}",
            "quality_status": quality_status,
            "quality_message": quality_message,
            "heuristic_type_match": type_match,
            "heuristic_message": type_msg,
            "is_pre_verified": False,
            "uploaded_at": now
        }

        if application_id not in APPLICATION_DOCS_STORE:
            APPLICATION_DOCS_STORE[application_id] = []

        # Replace existing document of same type if present
        APPLICATION_DOCS_STORE[application_id] = [
            d for d in APPLICATION_DOCS_STORE[application_id]
            if d.get("document_type") != document_type
        ]
        APPLICATION_DOCS_STORE[application_id].append(doc_record)

        self.record_audit_event(
            application_id=application_id,
            user_id=user_id,
            event_type="DOCUMENT_UPLOADED",
            event_summary=f"Uploaded {document_type} ('{filename}')."
        )
        self.record_audit_event(
            application_id=application_id,
            user_id=user_id,
            event_type="DOCUMENT_QUALITY_CHECKED",
            event_summary=f"Document quality evaluation: {quality_status} ({quality_message})."
        )

        return LoanApplicationDocument(**doc_record)

    def validate_application(self, application_id: str, user_id: str) -> LoanApplicationValidationResult:
        """Validates all application requirements before permitting review/submission."""
        app = APPLICATIONS_STORE.get(application_id)
        if not app or app.get("user_id") != user_id:
            raise PermissionError("Application not found or unauthorized access.")

        product = self.get_product_by_id(app["loan_product_id"])
        docs = APPLICATION_DOCS_STORE.get(application_id, [])
        uploaded_types = {d["document_type"] for d in docs}

        blocking_errors = []
        advisories = []

        # 1. Product range check
        if product:
            if app["requested_amount"] < product.min_amount or app["requested_amount"] > product.max_amount:
                blocking_errors.append(f"Requested amount ₹{app['requested_amount']:,} is outside the allowed product range (₹{product.min_amount:,} - ₹{product.max_amount:,}).")
            if app["requested_duration_months"] < product.min_duration_months or app["requested_duration_months"] > product.max_duration_months:
                blocking_errors.append(f"Requested duration {app['requested_duration_months']} months is outside the allowed range ({product.min_duration_months} - {product.max_duration_months} months).")

        # 2. Loan purpose check
        if not app.get("loan_purpose") or len(app["loan_purpose"].strip()) < 2:
            blocking_errors.append("Please specify the purpose of your loan.")

        # 3. Financial details check
        fin = app.get("financial_details", {})
        if not fin.get("monthly_income"):
            blocking_errors.append("Please provide your monthly income.")
        if not fin.get("payout_bank_name") or not (fin.get("payout_account_number") or fin.get("payout_account_masked")):
            blocking_errors.append("Please enter your bank account details for loan disbursement.")

        # 4. Required documents check
        if product:
            for req in product.required_documents:
                if req.get("required") and req["type"] not in uploaded_types:
                    blocking_errors.append(f"Missing required document: '{req['type']}'. Please upload before submission.")

        # 5. Document quality check
        for d in docs:
            if d.get("quality_status") == "ERROR":
                blocking_errors.append(f"Document '{d['filename']}' has quality errors: {d['quality_message']}. Please upload a clearer copy.")
            elif d.get("quality_status") == "WARNING":
                advisories.append(f"Document '{d['filename']}' advisory: {d['quality_message']}")

        is_valid = len(blocking_errors) == 0
        can_submit = is_valid

        status = "READY_FOR_REVIEW" if is_valid else "INCOMPLETE"
        app["validation_status"] = "VALID" if is_valid else "INCOMPLETE"
        app["validation_errors"] = blocking_errors

        summary = {
            "application_id": application_id,
            "product_name": product.name if product else "Loan",
            "requested_amount": app["requested_amount"],
            "requested_duration": app["requested_duration_months"],
            "estimated_emi": app["estimated_emi"],
            "documents_count": len(docs),
            "errors_count": len(blocking_errors),
            "advisories_count": len(advisories)
        }

        return LoanApplicationValidationResult(
            application_id=application_id,
            is_valid=is_valid,
            can_submit=can_submit,
            status=status,
            blocking_errors=blocking_errors,
            advisories=advisories,
            summary=summary
        )

    def format_application_response(self, app_record: Dict[str, Any], docs: List[Dict[str, Any]]) -> LoanApplicationResponse:
        """Helper to construct pydantic response model."""
        return LoanApplicationResponse(
            application_id=app_record["application_id"],
            user_id=app_record["user_id"],
            loan_product_id=app_record["loan_product_id"],
            loan_product_name=app_record["loan_product_name"],
            loan_category=app_record["loan_category"],
            requested_amount=app_record["requested_amount"],
            requested_duration_months=app_record["requested_duration_months"],
            loan_purpose=app_record["loan_purpose"],
            estimated_emi=app_record["estimated_emi"],
            total_repayment=app_record["total_repayment"],
            total_interest=app_record["total_interest"],
            current_step=app_record.get("current_step", 1),
            application_status=app_record.get("application_status", "DRAFT"),
            validation_status=app_record.get("validation_status", "INCOMPLETE"),
            validation_errors=app_record.get("validation_errors", []),
            verified_applicant=app_record["verified_applicant"],
            financial_details=LoanFinancialDetails(**app_record["financial_details"]),
            documents=[LoanApplicationDocument(**d) for d in docs],
            is_demo=True,
            created_at=app_record["created_at"],
            updated_at=app_record["updated_at"]
        )

    # -------------------------------------------------------------------------
    # PHASE 3 METHODS: AUDIT TRAIL, CROSS-COMPARISON, KYC & SUBMISSION
    # -------------------------------------------------------------------------

    def record_audit_event(
        self,
        application_id: str,
        user_id: str,
        event_type: str,
        event_summary: str,
        metadata: Optional[Dict[str, Any]] = None
    ) -> ApplicationAuditEvent:
        """Appends a SHA-256 tamper-evident audit record for application lifecycle events."""
        event_id = f"evt_{uuid.uuid4().hex[:10]}"
        now = datetime.utcnow().isoformat() + "Z"
        
        events = AUDIT_EVENTS_STORE.setdefault(application_id, [])
        prev_hash = events[-1]["event_hash"] if events else "0" * 64
        
        # Calculate chained event hash
        payload = f"{prev_hash}:{event_id}:{application_id}:{user_id}:{event_type}:{now}"
        event_hash = hashlib.sha256(payload.encode("utf-8")).hexdigest()
        
        event_record = {
            "event_id": event_id,
            "application_id": application_id,
            "user_id": user_id,
            "event_type": event_type,
            "event_summary": event_summary,
            "metadata": metadata or {},
            "previous_event_hash": prev_hash,
            "event_hash": event_hash,
            "timestamp": now
        }
        events.append(event_record)
        return ApplicationAuditEvent(
            event_id=event_id,
            application_id=application_id,
            event_type=event_type,
            event_summary=event_summary,
            timestamp=now,
            event_hash=event_hash
        )

    def compare_application_documents(
        self,
        application_id: str,
        user_id: str
    ) -> List[DocumentComparisonResult]:
        """Runs cross-comparison on all uploaded application documents against profile."""
        app = APPLICATIONS_STORE.get(application_id)
        if not app or app.get("user_id") != user_id:
            raise PermissionError("Application not found or unauthorized access.")

        docs = APPLICATION_DOCS_STORE.get(application_id, [])
        profile = self.get_user_verified_profile(user_id)

        results: List[DocumentComparisonResult] = []
        for d in docs:
            res = document_comparison_service.compare_document(
                application_id=application_id,
                document_id=d.get("document_id", "doc_unknown"),
                document_type=d.get("document_type", "Document"),
                filename=d.get("filename", "file.pdf"),
                extracted_text=d.get("quality_message", ""),
                registered_profile=profile,
                is_demo=True
            )
            results.append(res)

        COMPARISONS_STORE[application_id] = [r.model_dump() for r in results]
        
        self.record_audit_event(
            application_id=application_id,
            user_id=user_id,
            event_type="DOCUMENT_COMPARISON_PERFORMED",
            event_summary=f"Evaluated {len(results)} application documents against registered profile identity."
        )
        return results

    def run_application_kyc(
        self,
        application_id: str,
        user_id: str
    ) -> KYCVerificationResult:
        """Executes full KYC verification for application (Profile, Photo, Docs, Cross-check)."""
        app = APPLICATIONS_STORE.get(application_id)
        if not app or app.get("user_id") != user_id:
            raise PermissionError("Application not found or unauthorized access.")

        product = self.get_product_by_id(app["loan_product_id"])
        required_docs = product.required_documents if product else []
        app_docs = APPLICATION_DOCS_STORE.get(application_id, [])

        # Run document comparison first if not already run
        comparisons = self.compare_application_documents(application_id, user_id)

        kyc_result = kyc_service.verify_application_kyc(
            application_id=application_id,
            user_id=user_id,
            loan_product_required_docs=required_docs,
            application_docs=app_docs,
            document_comparisons=comparisons
        )

        KYC_STORE[application_id] = kyc_result.model_dump()
        
        self.record_audit_event(
            application_id=application_id,
            user_id=user_id,
            event_type="KYC_CHECKED",
            event_summary=f"KYC checks completed with status {kyc_result.overall_status}."
        )
        return kyc_result

    def get_final_verification_status(
        self,
        application_id: str,
        user_id: str
    ) -> FinalVerificationStatusResponse:
        """Consolidates application checklist, KYC results, and document cross-matches."""
        app = APPLICATIONS_STORE.get(application_id)
        if not app or app.get("user_id") != user_id:
            raise PermissionError("Application not found or unauthorized access.")

        profile = self.get_user_verified_profile(user_id)
        profile_verified = profile.get("verification_status") == "VERIFIED" or bool(profile.get("full_name"))

        # Fetch or compute KYC and comparisons
        kyc_dict = KYC_STORE.get(application_id)
        if not kyc_dict:
            kyc_res = self.run_application_kyc(application_id, user_id)
        else:
            kyc_res = KYCVerificationResult(**kyc_dict)

        comp_dicts = COMPARISONS_STORE.get(application_id, [])
        if not comp_dicts:
            comparisons = self.compare_application_documents(application_id, user_id)
        else:
            comparisons = [DocumentComparisonResult(**c) for c in comp_dicts]

        blocking_reasons = list(kyc_res.blocking_reasons)
        advisories = list(kyc_res.advisories)

        # Additional gate checks
        val_res = self.validate_application(application_id, user_id)
        for err in val_res.blocking_errors:
            if err not in blocking_reasons:
                blocking_reasons.append(err)

        can_submit = len(blocking_reasons) == 0 and profile_verified
        overall_status = "READY_FOR_SUBMISSION" if can_submit else ("REVIEW_REQUIRED" if not blocking_reasons else "BLOCKED")

        if can_submit:
            message = "Your application and documents have passed verification checks. You can now confirm the declaration and submit."
        else:
            message = "Your application cannot be submitted yet. Please address the marked items below."

        return FinalVerificationStatusResponse(
            application_id=application_id,
            user_id=user_id,
            overall_status=overall_status,
            can_submit=can_submit,
            profile_verified=profile_verified,
            kyc_result=kyc_res,
            document_comparisons=comparisons,
            blocking_reasons=blocking_reasons,
            advisories=advisories,
            declaration_required=True,
            message=message
        )

    def submit_application(
        self,
        application_id: str,
        user_id: str,
        submit_req: ApplicationSubmitRequest
    ) -> ApplicationSubmitResponse:
        """
        Executes final application submission after thorough server-side re-validation.
        Enforces tenant isolation, declaration consent, KYC validity, and status transition.
        """
        app = APPLICATIONS_STORE.get(application_id)
        if not app or app.get("user_id") != user_id:
            raise PermissionError("Application not found or unauthorized access.")

        if app.get("application_status") == "SUBMITTED":
            raise ValueError("This application has already been submitted.")

        # 1. Validate declaration consent
        if not submit_req.borrower_declaration_confirmed:
            raise ValueError("You must agree to the borrower declaration before submitting your application.")

        # 2. Run final comprehensive verification checks
        verif = self.get_final_verification_status(application_id, user_id)
        if not verif.can_submit or len(verif.blocking_reasons) > 0:
            first_err = verif.blocking_reasons[0] if verif.blocking_reasons else "Application has incomplete requirements."
            raise ValueError(f"Submission blocked: {first_err}")

        now = datetime.utcnow().isoformat() + "Z"

        # 3. Transition status
        app["application_status"] = "SUBMITTED"
        app["current_step"] = 6
        app["validation_status"] = "VALID"
        app["submitted_at"] = now
        app["updated_at"] = now
        app["kyc_status"] = verif.kyc_result.overall_status
        app["document_comparison_status"] = "MATCH" if all(c.status == "MATCH" for c in verif.document_comparisons) else "REVIEW"

        # 4. Record Audit Event
        self.record_audit_event(
            application_id=application_id,
            user_id=user_id,
            event_type="APPLICATION_SUBMITTED",
            event_summary=f"Borrower confirmed declaration and submitted application {application_id} for ₹{app['requested_amount']:,}."
        )

        return ApplicationSubmitResponse(
            application_id=application_id,
            user_id=user_id,
            loan_product_name=app.get("loan_product_name", "Loan"),
            requested_amount=app.get("requested_amount", 0),
            requested_duration_months=app.get("requested_duration_months", 0),
            application_status="SUBMITTED",
            current_step="SUBMITTED",
            submitted_at=now,
            kyc_status=app["kyc_status"],
            document_comparison_status=app["document_comparison_status"],
            next_step="Lender verification",
            message="Your application has been submitted successfully. The lender will now verify the information and documents.",
            is_demo=True
        )

    def get_audit_trail(self, application_id: str, user_id: str) -> List[ApplicationAuditEvent]:
        """Retrieves tamper-evident event log for an application with user validation."""
        app = APPLICATIONS_STORE.get(application_id)
        if not app or app.get("user_id") != user_id:
            raise PermissionError("Application not found or unauthorized access.")
        
    def get_audit_trail(self, application_id: str, user_id: str) -> List[ApplicationAuditEvent]:
        """Retrieves tamper-evident event log for an application with user validation."""
        app = APPLICATIONS_STORE.get(application_id)
        if not app or app.get("user_id") != user_id:
            raise PermissionError("Application not found or unauthorized access.")
        
        events = AUDIT_EVENTS_STORE.get(application_id, [])
        return [
            ApplicationAuditEvent(
                event_id=e["event_id"],
                application_id=e["application_id"],
                event_type=e["event_type"],
                event_summary=e["event_summary"],
                timestamp=e["timestamp"],
                event_hash=e["event_hash"]
            )
            for e in events
        ]

    # -------------------------------------------------------------------------
    # PHASE 4 METHODS: LENDER QUEUE, INVESTIGATION DOSSIER & UNDERWRITING
    # -------------------------------------------------------------------------

    def get_lender_applications(
        self,
        status_filter: Optional[str] = None,
        search: Optional[str] = None
    ) -> List[LenderApplicationListItem]:
        """Retrieves all loan applications submitted to the lender triage queue."""
        results: List[LenderApplicationListItem] = []

        for app_id, app in APPLICATIONS_STORE.items():
            # If still in draft and not TL-APP-10001, skip from lender queue
            app_status = app.get("application_status", "DRAFT")
            if app_status == "DRAFT" and app_id != "TL-APP-10001":
                continue

            # Filtering
            if status_filter and status_filter.lower() != "all":
                if app_status.lower() != status_filter.lower():
                    continue

            applicant_name = app.get("verified_applicant", {}).get("full_name") or app.get("user_id", "Applicant")
            if search and search.strip():
                q = search.lower()
                if q not in app_id.lower() and q not in applicant_name.lower():
                    continue

            # Compute or format display metrics
            req_amt = app.get("requested_amount", 0)
            submitted_ts = app.get("submitted_at") or app.get("created_at") or datetime.utcnow().isoformat() + "Z"
            
            # Format relative time or date
            submitted_str = submitted_ts[:10]

            doc_status = app.get("document_status") or ("Review" if app.get("document_comparison_status") == "REVIEW" else "Verified")
            kyc_status = "Verified" if str(app.get("kyc_status", "")).upper() in ["READY_FOR_SUBMISSION", "VERIFIED"] else "Review"
            net_status = app.get("network_status", "Clear")
            int_status = app.get("integrity_status", "Verified")
            risk_score = app.get("risk_score", 68 if app_status in ["UNDER_REVIEW", "SUBMITTED"] else 25)
            risk_level = app.get("risk_level", "MEDIUM" if risk_score > 35 and risk_score <= 65 else ("HIGH" if risk_score > 65 else "LOW"))

            # Status label
            ui_status = app_status.replace("_", " ").title()

            item = LenderApplicationListItem(
                id=app_id,
                applicant=applicant_name,
                loanProduct=app.get("loan_product_name", "Personal Loan"),
                loanAmount=f"₹{req_amt:,}",
                requestedAmountNum=req_amt,
                submittedAt=submitted_str,
                documentStatus=doc_status,
                kycStatus=kyc_status,
                networkStatus=net_status,
                integrityStatus=int_status,
                riskScore=risk_score,
                riskLevel=risk_level,
                applicationStatus=app_status,
                status=ui_status,
                loanType=f"{app.get('loan_category', 'Digital')} Loan",
                user_id=app.get("user_id")
            )
            results.append(item)

        # Sort with newest / under review first
        results.sort(key=lambda x: (0 if x.applicationStatus in ["SUBMITTED", "UNDER_REVIEW"] else 1, x.id), reverse=False)
        return results

    def get_lender_application_investigation(self, application_id: str) -> LenderInvestigationDetailsResponse:
        """Constructs comprehensive 5-pillar investigation dossier for the underwriter."""
        app = APPLICATIONS_STORE.get(application_id)
        if not app:
            raise KeyError(f"Application {application_id} not found.")

        # If currently SUBMITTED, transition to UNDER_REVIEW upon lender opening
        if app.get("application_status") == "SUBMITTED":
            app["application_status"] = "UNDER_REVIEW"
            app["updated_at"] = datetime.utcnow().isoformat() + "Z"
            self.record_audit_event(
                application_id=application_id,
                user_id="lender_system",
                event_type="UNDER_REVIEW_STARTED",
                event_summary=f"Lender underwriter opened application {application_id} for investigation."
            )

        applicant_name = app.get("verified_applicant", {}).get("full_name") or "Applicant"
        req_amt = app.get("requested_amount", 0)
        duration = app.get("requested_duration_months", 12)
        submitted_ts = app.get("submitted_at") or app.get("created_at") or datetime.utcnow().isoformat() + "Z"

        docs = APPLICATION_DOCS_STORE.get(application_id, [])

        # Construct Evidence list
        evidence_items = []
        for i, d in enumerate(docs):
            evidence_items.append({
                "id": d.get("document_id", f"ev{i+1}"),
                "type": d.get("document_type", "DOCUMENT").upper(),
                "status": "Review" if d.get("heuristic_type_match") == "REVIEW" or d.get("quality_status") == "WARNING" else "Verified",
                "risk": "Medium" if d.get("heuristic_type_match") == "REVIEW" else "Low",
                "state": d.get("quality_message", "Forensic Pass"),
                "hash": d.get("sha256_hash", hashlib.sha256(f"{application_id}:{d.get('filename')}".encode()).hexdigest())[:10] + "...",
                "full_hash": d.get("sha256_hash", hashlib.sha256(f"{application_id}:{d.get('filename')}".encode()).hexdigest()),
                "filename": d.get("filename"),
                "findings": d.get("findings", []),
                "integrity_status": d.get("integrity_status", "INTEGRITY VERIFIED")
            })

        # Digital Signals
        digital_signals = [
            {"type": "DEVICE", "value": "Device-7F2A", "detail": "Connected digital signal (seen on 2 other applications)"},
            {"type": "IP ADDRESS", "value": "192.0.2.24", "detail": "Shared signal requires investigation (broadband subnet)"},
            {"type": "BANK ACCOUNT", "value": "•••• 4821", "detail": "Multiple related signals detected"},
            {"type": "EMAIL DOMAIN", "value": app.get("verified_applicant", {}).get("email", "corp.in").split("@")[-1], "detail": "Verified email domain"}
        ]

        # 5-Pillar Risk Breakdown
        risk_score = app.get("risk_score", 68)
        risk_level = app.get("risk_level", "MEDIUM")
        doc_risk = 72 if any(e["status"] == "Review" for e in evidence_items) else 15
        kyc_risk = 24 if str(app.get("kyc_status", "")).upper() in ["VERIFIED", "READY_FOR_SUBMISSION"] else 60
        net_risk = 68
        int_score = 99

        risk_breakdown = {
            "documentForensics": {
                "score": doc_risk,
                "status": "Review" if doc_risk > 50 else "Verified",
                "explanation": "Potential document structure or formatting anomaly requires review." if doc_risk > 50 else "Document structure and fonts match baseline standards."
            },
            "kycAnalysis": {
                "score": kyc_risk,
                "status": "Verified" if kyc_risk < 50 else "Review",
                "explanation": "Biometric photo and identity documents match registered profile attributes."
            },
            "fraudNetwork": {
                "score": net_risk,
                "status": "Connected",
                "explanation": "Connected digital signals detected across device and IP telemetry."
            },
            "evidenceIntegrity": {
                "score": int_score,
                "status": "Verified",
                "explanation": "Evidence hash verified and aligned with cryptographic audit proof."
            }
        }

        reasons = [
            {
                "id": "r1",
                "title": "Document formatting requires underwriter review",
                "severity": "medium",
                "explanation": "Bank statement layout shows minor alignment variance requiring visual signoff.",
                "linkTo": "/documents"
            },
            {
                "id": "r2",
                "title": "Connected device and IP telemetry signal detected",
                "severity": "medium",
                "explanation": "Device-7F2A observed across multiple distinct inquiries. Investigation recommended.",
                "linkTo": "/fraud-network"
            },
            {
                "id": "r3",
                "title": "Aadhaar and profile identity verified",
                "severity": "low",
                "explanation": "Registered profile matches uploaded identification proof without discrepancies.",
                "linkTo": "/kyc-analysis"
            },
            {
                "id": "r4",
                "title": "Evidence integrity verified",
                "severity": "low",
                "explanation": "Stored file SHA-256 matches recorded verification digest.",
                "linkTo": "/evidence-ledger"
            }
        ]

        # Timeline
        audit_events = AUDIT_EVENTS_STORE.get(application_id, [])
        timeline = [
            {
                "time": e["timestamp"][11:16] if len(e.get("timestamp", "")) > 16 else "12:00",
                "event": e["event_summary"],
                "type": "risk" if "RISK" in e["event_type"] else "doc"
            }
            for e in audit_events
        ]

        # Notes
        notes_records = INVESTIGATOR_NOTES_STORE.get(application_id, [])
        notes = [InvestigatorNoteResponse(**n) for n in notes_records]

        # Decisions & Requests
        review_record = LENDER_REVIEWS_STORE.get(application_id, {})
        approved_terms = None
        if app.get("application_status") == "APPROVED" and "approved_amount" in review_record:
            approved_terms = ApprovedTerms(
                approved_amount=int(review_record.get("approved_amount", req_amt)),
                approved_duration_months=int(review_record.get("approved_duration_months", duration)),
                approved_interest_rate=float(review_record.get("approved_interest_rate", 13.5)),
                approved_emi=int(review_record.get("approved_emi", app.get("estimated_emi", 9500))),
                approval_date=review_record.get("updated_at", submitted_ts)[:10],
                decision_by=review_record.get("reviewer_name", "Authorized Underwriter")
            )

        action_req = None
        if application_id in ACTION_REQUESTS_STORE:
            action_req = ActionRequestDetail(**ACTION_REQUESTS_STORE[application_id])

        return LenderInvestigationDetailsResponse(
            id=application_id,
            applicant=applicant_name,
            loanProduct=app.get("loan_product_name", "Personal Loan"),
            loanAmount=f"₹{req_amt:,}",
            requestedAmountNum=req_amt,
            durationMonths=duration,
            submittedAt=submitted_ts[:10],
            timestamp=submitted_ts,
            applicationStatus=app.get("application_status", "UNDER_REVIEW"),
            analysisStatus="AI Analysis Complete",
            loanType=f"{app.get('loan_category', 'Personal')} Credit",
            riskScore=risk_score,
            riskLevel=risk_level,
            documentStatus="Review" if doc_risk > 50 else "Verified",
            kycStatus="Verified",
            networkStatus="Connected",
            integrityStatus="Verified",
            riskBreakdown=risk_breakdown,
            reasons=reasons,
            timeline=timeline,
            evidence=evidence_items,
            digitalSignals=digital_signals,
            approvedTerms=approved_terms,
            actionRequest=action_req,
            rejectionReason=review_record.get("decision_reason"),
            internalNotes=notes,
            isDemo=True
        )

    def record_underwriter_decision(
        self,
        application_id: str,
        reviewer_id: str,
        reviewer_name: str,
        decision_req: UnderwriterDecisionRequest
    ) -> UnderwriterDecisionResponse:
        """Executes explicit underwriter decision: APPROVE, REQUEST_ACTION, or REJECT."""
        app = APPLICATIONS_STORE.get(application_id)
        if not app:
            raise KeyError(f"Application {application_id} not found.")

        now = datetime.utcnow().isoformat() + "Z"
        decision_type = decision_req.decision.upper()

        if decision_type not in ["APPROVED", "REJECTED", "REQUEST_ACTION"]:
            raise ValueError(f"Invalid decision type '{decision_type}'. Must be APPROVED, REJECTED, or REQUEST_ACTION.")

        # Save internal note if provided
        if decision_req.internal_note and decision_req.internal_note.strip():
            self.add_investigator_note(
                application_id=application_id,
                author_id=reviewer_id,
                author_name=reviewer_name,
                note_text=decision_req.internal_note.strip()
            )

        review_id = f"rev_{uuid.uuid4().hex[:8]}"

        if decision_type == "APPROVED":
            app["application_status"] = "APPROVED"
            app["updated_at"] = now
            
            approved_amount = decision_req.approved_amount or app["requested_amount"]
            approved_duration = decision_req.approved_duration_months or app["requested_duration_months"]
            approved_rate = decision_req.approved_interest_rate or 13.5
            
            # Recalculate monthly EMI based on approved terms
            r = (approved_rate / 12) / 100
            n = approved_duration
            emi = round((approved_amount * r * ((1 + r) ** n)) / (((1 + r) ** n) - 1)) if n > 0 and r > 0 else round(approved_amount / n)
            approved_emi = decision_req.approved_emi or emi

            terms = ApprovedTerms(
                approved_amount=approved_amount,
                approved_duration_months=approved_duration,
                approved_interest_rate=approved_rate,
                approved_emi=approved_emi,
                approval_date=now[:10],
                decision_by=reviewer_name
            )

            LENDER_REVIEWS_STORE[application_id] = {
                "review_id": review_id,
                "application_id": application_id,
                "reviewer_id": reviewer_id,
                "reviewer_name": reviewer_name,
                "review_status": "APPROVED",
                "decision": "APPROVED",
                "decision_reason": decision_req.decision_reason or "All verification checks passed credit underwriting criteria.",
                "approved_amount": approved_amount,
                "approved_duration_months": approved_duration,
                "approved_interest_rate": approved_rate,
                "approved_emi": approved_emi,
                "internal_note": decision_req.internal_note,
                "created_at": now,
                "updated_at": now
            }

            self.record_audit_event(
                application_id=application_id,
                user_id=reviewer_id,
                event_type="APPLICATION_APPROVED",
                event_summary=f"Application approved by {reviewer_name}. Sanctioned: ₹{approved_amount:,} @ {approved_rate}% for {approved_duration} mos."
            )

            return UnderwriterDecisionResponse(
                application_id=application_id,
                decision="APPROVED",
                application_status="APPROVED",
                reviewer_id=reviewer_id,
                reviewer_name=reviewer_name,
                approved_terms=terms,
                message=f"Application {application_id} has been formally approved.",
                decided_at=now
            )

        elif decision_type == "REQUEST_ACTION":
            app["application_status"] = "ACTION_REQUIRED"
            app["updated_at"] = now

            req_msg = decision_req.action_message or "Please provide the requested supporting documentation to continue review."
            req_id = f"act_{uuid.uuid4().hex[:8]}"

            action_record = {
                "request_id": req_id,
                "application_id": application_id,
                "requested_by": reviewer_name,
                "request_type": "DOCUMENT_CLARIFICATION",
                "message": req_msg,
                "status": "PENDING",
                "borrower_response": None,
                "created_at": now,
                "resolved_at": None
            }
            ACTION_REQUESTS_STORE[application_id] = action_record

            LENDER_REVIEWS_STORE[application_id] = {
                "review_id": review_id,
                "application_id": application_id,
                "reviewer_id": reviewer_id,
                "reviewer_name": reviewer_name,
                "review_status": "ACTION_REQUIRED",
                "decision": "REQUEST_ACTION",
                "decision_reason": req_msg,
                "internal_note": decision_req.internal_note,
                "created_at": now,
                "updated_at": now
            }

            self.record_audit_event(
                application_id=application_id,
                user_id=reviewer_id,
                event_type="ACTION_REQUESTED",
                event_summary=f"Action requested by {reviewer_name}: '{req_msg}'."
            )

            return UnderwriterDecisionResponse(
                application_id=application_id,
                decision="REQUEST_ACTION",
                application_status="ACTION_REQUIRED",
                reviewer_id=reviewer_id,
                reviewer_name=reviewer_name,
                action_message=req_msg,
                message=f"Action requested for application {application_id}. Borrower will be notified to respond.",
                decided_at=now
            )

        else:  # REJECTED
            app["application_status"] = "REJECTED"
            app["updated_at"] = now

            reject_reason = decision_req.decision_reason or "Application did not meet underwriting eligibility criteria."

            LENDER_REVIEWS_STORE[application_id] = {
                "review_id": review_id,
                "application_id": application_id,
                "reviewer_id": reviewer_id,
                "reviewer_name": reviewer_name,
                "review_status": "REJECTED",
                "decision": "REJECTED",
                "decision_reason": reject_reason,
                "internal_note": decision_req.internal_note,
                "created_at": now,
                "updated_at": now
            }

            self.record_audit_event(
                application_id=application_id,
                user_id=reviewer_id,
                event_type="APPLICATION_REJECTED",
                event_summary=f"Application rejected by {reviewer_name}. Reason: {reject_reason}."
            )

            return UnderwriterDecisionResponse(
                application_id=application_id,
                decision="REJECTED",
                application_status="REJECTED",
                reviewer_id=reviewer_id,
                reviewer_name=reviewer_name,
                decision_reason=reject_reason,
                message=f"Application {application_id} has been marked as rejected.",
                decided_at=now
            )

    def submit_action_response(
        self,
        application_id: str,
        user_id: str,
        response_req: ActionResponseSubmit
    ) -> Dict[str, Any]:
        """Borrower responds to an Action Required request, transitioning application back to UNDER_REVIEW."""
        app = APPLICATIONS_STORE.get(application_id)
        if not app or app.get("user_id") != user_id:
            raise PermissionError("Application not found or unauthorized access.")

        if app.get("application_status") != "ACTION_REQUIRED":
            raise ValueError(f"Application {application_id} is not currently awaiting action.")

        now = datetime.utcnow().isoformat() + "Z"
        app["application_status"] = "UNDER_REVIEW"
        app["updated_at"] = now

        # Update action request
        act = ACTION_REQUESTS_STORE.get(application_id)
        if act:
            act["status"] = "RESOLVED"
            act["borrower_response"] = response_req.borrower_response
            act["resolved_at"] = now

        self.record_audit_event(
            application_id=application_id,
            user_id=user_id,
            event_type="ACTION_RESPONSE_SUBMITTED",
            event_summary=f"Borrower submitted action response: '{response_req.borrower_response[:60]}...'. Application returned to underwriter review."
        )

        return {
            "application_id": application_id,
            "application_status": "UNDER_REVIEW",
            "message": "Your response has been submitted to the underwriter.",
            "updated_at": now
        }

    def add_investigator_note(
        self,
        application_id: str,
        author_id: str,
        author_name: str,
        note_text: str
    ) -> InvestigatorNoteResponse:
        """Appends internal note to an application. (LENDER ONLY)."""
        app = APPLICATIONS_STORE.get(application_id)
        if not app:
            raise KeyError(f"Application {application_id} not found.")

        now = datetime.utcnow().isoformat() + "Z"
        note_id = f"note_{uuid.uuid4().hex[:8]}"

        record = {
            "note_id": note_id,
            "application_id": application_id,
            "author_id": author_id,
            "author_name": author_name,
            "note_text": note_text,
            "is_internal_only": True,
            "created_at": now
        }

        if application_id not in INVESTIGATOR_NOTES_STORE:
            INVESTIGATOR_NOTES_STORE[application_id] = []
        INVESTIGATOR_NOTES_STORE[application_id].append(record)

        return InvestigatorNoteResponse(**record)

    def get_investigator_notes(self, application_id: str) -> List[InvestigatorNoteResponse]:
        """Retrieves internal notes. (LENDER ONLY)."""
        records = INVESTIGATOR_NOTES_STORE.get(application_id, [])
        return [InvestigatorNoteResponse(**r) for r in records]

    def get_borrower_application_status(
        self,
        application_id: str,
        user_id: str
    ) -> BorrowerApplicationStatusResponse:
        """
        Retrieves authoritative borrower-safe status.
        Excludes internal notes, fraud graph, and sensitive investigation signals.
        """
        app = APPLICATIONS_STORE.get(application_id)
        if not app or app.get("user_id") != user_id:
            raise PermissionError("Application not found or unauthorized access.")

        status = app.get("application_status", "SUBMITTED")
        
        # Map stage for progress stepper
        stage_map = {
            "DRAFT": 1,
            "SUBMITTED": 4,
            "UNDER_VERIFICATION": 4,
            "UNDER_REVIEW": 4,
            "ACTION_REQUIRED": 4,
            "APPROVED": 5,
            "REJECTED": 5
        }
        current_stage = stage_map.get(status, 4)

        review = LENDER_REVIEWS_STORE.get(application_id, {})
        approved_terms = None
        if status == "APPROVED" and "approved_amount" in review:
            approved_terms = ApprovedTerms(
                approved_amount=int(review.get("approved_amount", app.get("requested_amount", 0))),
                approved_duration_months=int(review.get("approved_duration_months", app.get("requested_duration_months", 12))),
                approved_interest_rate=float(review.get("approved_interest_rate", 13.5)),
                approved_emi=int(review.get("approved_emi", app.get("estimated_emi", 0))),
                approval_date=review.get("updated_at", "")[:10] or app.get("updated_at", "")[:10],
                decision_by="Authorized Underwriter"
            )

        action_req = None
        if status == "ACTION_REQUIRED" and application_id in ACTION_REQUESTS_STORE:
            action_req = ActionRequestDetail(**ACTION_REQUESTS_STORE[application_id])

        rejection_reason = None
        if status == "REJECTED":
            rejection_reason = review.get("decision_reason") or "Application did not meet underwriting criteria."

        next_step_map = {
            "SUBMITTED": "Lender verification",
            "UNDER_REVIEW": "Underwriter inspection",
            "ACTION_REQUIRED": "Action required by applicant",
            "APPROVED": "Loan sanctioned & ready for disbursement",
            "REJECTED": "Application closed"
        }

        msg_map = {
            "SUBMITTED": "Your application has been submitted and is queued for lender verification.",
            "UNDER_REVIEW": "Your application is currently being evaluated by an authorized underwriter.",
            "ACTION_REQUIRED": "The underwriter has requested additional information before proceeding.",
            "APPROVED": "Congratulations! Your loan application has been approved.",
            "REJECTED": "Your loan application was not approved by the underwriter."
        }

        return BorrowerApplicationStatusResponse(
            application_id=application_id,
            loan_product_name=app.get("loan_product_name", "Personal Loan"),
            requested_amount=app.get("requested_amount", 0),
            requested_duration_months=app.get("requested_duration_months", 12),
            loan_purpose=app.get("loan_purpose", "Personal"),
            estimated_emi=app.get("estimated_emi", 0),
            application_status=status,
            current_stage=current_stage,
            submitted_at=app.get("submitted_at"),
            updated_at=app.get("updated_at", datetime.utcnow().isoformat() + "Z"),
            next_step=next_step_map.get(status, "Underwriter review"),
            approved_terms=approved_terms,
            action_request=action_req,
            rejection_reason=rejection_reason,
            message=msg_map.get(status, "Status updated.")
        )


loan_service = LoanService()

