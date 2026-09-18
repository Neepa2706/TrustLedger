/**
 * TrustLedger DocumentQualityStatus Component
 * Displays visual badges and explanations for document quality checks
 * and prototype document-type consistency heuristics.
 */

import React from 'react';
import { CheckCircle2, AlertTriangle, AlertCircle, ShieldCheck } from 'lucide-react';

export default function DocumentQualityStatus({
  qualityStatus = 'GOOD',
  qualityMessage = 'Document quality looks acceptable.',
  heuristicMatch = 'MATCH',
  heuristicMessage = null,
  isPreVerified = false
}) {
  if (isPreVerified) {
    return (
      <div className="p-2.5 rounded-lg border border-emerald-500/40 bg-emerald-950/20 text-xs text-emerald-200 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0" />
          <span className="font-semibold text-emerald-300">Pre-verified Profile Document</span>
        </div>
        <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-950 text-emerald-300 border border-emerald-500/30">
          Linked from Profile
        </span>
      </div>
    );
  }

  const isError = qualityStatus === 'ERROR';
  const isWarning = qualityStatus === 'WARNING';
  const isGood = qualityStatus === 'GOOD';

  return (
    <div className={`p-3 rounded-lg border text-xs space-y-1.5 ${
      isError
        ? 'border-red-500/40 bg-red-950/30 text-red-200'
        : isWarning
        ? 'border-amber-500/40 bg-amber-950/30 text-amber-200'
        : 'border-emerald-500/40 bg-emerald-950/20 text-emerald-200'
    }`}>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          {isError ? (
            <AlertCircle className="h-4 w-4 text-red-400 shrink-0" />
          ) : isWarning ? (
            <AlertTriangle className="h-4 w-4 text-amber-400 shrink-0" />
          ) : (
            <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0" />
          )}
          <span className="font-semibold">
            {isError ? 'Quality Check Error' : isWarning ? 'Quality Advisory' : 'Quality Check Passed'}
          </span>
        </div>

        <span className={`text-[10px] font-mono px-2 py-0.5 rounded border ${
          isError
            ? 'bg-red-950 text-red-300 border-red-500/40'
            : isWarning
            ? 'bg-amber-950 text-amber-300 border-amber-500/40'
            : 'bg-emerald-950 text-emerald-300 border-emerald-500/40'
        }`}>
          {qualityStatus}
        </span>
      </div>

      <p className="text-[11px] text-slate-300 pl-6 leading-relaxed">
        {qualityMessage}
      </p>

      {heuristicMessage && (
        <div className="pl-6 pt-1 border-t border-surface-border/40 text-[10px] font-mono text-slate-400">
          <span className="text-cyan-300">Type Check: </span>
          {heuristicMessage}
        </div>
      )}
    </div>
  );
}
