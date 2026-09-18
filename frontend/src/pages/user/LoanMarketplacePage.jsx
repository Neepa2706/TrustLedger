/**
 * TrustLedger LoanMarketplacePage (/loans)
 * Replaces placeholder with borrower loan marketplace.
 * Header: "Loans for your needs"
 * Subtitle: "Choose a loan option, check the details, and apply using your verified TrustLedger profile."
 * Includes verification status indicator, category filters, search, and dynamic demo loan cards.
 */

import React, { useState, useEffect, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  FileSpreadsheet,
  CheckCircle2,
  AlertCircle,
  ShieldCheck,
  Sparkles,
  ArrowRight,
  SlidersHorizontal,
  Clock,
  UserCheck
} from 'lucide-react';
import LoanCard from '../../components/loans/LoanCard';
import LoanFilters from '../../components/loans/LoanFilters';
import LoanEligibilityNotice from '../../components/loans/LoanEligibilityNotice';
import { DEMO_LOAN_PRODUCTS } from '../../data/loanProductsData';
import { useUserAuth } from '../../context/UserAuthContext';
import loanService from '../../services/loanService';

export default function LoanMarketplacePage() {
  const navigate = useNavigate();
  const { user, profile } = useUserAuth();

  const [products, setProducts] = useState(DEMO_LOAN_PRODUCTS);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [maxAmountFilter, setMaxAmountFilter] = useState(1000000);
  const [sortBy, setSortBy] = useState('featured');
  const [loading, setLoading] = useState(false);

  const isProfileVerified = profile?.verification_status === 'VERIFIED';

  useEffect(() => {
    let isMounted = true;
    setLoading(true);
    loanService.getLoanProducts()
      .then((data) => {
        if (isMounted && data && data.length > 0) {
          setProducts(data);
        }
      })
      .catch(() => {})
      .finally(() => {
        if (isMounted) setLoading(false);
      });
    return () => { isMounted = false; };
  }, []);

  // Filtered & Sorted Loan Products
  const filteredProducts = useMemo(() => {
    return products.filter((p) => {
      // Category filter
      if (selectedCategory !== 'All' && p.category.toLowerCase() !== selectedCategory.toLowerCase()) {
        return false;
      }
      // Amount filter
      const pMin = p.minAmount ?? p.min_amount ?? 0;
      if (pMin > maxAmountFilter) {
        return false;
      }
      // Search query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesName = p.name?.toLowerCase().includes(q);
        const matchesDesc = p.description?.toLowerCase().includes(q);
        const matchesCategory = p.category?.toLowerCase().includes(q);
        const purposes = p.purposeOptions || p.purpose_options || [];
        const matchesPurposes = purposes.some((opt) => opt.toLowerCase().includes(q));
        if (!matchesName && !matchesDesc && !matchesCategory && !matchesPurposes) {
          return false;
        }
      }
      return true;
    }).sort((a, b) => {
      const aMin = a.minAmount ?? a.min_amount ?? 0;
      const bMin = b.minAmount ?? b.min_amount ?? 0;
      const aMax = a.maxAmount ?? a.max_amount ?? 0;
      const bMax = b.maxAmount ?? b.max_amount ?? 0;
      const aRate = a.minInterestRate ?? a.min_interest_rate ?? 0;
      const bRate = b.minInterestRate ?? b.min_interest_rate ?? 0;

      if (sortBy === 'amount-desc') return bMax - aMax;
      if (sortBy === 'amount-asc') return aMin - bMin;
      if (sortBy === 'rate-asc') return aRate - bRate;
      return 0; // featured
    });
  }, [products, selectedCategory, maxAmountFilter, searchQuery, sortBy]);

  return (
    <div className="space-y-8 animate-fadeIn">
      
      {/* Top Marketplace Banner */}
      <div className="rounded-2xl border border-surface-border bg-gradient-to-r from-surface-card via-surface-card/95 to-cyan-950/20 p-6 sm:p-8 shadow-xl relative overflow-hidden">
        
        {/* Glow */}
        <div className="absolute top-0 right-0 w-80 h-80 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 space-y-3 max-w-2xl">
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-lg bg-cyan-950 border border-cyan-500/40 text-cyan-400">
              <FileSpreadsheet className="h-4 w-4" />
            </div>
            <span className="text-xs font-mono uppercase tracking-wider text-cyan-400 font-semibold">
              Borrower Loan Marketplace
            </span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
            Loans for your needs
          </h1>

          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
            Choose a loan option, check the details, and apply using your verified TrustLedger profile.
          </p>
        </div>

        {/* Verification / Authentication Status Banner */}
        <div className="mt-6 pt-5 border-t border-surface-border/80 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2.5">
            {!user ? (
              <>
                <div className="h-8 w-8 rounded-xl bg-cyan-950/90 border border-cyan-500/40 text-cyan-400 flex items-center justify-center shrink-0">
                  <ShieldCheck className="h-4 w-4" />
                </div>
                <div>
                  <span className="text-xs font-semibold text-white block">
                    Welcome to TrustLedger Loans
                  </span>
                  <span className="text-[11px] text-slate-400">
                    Browse all loan products below. Sign in or register to check eligibility and apply.
                  </span>
                </div>
              </>
            ) : isProfileVerified ? (
              <>
                <div className="h-8 w-8 rounded-xl bg-emerald-950/90 border border-emerald-500/40 text-emerald-400 flex items-center justify-center shrink-0">
                  <CheckCircle2 className="h-4 w-4" />
                </div>
                <div>
                  <span className="text-xs font-semibold text-white block">
                    Profile verification: Completed
                  </span>
                  <span className="text-[11px] text-slate-400">
                    Your verified identity is ready for 1-click pre-fill into loan applications.
                  </span>
                </div>
              </>
            ) : (
              <>
                <div className="h-8 w-8 rounded-xl bg-amber-950/90 border border-amber-500/40 text-amber-400 flex items-center justify-center shrink-0">
                  <AlertCircle className="h-4 w-4" />
                </div>
                <div>
                  <span className="text-xs font-semibold text-amber-300 block">
                    Profile verification pending
                  </span>
                  <span className="text-[11px] text-slate-400">
                    Please complete your profile verification before applying for a loan.
                  </span>
                </div>
              </>
            )}
          </div>

          {!user ? (
            <div className="flex items-center gap-2">
              <Link
                to="/login"
                className="inline-flex items-center justify-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-xs font-semibold uppercase tracking-wider text-midnight-950 shadow transition-all shrink-0"
              >
                <span>Applicant Sign In</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </Link>
              <Link
                to="/register"
                className="inline-flex items-center justify-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-midnight-900 border border-surface-border text-xs text-slate-300 hover:text-white shrink-0"
              >
                <span>Register</span>
              </Link>
            </div>
          ) : !isProfileVerified ? (
            <Link
              to="/profile-setup"
              className="inline-flex items-center justify-center gap-1.5 px-4 py-2 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-xs font-semibold uppercase tracking-wider text-midnight-950 shadow-[0_0_15px_rgba(0,240,255,0.25)] transition-all shrink-0"
            >
              <span>Complete Profile</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          ) : null}
        </div>

      </div>

      {/* Filter and Search Bar */}
      <LoanFilters
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        selectedCategory={selectedCategory}
        onCategoryChange={setSelectedCategory}
        maxAmountFilter={maxAmountFilter}
        onMaxAmountChange={setMaxAmountFilter}
        sortBy={sortBy}
        onSortChange={setSortBy}
        totalResults={filteredProducts.length}
      />

      {/* Loan Cards Grid */}
      {filteredProducts.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProducts.map((prod) => (
            <LoanCard
              key={prod.id}
              product={prod}
              onSelect={() => {}}
            />
          ))}
        </div>
      ) : (
        <div className="rounded-2xl border border-surface-border bg-surface-card p-12 text-center space-y-3">
          <FileSpreadsheet className="h-12 w-12 text-slate-500 mx-auto" />
          <h3 className="text-base font-bold text-white">No loan products match your criteria</h3>
          <p className="text-xs text-slate-400 max-w-sm mx-auto">
            Try resetting your search query or selecting a different loan category to see available options.
          </p>
          <button
            onClick={() => {
              setSearchQuery('');
              setSelectedCategory('All');
              setMaxAmountFilter(1000000);
            }}
            className="px-4 py-2 rounded-xl bg-midnight-900 border border-surface-border text-xs text-cyan-300 hover:text-white mt-2"
          >
            Reset Filters
          </button>
        </div>
      )}

      {/* Disclaimers & Eligibility Guidance */}
      <LoanEligibilityNotice />

    </div>
  );
}
