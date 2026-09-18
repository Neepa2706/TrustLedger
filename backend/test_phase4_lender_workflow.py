"""
Test Suite for TrustLedger Phase 4:
Lender Verification, Application Review, Approval Workflow & Borrower Status Synchronization
Using Python standard library urllib.request against live server http://127.0.0.1:8000
"""

import urllib.request
import urllib.parse
import urllib.error
import json

BASE_URL = "http://127.0.0.1:8000"

def request(method, path, body=None, headers=None):
    url = f"{BASE_URL}{path}"
    data = json.dumps(body).encode("utf-8") if body is not None else None
    h = {"Content-Type": "application/json", "Accept": "application/json"}
    if headers:
        h.update(headers)
    req = urllib.request.Request(url, data=data, headers=h, method=method)
    try:
        with urllib.request.urlopen(req) as resp:
            return resp.status, json.loads(resp.read().decode("utf-8"))
    except urllib.error.HTTPError as e:
        return e.code, json.loads(e.read().decode("utf-8"))

def test_phase4_end_to_end_workflow():
    print("=== Testing TrustLedger Phase 4 End-to-End Workflow ===")

    # 1. Test Lender Applications Queue listing
    status, apps = request("GET", "/lender/applications")
    assert status == 200, f"Expected 200, got {status}: {apps}"
    assert len(apps) >= 1, "Expected at least 1 application in queue."
    print(f"1. GET /lender/applications -> {status}, Found {len(apps)} applications in queue.")
    
    # Verify TL-APP-10001 (Arjun Kumar) is present
    arjun_app = next((a for a in apps if a["id"] == "TL-APP-10001"), None)
    assert arjun_app is not None, "TL-APP-10001 must be present in lender queue."
    assert arjun_app["applicant"] == "Arjun Kumar"
    assert arjun_app["loanProduct"] == "Personal Loan"
    assert arjun_app["riskScore"] == 68
    assert arjun_app["documentStatus"] == "Review"
    assert arjun_app["kycStatus"] == "Verified"
    assert arjun_app["networkStatus"] == "Connected"
    assert arjun_app["integrityStatus"] == "Verified"
    print("   [OK] TL-APP-10001 verified in lender queue with 5-pillar signals.")

    # 2. Test Detailed Investigation Dossier for TL-APP-10001
    status, dossier = request("GET", "/lender/applications/TL-APP-10001")
    assert status == 200, f"Expected 200, got {status}: {dossier}"
    assert dossier["id"] == "TL-APP-10001"
    assert dossier["applicant"] == "Arjun Kumar"
    assert dossier["riskBreakdown"]["documentForensics"]["status"] == "Review"
    assert dossier["riskBreakdown"]["kycAnalysis"]["status"] == "Verified"
    assert dossier["riskBreakdown"]["fraudNetwork"]["status"] == "Connected"
    assert dossier["riskBreakdown"]["evidenceIntegrity"]["status"] == "Verified"
    assert len(dossier["evidence"]) >= 3
    assert len(dossier["digitalSignals"]) >= 4
    print(f"2. GET /lender/applications/TL-APP-10001 -> 200, Full investigation dossier retrieved.")

    # 3. Test Investigator Notes (Lender Only)
    status, note = request(
        "POST",
        "/lender/applications/TL-APP-10001/notes",
        {"note_text": "Examined bank statement kerning. Consistent with accounting software export."},
        {"X-Lender-Id": "usr_lead_alex", "X-Lender-Name": "Alex Sterling"}
    )
    assert status == 200
    assert note["note_text"].startswith("Examined bank statement")
    print("3. POST /lender/applications/TL-APP-10001/notes -> 200, Internal note created.")

    # 4. Verify Borrower Cannot Access Internal Notes via Borrower Status API
    status, borrower_status = request(
        "GET",
        "/loan-applications/TL-APP-10001/status",
        headers={"X-User-Id": "usr_demo_arjun"}
    )
    assert status == 200
    assert "internal_notes" not in borrower_status
    assert "fraud_network" not in borrower_status
    assert "digital_signals" not in borrower_status
    assert borrower_status["application_status"] == "UNDER_REVIEW"
    print("4. GET /loan-applications/TL-APP-10001/status -> 200, Borrower sees UNDER_REVIEW with zero internal notes.")

    # 5. Test IDOR Protection on Borrower Status
    status, err = request(
        "GET",
        "/loan-applications/TL-APP-10001/status",
        headers={"X-User-Id": "usr_attacker_bob"}
    )
    assert status == 403
    print("5. IDOR Protection: Attacker viewing borrower status denied with 403.")

    # 6. Test Request Action Decision from Underwriter
    status, dec_res = request(
        "POST",
        "/lender/applications/TL-APP-10001/decision",
        {
            "decision": "REQUEST_ACTION",
            "action_message": "Please upload a clearer PDF copy of your last month bank statement.",
            "internal_note": "Requesting clearer statement to confirm net salary credits."
        },
        {"X-Lender-Id": "usr_lead_alex", "X-Lender-Name": "Alex Sterling"}
    )
    assert status == 200
    assert dec_res["application_status"] == "ACTION_REQUIRED"
    print("6. POST /decision (REQUEST_ACTION) -> 200, Transitioned to ACTION_REQUIRED.")

    # 7. Verify Borrower Sees Action Required
    status, b_stat = request(
        "GET",
        "/loan-applications/TL-APP-10001/status",
        headers={"X-User-Id": "usr_demo_arjun"}
    )
    assert status == 200
    assert b_stat["application_status"] == "ACTION_REQUIRED"
    assert b_stat["action_request"] is not None
    assert "clearer PDF copy" in b_stat["action_request"]["message"]
    print("7. Borrower sees ACTION_REQUIRED with specific action prompt.")

    # 8. Test Borrower Submitting Action Response
    status, resp_data = request(
        "POST",
        "/loan-applications/TL-APP-10001/action-response",
        {"borrower_response": "Uploaded high-resolution bank statement directly exported from net banking."},
        headers={"X-User-Id": "usr_demo_arjun"}
    )
    assert status == 200
    assert resp_data["application_status"] == "UNDER_REVIEW"
    print("8. POST /action-response -> 200, Returned status to UNDER_REVIEW.")

    # 9. Test Underwriter Approval with Approved Terms
    status, dec_appr = request(
        "POST",
        "/lender/applications/TL-APP-10001/decision",
        {
            "decision": "APPROVED",
            "approved_amount": 200000,
            "approved_duration_months": 24,
            "approved_interest_rate": 13.5,
            "approved_emi": 9557,
            "decision_reason": "Identity, salary credits and document authenticity verified."
        },
        {"X-Lender-Id": "usr_lead_alex", "X-Lender-Name": "Alex Sterling"}
    )
    assert status == 200
    assert dec_appr["application_status"] == "APPROVED"
    assert dec_appr["approved_terms"]["approved_amount"] == 200000
    assert dec_appr["approved_terms"]["approved_interest_rate"] == 13.5
    print("9. POST /decision (APPROVED) -> 200, Approved terms recorded.")

    # 10. Verify Borrower Sees APPROVED with Exact Approved Terms
    status, appr_b_stat = request(
        "GET",
        "/loan-applications/TL-APP-10001/status",
        headers={"X-User-Id": "usr_demo_arjun"}
    )
    assert status == 200
    assert appr_b_stat["application_status"] == "APPROVED"
    assert appr_b_stat["current_stage"] == 5
    assert appr_b_stat["approved_terms"]["approved_amount"] == 200000
    assert appr_b_stat["approved_terms"]["approved_emi"] == 9557
    print("10. Borrower sees APPROVED with Approved Terms (Amount: INR 2,00,000, EMI: INR 9,557).")

    print("\nALL PHASE 4 WORKFLOW TESTS PASSED CLEANLY!")

if __name__ == "__main__":
    test_phase4_end_to_end_workflow()
