"""
Test live FastAPI Phase 3 endpoints on http://127.0.0.1:8000
"""

import urllib.request
import urllib.parse
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

def run():
    print("=== Testing Phase 3 Live Endpoints ===")
    user_headers = {"X-User-Id": "usr_live_tester_101"}

    # 1. Create Application
    status, app = request("POST", "/loan-applications", {
        "loan_product_id": "personal-loan",
        "requested_amount": 100000,
        "requested_duration_months": 24,
        "loan_purpose": "Home renovation and electronics purchase"
    }, user_headers)
    print(f"1. POST /loan-applications -> {status}, App ID: {app.get('application_id')}")
    assert status == 201
    app_id = app["application_id"]

    # 2. Update with bank details
    status, updated = request("PUT", f"/loan-applications/{app_id}", {
        "financial_details": {
            "employer_or_business_name": "TCS Ltd",
            "monthly_income": "85,000",
            "payout_bank_name": "HDFC Bank",
            "payout_account_number": "5010023456784821",
            "payout_ifsc_code": "HDFC0000123"
        }
    }, user_headers)
    print(f"2. PUT /loan-applications/{app_id} -> {status}, Masked Account: {updated['financial_details']['payout_account_masked']}")
    assert status == 200
    assert updated["financial_details"]["payout_account_masked"] == "XXXX XXXX 4821"

    # 3. Document Cross-Comparison
    status, comparisons = request("POST", f"/loan-applications/{app_id}/documents/compare", headers=user_headers)
    print(f"3. POST /loan-applications/{app_id}/documents/compare -> {status}, {len(comparisons)} items compared")
    assert status == 200

    # 4. KYC Check
    status, kyc = request("POST", f"/loan-applications/{app_id}/kyc-check", headers=user_headers)
    print(f"4. POST /loan-applications/{app_id}/kyc-check -> {status}, KYC status: {kyc.get('overall_status')}")
    assert status == 200

    # 5. Verification Status
    status, verif = request("GET", f"/loan-applications/{app_id}/verification-status", headers=user_headers)
    print(f"5. GET /loan-applications/{app_id}/verification-status -> {status}, Can Submit: {verif.get('can_submit')}")
    assert status == 200

    # 6. IDOR Protection (Attacker user tries to access)
    attacker_headers = {"X-User-Id": "usr_attacker_999"}
    status, denied = request("GET", f"/loan-applications/{app_id}/verification-status", headers=attacker_headers)
    print(f"6. IDOR Protection GET (Attacker) -> {status} (Expected 403 / 404)")
    assert status in [403, 404]

    # 7. Final Submission (Without declaration -> Expected 400)
    status, decl_err = request("POST", f"/loan-applications/{app_id}/submit", {
        "borrower_declaration_confirmed": False
    }, user_headers)
    print(f"7. POST /submit without declaration -> {status} (Expected 400)")
    assert status == 400

    # 8. Audit Trail
    status, trail = request("GET", f"/loan-applications/{app_id}/audit-trail", headers=user_headers)
    print(f"8. GET /audit-trail -> {status}, {len(trail)} chained events logged")
    assert status == 200
    assert len(trail) >= 2

    print("\nALL LIVE ENDPOINT TESTS PASSED!")

if __name__ == "__main__":
    run()
