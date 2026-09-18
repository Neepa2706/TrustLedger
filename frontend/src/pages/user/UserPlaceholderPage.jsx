/**
 * TrustLedger User Placeholder Page
 * Clean placeholder component for routes reserved for later phases:
 * - /loans (Loan Marketplace)
 * - /my-applications (Loan Applications Tracker)
 * - /payments (Loan Repayments)
 * - /profile (Profile View)
 * - /notifications (Alerts & Notifications)
 */

import React from 'react';
import { Link } from 'react-router-dom';
import {
  FileSpreadsheet,
  FileCheck2,
  CreditCard,
  User,
  Bell,
  Clock,
  ArrowRight,
  ShieldCheck
} from 'lucide-react';
import { useUserAuth } from '../../context/UserAuthContext';

export default function UserPlaceholderPage({ type = 'loans' }) {
  const { user, profile } = useUserAuth();

  const config = {
    loans: {
      title: 'Available Digital Loans',
      subtitle: 'Browse and compare verified digital loan products',
      icon: FileSpreadsheet,
      phase: 'Phase 2 Preview',
      description: 'The loan marketplace is coming in the next phase. Once unlocked, you will be able to select pre-approved loans, review interest rates, and apply with your verified TrustLedger identity.'
    },
    applications: {
      title: 'My Applications',
      subtitle: 'Track lender review, document verification, and disbursals',
      icon: FileCheck2,
      phase: 'Phase 2 Preview',
      description: 'Your loan applications and institutional underwriter decisions will be tracked here in real time.'
    },
    payments: {
      title: 'Loan Repayments',
      subtitle: 'Repayment schedules, UPI autopay, and settlement alerts',
      icon: CreditCard,
      phase: 'Phase 3 Preview',
      description: 'Manage flexible EMI repayments, payment reminders, and digital loan clearance certificates.'
    },
    profile: {
      title: 'Borrower Profile & Identity',
      subtitle: 'View your verified credentials and submitted documents',
      icon: User,
      phase: 'Active Profile',
      description: `Your identity has been verified under ${profile?.full_name || user?.fullName || 'Beneficiary'}. Sensitive numbers (Aadhaar: ${profile?.aadhaar_masked || 'XXXX XXXX 4821'}) are encrypted.`
    },
    notifications: {
      title: 'Notifications & Alerts',
      subtitle: 'Real-time updates regarding loan status and repayment dates',
      icon: Bell,
      phase: 'Phase 3 Preview',
      description: 'Receive real-time institutional approval notifications, repayment deadline alerts, and document audit records.'
    }
  };

  const item = config[type] || config.loans;
  const Icon = item.icon;

  return (
    <div className="max-w-3xl mx-auto py-8 animate-fadeIn space-y-6">
      <div className="rounded-2xl border border-surface-border bg-surface-card p-8 shadow-xl text-center space-y-6">
        
        <div className="mx-auto w-16 h-16 rounded-2xl bg-cyan-950/80 border border-cyan-500/40 flex items-center justify-center text-cyan-400 shadow-inner">
          <Icon className="h-8 w-8" />
        </div>

        <div className="space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full border border-cyan-500/30 bg-cyan-950/40 text-cyan-300 text-xs font-mono">
            <Clock className="h-3 w-3" />
            <span>{item.phase}</span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-bold text-white">
            {item.title}
          </h1>

          <p className="text-xs sm:text-sm text-slate-400 max-w-lg mx-auto">
            {item.subtitle}
          </p>
        </div>

        <div className="max-w-md mx-auto p-4 rounded-xl border border-surface-border bg-midnight-950 text-xs text-slate-300 leading-relaxed">
          {item.description}
        </div>

        <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
          <Link
            to="/home"
            className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 px-5 py-2.5 text-xs font-semibold uppercase tracking-wider text-midnight-950 shadow-[0_0_20px_rgba(0,240,255,0.25)] transition-all"
          >
            <span>Return to Home</span>
            <ArrowRight className="h-4 w-4" />
          </Link>

          {type !== 'loans' && (
            <Link
              to="/loans"
              className="px-4 py-2 text-xs font-medium text-slate-400 hover:text-white"
            >
              Go to Loans
            </Link>
          )}
        </div>

      </div>

      <div className="text-center text-[11px] font-mono text-slate-500 flex items-center justify-center gap-2">
        <ShieldCheck className="h-3.5 w-3.5 text-emerald-400" />
        <span>Cryptographically verified TrustLedger Identity Framework</span>
      </div>
    </div>
  );
}
