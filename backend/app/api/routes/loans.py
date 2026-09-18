"""
TrustLedger Loan Products & Application API Routes (Phase 2)
Provides endpoints for loan marketplace exploration, draft application creation,
supporting document upload, and pre-submission validation.
"""

from typing import List, Optional, Dict, Any
from fastapi import APIRouter, Header, UploadFile, File, Form, HTTPException, status, Query
from pathlib import Path

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
    BorrowerApplicationStatusResponse
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


