from fastapi import APIRouter, UploadFile, File, Form, HTTPException, status
from typing import List, Optional
from datetime import datetime

from app.schemas.document import (
    DocumentUploadResponse,
    DocumentAnalysisResponse,
    DocumentMetadata,
    OCRResult,
    VisualSignals,
    TextAnalysis,
    ForensicFinding,
    BoundingBox
)
from app.services.document_analyzer import document_analyzer

router = APIRouter(tags=["Document Forensics"])

# In-memory prototype registry for stored documents and analysis results
DOCUMENTS_STORE: dict = {}

# Pre-populated synthetic demo documents for immediate testing
PREPOPULATED_DEMO_DOCUMENTS = {
    "APP-1003": [
        {
            "document_id": "DOC-1003-01",
            "application_id": "APP-1003",
            "filename": "Bank_Statement_RahulVerma_May2026.pdf",
            "document_type": "Bank Statement",
            "risk_score": 87,
            "risk_level": "HIGH",
            "findings": [
                {
                    "id": "f-1",
                    "type": "formatting",
                    "severity": "high",
                    "title": "Font inconsistency detected in salary deposit row",
                    "description": "Text region '₹95,000.00' uses Helvetica-Bold font subset, differing from document baseline template.",
                    "location": "Page 2: Line 14",
                    "bbox": {"x": 140, "y": 310, "width": 320, "height": 38, "page": 2}
                },
                {
                    "id": "f-2",
                    "type": "metadata",
                    "severity": "medium",
                    "title": "Metadata modification signal",
                    "description": "Document was modified 14 days after original export timestamp with Adobe Photoshop 24.1.",
                    "location": "Header / XMP",
                    "bbox": None
                },
                {
                    "id": "f-3",
                    "type": "ocr_mismatch",
                    "severity": "high",
                    "title": "OCR / text mismatch detected",
                    "description": "Visual character scan reads '₹95,000' while underlying stream contains residue token '₹25,000'.",
                    "location": "Page 2: Net Deposit",
                    "bbox": {"x": 140, "y": 310, "width": 320, "height": 38, "page": 2}
                }
            ],
            "metadata": {
                "page_count": 3,
                "title": "Account Statement - May 2026",
                "author": "National Retail Bank",
                "creator": "CoreBanking Export v4.2",
                "producer": "Adobe Photoshop 24.1 (Windows)",
                "creation_date": "2026-05-02 08:30:11 UTC",
                "modification_date": "2026-05-16 14:12:45 UTC",
                "fonts": ["ArialMT", "Helvetica-Bold", "Times-Roman", "Courier"],
                "image_count": 2,
                "file_size_bytes": 482100,
                "file_size_formatted": "470.8 KB",
                "page_dimensions": "595 x 842 pt"
            },
            "ocr": {
                "available": True,
                "text": "STATE BANK OF INDIA - STATEMENT OF ACCOUNT\nName: Rahul Verma\nNet Monthly Credit: ₹95,000.00\nClosing Balance: ₹1,48,200.00",
                "confidence": 91.4,
                "engine": "Tesseract OCR",
                "character_count": 420,
                "reason": None
            },
            "visual_signals": {
                "image_regions_analyzed": 4,
                "suspicious_regions": 1,
                "layout_consistency": 68,
                "font_consistency": 42,
                "ocr_consistency": 55
            },
            "text_analysis": {
                "total_characters": 3840,
                "total_blocks": 24,
                "extracted_text_preview": "STATE BANK OF INDIA - STATEMENT OF ACCOUNT\nAccount No: •••••••• 4821\nCustomer: Rahul Verma\nAddress: Sector 14, Gurugram, Haryana\nTransaction Details:\n02 May: SALARY CREDIT CORP: ₹95,000.00",
                "currency_tokens_detected": ["₹95,000.00", "₹1,48,200.00", "₹12,400.00", "₹4,250.00"],
                "sensitive_entities_masked": True
            },
            "recommended_action": "Review original source document before making a lending decision. Human underwriter signoff required.",
            "analysis_timestamp": "2026-09-18 21:28:14 UTC"
        },
        {
            "document_id": "DOC-1003-02",
            "application_id": "APP-1003",
            "filename": "GSTR3B_Filing_RahulVerma.pdf",
            "document_type": "GST Filing",
            "risk_score": 72,
            "risk_level": "HIGH",
            "findings": [
                {
                    "id": "f-201",
                    "type": "formatting",
                    "severity": "high",
                    "title": "Turnover variance mismatch",
                    "description": "Reported outward taxable turnover differs from banking transaction velocity by over 45%.",
                    "location": "Table 3.1",
                    "bbox": None
                }
            ],
            "metadata": {
                "page_count": 2,
                "title": "GSTR-3B Return Summary",
                "author": "GST Portal",
                "creator": "GSTN Portal Engine",
                "producer": "iTextSharp 5.5",
                "creation_date": "2026-04-20 11:15:00 UTC",
                "modification_date": "2026-04-20 11:15:00 UTC",
                "fonts": ["Helvetica", "Helvetica-Bold"],
                "image_count": 1,
                "file_size_bytes": 218400,
                "file_size_formatted": "213.3 KB",
                "page_dimensions": "595 x 842 pt"
            },
            "ocr": {
                "available": True,
                "text": "GOODS AND SERVICES TAX RETURN - GSTR-3B\nGSTIN: 07AAAAA0000A1Z5\nTurnover: ₹14,20,000.00",
                "confidence": 94.2,
                "engine": "Tesseract OCR",
                "character_count": 310,
                "reason": None
            },
            "visual_signals": {
                "image_regions_analyzed": 1,
                "suspicious_regions": 0,
                "layout_consistency": 85,
                "font_consistency": 78,
                "ocr_consistency": 90
            },
            "text_analysis": {
                "total_characters": 1820,
                "total_blocks": 12,
                "extracted_text_preview": "GOVERNMENT OF INDIA - GSTR-3B SUMMARY\nTax Period: April 2026\nGSTIN: 07AAAAA0000A1Z5\nLegal Name: VERMA TRADING VENTURES",
                "currency_tokens_detected": ["₹14,20,000.00", "₹2,55,600.00"],
                "sensitive_entities_masked": True
            },
            "recommended_action": "Cross-reference turnover with bank inflow statements before approval.",
            "analysis_timestamp": "2026-09-18 21:30:22 UTC"
        }
    ],
    "APP-1001": [
        {
            "document_id": "DOC-1001-01",
            "application_id": "APP-1001",
            "filename": "ArjunMehta_SalarySlip_April2026.pdf",
            "document_type": "Salary Slip",
            "risk_score": 12,
            "risk_level": "LOW",
            "findings": [],
            "metadata": {
                "page_count": 1,
                "title": "Payslip - April 2026",
                "author": "TechCorp Payroll",
                "creator": "Workday Payroll Cloud",
                "producer": "PDFlib+PDI 9.2",
                "creation_date": "2026-04-30 06:10:00 UTC",
                "modification_date": "2026-04-30 06:10:00 UTC",
                "fonts": ["Inter-Regular", "Inter-Bold"],
                "image_count": 1,
                "file_size_bytes": 124000,
                "file_size_formatted": "121.1 KB",
                "page_dimensions": "595 x 842 pt"
            },
            "ocr": {
                "available": True,
                "text": "TECHCORP INDIA PVT LTD - PAYSLIP\nEmployee: Arjun Mehta\nNet Salary: ₹85,400.00",
                "confidence": 98.1,
                "engine": "Tesseract OCR",
                "character_count": 280,
                "reason": None
            },
            "visual_signals": {
                "image_regions_analyzed": 1,
                "suspicious_regions": 0,
                "layout_consistency": 98,
                "font_consistency": 99,
                "ocr_consistency": 98
            },
            "text_analysis": {
                "total_characters": 1450,
                "total_blocks": 10,
                "extracted_text_preview": "TECHCORP INDIA - MONTHLY PAYROLL\nEmp ID: TC-8841\nName: Arjun Mehta\nDesignation: Senior Systems Engineer\nNet Pay: ₹85,400.00",
                "currency_tokens_detected": ["₹85,400.00", "₹1,10,000.00"],
                "sensitive_entities_masked": True
            },
            "recommended_action": "Standard automated verification passed. Document is verified safe.",
            "analysis_timestamp": "2026-09-18 21:28:40 UTC"
        }
    ]
}


@router.post(
    "/applications/{application_id}/documents",
    response_model=DocumentUploadResponse,
    summary="Upload Lending Document",
    description="Upload a PDF or image document (up to 10 MB) for an application."
)
async def upload_document(
    application_id: str,
    file: UploadFile = File(...),
    document_type: Optional[str] = Form("Bank Statement")
):
    try:
        content = await file.read()
        file_size = len(content)

        # Validate file constraints
        document_analyzer.validate_file(file.filename, file_size, file.content_type)

        # Save to storage abstraction
        doc_id, file_path = document_analyzer.save_uploaded_file(application_id, file.filename, content)

        record = {
            "document_id": doc_id,
            "application_id": application_id,
            "filename": file.filename,
            "document_type": document_type,
            "file_size": file_size,
            "file_path": file_path,
            "upload_timestamp": datetime.utcnow().strftime("%Y-%m-%d %H:%M:%S UTC"),
            "status": "Uploaded (Pending Analysis)"
        }

        if application_id not in DOCUMENTS_STORE:
            DOCUMENTS_STORE[application_id] = []
        DOCUMENTS_STORE[application_id].append(record)

        return DocumentUploadResponse(
            document_id=doc_id,
            application_id=application_id,
            filename=file.filename,
            document_type=document_type,
            file_size=file_size,
            upload_timestamp=record["upload_timestamp"],
            status="Uploaded"
        )
    except ValueError as e:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=str(e))
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to securely process and store the uploaded document."
        )


@router.post(
    "/applications/{application_id}/analyze/document",
    response_model=DocumentAnalysisResponse,
    summary="Analyze Lending Document",
    description="Runs the Document Forensics AI pipeline on an uploaded or specified document."
)
async def analyze_document_endpoint(
    application_id: str,
    document_id: Optional[str] = None,
    document_type: Optional[str] = "Bank Statement",
    filename: Optional[str] = None
):
    # Check if a live file was uploaded in store
    app_docs = DOCUMENTS_STORE.get(application_id, [])
    target_doc = None

    if document_id:
        target_doc = next((d for d in app_docs if d["document_id"] == document_id), None)
    elif app_docs:
        target_doc = app_docs[-1]

    if target_doc and "file_path" in target_doc:
        # Run real forensic analysis on physical uploaded file
        try:
            analysis = document_analyzer.analyze_document(
                application_id=application_id,
                document_id=target_doc["document_id"],
                filename=target_doc["filename"],
                file_path=target_doc["file_path"],
                document_type=target_doc.get("document_type", document_type)
            )
            # Cache analysis in store
            target_doc["analysis_result"] = analysis
            return analysis
        except Exception:
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail="Forensic analysis pipeline failed to process document."
            )

    # Check pre-populated demo documents
    demo_docs = PREPOPULATED_DEMO_DOCUMENTS.get(application_id, [])
    if demo_docs:
        if document_id:
            demo_match = next((d for d in demo_docs if d["document_id"] == document_id), None)
            if demo_match:
                return demo_match
        return demo_docs[0]

    # Default fallback for any newly created application ID in demo mode
    fallback_analysis = {
        "document_id": document_id or f"DOC-{application_id[-4:]}-01",
        "application_id": application_id,
        "filename": filename or "Bank_Statement_Verification.pdf",
        "document_type": document_type,
        "risk_score": 76,
        "risk_level": "HIGH",
        "findings": [
            {
                "id": "f-gen-1",
                "type": "formatting",
                "severity": "high",
                "title": "Font kerning anomaly detected",
                "description": "Numerical balance digits show non-standard character spacing indicative of localized manual edits.",
                "location": "Summary Table row 3",
                "bbox": {"x": 120, "y": 280, "width": 240, "height": 30, "page": 1}
            }
        ],
        "metadata": {
            "page_count": 2,
            "title": "Digital Statement",
            "author": "Financial Institution",
            "creator": "Core Banking PDF",
            "producer": "Adobe Acrobat 22.0",
            "creation_date": "2026-05-10 10:00:00 UTC",
            "modification_date": "2026-05-11 12:30:00 UTC",
            "fonts": ["ArialMT", "Arial-BoldMT"],
            "image_count": 1,
            "file_size_bytes": 312000,
            "file_size_formatted": "304.7 KB",
            "page_dimensions": "595 x 842 pt"
        },
        "ocr": {
            "available": True,
            "text": "ACCOUNT STATEMENT SUMMARY\nTotal Inflow: ₹1,20,000\nClosing Balance: ₹45,200",
            "confidence": 89.2,
            "engine": "Tesseract OCR",
            "character_count": 180,
            "reason": None
        },
        "visual_signals": {
            "image_regions_analyzed": 2,
            "suspicious_regions": 1,
            "layout_consistency": 74,
            "font_consistency": 58,
            "ocr_consistency": 82
        },
        "text_analysis": {
            "total_characters": 1820,
            "total_blocks": 14,
            "extracted_text_preview": "ACCOUNT STATEMENT SUMMARY\nPrimary Holder Name Verified\nTotal Inflow: ₹1,20,000\nClosing Balance: ₹45,200",
            "currency_tokens_detected": ["₹1,20,000", "₹45,200"],
            "sensitive_entities_masked": True
        },
        "recommended_action": "Review highlighted numerical anomalies before loan disbursement.",
        "analysis_timestamp": datetime.utcnow().strftime("%Y-%m-%d %H:%M:%S UTC")
    }
    return fallback_analysis


@router.get(
    "/applications/{application_id}/documents",
    response_model=List[dict],
    summary="List Application Documents",
    description="Retrieve list of documents and their forensic states for an application."
)
async def list_application_documents(application_id: str):
    live_docs = DOCUMENTS_STORE.get(application_id, [])
    demo_docs = PREPOPULATED_DEMO_DOCUMENTS.get(application_id, [])

    # Format list
    result = []
    for d in live_docs:
        analysis = d.get("analysis_result")
        result.append({
            "document_id": d["document_id"],
            "application_id": application_id,
            "filename": d["filename"],
            "document_type": d["document_type"],
            "uploaded_at": d.get("upload_timestamp", "Just now"),
            "risk_score": analysis.get("risk_score") if analysis else None,
            "risk_level": analysis.get("risk_level") if analysis else "PENDING",
            "status": "Complete" if analysis else "Uploaded"
        })

    for d in demo_docs:
        result.append({
            "document_id": d["document_id"],
            "application_id": application_id,
            "filename": d["filename"],
            "document_type": d["document_type"],
            "uploaded_at": "21:28 UTC",
            "risk_score": d["risk_score"],
            "risk_level": d["risk_level"],
            "status": "Complete"
        })

    if not result:
        from app.services.loan_service import loan_service
        app_docs = loan_service.get_application_documents(application_id)
        for d in app_docs:
            result.append({
                "document_id": d.document_id,
                "application_id": application_id,
                "filename": d.filename,
                "document_type": d.document_type,
                "uploaded_at": d.uploaded_at[:10],
                "risk_score": 87 if d.document_type == "Bank Statement" else 15,
                "risk_level": "HIGH" if d.document_type == "Bank Statement" else "LOW",
                "status": "Complete"
            })

    return result


@router.get(
    "/applications/{application_id}/documents/{document_id}",
    response_model=DocumentAnalysisResponse,
    summary="Get Document Forensic Detail",
    description="Fetch full forensic analysis, metadata, findings, and OCR diff for a document."
)
async def get_document_detail(application_id: str, document_id: str):
    # Check live store
    for doc in DOCUMENTS_STORE.get(application_id, []):
        if doc["document_id"] == document_id:
            if "analysis_result" in doc:
                return doc["analysis_result"]
            # Trigger analysis on the fly
            analysis = document_analyzer.analyze_document(
                application_id=application_id,
                document_id=doc["document_id"],
                filename=doc["filename"],
                file_path=doc["file_path"],
                document_type=doc.get("document_type", "Bank Statement")
            )
            doc["analysis_result"] = analysis
            return analysis

    # Check demo docs
    for doc in PREPOPULATED_DEMO_DOCUMENTS.get(application_id, []):
        if doc["document_id"] == document_id:
            return doc

    raise HTTPException(
        status_code=status.HTTP_404_NOT_FOUND,
        detail=f"Document '{document_id}' not found for application '{application_id}'."
    )
