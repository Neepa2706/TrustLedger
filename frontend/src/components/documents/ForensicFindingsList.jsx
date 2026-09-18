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
        <span className="text-[10px] font-mono font-bold uppercase px-2 py-0.5 rounded bg-red-950 text-red-300 border border-red-500/40">
          HIGH SEVERITY
        </span>
      );
    }
    if (s === 'medium') {
      return (
        <span className="text-[10px] font-mono font-bold uppercase px-2 py-0.5 rounded bg-amber-950 text-amber-300 border border-amber-500/40">
          MEDIUM
        </span>
      );
    }
    return (
      <span className="text-[10px] font-mono font-bold uppercase px-2 py-0.5 rounded bg-slate-900 text-slate-300 border border-slate-700/50">
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
    <div className="rounded-xl border border-surface-border bg-surface-card/80 p-5 backdrop-blur-sm">
      <div className="flex items-center justify-between pb-3 border-b border-surface-border mb-4">
        <div>
          <h3 className="text-sm font-semibold text-white tracking-wide">
            Forensic Findings
          </h3>
          <p className="text-xs text-slate-400">
            Detected structural and metadata anomalies across evidence pages
          </p>
        </div>
        <span className="text-xs font-mono text-cyan-400">
          {findings.length} Signals
        </span>
      </div>

      {findings.length === 0 ? (
        <div className="p-6 text-center rounded-lg border border-emerald-500/30 bg-emerald-950/20 text-emerald-200">
          <CheckCircle2 className="h-6 w-6 text-emerald-400 mx-auto mb-2" />
          <span className="text-xs font-semibold block">Zero Forensic Anomalies Detected</span>
          <span className="text-[11px] text-slate-400 mt-0.5 block">Document structure, fonts, and metadata align with expected banking baselines.</span>
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
                    ? 'border-cyan-400 bg-midnight-900 shadow-[0_0_15px_rgba(0,240,255,0.15)]'
                    : 'border-surface-border bg-midnight-900/50 hover:border-slate-600 hover:bg-midnight-900'
                }`}
              >
                <div className="flex items-start justify-between gap-2 mb-1.5">
                  <div className="flex items-center gap-2">
                    <Icon className={`h-4 w-4 shrink-0 ${f.severity === 'high' ? 'text-red-400' : 'text-amber-400'}`} />
                    <span className="font-semibold text-white">
                      {f.title}
                    </span>
                  </div>
                  {getSeverityBadge(f.severity)}
                </div>

                <p className="text-slate-300 leading-relaxed pl-6 text-[11px]">
                  {f.description}
                </p>

                <div className="mt-2.5 pl-6 flex items-center justify-between border-t border-slate-800/80 pt-2 text-[10px] font-mono text-slate-400">
                  <span>Location: <span className="text-cyan-300">{f.location || 'Document Body'}</span></span>
                  <span className="text-cyan-400 hover:underline flex items-center gap-0.5">
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
