/**
 * TrustLedger User Home Route (/home)
 * Customer dashboard welcoming the borrower, displaying verification status,
 * completion percentage, verified identity summary, and loan exploration prompt.
 */

import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  ShieldCheck,
  CheckCircle2,
  Clock,
  ArrowRight,
  UserCheck,
  FileSpreadsheet,
  FileCheck2,
  Lock,
  Sparkles,
  AlertCircle
} from 'lucide-react';
import SingleAccountNotice from '../../components/user/SingleAccountNotice';
import { useUserAuth } from '../../context/UserAuthContext';

export default function UserHomePage() {
  const navigate = useNavigate();
  const { user, profile, isDemo } = useUserAuth();

  const isVerified = profile?.verification_status === 'VERIFIED';
  const completionPercentage = profile?.completion_percentage || (isVerified ? 100 : 35);
  const displayName = profile?.full_name || user?.fullName || 'Applicant';

  return (
    <div className="space-y-8 animate-fadeIn">
      
      {/* =====================================================================
          TOP WELCOME HERO
          ===================================================================== */}
      <div className="rounded-2xl border border-surface-border bg-gradient-to-r from-surface-card via-surface-card/90 to-cyan-950/30 p-6 sm:p-8 shadow-xl relative overflow-hidden">
        
        {/* Ambient Top Glow */}
        <div className="absolute top-0 right-0 w-80 h-80 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono uppercase tracking-wider text-cyan-400">
                Borrower Dashboard
              </span>
              {isDemo && (
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-cyan-950 text-cyan-300 border border-cyan-500/30">
                  DEMO MODE
                </span>
              )}
            </div>

            <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
              Welcome to TrustLedger, {displayName}
            </h1>

            <p className="text-xs sm:text-sm text-slate-300 max-w-xl leading-relaxed">
              Your personal borrower account is verified and ready. You can browse trusted loan offers,
              manage submitted applications, and track repayments with full transparency.
            </p>
          </div>

          {/* Action Button */}
          <div className="shrink-0">
            <Link
              to="/loans"
              className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 px-6 py-3 text-xs font-semibold uppercase tracking-wider text-midnight-950 shadow-[0_0_20px_rgba(0,240,255,0.25)] transition-all"
            >
              <FileSpreadsheet className="h-4 w-4" />
              <span>Explore Available Loans</span>
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>

        {/* Verification Status & Progress Bar */}
        <div className="mt-8 pt-6 border-t border-surface-border/80 grid grid-cols-1 sm:grid-cols-3 gap-4">
          
          {/* Status Badge Card */}
          <div className="p-4 rounded-xl border border-surface-border bg-midnight-950/80 flex items-center gap-3">
            <div className={`p-2.5 rounded-lg ${
              isVerified
                ? 'bg-emerald-950 text-emerald-400 border border-emerald-500/30'
                : 'bg-amber-950 text-amber-400 border border-amber-500/30'
            }`}>
              {isVerified ? <CheckCircle2 className="h-5 w-5" /> : <Clock className="h-5 w-5" />}
            </div>
            <div>
              <span className="text-[10px] font-mono uppercase tracking-wider text-slate-400 block">
                Verification Status
              </span>
              <span className={`text-xs font-bold ${isVerified ? 'text-emerald-300' : 'text-amber-300'}`}>
                {isVerified ? 'Document-based Identity Verified' : 'Profile Setup In Progress'}
              </span>
            </div>
          </div>

          {/* Completion Percentage */}
          <div className="p-4 rounded-xl border border-surface-border bg-midnight-950/80 flex flex-col justify-center">
            <div className="flex items-center justify-between mb-1.5 text-xs">
              <span className="text-slate-400 font-mono text-[10px] uppercase">
                Profile Completion
              </span>
              <span className="font-bold text-cyan-400 font-mono">
                {completionPercentage}%
              </span>
            </div>
            <div className="w-full h-2 rounded-full bg-midnight-900 overflow-hidden border border-surface-border">
              <div
                className="h-full bg-gradient-to-r from-cyan-400 to-emerald-400 transition-all duration-500"
                style={{ width: `${completionPercentage}%` }}
              />
            </div>
          </div>

          {/* Single Person Rule Badge */}
          <div className="p-4 rounded-xl border border-surface-border bg-midnight-950/80 flex items-center gap-3">
            <div className="p-2.5 rounded-lg bg-cyan-950 text-cyan-300 border border-cyan-500/30">
              <UserCheck className="h-5 w-5" />
            </div>
            <div>
              <span className="text-[10px] font-mono uppercase tracking-wider text-slate-400 block">
                Account Ownership
              </span>
              <span className="text-xs font-bold text-white">
                1 Person = 1 Account
              </span>
            </div>
          </div>

        </div>

      </div>

      {/* =====================================================================
          VERIFIED IDENTITY SUMMARY CARD
          ===================================================================== */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left 2 Cols: Identity Snapshot */}
        <div className="lg:col-span-2 rounded-2xl border border-surface-border bg-surface-card p-6 shadow-lg space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-surface-border">
            <div className="flex items-center gap-2">
              <ShieldCheck className="h-4 w-4 text-cyan-400" />
              <h2 className="text-sm font-bold text-white">
                Verified Identity Summary
              </h2>
            </div>
            <span className="text-[11px] font-mono text-emerald-400 flex items-center gap-1">
              <CheckCircle2 className="h-3 w-3" /> Protected Snapshot
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div className="p-3 rounded-xl border border-surface-border bg-midnight-950">
              <span className="text-[10px] font-mono uppercase text-slate-400 block mb-1">
                Full Legal Name
              </span>
              <span className="font-semibold text-white">
                {displayName}
              </span>
            </div>

            <div className="p-3 rounded-xl border border-surface-border bg-midnight-950">
              <span className="text-[10px] font-mono uppercase text-slate-400 block mb-1">
                Contact Details
              </span>
              <span className="font-semibold text-white">
                {profile?.mobile || user?.mobile || '9876543210'} • {profile?.email || user?.email}
              </span>
            </div>

            <div className="p-3 rounded-xl border border-surface-border bg-midnight-950">
              <span className="text-[10px] font-mono uppercase text-slate-400 block mb-1">
                Aadhaar Identifier (Masked)
              </span>
              <span className="font-mono text-cyan-300 font-semibold tracking-wider">
                {profile?.aadhaar_masked || 'XXXX XXXX 4821'}
              </span>
            </div>

            <div className="p-3 rounded-xl border border-surface-border bg-midnight-950">
              <span className="text-[10px] font-mono uppercase text-slate-400 block mb-1">
                Permanent Account Number (PAN)
              </span>
              <span className="font-mono text-cyan-300 font-semibold tracking-wider">
                {profile?.pan_masked || 'AB•••••4821'}
              </span>
            </div>
          </div>

          {/* Privacy Note */}
          <div className="p-3 rounded-lg border border-surface-border bg-midnight-900/60 text-[11px] font-mono text-slate-400 flex items-center gap-2">
            <Lock className="h-3.5 w-3.5 text-cyan-400 shrink-0" />
            <span>Identity documents and camera photographs are encrypted with user-isolated RLS security.</span>
          </div>
        </div>

        {/* Right 1 Col: Quick Links / Next Actions */}
        <div className="rounded-2xl border border-surface-border bg-surface-card p-6 shadow-lg flex flex-col justify-between space-y-4">
          <div>
            <span className="text-xs font-mono uppercase tracking-wider text-cyan-400 block mb-1">
              Next Action
            </span>
            <h3 className="text-base font-bold text-white">
              Digital Loan Origination
            </h3>
            <p className="text-xs text-slate-400 mt-2 leading-relaxed">
              With your identity verified, you can now review verified loan packages, transparent interest rates, and institutional lenders.
            </p>
          </div>

          <div className="space-y-2.5">
            <Link
              to="/loans"
              className="w-full flex items-center justify-between p-3 rounded-xl border border-cyan-500/30 bg-cyan-950/30 hover:bg-cyan-950/60 text-xs font-medium text-cyan-300 transition-all group"
            >
              <span>Browse Loan Marketplace</span>
              <ArrowRight className="h-4 w-4 group-hover:translate-x-0.5 transition-transform" />
            </Link>

            <Link
              to="/profile"
              className="w-full flex items-center justify-between p-3 rounded-xl border border-surface-border bg-midnight-950 hover:bg-midnight-900 text-xs font-medium text-slate-300 hover:text-white transition-all"
            >
              <span>View Full Profile</span>
              <ArrowRight className="h-4 w-4 text-slate-500" />
            </Link>
          </div>
        </div>

      </div>

      {/* Mandatory Single Person Rule Banner */}
      <SingleAccountNotice variant="banner" />

    </div>
  );
}
