/**
 * TrustLedger LoanCard Component
 * Displays a synthetic loan product card with key terms, tenure,
 * interest rate, and action link. Clearly labeled as Demo Loan Product.
 */

import React from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowRight,
  ShieldCheck,
  Clock,
  Percent,
  CheckCircle2,
  Briefcase,
  Zap,
  UserCheck,
  Compass,
  GraduationCap
} from 'lucide-react';

const ICON_MAP = {
  UserCheck: UserCheck,
  Zap: Zap,
  Briefcase: Briefcase,
  Compass: Compass,
  GraduationCap: GraduationCap
};

export default function LoanCard({ product, onSelect }) {
  const IconComponent = ICON_MAP[product.iconName] || UserCheck;

  return (
    <div className="rounded-2xl border border-surface-border bg-surface-card hover:border-cyan-500/50 p-6 shadow-xl transition-all duration-200 flex flex-col justify-between group hover:shadow-[0_0_25px_rgba(0,240,255,0.12)] relative">
      
      <div>
        {/* Top Header: Badge & Category */}
        <div className="flex items-center justify-between gap-2 mb-4">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-cyan-950 border border-cyan-500/30 text-cyan-400 group-hover:text-cyan-300 transition-colors">
              <IconComponent className="h-5 w-5" />
            </div>
            <div>
              <span className="text-[10px] font-mono uppercase tracking-wider text-cyan-400 block font-semibold">
                {product.category}
              </span>
              <h3 className="text-base font-bold text-white group-hover:text-cyan-300 transition-colors">
                {product.name}
              </h3>
            </div>
          </div>

          {product.badge && (
            <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-cyan-950/80 text-cyan-300 border border-cyan-500/40">
              {product.badge}
            </span>
          )}
        </div>

        {/* Short Tagline / Description */}
        <p className="text-xs text-slate-300 mb-5 line-clamp-2 leading-relaxed">
          {product.description}
        </p>

        {/* Key Product Terms Grid */}
        <div className="grid grid-cols-2 gap-3 p-3.5 rounded-xl border border-surface-border bg-midnight-950/80 text-xs mb-5">
          <div>
            <span className="text-[10px] font-mono uppercase text-slate-400 block mb-0.5">
              Loan Amount
            </span>
            <span className="font-bold text-white font-mono">
              ₹{(product.minAmount ?? product.min_amount ?? 0).toLocaleString('en-IN')} – ₹{(product.maxAmount ?? product.max_amount ?? 0).toLocaleString('en-IN')}
            </span>
          </div>

          <div>
            <span className="text-[10px] font-mono uppercase text-slate-400 block mb-0.5">
              Duration
            </span>
            <span className="font-bold text-white font-mono">
              {product.minDurationMonths ?? product.min_duration_months ?? 6} – {product.maxDurationMonths ?? product.max_duration_months ?? 36} mos
            </span>
          </div>

          <div>
            <span className="text-[10px] font-mono uppercase text-slate-400 block mb-0.5">
              Interest Rate
            </span>
            <span className="font-bold text-cyan-300 font-mono">
              {product.minInterestRate ?? product.min_interest_rate ?? 12}% – {product.maxInterestRate ?? product.max_interest_rate ?? 18}% p.a.
            </span>
          </div>

          <div>
            <span className="text-[10px] font-mono uppercase text-slate-400 block mb-0.5">
              Processing Fee
            </span>
            <span className="font-semibold text-slate-200">
              Up to {product.processingFeePercentage ?? product.processing_fee_percentage ?? 2}%
            </span>
          </div>
        </div>

        {/* Purpose Highlights */}
        <div className="text-[11px] text-slate-400 mb-4 flex items-center gap-1.5 truncate">
          <span className="font-medium text-slate-300">Popular for:</span>
          <span>{(product.purposeOptions ?? product.purpose_options ?? []).slice(0, 2).join(', ')}</span>
        </div>
      </div>

      {/* Footer Actions & Disclaimers */}
      <div className="space-y-3 pt-3 border-t border-surface-border/60">
        <div className="flex items-center justify-between text-[10px] font-mono text-slate-400">
          <span className="flex items-center gap-1">
            <ShieldCheck className="h-3 w-3 text-emerald-400" />
            <span>Verified Profile Eligible</span>
          </span>
          <span className="px-1.5 py-0.2 rounded bg-midnight-900 border border-surface-border text-slate-400">
            Demo Loan
          </span>
        </div>

        <Link
          to={`/loans/${product.id}`}
          onClick={onSelect}
          className="w-full flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 px-4 py-2.5 text-xs font-semibold uppercase tracking-wider text-midnight-950 shadow-[0_0_15px_rgba(0,240,255,0.2)] transition-all group-hover:shadow-[0_0_20px_rgba(0,240,255,0.35)]"
        >
          <span>View Details</span>
          <ArrowRight className="h-3.5 w-3.5 group-hover:translate-x-0.5 transition-transform" />
        </Link>
      </div>

    </div>
  );
}
