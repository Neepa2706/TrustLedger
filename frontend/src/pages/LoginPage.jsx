import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import {
  ShieldCheck,
  Lock,
  Eye,
  EyeOff,
  ArrowRight,
  Sparkles,
  AlertCircle,
  CheckCircle2,
  X,
  KeyRound,
  Loader2,
  Building2
} from 'lucide-react';
import TrustLedgerLogo from '../components/branding/TrustLedgerLogo';
import NetworkTrustGraphic from '../components/auth/NetworkTrustGraphic';
import { useAuth } from '../hooks/useAuth';
import authService from '../services/authService';

export default function LoginPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { login, loginDemo, loading, authError, clearError } = useAuth();

  const searchParams = new URLSearchParams(location.search);
  const isJustRegistered = searchParams.get('registered') === 'true' || Boolean(location.state?.registeredEmail);
  const targetOverride = searchParams.get('target') || location.state?.targetPath;

  const [email, setEmail] = useState(() => {
    return location.state?.registeredEmail || 'analyst@trustledger.shield';
  });
  const [password, setPassword] = useState('trustshield2026');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [forgotPasswordOpen, setForgotPasswordOpen] = useState(false);
  const [localError, setLocalError] = useState('');

  // Destination after login (defaulting to /applications if registered, otherwise /dashboard)
  const fromPath = targetOverride || location.state?.from?.pathname || '/dashboard';

  const registeredCompany = authService.getRegisteredCompany();

  const handleSignIn = async (e) => {
    e.preventDefault();
    setLocalError('');
    clearError();

    try {
      await login(email, password, rememberMe);
      navigate(fromPath, { replace: true });
    } catch (err) {
      setLocalError(err.message || 'Unable to sign in. Please check your credentials and try again.');
    }
  };

  const handleTryDemo = async () => {
    setLocalError('');
    clearError();

    try {
      await loginDemo();
      navigate('/dashboard', { replace: true });
    } catch {
      setLocalError('Demo access could not be started. Please try again.');
    }
  };

  return (
    <div className="min-h-screen w-full bg-surface-base text-espresso flex flex-col justify-between overflow-x-hidden relative animate-fadeIn">
      {/* Background Ambient Glows */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-coffee-100/50 rounded-full blur-3xl pointer-events-none -translate-x-1/2 -translate-y-1/2" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-coffee-200/30 rounded-full blur-3xl pointer-events-none translate-x-1/2 translate-y-1/2" />

      {/* Main Two-Panel Section */}
      <div className="flex-1 flex flex-col lg:flex-row w-full max-w-7xl mx-auto items-stretch">
        
        {/* =========================================================================
            LEFT PANEL: TRUSTLEDGER BRAND EXPERIENCE
            ========================================================================= */}
        <div className="order-2 lg:order-1 lg:w-[58%] p-6 sm:p-10 lg:p-14 flex flex-col justify-between border-t lg:border-t-0 lg:border-r border-coffee-200">
          <div>
            {/* Desktop Brand Header */}
            <div className="hidden lg:block mb-8">
              <TrustLedgerLogo size="lg" />
              <div className="text-xs font-mono text-coffee-700 mt-2 tracking-wide font-medium">
                AI + Cybersecurity Fraud Shield for Digital Lending
              </div>
            </div>

            {/* Headline and Supporting Narrative */}
            <div className="max-w-xl">
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight text-espresso leading-tight">
                Verify the evidence.{' '}
                <span className="text-coffee-700 font-extrabold">
                  Connect the signals.
                </span>{' '}
                Detect the risk.
              </h1>

              <p className="mt-4 text-xs sm:text-sm text-stone-600 leading-relaxed">
                TrustLedger helps digital lenders investigate document fraud, suspicious KYC signals,
                connected fraud networks, and evidence integrity from one intelligent platform.
              </p>
            </div>

            {/* Animated Network Graphic & Trust Indicators */}
            <div className="mt-8 lg:mt-10">
              <NetworkTrustGraphic />
            </div>
          </div>

          {/* Left Panel Footnote */}
          <div className="hidden lg:flex items-center gap-2 pt-6 mt-6 border-t border-coffee-100 text-[11px] font-mono text-stone-500">
            <ShieldCheck className="h-3.5 w-3.5 text-emerald-600" />
            <span>Cryptographically anchored defense matrix for digital originations.</span>
          </div>
        </div>

        {/* =========================================================================
            RIGHT PANEL: LOGIN CARD & DEMO ACCESS
            ========================================================================= */}
        <div className="order-1 lg:order-2 lg:w-[42%] p-6 sm:p-10 lg:p-12 flex flex-col justify-center items-center">
          
          {/* Mobile-Only Top Brand Display */}
          <div className="lg:hidden w-full max-w-md mb-6 flex flex-col items-center text-center">
            <TrustLedgerLogo size="default" />
            <span className="text-[11px] font-mono text-coffee-700 mt-1 font-medium">
              AI + Cybersecurity Fraud Shield for Digital Lending
            </span>
          </div>

          {/* Premium Login Card */}
          <div className="w-full max-w-md rounded-2xl border border-coffee-200 bg-white p-6 sm:p-8 shadow-card relative">
            
            {/* Top accent highlight */}
            <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-coffee-500 to-transparent rounded-t-2xl" />

            {/* Registered Institution Success Notification */}
            {isJustRegistered && (
              <div className="mb-5 p-3 rounded-xl border border-emerald-200 bg-emerald-50 text-xs text-emerald-800 flex items-start gap-2.5 animate-fadeIn">
                <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0 mt-0.5" />
                <div>
                  <span className="font-semibold text-emerald-900 block">
                    Institutional Verification Approved
                  </span>
                  <span className="text-[11px] text-emerald-800">
                    {location.state?.companyName || registeredCompany?.companyName || 'Your organization'} is verified. Sign in to view your loan applications triage desk.
                  </span>
                </div>
              </div>
            )}

            {/* Card Header */}
            <div className="mb-6">
              <span className="text-xs font-mono uppercase tracking-wider text-coffee-800 font-extrabold">
                Underwriter & Fraud Desk
              </span>
              <h2 className="text-xl font-extrabold tracking-tight text-coffee-950 mt-1">
                Sign in to TrustLedger
              </h2>
              <p className="text-xs text-coffee-800 mt-1 font-semibold">
                Enter your credentials to access the investigation workspace
              </p>
            </div>

            {/* Error Notification Banner */}
            {(localError || authError) && (
              <div
                role="alert"
                className="mb-5 flex items-start gap-2.5 rounded-xl border border-red-300 bg-red-50 p-3 text-xs text-red-950 font-medium animate-fadeIn"
              >
                <AlertCircle className="h-4 w-4 text-red-700 shrink-0 mt-0.5" />
                <div className="flex-1">
                  <div className="font-bold text-red-950">Unable to sign in</div>
                  <div className="mt-0.5 text-red-900 font-semibold">{localError || authError}</div>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setLocalError('');
                    clearError();
                  }}
                  className="text-red-700 hover:text-red-950 font-bold"
                  aria-label="Dismiss error message"
                >
                  <X className="h-3.5 w-3.5" />
                </button>
              </div>
            )}

            {/* Standard Authentication Form */}
            <form onSubmit={handleSignIn} className="space-y-4" noValidate>
              {/* Work Email Field */}
              <div>
                <label
                  htmlFor="work-email"
                  className="block text-xs font-mono uppercase tracking-wider text-coffee-950 mb-1.5 font-extrabold"
                >
                  Work Email
                </label>
                <input
                  id="work-email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="analyst@lender.com"
                  className="w-full rounded-xl border-2 border-coffee-200 bg-white px-3.5 py-2.5 text-xs text-coffee-950 placeholder-coffee-600 font-mono font-bold transition-colors focus:border-coffee-600 focus:ring-1 focus:ring-coffee-500 focus:outline-none shadow-xs"
                />
              </div>

              {/* Password Field with Show/Hide Toggle */}
              <div>
                <label
                  htmlFor="password"
                  className="block text-xs font-mono uppercase tracking-wider text-coffee-950 mb-1.5 font-extrabold"
                >
                  Password
                </label>
                <div className="relative">
                  <input
                    id="password"
                    name="password"
                    type={showPassword ? 'text' : 'password'}
                    autoComplete="current-password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter security passphrase"
                    className="w-full rounded-xl border-2 border-coffee-200 bg-white pl-3.5 pr-10 py-2.5 text-xs text-coffee-950 placeholder-coffee-600 font-mono font-bold transition-colors focus:border-coffee-600 focus:ring-1 focus:ring-coffee-500 focus:outline-none shadow-xs"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 p-1 text-coffee-600 hover:text-coffee-950 transition-colors focus:outline-none"
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </button>
                </div>
              </div>

              {/* Remember Me & Forgot Password */}
              <div className="flex items-center justify-between pt-1">
                <label className="flex items-center gap-2 cursor-pointer text-xs text-coffee-900 font-semibold select-none">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="h-3.5 w-3.5 rounded border-coffee-300 text-coffee-600 focus:ring-coffee-500"
                  />
                  <span>Remember me</span>
                </label>

                <button
                  type="button"
                  onClick={() => setForgotPasswordOpen(true)}
                  className="text-xs font-mono text-coffee-800 hover:text-coffee-950 hover:underline font-bold focus:outline-none"
                >
                  Forgot password?
                </button>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full mt-3 flex items-center justify-center gap-2 rounded-xl bg-coffee-600 hover:bg-coffee-700 px-4 py-3 text-xs font-extrabold uppercase tracking-wider text-white shadow-md transition-all focus:outline-none focus:ring-2 focus:ring-coffee-500 disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    <span>Signing in...</span>
                  </>
                ) : (
                  <>
                    <span>Sign in to Lender Portal</span>
                    <ArrowRight className="h-4 w-4" />
                  </>
                )}
              </button>
            </form>

            {/* Institution Registration Link */}
            <div className="mt-3 text-center space-y-2">
              <Link
                to="/lender/register"
                className="inline-flex items-center gap-1.5 text-xs font-mono text-coffee-800 hover:text-coffee-950 hover:underline py-1 font-bold"
              >
                <Building2 className="h-3.5 w-3.5" />
                <span>Register new Lending Institution / Organization →</span>
              </Link>
              <div className="pt-2 border-t border-coffee-100">
                <Link
                  to="/login"
                  className="text-xs text-coffee-800 hover:text-coffee-950 inline-flex items-center gap-1 font-semibold"
                >
                  <span>Borrower / Loan Applicant?</span>
                  <span className="text-coffee-700 font-extrabold hover:underline">Sign in to Borrower App →</span>
                </Link>
              </div>
            </div>

            {/* Forgot Password Notice */}
            {forgotPasswordOpen && (
              <div className="mt-4 p-3 rounded-xl border border-coffee-300 bg-coffee-50 text-xs text-coffee-950 flex items-start justify-between gap-2 animate-fadeIn">
                <div>
                  <span className="font-bold block text-coffee-950">Password Recovery Notice</span>
                  <span className="text-[11px] text-coffee-900 mt-0.5 block font-medium">
                    Password recovery will be connected to Supabase Auth.
                  </span>
                </div>
                <button
                  onClick={() => setForgotPasswordOpen(false)}
                  className="text-coffee-700 hover:text-coffee-950 font-bold"
                  aria-label="Close recovery notice"
                >
                  <X className="h-3.5 w-3.5" />
                </button>
              </div>
            )}

            {/* Divider */}
            <div className="relative my-5">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-coffee-200" />
              </div>
              <div className="relative flex justify-center text-[10px] uppercase font-mono">
                <span className="bg-white px-2 text-coffee-800 font-extrabold">
                  Instant Hackathon Access
                </span>
              </div>
            </div>

            {/* Try Demo Action Card */}
            <div className="rounded-xl border-2 border-coffee-200 bg-coffee-50/70 p-4 transition-all hover:border-coffee-400">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <KeyRound className="h-4 w-4 text-coffee-700" />
                  <span className="text-xs font-extrabold text-coffee-950">Evaluation Sandbox</span>
                </div>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-coffee-200 text-coffee-950 border border-coffee-300 font-bold">
                  DEMO MODE
                </span>
              </div>
              
              <p className="text-xs text-coffee-900 font-medium leading-relaxed mb-3">
                Explore the TrustLedger fraud investigation dashboard using synthetic demo data.
              </p>

              <button
                type="button"
                onClick={handleTryDemo}
                disabled={loading}
                className="w-full flex items-center justify-center gap-2 rounded-xl border border-coffee-300 bg-white hover:bg-coffee-100 px-3.5 py-2 text-xs font-mono font-bold text-coffee-950 transition-all focus:outline-none shadow-xs"
              >
                <Sparkles className="h-3.5 w-3.5 text-coffee-700" />
                <span>Try Demo</span>
              </button>
            </div>

            {/* Security Message */}
            <div className="mt-6 pt-4 border-t border-coffee-100 flex items-start gap-2 text-coffee-800">
              <ShieldCheck className="h-4 w-4 text-emerald-700 shrink-0 mt-0.5" />
              <div>
                <div className="text-xs font-extrabold text-coffee-950">Protected workspace</div>
                <p className="text-[11px] text-coffee-900 font-medium leading-snug mt-0.5">
                  TrustLedger uses secure authentication and controlled access to protect investigation data.
                </p>
              </div>
            </div>

          </div>
        </div>
      </div>

      <footer className="w-full border-t border-coffee-200 py-4 px-6 text-center text-[11px] font-mono text-stone-500">
        TrustLedger © 2026 • AI-assisted fraud intelligence for digital lending
      </footer>
    </div>
  );
}
