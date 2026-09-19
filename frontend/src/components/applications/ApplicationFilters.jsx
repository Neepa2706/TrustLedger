import React from 'react';
import { Search, RotateCcw, Filter } from 'lucide-react';

export default function ApplicationFilters({
  searchTerm,
  onSearchChange,
  filters,
  onFilterChange,
  onClearFilters,
  hasActiveFilters
}) {
  return (
    <div className="rounded-2xl border border-coffee-200 bg-white p-4 shadow-card space-y-3">
      {/* Top Search Input */}
      <div className="flex flex-wrap items-center gap-3">
        <div className="relative flex-1 min-w-[280px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-stone-400" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search application ID or applicant..."
            className="w-full rounded-xl border border-coffee-200 bg-white py-2 pl-9 pr-4 text-xs text-espresso placeholder-stone-400 font-mono transition-colors focus:border-coffee-500 focus:ring-1 focus:ring-coffee-500 focus:outline-none"
          />
        </div>

        {hasActiveFilters && (
          <button
            onClick={onClearFilters}
            className="inline-flex items-center gap-1.5 rounded-xl border border-coffee-200 bg-coffee-50 px-3 py-2 text-xs font-mono text-coffee-800 hover:bg-coffee-100 transition-colors shadow-xs"
          >
            <RotateCcw className="h-3.5 w-3.5 text-coffee-700" />
            <span>Clear Filters</span>
          </button>
        )}
      </div>

      {/* Filter Dropdown Selectors */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-2.5 pt-1 text-xs font-mono">
        {/* Risk Filter */}
        <div>
          <label className="block text-[10px] uppercase text-stone-500 mb-1 font-medium">
            Risk Tier
          </label>
          <select
            value={filters.risk}
            onChange={(e) => onFilterChange('risk', e.target.value)}
            className="w-full rounded-xl border border-coffee-200 bg-white px-2.5 py-1.5 text-espresso focus:border-coffee-500 focus:outline-none"
          >
            <option value="All">All Risk Tiers</option>
            <option value="Low">Low Risk</option>
            <option value="Medium">Medium Risk</option>
            <option value="High">High Risk</option>
          </select>
        </div>

        {/* Document Filter */}
        <div>
          <label className="block text-[10px] uppercase text-stone-500 mb-1 font-medium">
            Document Forensics
          </label>
          <select
            value={filters.document}
            onChange={(e) => onFilterChange('document', e.target.value)}
            className="w-full rounded-xl border border-coffee-200 bg-white px-2.5 py-1.5 text-espresso focus:border-coffee-500 focus:outline-none"
          >
            <option value="All">All Documents</option>
            <option value="Verified">Verified</option>
            <option value="Review">Review</option>
            <option value="Suspicious">Suspicious</option>
          </select>
        </div>

        {/* KYC Filter */}
        <div>
          <label className="block text-[10px] uppercase text-stone-500 mb-1 font-medium">
            KYC Status
          </label>
          <select
            value={filters.kyc}
            onChange={(e) => onFilterChange('kyc', e.target.value)}
            className="w-full rounded-xl border border-coffee-200 bg-white px-2.5 py-1.5 text-espresso focus:border-coffee-500 focus:outline-none"
          >
            <option value="All">All KYC</option>
            <option value="Verified">Verified</option>
            <option value="Review">Review</option>
            <option value="Suspicious">Suspicious</option>
          </select>
        </div>

        {/* Network Filter */}
        <div>
          <label className="block text-[10px] uppercase text-stone-500 mb-1 font-medium">
            Fraud Network
          </label>
          <select
            value={filters.network}
            onChange={(e) => onFilterChange('network', e.target.value)}
            className="w-full rounded-xl border border-coffee-200 bg-white px-2.5 py-1.5 text-espresso focus:border-coffee-500 focus:outline-none"
          >
            <option value="All">All Networks</option>
            <option value="Clear">Clear</option>
            <option value="Watch">Watch</option>
            <option value="Connected">Connected</option>
          </select>
        </div>

        {/* Integrity Filter */}
        <div className="col-span-2 sm:col-span-1">
          <label className="block text-[10px] uppercase text-stone-500 mb-1 font-medium">
            Evidence Ledger
          </label>
          <select
            value={filters.integrity}
            onChange={(e) => onFilterChange('integrity', e.target.value)}
            className="w-full rounded-xl border border-coffee-200 bg-white px-2.5 py-1.5 text-espresso focus:border-coffee-500 focus:outline-none"
          >
            <option value="All">All Integrity</option>
            <option value="Verified">Verified</option>
            <option value="Warning">Warning</option>
          </select>
        </div>
      </div>
    </div>
  );
}
