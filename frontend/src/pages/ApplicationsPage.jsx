import React, { useState, useEffect, useMemo } from 'react';
import { DownloadCloud, X } from 'lucide-react';
import ApplicationSummaryCards from '../components/applications/ApplicationSummaryCards';
import ApplicationFilters from '../components/applications/ApplicationFilters';
import ApplicationTable from '../components/applications/ApplicationTable';
import { applicationsList, applicationsSummaryStats } from '../data/applicationsData';
import loanService from '../services/loanService';

export default function ApplicationsPage() {
  const [liveApplications, setLiveApplications] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({
    risk: 'All',
    document: 'All',
    kyc: 'All',
    network: 'All',
    integrity: 'All'
  });
  const [toastMessage, setToastMessage] = useState('');

  // Fetch live applications from backend
  useEffect(() => {
    let isMounted = true;
    const fetchQueue = async () => {
      try {
        const apps = await loanService.getLenderApplications('ALL');
        if (isMounted && Array.isArray(apps) && apps.length > 0) {
          setLiveApplications(apps);
        }
      } catch {
        // Backend fallback
      }
    };
    fetchQueue();
    return () => {
      isMounted = false;
    };
  }, []);

  // Merge live applications with existing mock list
  const combinedApplications = useMemo(() => {
    if (!liveApplications || liveApplications.length === 0) {
      return applicationsList;
    }

    const liveIds = new Set(liveApplications.map((a) => a.id));
    const nonDuplicatedMock = applicationsList.filter((a) => !liveIds.has(a.id));

    // Live apps first, followed by remaining baseline mock applications
    return [...liveApplications, ...nonDuplicatedMock];
  }, [liveApplications]);

  // Compute live summary stats
  const computedStats = useMemo(() => {
    const total = combinedApplications.length;
    const highRisk = combinedApplications.filter(
      (a) => String(a.riskLevel || '').toUpperCase() === 'HIGH'
    ).length;
    const needsReview = combinedApplications.filter(
      (a) => String(a.documentStatus || '').toLowerCase() === 'review' || String(a.status || '').toLowerCase() === 'needs review'
    ).length;
    const verified = combinedApplications.filter(
      (a) => String(a.integrityStatus || '').toLowerCase() === 'verified' && String(a.kycStatus || '').toLowerCase() === 'verified'
    ).length;

    return {
      total: Math.max(total, applicationsSummaryStats.total),
      highRisk: Math.max(highRisk, applicationsSummaryStats.highRisk),
      needsReview: Math.max(needsReview, applicationsSummaryStats.needsReview),
      verified: Math.max(verified, applicationsSummaryStats.verified)
    };
  }, [combinedApplications]);

  const handleExportClick = () => {
    setToastMessage('Report export will be connected in a later phase.');
    setTimeout(() => setToastMessage(''), 3500);
  };

  const handleFilterChange = (key, value) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  const handleClearFilters = () => {
    setSearchTerm('');
    setFilters({
      risk: 'All',
      document: 'All',
      kyc: 'All',
      network: 'All',
      integrity: 'All'
    });
  };

  const hasActiveFilters = useMemo(() => {
    return (
      searchTerm.trim() !== '' ||
      filters.risk !== 'All' ||
      filters.document !== 'All' ||
      filters.kyc !== 'All' ||
      filters.network !== 'All' ||
      filters.integrity !== 'All'
    );
  }, [searchTerm, filters]);

  // Filter application items based on search and selected dropdowns
  const filteredApplications = useMemo(() => {
    return combinedApplications.filter((app) => {
      // Search matching ID or applicant name
      if (searchTerm.trim()) {
        const query = searchTerm.toLowerCase();
        const matchesId = (app.id || '').toLowerCase().includes(query);
        const matchesName = (app.applicant || '').toLowerCase().includes(query);
        if (!matchesId && !matchesName) return false;
      }

      // Risk filter
      if (filters.risk !== 'All') {
        if (String(app.riskLevel || '').toUpperCase() !== filters.risk.toUpperCase()) return false;
      }

      // Document filter
      if (filters.document !== 'All') {
        if (String(app.documentStatus || '').toLowerCase() !== filters.document.toLowerCase()) return false;
      }

      // KYC filter
      if (filters.kyc !== 'All') {
        if (String(app.kycStatus || '').toLowerCase() !== filters.kyc.toLowerCase()) return false;
      }

      // Network filter
      if (filters.network !== 'All') {
        if (String(app.networkStatus || '').toLowerCase() !== filters.network.toLowerCase()) return false;
      }

      // Integrity filter
      if (filters.integrity !== 'All') {
        if (String(app.integrityStatus || '').toLowerCase() !== filters.integrity.toLowerCase()) return false;
      }

      return true;
    });
  }, [combinedApplications, searchTerm, filters]);

  return (
    <div className="space-y-6">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-3 rounded-lg border border-coffee-300 bg-espresso text-white px-4 py-3 text-xs font-mono shadow-2xl animate-fadeIn">
          <span>{toastMessage}</span>
          <button
            onClick={() => setToastMessage('')}
            className="text-warm-200 hover:text-white"
            aria-label="Dismiss toast"
          >
            <X className="h-3.5 w-3.5" />
          </button>
        </div>
      )}

      {/* Page Header */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono text-coffee-600">
            <span>TRIAGE COMMAND</span>
            <span className="text-stone-400">/</span>
            <span className="text-stone-500">ORIGINATION PIPELINE</span>
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-espresso mt-1">
            Loan Applications
          </h1>
          <p className="text-xs text-stone-500 mt-0.5">
            Review lending applications and investigate suspicious digital evidence.
          </p>
        </div>

        <div>
          <button
            onClick={handleExportClick}
            className="inline-flex items-center gap-2 rounded-lg border border-coffee-200 bg-white hover:bg-warm-50 hover:border-coffee-300 px-4 py-2 text-xs font-mono font-medium text-stone-700 transition-colors shadow-sm"
          >
            <DownloadCloud className="h-4 w-4 text-coffee-600" />
            <span>Export Report</span>
          </button>
        </div>
      </div>

      {/* 4 Summary KPI Cards */}
      <ApplicationSummaryCards stats={computedStats} />

      {/* Search and Multi-Filter Bar */}
      <ApplicationFilters
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        filters={filters}
        onFilterChange={handleFilterChange}
        onClearFilters={handleClearFilters}
        hasActiveFilters={hasActiveFilters}
      />

      {/* Application Table */}
      <ApplicationTable
        applications={filteredApplications}
        onClearFilters={handleClearFilters}
      />
    </div>
  );
}
