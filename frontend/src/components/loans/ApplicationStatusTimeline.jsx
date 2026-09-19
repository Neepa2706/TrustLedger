/**
 * TrustLedger ApplicationStatusTimeline Component
 * Reusable progress timeline for borrower applications:
 * 1. Application Created
 * 2. Documents Submitted
 * 3. Verification Completed
 * 4. Lender Review (Active Stage)
 * 5. Decision (Future / Awaiting Underwriter)
 */

import React from 'react';
import { CheckCircle2, Clock, Circle, ArrowRight } from 'lucide-react';

export default function ApplicationStatusTimeline({
  currentStage = 4, // 1 to 5
  status = 'UNDER_REVIEW',
  submittedAt
}) {
  const isApproved = status === 'APPROVED';
  const stages = [
    {
      id: 1,
      title: 'Application Created',
      desc: 'Form filled & loan terms recorded',
      completed: currentStage > 1 || isApproved,
      current: currentStage === 1 && !isApproved
    },
    {
      id: 2,
      title: 'Documents Submitted',
      desc: 'Supporting proofs uploaded & checked',
      completed: currentStage > 2 || isApproved,
      current: currentStage === 2 && !isApproved
    },
    {
      id: 3,
      title: 'Verification Completed',
      desc: 'KYC & cross-check gates cleared',
      completed: currentStage > 3 || isApproved,
      current: currentStage === 3 && !isApproved
    },
    {
      id: 4,
      title: 'Lender Review',
      desc: 'Authorized underwriter inspection',
      completed: currentStage > 4 || isApproved,
      current: currentStage === 4 && !isApproved
    },
    {
      id: 5,
      title: 'Final Decision',
      desc: isApproved ? 'Approved & Sanctioned' : 'Lender credit determination',
      completed: isApproved,
      current: currentStage === 5 && !isApproved
    }
  ];

  return (
    <div className="rounded-2xl border border-coffee-200 bg-white p-5 sm:p-6 shadow-card space-y-5">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-coffee-100">
        <div>
          <span className="text-xs font-mono uppercase tracking-wider text-coffee-600 font-semibold">
            Progress Timeline
          </span>
          <h3 className="text-sm font-bold text-espresso mt-0.5">
            Application Lifecycle Stage
          </h3>
        </div>
        {submittedAt && (
          <span className="text-[11px] font-mono text-stone-500">
            Submitted: {new Date(submittedAt).toLocaleDateString('en-IN', {
              day: 'numeric',
              month: 'short',
              year: 'numeric'
            })}
          </span>
        )}
      </div>

      {/* Desktop Horizontal Stepper */}
      <div className="hidden lg:grid grid-cols-5 gap-2 relative">
        {stages.map((stage, idx) => {
          return (
            <div key={stage.id} className="flex flex-col items-center text-center relative group">
              {/* Connector line */}
              {idx < stages.length - 1 && (
                <div
                  className={`absolute top-4 left-1/2 w-full h-[2px] -z-0 transition-colors ${
                    stage.completed ? 'bg-emerald-500' : 'bg-coffee-200'
                  }`}
                />
              )}

              {/* Step Circle */}
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center font-mono text-xs font-bold z-10 transition-all ${
                  stage.completed
                    ? 'bg-emerald-600 text-white shadow-xs'
                    : stage.current
                    ? 'bg-coffee-700 text-white ring-4 ring-coffee-100 shadow-xs'
                    : 'bg-stone-50 border border-coffee-200 text-stone-400'
                }`}
              >
                {stage.completed ? (
                  <CheckCircle2 className="h-4 w-4" />
                ) : stage.current ? (
                  <Clock className="h-4 w-4 animate-pulse" />
                ) : (
                  <span className="text-[11px]">{stage.id}</span>
                )}
              </div>

              {/* Title & Description */}
              <div className="mt-2.5 space-y-0.5">
                <span className={`text-xs font-semibold block ${
                  stage.current ? 'text-coffee-900' : stage.completed ? 'text-espresso' : 'text-stone-400'
                }`}>
                  {stage.title}
                </span>
                <span className="text-[10px] text-stone-500 block leading-tight">
                  {stage.desc}
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Mobile Vertical Stepper */}
      <div className="lg:hidden space-y-4">
        {stages.map((stage, idx) => {
          return (
            <div key={stage.id} className="flex items-start gap-3 relative">
              {idx < stages.length - 1 && (
                <div
                  className={`absolute top-6 left-3 w-[2px] h-full -z-0 ${
                    stage.completed ? 'bg-emerald-500' : 'bg-coffee-200'
                  }`}
                />
              )}

              <div
                className={`w-6 h-6 rounded-full flex items-center justify-center font-mono text-[10px] font-bold shrink-0 z-10 ${
                  stage.completed
                    ? 'bg-emerald-600 text-white'
                    : stage.current
                    ? 'bg-coffee-700 text-white ring-2 ring-coffee-200'
                    : 'bg-stone-50 border border-coffee-200 text-stone-400'
                }`}
              >
                {stage.completed ? (
                  <CheckCircle2 className="h-3.5 w-3.5" />
                ) : stage.current ? (
                  <Clock className="h-3.5 w-3.5 animate-pulse" />
                ) : (
                  <span>{stage.id}</span>
                )}
              </div>

              <div className="space-y-0.5 pb-2">
                <span className={`text-xs font-semibold block ${
                  stage.current ? 'text-coffee-900' : stage.completed ? 'text-espresso' : 'text-stone-400'
                }`}>
                  {stage.title}
                </span>
                <span className="text-[11px] text-stone-500 block">
                  {stage.desc}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
