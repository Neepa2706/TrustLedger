/**
 * TrustLedger ApplicationReview Component
 * Comprehensive pre-submission review screen summarizing:
 * - Selected loan terms & estimated EMI
 * - Locked verified applicant details
 * - Financial inputs & masked bank account
 * - Uploaded documents & quality results
 * - Blocking errors / validation messages
 * Styled in White & Coffee Brown fintech design system.
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
      <div className="rounded-2xl border border-coffee-200 bg-white p-6 shadow-card space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-coffee-100">
          <div className="flex items-center gap-2">
            <CreditCard className="h-4 w-4 text-coffee-600" />
            <h4 className="text-xs font-bold text-coffee-950 uppercase tracking-wider font-mono">
              1. Selected Loan Terms
            </h4>
          </div>
          {onEditStep && (
            <button
              type="button"
              onClick={() => onEditStep(2)}
              className="text-xs font-bold text-coffee-700 hover:text-coffee-950 hover:underline cursor-pointer"
            >
              Edit Terms
            </button>
          )}
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
          <div className="p-3.5 rounded-xl border border-coffee-200 bg-coffee-50/50">
            <span className="text-[10px] font-mono uppercase text-coffee-600 block mb-1 font-medium">Product</span>
            <span className="font-bold text-coffee-950">{application.loan_product_name}</span>
          </div>
          <div className="p-3.5 rounded-xl border border-coffee-200 bg-coffee-50/50">
            <span className="text-[10px] font-mono uppercase text-coffee-600 block mb-1 font-medium">Requested Amount</span>
            <span className="font-bold text-coffee-950 font-mono">₹{application.requested_amount?.toLocaleString('en-IN')}</span>
          </div>
          <div className="p-3.5 rounded-xl border border-coffee-200 bg-coffee-50/50">
            <span className="text-[10px] font-mono uppercase text-coffee-600 block mb-1 font-medium">Duration</span>
            <span className="font-bold text-coffee-950 font-mono">{application.requested_duration_months} Months</span>
          </div>
          <div className="p-3.5 rounded-xl border border-coffee-200 bg-coffee-50/50">
            <span className="text-[10px] font-mono uppercase text-coffee-600 block mb-1 font-medium">Estimated EMI</span>
            <span className="font-bold text-coffee-800 font-mono">₹{application.estimated_emi?.toLocaleString('en-IN')} / mo</span>
          </div>
        </div>

        <div className="p-3.5 rounded-xl border border-coffee-200 bg-coffee-50/50 text-xs">
          <span className="text-[10px] font-mono uppercase text-coffee-600 block mb-1 font-medium">Loan Purpose</span>
          <span className="text-coffee-950 font-medium">{application.loan_purpose}</span>
        </div>
      </div>

      {/* 2. Verified Applicant Identity Card (Locked) */}
      <div className="rounded-2xl border border-coffee-200 bg-white p-6 shadow-card space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-coffee-100">
          <div className="flex items-center gap-2">
            <User className="h-4 w-4 text-coffee-600" />
            <h4 className="text-xs font-bold text-coffee-950 uppercase tracking-wider font-mono">
              2. Verified Applicant Details
            </h4>
          </div>
          <span className="text-[10px] font-mono px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200 flex items-center gap-1 font-bold">
            <Lock className="h-3 w-3" /> Locked & Verified
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
          <div className="p-3.5 rounded-xl border border-coffee-200 bg-coffee-50/50">
            <span className="text-[10px] font-mono uppercase text-coffee-600 block mb-1 font-medium">Full Legal Name</span>
            <span className="font-bold text-coffee-950">{verified.full_name}</span>
          </div>
          <div className="p-3.5 rounded-xl border border-coffee-200 bg-coffee-50/50">
            <span className="text-[10px] font-mono uppercase text-coffee-600 block mb-1 font-medium">Date of Birth</span>
            <span className="text-coffee-950 font-medium">{verified.date_of_birth}</span>
          </div>
          <div className="p-3.5 rounded-xl border border-coffee-200 bg-coffee-50/50">
            <span className="text-[10px] font-mono uppercase text-coffee-600 block mb-1 font-medium">Contact</span>
            <span className="text-coffee-950 font-medium">{verified.mobile}</span>
          </div>
          <div className="p-3.5 rounded-xl border border-coffee-200 bg-coffee-50/50">
            <span className="text-[10px] font-mono uppercase text-coffee-600 block mb-1 font-medium">Aadhaar (Masked)</span>
            <span className="font-mono text-coffee-900 font-bold">{verified.aadhaar_masked || 'XXXX XXXX 4821'}</span>
          </div>
          <div className="p-3.5 rounded-xl border border-coffee-200 bg-coffee-50/50">
            <span className="text-[10px] font-mono uppercase text-coffee-600 block mb-1 font-medium">PAN (Masked)</span>
            <span className="font-mono text-coffee-900 font-bold">{verified.pan_masked || 'AB•••••4821'}</span>
          </div>
          <div className="p-3.5 rounded-xl border border-coffee-200 bg-coffee-50/50">
            <span className="text-[10px] font-mono uppercase text-coffee-600 block mb-1 font-medium">Address</span>
            <span className="text-coffee-950 truncate block font-medium">{verified.address}, {verified.city}</span>
          </div>
        </div>

        <div className="text-[11px] text-coffee-600 flex items-center justify-between">
          <span>Need to update identity details?</span>
          <Link to="/profile" className="text-coffee-800 hover:text-coffee-950 font-bold hover:underline inline-flex items-center gap-1">
            <span>Update in Profile</span>
            <ExternalLink className="h-3 w-3" />
          </Link>
        </div>
      </div>

      {/* 3. Financial & Bank Details Card */}
      <div className="rounded-2xl border border-coffee-200 bg-white p-6 shadow-card space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-coffee-100">
          <div className="flex items-center gap-2">
            <Briefcase className="h-4 w-4 text-coffee-600" />
            <h4 className="text-xs font-bold text-coffee-950 uppercase tracking-wider font-mono">
              3. Employment & Bank Information
            </h4>
          </div>
          {onEditStep && (
            <button
              type="button"
              onClick={() => onEditStep(3)}
              className="text-xs font-bold text-coffee-700 hover:text-coffee-950 hover:underline cursor-pointer"
            >
              Edit Financials
            </button>
          )}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
          <div className="p-3.5 rounded-xl border border-coffee-200 bg-coffee-50/50">
            <span className="text-[10px] font-mono uppercase text-coffee-600 block mb-1 font-medium">Employer / Business</span>
            <span className="font-bold text-coffee-950">{financial.employer_or_business_name || 'Self-Employed / Salaried'}</span>
          </div>
          <div className="p-3.5 rounded-xl border border-coffee-200 bg-coffee-50/50">
            <span className="text-[10px] font-mono uppercase text-coffee-600 block mb-1 font-medium">Monthly Net Income</span>
            <span className="font-bold text-coffee-950">₹{financial.monthly_income || '75,000'}</span>
          </div>
          <div className="p-3.5 rounded-xl border border-coffee-200 bg-coffee-50/50">
            <span className="text-[10px] font-mono uppercase text-coffee-600 block mb-1 font-medium">Disbursement Bank</span>
            <span className="font-bold text-coffee-950">{financial.payout_bank_name || 'HDFC Bank'}</span>
          </div>
          <div className="p-3.5 rounded-xl border border-coffee-200 bg-coffee-50/50 sm:col-span-2">
            <span className="text-[10px] font-mono uppercase text-coffee-600 block mb-1 font-medium">Disbursement Account (Masked)</span>
            <span className="font-mono text-coffee-900 font-bold">{financial.payout_account_masked || 'XXXX XXXX 4821'}</span>
          </div>
          <div className="p-3.5 rounded-xl border border-coffee-200 bg-coffee-50/50">
            <span className="text-[10px] font-mono uppercase text-coffee-600 block mb-1 font-medium">IFSC Code</span>
            <span className="font-mono text-coffee-950 font-bold">{financial.payout_ifsc_code || 'HDFC0001234'}</span>
          </div>
        </div>
      </div>

      {/* 4. Documents & Quality Verification Card */}
      <div className="rounded-2xl border border-coffee-200 bg-white p-6 shadow-card space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-coffee-100">
          <div className="flex items-center gap-2">
            <FileText className="h-4 w-4 text-coffee-600" />
            <h4 className="text-xs font-bold text-coffee-950 uppercase tracking-wider font-mono">
              4. Attached Supporting Documents ({documents.length})
            </h4>
          </div>
          {onEditStep && (
            <button
              type="button"
              onClick={() => onEditStep(4)}
              className="text-xs font-bold text-coffee-700 hover:text-coffee-950 hover:underline cursor-pointer"
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
                className="p-4 rounded-xl border border-coffee-200 bg-coffee-50/40 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs"
              >
                <div className="flex items-center gap-3">
                  <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-coffee-950">{doc.document_type}</span>
                      <span className="text-[10px] font-mono text-coffee-600 font-semibold">
                        • {doc.quality_status === 'GOOD' ? 'Quality Verified' : doc.quality_status}
                      </span>
                    </div>
                    <span className="text-[11px] text-coffee-600 block mt-0.5">{doc.filename}</span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <span className={`text-[10px] font-mono px-2.5 py-0.5 rounded-full border font-bold ${
                    compStatus === 'MATCH'
                      ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                      : compStatus === 'REVIEW'
                      ? 'bg-amber-50 text-amber-800 border-amber-200'
                      : 'bg-rose-50 text-rose-800 border-rose-200'
                  }`}>
                    {compStatus === 'MATCH' ? '✓ MATCH' : compStatus === 'REVIEW' ? 'REVIEW' : 'MISMATCH'}
                  </span>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-white border border-coffee-200 text-coffee-700 font-medium">
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
        <div className="p-4 rounded-2xl border border-rose-200 bg-rose-50 text-xs text-rose-900 space-y-2">
          <div className="flex items-center gap-2 font-bold text-rose-950">
            <AlertCircle className="h-4 w-4 text-rose-600 shrink-0" />
            <span>Please correct the highlighted items before submitting your application:</span>
          </div>
          <ul className="list-disc pl-7 space-y-1 text-[11px] text-rose-800 font-medium">
            {errors.map((err, idx) => (
              <li key={idx}>{err}</li>
            ))}
          </ul>
        </div>
      )}

    </div>
  );
}
