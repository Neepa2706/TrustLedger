import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Eye, ArrowRight, ShieldCheck, ShieldAlert, AlertTriangle, FileX2, RotateCcw } from 'lucide-react';
import StatusBadge from '../ui/StatusBadge';

export default function ApplicationTable({ applications = [], onClearFilters }) {
  const navigate = useNavigate();

  const getPill = (status, type) => {
    const s = String(status || '').toLowerCase();

    if (s === 'verified' || s === 'clear') {
      return (
        <span className="inline-flex items-center gap-1 font-mono text-[11px] text-emerald-400 bg-emerald-950/40 px-2 py-0.5 rounded border border-emerald-500/30">
          <span className="h-1.5 w-1.5 rounded-full bg-emerald-400"></span>
          {status}
        </span>
      );
    }

    if (s === 'review' || s === 'watch') {
      return (
        <span className="inline-flex items-center gap-1 font-mono text-[11px] text-amber-400 bg-amber-950/40 px-2 py-0.5 rounded border border-amber-500/30">
          <span className="h-1.5 w-1.5 rounded-full bg-amber-400"></span>
          {status}
        </span>
      );
    }

    if (s === 'suspicious' || s === 'connected' || s === 'warning') {
      return (
        <span className="inline-flex items-center gap-1 font-mono text-[11px] text-red-400 bg-red-950/40 px-2 py-0.5 rounded border border-red-500/30">
          <span className="h-1.5 w-1.5 rounded-full bg-red-400 animate-pulse"></span>
          {status}
        </span>
      );
    }

    return (
      <span className="inline-flex items-center gap-1 font-mono text-[11px] text-slate-400 bg-midnight-950 px-2 py-0.5 rounded border border-surface-border">
        {status}
      </span>
    );
  };

  const getRiskColor = (level) => {
    const l = String(level || '').toUpperCase();
    if (l === 'HIGH') return 'text-red-400 border-red-500/40 bg-red-950/40';
    if (l === 'MEDIUM') return 'text-amber-400 border-amber-500/40 bg-amber-950/40';
    return 'text-emerald-400 border-emerald-500/40 bg-emerald-950/40';
  };

  if (applications.length === 0) {
    return (
      <div className="rounded-xl border border-surface-border bg-surface-card/80 p-12 text-center backdrop-blur-sm">
        <div className="h-12 w-12 rounded-full bg-midnight-950 border border-surface-border flex items-center justify-center mx-auto text-slate-500 mb-3">
          <FileX2 className="h-6 w-6" />
        </div>
        <h3 className="text-sm font-semibold text-white">No Matching Applications</h3>
        <p className="text-xs text-slate-400 mt-1 max-w-sm mx-auto">
          No loan applications match your current search criteria or filter combinations.
        </p>
        {onClearFilters && (
          <button
            onClick={onClearFilters}
            className="mt-4 inline-flex items-center gap-1.5 rounded-lg border border-cyan-500/30 bg-cyan-950/30 px-3.5 py-1.5 text-xs font-mono text-cyan-300 hover:bg-cyan-950/60 transition-colors"
          >
            <RotateCcw className="h-3.5 w-3.5 text-cyan-400" />
            <span>Reset All Filters</span>
          </button>
        )}
      </div>
    );
  }

  return (
    <div className="rounded-xl border border-surface-border bg-surface-card/80 backdrop-blur-sm overflow-hidden shadow-card">
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs">
          <thead>
            <tr className="border-b border-surface-border bg-midnight-950/60 text-[11px] font-mono uppercase text-slate-400">
              <th className="py-3 pl-4">Application</th>
              <th className="py-3">Applicant</th>
              <th className="py-3">Submitted</th>
              <th className="py-3">Document</th>
              <th className="py-3">KYC</th>
              <th className="py-3">Network</th>
              <th className="py-3">Integrity</th>
              <th className="py-3">Risk</th>
              <th className="py-3">Status</th>
              <th className="py-3 pr-4 text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/60 font-mono">
            {applications.map((app) => (
              <tr
                key={app.id}
                onClick={() => navigate(`/applications/${app.id}`)}
                className="group cursor-pointer hover:bg-cyan-950/15 transition-colors"
              >
                {/* Application ID */}
                <td className="py-3.5 pl-4 font-semibold text-cyan-300 group-hover:text-cyan-200">
                  {app.id}
                </td>

                {/* Applicant */}
                <td className="py-3.5 font-sans font-medium text-white group-hover:text-cyan-100">
                  <div>{app.applicant}</div>
                  <div className="text-[10px] font-mono text-slate-400 mt-0.5">{app.loanAmount}</div>
                </td>

                {/* Submitted */}
                <td className="py-3.5 text-slate-400 text-[11px]">
                  {app.submittedAt}
                </td>

                {/* Document */}
                <td className="py-3.5">
                  {getPill(app.documentStatus, 'doc')}
                </td>

                {/* KYC */}
                <td className="py-3.5">
                  {getPill(app.kycStatus, 'kyc')}
                </td>

                {/* Network */}
                <td className="py-3.5">
                  {getPill(app.networkStatus, 'net')}
                </td>

                {/* Integrity */}
                <td className="py-3.5">
                  {getPill(app.integrityStatus, 'int')}
                </td>

                {/* Risk */}
                <td className="py-3.5">
                  <div className="flex items-center gap-1.5">
                    <span className="font-bold text-white">
                      {app.riskScore}%
                    </span>
                    <span className={`px-1.5 py-0.2 text-[10px] font-bold rounded border ${getRiskColor(app.riskLevel)}`}>
                      {app.riskLevel}
                    </span>
                  </div>
                </td>

                {/* Status */}
                <td className="py-3.5">
                  <StatusBadge
                    status={app.status === 'Investigate' ? 'FLAGGED' : app.status === 'Needs Review' ? 'UNDER REVIEW' : 'VERIFIED'}
                    customLabel={app.status}
                    size="sm"
                  />
                </td>

                {/* Action Button */}
                <td className="py-3.5 pr-4 text-right">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      navigate(`/applications/${app.id}`);
                    }}
                    className="inline-flex items-center gap-1 rounded-md border border-cyan-500/30 bg-cyan-950/30 px-2.5 py-1 text-[11px] font-mono font-medium text-cyan-300 hover:bg-cyan-950/70 hover:border-cyan-400 transition-all"
                  >
                    <span>View Investigation</span>
                    <ArrowRight className="h-3 w-3" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
