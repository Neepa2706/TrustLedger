/**
 * TrustLedger ApplicationSummaryCard Component
 * Displays a clean summary card for an ongoing or submitted loan application.
 * Shows Application ID, product, amount, tenure, step progress, and status.
 * Styled in White & Coffee Brown fintech design system.
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
  const isApproved = application.application_status === 'APPROVED';

  return (
    <div className="rounded-2xl border border-coffee-200 bg-white p-5 shadow-card space-y-4 hover:border-coffee-400 transition-all">
      <div className="flex items-center justify-between gap-3 pb-3 border-b border-coffee-100">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-xl bg-coffee-50 border border-coffee-200 text-coffee-700">
            <FileSpreadsheet className="h-4 w-4" />
          </div>
          <div>
            <span className="text-[10px] font-mono text-coffee-600 font-bold block">
              {application.application_id}
            </span>
            <h4 className="text-sm font-bold text-coffee-950">
              {application.loan_product_name}
            </h4>
          </div>
        </div>

        <span className={`text-[10px] font-mono px-2.5 py-1 rounded-full border font-bold ${
          isApproved
            ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
            : isReady
            ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
            : 'bg-amber-50 text-amber-800 border-amber-200'
        }`}>
          {isApproved ? 'Approved' : isReady ? 'Ready for Review' : 'Draft Application'}
        </span>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
        <div className="p-3 rounded-xl border border-coffee-200 bg-coffee-50/50">
          <span className="text-[10px] font-mono uppercase text-coffee-600 block mb-0.5 font-medium">Requested Amount</span>
          <span className="font-bold text-coffee-950 font-mono">₹{application.requested_amount?.toLocaleString('en-IN')}</span>
        </div>
        <div className="p-3 rounded-xl border border-coffee-200 bg-coffee-50/50">
          <span className="text-[10px] font-mono uppercase text-coffee-600 block mb-0.5 font-medium">Duration</span>
          <span className="font-bold text-coffee-950 font-mono">{application.requested_duration_months} Months</span>
        </div>
        <div className="p-3 rounded-xl border border-coffee-200 bg-coffee-50/50">
          <span className="text-[10px] font-mono uppercase text-coffee-600 block mb-0.5 font-medium">Estimated EMI</span>
          <span className="font-bold text-coffee-800 font-mono">₹{application.estimated_emi?.toLocaleString('en-IN')} / mo</span>
        </div>
        <div className="p-3 rounded-xl border border-coffee-200 bg-coffee-50/50">
          <span className="text-[10px] font-mono uppercase text-coffee-600 block mb-0.5 font-medium">Current Step</span>
          <span className="font-bold text-coffee-950">Step {application.current_step} of 6</span>
        </div>
      </div>

      <div className="pt-1 flex items-center justify-between">
        <span className="text-[11px] text-coffee-600">
          Purpose: <strong>{application.loan_purpose || 'General Need'}</strong>
        </span>
        <Link
          to={`/loans/${application.loan_product_id}/apply?appId=${application.application_id}`}
          className="inline-flex items-center gap-1 text-xs font-bold text-coffee-700 hover:text-coffee-950 hover:underline"
        >
          <span>Resume Application</span>
          <ArrowRight className="h-3.5 w-3.5" />
        </Link>
      </div>
    </div>
  );
}
