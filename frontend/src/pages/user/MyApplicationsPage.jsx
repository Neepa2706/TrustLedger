/**
 * TrustLedger MyApplicationsPage (/my-applications)
 * Authenticated borrower's list of loan applications:
 * - Application ID, Product name, Amount, Duration, Date, Status
 * - Status filter tabs (All, Submitted, Draft, Review)
 * - "View Application" link to /my-applications/:applicationId
 * - Option to continue drafts via /loans/:loanId/apply?appId=...
 */

import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  FileText,
  Clock,
  CheckCircle2,
  AlertCircle,
  ArrowRight,
  Plus,
  Loader2,
  Search,
  Filter,
  CreditCard,
  Building,
  ShieldCheck
} from 'lucide-react';

import SingleAccountNotice from '../../components/user/SingleAccountNotice';
import { useUserAuth } from '../../context/UserAuthContext';
import loanService from '../../services/loanService';

export default function MyApplicationsPage() {
  const { user } = useUserAuth();
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState('ALL');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    let isMounted = true;
    const targetUserId = user?.id || 'usr_demo_arjun';
    setLoading(true);
    loanService.getUserApplications(targetUserId)
      .then(async (apps) => {
        if (isMounted) {
          let list = apps || [];
          if (list.length === 0) {
            try {
              const demoApp = await loanService.getApplicationById('TL-APP-10001', 'usr_demo_arjun');
              if (demoApp) list = [demoApp];
            } catch {
              // fallback
            }
          }
          setApplications(list);
        }
      })
      .catch(() => {
        // Fallback handled inside loanService
      })
      .finally(() => {
        if (isMounted) setLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, [user?.id]);

  const filteredApps = applications.filter((app) => {
    const matchesFilter =
      filterStatus === 'ALL' ||
      (filterStatus === 'SUBMITTED' && app.application_status === 'SUBMITTED') ||
      (filterStatus === 'DRAFT' && app.application_status === 'DRAFT') ||
      (filterStatus === 'REVIEW' && (app.application_status === 'READY_FOR_REVIEW' || app.application_status === 'UNDER_REVIEW')) ||
      (filterStatus === 'APPROVED' && app.application_status === 'APPROVED') ||
      (filterStatus === 'ACTION' && app.application_status === 'ACTION_REQUIRED') ||
      (filterStatus === 'REJECTED' && app.application_status === 'REJECTED');

    const q = searchQuery.toLowerCase();
    const matchesSearch =
      !q ||
      app.application_id?.toLowerCase().includes(q) ||
      app.loan_product_name?.toLowerCase().includes(q) ||
      app.loan_purpose?.toLowerCase().includes(q);

    return matchesFilter && matchesSearch;
  });

  const getStatusBadge = (status) => {
    switch (status) {
      case 'SUBMITTED':
        return (
          <span className="inline-flex items-center gap-1 text-[10px] font-mono px-2.5 py-1 rounded-full bg-emerald-950 text-emerald-300 border border-emerald-500/40 font-bold">
            <CheckCircle2 className="h-3 w-3" /> SUBMITTED
          </span>
        );
      case 'UNDER_REVIEW':
      case 'READY_FOR_REVIEW':
        return (
          <span className="inline-flex items-center gap-1 text-[10px] font-mono px-2.5 py-1 rounded-full bg-cyan-950 text-cyan-300 border border-cyan-500/40 font-bold">
            <Clock className="h-3 w-3" /> UNDER REVIEW
          </span>
        );
      case 'APPROVED':
        return (
          <span className="inline-flex items-center gap-1 text-[10px] font-mono px-2.5 py-1 rounded-full bg-emerald-950 text-emerald-300 border border-emerald-500/40 font-bold">
            <ShieldCheck className="h-3 w-3" /> APPROVED
          </span>
        );
      case 'ACTION_REQUIRED':
        return (
          <span className="inline-flex items-center gap-1 text-[10px] font-mono px-2.5 py-1 rounded-full bg-amber-950 text-amber-300 border border-amber-500/40 font-bold">
            <AlertCircle className="h-3 w-3" /> ACTION REQUIRED
          </span>
        );
      case 'REJECTED':
        return (
          <span className="inline-flex items-center gap-1 text-[10px] font-mono px-2.5 py-1 rounded-full bg-rose-950 text-rose-300 border border-rose-500/40 font-bold">
            <AlertCircle className="h-3 w-3" /> NOT APPROVED
          </span>
        );
      case 'DRAFT':
      default:
        return (
          <span className="inline-flex items-center gap-1 text-[10px] font-mono px-2.5 py-1 rounded-full bg-slate-800 text-slate-300 border border-surface-border font-bold">
            <Clock className="h-3 w-3" /> DRAFT
          </span>
        );
    }
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6 pb-12">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono uppercase tracking-wider text-cyan-400 font-semibold">
              Borrower Portfolio
            </span>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-surface-border text-slate-400">
              {applications.length} Applications
            </span>
          </div>
          <h1 className="text-2xl font-extrabold text-white tracking-tight mt-1">
            My Applications
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Track and manage your loan applications under your verified account
          </p>
        </div>

        <Link
          to="/loans"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 font-semibold text-xs text-midnight-950 uppercase tracking-wider shadow-[0_0_20px_rgba(0,240,255,0.25)] shrink-0 self-start sm:self-auto"
        >
          <Plus className="h-4 w-4" />
          <span>Apply for New Loan</span>
        </Link>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 p-3 rounded-2xl border border-surface-border bg-surface-card">
        {/* Filter Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto pb-1 sm:pb-0">
          {[
            { id: 'ALL', label: 'All' },
            { id: 'SUBMITTED', label: 'Submitted' },
            { id: 'REVIEW', label: 'In Review' },
            { id: 'APPROVED', label: 'Approved' },
            { id: 'ACTION', label: 'Action Required' },
            { id: 'REJECTED', label: 'Not Approved' },
            { id: 'DRAFT', label: 'Drafts' }
          ].map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setFilterStatus(tab.id)}
              className={`px-3 py-1.5 rounded-xl text-xs font-mono transition-all whitespace-nowrap ${
                filterStatus === tab.id
                  ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 font-semibold'
                  : 'text-slate-400 hover:text-white border border-transparent'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Search Input */}
        <div className="relative w-full sm:w-64">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-500" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by ID or loan name..."
            className="w-full pl-9 pr-3 py-1.5 rounded-xl border border-surface-border bg-midnight-950 text-xs text-white placeholder-slate-500 focus:border-cyan-400 focus:outline-none"
          />
        </div>
      </div>

      {/* Applications List */}
      {loading ? (
        <div className="flex flex-col items-center justify-center py-16 space-y-3">
          <Loader2 className="h-7 w-7 text-cyan-400 animate-spin" />
          <span className="text-xs font-mono text-slate-400">Loading your applications...</span>
        </div>
      ) : filteredApps.length === 0 ? (
        <div className="p-10 rounded-2xl border border-surface-border bg-surface-card text-center space-y-4">
          <div className="w-14 h-14 rounded-2xl bg-midnight-950 border border-surface-border text-slate-500 flex items-center justify-center mx-auto">
            <FileText className="h-7 w-7" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-white">No applications found</h3>
            <p className="text-xs text-slate-400 mt-1 max-w-sm mx-auto">
              {searchQuery || filterStatus !== 'ALL'
                ? 'Try clearing your search query or switching filters.'
                : "You haven't submitted any loan applications yet. Explore available loans in the marketplace."}
            </p>
          </div>
          <Link
            to="/loans"
            className="inline-block px-5 py-2 rounded-xl bg-midnight-900 border border-surface-border text-xs text-cyan-400 font-mono"
          >
            Explore Loan Marketplace
          </Link>
        </div>
      ) : (
        <div className="space-y-3.5">
          {filteredApps.map((app) => {
            const isSub = app.application_status === 'SUBMITTED';
            const dateStr = app.submitted_at || app.updated_at || app.created_at;

            return (
              <div
                key={app.application_id}
                className="rounded-2xl border border-surface-border bg-surface-card hover:border-cyan-500/40 p-5 sm:p-6 transition-all space-y-4 shadow-sm"
              >
                {/* Top Row: App ID, Category, Status Badge */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-surface-border">
                  <div className="flex items-center gap-3">
                    <span className="font-mono text-xs font-bold text-cyan-400">
                      {app.application_id}
                    </span>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-surface-border text-slate-300">
                      {app.loan_category || 'Personal'}
                    </span>
                  </div>

                  <div>{getStatusBadge(app.application_status)}</div>
                </div>

                {/* Middle Grid: Name, Amount, Duration, EMI */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                  <div>
                    <span className="text-[10px] font-mono uppercase text-slate-400 block mb-0.5">Loan Product</span>
                    <span className="font-bold text-white truncate block">{app.loan_product_name}</span>
                  </div>

                  <div>
                    <span className="text-[10px] font-mono uppercase text-slate-400 block mb-0.5">Sanction Requested</span>
                    <span className="font-mono font-bold text-cyan-300">
                      ₹{app.requested_amount?.toLocaleString('en-IN')}
                    </span>
                  </div>

                  <div>
                    <span className="text-[10px] font-mono uppercase text-slate-400 block mb-0.5">Duration</span>
                    <span className="font-mono text-white">
                      {app.requested_duration_months} Months
                    </span>
                  </div>

                  <div>
                    <span className="text-[10px] font-mono uppercase text-slate-400 block mb-0.5">Estimated EMI</span>
                    <span className="font-mono text-white">
                      ₹{app.estimated_emi?.toLocaleString('en-IN')} / mo
                    </span>
                  </div>
                </div>

                {/* Bottom Row: Date & Action Link */}
                <div className="flex items-center justify-between pt-3 border-t border-surface-border text-xs">
                  <span className="text-[11px] text-slate-400 font-mono">
                    {isSub ? 'Submitted: ' : 'Updated: '}
                    {dateStr ? new Date(dateStr).toLocaleDateString('en-IN', {
                      day: 'numeric',
                      month: 'short',
                      year: 'numeric'
                    }) : 'Recent'}
                  </span>

                  {isSub ? (
                    <Link
                      to={`/my-applications/${app.application_id}`}
                      className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-lg bg-cyan-500/15 hover:bg-cyan-500/25 text-cyan-300 text-xs font-mono font-semibold transition"
                    >
                      <span>View Application</span>
                      <ArrowRight className="h-3.5 w-3.5" />
                    </Link>
                  ) : (
                    <Link
                      to={`/loans/${app.loan_product_id}/apply?appId=${app.application_id}&step=${app.current_step || 2}`}
                      className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-lg bg-gradient-to-r from-cyan-500 to-blue-600 text-midnight-950 text-xs font-semibold uppercase tracking-wider transition"
                    >
                      <span>Continue Draft</span>
                      <ArrowRight className="h-3.5 w-3.5" />
                    </Link>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Single Account Notice Banner */}
      <SingleAccountNotice variant="banner" />
    </div>
  );
}
