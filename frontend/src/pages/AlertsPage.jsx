import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  BellRing,
  ShieldAlert,
  AlertTriangle,
  Info,
  CheckCircle2,
  Filter,
  Search,
  ArrowRight,
  ExternalLink,
  Clock,
  Radio,
  X,
  FileCheck2
} from 'lucide-react';
import Button from '../components/common/Button';
import loanService from '../services/loanService';

export default function AlertsPage() {
  const navigate = useNavigate();
  const [alerts, setAlerts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [severityFilter, setSeverityFilter] = useState('ALL');
  const [categoryFilter, setCategoryFilter] = useState('ALL');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedAlert, setSelectedAlert] = useState(null);

  useEffect(() => {
    let isMounted = true;
    const fetchAlerts = async () => {
      try {
        const data = await loanService.getAlerts();
        if (isMounted && Array.isArray(data)) {
          setAlerts(data);
        }
      } catch (err) {
        console.error('Failed to fetch alerts:', err);
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchAlerts();
    return () => { isMounted = false; };
  }, []);

  const filteredAlerts = alerts.filter((a) => {
    const matchesSev =
      severityFilter === 'ALL' || a.severity?.toUpperCase() === severityFilter.toUpperCase();
    const matchesCat =
      categoryFilter === 'ALL' || a.category?.toUpperCase() === categoryFilter.toUpperCase();
    const query = searchTerm.toLowerCase();
    const matchesSearch =
      !searchTerm.trim() ||
      a.title?.toLowerCase().includes(query) ||
      a.description?.toLowerCase().includes(query) ||
      a.source?.toLowerCase().includes(query) ||
      (a.application_id && a.application_id.toLowerCase().includes(query));
    return matchesSev && matchesCat && matchesSearch;
  });

  const highSeverityCount = alerts.filter((a) => a.severity === 'HIGH').length;
  const reviewCount = alerts.filter((a) => a.severity === 'REVIEW').length;
  const infoCount = alerts.filter((a) => a.severity === 'INFO').length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono text-cyan-400">
            <span>DEFENSE TELEMETRY</span>
            <span>/</span>
            <span className="text-slate-400">INCIDENT DISPATCH</span>
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-white mt-1">
            Suspicious Activity & Servicing Alerts
          </h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Automated signals flagging anomalies, cross-application connections, and payment milestones for underwriter review
          </p>
        </div>

        <div className="flex items-center gap-2 font-mono text-xs">
          <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-red-500/40 bg-red-950/40 text-red-300">
            <span className="h-2 w-2 rounded-full bg-red-400 animate-ping" />
            <span>{highSeverityCount} High Priority</span>
          </span>
          <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-amber-500/40 bg-amber-950/40 text-amber-300">
            <span>{reviewCount} Under Review</span>
          </span>
        </div>
      </div>

      {/* Neutral Warning Banner */}
      <div className="rounded-xl border border-cyan-500/30 bg-midnight-900/90 p-4 text-xs font-mono text-slate-300 flex items-start gap-3">
        <Radio className="h-4 w-4 text-cyan-400 shrink-0 mt-0.5" />
        <div>
          <span className="font-bold text-cyan-300 block mb-0.5">
            Underwriter Investigative Principle:
          </span>
          <span>
            Suspicious activity signals detected across identity tokens, network topologies, or document formatting indicate items requiring investigation. Digital overlaps do not constitute conclusive proof of fraud. Human underwriter discretion is mandatory.
          </span>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="rounded-xl border border-surface-border bg-surface-card p-4 flex flex-wrap items-center justify-between gap-4 font-mono text-xs">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
          <input
            type="text"
            placeholder="Search alerts by signal, application, or source..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full rounded-lg border border-surface-border bg-midnight-950 py-2 pl-9 pr-4 text-xs text-white placeholder-slate-500 focus:border-cyan-400 focus:outline-none"
          />
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-1.5">
            <span className="text-slate-400">Severity:</span>
            {['ALL', 'HIGH', 'REVIEW', 'INFO'].map((sev) => (
              <button
                key={sev}
                onClick={() => setSeverityFilter(sev)}
                className={`px-2.5 py-1 rounded text-[11px] transition-all ${
                  severityFilter === sev
                    ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 font-bold'
                    : 'bg-midnight-950 text-slate-400 border border-surface-border hover:text-white'
                }`}
              >
                {sev}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-1.5">
            <span className="text-slate-400">Category:</span>
            {['ALL', 'SUSPICIOUS_ACTIVITY', 'DOCUMENT_ANOMALY', 'PAYMENT_DUE'].map((cat) => (
              <button
                key={cat}
                onClick={() => setCategoryFilter(cat)}
                className={`px-2.5 py-1 rounded text-[11px] transition-all ${
                  categoryFilter === cat
                    ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 font-bold'
                    : 'bg-midnight-950 text-slate-400 border border-surface-border hover:text-white'
                }`}
              >
                {cat.replace('_', ' ')}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Alerts Feed */}
      <div className="space-y-3">
        {filteredAlerts.length === 0 ? (
          <div className="rounded-xl border border-surface-border bg-surface-card p-12 text-center text-slate-500 font-mono text-xs">
            No alerts match current filter criteria.
          </div>
        ) : (
          filteredAlerts.map((alt) => {
            const isHigh = alt.severity === 'HIGH';
            const isReview = alt.severity === 'REVIEW';

            const borderClass = isHigh
              ? 'border-red-500/40 bg-gradient-to-r from-red-950/30 to-surface-card'
              : isReview
              ? 'border-amber-500/40 bg-gradient-to-r from-amber-950/20 to-surface-card'
              : 'border-surface-border bg-surface-card';

            const badgeClass = isHigh
              ? 'bg-red-950 text-red-300 border-red-500/40'
              : isReview
              ? 'bg-amber-950 text-amber-300 border-amber-500/40'
              : 'bg-midnight-950 text-cyan-300 border-cyan-500/40';

            const Icon = isHigh ? ShieldAlert : isReview ? AlertTriangle : Info;

            return (
              <div
                key={alt.id}
                className={`rounded-xl border p-4.5 transition-all hover:border-slate-500/60 ${borderClass}`}
              >
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div className="flex items-start gap-3">
                    <div
                      className={`h-9 w-9 rounded-lg border flex items-center justify-center shrink-0 mt-0.5 ${
                        isHigh
                          ? 'border-red-500/40 bg-red-950/60 text-red-400'
                          : isReview
                          ? 'border-amber-500/40 bg-amber-950/60 text-amber-400'
                          : 'border-cyan-500/40 bg-cyan-950/60 text-cyan-400'
                      }`}
                    >
                      <Icon className="h-4 w-4" />
                    </div>

                    <div>
                      <div className="flex flex-wrap items-center gap-2">
                        <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded border ${badgeClass}`}>
                          {alt.severity}
                        </span>
                        <span className="text-xs font-mono text-slate-400 uppercase tracking-wider">
                          {alt.category.replace('_', ' ')}
                        </span>
                        {alt.application_id && (
                          <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-midnight-950 text-cyan-300 border border-slate-700">
                            {alt.application_id}
                          </span>
                        )}
                        <span className="text-[10px] font-mono text-slate-500 flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          <span>{alt.timestamp}</span>
                        </span>
                      </div>

                      <h3 className="text-sm font-semibold text-white mt-1.5">
                        {alt.title}
                      </h3>
                      <p className="text-xs text-slate-300 mt-1 leading-relaxed max-w-3xl">
                        {alt.description}
                      </p>

                      <div className="flex items-center gap-3 mt-2 text-[11px] font-mono text-slate-400">
                        <span>Source: <strong className="text-slate-200">{alt.source}</strong></span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    {alt.action_url && (
                      <button
                        onClick={() => navigate(alt.action_url)}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-cyan-500/40 bg-cyan-950/40 hover:bg-cyan-950/80 text-cyan-300 text-xs font-mono transition-colors"
                      >
                        <span>Investigate</span>
                        <ArrowRight className="h-3.5 w-3.5" />
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
