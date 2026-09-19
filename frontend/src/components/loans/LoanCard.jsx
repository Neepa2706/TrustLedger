/**
 * TrustLedger LoanCard Component
 * Displays a synthetic loan product card with key terms, tenure,
 * interest rate, and action link. Clearly labeled as Demo Loan Product.
 * Styled in White & Coffee Brown fintech design system.
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
  GraduationCap,
  Send
} from 'lucide-react';

const ICON_MAP = {
  UserCheck: UserCheck,
  Zap: Zap,
  Briefcase: Briefcase,
  Compass: Compass,
  GraduationCap: GraduationCap,
  Send: Send
};

export default function LoanCard({ product, onSelect }) {
  const IconComponent = ICON_MAP[product.iconName] || UserCheck;

  return (
    <div className="rounded-2xl border border-coffee-200 bg-white hover:border-coffee-400 p-6 shadow-card hover:shadow-card-hover transition-all duration-200 flex flex-col justify-between group relative">
      
      <div>
        {/* Top Header: Badge & Category */}
        <div className="flex items-center justify-between gap-2 mb-4">
          <div className="flex items-center gap-2.5">
            <div className="p-2.5 rounded-xl bg-coffee-50 border border-coffee-200 text-coffee-700 transition-colors">
              <IconComponent className="h-5 w-5" />
            </div>
            <div>
              <span className="text-[10px] font-mono uppercase tracking-wider text-coffee-600 block font-bold">
                {product.category}
              </span>
              <h3 className="text-base font-bold text-coffee-950 group-hover:text-coffee-700 transition-colors">
                {product.name}
              </h3>
            </div>
          </div>

          {product.badge && (
            <span className="text-[10px] font-mono px-2.5 py-0.5 rounded-full bg-coffee-100 text-coffee-800 border border-coffee-200 font-bold">
              {product.badge}
            </span>
          )}
        </div>

        {/* Short Tagline / Description */}
        <p className="text-xs text-coffee-600 mb-5 line-clamp-2 leading-relaxed">
          {product.description}
        </p>

        {/* Key Product Terms Grid */}
        <div className="grid grid-cols-2 gap-3 p-4 rounded-xl border border-coffee-100 bg-coffee-50/50 text-xs mb-5">
          <div>
            <span className="text-[10px] font-mono uppercase text-coffee-600 block mb-0.5 font-medium">
              Loan Amount
            </span>
            <span className="font-bold text-coffee-950 font-mono">
              ₹{(product.minAmount ?? product.min_amount ?? 0).toLocaleString('en-IN')} – ₹{(product.maxAmount ?? product.max_amount ?? 0).toLocaleString('en-IN')}
            </span>
          </div>

          <div>
            <span className="text-[10px] font-mono uppercase text-coffee-600 block mb-0.5 font-medium">
              Duration
            </span>
            <span className="font-bold text-coffee-950 font-mono">
              {product.minDurationMonths ?? product.min_duration_months ?? 6} – {product.maxDurationMonths ?? product.max_duration_months ?? 36} mos
            </span>
          </div>

          <div>
            <span className="text-[10px] font-mono uppercase text-coffee-600 block mb-0.5 font-medium">
              Interest Rate
            </span>
            <span className="font-bold text-coffee-800 font-mono">
              {product.minInterestRate ?? product.min_interest_rate ?? 12}% – {product.maxInterestRate ?? product.max_interest_rate ?? 18}% p.a.
            </span>
          </div>

          <div>
            <span className="text-[10px] font-mono uppercase text-coffee-600 block mb-0.5 font-medium">
              Processing Fee
            </span>
            <span className="font-semibold text-coffee-950">
              Up to {product.processingFeePercentage ?? product.processing_fee_percentage ?? 2}%
            </span>
          </div>
        </div>

        {/* Purpose Highlights */}
        <div className="text-[11px] text-coffee-600 mb-4 flex items-center gap-1.5 truncate">
          <span className="font-bold text-coffee-800">Popular for:</span>
          <span>{(product.purposeOptions ?? product.purpose_options ?? []).slice(0, 2).join(', ')}</span>
        </div>
      </div>

      {/* Footer Actions & Disclaimers */}
      <div className="space-y-3 pt-3 border-t border-coffee-100">
        <div className="flex items-center justify-between text-[10px] font-medium text-coffee-600">
          <span className="flex items-center gap-1">
            <ShieldCheck className="h-3.5 w-3.5 text-emerald-600" />
            <span>Verified Profile Eligible</span>
          </span>
          <span className="px-2 py-0.5 rounded bg-coffee-50 border border-coffee-200 text-coffee-700 font-medium">
            Demo Loan
          </span>
        </div>

        <Link
          to={`/loans/${product.id}`}
          onClick={onSelect}
          className="w-full flex items-center justify-center gap-2 rounded-xl bg-coffee-600 hover:bg-coffee-700 px-4 py-2.5 text-xs font-bold uppercase tracking-wider text-white shadow-sm transition-all cursor-pointer"
        >
          <span>View Details & Apply</span>
          <ArrowRight className="h-3.5 w-3.5 group-hover:translate-x-0.5 transition-transform" />
        </Link>
      </div>

    </div>
  );
}
