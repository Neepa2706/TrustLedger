/**
 * TrustLedger LoanMarketplacePage (/loans)
 * Borrower loan marketplace in White & Coffee Brown fintech theme.
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
  const [maxAmountFilter, setMaxAmountFilter] = useState(2000000);
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
      if (selectedCategory !== 'All' && p.category !== selectedCategory) {
        return false;
      }
      // Amount filter
      const minAmt = p.minAmount ?? p.min_amount ?? 0;
      if (minAmt > maxAmountFilter) {
        return false;
      }
      // Search query filter
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        const nameMatch = p.name?.toLowerCase().includes(query);
        const descMatch = p.description?.toLowerCase().includes(query);
        const purposeMatch = (p.purposeOptions ?? p.purpose_options ?? []).some((po) =>
          po.toLowerCase().includes(query)
        );
        if (!nameMatch && !descMatch && !purposeMatch) {
          return false;
        }
      }
      return true;
    }).sort((a, b) => {
      if (sortBy === 'rate-low') {
        return (a.minInterestRate ?? a.min_interest_rate ?? 0) - (b.minInterestRate ?? b.min_interest_rate ?? 0);
      }
      if (sortBy === 'amount-high') {
        return (b.maxAmount ?? b.max_amount ?? 0) - (a.maxAmount ?? a.max_amount ?? 0);
      }
      if (sortBy === 'tenure-long') {
        return (b.maxDurationMonths ?? b.max_duration_months ?? 0) - (a.maxDurationMonths ?? a.max_duration_months ?? 0);
      }
      return 0; // default featured
    });
  }, [products, selectedCategory, maxAmountFilter, searchQuery, sortBy]);

  const categories = useMemo(() => {
    const set = new Set(products.map((p) => p.category).filter(Boolean));
    return ['All', ...Array.from(set)];
  }, [products]);

  return (
    <div className="space-y-6">
      
      {/* Top Marketplace Banner */}
      <div className="rounded-2xl border border-coffee-200 bg-white p-6 sm:p-8 shadow-card relative overflow-hidden">
        
        <div className="relative z-10 space-y-3 max-w-2xl">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-coffee-100 border border-coffee-200 text-coffee-700">
              <FileSpreadsheet className="h-4 w-4" />
            </div>
            <span className="text-xs font-mono uppercase tracking-wider text-coffee-600 font-bold">
              Borrower Loan Marketplace
            </span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-extrabold text-coffee-950 tracking-tight">
            Find the right loan for you
          </h1>

          <p className="text-xs sm:text-sm text-coffee-800 leading-relaxed font-semibold">
            Explore available loan options and choose the one that fits your needs.
          </p>

          <div className="flex flex-wrap items-center gap-2 pt-1 text-[11px] font-bold text-coffee-800">
            <span className="px-2.5 py-0.5 rounded-full bg-coffee-100 border border-coffee-300">
              Demo loan product
            </span>
            <span>•</span>
            <span className="text-stone-700">
              Approval is subject to lender verification and underwriting.
            </span>
          </div>
        </div>

        {/* Verification / Authentication Status Banner */}
        <div className="mt-6 pt-5 border-t border-coffee-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            {!user ? (
              <>
                <div className="h-9 w-9 rounded-xl bg-coffee-50 border border-coffee-200 text-coffee-700 flex items-center justify-center shrink-0">
                  <ShieldCheck className="h-4 w-4" />
                </div>
                <div>
                  <span className="text-xs font-bold text-coffee-950 block">
                    Welcome to TrustLedger Loans
                  </span>
                  <span className="text-[11px] text-coffee-600">
                    Browse all loan products below. Sign in or register to check eligibility and apply.
                  </span>
                </div>
              </>
            ) : isProfileVerified ? (
              <>
                <div className="h-9 w-9 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-700 flex items-center justify-center shrink-0">
                  <CheckCircle2 className="h-4 w-4" />
                </div>
                <div>
                  <span className="text-xs font-bold text-coffee-950 block">
                    Profile Verification: Completed
                  </span>
                  <span className="text-[11px] text-coffee-600">
                    Your verified identity is ready for 1-click pre-fill into loan applications.
                  </span>
                </div>
              </>
            ) : (
              <>
                <div className="h-9 w-9 rounded-xl bg-amber-50 border border-amber-200 text-amber-700 flex items-center justify-center shrink-0">
                  <AlertCircle className="h-4 w-4" />
                </div>
                <div>
                  <span className="text-xs font-bold text-amber-900 block">
                    Profile verification pending
                  </span>
                  <span className="text-[11px] text-coffee-600">
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
                className="inline-flex items-center justify-center gap-1.5 px-4 py-2 rounded-xl bg-coffee-600 hover:bg-coffee-700 text-xs font-bold uppercase tracking-wider text-white shadow-sm transition-all shrink-0 cursor-pointer"
              >
                <span>Applicant Sign In</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </Link>
              <Link
                to="/register"
                className="inline-flex items-center justify-center gap-1.5 px-4 py-2 rounded-xl bg-white border border-coffee-200 text-xs font-semibold text-coffee-900 hover:bg-coffee-50 shrink-0 shadow-sm"
              >
                <span>Register</span>
              </Link>
            </div>
          ) : !isProfileVerified ? (
            <Link
              to="/profile-setup"
              className="inline-flex items-center justify-center gap-1.5 px-4 py-2 rounded-xl bg-coffee-600 hover:bg-coffee-700 text-xs font-bold uppercase tracking-wider text-white shadow-sm transition-all shrink-0 cursor-pointer"
            >
              <span>Complete Profile</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          ) : null}
        </div>

      </div>

      {/* Loan Eligibility & One-Person Notice */}
      <LoanEligibilityNotice isVerified={isProfileVerified} user={user} />

      {/* Filters & Search Control Bar */}
      <LoanFilters
        categories={categories}
        selectedCategory={selectedCategory}
        onSelectCategory={setSelectedCategory}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        maxAmountFilter={maxAmountFilter}
        onAmountFilterChange={setMaxAmountFilter}
        sortBy={sortBy}
        onSortChange={setSortBy}
      />

      {/* Loan Products Grid */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-sm font-bold text-coffee-950">
            Available Loan Options ({filteredProducts.length})
          </h2>
          <span className="text-[11px] text-coffee-600">
            Transparent interest rates • Zero hidden fees
          </span>
        </div>

        {filteredProducts.length === 0 ? (
          <div className="rounded-2xl border border-coffee-200 bg-white p-12 text-center shadow-card">
            <SlidersHorizontal className="h-10 w-10 text-coffee-400 mx-auto mb-3" />
            <h3 className="text-sm font-bold text-coffee-950">No matching loans found</h3>
            <p className="text-xs text-coffee-600 mt-1 max-w-sm mx-auto">
              Try adjusting your category filter, maximum amount slider, or search keywords.
            </p>
            <button
              onClick={() => {
                setSelectedCategory('All');
                setSearchQuery('');
                setMaxAmountFilter(2000000);
              }}
              className="mt-4 px-4 py-2 rounded-xl bg-coffee-50 border border-coffee-200 text-xs font-semibold text-coffee-800 hover:bg-coffee-100 transition-colors cursor-pointer"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProducts.map((product) => (
              <LoanCard
                key={product.id}
                product={product}
                onSelect={() => {}}
              />
            ))}
          </div>
        )}
      </div>

    </div>
  );
}
