import React from 'react';
import { AlertOctagon, AlertTriangle, Info, CheckCircle2, ChevronRight, FileCode2 } from 'lucide-react';

export default function ForensicFindingsList({
  findings = [],
  selectedFinding,
  onSelectFinding
}) {
  const getSeverityBadge = (severity) => {
    const s = String(severity).toLowerCase();
    if (s === 'high' || s === 'critical') {
      return (
        <span className="text-[10px] font-mono font-bold uppercase px-2 py-0.5 rounded bg-red-50 text-red-700 border border-red-200">
          HIGH SEVERITY
        </span>
      );
    }
    if (s === 'medium') {
      return (
        <span className="text-[10px] font-mono font-bold uppercase px-2 py-0.5 rounded bg-amber-50 text-amber-700 border border-amber-200">
          MEDIUM
        </span>
      );
    }
    return (
      <span className="text-[10px] font-mono font-bold uppercase px-2 py-0.5 rounded bg-stone-100 text-stone-700 border border-stone-200">
        LOW
      </span>
    );
  };

  const getIcon = (type, severity) => {
    if (severity === 'high') return AlertOctagon;
    if (severity === 'medium') return AlertTriangle;
    return Info;
  };

  return (
    <div className="rounded-xl border border-coffee-200 bg-white p-5 shadow-sm">
      <div className="flex items-center justify-between pb-3 border-b border-coffee-200 mb-4">
        <div>
          <h3 className="text-sm font-semibold text-espresso tracking-wide">
            Forensic Findings
          </h3>
          <p className="text-xs text-stone-500">
            Detected structural and metadata anomalies across evidence pages
          </p>
        </div>
        <span className="text-xs font-mono font-semibold text-coffee-700">
          {findings.length} Signals
        </span>
      </div>

      {findings.length === 0 ? (
        <div className="p-6 text-center rounded-lg border border-emerald-200 bg-emerald-50 text-emerald-800">
          <CheckCircle2 className="h-6 w-6 text-emerald-600 mx-auto mb-2" />
          <span className="text-xs font-semibold block">Zero Forensic Anomalies Detected</span>
          <span className="text-[11px] text-stone-600 mt-0.5 block">Document structure, fonts, and metadata align with expected banking baselines.</span>
        </div>
      ) : (
        <div className="space-y-3">
          {findings.map((f, idx) => {
            const Icon = getIcon(f.type, f.severity);
            const isSelected = selectedFinding?.id === f.id;

            return (
              <div
                key={f.id || idx}
                onClick={() => onSelectFinding && onSelectFinding(f)}
                className={`cursor-pointer rounded-lg border p-3.5 transition-all text-xs ${
                  isSelected
                    ? 'border-coffee-500 bg-coffee-50/50 shadow-sm ring-1 ring-coffee-400/40'
                    : 'border-coffee-200 bg-warm-50/50 hover:border-coffee-300 hover:bg-warm-50'
                }`}
              >
                <div className="flex items-start justify-between gap-2 mb-1.5">
                  <div className="flex items-center gap-2">
                    <Icon className={`h-4 w-4 shrink-0 ${f.severity === 'high' ? 'text-red-600' : 'text-amber-600'}`} />
                    <span className="font-semibold text-espresso">
                      {f.title}
                    </span>
                  </div>
                  {getSeverityBadge(f.severity)}
                </div>

                <p className="text-stone-600 leading-relaxed pl-6 text-[11px]">
                  {f.description}
                </p>

                <div className="mt-2.5 pl-6 flex items-center justify-between border-t border-coffee-200 pt-2 text-[10px] font-mono text-stone-500">
                  <span>Location: <span className="text-espresso font-semibold">{f.location || 'Document Body'}</span></span>
                  <span className="text-coffee-700 hover:text-coffee-800 hover:underline flex items-center gap-0.5 font-medium">
                    {f.bbox ? 'Highlight Region' : 'Details'} <ChevronRight className="h-3 w-3" />
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
