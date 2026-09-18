import React from 'react';
import { ArrowLeft, ShieldAlert, ShieldCheck, Play, CheckCircle2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function InvestigationHeader({
  application,
  isInvestigating,
  onToggleInvestigate
}) {
  const navigate = useNavigate();

  const isHighRisk = application.riskScore > 65;
  const isMediumRisk = application.riskScore > 35 && application.riskScore <= 65;

  const riskBadgeClass = isHighRisk
    ? 'border-red-500/40 bg-red-950/40 text-red-400'
    : isMediumRisk
    ? 'border-amber-500/40 bg-amber-950/40 text-amber-400'
    : 'border-emerald-500/40 bg-emerald-950/40 text-emerald-400';

  return (
    <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-surface-border">
      {/* Left: Back button & Title Metadata */}
      <div>
        <button
          onClick={() => navigate('/applications')}
          className="inline-flex items-center gap-1.5 text-xs font-mono text-cyan-400 hover:text-cyan-300 transition-colors mb-2"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          <span>Back to Applications</span>
        </button>

        <div className="flex items-center gap-3">
          <h1 className="text-2xl font-bold tracking-tight text-white font-mono">
            {application.id}
          </h1>
          <span className="text-lg text-slate-300 font-sans font-medium">
            {application.applicant}
          </span>
          <span className="text-xs font-mono text-slate-400 bg-midnight-950 px-2 py-0.5 rounded border border-surface-border">
            {application.loanType || 'Digital Loan Origination'}
          </span>
        </div>

        <p className="text-xs text-slate-400 mt-1 font-mono">
          Submitted {application.submittedAt} • Requested Capital: <span className="text-slate-200 font-semibold">{application.loanAmount}</span>
        </p>
      </div>

      {/* Right: Risk Badge & Start Investigation Toggle */}
      <div className="flex items-center gap-3">
        {/* Overall Risk Callout */}
        <div className={`flex items-center gap-2 rounded-xl border px-3.5 py-2 font-mono ${riskBadgeClass}`}>
          {isHighRisk ? (
            <ShieldAlert className="h-5 w-5 text-red-400" />
          ) : (
            <ShieldCheck className="h-5 w-5 text-emerald-400" />
          )}
          <div>
            <div className="text-sm font-bold leading-none">
              {application.riskScore}%
            </div>
            <div className="text-[10px] uppercase font-semibold opacity-90 mt-0.5">
              {application.riskLevel} RISK
            </div>
          </div>
        </div>

        {/* Start / Active Investigation Action Button */}
        <button
          onClick={onToggleInvestigate}
          className={`inline-flex items-center gap-2 rounded-lg px-4 py-2 text-xs font-mono font-semibold transition-all ${
            isInvestigating
              ? 'bg-emerald-950/60 text-emerald-300 border border-emerald-500/40 shadow-[0_0_15px_rgba(16,185,129,0.25)]'
              : 'bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-midnight-950 shadow-[0_0_15px_rgba(0,240,255,0.25)]'
          }`}
        >
          {isInvestigating ? (
            <>
              <CheckCircle2 className="h-4 w-4 text-emerald-400" />
              <span>Investigation Active</span>
            </>
          ) : (
            <>
              <Play className="h-4 w-4 fill-midnight-950" />
              <span>Start Investigation</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
}
