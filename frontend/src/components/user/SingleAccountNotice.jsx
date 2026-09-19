/**
 * TrustLedger Single-Person Account Rule Component
 * Displays mandatory product notice:
 * ONE PERSON = ONE USER ACCOUNT
 * Styled in White & Coffee Brown fintech design system.
 */

import React from 'react';
import { UserCheck, ShieldAlert, AlertTriangle } from 'lucide-react';

export default function SingleAccountNotice({ variant = 'banner', className = '' }) {
  if (variant === 'inline') {
    return (
      <div className={`p-3.5 rounded-xl border border-coffee-300 bg-coffee-50 text-xs text-coffee-950 flex items-start gap-2.5 ${className}`}>
        <UserCheck className="h-4 w-4 text-coffee-700 shrink-0 mt-0.5" />
        <div>
          <span className="font-bold text-coffee-950 block">
            Personal account only — each applicant must create and use their own TrustLedger account.
          </span>
          <span className="text-[11px] text-coffee-900 mt-0.5 block font-medium leading-relaxed">
            Do not share your account with another person. Each applicant must complete verification using their own authentic identity documents and live camera photo.
          </span>
        </div>
      </div>
    );
  }

  if (variant === 'callout') {
    return (
      <div className={`rounded-2xl border border-coffee-300 bg-white p-5 shadow-card ${className}`}>
        <div className="flex items-center gap-2.5 mb-2">
          <div className="h-8 w-8 rounded-xl bg-coffee-100 flex items-center justify-center border border-coffee-200 text-coffee-700">
            <UserCheck className="h-4 w-4" />
          </div>
          <div>
            <span className="text-[10px] font-mono uppercase tracking-wider text-coffee-800 font-bold block">
              MANDATORY REQUIREMENT • ONE PERSON = ONE USER ACCOUNT
            </span>
            <h4 className="text-xs font-extrabold text-coffee-950">
              Personal account only — each applicant must create and use their own TrustLedger account.
            </h4>
          </div>
        </div>
        <p className="text-[11px] text-coffee-900 font-medium leading-relaxed pl-10">
          Do not share your account with another person. Each loan applicant must complete identity and biometric verification using their own account and authentic documents.
        </p>
      </div>
    );
  }

  return (
    <div className={`p-4 rounded-2xl border border-coffee-300 bg-coffee-50 text-xs text-coffee-950 ${className}`}>
      <div className="flex items-start gap-3">
        <div className="p-2 rounded-xl bg-white border border-coffee-300 text-coffee-700 shrink-0 shadow-sm">
          <UserCheck className="h-4 w-4" />
        </div>
        <div className="flex-1">
          <div className="font-extrabold text-coffee-950 text-xs flex flex-wrap items-center gap-2">
            <span>Personal account only — each applicant must create and use their own TrustLedger account.</span>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-coffee-200 text-coffee-950 font-bold border border-coffee-300">
              1 User = 1 Person
            </span>
          </div>
          <p className="text-[11px] text-coffee-900 mt-1 font-medium leading-relaxed">
            Do not share your account with another person. Every loan application is cryptographically bound to one individual.
          </p>
        </div>
      </div>
    </div>
  );
}
