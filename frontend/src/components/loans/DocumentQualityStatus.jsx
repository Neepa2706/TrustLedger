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
      <div className="p-2.5 rounded-lg border border-emerald-200 bg-emerald-50 text-xs text-emerald-800 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />
          <span className="font-semibold text-emerald-900">Pre-verified Profile Document</span>
        </div>
        <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-white text-emerald-800 border border-emerald-200 font-medium">
          Linked from Profile
        </span>
      </div>
    );
  }

  const isError = qualityStatus === 'ERROR';
  const isWarning = qualityStatus === 'WARNING';
  const isGood = qualityStatus === 'GOOD';

  return (
    <div className={`p-3 rounded-lg border text-xs space-y-1.5 shadow-sm ${
      isError
        ? 'border-red-200 bg-red-50 text-red-800'
        : isWarning
        ? 'border-amber-200 bg-amber-50 text-amber-800'
        : 'border-emerald-200 bg-emerald-50 text-emerald-800'
    }`}>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          {isError ? (
            <AlertCircle className="h-4 w-4 text-red-600 shrink-0" />
          ) : isWarning ? (
            <AlertTriangle className="h-4 w-4 text-amber-600 shrink-0" />
          ) : (
            <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />
          )}
          <span className="font-semibold">
            {isError ? 'Quality Check Error' : isWarning ? 'Quality Advisory' : 'Quality Check Passed'}
          </span>
        </div>

        <span className={`text-[10px] font-mono px-2 py-0.5 rounded border font-semibold ${
          isError
            ? 'bg-white text-red-700 border-red-200'
            : isWarning
            ? 'bg-white text-amber-700 border-amber-200'
            : 'bg-white text-emerald-700 border-emerald-200'
        }`}>
          {qualityStatus}
        </span>
      </div>

      <p className="text-[11px] text-stone-700 pl-6 leading-relaxed">
        {qualityMessage}
      </p>

      {heuristicMessage && (
        <div className="pl-6 pt-1 border-t border-coffee-200/60 text-[10px] font-mono text-stone-500">
          <span className="text-coffee-700 font-semibold">Type Check: </span>
          {heuristicMessage}
        </div>
      )}
    </div>
  );
}
