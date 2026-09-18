"""
Comprehensive Test Suite for TrustLedger Lender Portal (Section 34 Canonical Endpoints)
Tests all canonical endpoints:
1. GET /applications
2. GET /applications/{application_id}
3. POST /applications/{application_id}/review
4. POST /applications/{application_id}/approve
5. POST /applications/{application_id}/reject
6. POST /applications/{application_id}/request-action
7. GET /applications/{application_id}/events
8. GET /applications/{application_id}/risk
9. GET /applications/{application_id}/fraud-network
10. GET /applications/{application_id}/evidence
11. GET /applications/{application_id}/documents
12. POST /applications/{application_id}/documents/analyze
13. POST /applications/{application_id}/kyc-check
14. POST /applications/{application_id}/documents/compare
15. POST /applications/{application_id}/evidence/verify
16. GET /alerts
17. GET /approved-loans
18. GET /payment-monitoring
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

def test_canonical_lender_api():
    print("=== Testing TrustLedger Canonical Lender API (Section 34) ===")

    # 1. GET /applications
    status, apps = request("GET", "/applications")
    assert status == 200, f"Expected 200, got {status}: {apps}"
    assert len(apps) >= 4, f"Expected at least 4 synthetic applications in queue, got {len(apps)}"
    app_ids = [a["id"] for a in apps]
    assert "TL-APP-10001" in app_ids
    assert "TL-APP-10002" in app_ids
    assert "TL-APP-10003" in app_ids
    assert "TL-APP-10004" in app_ids
    print(f"1. GET /applications -> 200 OK (Found {len(apps)} applications: {app_ids})")

    # 2. GET /applications/{application_id}
    status, dossier = request("GET", "/applications/TL-APP-10001")
    assert status == 200, f"Expected 200, got {status}: {dossier}"
    assert dossier["id"] == "TL-APP-10001"
    assert dossier["applicant"] == "Arjun Kumar"
    assert "riskBreakdown" in dossier
    print(f"2. GET /applications/TL-APP-10001 -> 200 OK (Dossier retrieved for Arjun Kumar)")

    # 3. GET /applications/{application_id}/risk
    status, risk = request("GET", "/applications/TL-APP-10001/risk")
    assert status == 200, f"Expected 200, got {status}: {risk}"
    assert "overall_risk_score" in risk
    assert "pillars" in risk
    assert "document_forensics" in risk["pillars"]
    assert "kyc_analysis" in risk["pillars"]
    assert "fraud_network" in risk["pillars"]
    assert "evidence_integrity" in risk["pillars"]
    print(f"3. GET /applications/TL-APP-10001/risk -> 200 OK (4-pillar risk breakdown verified)")

    # 4. GET /applications/{application_id}/fraud-network
    status, net = request("GET", "/applications/TL-APP-10001/fraud-network")
    assert status == 200, f"Expected 200, got {status}: {net}"
    assert "nodes" in net
    assert "edges" in net
    assert len(net["nodes"]) >= 5
    assert "3 applications share connected digital signals." in net["summary"]
    print(f"4. GET /applications/TL-APP-10001/fraud-network -> 200 OK (NetworkX graph returned with {len(net['nodes'])} nodes)")

    # 5. GET /applications/{application_id}/evidence
    status, ev = request("GET", "/applications/TL-APP-10001/evidence")
    assert status == 200, f"Expected 200, got {status}: {ev}"
    assert "ledger_entries" in ev
    assert len(ev["ledger_entries"]) >= 1
    print(f"5. GET /applications/TL-APP-10001/evidence -> 200 OK (Evidence ledger entries: {len(ev['ledger_entries'])})")

    # 6. GET /applications/{application_id}/documents
    status, docs = request("GET", "/applications/TL-APP-10001/documents")
    assert status == 200, f"Expected 200, got {status}: {docs}"
    assert len(docs) >= 1
    print(f"6. GET /applications/TL-APP-10001/documents -> 200 OK (Attached documents: {len(docs)})")

    # 7. POST /applications/{application_id}/documents/analyze
    status, analysis = request("POST", "/applications/TL-APP-10001/documents/analyze")
    assert status == 200, f"Expected 200, got {status}: {analysis}"
    assert analysis["status"] == "COMPLETED"
    print(f"7. POST /applications/TL-APP-10001/documents/analyze -> 200 OK (Forensic analysis completed)")

    # 8. POST /applications/{application_id}/kyc-check
    status, kyc = request("POST", "/applications/TL-APP-10001/kyc-check")
    assert status == 200, f"Expected 200, got {status}: {kyc}"
    assert "overall_status" in kyc
    print(f"8. POST /applications/TL-APP-10001/kyc-check -> 200 OK (KYC verdict: {kyc['overall_status']})")

    # 9. POST /applications/{application_id}/documents/compare
    status, comp = request("POST", "/applications/TL-APP-10001/documents/compare")
    assert status == 200, f"Expected 200, got {status}: {comp}"
    print(f"9. POST /applications/TL-APP-10001/documents/compare -> 200 OK (Compared items: {len(comp)})")

    # 10. POST /applications/{application_id}/evidence/verify
    status, ev_verify = request("POST", "/applications/TL-APP-10001/evidence/verify")
    assert status == 200, f"Expected 200, got {status}: {ev_verify}"
    assert ev_verify["overall_integrity"] in ["VERIFIED", "WARNING"]
    print(f"10. POST /applications/TL-APP-10001/evidence/verify -> 200 OK (Integrity: {ev_verify['overall_integrity']})")

    # 11. GET /applications/{application_id}/events
    status, events = request("GET", "/applications/TL-APP-10001/events")
    assert status == 200, f"Expected 200, got {status}: {events}"
    assert len(events) >= 1
    print(f"11. GET /applications/TL-APP-10001/events -> 200 OK (Audit events: {len(events)})")

    # 12. POST /applications/{application_id}/review
    status, rev_res = request("POST", "/applications/TL-APP-10001/review", {"status": "UNDER_REVIEW", "internal_note": "Underwriter examining documents."})
    assert status == 200, f"Expected 200, got {status}: {rev_res}"
    assert rev_res["application_status"] == "UNDER_REVIEW"
    print(f"12. POST /applications/TL-APP-10001/review -> 200 OK (Status transitioned to UNDER_REVIEW)")

    # 13. POST /applications/{application_id}/request-action
    status, act_res = request(
        "POST",
        "/applications/TL-APP-10001/request-action",
        {
            "request_type": "DOCUMENT_CLARIFICATION",
            "message": "Please upload a clearer PDF copy of your last 3 months bank statement.",
            "internal_notes": "Salary credit row needs clear resolution."
        }
    )
    assert status == 200, f"Expected 200, got {status}: {act_res}"
    assert act_res["application_status"] == "ACTION_REQUIRED"
    print(f"13. POST /applications/TL-APP-10001/request-action -> 200 OK (ACTION_REQUIRED recorded)")

    # 14. Verify borrower sees ACTION_REQUIRED
    status, b_status = request("GET", "/loan-applications/TL-APP-10001/status", headers={"X-User-Id": "usr_demo_arjun"})
    assert status == 200
    assert b_status["application_status"] == "ACTION_REQUIRED"
    assert "clearer PDF copy" in b_status["action_request"]["message"]
    print(f"    [Borrower Sync] Borrower immediately sees ACTION_REQUIRED with clear message.")

    # 15. POST /applications/{application_id}/approve
    status, appr_res = request(
        "POST",
        "/applications/TL-APP-10001/approve",
        {
            "approved_amount": 200000,
            "approved_duration_months": 24,
            "approved_interest_rate": 13.5,
            "approved_emi": 9557,
            "processing_fee": 4000,
            "decision_notes": "Identity and salary credits verified."
        }
    )
    assert status == 200, f"Expected 200, got {status}: {appr_res}"
    assert appr_res["application_status"] == "APPROVED"
    assert appr_res["approved_terms"]["approved_amount"] == 200000
    print(f"15. POST /applications/TL-APP-10001/approve -> 200 OK (Loan sanctioned with approved terms)")

    # 16. Verify borrower sees APPROVED with approved terms
    status, b_appr = request("GET", "/loan-applications/TL-APP-10001/status", headers={"X-User-Id": "usr_demo_arjun"})
    assert status == 200
    assert b_appr["application_status"] == "APPROVED"
    assert b_appr["approved_terms"]["approved_amount"] == 200000
    assert b_appr["approved_terms"]["approved_emi"] == 9557
    print(f"    [Borrower Sync] Borrower immediately sees APPROVED with sanctioned terms.")

    # 17. POST /applications/{application_id}/reject on TL-APP-10003
    status, rej_res = request(
        "POST",
        "/applications/TL-APP-10003/reject",
        {
            "reason": "Business turnover documentation could not be verified.",
            "internal_notes": "GSTR3B mismatch confirmed."
        }
    )
    assert status == 200, f"Expected 200, got {status}: {rej_res}"
    assert rej_res["application_status"] == "REJECTED"
    print(f"17. POST /applications/TL-APP-10003/reject -> 200 OK (REJECTED with documented reason)")

    # 18. GET /alerts
    status, alerts = request("GET", "/alerts")
    assert status == 200, f"Expected 200, got {status}: {alerts}"
    assert len(alerts) >= 5
    print(f"18. GET /alerts -> 200 OK (Retrieved {len(alerts)} alerts)")

    # 19. GET /approved-loans
    status, loans = request("GET", "/approved-loans")
    assert status == 200, f"Expected 200, got {status}: {loans}"
    assert len(loans) >= 4
    print(f"19. GET /approved-loans -> 200 OK (Found {len(loans)} approved/active loans)")

    # 20. GET /payment-monitoring
    status, pm = request("GET", "/payment-monitoring")
    assert status == 200, f"Expected 200, got {status}: {pm}"
    assert pm["total_disbursed"] > 0
    assert pm["total_repaid"] > 0
    print(f"20. GET /payment-monitoring -> 200 OK (Total disbursed: INR {pm['total_disbursed']:,})")

    print("\nALL 20 CANONICAL SECTION 34 ENDPOINTS TESTED AND PASSED PERFECTLY!")

if __name__ == "__main__":
    test_canonical_lender_api()
