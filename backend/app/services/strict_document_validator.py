"""
TrustLedger Strict Document Security & Validation Engine
Enforces strict acceptance criteria across digital lending uploads:
1. File Type Whitelisting (Only PDF, PNG, JPG, JPEG allowed)
2. Immediate Rejection of PPT, PPTX, DOC, DOCX, XLS, XLSX, ZIP, RAR, EXE
3. File Signature / Magic Bytes Inspection to block rename-spoofing (e.g. .pptx renamed to .pdf)
4. Strict 10 MB maximum file size limit
5. Content-Level Category Validation (KYC, Bank Statement, Drone Documents) with explainable rejections
"""

import io
import re
import zipfile
from typing import Dict, Any, Optional, Tuple, List
from pathlib import Path

# Safe imports for extraction
try:
    import pymupdf as fitz
    PYMUPDF_AVAILABLE = True
except ImportError:
    try:
        import fitz
        PYMUPDF_AVAILABLE = True
    except ImportError:
        fitz = None
        PYMUPDF_AVAILABLE = False

try:
    from PIL import Image
    PILLOW_AVAILABLE = True
except ImportError:
    Image = None
    PILLOW_AVAILABLE = False

try:
    import pytesseract
    PYTESSERACT_AVAILABLE = True
except ImportError:
    pytesseract = None
    PYTESSERACT_AVAILABLE = False

# Maximum allowed file size: 10 MB
MAX_FILE_SIZE_BYTES = 10 * 1024 * 1024

# Strictly accepted extensions
ALLOWED_EXTENSIONS = {".pdf", ".png", ".jpg", ".jpeg"}

# Known disallowed extensions that must be rejected with helpful context
DISALLOWED_EXTENSIONS = {
    ".ppt", ".pptx", ".doc", ".docx", ".xls", ".xlsx", ".csv",
    ".zip", ".rar", ".7z", ".tar", ".gz", ".exe", ".bat", ".cmd",
    ".sh", ".txt", ".rtf", ".html", ".xml", ".mp4", ".mov", ".avi",
    ".mp3", ".wav", ".key", ".odp", ".ods", ".odt"
}

# Magic bytes definitions
MAGIC_PDF = b"%PDF-"
MAGIC_PNG = b"\x89PNG\r\n\x1a\n"
MAGIC_JPEG = b"\xff\xd8\xff"
MAGIC_ZIP_PK = b"PK\x03\x04"
MAGIC_OLE2 = b"\xd0\xcf\x11\xe0\xa1\xb1\x1a\xe1"  # Legacy MS Office (PPT, DOC, XLS)

# Category Token Sets
CATEGORY_TOKENS = {
    "KYC_IDENTITY": {
        "positive": [
            "aadhaar", "uidai", "pan", "income tax", "permanent account",
            "passport", "republic of india", "election commission", "epic",
            "driving licence", "driving license", "government of india",
            "govt of india", "father", "dob", "date of birth", "yob",
            "gender", "male", "female", "enrolment", "identity", "e-aadhaar",
            "bharat sarkar", "tax payer"
        ],
        "negative": [
            "bank statement", "transaction date", "closing balance", "opening balance",
            "credit/debit", "withdrawal amount", "deposit amount", "cheque number",
            "account summary", "monthly statement", "credit card statement"
        ],
        "label": "Government KYC Identity Document (Aadhaar, PAN, Passport, Driving License)"
    },
    "BANK_STATEMENT": {
        "positive": [
            "statement", "bank", "account", "balance", "credit", "debit", "ifsc",
            "transaction", "closing", "withdrawal", "deposit", "ledger", "branch",
            "cheque", "inr", "cr", "dr", "rtgs", "neft", "upi", "imps",
            "current account", "savings account", "account number", "narration"
        ],
        "negative": [
            "course completion", "certificate of participation", "degree", "diploma",
            "marksheet", "curriculum vitae", "resume", "syllabus", "powerpoint",
            "slide 1", "presentation outline", "project proposal"
        ],
        "label": "Bank Statement / Financial Account Ledger"
    },
    "DRONE_DOCUMENT": {
        "positive": [
            "drone", "uav", "uas", "dgca", "digital sky", "digitalsky", "uin",
            "dan", "remote pilot", "drone insurance", "serial number",
            "unmanned aircraft", "directorate general of civil aviation",
            "flight log", "drone purchase", "aviation", "payload", "propeller",
            "all-up weight", "drone registration", "pilot license", "rpas",
            "type certificate", "drone operator", "drone manufacturer"
        ],
        "negative": [],
        "label": "DGCA Drone UIN Registration, Drone Insurance, or Aviation Equipment Invoice"
    },
    "INCOME_PROOF": {
        "positive": [
            "salary", "payslip", "pay slip", "earnings", "deductions", "net pay",
            "gross", "employer", "ctc", "allowance", "provident fund", "pf",
            "basic salary", "form 16", "itr", "income tax return", "acknowledgement"
        ],
        "negative": [],
        "label": "Income Proof / Salary Payslip / ITR"
    },
    "ADDRESS_PROOF": {
        "positive": [
            "electricity", "gas bill", "water bill", "telecom", "broadband",
            "utility", "consumer no", "meter number", "bill amount", "due date",
            "property tax", "rent agreement", "registered address"
        ],
        "negative": [],
        "label": "Proof of Address (Utility Bill / Rent Agreement)"
    }
}


class StrictDocumentValidator:
    """Enterprise-grade document security and category validation engine."""

    @staticmethod
    def validate_file_security_and_type(
        filename: str,
        content: bytes,
        expected_category: Optional[str] = None
    ) -> Dict[str, Any]:
        """
        Executes strict multi-tier verification:
        Tier 1: Extension blacklist & whitelist check
        Tier 2: Size boundary check (10MB max, minimum 32 bytes)
        Tier 3: Magic bytes / file signature & rename-spoofing check
        Tier 4: Deep office archive detection (PPTX / Office in ZIP disguise)
        Tier 5: Content-level category verification (token matching & negative indicators)
        """
        fn_clean = (filename or "").strip()
        ext = Path(fn_clean).suffix.lower()

        # -------------------------------------------------------------
        # Tier 1: Extension Blacklist & Whitelist Check
        # -------------------------------------------------------------
        if ext in DISALLOWED_EXTENSIONS:
            if ext in {".ppt", ".pptx", ".key", ".odp"}:
                return {
                    "valid": False,
                    "error_code": "UNSUPPORTED_FILE_TYPE",
                    "error": (
                        f"Presentation files ({ext}) are strictly not accepted. "
                        "Please upload the requested KYC, bank statement, or drone-related document in PDF, JPG, or PNG format."
                    ),
                    "details": f"Disallowed file extension '{ext}' detected."
                }
            return {
                "valid": False,
                "error_code": "UNSUPPORTED_FILE_TYPE",
                "error": (
                    f"File type '{ext}' is not supported. Only PDF, JPG, JPEG, and PNG documents are accepted. "
                    "PPT, DOC, XLS, and ZIP files are strictly rejected."
                ),
                "details": f"Disallowed file extension '{ext}'."
            }

        if ext not in ALLOWED_EXTENSIONS:
            return {
                "valid": False,
                "error_code": "UNSUPPORTED_FILE_TYPE",
                "error": (
                    "This file type is not supported. Please upload an authentic PDF, JPG, or PNG document. "
                    "PPT, Word, Excel, and archive files are strictly rejected."
                ),
                "details": f"Unrecognized extension '{ext}'."
            }

        # -------------------------------------------------------------
        # Tier 2: Size Boundary Check
        # -------------------------------------------------------------
        size_bytes = len(content)
        if size_bytes == 0:
            return {
                "valid": False,
                "error_code": "EMPTY_FILE",
                "error": "The uploaded file is empty (0 bytes). Please select a valid document.",
                "details": "File size is 0 bytes."
            }

        if size_bytes < 32:
            return {
                "valid": False,
                "error_code": "CORRUPTED_FILE",
                "error": "The uploaded file is corrupt or incomplete. Please upload an authentic document.",
                "details": f"File size too small ({size_bytes} bytes)."
            }

        if size_bytes > MAX_FILE_SIZE_BYTES:
            mb = size_bytes / (1024 * 1024)
            return {
                "valid": False,
                "error_code": "FILE_TOO_LARGE",
                "error": f"File size ({mb:.1f} MB) exceeds the 10 MB limit. Please compress or resize the document and try again.",
                "details": f"Exceeded max size: {size_bytes} > {MAX_FILE_SIZE_BYTES} bytes."
            }

        # -------------------------------------------------------------
        # Tier 3: Magic Bytes / File Signature Check
        # -------------------------------------------------------------
        header = content[:1024]

        # Check for Legacy MS Office OLE2 header (e.g. .ppt, .doc, .xls renamed to .pdf)
        if header.startswith(MAGIC_OLE2):
            return {
                "valid": False,
                "error_code": "UNSUPPORTED_FILE_TYPE",
                "error": (
                    "Legacy Microsoft Office document detected. PPT, DOC, and XLS files are strictly not accepted, "
                    "even if renamed to .pdf. Please upload an authentic PDF or image."
                ),
                "details": "Detected OLE2 compound document signature in file header."
            }

        # Check for ZIP / Office OpenXML structure (e.g. .pptx, .docx, .xlsx, .zip renamed to .pdf/.png)
        if header.startswith(MAGIC_ZIP_PK):
            # Check if this zip is actually an Office presentation or archive
            is_pptx, office_desc = StrictDocumentValidator._inspect_zip_container(content)
            if is_pptx:
                return {
                    "valid": False,
                    "error_code": "UNSUPPORTED_FILE_TYPE",
                    "error": (
                        f"Presentation file detected ({office_desc}). PowerPoint and presentation files are strictly "
                        "not accepted. Please upload an authentic PDF or image."
                    ),
                    "details": "Detected PPTX/PowerPoint OpenXML package inside ZIP container."
                }
            elif office_desc:
                return {
                    "valid": False,
                    "error_code": "UNSUPPORTED_FILE_TYPE",
                    "error": (
                        f"Office / Archive file detected ({office_desc}). Word, Excel, and Zip files are strictly "
                        "not accepted. Please upload an authentic PDF or image."
                    ),
                    "details": f"Detected {office_desc} inside ZIP container."
                }
            else:
                return {
                    "valid": False,
                    "error_code": "SIGNATURE_MISMATCH",
                    "error": "Archive/Zip files are strictly not accepted. Please upload an authentic PDF, JPG, or PNG document.",
                    "details": "Detected ZIP container signature for non-archive extension."
                }

        # Verify declared extension matches true magic byte signature
        detected_mime = None
        if ext == ".pdf":
            # PDF magic bytes can occur anywhere within first 1024 bytes (standard ISO 32000-1)
            if MAGIC_PDF not in header:
                return {
                    "valid": False,
                    "error_code": "SIGNATURE_MISMATCH",
                    "error": (
                        "File content does not match PDF format. Renamed files (such as PPT or Office files renamed to .pdf) "
                        "are strictly rejected. Please upload an authentic PDF document."
                    ),
                    "details": "Missing %PDF- header in first 1024 bytes."
                }
            detected_mime = "application/pdf"

        elif ext == ".png":
            if not header.startswith(MAGIC_PNG):
                return {
                    "valid": False,
                    "error_code": "SIGNATURE_MISMATCH",
                    "error": (
                        "File content does not match PNG format. Renamed files are strictly rejected. "
                        "Please upload an authentic PNG image."
                    ),
                    "details": "Missing PNG 8-byte signature."
                }
            detected_mime = "image/png"

        elif ext in {".jpg", ".jpeg"}:
            if not header.startswith(MAGIC_JPEG):
                return {
                    "valid": False,
                    "error_code": "SIGNATURE_MISMATCH",
                    "error": (
                        "File content does not match JPEG format. Renamed files are strictly rejected. "
                        "Please upload an authentic JPEG image."
                    ),
                    "details": "Missing JPEG SOI 0xFFD8FF marker."
                }
            detected_mime = "image/jpeg"

        # -------------------------------------------------------------
        # Tier 4: Content Parsing & Text Extraction
        # -------------------------------------------------------------
        extracted_text = StrictDocumentValidator._extract_text(content, ext)

        # -------------------------------------------------------------
        # Tier 5: Category-Specific Validation
        # -------------------------------------------------------------
        category_result = StrictDocumentValidator._validate_category_content(
            extracted_text=extracted_text,
            category=expected_category,
            content=content,
            ext=ext
        )

        if not category_result["valid"]:
            return {
                "valid": False,
                "error_code": category_result.get("error_code", "CATEGORY_MISMATCH"),
                "error": category_result["error"],
                "details": category_result.get("details", "")
            }

        return {
            "valid": True,
            "detected_mime": detected_mime,
            "size_bytes": size_bytes,
            "extracted_text_preview": (extracted_text[:200] + "...") if extracted_text else "",
            "category_verified": expected_category,
            "category_confidence": category_result.get("confidence", "HIGH"),
            "category_notes": category_result.get("notes", "Document matches category requirements.")
        }

    @staticmethod
    def _inspect_zip_container(content: bytes) -> Tuple[bool, Optional[str]]:
        """
        Inspects an apparent ZIP file to determine if it is an Office OpenXML presentation
        (.pptx), document (.docx), or spreadsheet (.xlsx).
        """
        try:
            with zipfile.ZipFile(io.BytesIO(content)) as zf:
                namelist = [name.lower() for name in zf.namelist()]
                # PowerPoint indicators
                if any(n.startswith("ppt/") for n in namelist):
                    return True, "PowerPoint Presentation (.pptx)"
                if any("powerpoint" in n or "presentation" in n for n in namelist):
                    return True, "PowerPoint Presentation (.pptx)"

                # Word indicators
                if any(n.startswith("word/") for n in namelist):
                    return False, "Word Document (.docx)"

                # Excel indicators
                if any(n.startswith("xl/") for n in namelist):
                    return False, "Excel Spreadsheet (.xlsx)"

                # Check [Content_Types].xml for MIME signatures
                if "[content_types].xml" in namelist:
                    try:
                        ct_content = zf.read("[Content_Types].xml").decode("utf-8", errors="ignore").lower()
                        if "presentationml" in ct_content or "powerpoint" in ct_content:
                            return True, "PowerPoint OpenXML Presentation"
                        if "wordprocessingml" in ct_content:
                            return False, "Word OpenXML Document"
                        if "spreadsheetml" in ct_content:
                            return False, "Excel OpenXML Spreadsheet"
                    except Exception:
                        pass

                return False, "Zip Archive"
        except Exception:
            return False, None

    @staticmethod
    def _extract_text(content: bytes, ext: str) -> str:
        """Extracts text from PDF or Image using PyMuPDF and OCR."""
        text = ""
        if ext == ".pdf":
            if PYMUPDF_AVAILABLE and fitz is not None:
                try:
                    doc = fitz.open(stream=content, filetype="pdf")
                    # Extract from first 3 pages
                    for page_idx in range(min(3, len(doc))):
                        page = doc[page_idx]
                        page_text = page.get_text()
                        if page_text:
                            text += " " + page_text
                    doc.close()
                except Exception:
                    pass
        elif ext in {".png", ".jpg", ".jpeg"}:
            if PILLOW_AVAILABLE and PYTESSERACT_AVAILABLE and pytesseract is not None:
                try:
                    img = Image.open(io.BytesIO(content))
                    # Quick downscale for fast OCR if large
                    if img.width > 1600 or img.height > 1600:
                        img.thumbnail((1600, 1600))
                    text = pytesseract.image_to_string(img, timeout=4)
                except Exception:
                    pass

        return text.strip()

    @staticmethod
    def _validate_category_content(
        extracted_text: str,
        category: Optional[str],
        content: bytes,
        ext: str
    ) -> Dict[str, Any]:
        """
        Evaluates extracted text against expected category tokens and negative indicators.
        If minimal text was extracted (e.g. scanned image with no OCR available),
        heuristic fallbacks are applied safely without falsely failing genuine scanned files.
        """
        if not category:
            return {"valid": True, "confidence": "NEUTRAL", "notes": "No specific category requested."}

        category_key = category.upper().strip().replace(" ", "_").replace("-", "_")
        # Normalization of common aliases
        if category_key in {"KYC", "IDENTITY", "IDENTITY_PROOF", "KYC_IDENTITY", "AADHAAR", "PAN", "PASSPORT"}:
            category_key = "KYC_IDENTITY"
        elif category_key in {"BANK", "STATEMENT", "BANK_STATEMENT", "FINANCIAL_STATEMENT"}:
            category_key = "BANK_STATEMENT"
        elif category_key in {"DRONE", "DRONE_DOCUMENT", "DGCA", "UIN", "UAV", "DRONE_REGISTRATION", "DRONE_INSURANCE"}:
            category_key = "DRONE_DOCUMENT"
        elif category_key in {"INCOME", "SALARY", "PAYSLIP", "INCOME_PROOF"}:
            category_key = "INCOME_PROOF"
        elif category_key in {"ADDRESS", "UTILITY", "ADDRESS_PROOF"}:
            category_key = "ADDRESS_PROOF"

        tokens_cfg = CATEGORY_TOKENS.get(category_key)
        if not tokens_cfg:
            return {"valid": True, "confidence": "NEUTRAL", "notes": f"Category {category_key} has no token rules."}

        text_lower = extracted_text.lower() if extracted_text else ""

        # Check for presentation/slides keywords even if in PDF form (e.g. exported PPT to PDF)
        presentation_tokens = ["presentation title", "agenda slide", "click to add title", "slide 1 of", "powerpoint"]
        presentation_hits = sum(1 for tok in presentation_tokens if tok in text_lower)
        if presentation_hits >= 2:
            return {
                "valid": False,
                "error_code": "UNSUPPORTED_FILE_TYPE",
                "error": (
                    "Presentation slides detected in document content. Presentation slide decks are strictly rejected. "
                    "Please upload the required loan or identity documentation."
                ),
                "details": "Found PowerPoint/Slide export markers in extracted PDF text."
            }

        # If we have substantial extracted text (>= 30 characters)
        if len(text_lower) >= 30:
            pos_matches = [tok for tok in tokens_cfg["positive"] if tok in text_lower]
            neg_matches = [tok for tok in tokens_cfg.get("negative", []) if tok in text_lower]

            # Specific rules for KYC_IDENTITY
            if category_key == "KYC_IDENTITY":
                # If it has heavy bank statement tokens and zero identity tokens
                if len(neg_matches) >= 3 and len(pos_matches) == 0:
                    return {
                        "valid": False,
                        "error_code": "WRONG_DOCUMENT_CATEGORY",
                        "error": (
                            "The uploaded file appears to be a Bank Statement or transaction summary, "
                            "not a government identity document. Please upload your Aadhaar, PAN, Passport, or Driving License."
                        ),
                        "details": f"Found negative tokens {neg_matches} and no identity tokens."
                    }

            # Specific rules for BANK_STATEMENT
            elif category_key == "BANK_STATEMENT":
                # If it has negative tokens (e.g. course certificate, resume) and 0 bank tokens
                if len(neg_matches) >= 2 and len(pos_matches) == 0:
                    return {
                        "valid": False,
                        "error_code": "WRONG_DOCUMENT_CATEGORY",
                        "error": (
                            "The uploaded document appears to be an academic certificate, resume, or unrelated document. "
                            "Please upload an authentic Bank Account Statement showing your name, account number, and transactions."
                        ),
                        "details": f"Found negative tokens {neg_matches} and no banking tokens."
                    }
                # If there's plenty of text (> 100 chars) but literally ZERO banking terms
                if len(text_lower) > 200 and len(pos_matches) == 0:
                    return {
                        "valid": False,
                        "error_code": "WRONG_DOCUMENT_CATEGORY",
                        "error": (
                            "The document does not contain banking transaction records or account summary details. "
                            "Please upload an authentic Bank Statement."
                        ),
                        "details": "Zero banking tokens found in document text."
                    }

            # Specific rules for DRONE_DOCUMENT
            elif category_key == "DRONE_DOCUMENT":
                if len(text_lower) > 200 and len(pos_matches) == 0:
                    return {
                        "valid": False,
                        "error_code": "WRONG_DOCUMENT_CATEGORY",
                        "error": (
                            "The uploaded document does not appear to be a DGCA Drone Registration (UIN), Drone Insurance policy, "
                            "or Drone Equipment Invoice. Please upload a valid drone certification or purchase invoice."
                        ),
                        "details": "Zero drone/aviation tokens found in document text."
                    }

            return {
                "valid": True,
                "confidence": "HIGH" if len(pos_matches) >= 2 else "MEDIUM",
                "notes": f"Matched tokens: {pos_matches[:5]}"
            }

        # If scanned image / unextractable text, we allow it through as MEDIUM confidence for human underwriter review
        return {
            "valid": True,
            "confidence": "LOW_OCR_DEFERRED_TO_UNDERWRITER",
            "notes": "Scanned document text is optical/visual. Passed security checks for underwriter review."
        }


# Global singleton instance
strict_document_validator = StrictDocumentValidator()
