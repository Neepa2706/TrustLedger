/**
 * TrustLedger LoanFilters Component
 * Provides clean search, category tabs, amount & duration filters,
 * and mobile drawer toggle.
 */

import React, { useState } from 'react';
import { Search, Filter, X, SlidersHorizontal, ArrowUpDown } from 'lucide-react';

export default function LoanFilters({
  searchQuery,
  onSearchChange,
  selectedCategory,
  onCategoryChange,
  maxAmountFilter,
  onMaxAmountChange,
  sortBy,
  onSortChange,
  totalResults = 0
}) {
  const [mobileDrawerOpen, setMobileDrawerOpen] = useState(false);

  const categories = ['All', 'Personal', 'Emergency', 'Business', 'Vehicle', 'Education'];

  return (
    <div className="space-y-4">
      {/* Main Bar: Search + Category Pills + Mobile Filter Trigger */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
        
        {/* Search Input */}
        <div className="relative flex-1 max-w-md">
          <Search className="h-4 w-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search loan products (e.g. personal, emergency)..."
            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-surface-border bg-midnight-950 text-xs text-white placeholder-slate-500 focus:border-cyan-400 focus:outline-none"
          />
          {searchQuery && (
            <button
              onClick={() => onSearchChange('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          )}
        </div>

        {/* Sort & Mobile Drawer Trigger */}
        <div className="flex items-center gap-2.5">
          {/* Sort Dropdown */}
          <div className="flex items-center gap-1.5 px-3 py-2 rounded-xl border border-surface-border bg-midnight-950 text-xs text-slate-300">
            <ArrowUpDown className="h-3.5 w-3.5 text-cyan-400" />
            <select
              value={sortBy}
              onChange={(e) => onSortChange(e.target.value)}
              className="bg-transparent text-xs text-white focus:outline-none cursor-pointer"
            >
              <option value="featured" className="bg-midnight-950 text-white">Featured</option>
              <option value="amount-desc" className="bg-midnight-950 text-white">Amount: High to Low</option>
              <option value="amount-asc" className="bg-midnight-950 text-white">Amount: Low to High</option>
              <option value="rate-asc" className="bg-midnight-950 text-white">Lowest Interest Rate</option>
            </select>
          </div>

          {/* Mobile Filter Toggle */}
          <button
            type="button"
            onClick={() => setMobileDrawerOpen(true)}
            className="md:hidden flex items-center gap-2 px-3 py-2 rounded-xl border border-cyan-500/40 bg-cyan-950/40 text-xs text-cyan-300"
          >
            <SlidersHorizontal className="h-3.5 w-3.5" />
            <span>Filters</span>
          </button>
        </div>

      </div>

      {/* Category Pills (Desktop) */}
      <div className="hidden md:flex items-center gap-2 overflow-x-auto pb-1">
        {categories.map((cat) => {
          const isActive = selectedCategory === cat;
          return (
            <button
              key={cat}
              onClick={() => onCategoryChange(cat)}
              className={`px-4 py-2 rounded-xl text-xs font-medium whitespace-nowrap transition-all ${
                isActive
                  ? 'bg-cyan-950 text-cyan-300 border border-cyan-500/50 shadow-[0_0_12px_rgba(0,240,255,0.2)]'
                  : 'bg-midnight-950/80 text-slate-400 border border-surface-border hover:text-white hover:border-surface-border/80'
              }`}
            >
              {cat}
            </button>
          );
        })}

        <div className="ml-auto text-xs font-mono text-slate-400">
          Showing {totalResults} option{totalResults === 1 ? '' : 's'}
        </div>
      </div>

      {/* Mobile Filters Drawer */}
      {mobileDrawerOpen && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-midnight-950/80 backdrop-blur-sm p-4 animate-fadeIn">
          <div className="w-full max-w-md rounded-2xl border border-surface-border bg-surface-card p-6 shadow-2xl space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-surface-border">
              <div className="flex items-center gap-2">
                <Filter className="h-4 w-4 text-cyan-400" />
                <h4 className="text-sm font-bold text-white">Filter Loan Options</h4>
              </div>
              <button
                onClick={() => setMobileDrawerOpen(false)}
                className="p-1 text-slate-400 hover:text-white"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {/* Categories */}
            <div>
              <label className="block text-xs font-mono uppercase text-slate-400 mb-2">
                Loan Category
              </label>
              <div className="grid grid-cols-2 gap-2">
                {categories.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => onCategoryChange(cat)}
                    className={`px-3 py-2 rounded-lg text-xs font-medium text-center border transition-all ${
                      selectedCategory === cat
                        ? 'bg-cyan-950 text-cyan-300 border-cyan-500/50 font-semibold'
                        : 'bg-midnight-950 text-slate-400 border-surface-border'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            {/* Max Amount Slider */}
            <div>
              <div className="flex items-center justify-between mb-1.5 text-xs">
                <span className="text-slate-400 font-mono uppercase">Max Loan Amount</span>
                <span className="font-bold text-cyan-400 font-mono">
                  Up to ₹{maxAmountFilter.toLocaleString('en-IN')}
                </span>
              </div>
              <input
                type="range"
                min={50000}
                max={1000000}
                step={25000}
                value={maxAmountFilter}
                onChange={(e) => onMaxAmountChange(Number(e.target.value))}
                className="w-full accent-cyan-400 cursor-pointer"
              />
            </div>

            <button
              type="button"
              onClick={() => setMobileDrawerOpen(false)}
              className="w-full py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 font-semibold text-xs text-midnight-950 uppercase tracking-wider"
            >
              Apply Filters ({totalResults} matches)
            </button>
          </div>
        </div>
      )}

    </div>
  );
}
