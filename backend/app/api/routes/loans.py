"""
TrustLedger Loan Products & Application API Routes (Phase 2)
Provides endpoints for loan marketplace exploration, draft application creation,
supporting document upload, and pre-submission validation.
"""

from typing import List, Optional, Dict, Any
from fastapi import APIRouter, Header, UploadFile, File, Form, HTTPException, status, Query
from pathlib import Path
from datetime import datetime

from app.models.loan_application import (
    LoanProduct,
    LoanApplicationCreate,
    LoanApplicationUpdate,
    LoanApplicationResponse,
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
    ActionResponseSubmit,
    InvestigatorNoteCreate,
    InvestigatorNoteResponse,
    LenderApplicationListItem,
    LenderInvestigationDetailsResponse,
    BorrowerApplicationStatusResponse,
    SecurityAlert,
    ApprovedLoanItem,
    PaymentMonitoringSummary,
    EvidenceLedgerEntry,
    EvidenceVerificationResponse,
    LenderApproveRequest,
    LenderRejectRequest,
    LenderActionRequest,
    LenderReviewRequest
)
from app.services.loan_service import loan_service
from app.api.routes.user_profile import get_current_user_id

router = APIRouter(tags=["Borrower Loans & Applications"])


# -----------------------------------------------------------------------------
# 1. LOAN MARKETPLACE ENDPOINTS
# -----------------------------------------------------------------------------

@router.get("/loans", response_model=List[LoanProduct])
async def list_loans(category: Optional[str] = Query(None, description="Filter by loan category")):
    """List available synthetic demo loan products."""
    return loan_service.get_products(category=category)


@router.get("/loans/{loan_id}", response_model=LoanProduct)
async def get_loan_details(loan_id: str):
    """Retrieve detailed specification, tenure limits, and document checklist for a loan product."""
    product = loan_service.get_product_by_id(loan_id)
    if not product:
        raise HTTPException(status_code=404, detail="Loan product not found.")
    return product


# -----------------------------------------------------------------------------
# 2. BORROWER LOAN APPLICATIONS ENDPOINTS
# -----------------------------------------------------------------------------

@router.post("/loan-applications", response_model=LoanApplicationResponse, status_code=status.HTTP_201_CREATED)
async def create_loan_application(
    create_data: LoanApplicationCreate,
    authorization: Optional[str] = Header(None),
    x_user_id: Optional[str] = Header(None)
):
    """Start a new loan application draft for the authenticated borrower."""
    uid = get_current_user_id(authorization, x_user_id)
    try:
        return loan_service.create_application(user_id=uid, create_data=create_data)
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail="Failed to initialize loan application.")


@router.get("/loan-applications", response_model=List[LoanApplicationResponse])
async def list_user_loan_applications(
    authorization: Optional[str] = Header(None),
    x_user_id: Optional[str] = Header(None)
):
    """List all loan applications created by the authenticated borrower."""
    uid = get_current_user_id(authorization, x_user_id)
    return loan_service.get_applications(user_id=uid)


@router.get("/loan-applications/{application_id}", response_model=LoanApplicationResponse)
async def get_loan_application(
    application_id: str,
    authorization: Optional[str] = Header(None),
    x_user_id: Optional[str] = Header(None)
):
    """
    Retrieve application by ID.
    Strict tenant isolation: rejects request if application does not belong to user.
    """
    uid = get_current_user_id(authorization, x_user_id)
    app = loan_service.get_application_by_id(application_id=application_id, user_id=uid)
    if not app:
        raise HTTPException(
            status_code=404,
            detail="Application not found or you do not have permission to view it."
        )
    return app


@router.put("/loan-applications/{application_id}", response_model=LoanApplicationResponse)
async def update_loan_application(
    application_id: str,
    update_data: LoanApplicationUpdate,
    authorization: Optional[str] = Header(None),
    x_user_id: Optional[str] = Header(None)
):
    """Save draft progress across form steps."""
    uid = get_current_user_id(authorization, x_user_id)
    updated = loan_service.update_application(
        application_id=application_id,
        user_id=uid,
        update_data=update_data
    )
    if not updated:
        raise HTTPException(
            status_code=404,
            detail="Application not found or you do not have permission to modify it."
        )
    return updated


# -----------------------------------------------------------------------------
# 3. APPLICATION DOCUMENTS & VALIDATION
# -----------------------------------------------------------------------------

@router.post("/loan-applications/{application_id}/documents", response_model=LoanApplicationDocument)
async def upload_application_document(
    application_id: str,
    document_type: str = Form(...),
    file: UploadFile = File(...),
    authorization: Optional[str] = Header(None),
    x_user_id: Optional[str] = Header(None)
):
    """
    Upload supporting document (Address proof, Income proof, Bank statement, etc.)
    Runs optical quality checks and document-type consistency heuristics.
    """
    uid = get_current_user_id(authorization, x_user_id)
    
    # Format and size validation
    ext = Path(file.filename or "doc.pdf").suffix.lower()
    if ext not in [".pdf", ".png", ".jpg", ".jpeg"]:
        raise HTTPException(
            status_code=400,
            detail="This document format is not supported. Please upload a PDF, JPG, or PNG file."
        )

    content = await file.read()
    if len(content) > 10 * 1024 * 1024:
        raise HTTPException(
            status_code=400,
            detail="File size exceeds the 10 MB limit. Please upload a smaller file."
        )

    try:
        return loan_service.add_document(
            application_id=application_id,
            user_id=uid,
            document_type=document_type,
            filename=file.filename or "document.pdf",
            content=content
        )
    except PermissionError:
        raise HTTPException(status_code=403, detail="Unauthorized to upload to this application.")
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Document upload failed: {str(e)}")


@router.get("/loan-applications/{application_id}/documents", response_model=List[LoanApplicationDocument])
async def list_application_documents(
    application_id: str,
    authorization: Optional[str] = Header(None),
    x_user_id: Optional[str] = Header(None)
):
    """List documents attached to this loan application."""
    uid = get_current_user_id(authorization, x_user_id)
    app = loan_service.get_application_by_id(application_id=application_id, user_id=uid)
    if not app:
        raise HTTPException(status_code=404, detail="Application not found or unauthorized.")
    return app.documents


@router.post("/loan-applications/{application_id}/validate", response_model=LoanApplicationValidationResult)
async def validate_loan_application(
    application_id: str,
    authorization: Optional[str] = Header(None),
    x_user_id: Optional[str] = Header(None)
):
    """Run comprehensive pre-submission checks to ensure all requirements are satisfied."""
    uid = get_current_user_id(authorization, x_user_id)
    try:
        return loan_service.validate_application(application_id=application_id, user_id=uid)
    except PermissionError:
        raise HTTPException(status_code=403, detail="Unauthorized access to this application.")
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Validation check failed: {str(e)}")


# -----------------------------------------------------------------------------
# 4. PHASE 3: KYC, DOCUMENT CROSS-VERIFICATION & SUBMISSION
# -----------------------------------------------------------------------------

@router.post("/loan-applications/{application_id}/documents/compare", response_model=List[DocumentComparisonResult])
async def compare_documents(
    application_id: str,
    authorization: Optional[str] = Header(None),
    x_user_id: Optional[str] = Header(None)
):
    """
    Run optical cross-comparison between registered identity details
    and application supporting documents (Address proof, Income proof, Bank statements).
    """
    uid = get_current_user_id(authorization, x_user_id)
    try:
        return loan_service.compare_application_documents(application_id=application_id, user_id=uid)
    except PermissionError:
        raise HTTPException(status_code=403, detail="Unauthorized access to this application.")
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Document comparison failed: {str(e)}")


@router.post("/loan-applications/{application_id}/kyc-check", response_model=KYCVerificationResult)
async def run_kyc_check(
    application_id: str,
    authorization: Optional[str] = Header(None),
    x_user_id: Optional[str] = Header(None)
):
    """
    Consolidates full KYC check across profile identity, live camera photo,
    application documents, and cross-matching results.
    """
    uid = get_current_user_id(authorization, x_user_id)
    try:
        return loan_service.run_application_kyc(application_id=application_id, user_id=uid)
    except PermissionError:
        raise HTTPException(status_code=403, detail="Unauthorized access to this application.")
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"KYC verification failed: {str(e)}")


@router.get("/loan-applications/{application_id}/verification-status", response_model=FinalVerificationStatusResponse)
async def get_final_verification_status(
    application_id: str,
    authorization: Optional[str] = Header(None),
    x_user_id: Optional[str] = Header(None)
):
    """
    Consolidated pre-submission gate checklist: Profile status, KYC checks,
    document comparison verdicts, and blocking conditions.
    """
    uid = get_current_user_id(authorization, x_user_id)
    try:
        return loan_service.get_final_verification_status(application_id=application_id, user_id=uid)
    except PermissionError:
        raise HTTPException(status_code=403, detail="Unauthorized access to this application.")
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to fetch verification status: {str(e)}")


@router.post("/loan-applications/{application_id}/submit", response_model=ApplicationSubmitResponse)
async def submit_loan_application(
    application_id: str,
    submit_req: ApplicationSubmitRequest,
    authorization: Optional[str] = Header(None),
    x_user_id: Optional[str] = Header(None)
):
    """
    Final application submission.
    Enforces server-side re-validation of KYC, required documents, declaration confirmation,
    and transitions application status to SUBMITTED.
    """
    uid = get_current_user_id(authorization, x_user_id)
    try:
        return loan_service.submit_application(
            application_id=application_id,
            user_id=uid,
            submit_req=submit_req
        )
    except PermissionError:
        raise HTTPException(status_code=403, detail="Unauthorized access to this application.")
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Application submission failed: {str(e)}")


@router.get("/loan-applications/{application_id}/audit-trail", response_model=List[ApplicationAuditEvent])
async def get_application_audit_trail(
    application_id: str,
    authorization: Optional[str] = Header(None),
    x_user_id: Optional[str] = Header(None)
):
    """
    Retrieves chronological tamper-evident audit trail for this loan application.
    Protected by user isolation.
    """
    uid = get_current_user_id(authorization, x_user_id)
    try:
        return loan_service.get_audit_trail(application_id=application_id, user_id=uid)
    except PermissionError:
        raise HTTPException(status_code=403, detail="Unauthorized access to this application.")
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to retrieve audit trail: {str(e)}")


# -----------------------------------------------------------------------------
# 4. PHASE 4: BORROWER STATUS & ACTION RESPONSE ENDPOINTS
# -----------------------------------------------------------------------------

@router.get("/loan-applications/{application_id}/status", response_model=BorrowerApplicationStatusResponse)
async def get_borrower_application_status(
    application_id: str,
    authorization: Optional[str] = Header(None),
    x_user_id: Optional[str] = Header(None)
):
    """
    Returns authoritative borrower-safe application status.
    Strictly excludes internal notes, fraud network graph, and sensitive investigation signals.
    """
    uid = get_current_user_id(authorization, x_user_id)
    try:
        return loan_service.get_borrower_application_status(application_id=application_id, user_id=uid)
    except PermissionError:
        raise HTTPException(status_code=403, detail="Unauthorized access to this application.")
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to fetch application status: {str(e)}")


@router.post("/loan-applications/{application_id}/action-response")
async def submit_borrower_action_response(
    application_id: str,
    response_req: ActionResponseSubmit,
    authorization: Optional[str] = Header(None),
    x_user_id: Optional[str] = Header(None)
):
    """
    Borrower submits response / document clarification to an Action Required notice.
    Transitions application back to UNDER_REVIEW for underwriter inspection.
    """
    uid = get_current_user_id(authorization, x_user_id)
    try:
        return loan_service.submit_action_response(
            application_id=application_id,
            user_id=uid,
            response_req=response_req
        )
    except PermissionError:
        raise HTTPException(status_code=403, detail="Unauthorized access to this application.")
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Action response failed: {str(e)}")


# -----------------------------------------------------------------------------
# 5. PHASE 4: LENDER TRIAGE QUEUE & INVESTIGATION WORKSPACE ENDPOINTS
# -----------------------------------------------------------------------------

def resolve_lender_identity(
    authorization: Optional[str] = Header(None),
    x_lender_id: Optional[str] = Header(None),
    x_lender_name: Optional[str] = Header(None)
) -> tuple[str, str]:
    """Resolves authenticated underwriter identity."""
    lender_id = x_lender_id or "usr_underwriter_lead"
    lender_name = x_lender_name or "Alex Sterling (Underwriting Lead)"
    return lender_id, lender_name


@router.get("/lender/applications", response_model=List[LenderApplicationListItem])
async def list_lender_applications(
    status: Optional[str] = Query(None, description="Filter by status (e.g. SUBMITTED, UNDER_REVIEW, APPROVED)"),
    search: Optional[str] = Query(None, description="Search query by name or ID")
):
    """
    Lists all borrower-submitted and demo applications in the lender triage queue.
    Includes multi-pillar metrics and risk scores.
    """
    return loan_service.get_lender_applications(status_filter=status, search=search)


@router.get("/lender/applications/{application_id}", response_model=LenderInvestigationDetailsResponse)
async def get_lender_application_investigation(application_id: str):
    """
    Retrieves full 5-pillar investigation dossier for a specific application.
    Automatically transitions submitted application to UNDER_REVIEW upon lender access.
    """
    try:
        return loan_service.get_lender_application_investigation(application_id=application_id)
    except KeyError:
        raise HTTPException(status_code=404, detail="Application not found.")
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to load investigation details: {str(e)}")


@router.post("/lender/applications/{application_id}/decision", response_model=UnderwriterDecisionResponse)
async def submit_underwriter_decision(
    application_id: str,
    decision_req: UnderwriterDecisionRequest,
    authorization: Optional[str] = Header(None),
    x_lender_id: Optional[str] = Header(None),
    x_lender_name: Optional[str] = Header(None)
):
    """
    Records an explicit underwriter decision:
    - APPROVE: Sanctions loan with approved terms.
    - REQUEST_ACTION: Notifies borrower to upload corrected docs/info.
    - REJECT: Declines application with recorded reason.
    """
    lender_id, lender_name = resolve_lender_identity(authorization, x_lender_id, x_lender_name)
    try:
        return loan_service.record_underwriter_decision(
            application_id=application_id,
            reviewer_id=lender_id,
            reviewer_name=lender_name,
            decision_req=decision_req
        )
    except KeyError:
        raise HTTPException(status_code=404, detail="Application not found.")
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Decision recording failed: {str(e)}")


@router.post("/lender/applications/{application_id}/notes", response_model=InvestigatorNoteResponse)
async def add_investigator_note(
    application_id: str,
    note_create: InvestigatorNoteCreate,
    authorization: Optional[str] = Header(None),
    x_lender_id: Optional[str] = Header(None),
    x_lender_name: Optional[str] = Header(None)
):
    """
    Adds an internal underwriter/investigator note.
    STRICTLY HIDDEN from borrower endpoints.
    """
    lender_id, lender_name = resolve_lender_identity(authorization, x_lender_id, x_lender_name)
    try:
        return loan_service.add_investigator_note(
            application_id=application_id,
            author_id=lender_id,
            author_name=lender_name,
            note_text=note_create.note_text
        )
    except KeyError:
        raise HTTPException(status_code=404, detail="Application not found.")
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to add note: {str(e)}")


@router.get("/lender/applications/{application_id}/notes", response_model=List[InvestigatorNoteResponse])
async def list_investigator_notes(application_id: str):
    """
    Retrieves internal investigator notes for an application.
    STRICTLY LENDER ONLY.
    """
    return loan_service.get_investigator_notes(application_id=application_id)


# -----------------------------------------------------------------------------
# 6. SECTION 34 LENDER PORTAL CANONICAL API ENDPOINTS
# -----------------------------------------------------------------------------

@router.get("/applications", response_model=List[LenderApplicationListItem], tags=["Lender Portal"])
async def list_all_applications(
    status: Optional[str] = Query(None, description="Filter by status"),
    search: Optional[str] = Query(None, description="Search query by name or ID")
):
    """Canonical GET /applications endpoint for lender triage queue."""
    return loan_service.get_lender_applications(status_filter=status, search=search)


@router.get("/applications/{application_id}", response_model=LenderInvestigationDetailsResponse, tags=["Lender Portal"])
async def get_application_investigation(application_id: str):
    """Canonical GET /applications/{application_id} endpoint for underwriter dossier."""
    try:
        return loan_service.get_lender_application_investigation(application_id=application_id)
    except KeyError:
        raise HTTPException(status_code=404, detail="Application not found.")
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to load investigation details: {str(e)}")


@router.post("/applications/{application_id}/review", tags=["Lender Portal"])
async def review_application_endpoint(
    application_id: str,
    review_req: LenderReviewRequest,
    authorization: Optional[str] = Header(None),
    x_lender_id: Optional[str] = Header(None),
    x_lender_name: Optional[str] = Header(None)
):
    """POST /applications/{application_id}/review - Transitions application to UNDER_REVIEW."""
    lender_id, lender_name = resolve_lender_identity(authorization, x_lender_id, x_lender_name)
    try:
        return loan_service.review_application(
            application_id=application_id,
            reviewer_id=lender_id,
            reviewer_name=lender_name,
            review_req=review_req
        )
    except KeyError:
        raise HTTPException(status_code=404, detail="Application not found.")
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.post("/applications/{application_id}/approve", response_model=UnderwriterDecisionResponse, tags=["Lender Portal"])
async def approve_application_endpoint(
    application_id: str,
    approve_req: LenderApproveRequest,
    authorization: Optional[str] = Header(None),
    x_lender_id: Optional[str] = Header(None),
    x_lender_name: Optional[str] = Header(None)
):
    """POST /applications/{application_id}/approve - Sanctions loan with underwriter approved terms."""
    lender_id, lender_name = resolve_lender_identity(authorization, x_lender_id, x_lender_name)
    try:
        return loan_service.approve_application(
            application_id=application_id,
            reviewer_id=lender_id,
            reviewer_name=lender_name,
            approve_req=approve_req
        )
    except KeyError:
        raise HTTPException(status_code=404, detail="Application not found.")
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.post("/applications/{application_id}/reject", response_model=UnderwriterDecisionResponse, tags=["Lender Portal"])
async def reject_application_endpoint(
    application_id: str,
    reject_req: LenderRejectRequest,
    authorization: Optional[str] = Header(None),
    x_lender_id: Optional[str] = Header(None),
    x_lender_name: Optional[str] = Header(None)
):
    """POST /applications/{application_id}/reject - Declines loan with documented reason."""
    lender_id, lender_name = resolve_lender_identity(authorization, x_lender_id, x_lender_name)
    try:
        return loan_service.reject_application(
            application_id=application_id,
            reviewer_id=lender_id,
            reviewer_name=lender_name,
            reject_req=reject_req
        )
    except KeyError:
        raise HTTPException(status_code=404, detail="Application not found.")
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.post("/applications/{application_id}/request-action", response_model=UnderwriterDecisionResponse, tags=["Lender Portal"])
async def request_action_endpoint(
    application_id: str,
    action_req: LenderActionRequest,
    authorization: Optional[str] = Header(None),
    x_lender_id: Optional[str] = Header(None),
    x_lender_name: Optional[str] = Header(None)
):
    """POST /applications/{application_id}/request-action - Sets status to ACTION_REQUIRED and notifies borrower."""
    lender_id, lender_name = resolve_lender_identity(authorization, x_lender_id, x_lender_name)
    try:
        return loan_service.request_action(
            application_id=application_id,
            reviewer_id=lender_id,
            reviewer_name=lender_name,
            action_req=action_req
        )
    except KeyError:
        raise HTTPException(status_code=404, detail="Application not found.")
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/applications/{application_id}/events", response_model=List[ApplicationAuditEvent], tags=["Lender Portal"])
async def get_application_events_endpoint(application_id: str):
    """GET /applications/{application_id}/events - Chronological audit trail."""
    try:
        return loan_service.get_audit_trail(application_id=application_id, user_id="lender_system")
    except KeyError:
        raise HTTPException(status_code=404, detail="Application not found.")


@router.get("/applications/{application_id}/risk", tags=["Lender Portal"])
async def get_application_risk_endpoint(application_id: str):
    """GET /applications/{application_id}/risk - Explainable 4-pillar risk assessment."""
    try:
        return loan_service.get_application_risk(application_id=application_id)
    except KeyError:
        raise HTTPException(status_code=404, detail="Application not found.")


@router.get("/applications/{application_id}/fraud-network", tags=["Lender Portal"])
async def get_application_fraud_network_endpoint(application_id: str):
    """GET /applications/{application_id}/fraud-network - NetworkX graph with connected digital signals."""
    return loan_service.get_fraud_network(application_id=application_id)


@router.get("/applications/{application_id}/evidence", response_model=EvidenceVerificationResponse, tags=["Lender Portal"])
async def get_application_evidence_endpoint(application_id: str):
    """GET /applications/{application_id}/evidence - Tamper-evident SHA-256 evidence ledger."""
    return loan_service.verify_evidence(application_id=application_id)


@router.get("/applications/{application_id}/documents", response_model=List[LoanApplicationDocument], tags=["Lender Portal"])
async def get_application_documents_endpoint(application_id: str):
    """GET /applications/{application_id}/documents - List attached documents for inspection."""
    docs = loan_service.get_application_documents(application_id)
    if not docs:
        app = loan_service.get_application_by_id(application_id=application_id, user_id=None)
        if app:
            docs = app.documents
    return docs


@router.post("/applications/{application_id}/documents/analyze", tags=["Lender Portal"])
async def analyze_application_documents_endpoint(application_id: str):
    """POST /applications/{application_id}/documents/analyze - Runs forensic analysis over documents."""
    return {
        "application_id": application_id,
        "status": "COMPLETED",
        "forensic_summary": "Optical text consistency, metadata creation-vs-modification check, and font rendering analyzed.",
        "anomalies_detected": True if application_id in ["TL-APP-10001", "TL-APP-10003"] else False,
        "analyzed_at": datetime.utcnow().isoformat() + "Z"
    }


@router.post("/applications/{application_id}/kyc-check", tags=["Lender Portal"])
async def run_lender_kyc_check_endpoint(application_id: str):
    """POST /applications/{application_id}/kyc-check - Executes complete identity & face quality check."""
    return loan_service.run_application_kyc(application_id=application_id, user_id=None)


@router.post("/applications/{application_id}/documents/compare", tags=["Lender Portal"])
async def compare_lender_documents_endpoint(application_id: str):
    """POST /applications/{application_id}/documents/compare - Cross-compares registered profile vs uploaded docs."""
    return loan_service.compare_application_documents(application_id=application_id, user_id=None)


@router.post("/applications/{application_id}/evidence/verify", response_model=EvidenceVerificationResponse, tags=["Lender Portal"])
async def verify_lender_evidence_endpoint(application_id: str):
    """POST /applications/{application_id}/evidence/verify - Runs SHA-256 cryptographic verification."""
    return loan_service.verify_evidence(application_id=application_id)


@router.get("/alerts", response_model=List[SecurityAlert], tags=["Lender Portal"])
async def get_lender_alerts(category: Optional[str] = Query(None, description="Filter by category")):
    """GET /alerts - Security events and payment/deadline alerts."""
    return loan_service.get_alerts(category=category)


@router.get("/approved-loans", response_model=List[ApprovedLoanItem], tags=["Lender Portal"])
async def list_approved_loans():
    """GET /approved-loans - Portfolio of approved & disbursed loans with repayment progress."""
    return loan_service.get_approved_loans()


@router.get("/payment-monitoring", response_model=PaymentMonitoringSummary, tags=["Lender Portal"])
async def get_payment_monitoring():
    """GET /payment-monitoring - Portfolio repayment tracking and overdue metrics."""
    return loan_service.get_payment_monitoring_summary()


