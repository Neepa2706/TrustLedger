/**
 * TrustLedger LoanApplicationPage (/loans/:loanId/apply)
 * 6-Step guided borrower loan application:
 * 1. Personal Details (Locked verified profile data)
 * 2. Loan Details (Amount, tenure, purpose, masked bank account)
 * 3. Financial Details (Employment, income, obligations)
 * 4. Required Documents (Pre-linked Aadhaar + uploads with quality checks)
 * 5. Application Review (Pre-submission summary)
 * 6. Ready to Submit (Validation gates & submission reference)
 */

import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation, Link } from 'react-router-dom';
import {
  ArrowLeft,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  FileText,
  Lock,
  Loader2,
  Send,
  Building,
  CreditCard,
  Briefcase,
  User,
  Sparkles,
  ExternalLink
} from 'lucide-react';
import ApplicationStepper from '../../components/loans/ApplicationStepper';
import LoanDocumentUploader from '../../components/loans/LoanDocumentUploader';
import ApplicationReview from '../../components/loans/ApplicationReview';
import ApplicationSummaryCard from '../../components/loans/ApplicationSummaryCard';
import SingleAccountNotice from '../../components/user/SingleAccountNotice';
import { getLoanProductById } from '../../data/loanProductsData';
import { useUserAuth } from '../../context/UserAuthContext';
import loanService from '../../services/loanService';

export default function LoanApplicationPage() {
  const { loanId } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const { user, profile } = useUserAuth();

  const searchParams = new URLSearchParams(location.search);
  const appIdParam = searchParams.get('appId');

  const [product, setProduct] = useState(() => getLoanProductById(loanId));
  const [application, setApplication] = useState(null);
  const [currentStep, setCurrentStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [formError, setFormError] = useState('');
  const [submittedSuccess, setSubmittedSuccess] = useState(false);

  // Form State
  const [formData, setFormData] = useState({
    requestedAmount: 150000,
    requestedDuration: 24,
    loanPurpose: '',
    // Financial & Employment
    employerName: '',
    workExperience: 3.5,
    monthlyIncome: '75,000',
    existingObligations: '0',
    monthlyExpenses: '30,000',
    // Payout Bank
    payoutBankName: 'HDFC Bank',
    payoutAccountNumber: '',
    payoutAccountMasked: 'XXXX XXXX 4821',
    payoutIfsc: 'HDFC0001234'
  });

  // 1. Initialize or load draft application
  useEffect(() => {
    let isMounted = true;
    const prod = getLoanProductById(loanId);
    if (prod) {
      setProduct(prod);
      setFormData((prev) => ({
        ...prev,
        requestedAmount: prod.defaultAmount || prod.minAmount,
        requestedDuration: prod.defaultDurationMonths || prod.minDurationMonths,
        loanPurpose: prod.purposeOptions?.[0] || 'General Loan'
      }));
    }

    if (user?.id) {
      setLoading(true);
      if (appIdParam) {
        loanService.getApplicationById(appIdParam, user.id)
          .then((app) => {
            if (isMounted && app) {
              setApplication(app);
              setCurrentStep(app.current_step || 1);
              setFormData((prev) => ({
                ...prev,
                requestedAmount: app.requested_amount,
                requestedDuration: app.requested_duration_months,
                loanPurpose: app.loan_purpose,
                employerName: app.financial_details?.employer_or_business_name || '',
                monthlyIncome: app.financial_details?.monthly_income || '75,000',
                existingObligations: app.financial_details?.monthly_existing_obligations || '0',
                monthlyExpenses: app.financial_details?.approximate_monthly_expenses || '30,000',
                payoutBankName: app.financial_details?.payout_bank_name || 'HDFC Bank',
                payoutAccountMasked: app.financial_details?.payout_account_masked || 'XXXX XXXX 4821',
                payoutIfsc: app.financial_details?.payout_ifsc_code || 'HDFC0001234'
              }));
            }
          })
          .catch(() => {})
          .finally(() => {
            if (isMounted) setLoading(false);
          });
      } else {
        // Initialize default draft
        loanService.createApplication({
          loan_product_id: loanId,
          requested_amount: prod?.defaultAmount || 100000,
          requested_duration_months: prod?.defaultDurationMonths || 24,
          loan_purpose: prod?.purposeOptions?.[0] || 'Personal Need'
        }, user.id)
          .then((app) => {
            if (isMounted && app) setApplication(app);
          })
          .catch(() => {})
          .finally(() => {
            if (isMounted) setLoading(false);
          });
      }
    }

    return () => { isMounted = false; };
  }, [loanId, appIdParam, user?.id]);

  if (!product) {
    return (
      <div className="p-8 text-center">
        <span className="text-white">Loan product not found.</span>
      </div>
    );
  }

  // -----------------------------------------------------------------
  // STEP NAVIGATION & DRAFT SAVING
  // -----------------------------------------------------------------
  const saveDraftProgress = async (nextStep) => {
    if (!application?.application_id || !user?.id) return;
    setSaving(true);
    try {
      const updated = await loanService.updateApplication(
        application.application_id,
        {
          requested_amount: formData.requestedAmount,
          requested_duration_months: formData.requestedDuration,
          loan_purpose: formData.loanPurpose,
          current_step: nextStep,
          financial_details: {
            employer_or_business_name: formData.employerName,
            work_experience_years: Number(formData.workExperience),
            monthly_income: formData.monthlyIncome,
            monthly_existing_obligations: formData.existingObligations,
            approximate_monthly_expenses: formData.monthlyExpenses,
            payout_bank_name: formData.payoutBankName,
            payout_account_number: formData.payoutAccountNumber || undefined,
            payout_account_masked: formData.payoutAccountMasked,
            payout_ifsc_code: formData.payoutIfsc
          }
        },
        user.id
      );
      if (updated) setApplication(updated);
    } catch (err) {
      console.warn('Failed to save draft progress:', err);
    } finally {
      setSaving(false);
    }
  };

  // Step 1: Personal Details Next
  const handleStep1Next = async () => {
    setCurrentStep(2);
    await saveDraftProgress(2);
  };

  // Step 2: Loan Details Next
  const handleStep2Next = async (e) => {
    e.preventDefault();
    setFormError('');

    if (formData.requestedAmount < product.minAmount || formData.requestedAmount > product.maxAmount) {
      setFormError(`Please enter an amount within the allowed range (₹${product.minAmount.toLocaleString('en-IN')} - ₹${product.maxAmount.toLocaleString('en-IN')}).`);
      return;
    }
    if (formData.requestedDuration < product.minDurationMonths || formData.requestedDuration > product.maxDurationMonths) {
      setFormError(`Please select a valid loan duration (${product.minDurationMonths} - ${product.maxDurationMonths} months).`);
      return;
    }
    if (!formData.loanPurpose.trim()) {
      setFormError('Please select or enter the purpose of your loan.');
      return;
    }

    // Mask bank account if user entered a new one
    if (formData.payoutAccountNumber) {
      const clean = formData.payoutAccountNumber.replace(/\s+/g, '');
      const masked = clean.length >= 4 ? `XXXX XXXX ${clean.slice(-4)}` : 'XXXX XXXX 4821';
      setFormData((prev) => ({ ...prev, payoutAccountMasked: masked }));
    }

    setCurrentStep(3);
    await saveDraftProgress(3);
  };

  // Step 3: Financial Details Next
  const handleStep3Next = async (e) => {
    e.preventDefault();
    setFormError('');

    if (!formData.monthlyIncome || !formData.monthlyIncome.trim()) {
      setFormError('Please enter your monthly income.');
      return;
    }

    setCurrentStep(4);
    await saveDraftProgress(4);
  };

  // Step 4: Documents Upload & Next
  const handleDocumentUpload = async (docType, file) => {
    if (!application?.application_id || !user?.id) return;
    setLoading(true);
    setFormError('');
    try {
      await loanService.uploadDocument(application.application_id, docType, file, user.id);
      const refreshed = await loanService.getApplicationById(application.application_id, user.id);
      if (refreshed) setApplication(refreshed);
    } catch (err) {
      setFormError('Document upload failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleStep4Next = async () => {
    setCurrentStep(5);
    await saveDraftProgress(5);
    // Run pre-review validation
    if (application?.application_id && user?.id) {
      const valResult = await loanService.validateApplication(application.application_id, user.id);
      const refreshed = await loanService.getApplicationById(application.application_id, user.id);
      if (refreshed) setApplication(refreshed);
    }
  };

  // Step 5: Review to Final Verification Screen (Phase 3)
  const handleStep5Next = async () => {
    if (!application?.application_id || !user?.id) return;
    setLoading(true);
    setFormError('');
    try {
      const val = await loanService.validateApplication(application.application_id, user.id);
      if (!val.can_submit) {
        setFormError(val.blocking_errors[0] || 'Please complete all required fields and documents.');
        setLoading(false);
        return;
      }
      await saveDraftProgress(5);
      // Navigate to dedicated Phase 3 verification screen
      navigate(`/loans/${loanId}/apply/verification?appId=${application.application_id}`);
    } catch (err) {
      setFormError('Validation failed. Please review your details.');
    } finally {
      setLoading(false);
    }
  };

  // Final Step 6 Submit Confirmation
  const handleFinalSubmit = async () => {
    if (!application?.application_id || !user?.id) return;
    setLoading(true);
    try {
      const updated = await loanService.updateApplication(
        application.application_id,
        { application_status: 'READY_FOR_REVIEW' },
        user.id
      );
      if (updated) setApplication(updated);
      setSubmittedSuccess(true);
    } catch (err) {
      setFormError('Application submission failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto animate-fadeIn">
      
      {/* Top Breadcrumb & Heading */}
      <div>
        <div className="flex items-center gap-2 text-xs font-mono text-slate-400 mb-2">
          <Link to="/loans" className="hover:text-cyan-300 flex items-center gap-1">
            <ArrowLeft className="h-3.5 w-3.5" />
            <span>Loan Marketplace</span>
          </Link>
          <span>/</span>
          <Link to={`/loans/${product.id}`} className="hover:text-cyan-300">
            {product.name}
          </Link>
          <span>/</span>
          <span className="text-cyan-400 font-semibold">Application</span>
        </div>

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h1 className="text-2xl font-bold text-white tracking-tight">
              Loan Application
            </h1>
            <p className="text-xs text-slate-400 mt-1">
              Some of your verified profile details are already filled in. Please check the information and provide the remaining details.
            </p>
          </div>

          {application?.application_id && (
            <div className="text-[11px] font-mono px-3 py-1 rounded-xl bg-midnight-900 border border-surface-border text-slate-300 self-start sm:self-auto">
              Ref: <span className="text-cyan-400 font-bold">{application.application_id}</span>
            </div>
          )}
        </div>
      </div>

      {/* Stepper Progress Bar */}
      <ApplicationStepper
        currentStep={currentStep}
        onStepClick={(step) => {
          if (step < currentStep) {
            setCurrentStep(step);
          }
        }}
      />

      {/* Form Error Banner */}
      {formError && (
        <div className="p-3.5 rounded-xl border border-red-500/40 bg-red-950/40 text-xs text-red-200 flex items-start gap-2 animate-fadeIn">
          <AlertCircle className="h-4 w-4 text-red-400 shrink-0 mt-0.5" />
          <div className="flex-1 font-medium">{formError}</div>
        </div>
      )}

      {/* =====================================================================
          STEP 1: PRE-FILLED & LOCKED PERSONAL DETAILS
          ===================================================================== */}
      {currentStep === 1 && (
        <div className="rounded-2xl border border-surface-border bg-surface-card p-6 sm:p-8 shadow-xl space-y-5">
          <div className="flex items-center justify-between pb-3 border-b border-surface-border">
            <div>
              <span className="text-xs font-mono uppercase tracking-wider text-cyan-400">
                Step 1 of 6
              </span>
              <h2 className="text-lg font-bold text-white mt-0.5">
                Verified Personal Details
              </h2>
            </div>
            <span className="text-xs font-mono px-2.5 py-1 rounded-md bg-emerald-950 text-emerald-300 border border-emerald-500/30 flex items-center gap-1.5 font-medium">
              <Lock className="h-3.5 w-3.5" />
              <span>Verified Profile Information</span>
            </span>
          </div>

          <div className="p-3.5 rounded-xl border border-surface-border bg-midnight-950/80 text-xs text-slate-300 flex items-start gap-2.5">
            <ShieldCheck className="h-4 w-4 text-cyan-400 shrink-0 mt-0.5" />
            <div>
              <span className="font-semibold text-white block">Identity Details are Protected & Locked</span>
              <p className="text-[11px] text-slate-400 mt-0.5 leading-relaxed">
                To prevent identity tampering, verified personal details cannot be changed inside a loan application.
                If your details have changed, please update them directly in your TrustLedger profile.
              </p>
            </div>
          </div>

          {/* Locked Fields Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5 text-xs">
            <div className="p-3 rounded-xl border border-surface-border bg-midnight-950">
              <label className="text-[10px] font-mono uppercase text-slate-400 block mb-1">Full Name</label>
              <span className="font-semibold text-white block">{profile?.full_name || user?.fullName || 'Arjun Kumar'}</span>
            </div>
            <div className="p-3 rounded-xl border border-surface-border bg-midnight-950">
              <label className="text-[10px] font-mono uppercase text-slate-400 block mb-1">Date of Birth</label>
              <span className="text-slate-200 block">{profile?.date_of_birth || '1992-05-14'}</span>
            </div>
            <div className="p-3 rounded-xl border border-surface-border bg-midnight-950">
              <label className="text-[10px] font-mono uppercase text-slate-400 block mb-1">Gender</label>
              <span className="text-slate-200 block">{profile?.gender || 'Male'}</span>
            </div>
            <div className="p-3 rounded-xl border border-surface-border bg-midnight-950">
              <label className="text-[10px] font-mono uppercase text-slate-400 block mb-1">Mobile Number</label>
              <span className="text-slate-200 block">{profile?.mobile || user?.mobile || '9876543210'}</span>
            </div>
            <div className="p-3 rounded-xl border border-surface-border bg-midnight-950">
              <label className="text-[10px] font-mono uppercase text-slate-400 block mb-1">Email</label>
              <span className="text-slate-200 block truncate">{profile?.email || user?.email}</span>
            </div>
            <div className="p-3 rounded-xl border border-surface-border bg-midnight-950">
              <label className="text-[10px] font-mono uppercase text-slate-400 block mb-1">Aadhaar (Masked)</label>
              <span className="font-mono text-cyan-300 font-semibold">{profile?.aadhaar_masked || 'XXXX XXXX 4821'}</span>
            </div>
            <div className="p-3 rounded-xl border border-surface-border bg-midnight-950 sm:col-span-2">
              <label className="text-[10px] font-mono uppercase text-slate-400 block mb-1">Residential Address</label>
              <span className="text-slate-200 block truncate">{profile?.address || 'Sector 14, Gurugram, Haryana'} - {profile?.pincode || '122001'}</span>
            </div>
            <div className="p-3 rounded-xl border border-surface-border bg-midnight-950">
              <label className="text-[10px] font-mono uppercase text-slate-400 block mb-1">PAN (Masked)</label>
              <span className="font-mono text-cyan-300 font-semibold">{profile?.pan_masked || 'AB•••••4821'}</span>
            </div>
          </div>

          <div className="flex items-center justify-between pt-4 border-t border-surface-border">
            <Link
              to="/profile"
              className="text-xs font-mono text-cyan-400 hover:text-cyan-300 inline-flex items-center gap-1"
            >
              <span>Go to Profile to change details</span>
              <ExternalLink className="h-3.5 w-3.5" />
            </Link>

            <button
              type="button"
              onClick={handleStep1Next}
              className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 px-6 py-2.5 text-xs font-semibold uppercase tracking-wider text-midnight-950 shadow-[0_0_20px_rgba(0,240,255,0.25)] transition-all"
            >
              <span>Confirm & Proceed</span>
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      )}

      {/* =====================================================================
          STEP 2: LOAN-SPECIFIC DETAILS & PAYOUT ACCOUNT
          ===================================================================== */}
      {currentStep === 2 && (
        <div className="rounded-2xl border border-surface-border bg-surface-card p-6 sm:p-8 shadow-xl">
          <div className="mb-5">
            <span className="text-xs font-mono uppercase tracking-wider text-cyan-400">
              Step 2 of 6
            </span>
            <h2 className="text-lg font-bold text-white mt-0.5">
              Loan Preferences & Disbursement Account
            </h2>
            <p className="text-xs text-slate-400 mt-1">
              Select your required loan amount, preferred duration, and disbursement bank
            </p>
          </div>

          <form onSubmit={handleStep2Next} className="space-y-4">
            {/* Amount & Duration */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-mono uppercase text-slate-300 mb-1">
                  Requested Loan Amount (₹)
                </label>
                <input
                  type="number"
                  required
                  min={product.minAmount}
                  max={product.maxAmount}
                  step={5000}
                  value={formData.requestedAmount}
                  onChange={(e) => setFormData({ ...formData, requestedAmount: Number(e.target.value) })}
                  className="w-full rounded-xl border border-surface-border bg-midnight-950 px-3.5 py-2.5 text-xs text-white font-mono font-bold focus:border-cyan-400 focus:outline-none"
                />
                <span className="text-[10px] font-mono text-slate-500 mt-1 block">
                  Allowed range: ₹{product.minAmount.toLocaleString('en-IN')} – ₹{product.maxAmount.toLocaleString('en-IN')}
                </span>
              </div>

              <div>
                <label className="block text-xs font-mono uppercase text-slate-300 mb-1">
                  Preferred Duration (Months)
                </label>
                <input
                  type="number"
                  required
                  min={product.minDurationMonths}
                  max={product.maxDurationMonths}
                  step={3}
                  value={formData.requestedDuration}
                  onChange={(e) => setFormData({ ...formData, requestedDuration: Number(e.target.value) })}
                  className="w-full rounded-xl border border-surface-border bg-midnight-950 px-3.5 py-2.5 text-xs text-white font-mono font-bold focus:border-cyan-400 focus:outline-none"
                />
                <span className="text-[10px] font-mono text-slate-500 mt-1 block">
                  Allowed range: {product.minDurationMonths} – {product.maxDurationMonths} Months
                </span>
              </div>
            </div>

            {/* Loan Purpose */}
            <div>
              <label className="block text-xs font-mono uppercase text-slate-300 mb-1">
                Loan Purpose
              </label>
              <select
                value={formData.loanPurpose}
                onChange={(e) => setFormData({ ...formData, loanPurpose: e.target.value })}
                className="w-full rounded-xl border border-surface-border bg-midnight-950 px-3.5 py-2.5 text-xs text-white focus:border-cyan-400 focus:outline-none"
              >
                {product.purposeOptions?.map((opt, idx) => (
                  <option key={idx} value={opt}>{opt}</option>
                ))}
              </select>
            </div>

            {/* Bank Account Details (Masked Protection) */}
            <div className="pt-3 border-t border-surface-border space-y-3">
              <span className="text-xs font-mono uppercase tracking-wider text-cyan-400 font-semibold block">
                Disbursement Bank Account
              </span>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-mono uppercase text-slate-300 mb-1">Bank Name</label>
                  <input
                    type="text"
                    required
                    value={formData.payoutBankName}
                    onChange={(e) => setFormData({ ...formData, payoutBankName: e.target.value })}
                    placeholder="e.g. HDFC Bank / SBI"
                    className="w-full rounded-xl border border-surface-border bg-midnight-950 px-3 py-2 text-xs text-white focus:border-cyan-400 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-mono uppercase text-slate-300 mb-1">Account Number</label>
                  <input
                    type="text"
                    value={formData.payoutAccountNumber}
                    onChange={(e) => setFormData({ ...formData, payoutAccountNumber: e.target.value })}
                    placeholder="Enter or keep existing masked"
                    className="w-full rounded-xl border border-surface-border bg-midnight-950 px-3 py-2 text-xs font-mono text-white focus:border-cyan-400 focus:outline-none"
                  />
                  <span className="text-[10px] font-mono text-slate-400 mt-0.5 block">
                    Current masked: {formData.payoutAccountMasked}
                  </span>
                </div>

                <div>
                  <label className="block text-xs font-mono uppercase text-slate-300 mb-1">IFSC Code</label>
                  <input
                    type="text"
                    required
                    maxLength={11}
                    value={formData.payoutIfsc}
                    onChange={(e) => setFormData({ ...formData, payoutIfsc: e.target.value.toUpperCase() })}
                    placeholder="e.g. HDFC0001234"
                    className="w-full rounded-xl border border-surface-border bg-midnight-950 px-3 py-2 text-xs font-mono uppercase text-white focus:border-cyan-400 focus:outline-none"
                  />
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between pt-4 border-t border-surface-border">
              <button
                type="button"
                onClick={() => setCurrentStep(1)}
                className="px-4 py-2 text-xs text-slate-400 hover:text-white"
              >
                ← Back
              </button>

              <button
                type="submit"
                disabled={saving}
                className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 px-6 py-2.5 text-xs font-semibold uppercase tracking-wider text-midnight-950 shadow-[0_0_20px_rgba(0,240,255,0.25)] transition-all"
              >
                <span>Save & Continue</span>
                <ArrowRight className="h-4 w-4" />
              </button>
            </div>
          </form>
        </div>
      )}

      {/* =====================================================================
          STEP 3: FINANCIAL & EMPLOYMENT DETAILS
          ===================================================================== */}
      {currentStep === 3 && (
        <div className="rounded-2xl border border-surface-border bg-surface-card p-6 sm:p-8 shadow-xl">
          <div className="mb-5">
            <span className="text-xs font-mono uppercase tracking-wider text-cyan-400">
              Step 3 of 6
            </span>
            <h2 className="text-lg font-bold text-white mt-0.5">
              Financial & Employment Assessment
            </h2>
            <p className="text-xs text-slate-400 mt-1">
              Provide your employment or business details and existing obligations
            </p>
          </div>

          <form onSubmit={handleStep3Next} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-mono uppercase text-slate-300 mb-1">
                  Employer / Business Name
                </label>
                <input
                  type="text"
                  required
                  value={formData.employerName}
                  onChange={(e) => setFormData({ ...formData, employerName: e.target.value })}
                  placeholder="e.g. Infosys Ltd / Shri Ganesh Traders"
                  className="w-full rounded-xl border border-surface-border bg-midnight-950 px-3.5 py-2.5 text-xs text-white focus:border-cyan-400 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-mono uppercase text-slate-300 mb-1">
                  Total Work / Business Experience (Years)
                </label>
                <input
                  type="number"
                  step="0.5"
                  min="0"
                  value={formData.workExperience}
                  onChange={(e) => setFormData({ ...formData, workExperience: e.target.value })}
                  className="w-full rounded-xl border border-surface-border bg-midnight-950 px-3.5 py-2.5 text-xs text-white font-mono focus:border-cyan-400 focus:outline-none"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-mono uppercase text-slate-300 mb-1">
                  Monthly Net Income (₹)
                </label>
                <input
                  type="text"
                  required
                  value={formData.monthlyIncome}
                  onChange={(e) => setFormData({ ...formData, monthlyIncome: e.target.value })}
                  placeholder="75,000"
                  className="w-full rounded-xl border border-surface-border bg-midnight-950 px-3.5 py-2.5 text-xs text-white font-mono focus:border-cyan-400 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-mono uppercase text-slate-300 mb-1">
                  Existing Monthly EMIs (₹)
                </label>
                <input
                  type="text"
                  value={formData.existingObligations}
                  onChange={(e) => setFormData({ ...formData, existingObligations: e.target.value })}
                  placeholder="0 if none"
                  className="w-full rounded-xl border border-surface-border bg-midnight-950 px-3.5 py-2.5 text-xs text-white font-mono focus:border-cyan-400 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-mono uppercase text-slate-300 mb-1">
                  Approx. Monthly Expenses (₹)
                </label>
                <input
                  type="text"
                  value={formData.monthlyExpenses}
                  onChange={(e) => setFormData({ ...formData, monthlyExpenses: e.target.value })}
                  placeholder="30,000"
                  className="w-full rounded-xl border border-surface-border bg-midnight-950 px-3.5 py-2.5 text-xs text-white font-mono focus:border-cyan-400 focus:outline-none"
                />
              </div>
            </div>

            <div className="flex items-center justify-between pt-4 border-t border-surface-border">
              <button
                type="button"
                onClick={() => setCurrentStep(2)}
                className="px-4 py-2 text-xs text-slate-400 hover:text-white"
              >
                ← Back
              </button>

              <button
                type="submit"
                disabled={saving}
                className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 px-6 py-2.5 text-xs font-semibold uppercase tracking-wider text-midnight-950 shadow-[0_0_20px_rgba(0,240,255,0.25)] transition-all"
              >
                <span>Save & Continue</span>
                <ArrowRight className="h-4 w-4" />
              </button>
            </div>
          </form>
        </div>
      )}

      {/* =====================================================================
          STEP 4: REQUIRED SUPPORTING DOCUMENTS UPLOAD
          ===================================================================== */}
      {currentStep === 4 && (
        <div className="rounded-2xl border border-surface-border bg-surface-card p-6 sm:p-8 shadow-xl space-y-5">
          <div>
            <span className="text-xs font-mono uppercase tracking-wider text-cyan-400">
              Step 4 of 6
            </span>
            <h2 className="text-lg font-bold text-white mt-0.5">
              Upload Supporting Documents
            </h2>
            <p className="text-xs text-slate-400 mt-1">
              Upload the required documentation for {product.name}. Your verified identity document is pre-linked.
            </p>
          </div>

          {/* Document Uploader Component */}
          <LoanDocumentUploader
            requiredDocuments={product.requiredDocuments}
            uploadedDocuments={application?.documents || []}
            onUploadDocument={handleDocumentUpload}
            isProcessing={loading}
          />

          <div className="flex items-center justify-between pt-4 border-t border-surface-border">
            <button
              type="button"
              onClick={() => setCurrentStep(3)}
              className="px-4 py-2 text-xs text-slate-400 hover:text-white"
            >
              ← Back
            </button>

            <button
              type="button"
              disabled={loading}
              onClick={handleStep4Next}
              className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 px-6 py-2.5 text-xs font-semibold uppercase tracking-wider text-midnight-950 shadow-[0_0_20px_rgba(0,240,255,0.25)] transition-all"
            >
              <span>Proceed to Review</span>
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      )}

      {/* =====================================================================
          STEP 5: PRE-SUBMISSION APPLICATION REVIEW
          ===================================================================== */}
      {currentStep === 5 && (
        <div className="space-y-6">
          <ApplicationReview
            application={application}
            product={product}
            onEditStep={(s) => setCurrentStep(s)}
          />

          <div className="flex items-center justify-between pt-2">
            <button
              type="button"
              onClick={() => setCurrentStep(4)}
              className="px-4 py-2 text-xs text-slate-400 hover:text-white"
            >
              ← Back to Documents
            </button>

            <button
              type="button"
              disabled={loading}
              onClick={handleStep5Next}
              className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 px-6 py-2.5 text-xs font-semibold uppercase tracking-wider text-midnight-950 shadow-[0_0_20px_rgba(0,240,255,0.25)] transition-all"
            >
              {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : (
                <>
                  <ShieldCheck className="h-4 w-4" />
                  <span>Proceed to Final Verification</span>
                </>
              )}
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      )}

      {/* =====================================================================
          STEP 6: READY TO SUBMIT & CONFIRMATION
          ===================================================================== */}
      {currentStep === 6 && (
        <div className="rounded-2xl border border-surface-border bg-surface-card p-6 sm:p-10 shadow-2xl space-y-6 text-center">
          {!submittedSuccess ? (
            <div className="space-y-5 max-w-md mx-auto">
              <div className="w-16 h-16 rounded-2xl bg-cyan-950 border border-cyan-500/40 text-cyan-400 flex items-center justify-center mx-auto shadow-inner">
                <Send className="h-8 w-8" />
              </div>

              <div>
                <span className="text-xs font-mono uppercase tracking-wider text-cyan-400 font-semibold">
                  Step 6 of 6
                </span>
                <h2 className="text-xl font-bold text-white mt-1">
                  Ready to Submit Application
                </h2>
                <p className="text-xs text-slate-300 mt-2 leading-relaxed">
                  All required form entries, identity references, and documents have passed initial checks.
                  Click below to record your application reference as Ready for Review.
                </p>
              </div>

              <div className="p-3.5 rounded-xl border border-surface-border bg-midnight-950 text-left text-xs space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-slate-400">Application ID</span>
                  <span className="font-mono text-cyan-400 font-bold">{application?.application_id}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-400">Loan Amount</span>
                  <span className="font-mono text-white font-semibold">₹{application?.requested_amount?.toLocaleString('en-IN')}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-400">Duration</span>
                  <span className="font-mono text-white">{application?.requested_duration_months} Months</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-400">Underwriting Gate</span>
                  <span className="text-emerald-400 font-semibold flex items-center gap-1">
                    <CheckCircle2 className="h-3 w-3" /> Ready for Review
                  </span>
                </div>
              </div>

              <div className="pt-2 flex flex-col sm:flex-row gap-3 justify-center">
                <button
                  type="button"
                  onClick={() => setCurrentStep(5)}
                  className="px-4 py-2.5 rounded-xl border border-surface-border bg-midnight-900 text-xs text-slate-300 hover:text-white"
                >
                  ← Review Again
                </button>

                <button
                  type="button"
                  disabled={loading}
                  onClick={handleFinalSubmit}
                  className="flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 px-6 py-2.5 text-xs font-semibold uppercase tracking-wider text-midnight-950 shadow-[0_0_20px_rgba(16,185,129,0.3)] transition-all"
                >
                  {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <span>Confirm & Submit Application</span>}
                </button>
              </div>
            </div>
          ) : (
            <div className="space-y-6 max-w-lg mx-auto">
              <div className="w-20 h-20 rounded-2xl bg-emerald-950 border border-emerald-500/40 text-emerald-400 flex items-center justify-center mx-auto shadow-[0_0_30px_rgba(16,185,129,0.25)]">
                <CheckCircle2 className="h-10 w-10" />
              </div>

              <div>
                <span className="text-xs font-mono uppercase tracking-wider text-emerald-400 font-semibold">
                  Application Logged Successfully
                </span>
                <h2 className="text-2xl font-bold text-white mt-1">
                  Application Ready for Review
                </h2>
                <p className="text-xs sm:text-sm text-slate-300 mt-2 leading-relaxed">
                  Your loan application has been recorded under your verified account.
                  The lending institution review workflow will be implemented in the next phase.
                </p>
              </div>

              {/* Summary Card */}
              <ApplicationSummaryCard application={application} />

              <div className="pt-2 flex items-center justify-center gap-3">
                <Link
                  to="/home"
                  className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 font-semibold text-xs text-midnight-950 uppercase tracking-wider shadow"
                >
                  Return to Home
                </Link>
                <Link
                  to="/loans"
                  className="px-4 py-2.5 rounded-xl bg-midnight-900 border border-surface-border text-xs text-slate-300 hover:text-white"
                >
                  Explore More Loans
                </Link>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Mandatory Single Person Rule Banner */}
      <SingleAccountNotice variant="banner" />

    </div>
  );
}
