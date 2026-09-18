/**
 * TrustLedger Single-Person Account Rule Component
 * Displays mandatory product notice:
 * ONE PERSON = ONE USER ACCOUNT
 */

import React from 'react';
import { UserCheck, ShieldAlert, AlertTriangle } from 'lucide-react';

export default function SingleAccountNotice({ variant = 'banner', className = '' }) {
  if (variant === 'inline') {
    return (
      <div className={`p-3 rounded-lg border border-amber-500/30 bg-amber-950/20 text-xs text-amber-200 flex items-start gap-2.5 ${className}`}>
        <UserCheck className="h-4 w-4 text-amber-400 shrink-0 mt-0.5" />
        <div>
          <span className="font-semibold text-amber-300 block">
            Personal account only
          </span>
          <span className="text-[11px] text-slate-300 mt-0.5 block leading-relaxed">
            Each applicant must create their own account and complete verification using their own identity documents and photograph.
          </span>
        </div>
      </div>
    );
  }

  if (variant === 'callout') {
    return (
      <div className={`rounded-xl border border-cyan-500/30 bg-surface-card/90 p-4 shadow-lg backdrop-blur-sm ${className}`}>
        <div className="flex items-center gap-2 mb-1.5">
          <div className="h-7 w-7 rounded-lg bg-cyan-950 flex items-center justify-center border border-cyan-500/40 text-cyan-300">
            <UserCheck className="h-4 w-4" />
          </div>
          <div>
            <span className="text-[10px] font-mono uppercase tracking-wider text-cyan-400 font-semibold block">
              MANDATORY REQUIREMENT
            </span>
            <h4 className="text-xs font-bold text-white">
              Each person must create and use their own TrustLedger account.
            </h4>
          </div>
        </div>
        <p className="text-[11px] text-slate-300 leading-relaxed pl-9">
          Do not share your account with another person. Each loan applicant must complete verification using their own account and real identity documents.
        </p>
      </div>
    );
  }

  return (
    <div className={`p-3.5 rounded-xl border border-cyan-500/30 bg-midnight-900/80 text-xs text-slate-200 ${className}`}>
      <div className="flex items-start gap-3">
        <div className="p-1.5 rounded-lg bg-cyan-950/90 border border-cyan-500/40 text-cyan-300 shrink-0">
          <UserCheck className="h-4 w-4" />
        </div>
        <div className="flex-1">
          <div className="font-semibold text-white text-xs flex items-center gap-2">
            <span>Each person must create and use their own TrustLedger account.</span>
            <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-cyan-950 text-cyan-300 border border-cyan-500/30">
              1 User = 1 Person
            </span>
          </div>
          <p className="text-[11px] text-slate-300 mt-1 leading-relaxed">
            Do not share your account with another person. Each loan applicant must complete verification using their own account.
          </p>
        </div>
      </div>
    </div>
  );
}
