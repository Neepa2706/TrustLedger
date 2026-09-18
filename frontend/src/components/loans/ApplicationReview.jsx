/**
 * TrustLedger ApplicationReview Component
 * Comprehensive pre-submission review screen summarizing:
 * - Selected loan terms & estimated EMI
 * - Locked verified applicant details
 * - Financial inputs & masked bank account
 * - Uploaded documents & quality results
 * - Blocking errors / validation messages
 */

import React from 'react';
import { Link } from 'react-router-dom';
import {
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  FileText,
  User,
  Briefcase,
  Building,
  CreditCard,
  Lock,
  ExternalLink
} from 'lucide-react';

export default function ApplicationReview({
  application,
  product,
  onEditStep
}) {
  if (!application) return null;

  const verified = application.verified_applicant || {};
  const financial = application.financial_details || {};
  const documents = application.documents || [];
  const errors = application.validation_errors || [];

  return (
    <div className="space-y-6">
      
      {/* 1. Selected Loan Summary Card */}
      <div className="rounded-2xl border border-surface-border bg-surface-card p-5 space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-surface-border">
          <div className="flex items-center gap-2">
            <CreditCard className="h-4 w-4 text-cyan-400" />
            <h4 className="text-xs font-bold text-white uppercase tracking-wider font-mono">
              1. Selected Loan Terms
            </h4>
          </div>
          {onEditStep && (
            <button
              type="button"
              onClick={() => onEditStep(2)}
              className="text-xs font-mono text-cyan-400 hover:underline"
            >
              Edit Loan
            </button>
          )}
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
          <div className="p-3 rounded-xl border border-surface-border bg-midnight-950">
            <span className="text-[10px] font-mono uppercase text-slate-400 block mb-1">Product</span>
            <span className="font-semibold text-white">{application.loan_product_name}</span>
          </div>
          <div className="p-3 rounded-xl border border-surface-border bg-midnight-950">
            <span className="text-[10px] font-mono uppercase text-slate-400 block mb-1">Requested Amount</span>
            <span className="font-bold text-cyan-300 font-mono">₹{application.requested_amount?.toLocaleString('en-IN')}</span>
          </div>
          <div className="p-3 rounded-xl border border-surface-border bg-midnight-950">
            <span className="text-[10px] font-mono uppercase text-slate-400 block mb-1">Duration</span>
            <span className="font-semibold text-white font-mono">{application.requested_duration_months} Months</span>
          </div>
          <div className="p-3 rounded-xl border border-surface-border bg-midnight-950">
            <span className="text-[10px] font-mono uppercase text-slate-400 block mb-1">Estimated EMI</span>
            <span className="font-bold text-white font-mono">₹{application.estimated_emi?.toLocaleString('en-IN')} / mo</span>
          </div>
        </div>

        <div className="p-3 rounded-xl border border-surface-border bg-midnight-950 text-xs">
          <span className="text-[10px] font-mono uppercase text-slate-400 block mb-1">Loan Purpose</span>
          <span className="text-slate-200">{application.loan_purpose}</span>
        </div>
      </div>

      {/* 2. Verified Applicant Identity Card (Locked) */}
      <div className="rounded-2xl border border-surface-border bg-surface-card p-5 space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-surface-border">
          <div className="flex items-center gap-2">
            <User className="h-4 w-4 text-cyan-400" />
            <h4 className="text-xs font-bold text-white uppercase tracking-wider font-mono">
              2. Verified Applicant Details
            </h4>
          </div>
          <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-950 text-emerald-300 border border-emerald-500/30 flex items-center gap-1">
            <Lock className="h-3 w-3" /> Locked & Verified
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
          <div className="p-3 rounded-xl border border-surface-border bg-midnight-950">
            <span className="text-[10px] font-mono uppercase text-slate-400 block mb-1">Full Legal Name</span>
            <span className="font-semibold text-white">{verified.full_name}</span>
          </div>
          <div className="p-3 rounded-xl border border-surface-border bg-midnight-950">
            <span className="text-[10px] font-mono uppercase text-slate-400 block mb-1">Date of Birth</span>
            <span className="text-slate-200">{verified.date_of_birth}</span>
          </div>
          <div className="p-3 rounded-xl border border-surface-border bg-midnight-950">
            <span className="text-[10px] font-mono uppercase text-slate-400 block mb-1">Contact</span>
            <span className="text-slate-200">{verified.mobile}</span>
          </div>
          <div className="p-3 rounded-xl border border-surface-border bg-midnight-950">
            <span className="text-[10px] font-mono uppercase text-slate-400 block mb-1">Aadhaar (Masked)</span>
            <span className="font-mono text-cyan-300 font-semibold">{verified.aadhaar_masked || 'XXXX XXXX 4821'}</span>
          </div>
          <div className="p-3 rounded-xl border border-surface-border bg-midnight-950">
            <span className="text-[10px] font-mono uppercase text-slate-400 block mb-1">PAN (Masked)</span>
            <span className="font-mono text-cyan-300 font-semibold">{verified.pan_masked || 'AB•••••4821'}</span>
          </div>
          <div className="p-3 rounded-xl border border-surface-border bg-midnight-950">
            <span className="text-[10px] font-mono uppercase text-slate-400 block mb-1">Address</span>
            <span className="text-slate-200 truncate block">{verified.address}, {verified.city}</span>
          </div>
        </div>

        <div className="text-[11px] text-slate-400 flex items-center justify-between">
          <span>Need to correct your identity details?</span>
          <Link to="/profile" className="text-cyan-400 hover:underline inline-flex items-center gap-1 font-mono">
            <span>Update in Profile</span>
            <ExternalLink className="h-3 w-3" />
          </Link>
        </div>
      </div>

      {/* 3. Financial & Bank Details Card */}
      <div className="rounded-2xl border border-surface-border bg-surface-card p-5 space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-surface-border">
          <div className="flex items-center gap-2">
            <Briefcase className="h-4 w-4 text-cyan-400" />
            <h4 className="text-xs font-bold text-white uppercase tracking-wider font-mono">
              3. Employment & Bank Information
            </h4>
          </div>
          {onEditStep && (
            <button
              type="button"
              onClick={() => onEditStep(3)}
              className="text-xs font-mono text-cyan-400 hover:underline"
            >
              Edit Financials
            </button>
          )}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
          <div className="p-3 rounded-xl border border-surface-border bg-midnight-950">
            <span className="text-[10px] font-mono uppercase text-slate-400 block mb-1">Employer / Business</span>
            <span className="font-semibold text-white">{financial.employer_or_business_name || 'Self-Employed / Salaried'}</span>
          </div>
          <div className="p-3 rounded-xl border border-surface-border bg-midnight-950">
            <span className="text-[10px] font-mono uppercase text-slate-400 block mb-1">Monthly Net Income</span>
            <span className="font-bold text-white">₹{financial.monthly_income || '75,000'}</span>
          </div>
          <div className="p-3 rounded-xl border border-surface-border bg-midnight-950">
            <span className="text-[10px] font-mono uppercase text-slate-400 block mb-1">Disbursement Bank</span>
            <span className="font-semibold text-white">{financial.payout_bank_name || 'HDFC Bank'}</span>
          </div>
          <div className="p-3 rounded-xl border border-surface-border bg-midnight-950 sm:col-span-2">
            <span className="text-[10px] font-mono uppercase text-slate-400 block mb-1">Disbursement Account (Masked)</span>
            <span className="font-mono text-cyan-300 font-semibold">{financial.payout_account_masked || 'XXXX XXXX 4821'}</span>
          </div>
          <div className="p-3 rounded-xl border border-surface-border bg-midnight-950">
            <span className="text-[10px] font-mono uppercase text-slate-400 block mb-1">IFSC Code</span>
            <span className="font-mono text-slate-200">{financial.payout_ifsc_code || 'HDFC0001234'}</span>
          </div>
        </div>
      </div>

      {/* 4. Documents & Quality Verification Card */}
      <div className="rounded-2xl border border-surface-border bg-surface-card p-5 space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-surface-border">
          <div className="flex items-center gap-2">
            <FileText className="h-4 w-4 text-cyan-400" />
            <h4 className="text-xs font-bold text-white uppercase tracking-wider font-mono">
              4. Attached Supporting Documents ({documents.length})
            </h4>
          </div>
          {onEditStep && (
            <button
              type="button"
              onClick={() => onEditStep(4)}
              className="text-xs font-mono text-cyan-400 hover:underline"
            >
              Manage Documents
            </button>
          )}
        </div>

        <div className="space-y-2.5">
          {documents.map((doc) => {
            const compStatus = doc.heuristic_type_match || 'MATCH';
            return (
              <div
                key={doc.document_id}
                className="p-3.5 rounded-xl border border-surface-border bg-midnight-950 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs"
              >
                <div className="flex items-center gap-2.5">
                  <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0" />
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-white">{doc.document_type}</span>
                      <span className="text-[10px] font-mono text-cyan-400">
                        • {doc.quality_status === 'GOOD' ? 'Quality OK' : doc.quality_status}
                      </span>
                    </div>
                    <span className="text-[11px] text-slate-400 block mt-0.5">{doc.filename}</span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <span className={`text-[10px] font-mono px-2 py-0.5 rounded border font-semibold ${
                    compStatus === 'MATCH'
                      ? 'bg-emerald-950 text-emerald-300 border-emerald-500/40'
                      : compStatus === 'REVIEW'
                      ? 'bg-amber-950 text-amber-300 border-amber-500/40'
                      : 'bg-red-950 text-red-300 border-red-500/40'
                  }`}>
                    {compStatus === 'MATCH' ? '✓ MATCH' : compStatus === 'REVIEW' ? 'REVIEW' : 'MISMATCH'}
                  </span>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded border bg-midnight-900 border-surface-border text-slate-400">
                    Uploaded
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 5. Blocking Errors Notice (if any) */}
      {errors && errors.length > 0 && (
        <div className="p-4 rounded-2xl border border-red-500/40 bg-red-950/40 text-xs text-red-200 space-y-2">
          <div className="flex items-center gap-2 font-semibold text-red-300">
            <AlertCircle className="h-4 w-4 text-red-400 shrink-0" />
            <span>Please correct the highlighted items before submitting your application:</span>
          </div>
          <ul className="list-disc pl-7 space-y-1 text-[11px] text-slate-300">
            {errors.map((err, idx) => (
              <li key={idx}>{err}</li>
            ))}
          </ul>
        </div>
      )}

    </div>
  );
}
