/**
 * TrustLedger LoanFilters Component
 * Provides clean search, category tabs, amount & duration filters,
 * and mobile drawer toggle in White & Coffee Brown fintech theme.
 */

import React, { useState } from 'react';
import { Search, Filter, X, SlidersHorizontal, ArrowUpDown } from 'lucide-react';

export default function LoanFilters({
  searchQuery,
  onSearchChange,
  selectedCategory,
  onSelectCategory,
  onCategoryChange, // alias
  maxAmountFilter,
  onAmountFilterChange,
  onMaxAmountChange, // alias
  sortBy,
  onSortChange,
  totalResults = 0
}) {
  const [mobileDrawerOpen, setMobileDrawerOpen] = useState(false);

  const handleCatSelect = onSelectCategory || onCategoryChange || (() => {});
  const handleAmountChange = onAmountFilterChange || onMaxAmountChange || (() => {});

  const categories = ['All', 'Personal', 'Emergency', 'Business', 'Commercial Drone', 'Vehicle', 'Education'];

  return (
    <div className="space-y-4">
      {/* Main Bar: Search + Category Pills + Mobile Filter Trigger */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
        
        {/* Search Input */}
        <div className="relative flex-1 max-w-md">
          <Search className="h-4 w-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-coffee-500" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search loan products (e.g. personal, drone, emergency)..."
            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-coffee-200 bg-white text-xs text-coffee-950 placeholder-coffee-400 focus:border-coffee-600 focus:outline-none focus:ring-1 focus:ring-coffee-500 shadow-sm"
          />
          {searchQuery && (
            <button
              onClick={() => onSearchChange('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-coffee-500 hover:text-coffee-950 cursor-pointer"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          )}
        </div>

        {/* Sort & Mobile Drawer Trigger */}
        <div className="flex items-center gap-2.5">
          {/* Sort Dropdown */}
          <div className="flex items-center gap-1.5 px-3 py-2 rounded-xl border border-coffee-200 bg-white text-xs text-coffee-800 shadow-sm">
            <ArrowUpDown className="h-3.5 w-3.5 text-coffee-600" />
            <select
              value={sortBy}
              onChange={(e) => onSortChange(e.target.value)}
              className="bg-transparent text-xs text-coffee-950 focus:outline-none cursor-pointer font-medium"
            >
              <option value="featured">Featured Options</option>
              <option value="amount-high">Amount: High to Low</option>
              <option value="rate-low">Lowest Interest Rate</option>
              <option value="tenure-long">Longest Duration</option>
            </select>
          </div>

          {/* Mobile Filter Toggle */}
          <button
            type="button"
            onClick={() => setMobileDrawerOpen(true)}
            className="md:hidden flex items-center gap-2 px-3.5 py-2 rounded-xl border border-coffee-200 bg-coffee-50 text-xs font-semibold text-coffee-900 cursor-pointer"
          >
            <SlidersHorizontal className="h-3.5 w-3.5 text-coffee-600" />
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
              onClick={() => handleCatSelect(cat)}
              className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
                isActive
                  ? 'bg-coffee-600 text-white shadow-sm'
                  : 'bg-white text-coffee-700 border border-coffee-200 hover:bg-coffee-50 hover:text-coffee-950 shadow-sm'
              }`}
            >
              {cat}
            </button>
          );
        })}
      </div>

      {/* Mobile Filters Drawer */}
      {mobileDrawerOpen && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-fadeIn">
          <div className="w-full max-w-md rounded-2xl border border-coffee-200 bg-white p-6 shadow-2xl space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-coffee-100">
              <div className="flex items-center gap-2">
                <Filter className="h-4 w-4 text-coffee-600" />
                <h4 className="text-sm font-bold text-coffee-950">Filter Loan Options</h4>
              </div>
              <button
                onClick={() => setMobileDrawerOpen(false)}
                className="p-1 text-coffee-600 hover:text-coffee-950 cursor-pointer"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {/* Categories */}
            <div>
              <label className="block text-xs font-bold text-coffee-950 mb-2">
                Loan Category
              </label>
              <div className="grid grid-cols-2 gap-2">
                {categories.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => handleCatSelect(cat)}
                    className={`px-3 py-2 rounded-xl text-xs font-semibold text-center border transition-all cursor-pointer ${
                      selectedCategory === cat
                        ? 'bg-coffee-600 text-white border-coffee-600 shadow-sm'
                        : 'bg-white text-coffee-700 border-coffee-200 hover:bg-coffee-50'
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
                <span className="text-coffee-600 font-medium">Max Loan Amount</span>
                <span className="font-bold text-coffee-950 font-mono">
                  Up to ₹{(maxAmountFilter || 2000000).toLocaleString('en-IN')}
                </span>
              </div>
              <input
                type="range"
                min={50000}
                max={2000000}
                step={50000}
                value={maxAmountFilter || 2000000}
                onChange={(e) => handleAmountChange(Number(e.target.value))}
                className="w-full accent-coffee-600 cursor-pointer"
              />
            </div>

            <button
              type="button"
              onClick={() => setMobileDrawerOpen(false)}
              className="w-full py-2.5 rounded-xl bg-coffee-600 hover:bg-coffee-700 font-bold text-xs text-white uppercase tracking-wider shadow-sm cursor-pointer"
            >
              Apply Filters
            </button>
          </div>
        </div>
      )}

    </div>
  );
}
