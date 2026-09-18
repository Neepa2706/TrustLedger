import React from 'react';
import { Eye, CheckCircle2, AlertTriangle, ShieldCheck, AlertOctagon, HelpCircle } from 'lucide-react';

export default function VisualAnalysisPanel({
  visualSignals = {},
  riskScore = 87,
  recommendedAction = 'Review original source document before making a lending decision.'
}) {
  const metrics = [
    { label: 'Layout Consistency', value: visualSignals.layout_consistency ?? 68 },
    { label: 'Font Baseline Match', value: visualSignals.font_consistency ?? 42 },
    { label: 'OCR Alignment Pass', value: visualSignals.ocr_consistency ?? 55 }
  ];

  const isHighRisk = riskScore > 65;

  const getColor = (val) => {
    if (val < 50) return 'bg-red-500 text-red-400';
    if (val < 75) return 'bg-amber-400 text-amber-400';
    return 'bg-emerald-400 text-emerald-400';
  };

  return (
    <div className="space-y-4 font-mono text-xs">
      {/* Visual Metrics Container */}
      <div className="rounded-xl border border-surface-border bg-surface-card/80 p-5 backdrop-blur-sm">
        <div className="flex items-center justify-between pb-3 border-b border-surface-border mb-4">
          <div>
            <h3 className="text-sm font-semibold text-white tracking-wide">
              Visual & Structural Signals
            </h3>
            <p className="text-xs text-slate-400">
              Prototype heuristic scan across text layout and embedded graphics
            </p>
          </div>
          <span className="text-[10px] text-cyan-400 bg-cyan-950/60 px-2 py-0.5 rounded border border-cyan-500/30">
            PROTOTYPE SCAN
          </span>
        </div>

        <div className="space-y-3">
          {metrics.map((m, idx) => {
            const color = getColor(m.value);
            return (
              <div key={idx} className="space-y-1">
                <div className="flex justify-between text-slate-300">
                  <span>{m.label}</span>
                  <span className="font-bold">{m.value}%</span>
                </div>
                <div className="w-full h-1.5 rounded-full bg-midnight-950 overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all duration-700 ${color.split(' ')[0]}`}
                    style={{ width: `${m.value}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>

        <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between text-[11px] text-slate-400">
          <span>Image Regions Analyzed: <span className="text-white font-bold">{visualSignals.image_regions_analyzed || 4}</span></span>
          <span>Suspicious Flags: <span className={isHighRisk ? 'text-red-400 font-bold' : 'text-emerald-400 font-bold'}>{visualSignals.suspicious_regions || (isHighRisk ? 1 : 0)}</span></span>
        </div>
      </div>

      {/* Recommended Action Summary Card */}
      <div className={`rounded-xl border p-5 backdrop-blur-sm ${
        isHighRisk
          ? 'border-red-500/40 bg-red-950/20 text-red-200'
          : 'border-emerald-500/40 bg-emerald-950/20 text-emerald-200'
      }`}>
        <div className="flex items-start gap-3">
          {isHighRisk ? (
            <AlertOctagon className="h-5 w-5 text-red-400 shrink-0 mt-0.5" />
          ) : (
            <ShieldCheck className="h-5 w-5 text-emerald-400 shrink-0 mt-0.5" />
          )}
          <div className="space-y-1">
            <h4 className="font-bold text-white text-xs">
              {isHighRisk ? 'Analysis Summary: Underwriter Review Advised' : 'Analysis Summary: Low Risk'}
            </h4>
            <p className="text-[11px] text-slate-300 leading-relaxed">
              {recommendedAction}
            </p>
            <div className="pt-2 text-[10px] text-slate-400 font-normal">
              Note: This AI-assisted signal is indicative and does not constitute conclusive legal determination of fraud.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
