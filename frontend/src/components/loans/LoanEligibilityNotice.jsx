/**
 * TrustLedger LoanEligibilityNotice Component
 * Prominent disclaimer and regulatory notice regarding underwriting terms,
 * non-guarantee disclosures, and verification criteria.
 */

import React from 'react';
import { ShieldCheck, Info, CheckCircle2, AlertTriangle } from 'lucide-react';

export default function LoanEligibilityNotice({ className = '' }) {
  return (
    <div className={`p-4 rounded-2xl border border-surface-border bg-midnight-950/80 space-y-3 ${className}`}>
      <div className="flex items-center gap-2">
        <ShieldCheck className="h-4 w-4 text-cyan-400" />
        <h4 className="text-xs font-bold text-white uppercase tracking-wider font-mono">
          Important Eligibility & Underwriting Information
        </h4>
      </div>

      <p className="text-xs text-slate-300 leading-relaxed">
        Final eligibility, interest rate, loan amount, and approval are subject to lender verification and approval.
        TrustLedger provides AI-assisted document verification and fraud prevention to streamline your application,
        but final lending decisions rest exclusively with the licensed financial institution.
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 pt-1 text-[11px] text-slate-400">
        <div className="flex items-center gap-2 p-2 rounded-lg bg-midnight-900 border border-surface-border">
          <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400 shrink-0" />
          <span>Verified profile speed-lane</span>
        </div>
        <div className="flex items-center gap-2 p-2 rounded-lg bg-midnight-900 border border-surface-border">
          <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400 shrink-0" />
          <span>Zero upfront hidden costs</span>
        </div>
        <div className="flex items-center gap-2 p-2 rounded-lg bg-midnight-900 border border-surface-border">
          <AlertTriangle className="h-3.5 w-3.5 text-amber-400 shrink-0" />
          <span>No guaranteed approval claims</span>
        </div>
      </div>
    </div>
  );
}
