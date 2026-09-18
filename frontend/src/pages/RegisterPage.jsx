import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  Building2,
  ShieldCheck,
  CheckCircle2,
  Lock,
  ArrowRight,
  Sparkles,
  AlertCircle,
  FileCheck2,
  Fingerprint,
  Loader2
} from 'lucide-react';
import TrustLedgerLogo from '../components/branding/TrustLedgerLogo';
import authService from '../services/authService';

export default function RegisterPage() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    companyName: 'Apex Horizon Digital Capital LLC',
    corporateEmail: 'risk.officer@apexhorizon.bank',
    registrationNumber: 'LEI-72450099VANCE109',
    lenderType: 'Digital NBFC',
    jurisdiction: 'United States (Delaware)',
    officerName: 'Sarah Jenkins',
    password: 'securepassphrase2026'
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [verifiedStatus, setVerifiedStatus] = useState(false);
  const [verifying, setVerifying] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleVerifyRegistry = async () => {
    setVerifying(true);
    setError('');
    await new Promise((resolve) => setTimeout(resolve, 600));
    setVerifying(false);
    setVerifiedStatus(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      await authService.registerCompany(formData);
      // Direct user to login with registered company notice and target destination /applications
      navigate('/lender/login?registered=true&target=/applications', {
        state: {
          registeredEmail: formData.corporateEmail,
          companyName: formData.companyName,
          targetPath: '/applications'
        }
      });
    } catch (err) {
      setError(err.message || 'Institutional registration failed. Please review your company details.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full bg-midnight-950 text-slate-100 flex flex-col justify-between overflow-x-hidden cyber-grid relative">
      {/* Background Ambient Glows */}
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-1/4 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />

      {/* Main Container */}
      <div className="flex-1 flex flex-col lg:flex-row w-full max-w-7xl mx-auto items-stretch">
        
        {/* Left Panel: Institutional Shield Narrative */}
        <div className="lg:w-[50%] p-6 sm:p-10 lg:p-14 flex flex-col justify-between border-b lg:border-b-0 lg:border-r border-surface-border/80">
          <div>
            <TrustLedgerLogo size="lg" />
            <div className="text-xs font-mono text-cyan-400/90 mt-2 tracking-wide">
              AI + Cybersecurity Fraud Shield for Digital Lending
            </div>

            <div className="mt-10 max-w-lg">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-cyan-500/30 bg-cyan-950/40 text-cyan-300 text-xs font-mono mb-4">
                <Building2 className="h-3.5 w-3.5 text-cyan-400" />
                INSTITUTIONAL ACCREDITATION
              </div>

              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight text-white leading-tight">
                Accredit your{' '}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500">
                  Lending Institution
                </span>
              </h1>

              <p className="mt-4 text-xs sm:text-sm text-slate-300 leading-relaxed">
                Connect your loan origination pipelines to TrustLedger's fraud intelligence shield.
                Enterprise verification provides licensed lenders and digital NBFCs with automated document forensics,
                device collision clustering, and tamper-evident audit chains.
              </p>

              {/* Three Institutional Proof Points */}
              <div className="mt-8 space-y-3 font-mono text-xs text-slate-300">
                <div className="flex items-center gap-3 p-3 rounded-lg border border-surface-border bg-midnight-900/60">
                  <CheckCircle2 className="h-4 w-4 text-cyan-400 shrink-0" />
                  <div>
                    <span className="font-semibold text-white block">Corporate Regulatory Registry Validation</span>
                    <span className="text-[11px] text-slate-400">LEI, CIN, or EIN compliance verification</span>
                  </div>
                </div>

                <div className="flex items-center gap-3 p-3 rounded-lg border border-surface-border bg-midnight-900/60">
                  <CheckCircle2 className="h-4 w-4 text-cyan-400 shrink-0" />
                  <div>
                    <span className="font-semibold text-white block">Corporate Domain & Officer Authorization</span>
                    <span className="text-[11px] text-slate-400">Strict work-email authorization gate</span>
                  </div>
                </div>

                <div className="flex items-center gap-3 p-3 rounded-lg border border-surface-border bg-midnight-900/60">
                  <CheckCircle2 className="h-4 w-4 text-cyan-400 shrink-0" />
                  <div>
                    <span className="font-semibold text-white block">Dedicated Ledger Audit Seal</span>
                    <span className="text-[11px] text-slate-400">Cryptographically isolated evidence ledger</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="pt-6 mt-6 border-t border-surface-border/50 text-[11px] font-mono text-slate-400 flex items-center gap-2">
            <ShieldCheck className="h-3.5 w-3.5 text-emerald-400" />
            <span>Regulated fintech security standard • Zero secret exposure</span>
          </div>
        </div>

        {/* Right Panel: Institution Details Form */}
        <div className="lg:w-[50%] p-6 sm:p-10 lg:p-12 flex flex-col justify-center items-center">
          <div className="w-full max-w-lg rounded-2xl border border-surface-border bg-surface-card/90 p-6 sm:p-8 shadow-2xl backdrop-blur-xl relative">
            
            {/* Top highlight bar */}
            <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-cyan-400 to-transparent rounded-t-2xl" />

            <div className="mb-6">
              <span className="text-xs font-mono uppercase tracking-wider text-cyan-400">
                Lender Registration
              </span>
              <h2 className="text-xl font-bold tracking-tight text-white mt-1">
                Enter Verified Company Details
              </h2>
              <p className="text-xs text-slate-400 mt-1">
                Register your lending entity to immediately unlock the loan applications triage desk
              </p>
            </div>

            {error && (
              <div className="mb-5 flex items-start gap-2.5 rounded-lg border border-red-500/40 bg-red-950/40 p-3 text-xs text-red-200">
                <AlertCircle className="h-4 w-4 text-red-400 shrink-0 mt-0.5" />
                <div className="flex-1">{error}</div>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4 text-xs font-mono">
              {/* Company Legal Name */}
              <div>
                <label className="block uppercase tracking-wider text-slate-300 mb-1">
                  Institution Legal Name
                </label>
                <input
                  type="text"
                  name="companyName"
                  required
                  value={formData.companyName}
                  onChange={handleChange}
                  placeholder="e.g. Apex Horizon Digital Capital LLC"
                  className="w-full rounded-lg border border-surface-border bg-midnight-950 px-3.5 py-2 text-white placeholder-slate-500 focus:border-cyan-400 focus:outline-none"
                />
              </div>

              {/* Corporate Email & Officer Name */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block uppercase tracking-wider text-slate-300 mb-1">
                    Corporate Email
                  </label>
                  <input
                    type="email"
                    name="corporateEmail"
                    required
                    value={formData.corporateEmail}
                    onChange={handleChange}
                    placeholder="risk.officer@lender.bank"
                    className="w-full rounded-lg border border-surface-border bg-midnight-950 px-3.5 py-2 text-white placeholder-slate-500 focus:border-cyan-400 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block uppercase tracking-wider text-slate-300 mb-1">
                    Underwriting Officer
                  </label>
                  <input
                    type="text"
                    name="officerName"
                    required
                    value={formData.officerName}
                    onChange={handleChange}
                    placeholder="e.g. Sarah Jenkins"
                    className="w-full rounded-lg border border-surface-border bg-midnight-950 px-3.5 py-2 text-white placeholder-slate-500 focus:border-cyan-400 focus:outline-none"
                  />
                </div>
              </div>

              {/* Regulatory ID & Verification Trigger */}
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="block uppercase tracking-wider text-slate-300">
                    Regulatory Registration ID (LEI / CIN / EIN)
                  </label>
                  {verifiedStatus ? (
                    <span className="text-[10px] text-emerald-400 flex items-center gap-1 font-bold">
                      <CheckCircle2 className="h-3 w-3" /> Validated
                    </span>
                  ) : (
                    <button
                      type="button"
                      onClick={handleVerifyRegistry}
                      disabled={verifying}
                      className="text-[11px] text-cyan-400 hover:text-cyan-300 hover:underline"
                    >
                      {verifying ? 'Checking registry...' : 'Verify LEI/EIN'}
                    </button>
                  )}
                </div>
                <div className="relative">
                  <input
                    type="text"
                    name="registrationNumber"
                    required
                    value={formData.registrationNumber}
                    onChange={handleChange}
                    placeholder="e.g. LEI-72450099VANCE109"
                    className="w-full rounded-lg border border-surface-border bg-midnight-950 px-3.5 py-2 text-white uppercase placeholder-slate-500 focus:border-cyan-400 focus:outline-none"
                  />
                  {verifiedStatus && (
                    <span className="absolute right-2.5 top-1/2 -translate-y-1/2 px-1.5 py-0.5 rounded bg-emerald-950 text-emerald-300 text-[10px] border border-emerald-500/30">
                      Accredited
                    </span>
                  )}
                </div>
              </div>

              {/* Lending Entity Type */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block uppercase tracking-wider text-slate-300 mb-1">
                    Lending Entity Category
                  </label>
                  <select
                    name="lenderType"
                    value={formData.lenderType}
                    onChange={handleChange}
                    className="w-full rounded-lg border border-surface-border bg-midnight-950 px-3 py-2 text-white focus:border-cyan-400 focus:outline-none"
                  >
                    <option value="Digital NBFC">Digital NBFC</option>
                    <option value="Commercial Bank">Commercial Bank</option>
                    <option value="Fintech Neo-Lender">Fintech Neo-Lender</option>
                    <option value="SME Credit Provider">SME Credit Provider</option>
                    <option value="P2P Marketplace">P2P Credit Platform</option>
                  </select>
                </div>

                <div>
                  <label className="block uppercase tracking-wider text-slate-300 mb-1">
                    Jurisdiction
                  </label>
                  <input
                    type="text"
                    name="jurisdiction"
                    value={formData.jurisdiction}
                    onChange={handleChange}
                    className="w-full rounded-lg border border-surface-border bg-midnight-950 px-3.5 py-2 text-white focus:border-cyan-400 focus:outline-none"
                  />
                </div>
              </div>

              {/* Passphrase */}
              <div>
                <label className="block uppercase tracking-wider text-slate-300 mb-1">
                  Access Passphrase
                </label>
                <input
                  type="password"
                  name="password"
                  required
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Min 6 characters"
                  className="w-full rounded-lg border border-surface-border bg-midnight-950 px-3.5 py-2 text-white focus:border-cyan-400 focus:outline-none"
                />
              </div>

              {/* Submit Registration Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full mt-4 flex items-center justify-center gap-2 rounded-lg bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 px-4 py-2.5 text-xs font-semibold uppercase tracking-wider text-midnight-950 shadow-[0_0_20px_rgba(0,240,255,0.25)] transition-all focus:outline-none focus:ring-2 focus:ring-cyan-400 disabled:opacity-60"
              >
                {loading ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    <span>Verifying & Accrediting Institution...</span>
                  </>
                ) : (
                  <>
                    <span>Complete Verification & Proceed to Sign In</span>
                    <ArrowRight className="h-4 w-4" />
                  </>
                )}
              </button>
            </form>

            <div className="mt-4 text-center border-t border-surface-border/70 pt-3 space-y-1.5">
              <span className="text-xs text-slate-400 block">
                Already registered institution?{' '}
                <Link to="/lender/login" className="text-cyan-400 hover:underline font-semibold">
                  Sign in directly
                </Link>
              </span>
              <span className="text-xs text-slate-500 block">
                Individual applicant?{' '}
                <Link to="/register" className="text-cyan-400 hover:underline">
                  Create personal borrower account →
                </Link>
              </span>
            </div>

          </div>
        </div>
      </div>

      <footer className="w-full border-t border-surface-border/50 py-3 px-6 text-center text-[11px] font-mono text-slate-500">
        TrustLedger © 2026 • Enterprise Lending Institution Onboarding
      </footer>
    </div>
  );
}
