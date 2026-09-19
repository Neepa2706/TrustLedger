/**
 * TrustLedger KYCVerificationCard Component
 * Renders the consolidated KYC security checklist:
 * - Profile identity
 * - Identity document
 * - Profile photograph (camera capture only)
 * - Face / KYC quality check
 * - Document cross-comparison
 * 
 * Overall statuses:
 * - READY FOR SUBMISSION (Emerald green)
 * - REVIEW REQUIRED (Amber with advisory)
 * - BLOCKED (Red with constructive guidance and 'Fix Document' action)
 */

import React from 'react';
import {
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  Clock,
  Camera,
  FileCheck2,
  UserCheck,
  Sparkles,
  ExternalLink,
  ChevronRight
} from 'lucide-react';

export default function KYCVerificationCard({
  kycResult,
  overallStatus = 'READY_FOR_SUBMISSION',
  onFixDocument,
  onRetakePhoto
}) {
  if (!kycResult) return null;

  const isReady = overallStatus === 'READY_FOR_SUBMISSION';
  const isReview = overallStatus === 'REVIEW_REQUIRED';
  const isBlocked = overallStatus === 'BLOCKED' || !kycResult.can_submit;

  const checks = kycResult.checks || [
    { key: 'profile_identity', title: 'Profile identity', status: 'completed', detail: 'Identity details and contact confirmed.' },
    { key: 'identity_document', title: 'Identity document', status: 'completed', detail: 'Pre-verified government document available.' },
    { key: 'profile_photo', title: 'Profile photograph', status: 'completed', detail: 'Live camera photograph registered.' },
    { key: 'face_quality', title: 'Face / KYC quality check', status: 'passed', detail: 'Single face detected with clear framing.' },
    { key: 'cross_check', title: 'Document cross-check', status: 'passed', detail: 'Document details consistent with registered profile.' }
  ];

  return (
    <div className={`rounded-2xl border bg-white p-5 sm:p-6 shadow-card transition-all ${
      isReady
        ? 'border-emerald-200 ring-1 ring-emerald-100'
        : isReview
        ? 'border-amber-200 ring-1 ring-amber-100'
        : 'border-red-200 ring-1 ring-red-100'
    }`}>
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-coffee-100">
        <div className="flex items-center gap-3">
          <div className={`w-10 h-10 rounded-xl flex items-center justify-center border shadow-xs ${
            isReady
              ? 'bg-emerald-50 border-emerald-200 text-emerald-700'
              : isReview
              ? 'bg-amber-50 border-amber-200 text-amber-700'
              : 'bg-red-50 border-red-200 text-red-700'
          }`}>
            <ShieldCheck className="h-5 w-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-bold text-espresso uppercase tracking-wider font-mono">
                KYC Verification Checklist
              </h3>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-coffee-50 text-coffee-700 border border-coffee-200 font-medium">
                Phase 3 Security Gate
              </span>
            </div>
            <p className="text-xs text-stone-600 mt-0.5">
              Automated optical quality inspection and profile cross-verification
            </p>
          </div>
        </div>

        {/* Overall Status Badge */}
        <div>
          <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-mono font-bold uppercase tracking-wider border ${
            isReady
              ? 'bg-emerald-50 text-emerald-700 border-emerald-200 shadow-xs'
              : isReview
              ? 'bg-amber-50 text-amber-800 border-amber-200'
              : 'bg-red-50 text-red-700 border-red-200'
          }`}>
            {isReady && <CheckCircle2 className="h-3.5 w-3.5" />}
            {isReview && <Clock className="h-3.5 w-3.5" />}
            {isBlocked && <AlertCircle className="h-3.5 w-3.5" />}
            <span>
              {isReady
                ? 'READY FOR SUBMISSION'
                : isReview
                ? 'REVIEW REQUIRED'
                : 'SUBMISSION BLOCKED'}
            </span>
          </span>
        </div>
      </div>

      {/* Checklist Items */}
      <div className="divide-y divide-coffee-100 my-4">
        {checks.map((item) => {
          const isPassed = item.status === 'completed' || item.status === 'passed';
          const isItemReview = item.status === 'review';
          const isFailed = item.status === 'failed';

          return (
            <div key={item.key} className="py-3 flex items-start justify-between gap-3 text-xs">
              <div className="flex items-start gap-3">
                <div className="mt-0.5">
                  {isPassed ? (
                    <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />
                  ) : isItemReview ? (
                    <Clock className="h-4 w-4 text-amber-600 shrink-0" />
                  ) : isFailed ? (
                    <AlertCircle className="h-4 w-4 text-red-600 shrink-0" />
                  ) : (
                    <div className="h-4 w-4 rounded-full border border-stone-300 shrink-0" />
                  )}
                </div>
                <div>
                  <span className="font-semibold text-espresso block">
                    {item.title}
                  </span>
                  <span className="text-[11px] text-stone-600 block mt-0.5 leading-relaxed">
                    {item.detail}
                  </span>
                </div>
              </div>

              <span className={`text-[10px] font-mono px-2 py-0.5 rounded border shrink-0 font-medium ${
                isPassed
                  ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                  : isItemReview
                  ? 'bg-amber-50 text-amber-800 border-amber-200'
                  : isFailed
                  ? 'bg-red-50 text-red-700 border-red-200'
                  : 'bg-stone-50 text-stone-600 border-stone-200'
              }`}>
                {isPassed ? '✓ Passed' : isItemReview ? 'Review' : isFailed ? 'Failed' : 'Pending'}
              </span>
            </div>
          );
        })}
      </div>

      {/* Blocking Action Banner if blocked */}
      {isBlocked && (
        <div className="p-3.5 rounded-xl border border-red-200 bg-red-50 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs text-red-800">
          <div>
            <span className="font-bold block text-red-900">
              Your application cannot be submitted yet.
            </span>
            <span className="text-[11px] text-red-700">
              {kycResult.blocking_reasons?.[0] || 'Please replace the document marked for review or update missing items.'}
            </span>
          </div>
          {onFixDocument && (
            <button
              type="button"
              onClick={onFixDocument}
              className="px-4 py-1.5 rounded-lg bg-red-600 hover:bg-red-700 text-white font-semibold text-xs uppercase tracking-wider shrink-0 transition"
            >
              Fix Document
            </button>
          )}
        </div>
      )}

      {/* Advisory Notice if Review Required */}
      {isReview && !isBlocked && (
        <div className="p-3 rounded-xl border border-amber-200 bg-amber-50 text-xs text-amber-900 flex items-start gap-2.5">
          <Clock className="h-4 w-4 text-amber-600 shrink-0 mt-0.5" />
          <span className="text-[11px] text-amber-800">
            Some details will undergo standard underwriter verification. You can proceed to submit your application.
          </span>
        </div>
      )}

      {/* Real vs Prototype Footnote */}
      <div className="mt-3 pt-3 border-t border-coffee-100 text-[10px] text-stone-400 flex flex-col sm:flex-row items-center justify-between gap-2 font-mono">
        <span>TrustLedger Optical & Attribute Inspection Engine</span>
        <span>Verified Identity Profile Gate</span>
      </div>
    </div>
  );
}
