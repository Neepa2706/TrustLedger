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
        <span className="inline-flex items-center gap-1 font-mono text-[11px] text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200 font-medium">
          <span className="h-1.5 w-1.5 rounded-full bg-emerald-600"></span>
          {status}
        </span>
      );
    }

    if (s === 'review' || s === 'watch') {
      return (
        <span className="inline-flex items-center gap-1 font-mono text-[11px] text-amber-800 bg-amber-50 px-2 py-0.5 rounded border border-amber-200 font-medium">
          <span className="h-1.5 w-1.5 rounded-full bg-amber-600"></span>
          {status}
        </span>
      );
    }

    if (s === 'suspicious' || s === 'connected' || s === 'warning') {
      return (
        <span className="inline-flex items-center gap-1 font-mono text-[11px] text-red-700 bg-red-50 px-2 py-0.5 rounded border border-red-200 font-medium">
          <span className="h-1.5 w-1.5 rounded-full bg-red-600 animate-pulse"></span>
          {status}
        </span>
      );
    }

    return (
      <span className="inline-flex items-center gap-1 font-mono text-[11px] text-stone-600 bg-stone-100 px-2 py-0.5 rounded border border-stone-200">
        {status}
      </span>
    );
  };

  const getRiskColor = (level) => {
    const l = String(level || '').toUpperCase();
    if (l === 'HIGH') return 'text-red-700 border-red-200 bg-red-50';
    if (l === 'MEDIUM') return 'text-amber-800 border-amber-200 bg-amber-50';
    return 'text-emerald-700 border-emerald-200 bg-emerald-50';
  };

  if (applications.length === 0) {
    return (
      <div className="rounded-2xl border border-coffee-200 bg-white p-12 text-center shadow-card">
        <div className="h-12 w-12 rounded-full bg-stone-50 border border-coffee-200 flex items-center justify-center mx-auto text-stone-400 mb-3">
          <FileX2 className="h-6 w-6" />
        </div>
        <h3 className="text-sm font-semibold text-espresso">No Matching Applications</h3>
        <p className="text-xs text-stone-600 mt-1 max-w-sm mx-auto">
          No loan applications match your current search criteria or filter combinations.
        </p>
        {onClearFilters && (
          <button
            onClick={onClearFilters}
            className="mt-4 inline-flex items-center gap-1.5 rounded-xl border border-coffee-200 bg-coffee-50 px-3.5 py-1.5 text-xs font-mono text-coffee-800 hover:bg-coffee-100 transition-colors shadow-xs"
          >
            <RotateCcw className="h-3.5 w-3.5 text-coffee-700" />
            <span>Reset All Filters</span>
          </button>
        )}
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-coffee-200 bg-white overflow-hidden shadow-card">
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs">
          <thead>
            <tr className="border-b border-coffee-100 bg-stone-50/80 text-[11px] font-mono uppercase text-stone-500">
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
          <tbody className="divide-y divide-coffee-100 font-mono">
            {applications.map((app) => (
              <tr
                key={app.id}
                onClick={() => navigate(`/applications/${app.id}`)}
                className="group cursor-pointer hover:bg-stone-50 transition-colors"
              >
                {/* Application ID */}
                <td className="py-3.5 pl-4 font-semibold text-coffee-700 group-hover:text-coffee-900">
                  {app.id}
                </td>

                {/* Applicant */}
                <td className="py-3.5 font-sans font-medium text-espresso">
                  <div>{app.applicant}</div>
                  <div className="text-[10px] font-mono text-stone-500 mt-0.5">{app.loanAmount}</div>
                </td>

                {/* Submitted */}
                <td className="py-3.5 text-stone-500 text-[11px]">
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
                    <span className="font-bold text-espresso">
                      {app.riskScore}%
                    </span>
                    <span className={`px-1.5 py-0.5 text-[10px] font-bold rounded border ${getRiskColor(app.riskLevel)}`}>
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
                    className="inline-flex items-center gap-1 rounded-lg border border-coffee-200 bg-coffee-50 px-2.5 py-1 text-[11px] font-mono font-medium text-coffee-800 hover:bg-coffee-100 transition-all shadow-xs"
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
