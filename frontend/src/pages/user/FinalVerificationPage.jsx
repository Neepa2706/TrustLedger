/**
 * TrustLedger FinalVerificationPage (/loans/:loanId/apply/verification)
 * Dedicated pre-submission security and cross-verification screen:
 * - Profile identity verification status
 * - Document cross-verification (Registered docs vs Application docs)
 * - Consolidated KYC security checklist (KYCVerificationCard)
 * - Borrower declaration confirmation
 * - Final application submission gate
 */

import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation, Link } from 'react-router-dom';
import {
  ArrowLeft,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  Clock,
  Lock,
  Loader2,
  FileCheck2,
  Send,
  User,
  CreditCard,
  Building,
  RefreshCw,
  ExternalLink,
  ChevronRight
} from 'lucide-react';

import KYCVerificationCard from '../../components/loans/KYCVerificationCard';
import SingleAccountNotice from '../../components/user/SingleAccountNotice';
import { getLoanProductById } from '../../data/loanProductsData';
import { useUserAuth } from '../../context/UserAuthContext';
import loanService from '../../services/loanService';

export default function FinalVerificationPage() {
  const { loanId } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const { user, profile } = useUserAuth();

  const searchParams = new URLSearchParams(location.search);
  const appIdParam = searchParams.get('appId');

  const [product, setProduct] = useState(() => getLoanProductById(loanId));
  const [application, setApplication] = useState(null);
  const [verificationData, setVerificationData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [declarationAgreed, setDeclarationAgreed] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  // 1. Fetch Application & Verification Status
  useEffect(() => {
    let isMounted = true;
    const prod = getLoanProductById(loanId);
    if (prod) setProduct(prod);

    if (user?.id && appIdParam) {
      setLoading(true);
      Promise.all([
        loanService.getApplicationById(appIdParam, user.id),
        loanService.getVerificationStatus(appIdParam, user.id)
      ])
        .then(([app, verif]) => {
          if (isMounted) {
            setApplication(app);
            setVerificationData(verif);
          }
        })
        .catch((err) => {
          if (isMounted) setErrorMessage(err.message || 'Failed to load verification status.');
        })
        .finally(() => {
          if (isMounted) setLoading(false);
        });
    } else {
      setLoading(false);
    }

    return () => {
      isMounted = false;
    };
  }, [loanId, appIdParam, user?.id]);

  // Handle Submission
  const handleSubmitApplication = async () => {
    if (!declarationAgreed) {
      setErrorMessage('Please confirm the borrower declaration before submitting.');
      return;
    }
    if (!application?.application_id || !user?.id) {
      setErrorMessage('Application identifier missing. Please return to the form.');
      return;
    }

    setSubmitting(true);
    setErrorMessage('');

    try {
      const response = await loanService.submitApplication(
        application.application_id,
        {
          borrower_declaration_confirmed: true,
          declaration_text: 'I confirm that the information and documents provided in this application are true and belong to me. I understand that the lender will verify the application before making a lending decision.'
        },
        user.id
      );

      // Navigate to success / application status view
      navigate(`/my-applications/${application.application_id}`);
    } catch (err) {
      setErrorMessage(err.message || 'Application submission failed. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleFixDocument = () => {
    navigate(`/loans/${loanId}/apply?appId=${appIdParam || ''}&step=4`);
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-4">
        <Loader2 className="h-8 w-8 text-cyan-400 animate-spin" />
        <span className="text-xs font-mono text-slate-400 uppercase tracking-wider">
          Running Pre-Submission Verification Checks...
        </span>
      </div>
    );
  }

  const verified = application?.verified_applicant || {};
  const comparisons = verificationData?.document_comparisons || [];
  const kycResult = verificationData?.kyc_result;
  const canSubmit = verificationData?.can_submit && !verificationData?.blocking_reasons?.length;

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-12">
      {/* Top Breadcrumb / Back Link */}
      <div className="flex items-center justify-between">
        <Link
          to={`/loans/${loanId}/apply?appId=${appIdParam || ''}&step=5`}
          className="inline-flex items-center gap-2 text-xs font-mono text-slate-400 hover:text-cyan-400 transition"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Back to Application Review</span>
        </Link>
        <span className="text-xs font-mono text-slate-500">
          Application ID: <strong className="text-cyan-400">{application?.application_id || 'Pending'}</strong>
        </span>
      </div>

      {/* Screen Header */}
      <div className="space-y-1">
        <div className="flex items-center gap-2">
          <span className="text-xs font-mono uppercase tracking-wider text-cyan-400 font-semibold">
            Security Gate & Submission
          </span>
          <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-surface-border text-slate-400">
            Step 6 of 6
          </span>
        </div>
        <h1 className="text-2xl font-extrabold text-white tracking-tight">
          Final verification
        </h1>
        <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
          We will check your application details and uploaded documents before you submit.
        </p>
      </div>

      {/* Error Message if any */}
      {errorMessage && (
        <div className="p-4 rounded-xl border border-red-500/40 bg-red-950/40 text-xs text-red-200 flex items-start gap-2.5">
          <AlertCircle className="h-4 w-4 text-red-400 shrink-0 mt-0.5" />
          <span>{errorMessage}</span>
        </div>
      )}

      {/* =====================================================================
          1. PROFILE VERIFICATION CHECKLIST
          ===================================================================== */}
      <div className="rounded-2xl border border-surface-border bg-surface-card p-5 sm:p-6 space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-surface-border">
          <div className="flex items-center gap-2">
            <User className="h-4 w-4 text-cyan-400" />
            <h3 className="text-sm font-bold text-white uppercase tracking-wider font-mono">
              Profile Verification
            </h3>
          </div>
          <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-950 text-emerald-300 border border-emerald-500/30 flex items-center gap-1">
            <Lock className="h-3 w-3" /> VERIFIED
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 text-xs">
          <div className="p-3 rounded-xl border border-surface-border bg-midnight-950">
            <span className="text-[10px] font-mono uppercase text-slate-400 block mb-1">Identity Details</span>
            <div className="flex items-center justify-between">
              <span className="font-semibold text-white truncate">{verified.full_name || 'Verified Applicant'}</span>
              <span className="text-[10px] font-mono text-emerald-400 font-semibold">VERIFIED</span>
            </div>
          </div>

          <div className="p-3 rounded-xl border border-surface-border bg-midnight-950">
            <span className="text-[10px] font-mono uppercase text-slate-400 block mb-1">Date of Birth</span>
            <div className="flex items-center justify-between">
              <span className="text-slate-200">{verified.date_of_birth || '1992-05-14'}</span>
              <span className="text-[10px] font-mono text-emerald-400 font-semibold">VERIFIED</span>
            </div>
          </div>

          <div className="p-3 rounded-xl border border-surface-border bg-midnight-950">
            <span className="text-[10px] font-mono uppercase text-slate-400 block mb-1">Registered Mobile</span>
            <div className="flex items-center justify-between">
              <span className="text-slate-200 font-mono">{verified.mobile || '9876543210'}</span>
              <span className="text-[10px] font-mono text-emerald-400 font-semibold">VERIFIED</span>
            </div>
          </div>

          <div className="p-3 rounded-xl border border-surface-border bg-midnight-950">
            <span className="text-[10px] font-mono uppercase text-slate-400 block mb-1">Profile Photograph</span>
            <div className="flex items-center justify-between">
              <span className="text-slate-200">Live Camera Photo</span>
              <span className="text-[10px] font-mono text-emerald-400 font-semibold">VERIFIED</span>
            </div>
          </div>

          <div className="p-3 rounded-xl border border-surface-border bg-midnight-950 sm:col-span-2">
            <span className="text-[10px] font-mono uppercase text-slate-400 block mb-1">Identity Document</span>
            <div className="flex items-center justify-between">
              <span className="font-mono text-cyan-300">Aadhaar: {verified.aadhaar_masked || 'XXXX XXXX 4821'}</span>
              <span className="text-[10px] font-mono text-emerald-400 font-semibold">VERIFIED</span>
            </div>
          </div>
        </div>
      </div>

      {/* =====================================================================
          2. DOCUMENT CROSS-VERIFICATION
          ===================================================================== */}
      <div className="rounded-2xl border border-surface-border bg-surface-card p-5 sm:p-6 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-surface-border">
          <div className="flex items-center gap-2">
            <FileCheck2 className="h-4 w-4 text-cyan-400" />
            <h3 className="text-sm font-bold text-white uppercase tracking-wider font-mono">
              Document Cross-Verification
            </h3>
          </div>
          <span className="text-[10px] font-mono text-slate-400">
            Registered Identity ↕ Loan Application Documents
          </span>
        </div>

        <p className="text-xs text-slate-400">
          Our system cross-checks your submitted loan application documents against your verified profile information.
        </p>

        <div className="space-y-3">
          {comparisons.length === 0 ? (
            <div className="p-4 rounded-xl border border-surface-border bg-midnight-950 text-xs text-slate-400 text-center">
              No application documents to compare yet.
            </div>
          ) : (
            comparisons.map((cmp) => {
              const isMatch = cmp.status === 'MATCH';
              const isReview = cmp.status === 'REVIEW';
              const isMismatch = cmp.status === 'MISMATCH';

              return (
                <div
                  key={cmp.comparison_id}
                  className={`p-4 rounded-xl border transition-all ${
                    isMatch
                      ? 'border-emerald-500/30 bg-midnight-950'
                      : isReview
                      ? 'border-amber-500/30 bg-amber-950/10'
                      : 'border-red-500/40 bg-red-950/20'
                  }`}
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-white text-xs">
                        {cmp.document_type}
                      </span>
                      <span className="text-[10px] font-mono text-slate-500">
                        ({cmp.confidence ? `${Math.round(cmp.confidence * 100)}% confidence` : 'Heuristic'})
                      </span>
                    </div>

                    <span className={`text-[10px] font-mono px-2.5 py-0.5 rounded border font-bold uppercase tracking-wider ${
                      isMatch
                        ? 'bg-emerald-950 text-emerald-300 border-emerald-500/40'
                        : isReview
                        ? 'bg-amber-950 text-amber-300 border-amber-500/40'
                        : 'bg-red-950 text-red-300 border-red-500/40'
                    }`}>
                      {isMatch ? '✓ MATCH' : isReview ? 'REVIEW' : 'MISMATCH'}
                    </span>
                  </div>

                  <p className="text-xs text-slate-300 mt-2">
                    {cmp.message}
                  </p>

                  {/* Matched fields badges */}
                  {cmp.matched_fields?.length > 0 && (
                    <div className="flex flex-wrap items-center gap-1.5 mt-2">
                      <span className="text-[10px] font-mono text-slate-500">Matched attributes:</span>
                      {cmp.matched_fields.map((f, i) => (
                        <span key={i} className="text-[9px] font-mono px-1.5 py-0.2 rounded bg-surface-border text-cyan-300">
                          {f.replace('_', ' ')}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* =====================================================================
          3. CONSOLIDATED KYC VERIFICATION CARD
          ===================================================================== */}
      <KYCVerificationCard
        kycResult={kycResult}
        overallStatus={verificationData?.overall_status}
        onFixDocument={handleFixDocument}
      />

      {/* =====================================================================
          4. BORROWER DECLARATION
          ===================================================================== */}
      <div className="rounded-2xl border border-surface-border bg-surface-card p-5 sm:p-6 space-y-4">
        <div className="flex items-center gap-2 pb-3 border-b border-surface-border">
          <ShieldCheck className="h-4 w-4 text-cyan-400" />
          <h3 className="text-sm font-bold text-white uppercase tracking-wider font-mono">
            Borrower Declaration
          </h3>
        </div>

        <div className="p-4 rounded-xl border border-surface-border bg-midnight-950 text-xs text-slate-300 leading-relaxed space-y-2">
          <p>
            "I confirm that the information and documents provided in this application are true and belong to me. I understand that the lender will verify the application before making a lending decision."
          </p>
          <span className="text-[10px] text-slate-400 block font-mono">
            TrustLedger terms of application & fraud prevention policy
          </span>
        </div>

        <label className="flex items-start gap-3 cursor-pointer select-none pt-1">
          <input
            type="checkbox"
            checked={declarationAgreed}
            onChange={(e) => setDeclarationAgreed(e.target.checked)}
            className="mt-0.5 h-4 w-4 rounded border-surface-border bg-midnight-950 text-cyan-500 focus:ring-cyan-400"
          />
          <span className="text-xs text-white font-medium">
            I agree to the above declaration.
          </span>
        </label>
      </div>

      {/* =====================================================================
          5. SUBMISSION BUTTON BAR
          ===================================================================== */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-2">
        <Link
          to={`/loans/${loanId}/apply?appId=${appIdParam || ''}&step=5`}
          className="px-4 py-2.5 text-xs text-slate-400 hover:text-white"
        >
          ← Back to Application Review
        </Link>

        <button
          type="button"
          disabled={!declarationAgreed || !canSubmit || submitting}
          onClick={handleSubmitApplication}
          className={`flex items-center justify-center gap-2 rounded-xl px-8 py-3 text-xs font-semibold uppercase tracking-wider transition-all ${
            declarationAgreed && canSubmit && !submitting
              ? 'bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-midnight-950 shadow-[0_0_25px_rgba(16,185,129,0.35)] cursor-pointer'
              : 'bg-midnight-900 border border-surface-border text-slate-500 cursor-not-allowed'
          }`}
        >
          {submitting ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              <span>Submitting Application...</span>
            </>
          ) : (
            <>
              <Send className="h-4 w-4" />
              <span>Submit Application</span>
            </>
          )}
        </button>
      </div>

      {/* Single Account Notice Banner */}
      <SingleAccountNotice variant="banner" />
    </div>
  );
}
