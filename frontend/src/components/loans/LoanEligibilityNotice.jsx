/**
 * TrustLedger LoanEligibilityNotice Component
 * Prominent disclaimer and regulatory notice regarding underwriting terms,
 * non-guarantee disclosures, and verification criteria in White & Coffee theme.
 */

import React from 'react';
import { ShieldCheck, Info, CheckCircle2, AlertTriangle } from 'lucide-react';

export default function LoanEligibilityNotice({ className = '' }) {
  return (
    <div className={`p-5 rounded-2xl border border-coffee-200 bg-white shadow-card space-y-3 ${className}`}>
      <div className="flex items-center gap-2.5">
        <div className="p-1.5 rounded-lg bg-coffee-50 border border-coffee-200 text-coffee-700">
          <ShieldCheck className="h-4 w-4" />
        </div>
        <h4 className="text-xs font-bold text-coffee-950 uppercase tracking-wider font-mono">
          Important Eligibility & Underwriting Information
        </h4>
      </div>

      <p className="text-xs text-coffee-700 leading-relaxed">
        Final eligibility, interest rate, sanctioned amount, and loan disbursement are subject to lender verification and human underwriter approval.
        TrustLedger provides AI-assisted document forensics, identity checks, and fraud shielding to accelerate processing,
        in full compliance with digital lending guidelines.
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 pt-1 text-[11px] text-coffee-800">
        <div className="flex items-center gap-2 p-2.5 rounded-xl bg-coffee-50 border border-coffee-200">
          <CheckCircle2 className="h-3.5 w-3.5 text-emerald-700 shrink-0" />
          <span>Verified profile fast-track</span>
        </div>
        <div className="flex items-center gap-2 p-2.5 rounded-xl bg-coffee-50 border border-coffee-200">
          <CheckCircle2 className="h-3.5 w-3.5 text-emerald-700 shrink-0" />
          <span>Transparent terms & zero hidden fees</span>
        </div>
        <div className="flex items-center gap-2 p-2.5 rounded-xl bg-coffee-50 border border-coffee-200">
          <AlertTriangle className="h-3.5 w-3.5 text-amber-700 shrink-0" />
          <span>Strict fraud detection & SHA-256 audit</span>
        </div>
      </div>
    </div>
  );
}
