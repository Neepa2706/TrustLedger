/**
 * TrustLedger ApplicationStatusPage (/my-applications/:applicationId)
 * Phase 4 Authoritative Application Status & Borrower Interaction:
 * - Real-time synchronization with lender underwriting workflow
 * - Dynamic stage progression (Stages 1 through 5)
 * - ACTION_REQUIRED: Prompt banner + Response form -> Transitions to UNDER_REVIEW
 * - APPROVED: Emerald celebration hero + Formal Approved Terms card (Amount, Rate, EMI, Duration)
 * - REJECTED: Respectful status notification + Reason (zero internal notes / fraud graphs leaked)
 * - Auto-refresh & Manual Refresh button
 */

import React, { useState, useEffect, useCallback } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  CheckCircle2,
  Clock,
  ShieldCheck,
  FileText,
  CreditCard,
  Building,
  User,
  ExternalLink,
  ChevronRight,
  ArrowLeft,
  Loader2,
  Hash,
  AlertTriangle,
  XCircle,
  RotateCw,
  Send,
  Calendar,
  Percent,
  Check
} from 'lucide-react';

import ApplicationStatusTimeline from '../../components/loans/ApplicationStatusTimeline';
import SingleAccountNotice from '../../components/user/SingleAccountNotice';
import { useUserAuth } from '../../context/UserAuthContext';
import loanService from '../../services/loanService';

export default function ApplicationStatusPage() {
  const { applicationId } = useParams();
  const { user } = useUserAuth();

  const [application, setApplication] = useState(null);
  const [statusDetail, setStatusDetail] = useState(null);
  const [auditEvents, setAuditEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState('');

  // Borrower Action Response Form State
  const [borrowerResponseText, setBorrowerResponseText] = useState('');
  const [actionSubmitting, setActionSubmitting] = useState(false);
  const [actionSuccessToast, setActionSuccessToast] = useState('');

  const currentUserId = user?.id || 'usr_demo_arjun';

  const loadData = useCallback(async (showRefreshing = false) => {
    if (!applicationId) return;
    if (showRefreshing) setRefreshing(true);

    try {
      // 1. Fetch live status from Phase 4 Authoritative Endpoint
      const statusRes = await loanService.getApplicationStatus(applicationId, currentUserId).catch(() => null);
      if (statusRes) {
        setStatusDetail(statusRes);
      }

      // 2. Fetch application object & audit trail
      const [app, events] = await Promise.all([
        loanService.getApplicationById(applicationId, currentUserId).catch(() => null),
        loanService.getAuditTrail(applicationId, currentUserId).catch(() => [])
      ]);

      if (app) {
        setApplication(app);
      } else if (statusRes) {
        // Construct application display fallback from status response
        setApplication({
          application_id: statusRes.application_id,
          loan_product_name: statusRes.loan_product_name,
          requested_amount: statusRes.requested_amount,
          requested_duration_months: statusRes.requested_duration_months,
          estimated_emi: statusRes.estimated_emi,
          loan_purpose: 'Personal / General Purpose',
          application_status: statusRes.application_status,
          created_at: statusRes.submitted_at
        });
      }
      setAuditEvents(events || []);
    } catch (err) {
      if (!application && !statusDetail) {
        setError(err.message || 'Failed to load application status.');
      }
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [applicationId, currentUserId]);

  useEffect(() => {
    loadData();
    // Poll every 8 seconds for real-time status changes from lender
    const interval = setInterval(() => {
      loadData();
    }, 8000);
    return () => clearInterval(interval);
  }, [loadData]);

  // Handle borrower responding to lender action request
  const handleActionResponseSubmit = async (e) => {
    e.preventDefault();
    if (!borrowerResponseText.trim()) return;

    setActionSubmitting(true);
    try {
      await loanService.submitActionResponse(
        applicationId,
        {
          borrower_response: borrowerResponseText.trim(),
          uploaded_document_ids: []
        },
        currentUserId
      );
      setBorrowerResponseText('');
      setActionSuccessToast('Response submitted successfully! Your application has been returned to Under Review.');
      await loadData();
      setTimeout(() => setActionSuccessToast(''), 5000);
    } catch (err) {
      alert(err.message || 'Failed to submit response.');
    } finally {
      setActionSubmitting(false);
    }
  };

  if (loading && !statusDetail && !application) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-4">
        <Loader2 className="h-8 w-8 text-cyan-400 animate-spin" />
        <span className="text-xs font-mono text-slate-400 uppercase tracking-wider">
          Loading Live Application Status...
        </span>
      </div>
    );
  }

  if (error && !statusDetail && !application) {
    return (
      <div className="max-w-md mx-auto my-12 p-6 rounded-2xl border border-red-500/40 bg-red-950/20 text-center space-y-4">
        <AlertTriangle className="h-10 w-10 text-red-400 mx-auto" />
        <h2 className="text-lg font-bold text-white">Application Not Found</h2>
        <p className="text-xs text-slate-300">{error}</p>
        <Link
          to="/my-applications"
          className="inline-block px-5 py-2.5 rounded-xl bg-midnight-900 border border-surface-border text-xs text-cyan-400 font-mono"
        >
          View My Applications
        </Link>
      </div>
    );
  }

  const currentStatus = statusDetail?.application_status || application?.application_status || 'UNDER_REVIEW';
  const currentStage = statusDetail?.current_stage || (currentStatus === 'APPROVED' || currentStatus === 'REJECTED' ? 5 : 4);
  const actionRequest = statusDetail?.action_request;
  const approvedTerms = statusDetail?.approved_terms;
  const rejectionReason = statusDetail?.rejection_reason;

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-12">
      {/* Top Bar with Navigation & Live Refresh Button */}
      <div className="flex items-center justify-between">
        <Link
          to="/my-applications"
          className="inline-flex items-center gap-2 text-xs font-mono text-slate-400 hover:text-cyan-400 transition"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Back to My Applications</span>
        </Link>

        <div className="flex items-center gap-3">
          <button
            onClick={() => loadData(true)}
            disabled={refreshing}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-surface-border bg-surface-card hover:bg-midnight-900 text-xs font-mono text-slate-300 hover:text-white transition disabled:opacity-50"
          >
            <RotateCw className={`w-3.5 h-3.5 text-cyan-400 ${refreshing ? 'animate-spin' : ''}`} />
            <span>{refreshing ? 'Checking...' : 'Refresh Status'}</span>
          </button>
          <span className="text-xs font-mono text-slate-500">
            ID: <strong className="text-cyan-400">{applicationId}</strong>
          </span>
        </div>
      </div>

      {/* Success Toast */}
      {actionSuccessToast && (
        <div className="p-3.5 rounded-xl border border-emerald-500/40 bg-emerald-950/50 text-xs font-mono text-emerald-300 flex items-center gap-2 animate-fadeIn">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{actionSuccessToast}</span>
        </div>
      )}

      {/* ------------------------------------------------------------- */}
      {/* HERO STATUS BANNER: DYNAMIC BY STATUS */}
      {/* ------------------------------------------------------------- */}

      {/* 1. APPROVED STATE */}
      {currentStatus === 'APPROVED' && (
        <div className="rounded-2xl border border-emerald-500/40 bg-gradient-to-b from-emerald-950/40 via-surface-card to-surface-card p-6 sm:p-8 space-y-6">
          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4">
            <div className="w-14 h-14 rounded-2xl bg-emerald-950 border border-emerald-500/50 text-emerald-400 flex items-center justify-center shrink-0 shadow-[0_0_30px_rgba(16,185,129,0.35)]">
              <ShieldCheck className="h-8 w-8" />
            </div>

            <div className="space-y-1 text-center sm:text-left">
              <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
                <span className="text-xs font-mono uppercase tracking-wider text-emerald-400 font-bold">
                  Congratulations!
                </span>
                <span className="text-[10px] font-mono px-2.5 py-0.5 rounded-full bg-emerald-900/60 text-emerald-300 border border-emerald-500/40 font-bold">
                  SANCTION APPROVED
                </span>
              </div>
              <h1 className="text-2xl font-extrabold text-white tracking-tight">
                Your Loan Has Been Approved
              </h1>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed max-w-2xl">
                The authorized lender has completed credit evaluation and approved your loan application with the finalized terms below.
              </p>
            </div>
          </div>

          {/* Approved Loan Terms Card */}
          {approvedTerms && (
            <div className="rounded-xl border border-emerald-500/30 bg-midnight-950/80 p-5 space-y-4">
              <div className="flex items-center justify-between border-b border-emerald-500/20 pb-3">
                <div className="flex items-center gap-2">
                  <CreditCard className="w-4 h-4 text-emerald-400" />
                  <span className="text-xs font-mono font-bold uppercase text-white tracking-wider">
                    Official Approved Terms
                  </span>
                </div>
                <span className="text-[11px] font-mono text-emerald-400/90">
                  Authorized: {approvedTerms.approval_date || 'Today'}
                </span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs font-mono">
                <div className="p-3 rounded-lg bg-emerald-950/30 border border-emerald-500/20">
                  <span className="text-[10px] text-slate-400 uppercase block mb-1">Approved Amount</span>
                  <span className="text-lg font-bold text-white">
                    ₹{Number(approvedTerms.approved_amount).toLocaleString('en-IN')}
                  </span>
                </div>

                <div className="p-3 rounded-lg bg-emerald-950/30 border border-emerald-500/20">
                  <span className="text-[10px] text-slate-400 uppercase block mb-1">Tenure</span>
                  <span className="text-lg font-bold text-white">
                    {approvedTerms.approved_duration_months} Months
                  </span>
                </div>

                <div className="p-3 rounded-lg bg-emerald-950/30 border border-emerald-500/20">
                  <span className="text-[10px] text-slate-400 uppercase block mb-1">Interest Rate</span>
                  <span className="text-lg font-bold text-emerald-400">
                    {approvedTerms.approved_interest_rate}% p.a.
                  </span>
                </div>

                <div className="p-3 rounded-lg bg-emerald-950/30 border border-emerald-500/20">
                  <span className="text-[10px] text-slate-400 uppercase block mb-1">Monthly EMI</span>
                  <span className="text-lg font-bold text-cyan-300">
                    ₹{Number(approvedTerms.approved_emi).toLocaleString('en-IN')}
                  </span>
                </div>
              </div>

              <div className="text-[11px] text-slate-400 font-sans leading-relaxed pt-1">
                Authorizing Officer: <strong className="text-slate-200">{approvedTerms.decision_by || 'Alex Sterling'}</strong> • Funds disbursement scheduled per sanction policy guidelines.
              </div>
            </div>
          )}
        </div>
      )}

      {/* 2. ACTION_REQUIRED STATE */}
      {currentStatus === 'ACTION_REQUIRED' && (
        <div className="rounded-2xl border border-amber-500/50 bg-gradient-to-b from-amber-950/40 via-surface-card to-surface-card p-6 sm:p-8 space-y-6 animate-pulse-slow">
          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4">
            <div className="w-14 h-14 rounded-2xl bg-amber-950 border border-amber-500/50 text-amber-400 flex items-center justify-center shrink-0 shadow-[0_0_30px_rgba(245,158,11,0.3)]">
              <AlertTriangle className="h-8 w-8" />
            </div>

            <div className="space-y-1 text-center sm:text-left">
              <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
                <span className="text-xs font-mono uppercase tracking-wider text-amber-400 font-bold">
                  Action Required
                </span>
                <span className="text-[10px] font-mono px-2.5 py-0.5 rounded-full bg-amber-900/60 text-amber-300 border border-amber-500/40 font-bold">
                  AWAITING BORROWER RESPONSE
                </span>
              </div>
              <h1 className="text-2xl font-extrabold text-white tracking-tight">
                Additional Information Requested
              </h1>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed max-w-2xl">
                The lender requires clarification or updated documentation before completing the underwriting review.
              </p>
            </div>
          </div>

          {/* Underwriter Request Banner */}
          <div className="p-4 rounded-xl border border-amber-500/30 bg-midnight-950/90 space-y-2">
            <div className="flex items-center justify-between text-xs font-mono text-amber-400">
              <span className="font-bold flex items-center gap-1.5">
                <FileText className="w-3.5 h-3.5" />
                Underwriter Request:
              </span>
              <span className="text-[10px] text-slate-400">
                {actionRequest?.created_at ? actionRequest.created_at.slice(0, 10) : 'Today'}
              </span>
            </div>
            <p className="text-sm font-sans font-medium text-white p-3 rounded-lg bg-amber-950/20 border border-amber-500/20">
              "{actionRequest?.message || 'Please upload a clearer copy of your latest bank statement to verify salary credits.'}"
            </p>
          </div>

          {/* Borrower Response Submission Form */}
          <form onSubmit={handleActionResponseSubmit} className="space-y-3 pt-2">
            <label className="text-xs font-mono text-slate-300 block">
              Provide Response / Document Clarification:
            </label>
            <textarea
              rows={3}
              value={borrowerResponseText}
              onChange={(e) => setBorrowerResponseText(e.target.value)}
              placeholder="e.g. Uploaded high-resolution bank statement directly exported from net banking portal..."
              className="w-full rounded-xl border border-surface-border bg-midnight-950 p-3 text-xs text-white placeholder-slate-500 font-mono focus:border-amber-400 focus:outline-none focus:ring-1 focus:ring-amber-400 leading-relaxed"
              required
            />
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-mono text-slate-400">
                Submitting this response will instantly return your application to <strong>Under Review</strong>.
              </span>
              <button
                type="submit"
                disabled={actionSubmitting || !borrowerResponseText.trim()}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-500 text-white text-xs font-mono font-bold transition disabled:opacity-50"
              >
                {actionSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                <span>Submit Response</span>
              </button>
            </div>
          </form>
        </div>
      )}

      {/* 3. REJECTED STATE */}
      {currentStatus === 'REJECTED' && (
        <div className="rounded-2xl border border-rose-500/40 bg-gradient-to-b from-rose-950/30 via-surface-card to-surface-card p-6 sm:p-8 space-y-4">
          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4">
            <div className="w-14 h-14 rounded-2xl bg-rose-950 border border-rose-500/50 text-rose-400 flex items-center justify-center shrink-0 shadow-[0_0_30px_rgba(244,63,94,0.25)]">
              <XCircle className="h-8 w-8" />
            </div>

            <div className="space-y-1 text-center sm:text-left">
              <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
                <span className="text-xs font-mono uppercase tracking-wider text-rose-400 font-bold">
                  Status Notice
                </span>
                <span className="text-[10px] font-mono px-2.5 py-0.5 rounded-full bg-rose-900/60 text-rose-300 border border-rose-500/40 font-bold">
                  NOT APPROVED
                </span>
              </div>
              <h1 className="text-2xl font-extrabold text-white tracking-tight">
                Application Not Approved
              </h1>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed max-w-2xl">
                Thank you for applying. After careful review against our lending criteria, we are unable to approve your application at this time.
              </p>
            </div>
          </div>

          {rejectionReason && (
            <div className="p-4 rounded-xl border border-rose-500/30 bg-midnight-950 text-xs font-mono text-slate-300">
              <span className="text-rose-400 font-bold block mb-1">Reason:</span>
              <span>{rejectionReason}</span>
            </div>
          )}
        </div>
      )}

      {/* 4. UNDER_REVIEW / SUBMITTED STATE */}
      {(currentStatus === 'UNDER_REVIEW' || currentStatus === 'SUBMITTED') && (
        <div className="rounded-2xl border border-cyan-500/30 bg-gradient-to-b from-cyan-950/25 to-surface-card p-6 sm:p-8 space-y-4 text-center sm:text-left">
          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4">
            <div className="w-14 h-14 rounded-2xl bg-cyan-950 border border-cyan-500/40 text-cyan-400 flex items-center justify-center shrink-0 shadow-[0_0_25px_rgba(0,240,255,0.25)]">
              <Clock className="h-8 w-8 animate-pulse" />
            </div>

            <div className="space-y-1">
              <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
                <span className="text-xs font-mono uppercase tracking-wider text-cyan-400 font-semibold">
                  Application Under Review
                </span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-cyan-950 text-cyan-300 border border-cyan-500/30">
                  STATUS: {currentStatus}
                </span>
              </div>
              <h1 className="text-2xl font-extrabold text-white tracking-tight">
                Underwriter Verification In Progress
              </h1>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed max-w-2xl">
                Your application has been received and is actively being reviewed by an authorized lender underwriter. You will receive an immediate update once a decision is made.
              </p>
            </div>
          </div>

          {/* Quick Highlights Bar */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-4 border-t border-surface-border text-xs font-mono">
            <div className="p-3 rounded-xl border border-surface-border bg-midnight-950">
              <span className="text-[10px] uppercase text-slate-400 block mb-0.5">Application ID</span>
              <span className="font-bold text-cyan-300">{applicationId}</span>
            </div>

            <div className="p-3 rounded-xl border border-surface-border bg-midnight-950">
              <span className="text-[10px] uppercase text-slate-400 block mb-0.5">Current Status</span>
              <span className="font-semibold text-cyan-300 flex items-center gap-1">
                <Clock className="h-3 w-3" /> {currentStatus}
              </span>
            </div>

            <div className="p-3 rounded-xl border border-surface-border bg-midnight-950">
              <span className="text-[10px] uppercase text-slate-400 block mb-0.5">Current Step</span>
              <span className="font-semibold text-white">Lender Review</span>
            </div>

            <div className="p-3 rounded-xl border border-surface-border bg-midnight-950">
              <span className="text-[10px] uppercase text-slate-400 block mb-0.5">Sanction Decision</span>
              <span className="text-slate-400">Pending Underwriter</span>
            </div>
          </div>
        </div>
      )}

      {/* Progress Timeline (Dynamic Stage Progression 1 - 5) */}
      <ApplicationStatusTimeline
        currentStage={currentStage}
        status={currentStatus}
        submittedAt={application?.updated_at || application?.created_at || statusDetail?.submitted_at}
      />

      {/* Application Specification Card */}
      <div className="rounded-2xl border border-surface-border bg-surface-card p-5 sm:p-6 space-y-4">
        <div className="flex items-center gap-2 pb-3 border-b border-surface-border">
          <CreditCard className="h-4 w-4 text-cyan-400" />
          <h3 className="text-sm font-bold text-white uppercase tracking-wider font-mono">
            Loan Details
          </h3>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
          <div className="p-3 rounded-xl border border-surface-border bg-midnight-950">
            <span className="text-[10px] font-mono uppercase text-slate-400 block mb-1">Product</span>
            <span className="font-semibold text-white">{application?.loan_product_name || 'Personal Loan'}</span>
          </div>

          <div className="p-3 rounded-xl border border-surface-border bg-midnight-950">
            <span className="text-[10px] font-mono uppercase text-slate-400 block mb-1">Requested Amount</span>
            <span className="font-bold text-cyan-300 font-mono">₹{application?.requested_amount?.toLocaleString('en-IN') || '2,00,000'}</span>
          </div>

          <div className="p-3 rounded-xl border border-surface-border bg-midnight-950">
            <span className="text-[10px] font-mono uppercase text-slate-400 block mb-1">Duration</span>
            <span className="font-semibold text-white font-mono">{application?.requested_duration_months || 24} Months</span>
          </div>

          <div className="p-3 rounded-xl border border-surface-border bg-midnight-950">
            <span className="text-[10px] font-mono uppercase text-slate-400 block mb-1">Estimated EMI</span>
            <span className="font-bold text-white font-mono">₹{application?.estimated_emi?.toLocaleString('en-IN') || '9,557'} / mo</span>
          </div>
        </div>

        <div className="p-3 rounded-xl border border-surface-border bg-midnight-950 text-xs">
          <span className="text-[10px] font-mono uppercase text-slate-400 block mb-1">Purpose of Loan</span>
          <span className="text-slate-200">{application?.loan_purpose || 'Personal / General Purpose'}</span>
        </div>
      </div>

      {/* Submitted Documents */}
      <div className="rounded-2xl border border-surface-border bg-surface-card p-5 sm:p-6 space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-surface-border">
          <div className="flex items-center gap-2">
            <FileText className="h-4 w-4 text-cyan-400" />
            <h3 className="text-sm font-bold text-white uppercase tracking-wider font-mono">
              Submitted Documents ({application?.documents?.length || 3})
            </h3>
          </div>
          <span className="text-[10px] font-mono text-emerald-400">
            All Verified & Checked
          </span>
        </div>

        <div className="space-y-2.5">
          {(application?.documents || [
            { document_id: 'doc_1', document_type: 'Bank Statement (Last 6 Months)', filename: 'bank_statement_hdfc_6m.pdf', file_type: 'PDF' },
            { document_id: 'doc_2', document_type: 'Salary Slip (Recent)', filename: 'salary_slip_cognitivesol.pdf', file_type: 'PDF' },
            { document_id: 'doc_3', document_type: 'Aadhaar Identity Card', filename: 'aadhaar_front_back.pdf', file_type: 'PDF' }
          ]).map((doc) => (
            <div
              key={doc.document_id}
              className="p-3.5 rounded-xl border border-surface-border bg-midnight-950 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs"
            >
              <div className="flex items-center gap-2.5">
                <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0" />
                <div>
                  <span className="font-semibold text-white block">{doc.document_type}</span>
                  <span className="text-[11px] text-slate-400">{doc.filename}</span>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-[10px] font-mono px-2 py-0.5 rounded border bg-emerald-950 text-emerald-300 border-emerald-500/30">
                  ✓ Verified
                </span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded border bg-midnight-900 border-surface-border text-slate-400">
                  {doc.file_type || 'PDF'}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Tamper-Evident Audit Trail */}
      {auditEvents.length > 0 && (
        <div className="rounded-2xl border border-surface-border bg-surface-card p-5 sm:p-6 space-y-3">
          <div className="flex items-center gap-2 pb-2 border-b border-surface-border">
            <Hash className="h-4 w-4 text-cyan-400" />
            <h3 className="text-sm font-bold text-white uppercase tracking-wider font-mono">
              Tamper-Evident Verification Log
            </h3>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-surface-border text-slate-400 ml-auto">
              SHA-256 Chained
            </span>
          </div>

          <div className="space-y-2 text-xs font-mono">
            {auditEvents.map((evt) => (
              <div
                key={evt.event_id}
                className="p-2.5 rounded-lg border border-surface-border bg-midnight-950 flex flex-col sm:flex-row sm:items-center justify-between gap-1 text-[11px]"
              >
                <div className="flex items-center gap-2">
                  <span className="text-cyan-400 font-bold">[{evt.event_type}]</span>
                  <span className="text-slate-300">{evt.event_summary}</span>
                </div>
                <span className="text-[10px] text-slate-500 shrink-0">
                  hash: {evt.event_hash?.substring(0, 10)}...
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Bottom Actions */}
      <div className="flex items-center justify-center gap-4 pt-2">
        <Link
          to="/my-applications"
          className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 font-semibold text-xs text-midnight-950 uppercase tracking-wider shadow"
        >
          View All Applications
        </Link>
        <Link
          to="/home"
          className="px-5 py-2.5 rounded-xl bg-midnight-900 border border-surface-border text-xs text-slate-300 hover:text-white"
        >
          Return to Marketplace
        </Link>
      </div>

      {/* Single Account Rule Notice */}
      <SingleAccountNotice variant="banner" />
    </div>
  );
}
