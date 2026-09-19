/**
 * TrustLedger User Registration Page (/register)
 * Header: "Create your TrustLedger account"
 * Enforces mandatory single-person account rule:
 * ONE PERSON = ONE USER ACCOUNT
 * Redirects immediately upon creation to /profile-setup.
 * Styled in White & Coffee Brown fintech design system.
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
      await register({
        fullName: formData.fullName.trim(),
        email: formData.email.trim(),
        mobile: cleanMobile,
        password: formData.password
      });

      // Redirect immediately to Profile Setup Wizard as required by user flow
      navigate('/profile-setup', { replace: true });
    } catch (err) {
      setLocalError(err.message || 'Registration failed. Please try again.');
    }
  };

  const handleGoogleRegister = async () => {
    setLocalError('');
    clearError();
    try {
      await loginWithGoogle();
    } catch (err) {
      setLocalError(err.message || 'Google sign-up failed.');
    }
  };

  return (
    <div className="min-h-screen w-full bg-[#FAF8F5] text-coffee-950 flex flex-col justify-between overflow-x-hidden selection:bg-coffee-600 selection:text-white">
      
      {/* Main Content Area */}
      <div className="flex-1 flex flex-col lg:flex-row w-full max-w-7xl mx-auto items-stretch p-4 sm:p-6 lg:p-10">
        
        {/* Left Panel: Principles & Setup Walkthrough */}
        <div className="lg:w-[48%] p-6 sm:p-10 flex flex-col justify-between border-b lg:border-b-0 lg:border-r border-coffee-200">
          <div>
            <div className="mb-8">
              <TrustLedgerLogo size="lg" />
              <div className="text-xs font-bold text-coffee-800 mt-2 tracking-wide">
                Secure digital lending, verified from the start.
              </div>
            </div>

            <div className="max-w-xl">
              <span className="text-xs font-mono uppercase tracking-wider text-coffee-800 font-extrabold">
                Step 1 of Borrower Onboarding
              </span>
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight text-coffee-950 mt-1 leading-tight">
                Create your TrustLedger account
              </h1>
              <p className="mt-4 text-sm text-coffee-900 leading-relaxed font-semibold">
                Join India&apos;s most secure fraud-protected digital lending platform. Complete a one-time profile setup and unlock seamless loan applications.
              </p>
            </div>

            {/* Mandatory Account Rule Notice */}
            <div className="mt-6">
              <SingleAccountNotice variant="banner" />
            </div>

            {/* What to expect */}
            <div className="mt-8 space-y-3 font-sans text-xs text-coffee-950">
              <span className="text-xs font-mono uppercase tracking-wider text-coffee-800 font-extrabold block mb-2">
                What happens next:
              </span>
              <div className="flex items-center gap-3 p-3.5 rounded-2xl border border-coffee-300 bg-white shadow-sm font-bold">
                <span className="h-6 w-6 rounded-full bg-coffee-100 border border-coffee-300 text-coffee-950 flex items-center justify-center font-mono text-[11px] font-extrabold shrink-0">
                  1
                </span>
                <span>Enter your personal and address details</span>
              </div>
              <div className="flex items-center gap-3 p-3.5 rounded-2xl border border-coffee-300 bg-white shadow-sm font-bold">
                <span className="h-6 w-6 rounded-full bg-coffee-100 border border-coffee-300 text-coffee-950 flex items-center justify-center font-mono text-[11px] font-extrabold shrink-0">
                  2
                </span>
                <span>Upload your Aadhaar or KYC document for optical inspection</span>
              </div>
              <div className="flex items-center gap-3 p-3.5 rounded-2xl border border-coffee-300 bg-white shadow-sm font-bold">
                <span className="h-6 w-6 rounded-full bg-coffee-100 border border-coffee-300 text-coffee-950 flex items-center justify-center font-mono text-[11px] font-extrabold shrink-0">
                  3
                </span>
                <span>Capture a live profile photograph using your camera</span>
              </div>
            </div>
          </div>

          <div className="pt-6 mt-6 border-t border-coffee-200 text-xs text-coffee-800 font-bold flex items-center gap-2">
            <ShieldCheck className="h-4 w-4 text-emerald-700" />
            <span>Zero secret exposure • Automatic Aadhaar masking</span>
          </div>
        </div>

        {/* Right Panel: Registration Form */}
        <div className="lg:w-[52%] p-4 sm:p-8 lg:p-10 flex flex-col justify-center items-center">
          <div className="w-full max-w-lg rounded-2xl border-2 border-coffee-200 bg-white p-6 sm:p-8 shadow-xl relative">
            
            <div className="mb-6">
              <span className="text-xs font-mono uppercase tracking-wider text-coffee-800 font-extrabold">
                New Applicant Registration
              </span>
              <h2 className="text-xl font-extrabold tracking-tight text-coffee-950 mt-1">
                Create Your Applicant Account
              </h2>
              <p className="text-xs text-coffee-800 mt-1 font-semibold">
                Register as an individual borrower to apply for digital loans with verified identity
              </p>
            </div>

            {/* Google Alternative Registration */}
            <button
              type="button"
              onClick={handleGoogleRegister}
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
                  Or register with legal details
                </span>
              </div>
            </div>

            {/* Error Message */}
            {(localError || authError) && (
              <div
                role="alert"
                className="mb-5 flex items-start gap-2.5 rounded-xl border border-rose-300 bg-rose-50 p-3.5 text-xs text-rose-950 font-medium animate-fadeIn"
              >
                <AlertCircle className="h-4 w-4 text-rose-700 shrink-0 mt-0.5" />
                <div className="flex-1">
                  <div className="font-extrabold text-rose-950">Registration failed</div>
                  <div className="mt-0.5 text-rose-900 font-semibold">{localError || authError}</div>
                </div>
              </div>
            )}

            <form onSubmit={handleRegister} className="space-y-3.5" noValidate>
              <div>
                <label className="block text-xs font-extrabold text-coffee-950 mb-1">
                  Full Legal Name (as on Aadhaar / PAN) <span className="text-rose-600">*</span>
                </label>
                <input
                  type="text"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleChange}
                  placeholder="e.g. Arjun Kumar"
                  className="w-full rounded-xl border-2 border-coffee-200 bg-white px-3.5 py-2.5 text-xs text-coffee-950 placeholder-coffee-600 font-bold focus:border-coffee-600 focus:outline-none focus:ring-1 focus:ring-coffee-500 shadow-xs"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-extrabold text-coffee-950 mb-1">
                    Email Address <span className="text-rose-600">*</span>
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="name@example.com"
                    className="w-full rounded-xl border-2 border-coffee-200 bg-white px-3.5 py-2.5 text-xs text-coffee-950 placeholder-coffee-600 font-bold focus:border-coffee-600 focus:outline-none focus:ring-1 focus:ring-coffee-500 shadow-xs"
                  />
                </div>

                <div>
                  <label className="block text-xs font-extrabold text-coffee-950 mb-1">
                    Mobile Number <span className="text-rose-600">*</span>
                  </label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs font-mono font-bold text-coffee-800">
                      +91
                    </span>
                    <input
                      type="tel"
                      name="mobile"
                      maxLength={10}
                      value={formData.mobile}
                      onChange={handleChange}
                      placeholder="98765 43210"
                      className="w-full rounded-xl border-2 border-coffee-200 bg-white pl-12 pr-3.5 py-2.5 text-xs text-coffee-950 placeholder-coffee-600 font-mono font-bold focus:border-coffee-600 focus:outline-none focus:ring-1 focus:ring-coffee-500 shadow-xs"
                    />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-extrabold text-coffee-950 mb-1">
                    Password <span className="text-rose-600">*</span>
                  </label>
                  <div className="relative">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      name="password"
                      value={formData.password}
                      onChange={handleChange}
                      placeholder="Minimum 6 characters"
                      className="w-full rounded-xl border-2 border-coffee-200 bg-white pl-3.5 pr-9 py-2.5 text-xs text-coffee-950 placeholder-coffee-600 font-bold focus:border-coffee-600 focus:outline-none focus:ring-1 focus:ring-coffee-500 shadow-xs"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-2.5 top-1/2 -translate-y-1/2 text-coffee-700 hover:text-coffee-950"
                    >
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-extrabold text-coffee-950 mb-1">
                    Confirm Password <span className="text-rose-600">*</span>
                  </label>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    placeholder="Re-enter password"
                    className="w-full rounded-xl border-2 border-coffee-200 bg-white px-3.5 py-2.5 text-xs text-coffee-950 placeholder-coffee-600 font-bold focus:border-coffee-600 focus:outline-none focus:ring-1 focus:ring-coffee-500 shadow-xs"
                  />
                </div>
              </div>

              {/* Single Person Rule Checkbox Acceptance */}
              <div className="pt-2">
                <div className="p-3.5 rounded-xl border-2 border-coffee-300 bg-coffee-50 text-xs text-coffee-950 flex items-start gap-2.5">
                  <input
                    type="checkbox"
                    id="ruleAccepted"
                    defaultChecked
                    required
                    className="mt-0.5 rounded border-coffee-300 text-coffee-600 focus:ring-coffee-500"
                  />
                  <label htmlFor="ruleAccepted" className="leading-relaxed cursor-pointer font-bold">
                    I confirm this account is created strictly for myself. I will upload my own authentic identity documents and live camera photo.
                  </label>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full mt-2 flex items-center justify-center gap-2 rounded-xl bg-coffee-600 hover:bg-coffee-700 px-4 py-3 text-xs font-extrabold uppercase tracking-wider text-white shadow-md transition-all disabled:opacity-60 cursor-pointer"
              >
                {loading ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    <span>Creating your account...</span>
                  </>
                ) : (
                  <>
                    <span>Agree & Create Account</span>
                    <ArrowRight className="h-4 w-4" />
                  </>
                )}
              </button>
            </form>

            <div className="mt-5 text-center border-t border-coffee-100 pt-4">
              <span className="text-xs text-coffee-900 font-semibold">
                Already registered?{' '}
                <Link to="/login" className="text-coffee-700 hover:text-coffee-950 font-extrabold underline">
                  Sign in here →
                </Link>
              </span>
            </div>
          </div>
        </div>

      </div>

      <footer className="w-full border-t border-coffee-200 py-4 px-6 text-center text-xs font-bold text-coffee-800 bg-white">
        TrustLedger © 2026 • One Person = One Verified User Account
      </footer>
    </div>
  );
}
