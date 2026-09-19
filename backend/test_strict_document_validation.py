"""
TrustLedger - Strict Document Acceptance Test Suite
Verifies:
1. Rejection of PPT / PPTX files (with explicit UNSUPPORTED_FILE_TYPE).
2. Detection of renamed PPTX (ZIP container containing ppt/ files) disguised as .pdf.
3. Detection of legacy Office OLE2 files disguised as .pdf.
4. Enforcing 10 MB maximum file size limit.
5. Rejection of mismatched categories (e.g., Bank statement uploaded to KYC field).
6. Acceptance of valid KYC documents (PDF/PNG with identity markers).
7. Acceptance of valid Bank statements (PDF with financial tokens).
8. Acceptance of valid Drone documents (DGCA UIN, insurance, invoice).
"""

import sys
import io
import zipfile
from pathlib import Path

# Add backend to sys.path
sys.path.insert(0, str(Path(__file__).parent))

from app.services.strict_document_validator import strict_document_validator


def create_mock_pptx_bytes() -> bytes:
    """Creates a minimal in-memory zip file structured like a PPTX presentation."""
    buffer = io.BytesIO()
    with zipfile.ZipFile(buffer, "w", zipfile.ZIP_DEFLATED) as zf:
        zf.writestr("[Content_Types].xml", '<Types><Default Extension="xml" ContentType="application/vnd.openxmlformats-officedocument.presentationml.presentation"/></Types>')
        zf.writestr("ppt/presentation.xml", "<p:presentation></p:presentation>")
        zf.writestr("ppt/slides/slide1.xml", "<p:sld></p:sld>")
    return buffer.getvalue()


def create_mock_pdf_bytes(text_content: str) -> bytes:
    """Creates a valid PDF binary with embedded text stream."""
    stream_content = f"BT /F1 12 Tf 50 700 Td ({text_content}) Tj ET"
    stream_len = len(stream_content)
    pdf_template = (
        f"%PDF-1.4\n"
        f"1 0 obj << /Type /Catalog /Pages 2 0 R >> endobj\n"
        f"2 0 obj << /Type /Pages /Kids [3 0 R] /Count 1 >> endobj\n"
        f"3 0 obj << /Type /Page /Parent 2 0 R /MediaBox [0 0 612 792] /Contents 4 0 R /Resources << /Font << /F1 << /Type /Font /Subtype /Type1 /BaseFont /Helvetica >> >> >> >> endobj\n"
        f"4 0 obj << /Length {stream_len} >> stream\n"
        f"{stream_content}\n"
        f"endstream\nendobj\n"
        f"xref\n0 5\n0000000000 65535 f \n0000000009 00000 n \n0000000058 00000 n \n0000000115 00000 n \n0000000300 00000 n \n"
        f"trailer << /Size 5 /Root 1 0 R >>\nstartxref\n450\n%%EOF"
    )
    return pdf_template.encode("latin1")


def test_strict_document_validation():
    print("================================================================")
    print("TRUSTLEDGER - STRICT DOCUMENT VALIDATOR TEST SUITE")
    print("================================================================")

    # Test 1: Direct PPT extension rejection
    print("\n[TEST 1] Uploading .pptx file directly...")
    res = strict_document_validator.validate_file_security_and_type(
        filename="financial_pitch.pptx",
        content=b"dummy content",
        expected_category="BANK_STATEMENT"
    )
    assert not res["valid"], "Failed: PPTX file was not rejected!"
    assert res["error_code"] == "UNSUPPORTED_FILE_TYPE", f"Wrong error code: {res['error_code']}"
    print(f" PASS: Correctly rejected with code '{res['error_code']}': {res['error']}")

    # Test 2: Renamed PPTX disguised as .pdf
    print("\n[TEST 2] Renamed PPTX file disguised as .pdf (bypass attempt)...")
    pptx_bytes = create_mock_pptx_bytes()
    res = strict_document_validator.validate_file_security_and_type(
        filename="bank_statement_april.pdf",
        content=pptx_bytes,
        expected_category="BANK_STATEMENT"
    )
    assert not res["valid"], "Failed: Disguised PPTX was not rejected!"
    assert res["error_code"] == "UNSUPPORTED_FILE_TYPE", f"Wrong error code: {res['error_code']}"
    print(f" PASS: Detected spoofed PPTX container: {res['error']}")

    # Test 3: Legacy OLE2 PPT disguised as .pdf
    print("\n[TEST 3] Legacy MS Office OLE2 file disguised as .pdf...")
    ole2_bytes = b"\xd0\xcf\x11\xe0\xa1\xb1\x1a\xe1" + b"\x00" * 200
    res = strict_document_validator.validate_file_security_and_type(
        filename="salary_slip.pdf",
        content=ole2_bytes,
        expected_category="INCOME_PROOF"
    )
    assert not res["valid"], "Failed: Legacy Office file was not rejected!"
    assert res["error_code"] == "UNSUPPORTED_FILE_TYPE", f"Wrong error code: {res['error_code']}"
    print(f" PASS: Detected legacy OLE2 document signature: {res['error']}")

    # Test 4: File exceeding 10MB limit
    print("\n[TEST 4] File exceeding 10 MB limit (11 MB dummy PDF)...")
    large_content = b"%PDF-1.4\n" + (b"0" * (11 * 1024 * 1024))
    res = strict_document_validator.validate_file_security_and_type(
        filename="large_document.pdf",
        content=large_content,
        expected_category="KYC_IDENTITY"
    )
    assert not res["valid"], "Failed: Large file (>10MB) was not rejected!"
    assert res["error_code"] == "FILE_TOO_LARGE", f"Wrong error code: {res['error_code']}"
    print(f" PASS: Correctly rejected large file: {res['error']}")

    # Test 5: Category Mismatch - Bank statement uploaded into KYC field
    print("\n[TEST 5] Category mismatch (Bank Statement uploaded to KYC_IDENTITY field)...")
    bank_text = "HDFC Bank Statement Account summary Closing Balance Opening Balance credit/debit transaction date withdrawal amount cheque number"
    bank_pdf = create_mock_pdf_bytes(bank_text)
    res = strict_document_validator.validate_file_security_and_type(
        filename="statement.pdf",
        content=bank_pdf,
        expected_category="KYC_IDENTITY"
    )
    assert not res["valid"], "Failed: Bank statement was accepted as KYC identity!"
    assert res["error_code"] == "WRONG_DOCUMENT_CATEGORY", f"Wrong error code: {res['error_code']}"
    print(f" PASS: Detected category mismatch: {res['error']}")

    # Test 6: Valid KYC Identity Document (Aadhaar / PAN markers)
    print("\n[TEST 6] Valid KYC Identity Document (Government of India Aadhaar markers)...")
    kyc_text = "Government of India Unique Identification Authority of India UIDAI Aadhaar DOB 15-08-1992 Male"
    kyc_pdf = create_mock_pdf_bytes(kyc_text)
    res = strict_document_validator.validate_file_security_and_type(
        filename="aadhaar_card.pdf",
        content=kyc_pdf,
        expected_category="KYC_IDENTITY"
    )
    assert res["valid"], f"Failed: Valid KYC document was rejected! Error: {res.get('error')}"
    print(f" PASS: Successfully validated KYC document (Confidence: {res.get('category_confidence')})")

    # Test 7: Valid Bank Statement Document
    print("\n[TEST 7] Valid Bank Statement (HDFC Bank statement tokens)...")
    bank_valid_text = "State Bank of India Savings Account Statement IFSC SBIN0001234 Closing Balance INR 85400 Credit Debit UPI Transaction"
    bank_valid_pdf = create_mock_pdf_bytes(bank_valid_text)
    res = strict_document_validator.validate_file_security_and_type(
        filename="sbi_statement.pdf",
        content=bank_valid_pdf,
        expected_category="BANK_STATEMENT"
    )
    assert res["valid"], f"Failed: Valid bank statement was rejected! Error: {res.get('error')}"
    print(f" PASS: Successfully validated Bank Statement (Confidence: {res.get('category_confidence')})")

    # Test 8: Valid Drone Commercial Document (DGCA UIN / Drone Insurance)
    print("\n[TEST 8] Valid Drone Document (DGCA Digital Sky UIN & Insurance)...")
    drone_text = "Directorate General of Civil Aviation DGCA Digital Sky Drone UIN Remote Pilot Certificate UAS Serial Number Unmanned Aircraft"
    drone_pdf = create_mock_pdf_bytes(drone_text)
    res = strict_document_validator.validate_file_security_and_type(
        filename="dgca_drone_uin_certificate.pdf",
        content=drone_pdf,
        expected_category="DRONE_DOCUMENT"
    )
    assert res["valid"], f"Failed: Valid Drone document was rejected! Error: {res.get('error')}"
    print(f" PASS: Successfully validated Drone Document (Confidence: {res.get('category_confidence')})")

    print("\n================================================================")
    print("ALL STRICT DOCUMENT ACCEPTANCE TESTS PASSED (8/8)!")
    print("================================================================")


if __name__ == "__main__":
    test_strict_document_validation()
