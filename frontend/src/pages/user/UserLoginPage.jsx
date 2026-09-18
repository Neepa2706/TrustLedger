/**
 * TrustLedger User LoginPage (/login)
 * Clean, mobile-friendly customer login page for Indian borrowers.
 * Headline: "Apply with confidence."
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
  const { login, loginWithGoogle, loading, authError, clearError, isDemo, profile } = useUserAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [forgotPasswordOpen, setForgotPasswordOpen] = useState(false);
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
      await login('applicant.demo@trustledger.in', 'DemoPassword123!');
      navigate(targetRedirect, { replace: true });
    } catch (err) {
      setLocalError(err.message || 'Demo sign-in failed.');
    }
  };

  const handleGoogleSignIn = async () => {
    setLocalError('');
    clearError();
    try {
      await loginWithGoogle();
      navigate(targetRedirect, { replace: true });
    } catch (err) {
      setLocalError('Google sign-in could not be completed. Please try again.');
    }
  };

  return (
    <div className="min-h-screen w-full bg-midnight-950 text-slate-100 flex flex-col justify-between overflow-x-hidden relative selection:bg-cyan-500 selection:text-midnight-950">
      
      {/* Background Ambient Glows */}
      <div className="absolute top-0 left-1/3 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none -translate-x-1/2 -translate-y-1/2" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl pointer-events-none translate-x-1/2 translate-y-1/2" />

      {/* Main Container */}
      <div className="flex-1 flex flex-col lg:flex-row w-full max-w-7xl mx-auto items-stretch p-4 sm:p-6 lg:p-10">
        
        {/* =========================================================================
            LEFT PANEL: BORROWER TRUST & VALUE PROPOSITION
            ========================================================================= */}
        <div className="order-2 lg:order-1 lg:w-[54%] p-6 sm:p-10 flex flex-col justify-between border-t lg:border-t-0 lg:border-r border-surface-border/80">
          <div>
            <div className="mb-8">
              <TrustLedgerLogo size="lg" />
              <div className="text-xs font-mono text-cyan-400/90 mt-2 tracking-wide">
                Secure digital lending, verified from the start.
              </div>
            </div>

            <div className="max-w-xl">
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight text-white leading-tight">
                Apply with{' '}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-sky-300 to-blue-500">
                  confidence.
                </span>
              </h1>

              <p className="mt-4 text-xs sm:text-sm text-slate-300 leading-relaxed">
                Secure your identity, verify your documents, and manage your digital loan journey in one place.
              </p>
            </div>

            {/* Mandatory Single Person Rule Callout */}
            <div className="mt-8">
              <SingleAccountNotice variant="callout" />
            </div>

            {/* Value Highlights */}
            <div className="mt-8 space-y-3">
              <div className="flex items-center gap-3 p-3 rounded-xl border border-surface-border bg-midnight-900/60 text-xs text-slate-300">
                <CheckCircle2 className="h-4 w-4 text-cyan-400 shrink-0" />
                <span>Instant document-based identity verification</span>
              </div>
              <div className="flex items-center gap-3 p-3 rounded-xl border border-surface-border bg-midnight-900/60 text-xs text-slate-300">
                <CheckCircle2 className="h-4 w-4 text-cyan-400 shrink-0" />
                <span>Camera photograph biometric protection (no fraud impersonation)</span>
              </div>
              <div className="flex items-center gap-3 p-3 rounded-xl border border-surface-border bg-midnight-900/60 text-xs text-slate-300">
                <CheckCircle2 className="h-4 w-4 text-cyan-400 shrink-0" />
                <span>Personal loan applications tracked under your verified account</span>
              </div>
            </div>
          </div>

          {/* Left Footnote */}
          <div className="pt-6 mt-6 border-t border-surface-border/50 text-[11px] font-mono text-slate-400 flex items-center gap-2">
            <ShieldCheck className="h-3.5 w-3.5 text-emerald-400" />
            <span>Bank-grade encryption • Sensitive numbers automatically masked</span>
          </div>
        </div>

        {/* =========================================================================
            RIGHT PANEL: LOGIN FORM
            ========================================================================= */}
        <div className="order-1 lg:order-2 lg:w-[46%] p-4 sm:p-8 lg:p-10 flex flex-col justify-center items-center">
          
          <div className="w-full max-w-md rounded-2xl border border-surface-border bg-surface-card/95 p-6 sm:p-8 shadow-2xl backdrop-blur-xl relative">
            
            {/* Top highlight bar */}
            <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-cyan-400 to-transparent rounded-t-2xl" />

            {/* Header */}
            <div className="mb-6">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono uppercase tracking-wider text-cyan-400 font-semibold">
                  Loan Applicant Portal
                </span>
                {isDemo && (
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-cyan-950 text-cyan-300 border border-cyan-500/30">
                    DEMO MODE
                  </span>
                )}
              </div>
              <h2 className="text-xl font-bold tracking-tight text-white mt-1">
                Sign in to your Applicant Account
              </h2>
              <p className="text-xs text-slate-400 mt-1">
                Access your verified identity, explore loan offers, and track applications
              </p>
            </div>

            {/* Target Destination Direct Navigation Banner */}
            {queryRedirect && (
              <div className="mb-4 p-3 rounded-xl border border-cyan-500/40 bg-cyan-950/40 text-xs text-cyan-200 flex items-center justify-between gap-3">
                <div className="space-y-0.5">
                  <div className="font-mono text-[10px] text-cyan-400 uppercase font-bold">Target Destination</div>
                  <div className="text-white font-semibold">
                    {queryRedirect.includes('personal') ? 'Personal Loan Details' : 'Loan Details'}
                  </div>
                </div>
                <Link
                  to={queryRedirect}
                  className="px-3 py-1.5 rounded-lg bg-cyan-500 hover:bg-cyan-400 text-midnight-950 text-xs font-bold shrink-0 transition shadow-[0_0_12px_rgba(0,240,255,0.3)]"
                >
                  View Loan Details →
                </Link>
              </div>
            )}

            {/* Already Signed In Status */}
            {user && (
              <div className="mb-4 p-3.5 rounded-xl border border-emerald-500/40 bg-emerald-950/30 text-xs space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    <span className="text-emerald-300 font-bold">Signed in as {user.fullName || user.email}</span>
                  </div>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-900/60 text-emerald-300">ACTIVE</span>
                </div>
                <div className="flex items-center gap-2 pt-1">
                  <Link
                    to={targetRedirect}
                    className="flex-1 text-center py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs transition"
                  >
                    Continue to Loan Details →
                  </Link>
                  <button
                    type="button"
                    onClick={async () => {
                      localStorage.removeItem('trustledger_borrower_session');
                      window.location.reload();
                    }}
                    className="px-3 py-2 rounded-lg border border-surface-border text-slate-400 hover:text-white text-xs"
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
                className="mb-5 flex items-start gap-2.5 rounded-lg border border-red-500/40 bg-red-950/40 p-3 text-xs text-red-200 animate-fadeIn"
              >
                <AlertCircle className="h-4 w-4 text-red-400 shrink-0 mt-0.5" />
                <div className="flex-1">
                  <div className="font-semibold text-red-300">Unable to sign in</div>
                  <div className="mt-0.5 text-slate-300">{localError || authError}</div>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setLocalError('');
                    clearError();
                  }}
                  className="text-red-400 hover:text-white"
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
              className="w-full mb-3 flex items-center justify-center gap-2 rounded-lg bg-cyan-950/80 hover:bg-cyan-900/90 border border-cyan-500/50 px-4 py-2.5 text-xs font-semibold text-cyan-300 transition-all shadow-[0_0_15px_rgba(0,240,255,0.15)] hover:shadow-[0_0_20px_rgba(0,240,255,0.3)]"
            >
              <Sparkles className="h-4 w-4 text-cyan-400" />
              <span>⚡ 1-Click Demo Applicant Sign In</span>
            </button>

            {/* Google OAuth Button */}
            <button
              type="button"
              onClick={handleGoogleSignIn}
              disabled={loading}
              className="w-full flex items-center justify-center gap-3 rounded-lg border border-surface-border bg-midnight-950 hover:bg-midnight-900 px-4 py-2.5 text-xs font-medium text-white transition-all shadow-sm focus:outline-none focus:ring-1 focus:ring-cyan-400"
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
                <div className="w-full border-t border-surface-border" />
              </div>
              <div className="relative flex justify-center text-[10px] uppercase font-mono">
                <span className="bg-surface-card px-2 text-slate-400">
                  Or sign in with email
                </span>
              </div>
            </div>

            {/* Form */}
            <form onSubmit={handleSignIn} className="space-y-4" noValidate>
              <div>
                <label className="block text-xs font-mono uppercase tracking-wider text-slate-300 mb-1.5">
                  Email Address
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="applicant@example.com"
                  className="w-full rounded-lg border border-surface-border bg-midnight-950 px-3.5 py-2.5 text-xs text-white placeholder-slate-500 font-sans focus:border-cyan-400 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-mono uppercase tracking-wider text-slate-300 mb-1.5">
                  Password
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter your password"
                    className="w-full rounded-lg border border-surface-border bg-midnight-950 pl-3.5 pr-10 py-2.5 text-xs text-white placeholder-slate-500 font-sans focus:border-cyan-400 focus:outline-none"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 p-1 text-slate-400 hover:text-cyan-300"
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-end">
                <button
                  type="button"
                  onClick={() => setForgotPasswordOpen(true)}
                  className="text-xs font-mono text-cyan-400 hover:text-cyan-300 hover:underline"
                >
                  Forgot password?
                </button>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full mt-2 flex items-center justify-center gap-2 rounded-lg bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 px-4 py-2.5 text-xs font-semibold uppercase tracking-wider text-midnight-950 shadow-[0_0_20px_rgba(0,240,255,0.25)] transition-all disabled:opacity-60"
              >
                {loading ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    <span>Signing in...</span>
                  </>
                ) : (
                  <>
                    <span>Sign in</span>
                    <ArrowRight className="h-4 w-4" />
                  </>
                )}
              </button>
            </form>

            {/* Forgot password feedback */}
            {forgotPasswordOpen && (
              <div className="mt-4 p-3 rounded-lg border border-cyan-500/30 bg-cyan-950/40 text-xs text-cyan-200 flex items-start justify-between gap-2 animate-fadeIn">
                <div>
                  <span className="font-semibold block text-cyan-300">Password Reset</span>
                  <span className="text-[11px] text-slate-300 mt-0.5 block">
                    Password reset link will be sent to your registered email via Supabase Auth.
                  </span>
                </div>
                <button
                  onClick={() => setForgotPasswordOpen(false)}
                  className="text-cyan-400 hover:text-white"
                >
                  <X className="h-3.5 w-3.5" />
                </button>
              </div>
            )}

            {/* Register Link */}
            <div className="mt-5 text-center border-t border-surface-border/70 pt-4">
              <span className="text-xs text-slate-400">
                New applicant?{' '}
                <Link to="/register" className="text-cyan-400 hover:underline font-semibold">
                  Create your personal account →
                </Link>
              </span>
            </div>

            {/* Explore Loans Link */}
            <div className="mt-3 text-center">
              <Link
                to="/loans"
                className="inline-flex items-center gap-1.5 text-xs font-medium text-slate-400 hover:text-cyan-300 py-1"
              >
                <span>Browse available loans without signing in →</span>
              </Link>
            </div>

          </div>
        </div>

      </div>

      <footer className="w-full border-t border-surface-border/50 py-3 px-6 text-center text-[11px] font-mono text-slate-500">
        TrustLedger © 2026 • Secure digital lending, verified from the start
      </footer>
    </div>
  );
}
