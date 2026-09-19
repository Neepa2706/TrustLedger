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
    ? 'border-rose-300 bg-rose-50 text-rose-800'
    : isMediumRisk
    ? 'border-amber-300 bg-amber-50 text-amber-800'
    : 'border-emerald-300 bg-emerald-50 text-emerald-800';

  return (
    <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-coffee-200">
      {/* Left: Back button & Title Metadata */}
      <div>
        <button
          onClick={() => navigate('/applications')}
          className="inline-flex items-center gap-1.5 text-xs font-mono text-coffee-700 hover:text-coffee-900 font-medium transition-colors mb-2"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          <span>Back to Applications</span>
        </button>

        <div className="flex items-center gap-3">
          <h1 className="text-2xl font-bold tracking-tight text-espresso font-mono">
            {application.id}
          </h1>
          <span className="text-lg text-stone-700 font-sans font-medium">
            {application.applicant}
          </span>
          <span className="text-xs font-mono text-coffee-800 bg-warm-100 px-2 py-0.5 rounded-lg border border-coffee-200 font-medium">
            {application.loanType || 'Digital Loan Origination'}
          </span>
        </div>

        <p className="text-xs text-stone-500 mt-1 font-mono">
          Submitted {application.submittedAt} • Requested Capital: <span className="text-espresso font-bold">{application.loanAmount}</span>
        </p>
      </div>

      {/* Right: Risk Badge & Start Investigation Toggle */}
      <div className="flex items-center gap-3">
        {/* Overall Risk Callout */}
        <div className={`flex items-center gap-2 rounded-xl border px-3.5 py-2 font-mono shadow-xs ${riskBadgeClass}`}>
          {isHighRisk ? (
            <ShieldAlert className="h-5 w-5 text-rose-700" />
          ) : (
            <ShieldCheck className="h-5 w-5 text-emerald-700" />
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
          className={`inline-flex items-center gap-2 rounded-xl px-4 py-2 text-xs font-mono font-semibold transition-all shadow-sm ${
            isInvestigating
              ? 'bg-emerald-50 text-emerald-800 border border-emerald-300'
              : 'bg-coffee-600 hover:bg-coffee-700 text-white'
          }`}
        >
          {isInvestigating ? (
            <>
              <CheckCircle2 className="h-4 w-4 text-emerald-700" />
              <span>Investigation Active</span>
            </>
          ) : (
            <>
              <Play className="h-4 w-4 fill-white" />
              <span>Start Investigation</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
}
