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
          <div className="flex items-center gap-2 text-xs font-mono text-coffee-600">
            <span>DEFENSE TELEMETRY</span>
            <span className="text-stone-400">/</span>
            <span className="text-stone-500">INCIDENT DISPATCH</span>
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-espresso mt-1">
            Suspicious Activity & Servicing Alerts
          </h1>
          <p className="text-xs text-stone-500 mt-0.5">
            Automated signals flagging anomalies, cross-application connections, and payment milestones for underwriter review
          </p>
        </div>

        <div className="flex items-center gap-2 font-mono text-xs">
          <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-red-200 bg-red-50 text-red-800 font-medium">
            <span className="h-2 w-2 rounded-full bg-red-500 animate-ping" />
            <span>{highSeverityCount} High Priority</span>
          </span>
          <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-amber-200 bg-amber-50 text-amber-800 font-medium">
            <span>{reviewCount} Under Review</span>
          </span>
        </div>
      </div>

      {/* Neutral Warning Banner */}
      <div className="rounded-xl border border-coffee-200 bg-warm-50 p-4 text-xs font-mono text-stone-700 flex items-start gap-3 shadow-sm">
        <Radio className="h-4 w-4 text-coffee-700 shrink-0 mt-0.5" />
        <div>
          <span className="font-bold text-espresso block mb-0.5">
            Underwriter Investigative Principle:
          </span>
          <span>
            Suspicious activity signals detected across identity tokens, network topologies, or document formatting indicate items requiring investigation. Digital overlaps do not constitute conclusive proof of fraud. Human underwriter discretion is mandatory.
          </span>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="rounded-xl border border-coffee-200 bg-white p-4 flex flex-wrap items-center justify-between gap-4 font-mono text-xs shadow-sm">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-stone-400" />
          <input
            type="text"
            placeholder="Search alerts by signal, application, or source..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full rounded-lg border border-coffee-200 bg-warm-50 py-2 pl-9 pr-4 text-xs text-espresso placeholder-stone-400 focus:border-coffee-500 focus:outline-none"
          />
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-1.5">
            <span className="text-stone-500">Severity:</span>
            {['ALL', 'HIGH', 'REVIEW', 'INFO'].map((sev) => (
              <button
                key={sev}
                onClick={() => setSeverityFilter(sev)}
                className={`px-2.5 py-1 rounded text-[11px] transition-all ${
                  severityFilter === sev
                    ? 'bg-coffee-600 text-white font-semibold shadow-sm'
                    : 'bg-warm-50 text-stone-600 border border-coffee-200 hover:text-espresso hover:bg-warm-100'
                }`}
              >
                {sev}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-1.5">
            <span className="text-stone-500">Category:</span>
            {['ALL', 'SUSPICIOUS_ACTIVITY', 'DOCUMENT_ANOMALY', 'PAYMENT_DUE'].map((cat) => (
              <button
                key={cat}
                onClick={() => setCategoryFilter(cat)}
                className={`px-2.5 py-1 rounded text-[11px] transition-all ${
                  categoryFilter === cat
                    ? 'bg-coffee-600 text-white font-semibold shadow-sm'
                    : 'bg-warm-50 text-stone-600 border border-coffee-200 hover:text-espresso hover:bg-warm-100'
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
          <div className="rounded-xl border border-coffee-200 bg-white p-12 text-center text-stone-500 font-mono text-xs shadow-sm">
            No alerts match current filter criteria.
          </div>
        ) : (
          filteredAlerts.map((alt) => {
            const isHigh = alt.severity === 'HIGH';
            const isReview = alt.severity === 'REVIEW';

            const borderClass = isHigh
              ? 'border-red-200 bg-white shadow-sm hover:border-red-300'
              : isReview
              ? 'border-amber-200 bg-white shadow-sm hover:border-amber-300'
              : 'border-coffee-200 bg-white shadow-sm hover:border-coffee-300';

            const badgeClass = isHigh
              ? 'bg-red-50 text-red-800 border-red-200'
              : isReview
              ? 'bg-amber-50 text-amber-800 border-amber-200'
              : 'bg-warm-100 text-stone-700 border-coffee-200';

            const Icon = isHigh ? ShieldAlert : isReview ? AlertTriangle : Info;

            return (
              <div
                key={alt.id}
                className={`rounded-xl border p-4.5 transition-all ${borderClass}`}
              >
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div className="flex items-start gap-3">
                    <div
                      className={`h-9 w-9 rounded-lg border flex items-center justify-center shrink-0 mt-0.5 ${
                        isHigh
                          ? 'border-red-200 bg-red-50 text-red-600'
                          : isReview
                          ? 'border-amber-200 bg-amber-50 text-amber-600'
                          : 'border-coffee-200 bg-warm-100 text-coffee-700'
                      }`}
                    >
                      <Icon className="h-4 w-4" />
                    </div>

                    <div>
                      <div className="flex flex-wrap items-center gap-2">
                        <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded border ${badgeClass}`}>
                          {alt.severity}
                        </span>
                        <span className="text-xs font-mono text-stone-500 uppercase tracking-wider">
                          {alt.category.replace('_', ' ')}
                        </span>
                        {alt.application_id && (
                          <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-warm-50 text-coffee-800 border border-coffee-200 font-semibold">
                            {alt.application_id}
                          </span>
                        )}
                        <span className="text-[10px] font-mono text-stone-500 flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          <span>{alt.timestamp}</span>
                        </span>
                      </div>

                      <h3 className="text-sm font-semibold text-espresso mt-1.5">
                        {alt.title}
                      </h3>
                      <p className="text-xs text-stone-600 mt-1 leading-relaxed max-w-3xl">
                        {alt.description}
                      </p>

                      <div className="flex items-center gap-3 mt-2 text-[11px] font-mono text-stone-500">
                        <span>Source: <strong className="text-espresso font-semibold">{alt.source}</strong></span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    {alt.action_url && (
                      <button
                        onClick={() => navigate(alt.action_url)}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-coffee-200 bg-warm-50 hover:bg-coffee-600 hover:text-white text-coffee-800 text-xs font-mono font-medium transition-all shadow-sm"
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
