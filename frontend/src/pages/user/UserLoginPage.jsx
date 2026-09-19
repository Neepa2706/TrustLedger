/**
 * TrustLedger User LoginPage (/login)
 * Clean, mobile-friendly customer login page for Indian borrowers.
 * Styled in White & Coffee Brown fintech design system.
 * Supabase Auth Google OAuth + Email/Password + Demo Mode.
 */

import React, { useState } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import {
  ShieldCheck,
  Lock,
  Eye,
  EyeOff,
  ArrowRight,
  Sparkles,
  AlertCircle,
  Loader2,
  CheckCircle2,
  X
} from 'lucide-react';
import TrustLedgerLogo from '../../components/branding/TrustLedgerLogo';
import SingleAccountNotice from '../../components/user/SingleAccountNotice';
import { useUserAuth } from '../../context/UserAuthContext';

export default function UserLoginPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { login, loginWithGoogle, loading, authError, clearError, isDemo, profile, user } = useUserAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [forgotPasswordOpen, setForgotPasswordOpen] = useState(false);
  const [localError, setLocalError] = useState('');
  const searchParams = new URLSearchParams(location.search);
  const queryRedirect = searchParams.get('redirect');
  const targetRedirect = queryRedirect || location.state?.from?.pathname || '/loans';

  const handleSignIn = async (e) => {
    e.preventDefault();
    setLocalError('');
    clearError();

    if (!email || !email.trim()) {
      setLocalError('Please enter your email.');
      return;
    }
    if (!password) {
      setLocalError('Please enter your password.');
      return;
    }

    try {
      await login(email, password);
      navigate(targetRedirect, { replace: true });
    } catch (err) {
      setLocalError(err.message || 'Email or password is incorrect.');
    }
  };

  const handleDemoLogin = async () => {
    setLocalError('');
    clearError();
    try {
      await login('arjun.kumar@example.com', 'DemoPass123!');
      navigate(targetRedirect, { replace: true });
    } catch (err) {
      setLocalError(err.message || 'Demo login failed.');
    }
  };

  const handleGoogleSignIn = async () => {
    setLocalError('');
    clearError();
    try {
      await loginWithGoogle();
    } catch (err) {
      setLocalError(err.message || 'Google sign-in failed.');
    }
  };

  return (
    <div className="min-h-screen w-full bg-[#FAF8F5] text-coffee-950 flex flex-col justify-between overflow-x-hidden relative selection:bg-coffee-600 selection:text-white">
      
      {/* Main Container */}
      <div className="flex-1 flex flex-col lg:flex-row w-full max-w-7xl mx-auto items-stretch p-4 sm:p-6 lg:p-10">
        
        {/* =========================================================================
            LEFT PANEL: BORROWER TRUST & VALUE PROPOSITION
            ========================================================================= */}
        <div className="order-2 lg:order-1 lg:w-[54%] p-6 sm:p-10 flex flex-col justify-between border-t lg:border-t-0 lg:border-r border-coffee-200">
          <div>
            <div className="mb-8">
              <TrustLedgerLogo size="lg" />
              <div className="text-xs font-bold text-coffee-800 mt-2 tracking-wide">
                Secure digital lending, verified from the start.
              </div>
            </div>

            <div className="max-w-xl">
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight text-coffee-950 leading-tight">
                Apply with{' '}
                <span className="text-coffee-700 underline decoration-coffee-400">
                  confidence.
                </span>
              </h1>

              <p className="mt-4 text-sm text-coffee-900 leading-relaxed font-semibold">
                Secure your identity, verify your documents, and manage your digital loan journey in one place.
              </p>
            </div>

            {/* Mandatory Single Person Rule Callout */}
            <div className="mt-8">
              <SingleAccountNotice variant="callout" />
            </div>

            {/* Value Highlights */}
            <div className="mt-8 space-y-3">
              <div className="flex items-center gap-3 p-3.5 rounded-2xl border border-coffee-300 bg-white text-xs text-coffee-950 font-bold shadow-sm">
                <CheckCircle2 className="h-4 w-4 text-coffee-700 shrink-0" />
                <span>Instant document-based identity verification</span>
              </div>
              <div className="flex items-center gap-3 p-3.5 rounded-2xl border border-coffee-300 bg-white text-xs text-coffee-950 font-bold shadow-sm">
                <CheckCircle2 className="h-4 w-4 text-coffee-700 shrink-0" />
                <span>Camera photograph biometric protection (no fraud impersonation)</span>
              </div>
              <div className="flex items-center gap-3 p-3.5 rounded-2xl border border-coffee-300 bg-white text-xs text-coffee-950 font-bold shadow-sm">
                <CheckCircle2 className="h-4 w-4 text-coffee-700 shrink-0" />
                <span>Personal loan applications tracked under your verified account</span>
              </div>
            </div>
          </div>

          {/* Left Footnote */}
          <div className="pt-6 mt-6 border-t border-coffee-200 text-xs text-coffee-800 font-bold flex items-center gap-2">
            <ShieldCheck className="h-4 w-4 text-emerald-700" />
            <span>Bank-grade encryption • Sensitive numbers automatically masked</span>
          </div>
        </div>

        {/* =========================================================================
            RIGHT PANEL: LOGIN FORM
            ========================================================================= */}
        <div className="order-1 lg:order-2 lg:w-[46%] p-4 sm:p-8 lg:p-10 flex flex-col justify-center items-center">
          
          <div className="w-full max-w-md rounded-2xl border-2 border-coffee-200 bg-white p-6 sm:p-8 shadow-xl relative">
            
            {/* Header */}
            <div className="mb-6">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono uppercase tracking-wider text-coffee-800 font-extrabold">
                  Loan Applicant Portal
                </span>
                {isDemo && (
                  <span className="text-[10px] font-mono px-2.5 py-0.5 rounded-full bg-coffee-100 text-coffee-950 border border-coffee-300 font-extrabold">
                    DEMO MODE
                  </span>
                )}
              </div>
              <h2 className="text-xl font-extrabold tracking-tight text-coffee-950 mt-1">
                Sign in to your Applicant Account
              </h2>
              <p className="text-xs text-coffee-800 mt-1 font-semibold">
                Access your verified identity, explore loan offers, and track applications
              </p>
            </div>

            {/* Target Destination Direct Navigation Banner */}
            {queryRedirect && (
              <div className="mb-4 p-3.5 rounded-xl border border-coffee-300 bg-coffee-50 text-xs text-coffee-950 flex items-center justify-between gap-3">
                <div className="space-y-0.5">
                  <div className="font-mono text-[10px] text-coffee-800 uppercase font-bold">Target Destination</div>
                  <div className="text-coffee-950 font-extrabold">
                    {queryRedirect.includes('personal') ? 'Personal Loan Details' : 'Loan Details'}
                  </div>
                </div>
                <Link
                  to={queryRedirect}
                  className="px-3.5 py-1.5 rounded-xl bg-coffee-600 hover:bg-coffee-700 text-white text-xs font-bold shrink-0 transition shadow-sm"
                >
                  View Loan Details →
                </Link>
              </div>
            )}

            {/* Already Signed In Status */}
            {user && (
              <div className="mb-4 p-4 rounded-xl border border-emerald-300 bg-emerald-50 text-xs space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-700" />
                    <span className="text-emerald-950 font-extrabold">Signed in as {user.fullName || user.email}</span>
                  </div>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-white text-emerald-800 border border-emerald-200 font-bold">ACTIVE</span>
                </div>
                <div className="flex items-center gap-2 pt-1">
                  <Link
                    to={targetRedirect}
                    className="flex-1 text-center py-2 rounded-xl bg-coffee-600 hover:bg-coffee-700 text-white font-bold text-xs transition shadow-sm"
                  >
                    Continue to Loan Details →
                  </Link>
                  <button
                    type="button"
                    onClick={async () => {
                      localStorage.removeItem('trustledger_borrower_session');
                      window.location.reload();
                    }}
                    className="px-3 py-2 rounded-xl border border-coffee-300 bg-white text-coffee-950 hover:bg-coffee-50 text-xs font-bold"
                  >
                    Sign Out
                  </button>
                </div>
              </div>
            )}

            {/* Error Message */}
            {(localError || authError) && (
              <div
                role="alert"
                className="mb-5 flex items-start gap-2.5 rounded-xl border border-rose-300 bg-rose-50 p-3.5 text-xs text-rose-950 font-medium animate-fadeIn"
              >
                <AlertCircle className="h-4 w-4 text-rose-700 shrink-0 mt-0.5" />
                <div className="flex-1">
                  <div className="font-extrabold text-rose-950">Unable to sign in</div>
                  <div className="mt-0.5 text-rose-900 font-semibold">{localError || authError}</div>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setLocalError('');
                    clearError();
                  }}
                  className="text-rose-700 hover:text-rose-950 font-bold"
                >
                  <X className="h-3.5 w-3.5" />
                </button>
              </div>
            )}

            {/* 1-Click Demo Applicant Sign In */}
            <button
              type="button"
              onClick={handleDemoLogin}
              disabled={loading}
              className="w-full mb-3 flex items-center justify-center gap-2 rounded-xl bg-coffee-100 hover:bg-coffee-200 border-2 border-coffee-300 px-4 py-2.5 text-xs font-extrabold text-coffee-950 transition-all shadow-sm cursor-pointer"
            >
              <Sparkles className="h-4 w-4 text-coffee-700" />
              <span>⚡ 1-Click Demo Applicant Sign In</span>
            </button>

            {/* Google OAuth Button */}
            <button
              type="button"
              onClick={handleGoogleSignIn}
              disabled={loading}
              className="w-full flex items-center justify-center gap-3 rounded-xl border-2 border-coffee-200 bg-white hover:bg-coffee-50 px-4 py-2.5 text-xs font-bold text-coffee-950 transition-all shadow-sm focus:outline-none focus:ring-1 focus:ring-coffee-500 cursor-pointer"
            >
              <svg className="h-4 w-4" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                />
                <path
                  fill="#EA4335"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                />
              </svg>
              <span>Continue with Google</span>
            </button>

            {/* Divider */}
            <div className="relative my-4">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-coffee-200" />
              </div>
              <div className="relative flex justify-center text-[10px] uppercase font-mono">
                <span className="bg-white px-2 text-coffee-800 font-extrabold">
                  Or sign in with email
                </span>
              </div>
            </div>

            {/* Form */}
            <form onSubmit={handleSignIn} className="space-y-4" noValidate>
              <div>
                <label className="block text-xs font-extrabold text-coffee-950 mb-1.5">
                  Email Address
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="applicant@example.com"
                  className="w-full rounded-xl border-2 border-coffee-200 focus:border-coffee-600 bg-white px-3.5 py-2.5 text-xs text-coffee-950 placeholder-coffee-600 font-bold font-sans focus:outline-none focus:ring-1 focus:ring-coffee-500 shadow-xs"
                />
              </div>

              <div>
                <label className="block text-xs font-extrabold text-coffee-950 mb-1.5">
                  Password
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter your password"
                    className="w-full rounded-xl border-2 border-coffee-200 focus:border-coffee-600 bg-white pl-3.5 pr-10 py-2.5 text-xs text-coffee-950 placeholder-coffee-600 font-bold font-sans focus:outline-none focus:ring-1 focus:ring-coffee-500 shadow-xs"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-coffee-700 hover:text-coffee-950"
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-end">
                <button
                  type="button"
                  onClick={() => setForgotPasswordOpen(false)}
                  className="text-xs font-bold text-coffee-800 hover:text-coffee-950 underline cursor-pointer"
                >
                  Forgot password?
                </button>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full mt-2 flex items-center justify-center gap-2 rounded-xl bg-coffee-600 hover:bg-coffee-700 px-4 py-3 text-xs font-extrabold uppercase tracking-wider text-white shadow-md transition-all disabled:opacity-60 cursor-pointer"
              >
                {loading ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    <span>Signing in...</span>
                  </>
                ) : (
                  <>
                    <span>Sign in to Borrower Portal</span>
                    <ArrowRight className="h-4 w-4" />
                  </>
                )}
              </button>
            </form>

            {/* Register Link */}
            <div className="mt-5 text-center border-t border-coffee-100 pt-4">
              <span className="text-xs text-coffee-900 font-semibold">
                New applicant?{' '}
                <Link to="/register" className="text-coffee-700 hover:text-coffee-950 font-extrabold underline">
                  Create your personal account →
                </Link>
              </span>
            </div>

            {/* Explore Loans Link */}
            <div className="mt-2.5 text-center space-y-1.5">
              <div>
                <Link
                  to="/loans"
                  className="inline-flex items-center gap-1.5 text-xs font-bold text-coffee-800 hover:text-coffee-950 underline py-1"
                >
                  <span>Browse available loans without signing in →</span>
                </Link>
              </div>
              <div className="pt-2 border-t border-coffee-100">
                <Link
                  to="/lender/login"
                  className="inline-flex items-center gap-1 text-xs font-bold text-coffee-700 hover:text-coffee-950 hover:underline"
                >
                  <span>🏦 Institution / Lender Investigation Portal →</span>
                </Link>
              </div>
            </div>

          </div>
        </div>

      </div>

      <footer className="w-full border-t border-coffee-200 py-4 px-6 text-center text-xs font-bold text-coffee-800 bg-white">
        TrustLedger © 2026 • Secure digital lending, verified from the start
      </footer>
    </div>
  );
}
