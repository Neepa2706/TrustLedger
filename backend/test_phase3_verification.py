"""
Test suite for Phase 3:
1. Document Cross-Comparison
2. KYC Verification
3. Final Verification Status
4. Declaration Consent
5. Application Submission
6. Audit Trail with SHA-256 Hash Chaining
7. Tenant Isolation (IDOR Protection)
"""

import sys
from pathlib import Path
from app.models.loan_application import LoanApplicationCreate, ApplicationSubmitRequest
from app.services.loan_service import loan_service
from app.api.routes.user_profile import PROFILES_STORE, DOCUMENTS_STORE, PHOTOS_STORE

def run_tests():
    print("=== TrustLedger Phase 3 Test Suite ===")
    user_a = "usr_borrower_alice"
    user_b = "usr_borrower_bob"

    # Setup profile for Alice
    PROFILES_STORE[user_a] = {
        "profile_id": "prof_alice",
        "user_id": user_a,
        "full_name": "Alice Sharma",
        "date_of_birth": "1994-08-22",
        "gender": "Female",
        "mobile": "9811223344",
        "email": "alice@example.in",
        "address": "42 Cyber City",
        "city": "Gurugram",
        "state": "Haryana",
        "pincode": "122002",
        "monthly_income": "90,000",
        "aadhaar_masked": "XXXX XXXX 7890",
        "pan_masked": "AL•••••7890",
        "verification_status": "VERIFIED"
    }

    # Setup profile photo for Alice
    PHOTOS_STORE[user_a] = {
        "photo_id": "pho_alice",
        "user_id": user_a,
        "filename": "pho_alice.jpg",
        "is_live_capture": True,
        "face_detected": True,
        "single_face": True,
        "blur_score": 85.0,
        "brightness_score": 130.0,
        "status": "CAPTURED"
    }

    # Setup pre-verified Aadhaar for Alice
    DOCUMENTS_STORE[user_a] = [
        {
            "document_id": "doc_alice_aadhaar",
            "filename": "Aadhaar_Alice_Verified.pdf",
            "file_type": "PDF",
            "file_size_bytes": 102400,
            "quality_status": "GOOD",
            "quality_message": "Pre-verified from profile."
        }
    ]

    # 1. Create Application for Alice
    app = loan_service.create_application(
        user_id=user_a,
        create_data=LoanApplicationCreate(
            loan_product_id="emergency-loan",
            requested_amount=50000,
            requested_duration_months=12,
            loan_purpose="Urgent Medical Bill"
        )
    )
    app_id = app.application_id
    print(f"1. Application created: {app_id}")
    assert app.application_status == "DRAFT"

    # Fill disbursement bank details
    from app.models.loan_application import LoanApplicationUpdate, LoanFinancialDetails
    loan_service.update_application(
        application_id=app_id,
        user_id=user_a,
        update_data=LoanApplicationUpdate(
            financial_details=LoanFinancialDetails(
                monthly_income="90,000",
                payout_bank_name="HDFC Bank",
                payout_account_number="9876543210984821",
                payout_ifsc_code="HDFC0001234"
            )
        )
    )

    # 2. Upload missing required documents (Address proof, Income proof)
    loan_service.add_document(
        application_id=app_id,
        user_id=user_a,
        document_type="Address Proof",
        filename="Electricity_Bill_Gurugram.pdf",
        content=b"%PDF-1.4 demo address proof Alice Sharma 42 Cyber City"
    )
    loan_service.add_document(
        application_id=app_id,
        user_id=user_a,
        document_type="Income Proof",
        filename="Salary_Slip_Alice_Infosys.pdf",
        content=b"%PDF-1.4 demo salary payslip Alice Sharma gross earnings 90000"
    )
    print("2. Uploaded supporting documents successfully.")

    # 3. Test Document Cross-Comparison
    comparisons = loan_service.compare_application_documents(app_id, user_a)
    print(f"3. Run document cross-comparisons: {len(comparisons)} documents evaluated.")
    for c in comparisons:
        print(f"   - {c.document_type} ({c.status}): {c.message}")
        assert c.status in ["MATCH", "REVIEW"]

    # 4. Test KYC Verification
    kyc_res = loan_service.run_application_kyc(app_id, user_a)
    print(f"4. KYC Verification result: overall_status={kyc_res.overall_status}, can_submit={kyc_res.can_submit}")
    assert kyc_res.can_submit is True

    # 5. Test Final Verification Status
    verif = loan_service.get_final_verification_status(app_id, user_a)
    print(f"5. Final verification gate: can_submit={verif.can_submit}, blocking_errors={verif.blocking_reasons}")
    assert verif.can_submit is True
    assert len(verif.blocking_reasons) == 0

    # 6. Test IDOR Protection: User B tries to view or submit User A's application
    res_b = loan_service.get_application_by_id(app_id, user_b)
    assert res_b is None, "User B was able to view User A's application!"
    print("6. IDOR Protection Verified: User B view denied (returned None).")

    try:
        loan_service.submit_application(
            application_id=app_id,
            user_id=user_b,
            submit_req=ApplicationSubmitRequest(borrower_declaration_confirmed=True)
        )
        print("FAIL: User B was able to submit User A's application!")
        sys.exit(1)
    except PermissionError:
        print("   IDOR Protection Verified: User B submission strictly denied with PermissionError.")

    # 7. Test Declaration Rejection (User tries to submit without checking declaration)
    try:
        loan_service.submit_application(
            application_id=app_id,
            user_id=user_a,
            submit_req=ApplicationSubmitRequest(borrower_declaration_confirmed=False)
        )
        print("FAIL: Submission succeeded without declaration!")
        sys.exit(1)
    except ValueError as e:
        print(f"7. Declaration Gate Verified: {str(e)}")

    # 8. Test Successful Submission
    sub_res = loan_service.submit_application(
        application_id=app_id,
        user_id=user_a,
        submit_req=ApplicationSubmitRequest(
            borrower_declaration_confirmed=True,
            declaration_text="I confirm that the information and documents provided in this application are true and belong to me."
        )
    )
    print(f"8. Submission Success: status={sub_res.application_status}, step={sub_res.current_step}")
    assert sub_res.application_status == "SUBMITTED"

    # 9. Test Audit Trail
    events = loan_service.get_audit_trail(app_id, user_a)
    print(f"9. Audit Trail contains {len(events)} events with SHA-256 hash chaining:")
    for e in events:
        safe_summary = e.event_summary.replace("₹", "INR ")
        print(f"   [{e.event_type}] {safe_summary} (hash: {e.event_hash[:12]}...)")
    assert len(events) >= 5

    print("\nALL PHASE 3 BACKEND TESTS PASSED!")

if __name__ == "__main__":
    run_tests()
