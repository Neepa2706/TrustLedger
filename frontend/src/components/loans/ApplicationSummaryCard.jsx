/**
 * TrustLedger ApplicationSummaryCard Component
 * Displays a clean summary card for an ongoing or submitted loan application.
 * Shows Application ID, product, amount, tenure, step progress, and status.
 */

import React from 'react';
import { Link } from 'react-router-dom';
import {
  FileSpreadsheet,
  Clock,
  ArrowRight,
  CheckCircle2,
  AlertCircle,
  FileCheck2
} from 'lucide-react';

export default function ApplicationSummaryCard({ application }) {
  if (!application) return null;

  const isReady = application.application_status === 'READY_FOR_REVIEW';
  const isDraft = application.application_status === 'DRAFT';

  return (
    <div className="rounded-2xl border border-surface-border bg-surface-card p-5 shadow-xl space-y-4 hover:border-cyan-500/40 transition-all">
      <div className="flex items-center justify-between gap-3 pb-3 border-b border-surface-border">
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-xl bg-cyan-950 border border-cyan-500/30 text-cyan-400">
            <FileSpreadsheet className="h-4 w-4" />
          </div>
          <div>
            <span className="text-[10px] font-mono text-cyan-400 font-semibold block">
              {application.application_id}
            </span>
            <h4 className="text-sm font-bold text-white">
              {application.loan_product_name}
            </h4>
          </div>
        </div>

        <span className={`text-[10px] font-mono px-2.5 py-1 rounded-full border ${
          isReady
            ? 'bg-emerald-950 text-emerald-300 border-emerald-500/40'
            : 'bg-amber-950 text-amber-300 border-amber-500/40'
        }`}>
          {isReady ? 'Ready for Review' : 'Draft Application'}
        </span>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
        <div className="p-3 rounded-xl border border-surface-border bg-midnight-950">
          <span className="text-[10px] font-mono uppercase text-slate-400 block mb-0.5">Requested Amount</span>
          <span className="font-bold text-white font-mono">₹{application.requested_amount?.toLocaleString('en-IN')}</span>
        </div>
        <div className="p-3 rounded-xl border border-surface-border bg-midnight-950">
          <span className="text-[10px] font-mono uppercase text-slate-400 block mb-0.5">Duration</span>
          <span className="font-semibold text-white font-mono">{application.requested_duration_months} Months</span>
        </div>
        <div className="p-3 rounded-xl border border-surface-border bg-midnight-950">
          <span className="text-[10px] font-mono uppercase text-slate-400 block mb-0.5">Estimated EMI</span>
          <span className="font-semibold text-cyan-300 font-mono">₹{application.estimated_emi?.toLocaleString('en-IN')}</span>
        </div>
        <div className="p-3 rounded-xl border border-surface-border bg-midnight-950">
          <span className="text-[10px] font-mono uppercase text-slate-400 block mb-0.5">Progress</span>
          <span className="font-semibold text-white font-mono">Step {application.current_step} of 6</span>
        </div>
      </div>

      <div className="flex items-center justify-between pt-2 border-t border-surface-border/60">
        <span className="text-[10px] font-mono text-slate-500">
          Last updated: {new Date(application.updated_at).toLocaleDateString()}
        </span>

        <Link
          to={`/loans/${application.loan_product_id}/apply?appId=${application.application_id}`}
          className="flex items-center gap-1.5 text-xs font-semibold text-cyan-400 hover:text-cyan-300 hover:underline"
        >
          <span>Continue Application</span>
          <ArrowRight className="h-3.5 w-3.5" />
        </Link>
      </div>
    </div>
  );
}
