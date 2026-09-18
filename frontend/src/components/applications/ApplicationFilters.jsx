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
    <div className="rounded-xl border border-surface-border bg-surface-card/80 p-4 backdrop-blur-sm space-y-3">
      {/* Top Search Input */}
      <div className="flex flex-wrap items-center gap-3">
        <div className="relative flex-1 min-w-[280px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search application ID or applicant..."
            className="w-full rounded-lg border border-surface-border bg-midnight-950 py-2 pl-9 pr-4 text-xs text-white placeholder-slate-500 font-mono transition-colors focus:border-cyan-400 focus:outline-none focus:ring-1 focus:ring-cyan-400"
          />
        </div>

        {hasActiveFilters && (
          <button
            onClick={onClearFilters}
            className="inline-flex items-center gap-1.5 rounded-lg border border-surface-border bg-midnight-900 px-3 py-2 text-xs font-mono text-cyan-300 hover:border-cyan-500/40 hover:text-white transition-colors"
          >
            <RotateCcw className="h-3.5 w-3.5 text-cyan-400" />
            <span>Clear Filters</span>
          </button>
        )}
      </div>

      {/* Filter Dropdown Selectors */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-2.5 pt-1 text-xs font-mono">
        {/* Risk Filter */}
        <div>
          <label className="block text-[10px] uppercase text-slate-400 mb-1">
            Risk Tier
          </label>
          <select
            value={filters.risk}
            onChange={(e) => onFilterChange('risk', e.target.value)}
            className="w-full rounded-lg border border-surface-border bg-midnight-950 px-2.5 py-1.5 text-slate-200 focus:border-cyan-400 focus:outline-none"
          >
            <option value="All">All Risk Tiers</option>
            <option value="Low">Low Risk</option>
            <option value="Medium">Medium Risk</option>
            <option value="High">High Risk</option>
          </select>
        </div>

        {/* Document Filter */}
        <div>
          <label className="block text-[10px] uppercase text-slate-400 mb-1">
            Document Forensics
          </label>
          <select
            value={filters.document}
            onChange={(e) => onFilterChange('document', e.target.value)}
            className="w-full rounded-lg border border-surface-border bg-midnight-950 px-2.5 py-1.5 text-slate-200 focus:border-cyan-400 focus:outline-none"
          >
            <option value="All">All Documents</option>
            <option value="Verified">Verified</option>
            <option value="Review">Review</option>
            <option value="Suspicious">Suspicious</option>
          </select>
        </div>

        {/* KYC Filter */}
        <div>
          <label className="block text-[10px] uppercase text-slate-400 mb-1">
            KYC Status
          </label>
          <select
            value={filters.kyc}
            onChange={(e) => onFilterChange('kyc', e.target.value)}
            className="w-full rounded-lg border border-surface-border bg-midnight-950 px-2.5 py-1.5 text-slate-200 focus:border-cyan-400 focus:outline-none"
          >
            <option value="All">All KYC</option>
            <option value="Verified">Verified</option>
            <option value="Review">Review</option>
            <option value="Suspicious">Suspicious</option>
          </select>
        </div>

        {/* Network Filter */}
        <div>
          <label className="block text-[10px] uppercase text-slate-400 mb-1">
            Fraud Network
          </label>
          <select
            value={filters.network}
            onChange={(e) => onFilterChange('network', e.target.value)}
            className="w-full rounded-lg border border-surface-border bg-midnight-950 px-2.5 py-1.5 text-slate-200 focus:border-cyan-400 focus:outline-none"
          >
            <option value="All">All Networks</option>
            <option value="Clear">Clear</option>
            <option value="Watch">Watch</option>
            <option value="Connected">Connected</option>
          </select>
        </div>

        {/* Integrity Filter */}
        <div className="col-span-2 sm:col-span-1">
          <label className="block text-[10px] uppercase text-slate-400 mb-1">
            Evidence Ledger
          </label>
          <select
            value={filters.integrity}
            onChange={(e) => onFilterChange('integrity', e.target.value)}
            className="w-full rounded-lg border border-surface-border bg-midnight-950 px-2.5 py-1.5 text-slate-200 focus:border-cyan-400 focus:outline-none"
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
