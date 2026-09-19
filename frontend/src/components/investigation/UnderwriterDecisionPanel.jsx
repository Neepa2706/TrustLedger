import React, { useState } from 'react';
import {
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  HelpCircle,
  FileText,
  UserCheck,
  Send,
  Loader2,
  Lock,
  ChevronRight,
  Info
} from 'lucide-react';
import loanService from '../../services/loanService';

export default function UnderwriterDecisionPanel({ application, onDecisionComplete }) {
  const [activeModal, setActiveModal] = useState(null); // 'APPROVE' | 'REQUEST_ACTION' | 'REJECT' | null
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successToast, setSuccessToast] = useState('');

  // Underwriter credentials
  const lenderId = 'usr_lead_alex';
  const lenderName = 'Alex Sterling (Lead Underwriter)';

  // Approve Form State
  const defaultAmount = application?.requestedAmountNum || 200000;
  const defaultDuration = application?.durationMonths || 24;
  const defaultRate = 13.5;
  const defaultEmi = Math.round(
    (defaultAmount * (defaultRate / 1200) * Math.pow(1 + defaultRate / 1200, defaultDuration)) /
    (Math.pow(1 + defaultRate / 1200, defaultDuration) - 1)
  ) || 9557;

  const [approveTerms, setApproveTerms] = useState({
    amount: defaultAmount,
    durationMonths: defaultDuration,
    interestRate: defaultRate,
    emi: defaultEmi,
    decisionReason: 'Identity, bank statement and document verification confirmed. Satisfactory risk profile.'
  });

  // Request Action Form State
  const [actionReq, setActionReq] = useState({
    message: 'Please upload a clearer PDF copy of your last month bank statement directly exported from internet banking.',
    internalNote: 'Verifying net salary credit transaction IDs against employer payroll account.'
  });

  // Reject Form State
  const [rejectForm, setRejectForm] = useState({
    reasonCategory: 'Document authenticity discrepancy',
    reason: 'Bank statement formatting anomalies detected; unable to verify stable monthly salary credits.',
    internalNote: 'High tampering risk score on salary slip and bank statement.'
  });

  const handleApproveSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrorMsg('');
    try {
      await loanService.submitUnderwriterDecision(
        application.id,
        {
          decision: 'APPROVED',
          approved_amount: Number(approveTerms.amount),
          approved_duration_months: Number(approveTerms.durationMonths),
          approved_interest_rate: Number(approveTerms.interestRate),
          approved_emi: Number(approveTerms.emi),
          decision_reason: approveTerms.decisionReason
        },
        lenderId,
        lenderName
      );
      setSuccessToast('Application approved successfully with finalized loan terms.');
      setActiveModal(null);
      if (onDecisionComplete) onDecisionComplete('APPROVED');
    } catch (err) {
      setErrorMsg(err.message || 'Failed to submit approval.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleActionSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrorMsg('');
    try {
      await loanService.submitUnderwriterDecision(
        application.id,
        {
          decision: 'REQUEST_ACTION',
          action_message: actionReq.message,
          internal_note: actionReq.internalNote
        },
        lenderId,
        lenderName
      );
      setSuccessToast('Action requested from applicant. Status updated to Action Required.');
      setActiveModal(null);
      if (onDecisionComplete) onDecisionComplete('ACTION_REQUIRED');
    } catch (err) {
      setErrorMsg(err.message || 'Failed to request action.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleRejectSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrorMsg('');
    try {
      await loanService.submitUnderwriterDecision(
        application.id,
        {
          decision: 'REJECTED',
          decision_reason: `${rejectForm.reasonCategory}: ${rejectForm.reason}`,
          internal_note: rejectForm.internalNote
        },
        lenderId,
        lenderName
      );
      setSuccessToast('Application rejected. Official underwriter determination recorded.');
      setActiveModal(null);
      if (onDecisionComplete) onDecisionComplete('REJECTED');
    } catch (err) {
      setErrorMsg(err.message || 'Failed to record rejection.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const currentStatus = application?.applicationStatus || 'UNDER_REVIEW';

  return (
    <div className="rounded-2xl border border-coffee-200 bg-white p-6 shadow-sm space-y-5">
      {/* Toast Notification */}
      {successToast && (
        <div className="p-3.5 rounded-xl border border-emerald-300 bg-emerald-50 text-xs font-mono text-emerald-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-700" />
            <span>{successToast}</span>
          </div>
          <button onClick={() => setSuccessToast('')} className="text-emerald-700 hover:text-emerald-900">✕</button>
        </div>
      )}

      {/* Decision Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-coffee-100">
        <div>
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-coffee-700" />
            <h2 className="text-base font-bold text-espresso tracking-wide">
              Underwriter Decisioning Authority
            </h2>
          </div>
          <p className="text-xs text-stone-500 mt-1">
            Human-in-the-loop credit adjudication. Authorize loan approval, request clarification, or reject.
          </p>
        </div>

        <div className="text-right">
          <span className="text-[11px] font-mono text-stone-500 block">Authorizing Officer:</span>
          <span className="text-xs font-mono font-semibold text-coffee-800">{lenderName}</span>
        </div>
      </div>

      {/* Current Status Overview */}
      {currentStatus === 'APPROVED' && (
        <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-4 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="h-2.5 w-2.5 rounded-full bg-emerald-600"></span>
              <span className="text-xs font-mono font-bold text-emerald-800 tracking-wider">
                APPLICATION APPROVED & FORMALIZED
              </span>
            </div>
            <span className="text-[11px] font-mono text-emerald-700">
              Authorized by {application.approvedTerms?.decision_by || 'Underwriter'}
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2 border-t border-emerald-200">
            <div>
              <div className="text-[10px] font-mono text-stone-500">Approved Loan</div>
              <div className="text-sm font-mono font-bold text-espresso">
                ₹{Number(application.approvedTerms?.approved_amount || defaultAmount).toLocaleString('en-IN')}
              </div>
            </div>
            <div>
              <div className="text-[10px] font-mono text-stone-500">Duration</div>
              <div className="text-sm font-mono font-bold text-espresso">
                {application.approvedTerms?.approved_duration_months || defaultDuration} Months
              </div>
            </div>
            <div>
              <div className="text-[10px] font-mono text-stone-500">Interest Rate</div>
              <div className="text-sm font-mono font-bold text-emerald-700">
                {application.approvedTerms?.approved_interest_rate || defaultRate}% p.a.
              </div>
            </div>
            <div>
              <div className="text-[10px] font-mono text-stone-500">Monthly EMI</div>
              <div className="text-sm font-mono font-bold text-coffee-800">
                ₹{Number(application.approvedTerms?.approved_emi || defaultEmi).toLocaleString('en-IN')}
              </div>
            </div>
          </div>
        </div>
      )}

      {currentStatus === 'ACTION_REQUIRED' && (
        <div className="rounded-xl border border-amber-200 bg-amber-50 p-4 space-y-2">
          <div className="flex items-center gap-2 text-amber-800 font-mono text-xs font-bold">
            <AlertTriangle className="w-4 h-4 text-amber-700" />
            <span>ACTION REQUESTED FROM BORROWER</span>
          </div>
          <p className="text-xs text-amber-900 font-sans">
            Prompt sent: "{application.actionRequest?.message || actionReq.message}"
          </p>
          <span className="text-[10px] font-mono text-stone-500 block pt-1">
            Status will automatically revert to Under Review once the applicant provides the requested details.
          </span>
        </div>
      )}

      {currentStatus === 'REJECTED' && (
        <div className="rounded-xl border border-rose-200 bg-rose-50 p-4 space-y-2">
          <div className="flex items-center gap-2 text-rose-800 font-mono text-xs font-bold">
            <XCircle className="w-4 h-4 text-rose-700" />
            <span>APPLICATION REJECTED</span>
          </div>
          <p className="text-xs text-rose-900 font-sans">
            Reason: {application.rejectionReason || rejectForm.reason}
          </p>
        </div>
      )}

      {/* Decision Action Buttons */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
        <button
          onClick={() => { setActiveModal('APPROVE'); setErrorMsg(''); }}
          className="flex items-center justify-center gap-2 rounded-xl border border-emerald-300 bg-emerald-50 hover:bg-emerald-100 p-3.5 text-xs font-mono font-bold text-emerald-800 transition-all shadow-xs group"
        >
          <CheckCircle2 className="w-4 h-4 text-emerald-700 group-hover:scale-110 transition-transform" />
          <span>APPROVE APPLICATION</span>
        </button>

        <button
          onClick={() => { setActiveModal('REQUEST_ACTION'); setErrorMsg(''); }}
          className="flex items-center justify-center gap-2 rounded-xl border border-amber-300 bg-amber-50 hover:bg-amber-100 p-3.5 text-xs font-mono font-bold text-amber-800 transition-all shadow-xs group"
        >
          <AlertTriangle className="w-4 h-4 text-amber-700 group-hover:scale-110 transition-transform" />
          <span>REQUEST ACTION / DOCS</span>
        </button>

        <button
          onClick={() => { setActiveModal('REJECT'); setErrorMsg(''); }}
          className="flex items-center justify-center gap-2 rounded-xl border border-rose-300 bg-rose-50 hover:bg-rose-100 p-3.5 text-xs font-mono font-bold text-rose-800 transition-all shadow-xs group"
        >
          <XCircle className="w-4 h-4 text-rose-700 group-hover:scale-110 transition-transform" />
          <span>REJECT APPLICATION</span>
        </button>
      </div>

      {/* MODAL 1: APPROVE LOAN */}
      {activeModal === 'APPROVE' && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-espresso/50 backdrop-blur-sm p-4 animate-fadeIn">
          <div className="rounded-2xl border border-coffee-200 bg-white p-6 max-w-lg w-full shadow-2xl space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-coffee-100">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-emerald-700" />
                <h3 className="text-sm font-bold text-espresso font-mono">Approve Loan Application</h3>
              </div>
              <button onClick={() => setActiveModal(null)} className="text-stone-400 hover:text-stone-700">✕</button>
            </div>

            {errorMsg && (
              <div className="p-2.5 rounded-xl border border-rose-200 bg-rose-50 text-xs text-rose-800 font-mono">
                {errorMsg}
              </div>
            )}

            <form onSubmit={handleApproveSubmit} className="space-y-4 text-xs font-mono">
              <div className="p-3 rounded-xl border border-emerald-200 bg-emerald-50 text-emerald-900 text-[11px] font-sans">
                You are about to issue an authorized credit approval for <strong>{application.applicant}</strong> ({application.id}). Please review and finalize the approved loan terms below.
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-stone-600 block mb-1 font-medium">Approved Amount (₹)</label>
                  <input
                    type="number"
                    value={approveTerms.amount}
                    onChange={(e) => {
                      const amt = Number(e.target.value);
                      const emi = Math.round(
                        (amt * (approveTerms.interestRate / 1200) * Math.pow(1 + approveTerms.interestRate / 1200, approveTerms.durationMonths)) /
                        (Math.pow(1 + approveTerms.interestRate / 1200, approveTerms.durationMonths) - 1)
                      ) || 0;
                      setApproveTerms({ ...approveTerms, amount: amt, emi });
                    }}
                    className="w-full rounded-xl border border-coffee-200 bg-white p-2.5 text-espresso font-mono focus:border-coffee-500 focus:outline-none"
                    required
                  />
                </div>
                <div>
                  <label className="text-stone-600 block mb-1 font-medium">Tenure (Months)</label>
                  <input
                    type="number"
                    value={approveTerms.durationMonths}
                    onChange={(e) => {
                      const dur = Number(e.target.value);
                      const emi = Math.round(
                        (approveTerms.amount * (approveTerms.interestRate / 1200) * Math.pow(1 + approveTerms.interestRate / 1200, dur)) /
                        (Math.pow(1 + approveTerms.interestRate / 1200, dur) - 1)
                      ) || 0;
                      setApproveTerms({ ...approveTerms, durationMonths: dur, emi });
                    }}
                    className="w-full rounded-xl border border-coffee-200 bg-white p-2.5 text-espresso font-mono focus:border-coffee-500 focus:outline-none"
                    required
                  />
                </div>
                <div>
                  <label className="text-stone-600 block mb-1 font-medium">Annual Interest Rate (%)</label>
                  <input
                    type="number"
                    step="0.1"
                    value={approveTerms.interestRate}
                    onChange={(e) => {
                      const rate = Number(e.target.value);
                      const emi = Math.round(
                        (approveTerms.amount * (rate / 1200) * Math.pow(1 + rate / 1200, approveTerms.durationMonths)) /
                        (Math.pow(1 + rate / 1200, approveTerms.durationMonths) - 1)
                      ) || 0;
                      setApproveTerms({ ...approveTerms, interestRate: rate, emi });
                    }}
                    className="w-full rounded-xl border border-coffee-200 bg-white p-2.5 text-espresso font-mono focus:border-coffee-500 focus:outline-none"
                    required
                  />
                </div>
                <div>
                  <label className="text-stone-600 block mb-1 font-medium">Calculated Monthly EMI (₹)</label>
                  <input
                    type="number"
                    value={approveTerms.emi}
                    onChange={(e) => setApproveTerms({ ...approveTerms, emi: Number(e.target.value) })}
                    className="w-full rounded-xl border border-coffee-200 bg-warm-50 p-2.5 text-coffee-800 font-mono font-bold focus:border-coffee-500 focus:outline-none"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="text-stone-600 block mb-1 font-medium">Underwriter Rationale / Signoff Note</label>
                <textarea
                  rows={3}
                  value={approveTerms.decisionReason}
                  onChange={(e) => setApproveTerms({ ...approveTerms, decisionReason: e.target.value })}
                  className="w-full rounded-xl border border-coffee-200 bg-white p-2.5 text-espresso font-sans text-xs focus:border-coffee-500 focus:outline-none"
                  required
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-coffee-100">
                <button
                  type="button"
                  onClick={() => setActiveModal(null)}
                  className="px-4 py-2 rounded-xl border border-coffee-200 text-stone-600 hover:text-stone-900 bg-warm-50 hover:bg-warm-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold transition-all disabled:opacity-50 shadow-sm"
                >
                  {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <ShieldCheck className="w-4 h-4" />}
                  <span>Confirm Approval & Publish Terms</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 2: REQUEST ACTION */}
      {activeModal === 'REQUEST_ACTION' && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-espresso/50 backdrop-blur-sm p-4 animate-fadeIn">
          <div className="rounded-2xl border border-coffee-200 bg-white p-6 max-w-lg w-full shadow-2xl space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-coffee-100">
              <div className="flex items-center gap-2">
                <AlertTriangle className="w-5 h-5 text-amber-700" />
                <h3 className="text-sm font-bold text-espresso font-mono">Request Borrower Action</h3>
              </div>
              <button onClick={() => setActiveModal(null)} className="text-stone-400 hover:text-stone-700">✕</button>
            </div>

            {errorMsg && (
              <div className="p-2.5 rounded-xl border border-rose-200 bg-rose-50 text-xs text-rose-800 font-mono">
                {errorMsg}
              </div>
            )}

            <form onSubmit={handleActionSubmit} className="space-y-4 text-xs font-mono">
              <div className="text-[11px] font-sans text-stone-600">
                Specify what documents or information the applicant must supply. The borrower will receive an immediate action alert in their status tracker.
              </div>

              <div>
                <label className="text-stone-600 block mb-1 font-medium">Borrower Action Prompt (Visible to Applicant)</label>
                <textarea
                  rows={3}
                  value={actionReq.message}
                  onChange={(e) => setActionReq({ ...actionReq, message: e.target.value })}
                  className="w-full rounded-xl border border-coffee-200 bg-white p-2.5 text-espresso font-sans text-xs focus:border-coffee-500 focus:outline-none"
                  required
                />
              </div>

              {/* Quick Template Prompts */}
              <div className="space-y-1.5">
                <span className="text-[10px] text-stone-500 uppercase font-semibold">Quick Presets:</span>
                <div className="flex flex-wrap gap-1.5">
                  <button
                    type="button"
                    onClick={() => setActionReq({ ...actionReq, message: 'Please upload a clearer PDF copy of your last month bank statement directly exported from internet banking.' })}
                    className="px-2 py-1 rounded-lg bg-warm-50 border border-coffee-200 text-[10px] text-coffee-800 hover:border-coffee-400"
                  >
                    Clearer Bank Statement
                  </button>
                  <button
                    type="button"
                    onClick={() => setActionReq({ ...actionReq, message: 'Please upload your latest 3 months salary slips or Form 16 to verify active employment.' })}
                    className="px-2 py-1 rounded-lg bg-warm-50 border border-coffee-200 text-[10px] text-coffee-800 hover:border-coffee-400"
                  >
                    Salary Slips / Form 16
                  </button>
                  <button
                    type="button"
                    onClick={() => setActionReq({ ...actionReq, message: 'Please provide current residential utility bill (electricity/broadband) as proof of address.' })}
                    className="px-2 py-1 rounded-lg bg-warm-50 border border-coffee-200 text-[10px] text-coffee-800 hover:border-coffee-400"
                  >
                    Alternate Address Proof
                  </button>
                </div>
              </div>

              <div>
                <label className="text-stone-600 block mb-1 font-medium">
                  Internal Investigator Note (Strictly Private to Underwriters)
                </label>
                <input
                  type="text"
                  value={actionReq.internalNote}
                  onChange={(e) => setActionReq({ ...actionReq, internalNote: e.target.value })}
                  className="w-full rounded-xl border border-coffee-200 bg-white p-2.5 text-espresso font-sans text-xs focus:border-coffee-500 focus:outline-none"
                  placeholder="Private audit rationale..."
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-coffee-100">
                <button
                  type="button"
                  onClick={() => setActiveModal(null)}
                  className="px-4 py-2 rounded-xl border border-coffee-200 text-stone-600 hover:text-stone-900 bg-warm-50 hover:bg-warm-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-bold transition-all disabled:opacity-50 shadow-sm"
                >
                  {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                  <span>Send Action Request</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 3: REJECT APPLICATION */}
      {activeModal === 'REJECT' && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-espresso/50 backdrop-blur-sm p-4 animate-fadeIn">
          <div className="rounded-2xl border border-coffee-200 bg-white p-6 max-w-lg w-full shadow-2xl space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-coffee-100">
              <div className="flex items-center gap-2">
                <XCircle className="w-5 h-5 text-rose-700" />
                <h3 className="text-sm font-bold text-espresso font-mono">Reject Loan Application</h3>
              </div>
              <button onClick={() => setActiveModal(null)} className="text-stone-400 hover:text-stone-700">✕</button>
            </div>

            {errorMsg && (
              <div className="p-2.5 rounded-xl border border-rose-200 bg-rose-50 text-xs text-rose-800 font-mono">
                {errorMsg}
              </div>
            )}

            <form onSubmit={handleRejectSubmit} className="space-y-4 text-xs font-mono">
              <div>
                <label className="text-stone-600 block mb-1 font-medium">Rejection Primary Category</label>
                <select
                  value={rejectForm.reasonCategory}
                  onChange={(e) => setRejectForm({ ...rejectForm, reasonCategory: e.target.value })}
                  className="w-full rounded-xl border border-coffee-200 bg-white p-2.5 text-espresso font-mono focus:border-coffee-500 focus:outline-none"
                >
                  <option value="Document authenticity discrepancy">Document authenticity discrepancy</option>
                  <option value="High risk profile / debt obligations">High risk profile / debt obligations</option>
                  <option value="Unverifiable identity or employment">Unverifiable identity or employment</option>
                  <option value="Internal credit policy guidelines">Internal credit policy guidelines</option>
                </select>
              </div>

              <div>
                <label className="text-stone-600 block mb-1 font-medium">Borrower Notice Explanation</label>
                <textarea
                  rows={2}
                  value={rejectForm.reason}
                  onChange={(e) => setRejectForm({ ...rejectForm, reason: e.target.value })}
                  className="w-full rounded-xl border border-coffee-200 bg-white p-2.5 text-espresso font-sans text-xs focus:border-coffee-500 focus:outline-none"
                  required
                />
              </div>

              <div>
                <label className="text-stone-600 block mb-1 font-medium">
                  Internal Underwriting Note (Strictly Private)
                </label>
                <textarea
                  rows={2}
                  value={rejectForm.internalNote}
                  onChange={(e) => setRejectForm({ ...rejectForm, internalNote: e.target.value })}
                  className="w-full rounded-xl border border-coffee-200 bg-white p-2.5 text-espresso font-sans text-xs focus:border-coffee-500 focus:outline-none"
                  placeholder="Private audit rationale for lender logs..."
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-coffee-100">
                <button
                  type="button"
                  onClick={() => setActiveModal(null)}
                  className="px-4 py-2 rounded-xl border border-coffee-200 text-stone-600 hover:text-stone-900 bg-warm-50 hover:bg-warm-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold transition-all disabled:opacity-50 shadow-sm"
                >
                  {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <XCircle className="w-4 h-4" />}
                  <span>Confirm Rejection</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
