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
        <span className="text-espresso font-medium">Loan product not found.</span>
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
      const payload = {
        current_step: nextStep,
        requested_amount: Number(formData.requestedAmount),
        requested_duration_months: Number(formData.requestedDuration),
        loan_purpose: formData.loanPurpose,
        financial_details: {
          employment_type: 'SALARIED',
          employer_or_business_name: formData.employerName,
          work_experience_years: Number(formData.workExperience) || 0,
          monthly_income: formData.monthlyIncome,
          monthly_existing_obligations: formData.existingObligations,
          approximate_monthly_expenses: formData.monthlyExpenses,
          payout_bank_name: formData.payoutBankName,
          payout_account_masked: formData.payoutAccountNumber
            ? `XXXX XXXX ${formData.payoutAccountNumber.slice(-4)}`
            : formData.payoutAccountMasked,
          payout_ifsc_code: formData.payoutIfsc
        }
      };
      const updated = await loanService.updateApplication(application.application_id, payload, user.id);
      if (updated) setApplication(updated);
    } catch (err) {
      console.error('Failed to save draft:', err);
    } finally {
      setSaving(false);
    }
  };

  // Step 1: Locked Personal Details -> Step 2
  const handleStep1Next = async () => {
    setCurrentStep(2);
    await saveDraftProgress(2);
  };

  // Step 2: Loan Details -> Step 3
  const handleStep2Next = async (e) => {
    e.preventDefault();
    if (formData.requestedAmount < product.minAmount || formData.requestedAmount > product.maxAmount) {
      setFormError(`Loan amount must be between ₹${product.minAmount.toLocaleString('en-IN')} and ₹${product.maxAmount.toLocaleString('en-IN')}`);
      return;
    }
    setFormError('');
    setCurrentStep(3);
    await saveDraftProgress(3);
  };

  // Step 3: Financial Details -> Step 4
  const handleStep3Next = async (e) => {
    e.preventDefault();
    if (!formData.employerName.trim()) {
      setFormError('Please provide your employer or business name.');
      return;
    }
    setFormError('');
    setCurrentStep(4);
    await saveDraftProgress(4);
  };

  // Step 4: Documents Upload -> Step 5
  const handleDocumentUpload = async (docType, file) => {
    if (!application?.application_id || !user?.id) return;
    setLoading(true);
    setFormError('');
    try {
      const res = await loanService.uploadApplicationDocument(
        application.application_id,
        docType,
        file,
        user.id
      );
      if (res?.application) {
        setApplication(res.application);
      }
    } catch (err) {
      setFormError('Document upload failed. Please verify format (PDF/JPG/PNG) and size (<10MB).');
    } finally {
      setLoading(false);
    }
  };

  const handleStep4Next = async () => {
    setCurrentStep(5);
    await saveDraftProgress(5);
    // Run pre-review validation
    if (application?.application_id && user?.id) {
      await loanService.validateApplication(application.application_id, user.id);
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
        <div className="flex items-center gap-2 text-xs font-mono text-coffee-600 mb-2">
          <Link to="/loans" className="hover:text-coffee-800 flex items-center gap-1 font-medium">
            <ArrowLeft className="h-3.5 w-3.5" />
            <span>Loan Marketplace</span>
          </Link>
          <span className="text-coffee-300">/</span>
          <Link to={`/loans/${product.id}`} className="hover:text-coffee-800 font-medium">
            {product.name}
          </Link>
          <span className="text-coffee-300">/</span>
          <span className="text-coffee-800 font-semibold">Application</span>
        </div>

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h1 className="text-2xl font-bold text-espresso tracking-tight">
              Loan Application
            </h1>
            <p className="text-xs text-stone-600 mt-1">
              Some of your verified profile details are already filled in. Please check the information and provide the remaining details.
            </p>
          </div>

          {application?.application_id && (
            <div className="text-[11px] font-mono px-3 py-1 rounded-xl bg-white border border-coffee-200 text-espresso shadow-xs self-start sm:self-auto">
              Ref: <span className="text-coffee-700 font-bold">{application.application_id}</span>
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
        <div className="p-3.5 rounded-xl border border-red-200 bg-red-50 text-xs text-red-800 flex items-start gap-2 animate-fadeIn">
          <AlertCircle className="h-4 w-4 text-red-600 shrink-0 mt-0.5" />
          <div className="flex-1 font-medium">{formError}</div>
        </div>
      )}

      {/* =====================================================================
          STEP 1: PRE-FILLED & LOCKED PERSONAL DETAILS
          ===================================================================== */}
      {currentStep === 1 && (
        <div className="rounded-2xl border border-coffee-200 bg-white p-6 sm:p-8 shadow-card space-y-5">
          <div className="flex items-center justify-between pb-3 border-b border-coffee-100">
            <div>
              <span className="text-xs font-mono uppercase tracking-wider text-coffee-600 font-semibold">
                Step 1 of 6
              </span>
              <h2 className="text-lg font-bold text-espresso mt-0.5">
                Verified Personal Details
              </h2>
            </div>
            <span className="text-xs font-mono px-2.5 py-1 rounded-md bg-emerald-50 text-emerald-700 border border-emerald-200 flex items-center gap-1.5 font-medium">
              <Lock className="h-3.5 w-3.5" />
              <span>Verified Profile Information</span>
            </span>
          </div>

          <div className="p-3.5 rounded-xl border border-coffee-200 bg-coffee-50/50 text-xs text-stone-700 flex items-start gap-2.5">
            <ShieldCheck className="h-4 w-4 text-coffee-700 shrink-0 mt-0.5" />
            <div>
              <span className="font-semibold text-espresso block">Identity Details are Protected & Locked</span>
              <p className="text-[11px] text-stone-600 mt-0.5 leading-relaxed">
                To prevent identity tampering, verified personal details cannot be changed inside a loan application.
                If your details have changed, please update them directly in your TrustLedger profile.
              </p>
            </div>
          </div>

          {/* Locked Fields Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5 text-xs">
            <div className="p-3 rounded-xl border border-coffee-100 bg-stone-50/80">
              <label className="text-[10px] font-mono uppercase text-stone-500 block mb-1">Full Name</label>
              <span className="font-semibold text-espresso block">{profile?.full_name || user?.fullName || 'Arjun Kumar'}</span>
            </div>
            <div className="p-3 rounded-xl border border-coffee-100 bg-stone-50/80">
              <label className="text-[10px] font-mono uppercase text-stone-500 block mb-1">Date of Birth</label>
              <span className="text-stone-700 block">{profile?.date_of_birth || '1992-05-14'}</span>
            </div>
            <div className="p-3 rounded-xl border border-coffee-100 bg-stone-50/80">
              <label className="text-[10px] font-mono uppercase text-stone-500 block mb-1">Gender</label>
              <span className="text-stone-700 block">{profile?.gender || 'Male'}</span>
            </div>
            <div className="p-3 rounded-xl border border-coffee-100 bg-stone-50/80">
              <label className="text-[10px] font-mono uppercase text-stone-500 block mb-1">Mobile Number</label>
              <span className="text-stone-700 block">{profile?.mobile || user?.mobile || '9876543210'}</span>
            </div>
            <div className="p-3 rounded-xl border border-coffee-100 bg-stone-50/80">
              <label className="text-[10px] font-mono uppercase text-stone-500 block mb-1">Email</label>
              <span className="text-stone-700 block truncate">{profile?.email || user?.email}</span>
            </div>
            <div className="p-3 rounded-xl border border-coffee-100 bg-stone-50/80">
              <label className="text-[10px] font-mono uppercase text-stone-500 block mb-1">Aadhaar (Masked)</label>
              <span className="font-mono text-coffee-800 font-semibold">{profile?.aadhaar_masked || 'XXXX XXXX 4821'}</span>
            </div>
            <div className="p-3 rounded-xl border border-coffee-100 bg-stone-50/80 sm:col-span-2">
              <label className="text-[10px] font-mono uppercase text-stone-500 block mb-1">Residential Address</label>
              <span className="text-stone-700 block truncate">{profile?.address || 'Sector 14, Gurugram, Haryana'} - {profile?.pincode || '122001'}</span>
            </div>
            <div className="p-3 rounded-xl border border-coffee-100 bg-stone-50/80">
              <label className="text-[10px] font-mono uppercase text-stone-500 block mb-1">PAN (Masked)</label>
              <span className="font-mono text-coffee-800 font-semibold">{profile?.pan_masked || 'AB•••••4821'}</span>
            </div>
          </div>

          <div className="flex items-center justify-between pt-4 border-t border-coffee-100">
            <Link
              to="/profile"
              className="text-xs font-mono text-coffee-600 hover:text-coffee-800 inline-flex items-center gap-1 font-medium"
            >
              <span>Go to Profile to change details</span>
              <ExternalLink className="h-3.5 w-3.5" />
            </Link>

            <button
              type="button"
              onClick={handleStep1Next}
              className="flex items-center gap-2 rounded-xl bg-coffee-600 hover:bg-coffee-700 px-6 py-2.5 text-xs font-semibold uppercase tracking-wider text-white shadow-sm transition-all"
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
        <div className="rounded-2xl border border-coffee-200 bg-white p-6 sm:p-8 shadow-card">
          <div className="mb-5">
            <span className="text-xs font-mono uppercase tracking-wider text-coffee-600 font-semibold">
              Step 2 of 6
            </span>
            <h2 className="text-lg font-bold text-espresso mt-0.5">
              Loan Preferences & Disbursement Account
            </h2>
            <p className="text-xs text-stone-600 mt-1">
              Select your required loan amount, preferred duration, and disbursement bank
            </p>
          </div>

          <form onSubmit={handleStep2Next} className="space-y-4">
            {/* Amount & Duration */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-mono uppercase text-stone-700 mb-1">
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
                  className="w-full rounded-xl border border-coffee-200 bg-white px-3.5 py-2.5 text-xs text-espresso font-mono font-bold focus:border-coffee-500 focus:ring-1 focus:ring-coffee-500 focus:outline-none"
                />
                <span className="text-[10px] font-mono text-stone-500 mt-1 block">
                  Allowed range: ₹{product.minAmount.toLocaleString('en-IN')} – ₹{product.maxAmount.toLocaleString('en-IN')}
                </span>
              </div>

              <div>
                <label className="block text-xs font-mono uppercase text-stone-700 mb-1">
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
                  className="w-full rounded-xl border border-coffee-200 bg-white px-3.5 py-2.5 text-xs text-espresso font-mono font-bold focus:border-coffee-500 focus:ring-1 focus:ring-coffee-500 focus:outline-none"
                />
                <span className="text-[10px] font-mono text-stone-500 mt-1 block">
                  Allowed range: {product.minDurationMonths} – {product.maxDurationMonths} Months
                </span>
              </div>
            </div>

            {/* Loan Purpose */}
            <div>
              <label className="block text-xs font-mono uppercase text-stone-700 mb-1">
                Loan Purpose
              </label>
              <select
                value={formData.loanPurpose}
                onChange={(e) => setFormData({ ...formData, loanPurpose: e.target.value })}
                className="w-full rounded-xl border border-coffee-200 bg-white px-3.5 py-2.5 text-xs text-espresso focus:border-coffee-500 focus:ring-1 focus:ring-coffee-500 focus:outline-none"
              >
                {product.purposeOptions?.map((opt, idx) => (
                  <option key={idx} value={opt}>{opt}</option>
                ))}
              </select>
            </div>

            {/* Bank Account Details (Masked Protection) */}
            <div className="pt-3 border-t border-coffee-100 space-y-3">
              <span className="text-xs font-mono uppercase tracking-wider text-coffee-700 font-semibold block">
                Disbursement Bank Account
              </span>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-mono uppercase text-stone-700 mb-1">Bank Name</label>
                  <input
                    type="text"
                    required
                    value={formData.payoutBankName}
                    onChange={(e) => setFormData({ ...formData, payoutBankName: e.target.value })}
                    placeholder="e.g. HDFC Bank / SBI"
                    className="w-full rounded-xl border border-coffee-200 bg-white px-3 py-2 text-xs text-espresso focus:border-coffee-500 focus:ring-1 focus:ring-coffee-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-mono uppercase text-stone-700 mb-1">Account Number</label>
                  <input
                    type="text"
                    value={formData.payoutAccountNumber}
                    onChange={(e) => setFormData({ ...formData, payoutAccountNumber: e.target.value })}
                    placeholder="Enter or keep existing masked"
                    className="w-full rounded-xl border border-coffee-200 bg-white px-3 py-2 text-xs font-mono text-espresso focus:border-coffee-500 focus:ring-1 focus:ring-coffee-500 focus:outline-none"
                  />
                  <span className="text-[10px] font-mono text-stone-500 mt-0.5 block">
                    Current masked: {formData.payoutAccountMasked}
                  </span>
                </div>

                <div>
                  <label className="block text-xs font-mono uppercase text-stone-700 mb-1">IFSC Code</label>
                  <input
                    type="text"
                    required
                    maxLength={11}
                    value={formData.payoutIfsc}
                    onChange={(e) => setFormData({ ...formData, payoutIfsc: e.target.value.toUpperCase() })}
                    placeholder="e.g. HDFC0001234"
                    className="w-full rounded-xl border border-coffee-200 bg-white px-3 py-2 text-xs font-mono uppercase text-espresso focus:border-coffee-500 focus:ring-1 focus:ring-coffee-500 focus:outline-none"
                  />
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between pt-4 border-t border-coffee-100">
              <button
                type="button"
                onClick={() => setCurrentStep(1)}
                className="px-4 py-2 text-xs text-stone-600 hover:text-espresso font-medium"
              >
                ← Back
              </button>

              <button
                type="submit"
                disabled={saving}
                className="flex items-center gap-2 rounded-xl bg-coffee-600 hover:bg-coffee-700 px-6 py-2.5 text-xs font-semibold uppercase tracking-wider text-white shadow-sm transition-all"
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
        <div className="rounded-2xl border border-coffee-200 bg-white p-6 sm:p-8 shadow-card">
          <div className="mb-5">
            <span className="text-xs font-mono uppercase tracking-wider text-coffee-600 font-semibold">
              Step 3 of 6
            </span>
            <h2 className="text-lg font-bold text-espresso mt-0.5">
              Financial & Employment Assessment
            </h2>
            <p className="text-xs text-stone-600 mt-1">
              Provide your employment or business details and existing obligations
            </p>
          </div>

          <form onSubmit={handleStep3Next} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-mono uppercase text-stone-700 mb-1">
                  Employer / Business Name
                </label>
                <input
                  type="text"
                  required
                  value={formData.employerName}
                  onChange={(e) => setFormData({ ...formData, employerName: e.target.value })}
                  placeholder="e.g. Infosys Ltd / Shri Ganesh Traders"
                  className="w-full rounded-xl border border-coffee-200 bg-white px-3.5 py-2.5 text-xs text-espresso focus:border-coffee-500 focus:ring-1 focus:ring-coffee-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-mono uppercase text-stone-700 mb-1">
                  Total Work / Business Experience (Years)
                </label>
                <input
                  type="number"
                  step="0.5"
                  min="0"
                  value={formData.workExperience}
                  onChange={(e) => setFormData({ ...formData, workExperience: e.target.value })}
                  className="w-full rounded-xl border border-coffee-200 bg-white px-3.5 py-2.5 text-xs text-espresso font-mono focus:border-coffee-500 focus:ring-1 focus:ring-coffee-500 focus:outline-none"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-mono uppercase text-stone-700 mb-1">
                  Monthly Net Income (₹)
                </label>
                <input
                  type="text"
                  required
                  value={formData.monthlyIncome}
                  onChange={(e) => setFormData({ ...formData, monthlyIncome: e.target.value })}
                  placeholder="75,000"
                  className="w-full rounded-xl border border-coffee-200 bg-white px-3.5 py-2.5 text-xs text-espresso font-mono focus:border-coffee-500 focus:ring-1 focus:ring-coffee-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-mono uppercase text-stone-700 mb-1">
                  Existing Monthly EMIs (₹)
                </label>
                <input
                  type="text"
                  value={formData.existingObligations}
                  onChange={(e) => setFormData({ ...formData, existingObligations: e.target.value })}
                  placeholder="0 if none"
                  className="w-full rounded-xl border border-coffee-200 bg-white px-3.5 py-2.5 text-xs text-espresso font-mono focus:border-coffee-500 focus:ring-1 focus:ring-coffee-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-mono uppercase text-stone-700 mb-1">
                  Approx. Monthly Expenses (₹)
                </label>
                <input
                  type="text"
                  value={formData.monthlyExpenses}
                  onChange={(e) => setFormData({ ...formData, monthlyExpenses: e.target.value })}
                  placeholder="30,000"
                  className="w-full rounded-xl border border-coffee-200 bg-white px-3.5 py-2.5 text-xs text-espresso font-mono focus:border-coffee-500 focus:ring-1 focus:ring-coffee-500 focus:outline-none"
                />
              </div>
            </div>

            <div className="flex items-center justify-between pt-4 border-t border-coffee-100">
              <button
                type="button"
                onClick={() => setCurrentStep(2)}
                className="px-4 py-2 text-xs text-stone-600 hover:text-espresso font-medium"
              >
                ← Back
              </button>

              <button
                type="submit"
                disabled={saving}
                className="flex items-center gap-2 rounded-xl bg-coffee-600 hover:bg-coffee-700 px-6 py-2.5 text-xs font-semibold uppercase tracking-wider text-white shadow-sm transition-all"
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
        <div className="rounded-2xl border border-coffee-200 bg-white p-6 sm:p-8 shadow-card space-y-5">
          <div>
            <span className="text-xs font-mono uppercase tracking-wider text-coffee-600 font-semibold">
              Step 4 of 6
            </span>
            <h2 className="text-lg font-bold text-espresso mt-0.5">
              Upload Supporting Documents
            </h2>
            <p className="text-xs text-stone-600 mt-1">
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

          <div className="flex items-center justify-between pt-4 border-t border-coffee-100">
            <button
              type="button"
              onClick={() => setCurrentStep(3)}
              className="px-4 py-2 text-xs text-stone-600 hover:text-espresso font-medium"
            >
              ← Back
            </button>

            <button
              type="button"
              disabled={loading}
              onClick={handleStep4Next}
              className="flex items-center gap-2 rounded-xl bg-coffee-600 hover:bg-coffee-700 px-6 py-2.5 text-xs font-semibold uppercase tracking-wider text-white shadow-sm transition-all"
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
              className="px-4 py-2 text-xs text-stone-600 hover:text-espresso font-medium"
            >
              ← Back to Documents
            </button>

            <button
              type="button"
              disabled={loading}
              onClick={handleStep5Next}
              className="flex items-center gap-2 rounded-xl bg-coffee-600 hover:bg-coffee-700 px-6 py-2.5 text-xs font-semibold uppercase tracking-wider text-white shadow-sm transition-all"
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
        <div className="rounded-2xl border border-coffee-200 bg-white p-6 sm:p-10 shadow-card space-y-6 text-center">
          {!submittedSuccess ? (
            <div className="space-y-5 max-w-md mx-auto">
              <div className="w-16 h-16 rounded-2xl bg-coffee-50 border border-coffee-200 text-coffee-700 flex items-center justify-center mx-auto shadow-sm">
                <Send className="h-8 w-8" />
              </div>

              <div>
                <span className="text-xs font-mono uppercase tracking-wider text-coffee-600 font-semibold">
                  Step 6 of 6
                </span>
                <h2 className="text-xl font-bold text-espresso mt-1">
                  Ready to Submit Application
                </h2>
                <p className="text-xs text-stone-600 mt-2 leading-relaxed">
                  All required form entries, identity references, and documents have passed initial checks.
                  Click below to record your application reference as Ready for Review.
                </p>
              </div>

              <div className="p-3.5 rounded-xl border border-coffee-200 bg-stone-50/80 text-left text-xs space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-stone-500">Application ID</span>
                  <span className="font-mono text-coffee-700 font-bold">{application?.application_id}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-stone-500">Loan Amount</span>
                  <span className="font-mono text-espresso font-semibold">₹{application?.requested_amount?.toLocaleString('en-IN')}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-stone-500">Duration</span>
                  <span className="font-mono text-espresso">{application?.requested_duration_months} Months</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-stone-500">Underwriting Gate</span>
                  <span className="text-emerald-700 font-semibold flex items-center gap-1">
                    <CheckCircle2 className="h-3 w-3" /> Ready for Review
                  </span>
                </div>
              </div>

              <div className="pt-2 flex flex-col sm:flex-row gap-3 justify-center">
                <button
                  type="button"
                  onClick={() => setCurrentStep(5)}
                  className="px-4 py-2.5 rounded-xl border border-coffee-200 bg-white text-xs text-stone-600 hover:text-espresso font-medium"
                >
                  ← Review Again
                </button>

                <button
                  type="button"
                  disabled={loading}
                  onClick={handleFinalSubmit}
                  className="flex items-center justify-center gap-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 px-6 py-2.5 text-xs font-semibold uppercase tracking-wider text-white shadow-sm transition-all"
                >
                  {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <span>Confirm & Submit Application</span>}
                </button>
              </div>
            </div>
          ) : (
            <div className="space-y-6 max-w-lg mx-auto">
              <div className="w-20 h-20 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-600 flex items-center justify-center mx-auto shadow-sm">
                <CheckCircle2 className="h-10 w-10" />
              </div>

              <div>
                <span className="text-xs font-mono uppercase tracking-wider text-emerald-700 font-semibold">
                  Application Logged Successfully
                </span>
                <h2 className="text-2xl font-bold text-espresso mt-1">
                  Application Ready for Review
                </h2>
                <p className="text-xs sm:text-sm text-stone-600 mt-2 leading-relaxed">
                  Your loan application has been recorded under your verified account.
                  The lending institution review workflow will inspect your verification and documents.
                </p>
              </div>

              {/* Summary Card */}
              <ApplicationSummaryCard application={application} />

              <div className="pt-2 flex items-center justify-center gap-3">
                <Link
                  to="/home"
                  className="px-5 py-2.5 rounded-xl bg-coffee-600 hover:bg-coffee-700 font-semibold text-xs text-white uppercase tracking-wider shadow-sm"
                >
                  Return to Home
                </Link>
                <Link
                  to="/loans"
                  className="px-4 py-2.5 rounded-xl bg-white border border-coffee-200 text-xs text-stone-700 hover:text-espresso font-medium"
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
