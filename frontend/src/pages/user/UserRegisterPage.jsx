/**
 * TrustLedger User Registration Page (/register)
 * Header: "Create your TrustLedger account"
 * Enforces mandatory single-person account rule:
 * ONE PERSON = ONE USER ACCOUNT
 * Redirects immediately upon creation to /profile-setup.
 */

import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  ShieldCheck,
  Lock,
  ArrowRight,
  AlertCircle,
  CheckCircle2,
  Loader2,
  UserCheck,
  Eye,
  EyeOff
} from 'lucide-react';
import TrustLedgerLogo from '../../components/branding/TrustLedgerLogo';
import SingleAccountNotice from '../../components/user/SingleAccountNotice';
import { useUserAuth } from '../../context/UserAuthContext';

export default function UserRegisterPage() {
  const navigate = useNavigate();
  const { register, loginWithGoogle, loading, authError, clearError, isDemo } = useUserAuth();

  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    mobile: '',
    password: '',
    confirmPassword: ''
  });

  const [showPassword, setShowPassword] = useState(false);
  const [localError, setLocalError] = useState('');

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setLocalError('');
    clearError();

    // Validations
    if (!formData.fullName || formData.fullName.trim().length < 2) {
      setLocalError('Please enter your full legal name.');
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.email || !emailRegex.test(formData.email.trim())) {
      setLocalError('Please enter a valid email address.');
      return;
    }

    const cleanMobile = formData.mobile.replace(/\D/g, '');
    if (!cleanMobile || cleanMobile.length !== 10) {
      setLocalError('Please enter a valid 10-digit mobile number.');
      return;
    }

    if (!formData.password || formData.password.length < 6) {
      setLocalError('Password must be at least 6 characters long.');
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setLocalError('Passwords do not match. Please re-enter.');
      return;
    }

    try {
      await register(formData);
      // Navigate directly to profile setup for new user
      navigate('/profile-setup', { replace: true });
    } catch (err) {
      setLocalError(err.message || 'Your account could not be created. Please try again.');
    }
  };

  const handleGoogleRegister = async () => {
    setLocalError('');
    clearError();
    try {
      await loginWithGoogle();
      navigate('/profile-setup', { replace: true });
    } catch {
      setLocalError('Google sign-in could not be completed. Please try again.');
    }
  };

  return (
    <div className="min-h-screen w-full bg-midnight-950 text-slate-100 flex flex-col justify-between overflow-x-hidden relative selection:bg-cyan-500 selection:text-midnight-950">
      
      {/* Glows */}
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-1/4 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />

      {/* Main Container */}
      <div className="flex-1 flex flex-col lg:flex-row w-full max-w-7xl mx-auto items-stretch p-4 sm:p-6 lg:p-10">
        
        {/* Left Panel: Information & Rules */}
        <div className="lg:w-[48%] p-6 sm:p-10 flex flex-col justify-between border-b lg:border-b-0 lg:border-r border-surface-border/80">
          <div>
            <div className="mb-6">
              <TrustLedgerLogo size="lg" />
              <div className="text-xs font-mono text-cyan-400/90 mt-2 tracking-wide">
                Secure digital lending, verified from the start.
              </div>
            </div>

            <div className="max-w-md">
              <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white leading-tight">
                Create your{' '}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500">
                  TrustLedger account
                </span>
              </h1>

              <p className="mt-3 text-xs sm:text-sm text-slate-300 leading-relaxed">
                Your account is for your personal loan applications and verification.
              </p>
            </div>

            {/* Mandatory Account Rule Notice */}
            <div className="mt-6">
              <SingleAccountNotice variant="banner" />
            </div>

            {/* What to expect */}
            <div className="mt-8 space-y-3 font-sans text-xs text-slate-300">
              <span className="text-[11px] font-mono uppercase tracking-wider text-cyan-400 font-semibold block mb-2">
                What happens next:
              </span>
              <div className="flex items-center gap-3 p-3 rounded-xl border border-surface-border bg-midnight-900/60">
                <span className="h-6 w-6 rounded-full bg-cyan-950 border border-cyan-500/40 text-cyan-300 flex items-center justify-center font-mono text-[11px] font-bold shrink-0">
                  1
                </span>
                <span>Enter your personal and address details</span>
              </div>
              <div className="flex items-center gap-3 p-3 rounded-xl border border-surface-border bg-midnight-900/60">
                <span className="h-6 w-6 rounded-full bg-cyan-950 border border-cyan-500/40 text-cyan-300 flex items-center justify-center font-mono text-[11px] font-bold shrink-0">
                  2
                </span>
                <span>Upload your Aadhaar document for document-based verification</span>
              </div>
              <div className="flex items-center gap-3 p-3 rounded-xl border border-surface-border bg-midnight-900/60">
                <span className="h-6 w-6 rounded-full bg-cyan-950 border border-cyan-500/40 text-cyan-300 flex items-center justify-center font-mono text-[11px] font-bold shrink-0">
                  3
                </span>
                <span>Capture a live profile photograph using your camera</span>
              </div>
            </div>
          </div>

          <div className="pt-6 mt-6 border-t border-surface-border/50 text-[11px] font-mono text-slate-400 flex items-center gap-2">
            <ShieldCheck className="h-3.5 w-3.5 text-emerald-400" />
            <span>Zero secret exposure • Automatic Aadhaar masking</span>
          </div>
        </div>

        {/* Right Panel: Registration Form */}
        <div className="lg:w-[52%] p-4 sm:p-8 lg:p-10 flex flex-col justify-center items-center">
          <div className="w-full max-w-lg rounded-2xl border border-surface-border bg-surface-card/95 p-6 sm:p-8 shadow-2xl backdrop-blur-xl relative">
            
            <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-cyan-400 to-transparent rounded-t-2xl" />

            <div className="mb-6">
              <span className="text-xs font-mono uppercase tracking-wider text-cyan-400 font-semibold">
                New Applicant Registration
              </span>
              <h2 className="text-xl font-bold tracking-tight text-white mt-1">
                Create Your Applicant Account
              </h2>
              <p className="text-xs text-slate-400 mt-1">
                Register as an individual borrower to apply for digital loans with verified identity
              </p>
            </div>

            {/* Google Alternative Registration */}
            <button
              type="button"
              onClick={handleGoogleRegister}
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
                  Or register with personal details
                </span>
              </div>
            </div>

            {/* Error Message */}
            {(localError || authError) && (
              <div className="mb-4 p-3 rounded-lg border border-red-500/40 bg-red-950/40 text-xs text-red-200 flex items-start gap-2">
                <AlertCircle className="h-4 w-4 text-red-400 shrink-0 mt-0.5" />
                <div className="flex-1">{localError || authError}</div>
              </div>
            )}

            <form onSubmit={handleRegister} className="space-y-3.5" noValidate>
              {/* Full Name */}
              <div>
                <label className="block text-xs font-mono uppercase tracking-wider text-slate-300 mb-1">
                  Full Name (as per official documents)
                </label>
                <input
                  type="text"
                  name="fullName"
                  required
                  value={formData.fullName}
                  onChange={handleChange}
                  placeholder="e.g. Ramesh Kumar Sharma"
                  className="w-full rounded-lg border border-surface-border bg-midnight-950 px-3.5 py-2 text-xs text-white placeholder-slate-500 focus:border-cyan-400 focus:outline-none"
                />
              </div>

              {/* Email & Mobile */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-mono uppercase tracking-wider text-slate-300 mb-1">
                    Email Address
                  </label>
                  <input
                    type="email"
                    name="email"
                    required
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="ramesh@example.com"
                    className="w-full rounded-lg border border-surface-border bg-midnight-950 px-3.5 py-2 text-xs text-white placeholder-slate-500 focus:border-cyan-400 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-mono uppercase tracking-wider text-slate-300 mb-1">
                    Mobile Number
                  </label>
                  <input
                    type="tel"
                    name="mobile"
                    required
                    maxLength={10}
                    value={formData.mobile}
                    onChange={handleChange}
                    placeholder="10-digit mobile number"
                    className="w-full rounded-lg border border-surface-border bg-midnight-950 px-3.5 py-2 text-xs text-white placeholder-slate-500 focus:border-cyan-400 focus:outline-none"
                  />
                </div>
              </div>

              {/* Password & Confirm Password */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-mono uppercase tracking-wider text-slate-300 mb-1">
                    Password
                  </label>
                  <div className="relative">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      name="password"
                      required
                      value={formData.password}
                      onChange={handleChange}
                      placeholder="Min 6 characters"
                      className="w-full rounded-lg border border-surface-border bg-midnight-950 pl-3.5 pr-8 py-2 text-xs text-white placeholder-slate-500 focus:border-cyan-400 focus:outline-none"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 hover:text-cyan-300"
                    >
                      {showPassword ? <EyeOff className="h-3.5 w-3.5" /> : <Eye className="h-3.5 w-3.5" />}
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-mono uppercase tracking-wider text-slate-300 mb-1">
                    Confirm Password
                  </label>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    name="confirmPassword"
                    required
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    placeholder="Repeat password"
                    className="w-full rounded-lg border border-surface-border bg-midnight-950 px-3.5 py-2 text-xs text-white placeholder-slate-500 focus:border-cyan-400 focus:outline-none"
                  />
                </div>
              </div>

              {/* Pre-completion Ownership Banner */}
              <div className="pt-1">
                <SingleAccountNotice variant="inline" />
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full mt-2 flex items-center justify-center gap-2 rounded-lg bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 px-4 py-2.5 text-xs font-semibold uppercase tracking-wider text-midnight-950 shadow-[0_0_20px_rgba(0,240,255,0.25)] transition-all disabled:opacity-60"
              >
                {loading ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    <span>Creating personal account...</span>
                  </>
                ) : (
                  <>
                    <span>Create Account & Start Profile Setup</span>
                    <ArrowRight className="h-4 w-4" />
                  </>
                )}
              </button>
            </form>

            <div className="mt-4 text-center border-t border-surface-border/70 pt-3">
              <span className="text-xs text-slate-400">
                Already registered?{' '}
                <Link to="/login" className="text-cyan-400 hover:underline font-semibold">
                  Sign in directly
                </Link>
              </span>
            </div>

            {/* Browse loans link */}
            <div className="mt-2 text-center">
              <Link
                to="/loans"
                className="inline-flex items-center gap-1.5 text-xs font-medium text-slate-400 hover:text-cyan-300"
              >
                <span>Explore loan catalog first →</span>
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
