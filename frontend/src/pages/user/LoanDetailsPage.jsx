/**
 * TrustLedger LoanDetailsPage (/loans/:loanId)
 * Displays in-depth loan product specifications, eligibility rules,
 * document requirements, interactive EMI calculator, and "Apply for this loan" CTA.
 * Styled in White & Coffee Brown fintech design system.
 */

import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import {
  ArrowLeft,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  FileText,
  Clock,
  Percent,
  CreditCard,
  UserCheck,
  Briefcase,
  Zap,
  Compass,
  GraduationCap,
  Send,
  Loader2
} from 'lucide-react';
import EMICalculator from '../../components/loans/EMICalculator';
import LoanEligibilityNotice from '../../components/loans/LoanEligibilityNotice';
import { getLoanProductById, DEMO_LOAN_PRODUCTS } from '../../data/loanProductsData';
import { useUserAuth } from '../../context/UserAuthContext';
import loanService from '../../services/loanService';

const ICON_MAP = {
  UserCheck: UserCheck,
  Zap: Zap,
  Briefcase: Briefcase,
  Compass: Compass,
  GraduationCap: GraduationCap,
  Send: Send
};

export default function LoanDetailsPage() {
  const { loanId } = useParams();
  const navigate = useNavigate();
  const { user, profile } = useUserAuth();

  const [product, setProduct] = useState(() => getLoanProductById(loanId));
  const [loading, setLoading] = useState(false);
  const [creatingApp, setCreatingApp] = useState(false);
  const [emiValues, setEmiValues] = useState(null);

  const handleEmiValuesChange = useCallback((vals) => {
    setEmiValues(vals);
  }, []);

  const isProfileVerified = profile?.verification_status === 'VERIFIED';

  useEffect(() => {
    let isMounted = true;
    loanService.getLoanProductById(loanId)
      .then((data) => {
        if (isMounted && data) setProduct(data);
      })
      .catch(() => {});
    return () => { isMounted = false; };
  }, [loanId]);

  if (!product) {
    return (
      <div className="rounded-2xl border border-coffee-200 bg-white p-12 text-center shadow-card space-y-4">
        <AlertCircle className="h-12 w-12 text-amber-600 mx-auto" />
        <h2 className="text-base font-bold text-coffee-950">Loan Product Not Found</h2>
        <p className="text-xs text-coffee-600">The requested loan product could not be retrieved from the catalog.</p>
        <Link
          to="/loans"
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-coffee-600 hover:bg-coffee-700 text-xs font-bold text-white shadow-sm transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Back to Loan Marketplace</span>
        </Link>
      </div>
    );
  }

  const IconComponent = ICON_MAP[product.iconName] || UserCheck;

  const handleApplyClick = async () => {
    // 0. Check authentication
    if (!user) {
      navigate('/login', {
        state: { from: { pathname: `/loans/${loanId}` } }
      });
      return;
    }

    // 1. Check profile verification gate
    if (!isProfileVerified) {
      navigate('/profile-setup', {
        state: { returnUrl: `/loans/${loanId}/apply` }
      });
      return;
    }

    // 2. Initialize draft application
    setCreatingApp(true);
    try {
      const requestedAmt = emiValues?.amount || product.defaultAmount || product.minAmount;
      const requestedDuration = emiValues?.duration || product.defaultDurationMonths || product.minDurationMonths;
      const defaultPurpose = product.purposeOptions?.[0] || 'General Loan';

      const draft = await loanService.createApplication({
        loan_product_id: product.id,
        requested_amount: requestedAmt,
        requested_duration_months: requestedDuration,
        loan_purpose: defaultPurpose
      }, user?.id);

      navigate(`/loans/${product.id}/apply?appId=${draft.application_id}`);
    } catch (err) {
      console.warn('Failed to start application draft:', err);
      // Fallback navigation
      navigate(`/loans/${product.id}/apply`);
    } finally {
      setCreatingApp(false);
    }
  };

  return (
    <div className="space-y-8 animate-fadeIn">
      
      {/* Navigation Breadcrumb */}
      <div className="flex items-center gap-2 text-xs font-medium text-coffee-600">
        <Link to="/loans" className="hover:text-coffee-950 flex items-center gap-1 font-semibold">
          <ArrowLeft className="h-3.5 w-3.5" />
          <span>Loan Marketplace</span>
        </Link>
        <span>/</span>
        <span className="text-coffee-950 font-bold">{product.name}</span>
      </div>

      {/* Main Two-Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        
        {/* Left 2 Cols: Loan Specifications, Eligibility, Documents */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Header Card */}
          <div className="rounded-2xl border border-coffee-200 bg-white p-6 sm:p-8 shadow-card space-y-4 relative overflow-hidden">
            <div className="flex items-start justify-between gap-4">
              <div className="flex items-center gap-3.5">
                <div className="p-3 rounded-2xl bg-coffee-50 border border-coffee-200 text-coffee-700">
                  <IconComponent className="h-7 w-7" />
                </div>
                <div>
                  <span className="text-xs font-mono uppercase tracking-wider text-coffee-600 font-bold">
                    {product.category} Loan
                  </span>
                  <h1 className="text-2xl sm:text-3xl font-extrabold text-coffee-950 mt-0.5">
                    {product.name}
                  </h1>
                </div>
              </div>

              {product.badge && (
                <span className="text-xs font-mono px-3 py-1 rounded-full bg-coffee-100 text-coffee-800 border border-coffee-200 font-bold">
                  {product.badge}
                </span>
              )}
            </div>

            <p className="text-xs sm:text-sm text-coffee-700 leading-relaxed font-normal">
              {product.description}
            </p>

            {/* Key Terms Matrix */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
              <div className="p-3.5 rounded-xl border border-coffee-200 bg-coffee-50/50">
                <span className="text-[10px] font-mono uppercase text-coffee-600 block mb-1 font-medium">Loan Range</span>
                <span className="font-bold text-coffee-950 font-mono text-xs">
                  ₹{(product.minAmount ?? product.min_amount ?? 0).toLocaleString('en-IN')} – ₹{(product.maxAmount ?? product.max_amount ?? 0).toLocaleString('en-IN')}
                </span>
              </div>
              <div className="p-3.5 rounded-xl border border-coffee-200 bg-coffee-50/50">
                <span className="text-[10px] font-mono uppercase text-coffee-600 block mb-1 font-medium">Duration</span>
                <span className="font-bold text-coffee-950 font-mono text-xs">
                  {product.minDurationMonths ?? product.min_duration_months ?? 6} – {product.maxDurationMonths ?? product.max_duration_months ?? 36} Mos
                </span>
              </div>
              <div className="p-3.5 rounded-xl border border-coffee-200 bg-coffee-50/50">
                <span className="text-[10px] font-mono uppercase text-coffee-600 block mb-1 font-medium">Interest Rate</span>
                <span className="font-bold text-coffee-800 font-mono text-xs">
                  {product.minInterestRate ?? product.min_interest_rate ?? 12}% – {product.maxInterestRate ?? product.max_interest_rate ?? 18}% p.a.
                </span>
              </div>
              <div className="p-3.5 rounded-xl border border-coffee-200 bg-coffee-50/50">
                <span className="text-[10px] font-mono uppercase text-coffee-600 block mb-1 font-medium">Processing Fee</span>
                <span className="font-bold text-coffee-950 text-xs">
                  {product.processingFeePercentage ?? product.processing_fee_percentage ?? 2}%
                </span>
              </div>
            </div>
          </div>

          {/* Interactive EMI Calculator */}
          <EMICalculator
            initialAmount={product.defaultAmount ?? 100000}
            minAmount={product.minAmount ?? product.min_amount ?? 10000}
            maxAmount={product.maxAmount ?? product.max_amount ?? 2000000}
            initialDuration={product.defaultDurationMonths ?? 24}
            minDuration={product.minDurationMonths ?? product.min_duration_months ?? 6}
            maxDuration={product.maxDurationMonths ?? product.max_duration_months ?? 60}
            interestRate={product.defaultInterestRate ?? 14}
            onValuesChange={handleEmiValuesChange}
          />

          {/* Eligibility Criteria Card */}
          <div className="rounded-2xl border border-coffee-200 bg-white p-6 shadow-card space-y-4">
            <h3 className="text-sm font-bold text-coffee-950 flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 text-coffee-600" />
              <span>Eligibility Guidelines</span>
            </h3>
            <div className="space-y-2.5">
              {product.eligibilityCriteria?.map((crit, idx) => (
                <div key={idx} className="flex items-center gap-2.5 text-xs text-coffee-800">
                  <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600 shrink-0" />
                  <span>{crit}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Required Documents Checklist Card */}
          <div className="rounded-2xl border border-coffee-200 bg-white p-6 shadow-card space-y-4">
            <h3 className="text-sm font-bold text-coffee-950 flex items-center gap-2">
              <FileText className="h-4 w-4 text-coffee-600" />
              <span>Required Supporting Documents</span>
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {product.requiredDocuments?.map((doc, idx) => (
                <div key={idx} className="p-3.5 rounded-xl border border-coffee-200 bg-coffee-50/50 text-xs space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-coffee-950">{doc.type}</span>
                    {doc.required && (
                      <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-amber-50 text-amber-800 border border-amber-200">
                        Required
                      </span>
                    )}
                  </div>
                  <p className="text-[11px] text-coffee-600 leading-relaxed">{doc.note}</p>
                </div>
              ))}
            </div>
          </div>

        </div>

        {/* Right 1 Col: Apply CTA Box & Sticky Overview */}
        <div className="space-y-6 lg:sticky lg:top-24">
          
          <div className="rounded-2xl border border-coffee-200 bg-white p-6 shadow-card space-y-5">
            <div>
              <span className="text-[10px] font-mono uppercase tracking-wider text-coffee-600 font-bold block mb-1">
                Loan Application Step
              </span>
              <h3 className="text-lg font-bold text-coffee-950">
                Apply for {product.name}
              </h3>
              <p className="text-xs text-coffee-600 mt-1">
                Your verified identity details will be pre-filled to save you time.
              </p>
            </div>

            {/* Verification Status Notice */}
            <div className={`p-3.5 rounded-xl border text-xs flex items-start gap-2.5 ${
              isProfileVerified
                ? 'border-emerald-200 bg-emerald-50 text-emerald-900'
                : 'border-amber-200 bg-amber-50 text-amber-900'
            }`}>
              {isProfileVerified ? (
                <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0 mt-0.5" />
              ) : (
                <AlertCircle className="h-4 w-4 text-amber-600 shrink-0 mt-0.5" />
              )}
              <div>
                <span className="font-bold block">
                  {isProfileVerified ? 'Profile Verified' : 'Verification Required'}
                </span>
                <span className="text-[11px] text-coffee-700 mt-0.5 block">
                  {isProfileVerified
                    ? 'Your identity is verified. You are ready to apply.'
                    : 'Please complete profile setup before starting a loan application.'}
                </span>
              </div>
            </div>

            {/* Estimated EMI Summary for selected parameters */}
            {emiValues && (
              <div className="p-3.5 rounded-xl border border-coffee-200 bg-coffee-50/50 space-y-2 text-xs">
                <div className="flex justify-between text-coffee-700">
                  <span>Selected Amount:</span>
                  <span className="text-coffee-950 font-mono font-bold">₹{emiValues.amount.toLocaleString('en-IN')}</span>
                </div>
                <div className="flex justify-between text-coffee-700">
                  <span>Tenure:</span>
                  <span className="text-coffee-950 font-mono font-bold">{emiValues.duration} Months</span>
                </div>
                <div className="flex justify-between text-coffee-700 pt-1.5 border-t border-coffee-200">
                  <span className="font-bold text-coffee-950">Estimated EMI:</span>
                  <span className="text-coffee-900 font-mono font-extrabold text-sm">₹{emiValues.emi.toLocaleString('en-IN')} / mo</span>
                </div>
              </div>
            )}

            {/* Primary Action Button */}
            <button
              type="button"
              disabled={creatingApp}
              onClick={handleApplyClick}
              className="w-full flex items-center justify-center gap-2 rounded-xl bg-coffee-600 hover:bg-coffee-700 px-6 py-3.5 text-xs font-bold uppercase tracking-wider text-white shadow-sm transition-all disabled:opacity-60 cursor-pointer"
            >
              {creatingApp ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <span>Preparing Application...</span>
                </>
              ) : (
                <>
                  <span>Apply for this loan</span>
                  <ArrowRight className="h-4 w-4" />
                </>
              )}
            </button>

            <div className="text-center">
              <Link
                to="/loans"
                className="text-xs text-coffee-600 hover:text-coffee-950 font-semibold"
              >
                ← Browse other loan options
              </Link>
            </div>
          </div>

          <LoanEligibilityNotice />

        </div>

      </div>

    </div>
  );
}
